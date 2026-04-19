import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="max-w-lg mx-auto px-4 py-20 text-center">
          <h1 className="text-xl font-semibold text-slate-900 dark:text-white">Something went wrong</h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            {this.state.error?.message || 'Something unexpected went wrong.'}
          </p>
          <button
            type="button"
            className="mt-6 rounded-xl bg-portal-glow/20 border border-portal-glow/50 px-4 py-2 text-sm font-medium text-portal-glow hover:bg-portal-glow/30"
            onClick={() => window.location.reload()}
          >
            Reload page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
