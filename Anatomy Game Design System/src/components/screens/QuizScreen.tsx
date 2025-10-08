import { useState, useEffect } from 'react';
import { ArrowLeft, Timer, Heart } from 'lucide-react';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { QuizQuestion } from '../QuizQuestion';
import { mockQuestions } from '../../lib/mock-data';

interface QuizScreenProps {
  mode: 'sprint' | 'campaign' | 'osce' | 'srs';
  onExit: () => void;
}

export function QuizScreen({ mode, onExit }: QuizScreenProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(mode === 'sprint' ? 60 : null);
  const [showResults, setShowResults] = useState(false);
  const [hearts, setHearts] = useState(3);

  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return;
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === null || prev <= 0) return 0;
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  useEffect(() => {
    if (timeLeft === 0) {
      setShowResults(true);
    }
  }, [timeLeft]);

  const handleAnswer = (correct: boolean) => {
    if (correct) {
      setScore(score + 1);
    } else {
      setHearts(hearts - 1);
    }

    if (currentQuestion < mockQuestions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1);
      }, 2000);
    } else {
      setTimeout(() => {
        setShowResults(true);
      }, 2000);
    }
  };

  const getModeTitle = () => {
    switch (mode) {
      case 'sprint': return 'Sprint de Identificação';
      case 'campaign': return 'Campanha - Osteologia';
      case 'osce': return 'OSCE - Estação Clínica';
      case 'srs': return 'Revisão Inteligente';
      default: return 'Quiz';
    }
  };

  if (showResults) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary/5 to-primary/10">
        <div className="max-w-md w-full bg-card rounded-2xl p-8 text-center space-y-6">
          <div className="text-6xl">🎉</div>
          <h2>Parabéns!</h2>
          <div className="space-y-2">
            <p className="text-4xl">{score}/{mockQuestions.length}</p>
            <p className="text-muted-foreground">Questões corretas</p>
          </div>
          <div className="space-y-2">
            <p className="text-2xl text-primary">+{score * 50} XP</p>
            <p className="text-sm text-muted-foreground">
              {score >= mockQuestions.length * 0.8 ? 'Desempenho excelente!' : 'Continue praticando!'}
            </p>
          </div>
          <div className="space-y-2">
            <Button className="w-full" onClick={onExit}>Voltar ao Início</Button>
            <Button variant="outline" className="w-full" onClick={() => window.location.reload()}>
              Jogar Novamente
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="max-w-3xl mx-auto p-4">
          <div className="flex items-center justify-between mb-4">
            <Button variant="ghost" size="icon" onClick={onExit}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h3>{getModeTitle()}</h3>
            <div className="w-10" />
          </div>

          <div className="flex items-center gap-4 mb-2">
            <Progress value={((currentQuestion + 1) / mockQuestions.length) * 100} className="flex-1" />
            <span className="text-sm text-muted-foreground whitespace-nowrap">
              {currentQuestion + 1}/{mockQuestions.length}
            </span>
          </div>

          <div className="flex items-center justify-between">
            {timeLeft !== null && (
              <div className="flex items-center gap-2 text-sm">
                <Timer className="w-4 h-4" />
                <span className={timeLeft < 10 ? 'text-red-500' : ''}>
                  {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                </span>
              </div>
            )}
            <div className="flex items-center gap-1">
              {Array.from({ length: hearts }).map((_, i) => (
                <Heart key={i} className="w-5 h-5 fill-red-500 text-red-500" />
              ))}
              {Array.from({ length: 3 - hearts }).map((_, i) => (
                <Heart key={`empty-${i}`} className="w-5 h-5 text-muted" />
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Question */}
      <main className="max-w-3xl mx-auto p-4 py-8">
        <QuizQuestion
          question={mockQuestions[currentQuestion]}
          onAnswer={handleAnswer}
          showExplanation={true}
        />
      </main>
    </div>
  );
}
