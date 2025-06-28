import React, { useState } from "react";
import { Plus, Search, Filter, MoreVertical, Mail, Phone, CheckCircle, XCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { CreateUserForm } from "@/components/users/create-user-form";
import { User } from "@/types/auth";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";

const getRoleBadgeColor = (role: User['role']) => {
  switch (role) {
    case 'admin': return 'bg-red-100 text-red-800';
    case 'supervisor': return 'bg-blue-100 text-blue-800';
    case 'volunteer': return 'bg-green-100 text-green-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getStatusBadgeColor = (status: User['status']) => {
  switch (status) {
    case 'active': return 'bg-green-100 text-green-800';
    case 'inactive': return 'bg-gray-100 text-gray-800';
    case 'pending_approval': return 'bg-yellow-100 text-yellow-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export default function Users() {
  const { user, getAllUsers, getPendingUsers, approveUser, rejectUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  // Refresh users when component mounts or when refreshKey changes
  React.useEffect(() => {
    setUsers(getAllUsers());
  }, [getAllUsers, refreshKey]);

  const filteredUsers = users.filter(userData =>
    userData.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    userData.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    userData.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pendingUsers = getPendingUsers();
  const canManageUsers = user?.role === 'admin';
  const canCreateUsers = user?.role === 'admin' || user?.role === 'supervisor';

  const handleApprove = async (userId: string) => {
    try {
      await approveUser(userId);
      setRefreshKey(prev => prev + 1);
      toast({
        title: "User approved",
        description: "The user has been approved and can now access the system.",
      });
    } catch (error) {
      toast({
        title: "Error approving user",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    }
  };

  const handleReject = async (userId: string) => {
    try {
      await rejectUser(userId);
      setRefreshKey(prev => prev + 1);
      toast({
        title: "User rejected",
        description: "The user has been removed from the system.",
      });
    } catch (error) {
      toast({
        title: "Error rejecting user",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    }
  };

  const handleCreateSuccess = () => {
    setShowCreateForm(false);
    setRefreshKey(prev => prev + 1);
  };

  if (!canManageUsers && !canCreateUsers) {
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
        {canCreateUsers && (
          <Button onClick={() => setShowCreateForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add User
          </Button>
        )}
      </div>

      {/* Pending Approvals for Admins */}
      {canManageUsers && pendingUsers.length > 0 && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="flex items-center text-yellow-800">
              <Clock className="w-5 h-5 mr-2" />
              Pending Approvals ({pendingUsers.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {pendingUsers.map((pendingUser) => (
              <div key={pendingUser.id} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                <div className="flex items-center space-x-3">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-yellow-100 text-yellow-700 text-sm">
                      {pendingUser.firstName[0]}{pendingUser.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{pendingUser.firstName} {pendingUser.lastName}</div>
                    <div className="text-sm text-gray-500">{pendingUser.email} • {pendingUser.role}</div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    size="sm" 
                    onClick={() => handleApprove(pendingUser.id)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Approve
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => handleReject(pendingUser.id)}
                    className="text-red-600 border-red-200 hover:bg-red-50"
                  >
                    <XCircle className="w-4 h-4 mr-1" />
                    Reject
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

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
                <TableHead>Registration</TableHead>
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
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getRoleBadgeColor(userData.role)}>
                      {userData.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusBadgeColor(userData.status)}>
                      {userData.status === 'pending_approval' ? 'pending' : userData.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">
                    <div className={userData.passwordSet ? "text-green-600" : "text-yellow-600"}>
                      {userData.passwordSet ? "Complete" : "Pending"}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-gray-500">
                    {userData.lastLogin ? new Date(userData.lastLogin).toLocaleDateString() : 'Never'}
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
                        {canManageUsers && (
                          <>
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            <DropdownMenuItem>Reset Password</DropdownMenuItem>
                            {userData.status === 'pending_approval' && (
                              <>
                                <DropdownMenuItem onClick={() => handleApprove(userData.id)}>
                                  Approve
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => handleReject(userData.id)}
                                  className="text-red-600"
                                >
                                  Reject
                                </DropdownMenuItem>
                              </>
                            )}
                            <DropdownMenuItem className="text-red-600">Deactivate</DropdownMenuItem>
                          </>
                        )}
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

      {/* Create User Dialog */}
      <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create New User</DialogTitle>
          </DialogHeader>
          <CreateUserForm
            onSuccess={handleCreateSuccess}
            onCancel={() => setShowCreateForm(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
