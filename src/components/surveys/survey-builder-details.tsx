
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SurveyBuilderDetailsProps {
  title: string;
  description: string;
  targetResponses: number;
  onTitleChange: (title: string) => void;
  onDescriptionChange: (description: string) => void;
  onTargetResponsesChange: (target: number) => void;
}

export function SurveyBuilderDetails({
  title,
  description,
  targetResponses,
  onTitleChange,
  onDescriptionChange,
  onTargetResponsesChange
}: SurveyBuilderDetailsProps) {
  return (
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
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="Enter survey title"
          />
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            placeholder="Describe the purpose of this survey"
          />
        </div>
        <div>
          <Label htmlFor="target">Target Responses</Label>
          <Input
            id="target"
            type="number"
            value={targetResponses}
            onChange={(e) => onTargetResponsesChange(Number(e.target.value))}
            placeholder="100"
          />
        </div>
      </CardContent>
    </Card>
  );
}
