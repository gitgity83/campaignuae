import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Edit, Users, Calendar, Target, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/ui/status-badge";
import { useAuth } from "@/hooks/useAuth";
import { ActionPlanDashboard } from "@/components/campaigns/action-plan-dashboard";
import { ActionPlanTask } from "@/components/campaigns/action-plan-builder";
import { useCampaigns } from "@/contexts/campaign-context";

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active': return 'success';
    case 'paused': return 'warning';
    case 'completed': return 'info';
    case 'draft': return 'danger';
    default: return 'info';
  }
};

export default function CampaignDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getCampaign, updateCampaign } = useCampaigns();
  const [loading, setLoading] = useState(true);

  const campaign = getCampaign(id || '');

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [id]);

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Campaign Not Found</h2>
        <p className="text-gray-600 mb-6">The campaign you're looking for doesn't exist.</p>
        <Link to="/campaigns">
          <Button>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Campaigns
          </Button>
        </Link>
      </div>
    );
  }

  const canEdit = user?.role === 'admin';

  const handleTaskUpdate = (task: ActionPlanTask) => {
    console.log('Update task:', task);
    if (campaign.actionPlan) {
      const updatedActionPlan = campaign.actionPlan.map(t => 
        t.id === task.id ? task : t
      );
      const completedTasks = updatedActionPlan.filter(t => t.status === 'completed').length;
      const progress = updatedActionPlan.length > 0 
        ? Math.round((completedTasks / updatedActionPlan.length) * 100) 
        : 0;

      updateCampaign(campaign.id, {
        actionPlan: updatedActionPlan,
        completedTasks,
        progress
      });
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/campaigns')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Campaigns
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{campaign.name}</h1>
            <div className="flex items-center space-x-3 mt-2">
              <StatusBadge status={getStatusColor(campaign.status)}>
                {campaign.status}
              </StatusBadge>
              <span className="text-gray-500">•</span>
              <span className="text-gray-600">
                Created {new Date(campaign.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
        {canEdit && (
          <Button>
            <Edit className="w-4 h-4 mr-2" />
            Edit Campaign
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progress</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{campaign.progress}%</div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${campaign.progress}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasks</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {campaign.completedTasks}/{campaign.totalTasks}
            </div>
            <p className="text-xs text-muted-foreground">
              {campaign.totalTasks - campaign.completedTasks} remaining
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{campaign.assignedUsers}</div>
            <p className="text-xs text-muted-foreground">
              Active contributors
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Campaign Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Description</h4>
            <p className="text-gray-600">{campaign.description}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-1">End Date</h4>
              <div className="flex items-center text-gray-600">
                <Calendar className="w-4 h-4 mr-2" />
                {new Date(campaign.endDate).toLocaleDateString()}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-1">Status</h4>
              <StatusBadge status={getStatusColor(campaign.status)}>
                {campaign.status}
              </StatusBadge>
            </div>
          </div>
        </CardContent>
      </Card>

      <ActionPlanDashboard
        tasks={campaign.actionPlan || []}
        onTaskUpdate={handleTaskUpdate}
        canEdit={canEdit}
      />
    </div>
  );
}
