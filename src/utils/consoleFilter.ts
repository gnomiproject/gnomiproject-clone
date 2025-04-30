
/**
 * Filters out specific console warnings to reduce noise in the developer console
 * This is particularly useful for third-party scripts that use deprecated APIs
 */

export const setupConsoleFilter = (): void => {
  // Store the original console.warn function
  const originalConsoleWarn = console.warn;

  // Override console.warn to filter out specific warnings
  console.warn = function(...args: any[]) {
    // Filter out the unload event listeners deprecation warning
    const message = args[0]?.toString() || '';
    if (message.includes('Unload event listeners are deprecated')) {
      // Suppress this specific warning
      return;
    }

    // Pass through all other warnings to the original console.warn
    originalConsoleWarn.apply(console, args);
  };

  // Log that the filter has been applied (only in development)
  if (import.meta.env.DEV) {
    console.log('Console warning filter applied - some third-party script warnings are being suppressed');
  }
};
