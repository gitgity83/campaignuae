
import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TaskTable } from "./task-table";
import { TaskEditDialog } from "./task-edit-dialog";

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

export function ActionPlanBuilder({ tasks, onTasksChange }: ActionPlanBuilderProps) {
  const [editingTask, setEditingTask] = useState<ActionPlanTask | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const addNewTask = () => {
    console.log('Adding new task');
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
    console.log('Editing task:', task);
    setEditingTask(task);
    setIsDialogOpen(true);
  };

  const deleteTask = (taskId: string) => {
    console.log('Deleting task:', taskId);
    onTasksChange(tasks.filter(t => t.id !== taskId));
  };

  const saveTask = (task: ActionPlanTask) => {
    console.log('Saving task:', task);
    if (tasks.find(t => t.id === task.id)) {
      onTasksChange(tasks.map(t => t.id === task.id ? task : t));
    } else {
      onTasksChange([...tasks, task]);
    }
    setIsDialogOpen(false);
    setEditingTask(null);
  };

  const handleDialogClose = (open: boolean) => {
    console.log('Dialog close requested:', open);
    if (!open) {
      setIsDialogOpen(false);
      setEditingTask(null);
    }
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

      <TaskTable
        tasks={tasks}
        onEditTask={editTask}
        onDeleteTask={deleteTask}
      />

      <TaskEditDialog
        task={editingTask}
        open={isDialogOpen}
        onOpenChange={handleDialogClose}
        onSave={saveTask}
      />
    </div>
  );
}
