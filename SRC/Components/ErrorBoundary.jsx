import { Component } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/UI/button';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f] p-6">
          <div className="max-w-2xl w-full text-center">
            <div className="mb-8">
              <AlertTriangle className="w-24 h-24 text-red-500 mx-auto mb-4" />
              <h1 className="text-4xl font-bold text-white mb-4">
                Something went wrong
              </h1>
              <p className="text-gray-400 text-lg mb-8">
                We're sorry, but something unexpected happened. Please try refreshing the page.
              </p>
            </div>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mb-8 p-6 bg-red-500/10 border border-red-500/30 rounded-lg text-left">
                <h2 className="text-red-400 font-semibold mb-2">Error Details:</h2>
                <pre className="text-sm text-gray-300 overflow-auto">
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </div>
            )}

            <div className="flex gap-4 justify-center">
              <Button
                onClick={this.handleReset}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-full px-8"
              >
                Go to Home
              </Button>
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10 rounded-full px-8"
              >
                Refresh Page
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
