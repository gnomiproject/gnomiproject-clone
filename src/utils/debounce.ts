
/**
 * Creates a debounced function that delays invoking func until after wait milliseconds
 * have elapsed since the last time the debounced function was invoked.
 * 
 * @param func The function to debounce
 * @param wait The number of milliseconds to delay
 * @param leading Whether to invoke the function on the leading edge of the timeout
 * @returns Debounced function
 */
export function debounce<F extends (...args: any[]) => any>(
  func: F,
  wait: number,
  leading = false
): (...args: Parameters<F>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let lastCallTime = 0;

  return function(...args: Parameters<F>) {
    const now = Date.now();
    const isInvokedOnLeadingEdge = leading && (now - lastCallTime) > wait;
    
    lastCallTime = now;
    
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    
    if (isInvokedOnLeadingEdge) {
      func(...args);
    } else {
      timeoutId = setTimeout(() => {
        func(...args);
        timeoutId = null;
      }, wait);
    }
  };
}

/**
 * Creates a throttled function that only invokes func at most once per every wait milliseconds.
 * 
 * @param func The function to throttle
 * @param wait The number of milliseconds to throttle invocations to
 * @returns Throttled function
 */
export function throttle<F extends (...args: any[]) => any>(
  func: F,
  wait: number
): (...args: Parameters<F>) => void {
  let lastCallTime = 0;
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let lastArgs: Parameters<F> | null = null;
  
  return function(...args: Parameters<F>) {
    const now = Date.now();
    const timeSinceLastCall = now - lastCallTime;
    
    // Store the latest arguments
    lastArgs = args;
    
    // If it's the first call or enough time has passed
    if (timeSinceLastCall >= wait || lastCallTime === 0) {
      lastCallTime = now;
      func(...args);
    } else if (!timeoutId) {
      // Schedule the next call at the end of the throttling interval
      timeoutId = setTimeout(() => {
        lastCallTime = Date.now();
        timeoutId = null;
        
        // Use the most recent arguments
        if (lastArgs) {
          func(...lastArgs);
          lastArgs = null;
        }
      }, wait - timeSinceLastCall);
    }
  };
}
