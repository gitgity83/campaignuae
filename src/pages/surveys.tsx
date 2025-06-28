import { useState } from "react";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { SurveyBuilder } from "@/components/surveys/survey-builder";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import { SurveyStats } from "@/components/surveys/survey-stats";
import { SurveyCard } from "@/components/surveys/survey-card";
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
    
    setTimeout(() => {
      toast({
        title: "Survey Created",
        description: "Your survey has been successfully created and is now active."
      });
      setShowSurveyBuilder(false);
    }, 1000);
  };

  const handleViewResults = (surveyId: string) => {
    console.log('View results for survey:', surveyId);
    toast({
      title: "Feature Coming Soon",
      description: "Survey results viewing will be available soon."
    });
  };

  const handleEditSurvey = (surveyId: string) => {
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

      <SurveyStats surveys={filteredSurveys} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSurveys.map((survey) => (
          <SurveyCard
            key={survey.id}
            survey={survey}
            userRole={user?.role || 'volunteer'}
            onTakeSurvey={handleTakeSurvey}
            onViewResults={handleViewResults}
            onEditSurvey={handleEditSurvey}
          />
        ))}
      </div>

      {filteredSurveys.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No surveys found matching your criteria.</p>
        </div>
      )}

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
