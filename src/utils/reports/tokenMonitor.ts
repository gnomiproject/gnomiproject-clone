import { toast } from 'sonner';

// Maximum allowed attempts before warning
const MAX_TOKEN_FAILURES = 3;

interface TokenState {
  archetypeId: string;
  tokenPreview: string;
  lastChecked: number;
  checkCount: number;
  failureCount: number;
  lastStatus: 'valid' | 'error' | 'warning' | 'unknown';
  expiresAt?: string;
}

// Keep track of token states
const tokenStates = new Map<string, TokenState>();

/**
 * Record a token check and its result
 */
export const recordTokenCheck = (
  archetypeId: string,
  token: string,
  isValid: boolean,
  expiresAt?: string,
  error?: string
): void => {
  const key = `${archetypeId}-${token}`;
  const tokenPreview = token.substring(0, 5) + '...';
  const now = Date.now();
  
  // Get existing state or create new one
  const existingState = tokenStates.get(key) || {
    archetypeId,
    tokenPreview,
    lastChecked: now,
    checkCount: 0,
    failureCount: 0,
    lastStatus: 'unknown'
  };
  
  // Update state
  const newState: TokenState = {
    ...existingState,
    lastChecked: now,
    checkCount: existingState.checkCount + 1,
    failureCount: isValid ? existingState.failureCount : existingState.failureCount + 1,
    lastStatus: isValid ? 'valid' : 'error',
    expiresAt: expiresAt || existingState.expiresAt
  };
  
  // Store updated state
  tokenStates.set(key, newState);
  
  // Log status
  console.log(`[TokenMonitor] Token check for ${archetypeId}: ${isValid ? 'Valid' : 'Invalid'} (Failures: ${newState.failureCount}/${MAX_TOKEN_FAILURES})`);
  
  // Check for too many failures
  if (newState.failureCount >= MAX_TOKEN_FAILURES && newState.lastStatus === 'error') {
    console.error(`[TokenMonitor] Multiple token validation failures for ${archetypeId} (${newState.failureCount})`);
    
    // Show warning toast only once when threshold is reached
    if (newState.failureCount === MAX_TOKEN_FAILURES) {
      toast.error('Token validation issues', { 
        description: error || 'Your access to this report may be interrupted soon'
      });
    }
  }
  
  // Check for expiration if valid
  if (isValid && expiresAt) {
    const expiryDate = new Date(expiresAt);
    const now = new Date();
    const daysRemaining = (expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
    
    if (daysRemaining < 3) {
      newState.lastStatus = 'warning';
      
      // Show expiration warning only once per day
      const lastWarningKey = `${key}-expiry-warning`;
      const lastWarning = localStorage.getItem(lastWarningKey);
      const today = new Date().toDateString();
      
      if (lastWarning !== today) {
        toast.warning('Report access expiring soon', {
          description: `This report access will expire in ${Math.ceil(daysRemaining)} days`,
        });
        localStorage.setItem(lastWarningKey, today);
      }
    }
  }
};

/**
 * Get the current state of all monitored tokens
 */
export const getTokenMonitorStats = (): {
  totalTokens: number;
  validTokens: number;
  warningTokens: number;
  errorTokens: number;
  tokensWithMultipleFailures: number;
} => {
  let validTokens = 0;
  let warningTokens = 0;
  let errorTokens = 0;
  let tokensWithMultipleFailures = 0;
  
  tokenStates.forEach(state => {
    if (state.lastStatus === 'valid') validTokens++;
    if (state.lastStatus === 'warning') warningTokens++;
    if (state.lastStatus === 'error') errorTokens++;
    if (state.failureCount > 1) tokensWithMultipleFailures++;
  });
  
  return {
    totalTokens: tokenStates.size,
    validTokens,
    warningTokens,
    errorTokens,
    tokensWithMultipleFailures
  };
};

/**
 * Clear all token monitoring data
 */
export const clearTokenMonitorData = (): void => {
  tokenStates.clear();
  console.log('[TokenMonitor] All monitoring data cleared');
};

/**
 * Get detailed debugging data for a specific token
 */
export const getTokenDebugInfo = (archetypeId: string, token: string): TokenState | null => {
  const key = `${archetypeId}-${token}`;
  return tokenStates.get(key) || null;
};

/**
 * Check if a token is approaching expiration
 */
export const isTokenNearExpiration = (expiresAt?: string, warningDays = 3): boolean => {
  if (!expiresAt) return false;
  
  const expiryDate = new Date(expiresAt);
  const now = new Date();
  const daysRemaining = (expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
  
  return daysRemaining < warningDays;
};
