
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WizardStep {
  id: number;
  title: string;
  description: string;
}

interface WizardNavigationProps {
  steps: WizardStep[];
  currentStep: number;
  canProceed: boolean;
  isLoading: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onCancel: () => void;
  onSubmit: () => void;
}

export function WizardNavigation({
  steps,
  currentStep,
  canProceed,
  isLoading,
  onPrevious,
  onNext,
  onCancel,
  onSubmit
}: WizardNavigationProps) {
  return (
    <>
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

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-6 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={onPrevious}
          disabled={currentStep === 1}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>

        <div className="flex space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
          
          {currentStep < steps.length ? (
            <Button
              type="button"
              onClick={onNext}
              disabled={!canProceed}
            >
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button 
              type="submit" 
              disabled={isLoading || !canProceed}
            >
              {isLoading ? "Creating Campaign..." : "Create Campaign"}
            </Button>
          )}
        </div>
      </div>
    </>
  );
}
