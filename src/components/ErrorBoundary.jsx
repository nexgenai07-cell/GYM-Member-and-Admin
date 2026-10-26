import { Component } from 'react';
import { tl } from '../i18n';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full py-16 px-6 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-full bg-error/15 flex items-center justify-center mb-4">
            <span className="material-symbols-outlined text-3xl text-error">
              error
            </span>
          </div>
          <h2 className="font-headline-md text-headline-md text-on-surface uppercase tracking-wide">
            {tl("Something went wrong")}
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-2 max-w-md">
            {this.state.error?.message || tl("An unexpected error occurred.")}
          </p>
          <button
            onClick={() => {
              this.setState({ hasError: false, error: null });
              window.location.reload();
            }}
            className="mt-6 px-6 py-2 rounded-lg bg-primary-container hover:bg-secondary-container text-on-primary-container font-label-lg uppercase tracking-wider font-bold transition-all"
            type="button"
          >
            {tl("Reload Page")}
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}