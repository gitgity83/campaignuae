
import { useState } from "react";
import { Plus, Trash2, GripVertical, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/components/ui/use-toast";

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

      <Card>
        <CardHeader>
          <CardTitle>Survey Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">Survey Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter survey title"
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the purpose of this survey"
            />
          </div>
          <div>
            <Label htmlFor="target">Target Responses</Label>
            <Input
              id="target"
              type="number"
              value={targetResponses}
              onChange={(e) => setTargetResponses(Number(e.target.value))}
              placeholder="100"
            />
          </div>
        </CardContent>
      </Card>

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
          <Card key={question.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <GripVertical className="w-4 h-4 text-gray-400" />
                  <span className="font-medium">Question {index + 1}</span>
                  <span className="text-sm text-gray-500 capitalize">({question.type.replace('_', ' ')})</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeQuestion(question.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Question Text</Label>
                <Input
                  value={question.question}
                  onChange={(e) => updateQuestion(question.id, { question: e.target.value })}
                  placeholder="Enter your question"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`required-${question.id}`}
                  checked={question.required}
                  onCheckedChange={(checked) => updateQuestion(question.id, { required: checked as boolean })}
                />
                <Label htmlFor={`required-${question.id}`}>Required</Label>
              </div>

              {question.type === 'multiple_choice' && (
                <div>
                  <Label>Options</Label>
                  <div className="space-y-2">
                    {question.options?.map((option, optionIndex) => (
                      <div key={optionIndex} className="flex items-center gap-2">
                        <Input
                          value={option}
                          onChange={(e) => updateOption(question.id, optionIndex, e.target.value)}
                          placeholder={`Option ${optionIndex + 1}`}
                        />
                        {question.options && question.options.length > 2 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeOption(question.id, optionIndex)}
                            className="text-red-500"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => addOption(question.id)}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Option
                    </Button>
                  </div>
                </div>
              )}

              {question.type === 'rating' && (
                <div>
                  <Label>Rating Scale (1 to)</Label>
                  <Select
                    value={question.ratingScale?.toString()}
                    onValueChange={(value) => updateQuestion(question.id, { ratingScale: Number(value) })}
                  >
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="10">10</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </CardContent>
          </Card>
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
