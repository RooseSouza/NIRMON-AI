import React from 'react';
import { CheckCircle2, Circle } from 'lucide-react';

interface FormStepperProps {
  currentStep: number;
}

const steps = [
  "Parameters",
  "Decks",
  "Compartments",
  "Tanks",
  "Tank Segregation",
  "Machinery",
  "Adjacency",
  "Bulkheads",
  "Cargo Holds",
  "Engine Room",
  "Access Openings"
];

const FormStepper: React.FC<FormStepperProps> = ({ currentStep }) => {
  return (
    <div className="w-full py-6 bg-white border-b border-gray-200 mb-8">
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const stepNumber = index + 1;
            const isCompleted = currentStep > stepNumber;
            const isActive = currentStep === stepNumber;

            return (
              <div key={step} className="flex flex-col items-center flex-1 relative">
                {/* Line connecting steps */}
                {index !== 0 && (
                  <div className={`absolute h-0.5 top-4 -left-1/2 w-full ${isCompleted ? 'bg-blue-600' : 'bg-gray-200'}`} />
                )}
                
                {/* Icon */}
                <div className={`relative z-10 rounded-full p-1 ${isActive ? 'bg-blue-100' : 'bg-white'}`}>
                  {isCompleted ? (
                    <CheckCircle2 className="text-blue-600" size={28} />
                  ) : (
                    <div className={`rounded-full border-2 w-7 h-7 flex items-center justify-center ${isActive ? 'border-blue-600 text-blue-600 font-bold' : 'border-gray-300 text-gray-400'}`}>
                      {stepNumber}
                    </div>
                  )}
                </div>
                
                {/* Label */}
                <span className={`text-xs mt-2 text-center font-medium ${isActive ? 'text-blue-700' : 'text-gray-500'}`}>
                  {step}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FormStepper;