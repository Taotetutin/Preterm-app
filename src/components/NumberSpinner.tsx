import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface NumberSpinnerProps {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  label: string;
  helperText?: string;
  name: string;
}

export function NumberSpinner({ value, onChange, min, max, label, helperText, name }: NumberSpinnerProps) {
  const increment = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  const decrement = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };

  return (
    <div className="block">
      <label className="text-gray-700">{label}</label>
      <div className="mt-1 relative flex">
        <input
          type="text"
          name={name}
          value={value}
          readOnly
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 text-center"
        />
        <div className="absolute right-0 inset-y-0 flex flex-col">
          <button
            type="button"
            onClick={increment}
            disabled={value >= max}
            className="flex-1 px-2 bg-gray-100 hover:bg-gray-200 rounded-tr-md border-l border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronUp className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={decrement}
            disabled={value <= min}
            className="flex-1 px-2 bg-gray-100 hover:bg-gray-200 rounded-br-md border-l border-t border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </div>
      {helperText && <span className="text-sm text-gray-500">{helperText}</span>}
    </div>
  );
}