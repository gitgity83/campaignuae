
import { ActionPlanTask } from "./action-plan-builder";

interface CampaignFormData {
  name: string;
  description: string;
  endDate: string;
  status: 'draft' | 'active';
}

interface ReviewStepProps {
  formData: CampaignFormData;
  actionPlanTasks: ActionPlanTask[];
}

export function ReviewStep({ formData, actionPlanTasks }: ReviewStepProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Review Campaign</h3>
      
      <div className="bg-gray-50 p-4 rounded-lg space-y-3">
        <div>
          <h4 className="font-medium text-gray-900">Campaign Name</h4>
          <p className="text-gray-600">{formData.name}</p>
        </div>
        
        <div>
          <h4 className="font-medium text-gray-900">Description</h4>
          <p className="text-gray-600">{formData.description}</p>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium text-gray-900">End Date</h4>
            <p className="text-gray-600">
              {formData.endDate ? 
                new Date(formData.endDate).toLocaleDateString() : 
                'Not set'
              }
            </p>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900">Status</h4>
            <p className="text-gray-600 capitalize">{formData.status}</p>
          </div>
        </div>
        
        <div>
          <h4 className="font-medium text-gray-900">Action Plan</h4>
          <p className="text-gray-600">
            {actionPlanTasks.length > 0 
              ? `${actionPlanTasks.length} tasks created`
              : 'No tasks added'
            }
          </p>
          {actionPlanTasks.length > 0 && (
            <div className="mt-2 space-y-1">
              {actionPlanTasks.slice(0, 3).map((task) => (
                <div key={task.id} className="text-sm text-gray-500">
                  • {task.title}
                </div>
              ))}
              {actionPlanTasks.length > 3 && (
                <div className="text-sm text-gray-500">
                  ... and {actionPlanTasks.length - 3} more tasks
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
