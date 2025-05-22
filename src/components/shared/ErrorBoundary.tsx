
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, AlertTriangle, ArrowLeft, Home } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  showDetails?: boolean;
  name?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorTimestamp: number | null;
  sessionDuration: number | null;
  pageLoadTime: number;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
    errorTimestamp: null,
    sessionDuration: null,
    pageLoadTime: performance.now() // Track when component was first mounted
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    // Update state so the next render will show the fallback UI
    return { 
      hasError: true, 
      error: error,
      errorTimestamp: Date.now()
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error(`[ErrorBoundary${this.props.name ? ` (${this.props.name})` : ''}] Uncaught error:`, error, errorInfo);
    
    // Calculate session duration when error occurs
    const sessionDuration = (Date.now() - this.state.pageLoadTime) / 1000; // in seconds
    
    this.setState({
      error,
      errorInfo,
      sessionDuration
    });
    
    // Special handling for "Cannot read properties of undefined" errors
    if (error.message.includes("Cannot read properties of undefined")) {
      const propertyMatch = error.message.match(/reading ['"]([^'"]+)['"]/);
      const propertyName = propertyMatch ? propertyMatch[1] : 'unknown property';
      
      console.warn(`[ErrorBoundary] Data access error detected for property: ${propertyName}`);
      
      // Enhanced logging to help debug data access issues
      console.group('[ErrorBoundary] Data Access Error Debug Info');
      console.log('Property causing error:', propertyName);
      console.log('Component stack:', errorInfo.componentStack);
      console.log('Error occurred after:', `${sessionDuration.toFixed(2)} seconds`);
      console.groupEnd();
    }
    
    // Call onError prop if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
    
    // Show toast notification for error
    toast.error(`${this.props.name || 'Component'} Error`, {
      description: error.message.substring(0, 100) + (error.message.length > 100 ? '...' : ''),
    });
    
    // Log detailed error information for debugging
    console.group(`[ErrorBoundary] Detailed Error (${new Date().toISOString()})`);
    console.log('Error:', error);
    console.log('Component Stack:', errorInfo.componentStack);
    console.log('Session Duration:', `${sessionDuration.toFixed(2)} seconds`);
    console.log('URL:', window.location.href);
    console.log('User Agent:', navigator.userAgent);
    console.groupEnd();
  }
  
  private resetError = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorTimestamp: null
    });
  }

  private goBack = (): void => {
    window.history.back();
    this.resetError();
  }

  private goHome = (): void => {
    window.location.href = '/';
  }

  public render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      // Format error message for better readability
      const formattedError = this.state.error ? this.formatErrorMessage(this.state.error) : "Unknown error";
      const errorTime = this.state.errorTimestamp 
        ? new Date(this.state.errorTimestamp).toLocaleTimeString() 
        : 'unknown time';
      
      // Check if error is related to missing cost data
      const isCostDataError = this.state.error?.message.includes("Cost_") ||
        (this.state.error?.message.includes("Cannot read properties of undefined") && 
         this.state.errorInfo?.componentStack.includes("CostImpact"));
      
      return (
        <div className="py-8 px-4 rounded-lg bg-red-50 border border-red-200 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-red-100 p-3 rounded-full">
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </div>
          
          <h2 className="text-xl font-semibold text-red-800 mb-2">
            {this.props.name ? `${this.props.name} Error` : 'Something went wrong'}
          </h2>
          
          <p className="text-red-700 mb-4">
            {formattedError}
          </p>
          
          {isCostDataError && (
            <p className="text-red-700 font-medium mb-4">
              This appears to be an issue with missing cost data fields.
            </p>
          )}
          
          <p className="text-sm text-gray-600 mb-4">
            Error occurred at {errorTime}
            {this.state.sessionDuration && (
              <span> after {this.formatDuration(this.state.sessionDuration)}</span>
            )}
          </p>
          
          <div className="flex justify-center gap-3 mb-4">
            <Button 
              variant="default"
              onClick={this.resetError}
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" /> Try Again
            </Button>
            
            <Button 
              variant="outline"
              onClick={this.goBack}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" /> Go Back
            </Button>
            
            <Button 
              variant="ghost"
              onClick={this.goHome}
              className="flex items-center gap-2"
            >
              <Home className="h-4 w-4" /> Home
            </Button>
          </div>
          
          {(this.props.showDetails !== false) && this.state.errorInfo && (
            <div className="text-left mt-4 text-sm bg-red-100 p-3 rounded overflow-auto max-h-48">
              <p className="font-mono text-red-800">{this.state.error?.toString()}</p>
              <pre className="mt-2 text-xs text-red-700 overflow-auto">
                {this.state.errorInfo.componentStack}
              </pre>
            </div>
          )}
        </div>
      );
    }

    return this.props.children;
  }
  
  private formatErrorMessage(error: Error): string {
    const message = error.message || String(error);
    
    // Special handling for cost data errors
    if (message.includes("Cannot read properties of undefined") && message.includes("Cost_")) {
      return `Missing cost data field. This could be because the requested cost metrics are not available for this archetype.`;
    }
    
    // If it's a token or authentication error, provide more helpful message
    if (message.includes('token') || message.includes('auth') || message.includes('access')) {
      return `Access error: ${message}. Please try refreshing the page or check your access permissions.`;
    }
    
    if (message.includes('expired')) {
      return `This report link has expired. Please request a new link.`;
    }
    
    if (message.includes('network') || message.includes('fetch') || message.includes('CORS')) {
      return `Network error: Could not connect to the server. Please check your internet connection.`;
    }
    
    // Default case
    return message;
  }
  
  private formatDuration(seconds: number): string {
    if (seconds < 60) {
      return `${Math.floor(seconds)} seconds`;
    } else if (seconds < 3600) {
      return `${Math.floor(seconds / 60)} minutes ${Math.floor(seconds % 60)} seconds`;
    } else {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      return `${hours} hour${hours !== 1 ? 's' : ''} ${minutes} minute${minutes !== 1 ? 's' : ''}`;
    }
  }
}

export default ErrorBoundary;
