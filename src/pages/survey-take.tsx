
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SurveyForm } from "@/components/surveys/survey-form";
import { toast } from "@/components/ui/use-toast";

interface SurveyQuestion {
  id: string;
  type: 'text' | 'multiple_choice' | 'rating' | 'yes_no' | 'demographic';
  question: string;
  required: boolean;
  options?: string[];
  ratingScale?: number;
}

interface Survey {
  id: string;
  title: string;
  description: string;
  questions: SurveyQuestion[];
  targetResponses: number;
  campaignName: string;
  status: 'active' | 'draft' | 'closed' | 'completed';
}

// Mock survey data - in a real app this would come from an API
const mockSurveys: Survey[] = [
  {
    id: '1',
    title: 'Community Needs Assessment',
    description: 'Understanding the primary needs and concerns of local residents',
    campaignName: 'Community Outreach 2024',
    status: 'active',
    targetResponses: 500,
    questions: [
      {
        id: '1',
        type: 'demographic',
        question: 'What is your age range?',
        required: true
      },
      {
        id: '2',
        type: 'multiple_choice',
        question: 'What are the most important issues in your community? (Select all that apply)',
        required: true,
        options: ['Public Transportation', 'Healthcare Access', 'Education', 'Housing Affordability', 'Public Safety', 'Environmental Issues']
      },
      {
        id: '3',
        type: 'rating',
        question: 'How satisfied are you with current public services?',
        required: true,
        ratingScale: 5
      },
      {
        id: '4',
        type: 'text',
        question: 'What specific improvements would you like to see in your neighborhood?',
        required: false
      },
      {
        id: '5',
        type: 'yes_no',
        question: 'Would you be interested in participating in community meetings?',
        required: true
      }
    ]
  },
  {
    id: '2',
    title: 'Digital Engagement Survey',
    description: 'Measuring effectiveness of social media campaigns',
    campaignName: 'Digital Marketing Push',
    status: 'active',
    targetResponses: 200,
    questions: [
      {
        id: '1',
        type: 'demographic',
        question: 'What is your age range?',
        required: true
      },
      {
        id: '2',
        type: 'multiple_choice',
        question: 'Which social media platforms do you use regularly? (Select all that apply)',
        required: true,
        options: ['Facebook', 'Instagram', 'Twitter', 'TikTok', 'LinkedIn', 'YouTube']
      },
      {
        id: '3',
        type: 'rating',
        question: 'How likely are you to engage with political content on social media?',
        required: true,
        ratingScale: 10
      },
      {
        id: '4',
        type: 'text',
        question: 'What type of political content interests you most?',
        required: false
      }
    ]
  }
];

export default function SurveyTake() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const foundSurvey = mockSurveys.find(s => s.id === id);
      setSurvey(foundSurvey || null);
      setLoading(false);
    }, 500);
  }, [id]);

  const handleSubmit = (responses: any[], context: any) => {
    console.log('Survey submitted:', { surveyId: id, responses, context });
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Survey Submitted Successfully",
        description: "Thank you for conducting this interview. Your responses have been recorded."
      });
      navigate('/surveys');
    }, 1000);
  };

  const handleSaveDraft = (responses: any[], context: any) => {
    console.log('Survey draft saved:', { surveyId: id, responses, context });
    
    toast({
      title: "Draft Saved",
      description: "Your progress has been saved. You can continue later."
    });
  };

  const handleCancel = () => {
    navigate('/surveys');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">
          <div className="w-8 h-8 bg-primary rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (!survey) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Survey Not Found</h1>
          <p className="text-gray-600 mb-4">The survey you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate('/surveys')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Surveys
          </Button>
        </div>
      </div>
    );
  }

  if (survey.status !== 'active') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Survey Not Available</h1>
          <p className="text-gray-600 mb-4">This survey is currently {survey.status} and not available for responses.</p>
          <Button onClick={() => navigate('/surveys')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Surveys
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => navigate('/surveys')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Surveys
          </Button>
        </div>
        
        <SurveyForm
          survey={survey}
          onSubmit={handleSubmit}
          onSaveDraft={handleSaveDraft}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
}
