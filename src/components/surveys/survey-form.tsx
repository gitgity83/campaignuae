
import { useState } from "react";
import { ArrowLeft, ArrowRight, Save, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/components/ui/use-toast";

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
  const progress = ((currentQuestionIndex + 1) / survey.questions.length) * 100;

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
    // Validate required questions
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
        return (
          <Textarea
            value={(response?.answer as string) || ''}
            onChange={(e) => updateResponse(currentQuestion.id, e.target.value)}
            placeholder="Enter your answer..."
            className="min-h-[100px]"
          />
        );

      case 'multiple_choice':
        return (
          <div className="space-y-3">
            {currentQuestion.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Checkbox
                  id={`option-${index}`}
                  checked={Array.isArray(response?.answer) && response.answer.includes(option)}
                  onCheckedChange={(checked) => {
                    const currentAnswers = Array.isArray(response?.answer) ? response.answer : [];
                    if (checked) {
                      updateResponse(currentQuestion.id, [...currentAnswers, option]);
                    } else {
                      updateResponse(currentQuestion.id, currentAnswers.filter(a => a !== option));
                    }
                  }}
                />
                <Label htmlFor={`option-${index}`} className="text-sm font-normal">
                  {option}
                </Label>
              </div>
            ))}
          </div>
        );

      case 'rating':
        return (
          <RadioGroup
            value={(response?.answer as string) || ''}
            onValueChange={(value) => updateResponse(currentQuestion.id, value)}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">1 (Low)</span>
              <div className="flex gap-4">
                {Array.from({ length: currentQuestion.ratingScale || 5 }, (_, i) => (
                  <div key={i + 1} className="flex items-center space-x-2">
                    <RadioGroupItem value={(i + 1).toString()} id={`rating-${i + 1}`} />
                    <Label htmlFor={`rating-${i + 1}`}>{i + 1}</Label>
                  </div>
                ))}
              </div>
              <span className="text-sm text-gray-500">{currentQuestion.ratingScale || 5} (High)</span>
            </div>
          </RadioGroup>
        );

      case 'yes_no':
        return (
          <RadioGroup
            value={(response?.answer as string) || ''}
            onValueChange={(value) => updateResponse(currentQuestion.id, value)}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="yes" />
              <Label htmlFor="yes">Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="no" />
              <Label htmlFor="no">No</Label>
            </div>
          </RadioGroup>
        );

      case 'demographic':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="age">Age Range</Label>
              <RadioGroup
                value={(response?.answer as string) || ''}
                onValueChange={(value) => updateResponse(currentQuestion.id, value)}
              >
                {['18-25', '26-35', '36-45', '46-55', '56-65', '65+'].map((age) => (
                  <div key={age} className="flex items-center space-x-2">
                    <RadioGroupItem value={age} id={age} />
                    <Label htmlFor={age}>{age}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">{survey.title}</h1>
        <p className="text-gray-600 mb-4">{survey.description}</p>
        <Progress value={progress} className="w-full" />
        <p className="text-sm text-gray-500 mt-2">
          Question {currentQuestionIndex + 1} of {survey.questions.length}
        </p>
      </div>

      {/* Interview Context */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Interview Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="location">Interview Location *</Label>
            <Input
              id="location"
              value={context.location}
              onChange={(e) => setContext(prev => ({ ...prev, location: e.target.value }))}
              placeholder="e.g., Main Street, Downtown Park, Community Center"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="age">Interviewee Age (optional)</Label>
              <Input
                id="age"
                value={context.intervieweeAge || ''}
                onChange={(e) => setContext(prev => ({ ...prev, intervieweeAge: e.target.value }))}
                placeholder="e.g., 25-30"
              />
            </div>
            <div>
              <Label htmlFor="gender">Interviewee Gender (optional)</Label>
              <Input
                id="gender"
                value={context.intervieweeGender || ''}
                onChange={(e) => setContext(prev => ({ ...prev, intervieweeGender: e.target.value }))}
                placeholder="e.g., Male, Female, Other"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea
              id="notes"
              value={context.notes || ''}
              onChange={(e) => setContext(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Any additional notes about the interview..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Current Question */}
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

      {/* Navigation */}
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
