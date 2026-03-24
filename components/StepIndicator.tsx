'use client';

interface StepIndicatorProps {
  currentStep: number;
  steps: string[];
}

export default function StepIndicator({ currentStep, steps }: StepIndicatorProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0', padding: '20px 0', justifyContent: 'center' }}>
      {steps.map((step, index) => {
        const stepNum = index + 1;
        const isActive = stepNum === currentStep;
        const isCompleted = stepNum < currentStep;

        return (
          <div key={step} style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '13px',
                  fontWeight: 700,
                  background: isActive
                    ? 'linear-gradient(135deg, #2563EB, #3B82F6)'
                    : isCompleted
                    ? 'linear-gradient(135deg, #10B981, #34D399)'
                    : '#F1F5F9',
                  color: isActive || isCompleted ? 'white' : '#94A3B8',
                  boxShadow: isActive
                    ? '0 2px 8px rgba(37,99,235,0.3)'
                    : isCompleted
                    ? '0 2px 8px rgba(16,185,129,0.2)'
                    : 'none',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              >
                {isCompleted ? '✓' : stepNum}
              </div>
              <span
                style={{
                  fontSize: '13px',
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? '#0F172A' : '#94A3B8',
                  letterSpacing: '-0.01em',
                  transition: 'all 0.3s',
                }}
              >
                {step}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                style={{
                  width: '40px',
                  height: '2px',
                  margin: '0 12px',
                  borderRadius: '1px',
                  background: isCompleted
                    ? 'linear-gradient(90deg, #10B981, #34D399)'
                    : '#E2E8F0',
                  transition: 'all 0.4s',
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
