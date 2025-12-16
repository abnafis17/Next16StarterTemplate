"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2 } from "lucide-react";
import {
  forwardRef,
  useImperativeHandle,
  useState,
  type ReactNode,
  type ForwardRefRenderFunction,
} from "react";

type Step = {
  id: string;
  label: string;
  content: ReactNode;
};

export interface StepperHandle {
  nextStep: () => Promise<void>;
  previousStep: () => void;
  goToStep: (index: number) => void;
  getCurrentStep: () => Step | undefined;
}

type StepperProps = {
  steps: Step[];
  onCompleteAll?: () => Promise<void> | void;
  onCancel?: () => void;
  onNext?: () => Promise<boolean> | boolean;
  isSubmitting?: boolean;
  disableNext?: boolean;
};

const StepperComponent: ForwardRefRenderFunction<
  StepperHandle,
  StepperProps
> = (
  {
    steps,
    onCompleteAll,
    onCancel,
    onNext,
    isSubmitting = false,
    disableNext = false,
  },
  ref
) => {
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState(steps[0]?.id || "");

  const currentIndex = steps.findIndex((s) => s.id === currentStep);
  const currentStepObj = steps[currentIndex];

  const isStepComplete = (id: string) => completedSteps.includes(id);

  const markCurrentStepComplete = () => {
    if (!isStepComplete(currentStep)) {
      setCompletedSteps([...completedSteps, currentStep]);
    }
  };

  const goToStep = (index: number) => {
    if (index >= 0 && index < steps.length) {
      const goingBackward = index < currentIndex;

      if (goingBackward) {
        const updated = completedSteps.filter((id) => {
          const idIndex = steps.findIndex((s) => s.id === id);
          return idIndex <= index;
        });
        setCompletedSteps(updated);
      }

      setCurrentStep(steps[index].id);
    }
  };

  const nextStep = async () => {
    if (onNext) {
      const isValid = await onNext();
      if (!isValid) return;
    }

    markCurrentStepComplete();

    // Don't proceed if we're on the last step
    if (currentIndex < steps.length - 1) {
      goToStep(currentIndex + 1);
    }
  };

  const previousStep = () => {
    goToStep(currentIndex - 1);
  };

  const finish = async () => {
    if (onNext) {
      const isValid = await onNext();
      if (!isValid) return;
    }

    markCurrentStepComplete();
    setCompletedSteps(steps.map((s) => s.id));
    await onCompleteAll?.();
  };

  const getCurrentStep = () => currentStepObj;

  useImperativeHandle(ref, () => ({
    nextStep,
    previousStep,
    goToStep,
    getCurrentStep,
  }));

  return (
    <div className="space-y-6">
      <Tabs
        value={currentStep}
        onValueChange={(value: any) => {
          const index = steps.findIndex((s) => s.id === value);
          // Only allow navigation to completed steps or next in sequence
          if (index <= currentIndex || isStepComplete(steps[index].id)) {
            goToStep(index);
          }
        }}
      >
        {/* Step Header */}
        <TabsList className="flex bg-white p-0 h-auto justify-between relative w-2/3 mx-auto">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center z-10">
              <TabsTrigger
                value={step.id}
                className="flex flex-col items-center gap-1 bg-white px-5 data-[state=active]:bg-white data-[state=active]:shadow-none
                                 data-[state=inactive]:bg-white data-[state=inactive]:opacity-100"
                disabled={!isStepComplete(step.id) && index > currentIndex}
              >
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full transition 
                                        ${
                                          isStepComplete(step.id)
                                            ? "bg-blue-500 text-white border border-blue-500"
                                            : currentStep === step.id
                                            ? "bg-blue-100 text-blue-600 border border-blue-300"
                                            : "text-gray-500 bg-white border border-gray-300"
                                        }`}
                >
                  {isStepComplete(step.id) ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    index + 1
                  )}
                </div>
                <span className="text-xs">{step.label}</span>
              </TabsTrigger>
            </div>
          ))}
          <div className="absolute top-1/2 left-0 right-0 h-px bg-gray-200  -translate-y-1/2" />
        </TabsList>

        {/* Step Content */}
        {steps.map((step) => (
          <TabsContent key={step.id} value={step.id}>
            <div className="space-y-4">{step.content}</div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Action Buttons */}
      <div className="flex justify-between mt-4">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 rounded hover:bg-gray-100 border border-gray-300"
            disabled={isSubmitting}
          >
            Cancel
          </button>
        )}

        <div className="flex gap-2 ml-auto">
          {currentIndex > 0 && (
            <button
              type="button"
              onClick={previousStep}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 border border-gray-300"
              disabled={isSubmitting}
            >
              Previous
            </button>
          )}

          {currentIndex < steps.length - 1 && (
            <button
              type="button"
              onClick={nextStep}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300"
              disabled={isSubmitting || disableNext}
            >
              {isSubmitting ? "Validating..." : "Next"}
            </button>
          )}

          {currentIndex === steps.length - 1 && (
            <button
              type="button"
              onClick={finish}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-green-300"
              disabled={isSubmitting || disableNext}
            >
              {isSubmitting ? "Submitting..." : "Finish"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export const Stepper = forwardRef(StepperComponent);
