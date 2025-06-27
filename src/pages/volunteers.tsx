
import { useState } from "react";
import { Search, Filter, Mail, Phone, MapPin, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Volunteer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  status: 'active' | 'inactive' | 'pending';
  activeCampaigns: string[];
  tasksCompleted: number;
  rating: number;
  skills: string[];
  joinedDate: string;
  lastActive: string;
}

const mockVolunteers: Volunteer[] = [
  {
    id: '3',
    firstName: 'Mike',
    lastName: 'Volunteer',
    email: 'volunteer@campaign.com',
    phone: '+971544446653',
    location: 'Dubai Marina',
    status: 'active',
    activeCampaigns: ['Community Outreach 2024', 'Digital Marketing Push'],
    tasksCompleted: 15,
    rating: 4.8,
    skills: ['Social Media', 'Community Engagement', 'Data Collection'],
    joinedDate: '2024-02-01',
    lastActive: '2024-06-25'
  },
  {
    id: '4',
    firstName: 'Lisa',
    lastName: 'Johnson',
    email: 'lisa.johnson@campaign.com',
    phone: '+971544446654',
    location: 'JLT',
    status: 'pending',
    activeCampaigns: [],
    tasksCompleted: 0,
    rating: 0,
    skills: ['Photography', 'Content Creation'],
    joinedDate: '2024-06-20',
    lastActive: '2024-06-20'
  },
  {
    id: '5',
    firstName: 'Ahmed',
    lastName: 'Hassan',
    email: 'ahmed.hassan@campaign.com',
    phone: '+971544446655',
    location: 'Downtown Dubai',
    status: 'active',
    activeCampaigns: ['Community Outreach 2024'],
    tasksCompleted: 23,
    rating: 4.9,
    skills: ['Translation', 'Community Relations', 'Event Planning'],
    joinedDate: '2024-01-20',
    lastActive: '2024-06-26'
  },
  {
    id: '6',
    firstName: 'Fatima',
    lastName: 'Al-Zahra',
    email: 'fatima.alzahra@campaign.com',
    phone: '+971544446656',
    location: 'Sharjah',
    status: 'active',
    activeCampaigns: ['Volunteer Training Program'],
    tasksCompleted: 18,
    rating: 4.7,
    skills: ['Training', 'Mentoring', 'Public Speaking'],
    joinedDate: '2024-03-10',
    lastActive: '2024-06-24'
  },
  {
    id: '7',
    firstName: 'Carlos',
    lastName: 'Rodriguez',
    email: 'carlos.rodriguez@campaign.com',
    phone: '+971544446657',
    location: 'Abu Dhabi',
    status: 'inactive',
    activeCampaigns: [],
    tasksCompleted: 8,
    rating: 4.3,
    skills: ['Graphic Design', 'Web Development'],
    joinedDate: '2024-04-05',
    lastActive: '2024-05-15'
  }
];

const getStatusBadgeColor = (status: Volunteer['status']) => {
  switch (status) {
    case 'active': return 'bg-green-100 text-green-800';
    case 'inactive': return 'bg-gray-100 text-gray-800';
    case 'pending': return 'bg-yellow-100 text-yellow-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getRatingColor = (rating: number) => {
  if (rating >= 4.5) return 'text-green-600';
  if (rating >= 4.0) return 'text-blue-600';
  if (rating >= 3.5) return 'text-yellow-600';
  return 'text-gray-600';
};

export default function Volunteers() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [volunteers] = useState<Volunteer[]>(mockVolunteers);

  const filteredVolunteers = volunteers.filter(volunteer => {
    const matchesSearch = volunteer.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         volunteer.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         volunteer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         volunteer.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || volunteer.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const canManageVolunteers = user?.role === 'admin' || user?.role === 'supervisor';

  if (!canManageVolunteers) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600">You don't have permission to view volunteer management.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Volunteers</h1>
          <p className="text-gray-600 mt-1">Manage your volunteer team and track their performance</p>
        </div>
      </div>

      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search volunteers..."
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
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline">
          <Filter className="w-4 h-4 mr-2" />
          More Filters
        </Button>
      </div>

      {/* Volunteer Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {filteredVolunteers.filter(v => v.status === 'active').length}
            </div>
            <p className="text-sm text-gray-600">Active</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">
              {filteredVolunteers.filter(v => v.status === 'pending').length}
            </div>
            <p className="text-sm text-gray-600">Pending</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-gray-600">
              {filteredVolunteers.filter(v => v.status === 'inactive').length}
            </div>
            <p className="text-sm text-gray-600">Inactive</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {filteredVolunteers.reduce((sum, v) => sum + v.tasksCompleted, 0)}
            </div>
            <p className="text-sm text-gray-600">Total Tasks</p>
          </CardContent>
        </Card>
      </div>

      {/* Volunteers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVolunteers.map((volunteer) => (
          <Card key={volunteer.id} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback className="bg-primary-100 text-primary-700 text-lg">
                      {volunteer.firstName[0]}{volunteer.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">
                      {volunteer.firstName} {volunteer.lastName}
                    </CardTitle>
                    <Badge className={getStatusBadgeColor(volunteer.status)}>
                      {volunteer.status}
                    </Badge>
                  </div>
                </div>
                {volunteer.rating > 0 && (
                  <div className="flex items-center">
                    <Award className={`w-4 h-4 mr-1 ${getRatingColor(volunteer.rating)}`} />
                    <span className={`text-sm font-medium ${getRatingColor(volunteer.rating)}`}>
                      {volunteer.rating}
                    </span>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="w-4 h-4 mr-2" />
                    {volunteer.email}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="w-4 h-4 mr-2" />
                    {volunteer.phone}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    {volunteer.location}
                  </div>
                </div>

                <div>
                  <div className="text-sm font-medium text-gray-700 mb-1">Skills</div>
                  <div className="flex flex-wrap gap-1">
                    {volunteer.skills.map((skill, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="font-medium text-gray-700">Active Campaigns</div>
                    <div className="text-gray-600">{volunteer.activeCampaigns.length}</div>
                  </div>
                  <div>
                    <div className="font-medium text-gray-700">Tasks Completed</div>
                    <div className="text-gray-600">{volunteer.tasksCompleted}</div>
                  </div>
                </div>

                <div className="text-xs text-gray-500">
                  <div>Joined: {new Date(volunteer.joinedDate).toLocaleDateString()}</div>
                  <div>Last Active: {new Date(volunteer.lastActive).toLocaleDateString()}</div>
                </div>

                <div className="pt-2">
                  <Button size="sm" className="w-full">
                    View Profile
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredVolunteers.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No volunteers found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}
