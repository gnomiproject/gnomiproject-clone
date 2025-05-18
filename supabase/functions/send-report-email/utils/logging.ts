
/**
 * Logging utilities for the report email service
 */

// Helper for logging with timestamps
export const log = (message: string) => {
  console.log(`[${new Date().toISOString()}] ${message}`);
};

// Helper for error logging with timestamps
export const logError = (message: string, error: any) => {
  console.error(`[${new Date().toISOString()}] ERROR: ${message}`, error);
};

// Helper for debugging with timestamps and object inspection
export const logDebug = (message: string, data?: any) => {
  if (data) {
    console.log(`[${new Date().toISOString()}] DEBUG: ${message}`, data);
  } else {
    console.log(`[${new Date().toISOString()}] DEBUG: ${message}`);
  }
};

// Helper for tracing function execution with timestamps
export const logTrace = (functionName: string, action: string) => {
  console.log(`[${new Date().toISOString()}] TRACE: ${functionName} - ${action}`);
};

// Helper for warning logs
export const logWarning = (message: string, data?: any) => {
  if (data) {
    console.warn(`[${new Date().toISOString()}] WARNING: ${message}`, data);
  } else {
    console.warn(`[${new Date().toISOString()}] WARNING: ${message}`);
  }
};
