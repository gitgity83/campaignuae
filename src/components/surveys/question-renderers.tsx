
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";

interface SurveyQuestion {
  id: string;
  type: 'text' | 'multiple_choice' | 'rating' | 'yes_no' | 'demographic';
  question: string;
  required: boolean;
  options?: string[];
  ratingScale?: number;
}

interface QuestionRendererProps {
  question: SurveyQuestion;
  value: string | string[] | undefined;
  onChange: (value: string | string[]) => void;
}

export function TextQuestionRenderer({ value, onChange }: { value: string | string[] | undefined, onChange: (value: string) => void }) {
  return (
    <Textarea
      value={(value as string) || ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Enter your answer..."
      className="min-h-[100px]"
    />
  );
}

export function MultipleChoiceRenderer({ question, value, onChange }: QuestionRendererProps) {
  return (
    <div className="space-y-3">
      {question.options?.map((option, index) => (
        <div key={index} className="flex items-center space-x-2">
          <Checkbox
            id={`option-${index}`}
            checked={Array.isArray(value) && value.includes(option)}
            onCheckedChange={(checked) => {
              const currentAnswers = Array.isArray(value) ? value : [];
              if (checked) {
                onChange([...currentAnswers, option]);
              } else {
                onChange(currentAnswers.filter(a => a !== option));
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
}

export function RatingQuestionRenderer({ question, value, onChange }: QuestionRendererProps) {
  return (
    <RadioGroup
      value={(value as string) || ''}
      onValueChange={(val) => onChange(val)}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500">1 (Low)</span>
        <div className="flex gap-4">
          {Array.from({ length: question.ratingScale || 5 }, (_, i) => (
            <div key={i + 1} className="flex items-center space-x-2">
              <RadioGroupItem value={(i + 1).toString()} id={`rating-${i + 1}`} />
              <Label htmlFor={`rating-${i + 1}`}>{i + 1}</Label>
            </div>
          ))}
        </div>
        <span className="text-sm text-gray-500">{question.ratingScale || 5} (High)</span>
      </div>
    </RadioGroup>
  );
}

export function YesNoQuestionRenderer({ value, onChange }: { value: string | string[] | undefined, onChange: (value: string) => void }) {
  return (
    <RadioGroup
      value={(value as string) || ''}
      onValueChange={onChange}
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
}

export function DemographicQuestionRenderer({ value, onChange }: { value: string | string[] | undefined, onChange: (value: string) => void }) {
  return (
    <div>
      <Label htmlFor="age">Age Range</Label>
      <RadioGroup
        value={(value as string) || ''}
        onValueChange={onChange}
      >
        {['18-25', '26-35', '36-45', '46-55', '56-65', '65+'].map((age) => (
          <div key={age} className="flex items-center space-x-2">
            <RadioGroupItem value={age} id={age} />
            <Label htmlFor={age}>{age}</Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
}
