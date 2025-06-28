
import { Progress } from "@/components/ui/progress";

interface SurveyProgressHeaderProps {
  title: string;
  description: string;
  currentQuestion: number;
  totalQuestions: number;
}

export function SurveyProgressHeader({ 
  title, 
  description, 
  currentQuestion, 
  totalQuestions 
}: SurveyProgressHeaderProps) {
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;

  return (
    <div className="text-center">
      <h1 className="text-2xl font-bold mb-2">{title}</h1>
      <p className="text-gray-600 mb-4">{description}</p>
      <Progress value={progress} className="w-full" />
      <p className="text-sm text-gray-500 mt-2">
        Question {currentQuestion + 1} of {totalQuestions}
      </p>
    </div>
  );
}
