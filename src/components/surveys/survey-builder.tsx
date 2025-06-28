
import { useState } from "react";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { SurveyBuilderDetails } from "./survey-builder-details";
import { QuestionEditor } from "./question-editor";

interface SurveyQuestion {
  id: string;
  type: 'text' | 'multiple_choice' | 'rating' | 'yes_no' | 'demographic';
  question: string;
  required: boolean;
  options?: string[];
  ratingScale?: number;
}

interface SurveyBuilderProps {
  onSave: (survey: { title: string; description: string; questions: SurveyQuestion[]; targetResponses: number }) => void;
  onCancel: () => void;
  initialData?: {
    title: string;
    description: string;
    questions: SurveyQuestion[];
    targetResponses: number;
  };
}

export function SurveyBuilder({ onSave, onCancel, initialData }: SurveyBuilderProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [targetResponses, setTargetResponses] = useState(initialData?.targetResponses || 100);
  const [questions, setQuestions] = useState<SurveyQuestion[]>(initialData?.questions || []);

  const addQuestion = (type: SurveyQuestion['type']) => {
    const newQuestion: SurveyQuestion = {
      id: Date.now().toString(),
      type,
      question: '',
      required: false,
      options: type === 'multiple_choice' ? ['Option 1', 'Option 2'] : undefined,
      ratingScale: type === 'rating' ? 5 : undefined,
    };
    setQuestions([...questions, newQuestion]);
  };

  const updateQuestion = (id: string, updates: Partial<SurveyQuestion>) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, ...updates } : q));
  };

  const removeQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const addOption = (questionId: string) => {
    const question = questions.find(q => q.id === questionId);
    if (question && question.options) {
      updateQuestion(questionId, {
        options: [...question.options, `Option ${question.options.length + 1}`]
      });
    }
  };

  const updateOption = (questionId: string, optionIndex: number, value: string) => {
    const question = questions.find(q => q.id === questionId);
    if (question && question.options) {
      const newOptions = [...question.options];
      newOptions[optionIndex] = value;
      updateQuestion(questionId, { options: newOptions });
    }
  };

  const removeOption = (questionId: string, optionIndex: number) => {
    const question = questions.find(q => q.id === questionId);
    if (question && question.options && question.options.length > 2) {
      const newOptions = question.options.filter((_, index) => index !== optionIndex);
      updateQuestion(questionId, { options: newOptions });
    }
  };

  const handleSave = () => {
    if (!title.trim()) {
      toast({ title: "Error", description: "Survey title is required", variant: "destructive" });
      return;
    }
    if (questions.length === 0) {
      toast({ title: "Error", description: "At least one question is required", variant: "destructive" });
      return;
    }
    if (questions.some(q => !q.question.trim())) {
      toast({ title: "Error", description: "All questions must have text", variant: "destructive" });
      return;
    }

    onSave({ title, description, questions, targetResponses });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Survey Builder</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
          <Button onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Save Survey
          </Button>
        </div>
      </div>

      <SurveyBuilderDetails
        title={title}
        description={description}
        targetResponses={targetResponses}
        onTitleChange={setTitle}
        onDescriptionChange={setDescription}
        onTargetResponsesChange={setTargetResponses}
      />

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Questions</h3>
          <Select onValueChange={(value) => addQuestion(value as SurveyQuestion['type'])}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Add question" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="text">Text Input</SelectItem>
              <SelectItem value="multiple_choice">Multiple Choice</SelectItem>
              <SelectItem value="rating">Rating Scale</SelectItem>
              <SelectItem value="yes_no">Yes/No</SelectItem>
              <SelectItem value="demographic">Demographic</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {questions.map((question, index) => (
          <QuestionEditor
            key={question.id}
            question={question}
            index={index}
            onUpdate={(updates) => updateQuestion(question.id, updates)}
            onRemove={() => removeQuestion(question.id)}
            onAddOption={() => addOption(question.id)}
            onUpdateOption={(optionIndex, value) => updateOption(question.id, optionIndex, value)}
            onRemoveOption={(optionIndex) => removeOption(question.id, optionIndex)}
          />
        ))}

        {questions.length === 0 && (
          <Card className="border-dashed">
            <CardContent className="py-8 text-center">
              <p className="text-gray-500">No questions added yet. Use the dropdown above to add your first question.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
