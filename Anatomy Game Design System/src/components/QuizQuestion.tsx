import { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Check, X, Lightbulb } from 'lucide-react';
import { Question } from '../lib/mock-data';

interface QuizQuestionProps {
  question: Question;
  onAnswer: (correct: boolean) => void;
  showExplanation?: boolean;
}

export function QuizQuestion({ question, onAnswer, showExplanation = false }: QuizQuestionProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const handleAnswer = (index: number) => {
    if (isAnswered) return;
    
    setSelectedAnswer(index);
    setIsAnswered(true);
    const correct = index === question.correctAnswer;
    setTimeout(() => onAnswer(correct), 1500);
  };

  const getButtonStyle = (index: number) => {
    if (!isAnswered) return 'bg-card hover:bg-accent border-2 border-border';
    if (index === question.correctAnswer) return 'bg-green-100 dark:bg-green-900/30 border-2 border-green-500';
    if (index === selectedAnswer && index !== question.correctAnswer) {
      return 'bg-red-100 dark:bg-red-900/30 border-2 border-red-500';
    }
    return 'bg-card border-2 border-border opacity-50';
  };

  return (
    <div className="space-y-6">
      {/* Question Stem */}
      <Card className="p-6">
        <h3 className="mb-4">{question.stem}</h3>
        
        {/* Mock Image Placeholder */}
        <div className="w-full h-48 bg-muted rounded-lg flex items-center justify-center mb-4">
          <span className="text-muted-foreground">Imagem Anatômica</span>
        </div>
      </Card>

      {/* Options */}
      <div className="space-y-3">
        {question.options?.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswer(index)}
            disabled={isAnswered}
            className={`w-full p-4 rounded-lg text-left transition-all ${getButtonStyle(index)} relative overflow-hidden`}
          >
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                {String.fromCharCode(65 + index)}
              </span>
              <span className="flex-1">{option}</span>
              {isAnswered && index === question.correctAnswer && (
                <Check className="w-5 h-5 text-green-600" />
              )}
              {isAnswered && index === selectedAnswer && index !== question.correctAnswer && (
                <X className="w-5 h-5 text-red-600" />
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Hint Button */}
      {!isAnswered && (
        <Button
          variant="outline"
          onClick={() => setShowHint(!showHint)}
          className="w-full"
        >
          <Lightbulb className="w-4 h-4 mr-2" />
          {showHint ? 'Ocultar Dica' : 'Mostrar Dica (25 XP)'}
        </Button>
      )}

      {/* Explanation */}
      {isAnswered && showExplanation && (
        <Card className="p-4 bg-primary/5 border-primary/20">
          <h4 className="mb-2 flex items-center gap-2">
            <Check className="w-5 h-5 text-green-600" />
            Explicação
          </h4>
          <div className="space-y-2 text-sm">
            <p><strong>Função:</strong> {question.explanation.function}</p>
            {question.explanation.innervation && (
              <p><strong>Inervação:</strong> {question.explanation.innervation}</p>
            )}
            {question.explanation.vascularization && (
              <p><strong>Vascularização:</strong> {question.explanation.vascularization}</p>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}
