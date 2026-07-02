import React, { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.log("ErrorBoundary caught:", error, errorInfo);
    // send to Sentry/LogRocket here
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? <h3>Something went wrong.</h3>;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;