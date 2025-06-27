
import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, GripVertical, Calendar, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export interface ActionPlanTask {
  id: string;
  title: string;
  description: string;
  assignedEmails: string[];
  deadline: string;
  status: 'not-started' | 'in-progress' | 'completed' | 'pending';
  notes: string;
  priority: 'low' | 'medium' | 'high';
}

interface ActionPlanBuilderProps {
  tasks: ActionPlanTask[];
  onTasksChange: (tasks: ActionPlanTask[]) => void;
}

const getStatusBadgeVariant = (status: ActionPlanTask['status']) => {
  switch (status) {
    case 'completed': return 'default';
    case 'in-progress': return 'secondary';
    case 'pending': return 'destructive';
    case 'not-started': return 'outline';
    default: return 'outline';
  }
};

const getPriorityBadgeVariant = (priority: ActionPlanTask['priority']) => {
  switch (priority) {
    case 'high': return 'destructive';
    case 'medium': return 'secondary';
    case 'low': return 'outline';
    default: return 'outline';
  }
};

export function ActionPlanBuilder({ tasks, onTasksChange }: ActionPlanBuilderProps) {
  const [editingTask, setEditingTask] = useState<ActionPlanTask | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const addNewTask = () => {
    const newTask: ActionPlanTask = {
      id: Date.now().toString(),
      title: "",
      description: "",
      assignedEmails: [],
      deadline: "",
      status: 'not-started',
      notes: "",
      priority: 'medium'
    };
    setEditingTask(newTask);
    setIsDialogOpen(true);
  };

  const editTask = (task: ActionPlanTask) => {
    setEditingTask(task);
    setIsDialogOpen(true);
  };

  const deleteTask = (taskId: string) => {
    onTasksChange(tasks.filter(t => t.id !== taskId));
  };

  const saveTask = (task: ActionPlanTask) => {
    if (tasks.find(t => t.id === task.id)) {
      onTasksChange(tasks.map(t => t.id === task.id ? task : t));
    } else {
      onTasksChange([...tasks, task]);
    }
    setIsDialogOpen(false);
    setEditingTask(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Action Plan</h3>
        <Button onClick={addNewTask} size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Add Task
        </Button>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12"></TableHead>
              <TableHead>Task</TableHead>
              <TableHead>Assigned To</TableHead>
              <TableHead>Deadline</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead className="w-20">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                  No tasks added yet. Click "Add Task" to get started.
                </TableCell>
              </TableRow>
            ) : (
              tasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell>
                    <GripVertical className="w-4 h-4 text-gray-400 cursor-move" />
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{task.title}</div>
                      {task.description && (
                        <div className="text-sm text-gray-500 mt-1">{task.description}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {task.assignedEmails.map((email, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {email}
                        </Badge>
                      ))}
                      {task.assignedEmails.length === 0 && (
                        <span className="text-gray-400 text-sm">Unassigned</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {task.deadline ? (
                      <div className="flex items-center text-sm">
                        <Calendar className="w-3 h-3 mr-1" />
                        {new Date(task.deadline).toLocaleDateString()}
                      </div>
                    ) : (
                      <span className="text-gray-400 text-sm">No deadline</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(task.status)}>
                      {task.status.replace('-', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getPriorityBadgeVariant(task.priority)}>
                      {task.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => editTask(task)}
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteTask(task.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <TaskEditDialog
        task={editingTask}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSave={saveTask}
      />
    </div>
  );
}

interface TaskEditDialogProps {
  task: ActionPlanTask | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (task: ActionPlanTask) => void;
}

function TaskEditDialog({ task, open, onOpenChange, onSave }: TaskEditDialogProps) {
  const [formData, setFormData] = useState<ActionPlanTask>({
    id: '',
    title: '',
    description: '',
    assignedEmails: [],
    deadline: '',
    status: 'not-started',
    notes: '',
    priority: 'medium'
  });
  const [emailInput, setEmailInput] = useState('');

  useEffect(() => {
    if (task) {
      setFormData(task);
    } else {
      setFormData({
        id: '',
        title: '',
        description: '',
        assignedEmails: [],
        deadline: '',
        status: 'not-started',
        notes: '',
        priority: 'medium'
      });
    }
  }, [task]);

  const addEmail = () => {
    if (emailInput.trim() && !formData.assignedEmails.includes(emailInput.trim())) {
      setFormData(prev => ({
        ...prev,
        assignedEmails: [...prev.assignedEmails, emailInput.trim()]
      }));
      setEmailInput('');
    }
  };

  const removeEmail = (email: string) => {
    setFormData(prev => ({
      ...prev,
      assignedEmails: prev.assignedEmails.filter(e => e !== email)
    }));
  };

  const handleSave = () => {
    if (formData.title.trim()) {
      onSave(formData);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {task?.id ? 'Edit Task' : 'Add New Task'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Task Title *</label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter task title"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Description</label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe the task details"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Assign Team Members</label>
            <div className="flex space-x-2 mb-2">
              <Input
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="Enter email address"
                onKeyPress={(e) => e.key === 'Enter' && addEmail()}
              />
              <Button onClick={addEmail} type="button">
                <User className="w-4 h-4 mr-2" />
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.assignedEmails.map((email) => (
                <Badge key={email} variant="secondary" className="flex items-center gap-1">
                  {email}
                  <button
                    onClick={() => removeEmail(email)}
                    className="ml-1 hover:text-red-600"
                  >
                    ×
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Deadline</label>
              <Input
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Priority</label>
              <Select
                value={formData.priority}
                onValueChange={(value: 'low' | 'medium' | 'high') => 
                  setFormData(prev => ({ ...prev, priority: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Status</label>
            <Select
              value={formData.status}
              onValueChange={(value: ActionPlanTask['status']) => 
                setFormData(prev => ({ ...prev, status: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="not-started">Not Started</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Notes</label>
            <Textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Additional notes, contact details, or links"
              rows={3}
            />
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!formData.title.trim()}>
            {task?.id ? 'Update Task' : 'Add Task'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
