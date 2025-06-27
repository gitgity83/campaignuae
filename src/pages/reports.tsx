
import { BarChart3, Download, Calendar, TrendingUp, Users, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const mockReportData = {
  overview: {
    totalCampaigns: 12,
    activeCampaigns: 5,
    totalUsers: 45,
    completedTasks: 234,
    pendingTasks: 67
  },
  campaignPerformance: [
    { name: 'Community Outreach', completion: 85, efficiency: 92 },
    { name: 'Digital Marketing', completion: 65, efficiency: 78 },
    { name: 'Volunteer Training', completion: 100, efficiency: 95 }
  ],
  userActivity: [
    { role: 'Admin', active: 3, total: 3 },
    { role: 'Supervisor', active: 8, total: 12 },
    { role: 'Volunteer', active: 25, total: 30 }
  ]
};

export default function Reports() {
  const { user } = useAuth();

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600 mt-1">Track campaign performance and team productivity</p>
        </div>
        <div className="flex gap-2">
          <Select defaultValue="30days">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 3 months</SelectItem>
              <SelectItem value="1year">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Campaigns</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockReportData.overview.totalCampaigns}</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockReportData.overview.activeCampaigns}</div>
            <p className="text-xs text-muted-foreground">+1 from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockReportData.overview.totalUsers}</div>
            <p className="text-xs text-muted-foreground">+5 new this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Tasks</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockReportData.overview.completedTasks}</div>
            <p className="text-xs text-muted-foreground">+23 this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockReportData.overview.pendingTasks}</div>
            <p className="text-xs text-muted-foreground">-8 from last week</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Campaign Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Campaign Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockReportData.campaignPerformance.map((campaign, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{campaign.name}</span>
                    <span className="text-sm text-gray-600">{campaign.completion}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${campaign.completion}%` }}
                    />
                  </div>
                  <div className="text-xs text-gray-500">
                    Efficiency: {campaign.efficiency}%
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* User Activity */}
        <Card>
          <CardHeader>
            <CardTitle>User Activity by Role</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockReportData.userActivity.map((activity, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div>
                    <div className="font-medium">{activity.role}</div>
                    <div className="text-sm text-gray-600">
                      {activity.active} active / {activity.total} total
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold">
                      {Math.round((activity.active / activity.total) * 100)}%
                    </div>
                    <div className="text-xs text-gray-500">Active Rate</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Reports */}
      <Card>
        <CardHeader>
          <CardTitle>Available Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
              <h3 className="font-medium">Campaign Summary</h3>
              <p className="text-sm text-gray-600 mt-1">Detailed performance metrics for all campaigns</p>
              <Button variant="outline" size="sm" className="mt-3">
                Generate Report
              </Button>
            </div>
            
            <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
              <h3 className="font-medium">User Performance</h3>
              <p className="text-sm text-gray-600 mt-1">Individual and team productivity analysis</p>
              <Button variant="outline" size="sm" className="mt-3">
                Generate Report
              </Button>
            </div>
            
            <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
              <h3 className="font-medium">Task Analytics</h3>
              <p className="text-sm text-gray-600 mt-1">Task completion trends and bottlenecks</p>
              <Button variant="outline" size="sm" className="mt-3">
                Generate Report
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
