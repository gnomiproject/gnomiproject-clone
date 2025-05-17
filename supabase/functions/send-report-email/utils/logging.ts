
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
