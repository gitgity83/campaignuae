import { useState } from "react";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { ActionPlanBuilder, ActionPlanTask } from "./action-plan-builder";
import { useCampaigns } from "@/contexts/campaign-context";

interface CampaignWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCampaignCreated?: () => void;
}

interface CampaignFormData {
  name: string;
  description: string;
  endDate: string;
  status: 'draft' | 'active';
  actionPlan: ActionPlanTask[];
}

const steps = [
  { id: 1, title: "Campaign Details", description: "Basic campaign information" },
  { id: 2, title: "Action Plan", description: "Create detailed action plan and assign tasks" },
  { id: 3, title: "Review & Create", description: "Review all details before creating" }
];

export function CampaignCreationWizard({ open, onOpenChange, onCampaignCreated }: CampaignWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { addCampaign } = useCampaigns();

  const form = useForm<CampaignFormData>({
    defaultValues: {
      name: "",
      description: "",
      endDate: "",
      status: "draft",
      actionPlan: [],
    },
  });

  const [actionPlanTasks, setActionPlanTasks] = useState<ActionPlanTask[]>([]);

  const nextStep = () => {
    console.log('Moving to next step from:', currentStep);
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    console.log('Moving to previous step from:', currentStep);
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = async (data: CampaignFormData) => {
    console.log('Submitting campaign creation form:', data);
    setIsLoading(true);
    
    try {
      const newCampaign = {
        id: Date.now().toString(),
        name: data.name,
        description: data.description,
        status: data.status,
        progress: 0,
        totalTasks: actionPlanTasks.length,
        completedTasks: actionPlanTasks.filter(t => t.status === 'completed').length,
        assignedUsers: new Set(actionPlanTasks.flatMap(t => t.assignedEmails)).size,
        createdAt: new Date().toISOString().split('T')[0],
        endDate: data.endDate,
        actionPlan: actionPlanTasks
      };

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log("Creating campaign with action plan:", newCampaign);
      
      // Add to campaign context
      addCampaign(newCampaign);
      
      toast({
        title: "Campaign Created Successfully!",
        description: `${data.name} has been created with ${actionPlanTasks.length} tasks.`,
      });
      
      // Reset form and close
      form.reset();
      setActionPlanTasks([]);
      setCurrentStep(1);
      onOpenChange(false);
      onCampaignCreated?.();
    } catch (error) {
      console.error('Error creating campaign:', error);
      toast({
        title: "Error",
        description: "Failed to create campaign. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const canProceed = () => {
    const formData = form.getValues();
    switch (currentStep) {
      case 1:
        return formData.name && formData.description && formData.endDate;
      case 2:
        return true; // Action plan is optional
      case 3:
        return true;
      default:
        return false;
    }
  };

  const handleClose = () => {
    console.log('Closing campaign creation wizard');
    form.reset();
    setActionPlanTasks([]);
    setCurrentStep(1);
    onOpenChange(false);
  };

  const handleTasksChange = (tasks: ActionPlanTask[]) => {
    console.log('Action plan tasks updated:', tasks);
    setActionPlanTasks(tasks);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Create New Campaign</DialogTitle>
          <DialogDescription>
            Create a new campaign with detailed action plans and task assignments.
          </DialogDescription>
          
          {/* Progress Steps */}
          <div className="flex items-center justify-between mt-6 mb-8">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex items-center">
                  <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium
                    ${currentStep >= step.id 
                      ? 'bg-primary-500 text-white' 
                      : 'bg-gray-200 text-gray-600'
                    }
                  `}>
                    {currentStep > step.id ? <Check className="w-5 h-5" /> : step.id}
                  </div>
                  <div className="ml-3">
                    <div className="text-sm font-medium">{step.title}</div>
                    <div className="text-xs text-gray-500">{step.description}</div>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`
                    w-16 h-0.5 mx-4
                    ${currentStep > step.id ? 'bg-primary-500' : 'bg-gray-200'}
                  `} />
                )}
              </div>
            ))}
          </div>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            
            {/* Step 1: Campaign Details */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold mb-4">Campaign Details</h3>
                
                <FormField
                  control={form.control}
                  name="name"
                  rules={{ required: "Campaign name is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Campaign Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter campaign name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  rules={{ required: "Description is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe the campaign goals and objectives"
                          rows={4}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="endDate"
                    rules={{ required: "End date is required" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>End Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Initial Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            )}

            {/* Step 2: Action Plan */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <ActionPlanBuilder
                  tasks={actionPlanTasks}
                  onTasksChange={handleTasksChange}
                />
              </div>
            )}

            {/* Step 3: Review */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">Review Campaign</h3>
                
                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                  <div>
                    <h4 className="font-medium text-gray-900">Campaign Name</h4>
                    <p className="text-gray-600">{form.getValues('name')}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900">Description</h4>
                    <p className="text-gray-600">{form.getValues('description')}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-gray-900">End Date</h4>
                      <p className="text-gray-600">
                        {form.getValues('endDate') ? 
                          new Date(form.getValues('endDate')).toLocaleDateString() : 
                          'Not set'
                        }
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900">Status</h4>
                      <p className="text-gray-600 capitalize">{form.getValues('status')}</p>
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
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>

              <div className="flex space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                
                {currentStep < steps.length ? (
                  <Button
                    type="button"
                    onClick={nextStep}
                    disabled={!canProceed()}
                  >
                    Next
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button 
                    type="submit" 
                    disabled={isLoading || !canProceed()}
                  >
                    {isLoading ? "Creating Campaign..." : "Create Campaign"}
                  </Button>
                )}
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
