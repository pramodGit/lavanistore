import React, { Component } from "react";

class ErrorBoundary extends Component<{}, {hasError: boolean}> {
    errorMessage: string;
    constructor(props: any) {
        super(props);
        this.state = { hasError: false };
        this.errorMessage = props.errorMessage;
    }
    static getDerivedStateFromError(error: any) {
        alert(error);
        return { hasError: true }
    }
    componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
        alert(errorInfo);
        console.log(error, errorInfo);
    }
    render() {
        if(this.errorMessage) {
            return (
                <h3>{this.errorMessage}</h3>
            )
        } else {
            return this.props.children;
        }
        
    }
}

export default ErrorBoundary;