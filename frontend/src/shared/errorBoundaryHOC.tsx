import { ComponentType, ReactNode } from "react";
import ErrorBoundary from "../context/ErrorBoundary";

interface WithErrorBoundaryProps {
  fallback?: ReactNode;
}

function withErrorBoundary<P extends object>(
  WrappedComponent: ComponentType<P>,
  fallback?: ReactNode
) {
  const WithErrorBoundary = (props: P & WithErrorBoundaryProps) => {
    // Allow overriding fallback via props if needed
    const finalFallback = props.fallback ?? fallback;
    
    return (
      <ErrorBoundary fallback={finalFallback}>
        <WrappedComponent {...(props as P)} />
      </ErrorBoundary>
    );
  };

  // Set displayName for better DevTools debugging
  const displayName = WrappedComponent.displayName || WrappedComponent.name || "Component";
  WithErrorBoundary.displayName = `withErrorBoundary(${displayName})`;

  return WithErrorBoundary;
}

export default withErrorBoundary;