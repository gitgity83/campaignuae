
import { Card, CardContent } from "@/components/ui/card";

interface Survey {
  id: string;
  status: 'draft' | 'active' | 'closed' | 'completed';
  responses: number;
}

interface SurveyStatsProps {
  surveys: Survey[];
}

export function SurveyStats({ surveys }: SurveyStatsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-4">
          <div className="text-2xl font-bold text-green-600">
            {surveys.filter(s => s.status === 'active').length}
          </div>
          <p className="text-sm text-gray-600">Active</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="text-2xl font-bold text-yellow-600">
            {surveys.filter(s => s.status === 'draft').length}
          </div>
          <p className="text-sm text-gray-600">Draft</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="text-2xl font-bold text-blue-600">
            {surveys.filter(s => s.status === 'completed').length}
          </div>
          <p className="text-sm text-gray-600">Completed</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="text-2xl font-bold">
            {surveys.reduce((sum, s) => sum + s.responses, 0)}
          </div>
          <p className="text-sm text-gray-600">Total Responses</p>
        </CardContent>
      </Card>
    </div>
  );
}
