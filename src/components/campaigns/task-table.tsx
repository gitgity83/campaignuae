
import { Edit, Trash2, GripVertical, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ActionPlanTask } from "./action-plan-builder";

interface TaskTableProps {
  tasks: ActionPlanTask[];
  onEditTask: (task: ActionPlanTask) => void;
  onDeleteTask: (taskId: string) => void;
}

const statusColors = {
  'not-started': 'secondary',
  'in-progress': 'default',
  'completed': 'secondary',
  'pending': 'destructive'
} as const;

const priorityColors = {
  'low': 'secondary',
  'medium': 'default',
  'high': 'destructive'
} as const;

export function TaskTable({ tasks, onEditTask, onDeleteTask }: TaskTableProps) {
  if (tasks.length === 0) {
    return (
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
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                No tasks added yet. Click "Add Task" to get started.
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
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
          {tasks.map((task) => (
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
                <Badge variant={statusColors[task.status]}>
                  {task.status.replace('-', ' ')}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant={priorityColors[task.priority]}>
                  {task.priority}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEditTask(task)}
                  >
                    <Edit className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDeleteTask(task.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
