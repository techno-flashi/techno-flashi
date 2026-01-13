'use client';

import { ReactNode } from 'react';

interface AdminFormProps {
  children: ReactNode;
  onSubmit?: (e: React.FormEvent) => void;
  className?: string;
}

interface AdminInputProps {
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
}

interface AdminTextareaProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  required?: boolean;
  rows?: number;
  className?: string;
}

interface AdminSelectProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[];
  required?: boolean;
  className?: string;
}

interface AdminButtonProps {
  children: ReactNode;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'danger';
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

// Main Form Component
export function AdminForm({ children, onSubmit, className = '' }: AdminFormProps) {
  return (
    <form 
      onSubmit={onSubmit} 
      className={`admin-form ${className}`}
      suppressHydrationWarning
    >
      {children}
    </form>
  );
}

// Input Component
export function AdminInput({ 
  label, 
  type = 'text', 
  value, 
  onChange, 
  placeholder, 
  required = false,
  className = ''
}: AdminInputProps) {
  return (
    <div className={`mb-4 ${className}`} suppressHydrationWarning>
      <label 
        className="block text-sm font-medium mb-2"
        style={{ color: '#000000' }}
      >
        {label}
        {required && <span style={{ color: '#dc2626' }}> *</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        style={{ 
          backgroundColor: '#ffffff',
          color: '#000000',
          borderColor: '#d1d5db'
        }}
      />
    </div>
  );
}

// Textarea Component
export function AdminTextarea({ 
  label, 
  value, 
  onChange, 
  placeholder, 
  required = false,
  rows = 4,
  className = ''
}: AdminTextareaProps) {
  return (
    <div className={`mb-4 ${className}`} suppressHydrationWarning>
      <label 
        className="block text-sm font-medium mb-2"
        style={{ color: '#000000' }}
      >
        {label}
        {required && <span style={{ color: '#dc2626' }}> *</span>}
      </label>
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        rows={rows}
        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        style={{ 
          backgroundColor: '#ffffff',
          color: '#000000',
          borderColor: '#d1d5db'
        }}
      />
    </div>
  );
}

// Select Component
export function AdminSelect({ 
  label, 
  value, 
  onChange, 
  options, 
  required = false,
  className = ''
}: AdminSelectProps) {
  return (
    <div className={`mb-4 ${className}`} suppressHydrationWarning>
      <label 
        className="block text-sm font-medium mb-2"
        style={{ color: '#000000' }}
      >
        {label}
        {required && <span style={{ color: '#dc2626' }}> *</span>}
      </label>
      <select
        value={value}
        onChange={onChange}
        required={required}
        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        style={{ 
          backgroundColor: '#ffffff',
          color: '#000000',
          borderColor: '#d1d5db'
        }}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

// Button Component
export function AdminButton({ 
  children, 
  type = 'button', 
  variant = 'primary', 
  onClick, 
  disabled = false,
  className = ''
}: AdminButtonProps) {
  const getButtonStyles = () => {
    const baseStyles = {
      padding: '0.5rem 1rem',
      borderRadius: '0.375rem',
      fontWeight: '600',
      border: 'none',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.6 : 1
    };

    switch (variant) {
      case 'primary':
        return {
          ...baseStyles,
          backgroundColor: '#3b82f6',
          color: '#ffffff'
        };
      case 'secondary':
        return {
          ...baseStyles,
          backgroundColor: '#6b7280',
          color: '#ffffff'
        };
      case 'danger':
        return {
          ...baseStyles,
          backgroundColor: '#dc2626',
          color: '#ffffff'
        };
      default:
        return baseStyles;
    }
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`transition-colors duration-200 ${className}`}
      style={getButtonStyles()}
      suppressHydrationWarning
    >
      {children}
    </button>
  );
}

// Container Component
export function AdminContainer({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div 
      className={`admin-container min-h-screen p-6 ${className}`}
      style={{ backgroundColor: '#1a1a1a' }}
      suppressHydrationWarning
    >
      <div className="max-w-7xl mx-auto">
        {children}
      </div>
    </div>
  );
}

// Page Header Component
export function AdminPageHeader({ 
  title, 
  description, 
  action 
}: { 
  title: string; 
  description?: string; 
  action?: ReactNode 
}) {
  return (
    <div className="flex justify-between items-center mb-8" suppressHydrationWarning>
      <div>
        <h1 className="text-3xl font-bold" style={{ color: '#000000' }}>{title}</h1>
        {description && (
          <p className="mt-2" style={{ color: '#000000' }}>{description}</p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

// Error Message Component
export function AdminError({ message }: { message: string }) {
  return (
    <div 
      className="border px-4 py-3 rounded-md mb-6"
      style={{ backgroundColor: '#fef2f2', borderColor: '#dc2626', color: '#dc2626' }}
      suppressHydrationWarning
    >
      {message}
    </div>
  );
}

// Success Message Component
export function AdminSuccess({ message }: { message: string }) {
  return (
    <div 
      className="border px-4 py-3 rounded-md mb-6"
      style={{ backgroundColor: '#f0fdf4', borderColor: '#16a34a', color: '#16a34a' }}
      suppressHydrationWarning
    >
      {message}
    </div>
  );
}
