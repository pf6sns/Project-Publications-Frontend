/**
 * components/common/ErrorMessage.jsx
 *
 * Reusable inline error message component.
 * Use for field-level, section-level, and page-level error display.
 */

import React from 'react';
import { AlertCircle } from 'lucide-react';

/**
 * @param {{ message: string, onRetry?: () => void }} props
 */
export function ErrorMessage({ message, onRetry }) {
  if (!message) return null;

  return (
    <div
      role="alert"
      className="flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm animate-fade-in"
    >
      <AlertCircle className="h-5 w-5 shrink-0 mt-0.5 text-red-500" />
      <div className="flex-1">
        <p className="font-semibold">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-2 text-xs font-bold text-red-600 underline hover:text-red-800 transition-colors"
          >
            Try again
          </button>
        )}
      </div>
    </div>
  );
}

export default ErrorMessage;
