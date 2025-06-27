
import { useState, useEffect } from "react";
import { User } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ActionPlanTask } from "./action-plan-builder";

interface TaskEditDialogProps {
  task: ActionPlanTask | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (task: ActionPlanTask) => void;
}

export function TaskEditDialog({ task, open, onOpenChange, onSave }: TaskEditDialogProps) {
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
      console.log('Setting form data for task:', task);
      setFormData(task);
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

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('Saving task with data:', formData);
    
    if (formData.title.trim()) {
      onSave(formData);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.target === e.currentTarget) {
      e.preventDefault();
      addEmail();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <DialogHeader>
          <DialogTitle>
            {task?.id && task.id !== formData.id ? 'Edit Task' : 'Add New Task'}
          </DialogTitle>
          <DialogDescription>
            Create or edit task details including assignments, deadlines, and priorities.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSave} className="space-y-4" onClick={(e) => e.stopPropagation()}>
          <div>
            <label className="text-sm font-medium mb-2 block">Task Title *</label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter task title"
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Description</label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe the task details"
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Assign Team Members</label>
            <div className="flex space-x-2 mb-2">
              <Input
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="Enter email address"
                onKeyPress={handleKeyPress}
                onClick={(e) => e.stopPropagation()}
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
                    type="button"
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
                onClick={(e) => e.stopPropagation()}
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
                <SelectTrigger onClick={(e) => e.stopPropagation()}>
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
              <SelectTrigger onClick={(e) => e.stopPropagation()}>
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
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              type="button"
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={!formData.title.trim()}
            >
              {task?.id && task.id !== formData.id ? 'Update Task' : 'Add Task'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
