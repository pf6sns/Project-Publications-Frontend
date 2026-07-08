/**
 * components/common/ErrorBoundary.jsx
 *
 * React Error Boundary for top-level crash handling.
 * Catches unexpected runtime errors in the component tree.
 * Place at the app root in main.jsx.
 */

import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary] Uncaught error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
          <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 shadow-md p-8 text-center space-y-4">
            <div className="h-16 w-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto">
              <svg className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.07 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900">Something went wrong</h2>
              <p className="text-sm text-slate-500 mt-1">
                An unexpected error occurred. Please refresh the page.
              </p>
              {this.state.error && (
                <p className="text-xs text-red-500 mt-2 font-mono bg-red-50 rounded-lg p-2">
                  {this.state.error.message}
                </p>
              )}
            </div>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2.5 bg-charcoal text-white text-sm font-bold rounded-xl hover:bg-steel-gray transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
