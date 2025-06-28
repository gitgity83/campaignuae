
import { useState } from "react";
import { Plus, BarChart3, Users, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { SurveyBuilder } from "./survey-builder";
import { toast } from "@/components/ui/use-toast";

interface Survey {
  id: string;
  title: string;
  description: string;
  status: 'draft' | 'active' | 'closed' | 'completed';
  responses: number;
  targetResponses: number;
  questions: number;
  createdAt: string;
  endDate: string;
}

interface CampaignSurveysProps {
  campaignId: string;
  campaignName: string;
  canCreateSurvey: boolean;
  canManageSurveys: boolean;
}

export function CampaignSurveys({ 
  campaignId, 
  campaignName, 
  canCreateSurvey, 
  canManageSurveys 
}: CampaignSurveysProps) {
  const [surveys, setSurveys] = useState<Survey[]>([
    {
      id: '1',
      title: 'Community Needs Assessment',
      description: 'Understanding the primary needs and concerns of local residents',
      status: 'active',
      responses: 145,
      targetResponses: 500,
      questions: 5,
      createdAt: '2024-06-15',
      endDate: '2024-07-30',
    },
    {
      id: '2',
      title: 'Post-Event Feedback',
      description: 'Collecting feedback from community event attendees',
      status: 'draft',
      responses: 0,
      targetResponses: 300,
      questions: 10,
      createdAt: '2024-06-25',
      endDate: '2024-08-01',
    }
  ]);
  
  const [showSurveyBuilder, setShowSurveyBuilder] = useState(false);

  const handleCreateSurvey = () => {
    setShowSurveyBuilder(true);
  };

  const handleSaveSurvey = (surveyData: any) => {
    const newSurvey: Survey = {
      id: Date.now().toString(),
      title: surveyData.title,
      description: surveyData.description,
      status: 'draft',
      responses: 0,
      targetResponses: surveyData.targetResponses,
      questions: surveyData.questions.length,
      createdAt: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    };

    setSurveys([...surveys, newSurvey]);
    
    toast({
      title: "Survey Created",
      description: `Survey "${surveyData.title}" has been created for ${campaignName}.`
    });
    
    setShowSurveyBuilder(false);
  };

  const getStatusColor = (status: Survey['status']) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const totalResponses = surveys.reduce((sum, survey) => sum + survey.responses, 0);
  const activeSurveys = surveys.filter(s => s.status === 'active').length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Campaign Surveys</h3>
          <p className="text-gray-600 text-sm">
            Manage surveys for {campaignName}
          </p>
        </div>
        {canCreateSurvey && (
          <Button onClick={handleCreateSurvey}>
            <Plus className="w-4 h-4 mr-2" />
            Create Survey
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{surveys.length}</div>
                <p className="text-sm text-gray-600">Total Surveys</p>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-green-600">{activeSurveys}</div>
                <p className="text-sm text-gray-600">Active Surveys</p>
              </div>
              <Calendar className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-purple-600">{totalResponses}</div>
                <p className="text-sm text-gray-600">Total Responses</p>
              </div>
              <Users className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {surveys.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="py-8 text-center">
              <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">No surveys created yet for this campaign.</p>
              {canCreateSurvey && (
                <Button onClick={handleCreateSurvey}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Survey
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          surveys.map((survey) => (
            <Card key={survey.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{survey.title}</CardTitle>
                    <p className="text-gray-600 text-sm mt-1">{survey.description}</p>
                  </div>
                  <Badge className={getStatusColor(survey.status)}>
                    {survey.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Questions:</span>
                    <div className="font-medium">{survey.questions}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Responses:</span>
                    <div className="font-medium">{survey.responses}/{survey.targetResponses}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Created:</span>
                    <div className="font-medium">{new Date(survey.createdAt).toLocaleDateString()}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">End Date:</span>
                    <div className="font-medium">{new Date(survey.endDate).toLocaleDateString()}</div>
                  </div>
                </div>
                
                {survey.status === 'active' && (
                  <div className="mt-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(survey.responses / survey.targetResponses) * 100}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {Math.round((survey.responses / survey.targetResponses) * 100)}% of target reached
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Dialog open={showSurveyBuilder} onOpenChange={setShowSurveyBuilder}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Survey for {campaignName}</DialogTitle>
          </DialogHeader>
          <SurveyBuilder
            onSave={handleSaveSurvey}
            onCancel={() => setShowSurveyBuilder(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
