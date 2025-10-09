import { useState } from 'react';

import { QuizQuestion as QuizQuestionType } from '../lib/api-types';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Check, X } from 'lucide-react';

interface QuizQuestionProps {
  question: QuizQuestionType;
  onAnswer: (optionId: string) => Promise<boolean>;
}

export function QuizQuestion({ question, onAnswer }: QuizQuestionProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleOptionClick = async (optionId: string) => {
    if (submitting || selectedOption) {
      return;
    }
    setSubmitting(true);
    setSelectedOption(optionId);
    try {
      const result = await onAnswer(optionId);
      setIsCorrect(result);
    } finally {
      setSubmitting(false);
    }
  };

  const getOptionStyle = (optionId: string) => {
    if (!selectedOption) {
      return 'bg-card border-2 border-border hover:bg-accent';
    }
    if (optionId === selectedOption) {
      return isCorrect ? 'bg-emerald-100/80 border-emerald-500' : 'bg-red-100/80 border-red-500';
    }
    return 'bg-card border-2 border-border opacity-60';
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-medium mb-3">{question.prompt}</h3>
        <p className="text-xs text-muted-foreground uppercase tracking-wide">
          {question.anatomy_system}  -  {question.difficulty}
        </p>
      </Card>

      <div className="space-y-3">
        {question.options.map((option, index) => (
          <button
            key={option.id}
            onClick={() => handleOptionClick(option.id)}
            disabled={!!selectedOption}
            className={`w-full p-4 rounded-lg text-left transition-all flex items-center gap-3 ${getOptionStyle(option.id)}`}
          >
            <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 font-semibold">
              {String.fromCharCode(65 + index)}
            </span>
            <span className="flex-1">{option.label}</span>
            {selectedOption === option.id && isCorrect === true && <Check className="w-5 h-5 text-emerald-600" />}
            {selectedOption === option.id && isCorrect === false && <X className="w-5 h-5 text-red-600" />}
          </button>
        ))}
      </div>

      {!selectedOption && (
        <Button variant="outline" className="w-full" disabled>
          Selecione uma alternativa
        </Button>
      )}
    </div>
  );
}
