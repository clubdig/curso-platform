import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Step {
  id: number;
  name: string;
  description?: string;
}

interface StepsProps {
  steps: Step[];
  currentStep: number;
}

export default function Steps({ steps, currentStep }: StepsProps) {
  return (
    <nav className="flex items-center justify-between">
      {steps.map((step, idx) => (
        <div key={step.id} className="flex items-center">
          <div className="flex items-center gap-2">
            <div
              className={cn(
                'w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors',
                currentStep > step.id
                  ? 'bg-green-500 text-white'
                  : currentStep === step.id
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 text-gray-600'
              )}
            >
              {currentStep > step.id ? (
                <Check className="h-5 w-5" />
              ) : (
                step.id
              )}
            </div>
            <div className="hidden sm:block">
              <p className={cn(
                'text-sm font-medium',
                currentStep >= step.id ? 'text-gray-900' : 'text-gray-500'
              )}>
                {step.name}
              </p>
              {step.description && (
                <p className="text-xs text-gray-500">{step.description}</p>
              )}
            </div>
          </div>
          {idx < steps.length - 1 && (
            <div className={cn(
              'w-12 sm:w-24 h-0.5 mx-2',
              currentStep > step.id ? 'bg-green-500' : 'bg-gray-200'
            )} />
          )}
        </div>
      ))}
    </nav>
  );
}
