import React from 'react';

interface SwitchProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
  variant?: 'default' | 'small';
}

export default function Switch({
  checked = false,
  onChange,
  label,
  disabled = false,
  className = '',
  variant = 'default',
}: SwitchProps) {
  const handleToggle = () => {
    if (disabled || !onChange) return;
    onChange(!checked);
  };

  const variantStyles = {
    default: {
      track: 'w-12 h-6',
      knob: 'w-5 h-5 top-0.5 left-0.5',
      translate: 'translate-x-6',
    },
    small: {
      track: 'w-8 h-4',
      knob: 'w-3 h-3 top-0.5 left-0.5',
      translate: 'translate-x-4',
    },
  };

  const { track, knob, translate } = variantStyles[variant];

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {label && <span className="text-sm text-muted-foreground">{label}</span>}
      <button
        type="button"
        onClick={handleToggle}
        disabled={disabled}
        className={`relative ${track} rounded-full transition-colors duration-300 
          ${checked ? 'bg-blue-500' : 'bg-gray-300'} 
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <span
          className={`absolute ${knob} rounded-full bg-white transition-transform duration-300 
            ${checked ? translate : 'translate-x-0'}`}
        />
      </button>
    </div>
  );
}
