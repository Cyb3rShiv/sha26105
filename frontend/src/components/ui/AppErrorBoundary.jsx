import React, { Component } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export default class AppErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('AppErrorBoundary caught an unexpected error:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  handleReturnToOverview = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onNavigate) {
      this.props.onNavigate('dashboard');
    } else {
      window.location.hash = '#dashboard';
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-6 text-center font-sans">
          <div className="max-w-md w-full panel p-8 border-slate-200 bg-white shadow-xl rounded-2xl space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto text-amber-700">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Something went wrong</h1>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                The risk management console encountered an unexpected rendering issue. All analytical models and stored session parameters remain intact.
              </p>
            </div>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={this.handleRetry}
                className="btn btn-secondary w-full sm:w-auto text-xs font-semibold flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry</span>
              </button>
              <button
                type="button"
                onClick={this.handleReturnToOverview}
                className="btn btn-primary w-full sm:w-auto text-xs font-semibold flex items-center justify-center gap-2"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Return to Risk Overview</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
