/**
 * Loading Spinner Component - مكون دوار التحميل
 * Hospital Management System
 */

import React from 'react';
import classNames from 'classnames';

/**
 * LoadingSpinner Component
 * @param {string} size - Size of the spinner (sm, md, lg, xl)
 * @param {string} color - Color of the spinner
 * @param {string} className - Additional CSS classes
 * @param {string} text - Loading text to display
 */
function LoadingSpinner({ 
  size = 'md', 
  color = 'primary', 
  className = '', 
  text = 'جاري التحميل...' 
}) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  const colorClasses = {
    primary: 'text-primary-600',
    secondary: 'text-secondary-600',
    white: 'text-white',
    success: 'text-success-600',
    warning: 'text-warning-600',
    danger: 'text-danger-600'
  };

  const spinnerClasses = classNames(
    'loading-spinner',
    sizeClasses[size],
    colorClasses[color],
    className
  );

  return (
    <div className="flex flex-col items-center justify-center space-y-2">
      <div className={spinnerClasses}></div>
      {text && (
        <p className="text-sm text-secondary-600 font-medium">
          {text}
        </p>
      )}
    </div>
  );
}

export default LoadingSpinner;
