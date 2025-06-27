
import { ActionPlanBuilder, ActionPlanTask } from "./action-plan-builder";

interface ActionPlanStepProps {
  tasks: ActionPlanTask[];
  onTasksChange: (tasks: ActionPlanTask[]) => void;
}

export function ActionPlanStep({ tasks, onTasksChange }: ActionPlanStepProps) {
  return (
    <div className="space-y-4">
      <ActionPlanBuilder
        tasks={tasks}
        onTasksChange={onTasksChange}
      />
    </div>
  );
}
