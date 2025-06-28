
import { useState } from "react";
import { Plus, Search, BarChart3, Users, Calendar, Edit, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/ui/status-badge";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { SurveyBuilder } from "@/components/surveys/survey-builder";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

const mockSurveys: Survey[] = [
  {
    id: '1',
    title: 'Community Needs Assessment',
    description: 'Understanding the primary needs and concerns of local residents',
    campaignName: 'Community Outreach 2024',
    status: 'active',
    responses: 145,
    targetResponses: 500,
    questions: 5,
    createdAt: '2024-06-15',
    endDate: '2024-07-30',
    createdBy: 'John Admin'
  },
  {
    id: '2',
    title: 'Digital Engagement Survey',
    description: 'Measuring effectiveness of social media campaigns',
    campaignName: 'Digital Marketing Push',
    status: 'active',
    responses: 89,
    targetResponses: 200,
    questions: 4,
    createdAt: '2024-06-20',
    endDate: '2024-07-15',
    createdBy: 'Sarah Supervisor'
  },
  {
    id: '3',
    title: 'Volunteer Satisfaction Survey',
    description: 'Feedback on training programs and volunteer experience',
    campaignName: 'Volunteer Training Program',
    status: 'completed',
    responses: 45,
    targetResponses: 50,
    questions: 15,
    createdAt: '2024-05-01',
    endDate: '2024-06-01',
    createdBy: 'John Admin'
  },
  {
    id: '4',
    title: 'Post-Event Feedback',
    description: 'Collecting feedback from community event attendees',
    campaignName: 'Community Outreach 2024',
    status: 'draft',
    responses: 0,
    targetResponses: 300,
    questions: 10,
    createdAt: '2024-06-25',
    endDate: '2024-08-01',
    createdBy: 'Sarah Supervisor'
  }
];

const getStatusColor = (status: Survey['status']) => {
  switch (status) {
    case 'active': return 'success';
    case 'completed': return 'info';
    case 'closed': return 'warning';
    case 'draft': return 'danger';
    default: return 'info';
  }
};

export default function Surveys() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [surveys] = useState<Survey[]>(mockSurveys);
  const [showSurveyBuilder, setShowSurveyBuilder] = useState(false);

  const filteredSurveys = surveys.filter(survey => {
    const matchesSearch = survey.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         survey.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         survey.campaignName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || survey.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const canCreateSurvey = user?.role === 'admin' || user?.role === 'supervisor';

  const handleTakeSurvey = (surveyId: string) => {
    navigate(`/surveys/${surveyId}/take`);
  };

  const handleCreateSurvey = () => {
    setShowSurveyBuilder(true);
  };

  const handleSaveSurvey = (surveyData: any) => {
    console.log('Saving survey:', surveyData);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Survey Created",
        description: "Your survey has been successfully created and is now active."
      });
      setShowSurveyBuilder(false);
    }, 1000);
  };

  const handleViewResults = (surveyId: string) => {
    // Navigate to results page (to be implemented)
    console.log('View results for survey:', surveyId);
    toast({
      title: "Feature Coming Soon",
      description: "Survey results viewing will be available soon."
    });
  };

  const handleEditSurvey = (surveyId: string) => {
    // Navigate to edit page (to be implemented)
    console.log('Edit survey:', surveyId);
    toast({
      title: "Feature Coming Soon",
      description: "Survey editing will be available soon."
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Surveys</h1>
          <p className="text-gray-600 mt-1">
            {user?.role === 'volunteer' 
              ? 'Take surveys and collect responses from the public' 
              : 'Create and manage campaign surveys'
            }
          </p>
        </div>
        {canCreateSurvey && (
          <Button onClick={handleCreateSurvey}>
            <Plus className="w-4 h-4 mr-2" />
            Create Survey
          </Button>
        )}
      </div>

      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search surveys..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Survey Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {filteredSurveys.filter(s => s.status === 'active').length}
            </div>
            <p className="text-sm text-gray-600">Active</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">
              {filteredSurveys.filter(s => s.status === 'draft').length}
            </div>
            <p className="text-sm text-gray-600">Draft</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">
              {filteredSurveys.filter(s => s.status === 'completed').length}
            </div>
            <p className="text-sm text-gray-600">Completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {filteredSurveys.reduce((sum, s) => sum + s.responses, 0)}
            </div>
            <p className="text-sm text-gray-600">Total Responses</p>
          </CardContent>
        </Card>
      </div>

      {/* Surveys Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSurveys.map((survey) => (
          <Card key={survey.id} className="hover:shadow-lg transition-shadow cursor-pointer">
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
                  {user?.role === 'volunteer' ? (
                    <Button 
                      size="sm" 
                      className="w-full" 
                      disabled={survey.status !== 'active'}
                      onClick={() => handleTakeSurvey(survey.id)}
                    >
                      {survey.status === 'active' ? 'Take Survey' : 'Not Available'}
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => handleViewResults(survey.id)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Results
                      </Button>
                      <Button 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handleEditSurvey(survey.id)}
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
        ))}
      </div>

      {filteredSurveys.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No surveys found matching your criteria.</p>
        </div>
      )}

      {/* Survey Builder Dialog */}
      <Dialog open={showSurveyBuilder} onOpenChange={setShowSurveyBuilder}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Survey</DialogTitle>
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
