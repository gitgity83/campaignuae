
import { useState } from "react";
import { Plus, Search, Filter, MoreVertical, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface UserData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: 'admin' | 'supervisor' | 'volunteer';
  status: 'active' | 'inactive' | 'pending';
  activeCampaigns: number;
  tasksCompleted: number;
  joinedDate: string;
  lastActive: string;
}

const mockUsers: UserData[] = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Admin',
    email: 'admin@campaign.com',
    phone: '+971544446651',
    role: 'admin',
    status: 'active',
    activeCampaigns: 5,
    tasksCompleted: 45,
    joinedDate: '2024-01-01',
    lastActive: '2024-06-27'
  },
  {
    id: '2',
    firstName: 'Sarah',
    lastName: 'Supervisor',
    email: 'supervisor@campaign.com',
    phone: '+971544446652',
    role: 'supervisor',
    status: 'active',
    activeCampaigns: 3,
    tasksCompleted: 28,
    joinedDate: '2024-01-15',
    lastActive: '2024-06-26'
  },
  {
    id: '3',
    firstName: 'Mike',
    lastName: 'Volunteer',
    email: 'volunteer@campaign.com',
    phone: '+971544446653',
    role: 'volunteer',
    status: 'active',
    activeCampaigns: 2,
    tasksCompleted: 15,
    joinedDate: '2024-02-01',
    lastActive: '2024-06-25'
  },
  {
    id: '4',
    firstName: 'Lisa',
    lastName: 'Johnson',
    email: 'lisa.johnson@campaign.com',
    phone: '+971544446654',
    role: 'volunteer',
    status: 'pending',
    activeCampaigns: 0,
    tasksCompleted: 0,
    joinedDate: '2024-06-20',
    lastActive: '2024-06-20'
  }
];

const getRoleBadgeColor = (role: UserData['role']) => {
  switch (role) {
    case 'admin': return 'bg-red-100 text-red-800';
    case 'supervisor': return 'bg-blue-100 text-blue-800';
    case 'volunteer': return 'bg-green-100 text-green-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getStatusBadgeColor = (status: UserData['status']) => {
  switch (status) {
    case 'active': return 'bg-green-100 text-green-800';
    case 'inactive': return 'bg-gray-100 text-gray-800';
    case 'pending': return 'bg-yellow-100 text-yellow-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export default function Users() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [users] = useState<UserData[]>(mockUsers);

  const filteredUsers = users.filter(userData =>
    userData.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    userData.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    userData.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const canManageUsers = user?.role === 'admin';

  if (!canManageUsers) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600">You don't have permission to view user management.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-1">Manage team members and their permissions</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add User
        </Button>
      </div>

      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search users..."
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

      <Card>
        <CardHeader>
          <CardTitle>All Users ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Performance</TableHead>
                <TableHead>Last Active</TableHead>
                <TableHead className="w-[70px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((userData) => (
                <TableRow key={userData.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-primary-100 text-primary-700 text-sm">
                          {userData.firstName[0]}{userData.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{userData.firstName} {userData.lastName}</div>
                        <div className="text-sm text-gray-500">ID: {userData.id}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center text-sm">
                        <Mail className="w-3 h-3 mr-1 text-gray-400" />
                        {userData.email}
                      </div>
                      <div className="flex items-center text-sm">
                        <Phone className="w-3 h-3 mr-1 text-gray-400" />
                        {userData.phone}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getRoleBadgeColor(userData.role)}>
                      {userData.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusBadgeColor(userData.status)}>
                      {userData.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>Campaigns: {userData.activeCampaigns}</div>
                      <div>Tasks: {userData.tasksCompleted}</div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-gray-500">
                    {new Date(userData.lastActive).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Profile</DropdownMenuItem>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Reset Password</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">Deactivate</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No users found matching your search.</p>
        </div>
      )}
    </div>
  );
}
