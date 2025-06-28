
import { useState } from "react";
import { ArrowLeft, ArrowRight, Save, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { SurveyProgressHeader } from "./survey-progress-header";
import { SurveyContextForm } from "./survey-context-form";
import {
  TextQuestionRenderer,
  MultipleChoiceRenderer,
  RatingQuestionRenderer,
  YesNoQuestionRenderer,
  DemographicQuestionRenderer
} from "./question-renderers";

interface SurveyQuestion {
  id: string;
  type: 'text' | 'multiple_choice' | 'rating' | 'yes_no' | 'demographic';
  question: string;
  required: boolean;
  options?: string[];
  ratingScale?: number;
}

interface Survey {
  id: string;
  title: string;
  description: string;
  questions: SurveyQuestion[];
  targetResponses: number;
}

interface SurveyResponse {
  questionId: string;
  answer: string | string[];
}

interface InterviewContext {
  location: string;
  intervieweeAge?: string;
  intervieweeGender?: string;
  notes?: string;
}

interface SurveyFormProps {
  survey: Survey;
  onSubmit: (responses: SurveyResponse[], context: InterviewContext) => void;
  onSaveDraft: (responses: SurveyResponse[], context: InterviewContext) => void;
  onCancel: () => void;
  initialResponses?: SurveyResponse[];
  initialContext?: InterviewContext;
}

export function SurveyForm({ 
  survey, 
  onSubmit, 
  onSaveDraft, 
  onCancel, 
  initialResponses = [],
  initialContext = { location: '' }
}: SurveyFormProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<SurveyResponse[]>(initialResponses);
  const [context, setContext] = useState<InterviewContext>(initialContext);

  const currentQuestion = survey.questions[currentQuestionIndex];

  const getResponse = (questionId: string) => {
    return responses.find(r => r.questionId === questionId);
  };

  const updateResponse = (questionId: string, answer: string | string[]) => {
    setResponses(prev => {
      const existing = prev.find(r => r.questionId === questionId);
      if (existing) {
        return prev.map(r => r.questionId === questionId ? { ...r, answer } : r);
      }
      return [...prev, { questionId, answer }];
    });
  };

  const isCurrentQuestionAnswered = () => {
    const response = getResponse(currentQuestion.id);
    if (!currentQuestion.required) return true;
    if (!response) return false;
    
    if (Array.isArray(response.answer)) {
      return response.answer.length > 0;
    }
    return response.answer.trim() !== '';
  };

  const handleNext = () => {
    if (currentQuestionIndex < survey.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
    const unansweredRequired = survey.questions.filter(q => {
      if (!q.required) return false;
      const response = getResponse(q.id);
      if (!response) return true;
      if (Array.isArray(response.answer)) {
        return response.answer.length === 0;
      }
      return response.answer.trim() === '';
    });

    if (unansweredRequired.length > 0) {
      toast({
        title: "Missing Required Answers",
        description: `Please answer all required questions before submitting.`,
        variant: "destructive"
      });
      return;
    }

    if (!context.location.trim()) {
      toast({
        title: "Location Required",
        description: "Please specify the interview location.",
        variant: "destructive"
      });
      return;
    }

    onSubmit(responses, context);
  };

  const renderQuestion = () => {
    const response = getResponse(currentQuestion.id);

    switch (currentQuestion.type) {
      case 'text':
        return <TextQuestionRenderer 
          value={response?.answer} 
          onChange={(value) => updateResponse(currentQuestion.id, value)} 
        />;
      case 'multiple_choice':
        return <MultipleChoiceRenderer 
          question={currentQuestion}
          value={response?.answer}
          onChange={(value) => updateResponse(currentQuestion.id, value)}
        />;
      case 'rating':
        return <RatingQuestionRenderer 
          question={currentQuestion}
          value={response?.answer}
          onChange={(value) => updateResponse(currentQuestion.id, value)}
        />;
      case 'yes_no':
        return <YesNoQuestionRenderer 
          value={response?.answer}
          onChange={(value) => updateResponse(currentQuestion.id, value)}
        />;
      case 'demographic':
        return <DemographicQuestionRenderer 
          value={response?.answer}
          onChange={(value) => updateResponse(currentQuestion.id, value)}
        />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <SurveyProgressHeader
        title={survey.title}
        description={survey.description}
        currentQuestion={currentQuestionIndex}
        totalQuestions={survey.questions.length}
      />

      <SurveyContextForm
        context={context}
        onContextChange={setContext}
      />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>
              {currentQuestion.question}
              {currentQuestion.required && <span className="text-red-500 ml-1">*</span>}
            </span>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Clock className="w-4 h-4" />
              {new Date().toLocaleTimeString()}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {renderQuestion()}
        </CardContent>
      </Card>

      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => onSaveDraft(responses, context)}
          >
            <Save className="w-4 h-4 mr-2" />
            Save Draft
          </Button>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>

        {currentQuestionIndex < survey.questions.length - 1 ? (
          <Button
            onClick={handleNext}
            disabled={!isCurrentQuestionAnswered()}
          >
            Next
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        ) : (
          <Button onClick={handleSubmit}>
            Submit Survey
          </Button>
        )}
      </div>
    </div>
  );
}
