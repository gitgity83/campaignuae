
import { useState } from "react";
import { Plus, Search, Filter, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/ui/status-badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Task {
  id: string;
  title: string;
  description: string;
  campaignName: string;
  assignedTo: {
    id: string;
    name: string;
    role: string;
  };
  status: 'pending' | 'in-progress' | 'completed' | 'overdue';
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  createdAt: string;
  completedAt?: string;
}

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Create awareness flyers',
    description: 'Design and create promotional flyers for community outreach',
    campaignName: 'Community Outreach 2024',
    assignedTo: { id: '3', name: 'Mike Volunteer', role: 'volunteer' },
    status: 'in-progress',
    priority: 'high',
    dueDate: '2024-07-05',
    createdAt: '2024-06-25'
  },
  {
    id: '2',
    title: 'Conduct survey in District 1',
    description: 'Door-to-door survey to collect community feedback',
    campaignName: 'Community Outreach 2024',
    assignedTo: { id: '4', name: 'Lisa Johnson', role: 'volunteer' },
    status: 'pending',
    priority: 'medium',
    dueDate: '2024-07-10',
    createdAt: '2024-06-26'
  },
  {
    id: '3',
    title: 'Social media content creation',
    description: 'Create 10 posts for Instagram and Facebook campaigns',
    campaignName: 'Digital Marketing Push',
    assignedTo: { id: '2', name: 'Sarah Supervisor', role: 'supervisor' },
    status: 'completed',
    priority: 'medium',
    dueDate: '2024-06-30',
    createdAt: '2024-06-20',
    completedAt: '2024-06-28'
  },
  {
    id: '4',
    title: 'Training session preparation',
    description: 'Prepare materials for new volunteer training',
    campaignName: 'Volunteer Training Program',
    assignedTo: { id: '1', name: 'John Admin', role: 'admin' },
    status: 'overdue',
    priority: 'high',
    dueDate: '2024-06-25',
    createdAt: '2024-06-15'
  }
];

const getStatusColor = (status: Task['status']) => {
  switch (status) {
    case 'completed': return 'success';
    case 'in-progress': return 'info';
    case 'pending': return 'warning';
    case 'overdue': return 'danger';
    default: return 'info';
  }
};

const getPriorityColor = (priority: Task['priority']) => {
  switch (priority) {
    case 'high': return 'bg-red-100 text-red-800';
    case 'medium': return 'bg-yellow-100 text-yellow-800';
    case 'low': return 'bg-green-100 text-green-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getStatusIcon = (status: Task['status']) => {
  switch (status) {
    case 'completed': return <CheckCircle className="w-4 h-4 text-green-600" />;
    case 'overdue': return <AlertCircle className="w-4 h-4 text-red-600" />;
    default: return <Clock className="w-4 h-4 text-blue-600" />;
  }
};

export default function Tasks() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [tasks] = useState<Task[]>(mockTasks);

  // Filter tasks based on user role
  const userTasks = user?.role === 'volunteer' 
    ? tasks.filter(task => task.assignedTo.id === user.id)
    : tasks;

  const filteredTasks = userTasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.campaignName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || task.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const canCreateTask = user?.role === 'admin' || user?.role === 'supervisor';

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {user?.role === 'volunteer' ? 'My Tasks' : 'Tasks'}
          </h1>
          <p className="text-gray-600 mt-1">
            {user?.role === 'volunteer' 
              ? 'Your assigned tasks and deadlines' 
              : 'Manage and track all campaign tasks'
            }
          </p>
        </div>
        {canCreateTask && (
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create Task
          </Button>
        )}
      </div>

      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search tasks..."
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
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="overdue">Overdue</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline">
          <Filter className="w-4 h-4 mr-2" />
          More Filters
        </Button>
      </div>

      {/* Task Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">
              {filteredTasks.filter(t => t.status === 'pending').length}
            </div>
            <p className="text-sm text-gray-600">Pending</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">
              {filteredTasks.filter(t => t.status === 'in-progress').length}
            </div>
            <p className="text-sm text-gray-600">In Progress</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {filteredTasks.filter(t => t.status === 'completed').length}
            </div>
            <p className="text-sm text-gray-600">Completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">
              {filteredTasks.filter(t => t.status === 'overdue').length}
            </div>
            <p className="text-sm text-gray-600">Overdue</p>
          </CardContent>
        </Card>
      </div>

      {/* Tasks List */}
      <div className="space-y-4">
        {filteredTasks.map((task) => (
          <Card key={task.id} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {getStatusIcon(task.status)}
                    <h3 className="font-semibold text-lg">{task.title}</h3>
                    <StatusBadge status={getStatusColor(task.status)}>
                      {task.status}
                    </StatusBadge>
                    <Badge className={getPriorityColor(task.priority)}>
                      {task.priority}
                    </Badge>
                  </div>
                  
                  <p className="text-gray-600 mb-3">{task.description}</p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>Campaign: {task.campaignName}</span>
                    <span>•</span>
                    <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                    {task.completedAt && (
                      <>
                        <span>•</span>
                        <span>Completed: {new Date(task.completedAt).toLocaleDateString()}</span>
                      </>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 ml-6">
                  <div className="text-right">
                    <div className="text-sm font-medium">{task.assignedTo.name}</div>
                    <div className="text-xs text-gray-500 capitalize">{task.assignedTo.role}</div>
                  </div>
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-primary-100 text-primary-700 text-sm">
                      {task.assignedTo.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTasks.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No tasks found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}
