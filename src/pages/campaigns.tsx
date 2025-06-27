
import { useState } from "react";
import { Plus, Search, Filter, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/ui/status-badge";
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Campaign {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'paused' | 'completed' | 'draft';
  progress: number;
  totalTasks: number;
  completedTasks: number;
  assignedUsers: number;
  createdAt: string;
  endDate: string;
}

const mockCampaigns: Campaign[] = [
  {
    id: '1',
    name: 'Community Outreach 2024',
    description: 'Engaging with local communities to increase awareness',
    status: 'active',
    progress: 65,
    totalTasks: 20,
    completedTasks: 13,
    assignedUsers: 8,
    createdAt: '2024-01-15',
    endDate: '2024-03-30'
  },
  {
    id: '2',
    name: 'Digital Marketing Push',
    description: 'Social media and online advertising campaign',
    status: 'active',
    progress: 45,
    totalTasks: 15,
    completedTasks: 7,
    assignedUsers: 5,
    createdAt: '2024-02-01',
    endDate: '2024-04-15'
  },
  {
    id: '3',
    name: 'Volunteer Training Program',
    description: 'Training new volunteers for field operations',
    status: 'completed',
    progress: 100,
    totalTasks: 12,
    completedTasks: 12,
    assignedUsers: 15,
    createdAt: '2024-01-01',
    endDate: '2024-02-28'
  }
];

const getStatusColor = (status: Campaign['status']) => {
  switch (status) {
    case 'active': return 'success';
    case 'paused': return 'warning';
    case 'completed': return 'info';
    case 'draft': return 'danger';
    default: return 'info';
  }
};

export default function Campaigns() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [campaigns] = useState<Campaign[]>(mockCampaigns);

  const filteredCampaigns = campaigns.filter(campaign =>
    campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    campaign.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const canCreateCampaign = user?.role === 'admin';

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Campaigns</h1>
          <p className="text-gray-600 mt-1">
            {user?.role === 'admin' ? 'Manage all campaigns' : 'View your assigned campaigns'}
          </p>
        </div>
        {canCreateCampaign && (
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create Campaign
          </Button>
        )}
      </div>

      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search campaigns..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          <Filter className="w-4 h-4 mr-2" />
          Filter
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCampaigns.map((campaign) => (
          <Card key={campaign.id} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-2">{campaign.name}</CardTitle>
                  <StatusBadge status={getStatusColor(campaign.status)}>
                    {campaign.status}
                  </StatusBadge>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>View Details</DropdownMenuItem>
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                    {canCreateCampaign && (
                      <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm mb-4">{campaign.description}</p>
              
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Progress</span>
                    <span>{campaign.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${campaign.progress}%` }}
                    />
                  </div>
                </div>

                <div className="flex justify-between text-sm text-gray-600">
                  <span>Tasks: {campaign.completedTasks}/{campaign.totalTasks}</span>
                  <span>Team: {campaign.assignedUsers}</span>
                </div>

                <div className="text-xs text-gray-500">
                  Due: {new Date(campaign.endDate).toLocaleDateString()}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCampaigns.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No campaigns found matching your search.</p>
        </div>
      )}
    </div>
  );
}
