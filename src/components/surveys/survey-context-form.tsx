
import { MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface InterviewContext {
  location: string;
  intervieweeAge?: string;
  intervieweeGender?: string;
  notes?: string;
}

interface SurveyContextFormProps {
  context: InterviewContext;
  onContextChange: (context: InterviewContext) => void;
}

export function SurveyContextForm({ context, onContextChange }: SurveyContextFormProps) {
  const updateContext = (updates: Partial<InterviewContext>) => {
    onContextChange({ ...context, ...updates });
  };

  return (
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
            onChange={(e) => updateContext({ location: e.target.value })}
            placeholder="e.g., Main Street, Downtown Park, Community Center"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="age">Interviewee Age (optional)</Label>
            <Input
              id="age"
              value={context.intervieweeAge || ''}
              onChange={(e) => updateContext({ intervieweeAge: e.target.value })}
              placeholder="e.g., 25-30"
            />
          </div>
          <div>
            <Label htmlFor="gender">Interviewee Gender (optional)</Label>
            <Input
              id="gender"
              value={context.intervieweeGender || ''}
              onChange={(e) => updateContext({ intervieweeGender: e.target.value })}
              placeholder="e.g., Male, Female, Other"
            />
          </div>
        </div>
        <div>
          <Label htmlFor="notes">Notes (optional)</Label>
          <Textarea
            id="notes"
            value={context.notes || ''}
            onChange={(e) => updateContext({ notes: e.target.value })}
            placeholder="Any additional notes about the interview..."
          />
        </div>
      </CardContent>
    </Card>
  );
}
