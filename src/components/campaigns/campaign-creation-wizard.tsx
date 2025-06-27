
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { ActionPlanTask } from "./action-plan-builder";
import { useCampaigns } from "@/contexts/campaign-context";
import { WizardNavigation } from "./wizard-navigation";
import { CampaignDetailsStep } from "./campaign-details-step";
import { ActionPlanStep } from "./action-plan-step";
import { ReviewStep } from "./review-step";

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

  const canProceed = (): boolean => {
    const formData = form.getValues();
    switch (currentStep) {
      case 1:
        return !!(formData.name && formData.description && formData.endDate);
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

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <CampaignDetailsStep control={form.control} />;
      case 2:
        return (
          <ActionPlanStep
            tasks={actionPlanTasks}
            onTasksChange={handleTasksChange}
          />
        );
      case 3:
        return (
          <ReviewStep
            formData={form.getValues()}
            actionPlanTasks={actionPlanTasks}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Create New Campaign</DialogTitle>
          <DialogDescription>
            Create a new campaign with detailed action plans and task assignments.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {renderCurrentStep()}
            
            <WizardNavigation
              steps={steps}
              currentStep={currentStep}
              canProceed={canProceed()}
              isLoading={isLoading}
              onPrevious={prevStep}
              onNext={nextStep}
              onCancel={handleClose}
              onSubmit={() => form.handleSubmit(onSubmit)()}
            />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
