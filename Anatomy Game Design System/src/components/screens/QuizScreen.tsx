import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Timer } from 'lucide-react';

import { Button } from '../ui/button';

import { apiHelpers } from '../../context/AuthContext';
import { QuizQuestion as QuizQuestionType, QuizSession } from '../../lib/api-types';
import { Progress } from '../ui/progress';
import { QuizQuestion } from '../QuizQuestion';

interface QuizScreenProps {
  mode: 'sprint' | 'campaign' | 'osce' | 'srs';
  token: string;
  sessionCache: { current: QuizSession | null };
  onExit: () => void;
}

export function QuizScreen({ mode, token, sessionCache, onExit }: QuizScreenProps) {
  const [session, setSession] = useState<QuizSession | null>(sessionCache.current && sessionCache.current.mode === mode ? sessionCache.current : null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(mode === 'sprint' ? 60 : null);
  const [finished, setFinished] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!session) {
      setLoading(true);
      apiHelpers
        .startQuizSession(token, { mode, limit: 5 })
        .then((result) => {
          setSession(result);
          sessionCache.current = result;
          setStartTime(Date.now());
        })
        .catch((err) => {
          console.error(err);
          setError('Nao foi possivel iniciar o quiz');
        })
        .finally(() => setLoading(false));
    } else {
      setStartTime(Date.now());
    }
  }, [mode, session, sessionCache, token]);

  useEffect(() => {
    if (mode !== 'sprint' || !timeLeft || finished) {
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (!prev || prev <= 0) {
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [finished, mode, timeLeft]);

  useEffect(() => {
    if (mode === 'sprint' && timeLeft === 0 && !finished) {
      handleFinish();
    }
  }, [finished, mode, timeLeft]);

  const questions: QuizQuestionType[] = useMemo(() => session?.questions ?? [], [session]);

  const handleAnswer = async (optionId: string) => {
    const question = questions[questionIndex];
    if (!question) {
      return false;
    }
    try {
      const attempt = await apiHelpers.submitQuizAttempt(token, session!.id, {
        question_id: question.id,
        option_id: optionId,
      });
      if (attempt.is_correct) {
        setScore((value) => value + 1);
      }
      setTimeout(() => advanceQuestion(), 800);
      return attempt.is_correct;
    } catch (err) {
      console.error(err);
      setError('Erro ao registrar resposta');
      return false;
    }
  };

  const advanceQuestion = () => {
    if (questionIndex < questions.length - 1) {
      setQuestionIndex((value) => value + 1);
    } else {
      handleFinish();
    }
  };

  const handleFinish = async () => {
    if (finished || !session) {
      return;
    }
    setFinished(true);
    const durationSeconds = startTime ? Math.floor((Date.now() - startTime) / 1000) : 0;
    try {
      const updated = await apiHelpers.completeQuizSession(token, session.id, durationSeconds);
      sessionCache.current = updated;
    } catch (err) {
      console.error(err);
    }
  };

  const getModeTitle = () => {
    switch (mode) {
      case 'sprint':
        return 'Sprint de Identificacao';
      case 'campaign':
        return 'Campanha';
      case 'osce':
        return 'OSCE';
      case 'srs':
        return 'Revisao Inteligente';
      default:
        return 'Quiz';
    }
  };

  if (loading || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-muted-foreground">
        Carregando quiz...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-background">
        <p className="text-sm text-muted-foreground">{error}</p>
        <Button onClick={onExit}>Voltar</Button>
      </div>
    );
  }

  const currentQuestion = questions[questionIndex];

  if (finished || !currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary/5 to-primary/10">
        <div className="max-w-md w-full bg-card rounded-2xl p-8 text-center space-y-6">
          <h2 className="text-2xl font-semibold">Sessao concluida!</h2>
          <div className="space-y-1">
            <p className="text-4xl font-bold">{score}</p>
            <p className="text-sm text-muted-foreground">respostas corretas</p>
          </div>
          <div className="flex flex-col gap-2">
            <Button className="w-full" onClick={onExit}>
              Voltar ao inicio
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="max-w-3xl mx-auto p-4">
          <div className="flex items-center justify-between mb-4">
            <Button variant="ghost" size="icon" onClick={onExit}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h3 className="text-lg font-semibold">{getModeTitle()}</h3>
            <div className="w-8" />
          </div>

          <div className="flex items-center gap-4 mb-2">
            <Progress value={((questionIndex + 1) / questions.length) * 100} className="flex-1" />
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {questionIndex + 1}/{questions.length}
            </span>
          </div>

          {timeLeft !== null && (
            <div className="flex items-center gap-2 text-sm">
              <Timer className="w-4 h-4" />
              <span className={timeLeft < 10 ? 'text-red-500' : ''}>
                {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
              </span>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-3xl mx-auto p-4 py-8">
        <QuizQuestion question={currentQuestion} onAnswer={handleAnswer} />
      </main>
    </div>
  );
}
