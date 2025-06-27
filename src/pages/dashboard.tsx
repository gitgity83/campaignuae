
import { MetricCard } from "@/components/ui/metric-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/useAuth";
import { 
  Users, 
  Target, 
  TrendingUp, 
  AlertCircle,
  BarChart3,
  CheckCircle,
  Clock,
  UserCheck
} from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();

  if (!user) return null;

  // Mock data - in real app this would come from API
  const dashboardData = {
    totalCampaigns: 12,
    activeCampaigns: 8,
    totalVolunteers: 45,
    averageAwareness: 67,
    completionRate: 78,
    recentActivity: [
      { id: 1, action: "New volunteer joined Climate Action campaign", time: "2 hours ago" },
      { id: 2, action: "Survey responses received for Community Health", time: "4 hours ago" },
      { id: 3, action: "Campaign milestone reached", time: "1 day ago" },
    ]
  };

  const campaigns = [
    {
      id: 1,
      name: "Climate Action Awareness",
      progress: 85,
      status: "active",
      volunteers: 12,
      awareness: 72
    },
    {
      id: 2,
      name: "Community Health Initiative",
      progress: 45,
      status: "active",
      volunteers: 8,
      awareness: 58
    },
    {
      id: 3,
      name: "Local Business Support",
      progress: 90,
      status: "completed",
      volunteers: 15,
      awareness: 89
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'completed': return 'info';
      case 'paused': return 'warning';
      default: return 'info';
    }
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user.firstName}
        </h1>
        <p className="text-gray-600 mt-1">
          Here's what's happening with your campaigns today.
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Campaigns"
          value={dashboardData.totalCampaigns}
          subtitle={`${dashboardData.activeCampaigns} active`}
          status="info"
          icon={<Target className="w-4 h-4" />}
        />
        <MetricCard
          title="Total Volunteers"
          value={dashboardData.totalVolunteers}
          subtitle="Across all campaigns"
          status="success"
          icon={<Users className="w-4 h-4" />}
          trend={{ value: 12, isPositive: true }}
        />
        <MetricCard
          title="Avg. Awareness Level"
          value={`${dashboardData.averageAwareness}%`}
          subtitle="Community awareness"
          status={dashboardData.averageAwareness > 60 ? "success" : "warning"}
          icon={<BarChart3 className="w-4 h-4" />}
        />
        <MetricCard
          title="Completion Rate"
          value={`${dashboardData.completionRate}%`}
          subtitle="Campaign success rate"
          status={dashboardData.completionRate > 70 ? "success" : "warning"}
          icon={<TrendingUp className="w-4 h-4" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Campaign Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Active Campaigns
            </CardTitle>
            <CardDescription>
              Overview of your current campaign performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {campaigns.map((campaign) => (
                <div key={campaign.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{campaign.name}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      campaign.status === 'active' 
                        ? 'bg-success-100 text-success-700'
                        : campaign.status === 'completed'
                        ? 'bg-primary-100 text-primary-700'
                        : 'bg-warning-100 text-warning-700'
                    }`}>
                      {campaign.status}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Progress</span>
                      <span>{campaign.progress}%</span>
                    </div>
                    <Progress value={campaign.progress} className="h-2" />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <UserCheck className="w-3 h-3" />
                        {campaign.volunteers} volunteers
                      </span>
                      <span className="flex items-center gap-1">
                        <BarChart3 className="w-3 h-3" />
                        {campaign.awareness}% awareness
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>
              Latest updates from your campaigns
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData.recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
                  <CheckCircle className="w-5 h-5 text-success-500 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{activity.action}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Role-specific content */}
      {user.role === 'admin' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Admin Insights
            </CardTitle>
            <CardDescription>
              System-wide metrics and alerts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-primary-600">98.5%</div>
                <div className="text-sm text-gray-600">System Uptime</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-success-600">2,847</div>
                <div className="text-sm text-gray-600">Survey Responses</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-warning-600">3</div>
                <div className="text-sm text-gray-600">Pending Reviews</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
