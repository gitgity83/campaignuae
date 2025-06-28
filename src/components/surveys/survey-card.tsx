
import { BarChart3, Users, Calendar, Edit, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";

interface Survey {
  id: string;
  title: string;
  description: string;
  campaignName: string;
  status: 'draft' | 'active' | 'closed' | 'completed';
  responses: number;
  targetResponses: number;
  questions: number;
  createdAt: string;
  endDate: string;
  createdBy: string;
}

interface SurveyCardProps {
  survey: Survey;
  userRole: string;
  onTakeSurvey: (surveyId: string) => void;
  onViewResults: (surveyId: string) => void;
  onEditSurvey: (surveyId: string) => void;
}

const getStatusColor = (status: Survey['status']) => {
  switch (status) {
    case 'active': return 'success';
    case 'completed': return 'info';
    case 'closed': return 'warning';
    case 'draft': return 'danger';
    default: return 'info';
  }
};

export function SurveyCard({ 
  survey, 
  userRole, 
  onTakeSurvey, 
  onViewResults, 
  onEditSurvey 
}: SurveyCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start mb-2">
          <CardTitle className="text-lg">{survey.title}</CardTitle>
          <StatusBadge status={getStatusColor(survey.status)}>
            {survey.status}
          </StatusBadge>
        </div>
        <p className="text-gray-600 text-sm">{survey.description}</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-sm">
            <div className="font-medium text-gray-700">Campaign</div>
            <div className="text-gray-600">{survey.campaignName}</div>
          </div>

          {survey.status === 'active' && (
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Responses</span>
                <span>{survey.responses}/{survey.targetResponses}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min((survey.responses / survey.targetResponses) * 100, 100)}%` }}
                />
              </div>
            </div>
          )}

          <div className="flex justify-between items-center text-sm text-gray-600">
            <div className="flex items-center">
              <BarChart3 className="w-4 h-4 mr-1" />
              <span>{survey.questions} questions</span>
            </div>
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-1" />
              <span>{survey.responses}</span>
            </div>
          </div>

          <div className="text-xs text-gray-500">
            <div className="flex items-center">
              <Calendar className="w-3 h-3 mr-1" />
              Ends: {new Date(survey.endDate).toLocaleDateString()}
            </div>
            <div className="mt-1">
              Created by: {survey.createdBy}
            </div>
          </div>

          <div className="pt-2">
            {userRole === 'volunteer' ? (
              <Button 
                size="sm" 
                className="w-full" 
                disabled={survey.status !== 'active'}
                onClick={() => onTakeSurvey(survey.id)}
              >
                {survey.status === 'active' ? 'Take Survey' : 'Not Available'}
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => onViewResults(survey.id)}
                >
                  <Eye className="w-4 h-4 mr-1" />
                  Results
                </Button>
                <Button 
                  size="sm" 
                  className="flex-1"
                  onClick={() => onEditSurvey(survey.id)}
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
