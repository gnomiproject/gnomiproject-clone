
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './styles/customColors.css'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './lib/queryClient'
import { setupConsoleFilter } from './utils/consoleFilter'

// Set up console filter to suppress specific warnings
setupConsoleFilter();

// Enhanced font loading performance monitoring
document.fonts.ready.then(() => {
  console.log('Fonts have finished loading');
  
  // Force redraw after fonts are loaded to prevent FOUT (Flash of Unstyled Text)
  document.body.style.opacity = '0.99';
  setTimeout(() => {
    document.body.style.opacity = '1';
    
    // Log successful font loading for specific fonts
    const poppinsLoaded = document.fonts.check('12px Poppins');
    const aliceLoaded = document.fonts.check('12px Alice');
    console.log('Font loading status:', {
      poppins: poppinsLoaded ? 'Loaded' : 'Failed',
      alice: aliceLoaded ? 'Loaded' : 'Failed'
    });
  }, 0);
}).catch(err => {
  console.warn('Font loading error:', err);
  // Continue with system fonts if custom fonts fail
  document.documentElement.classList.add('fonts-failed');
});

// Add comprehensive error handling for Google Fonts
const fontLinks = document.querySelectorAll('link[href*="fonts.googleapis.com"]');
fontLinks.forEach(link => {
  link.addEventListener('error', (event) => {
    console.warn('Google Font stylesheet failed to load:', event);
    document.documentElement.classList.add('fonts-failed');
  });
});

// Add comprehensive logging to track application initialization in different environments
console.log('Main.tsx: Application initializing', {
  environment: import.meta.env.MODE,
  isPreview: window.location.hostname.includes('lovableproject'),
  viewport: {
    width: window.innerWidth,
    height: window.innerHeight
  }
});

// Enhanced error tracking with environment detection
window.addEventListener('error', (e) => {
  // Skip non-element errors
  if (!(e.target instanceof HTMLElement)) return;
  
  // Determine the resource URL based on element type
  let resourceUrl = '';
  let resourceType = 'unknown';
  
  if (e.target instanceof HTMLScriptElement) {
    resourceUrl = e.target.src;
    resourceType = 'script';
  } else if (e.target instanceof HTMLLinkElement) {
    resourceUrl = e.target.href;
    resourceType = 'link';
  } else if (e.target instanceof HTMLImageElement) {
    resourceUrl = e.target.src;
    resourceType = 'image';
  }
  
  console.warn('Resource loading error:', {
    url: resourceUrl,
    type: resourceType,
    element: e.target.tagName,
    isPreview: window.location.hostname.includes('lovableproject')
  });
});

// Simplified React mounting process
const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error('Root element not found in DOM');
} else {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </React.StrictMode>
  );
  console.log('Main.tsx: Application mounted successfully');
}

// Improved focus tracking with reduced verbosity
if (typeof window !== 'undefined') {
  let lastFocusLogTimestamp = 0;
  const FOCUS_LOG_INTERVAL = 60000; // Only log focus changes once per minute to reduce spam
  
  document.addEventListener('focusin', (event) => {
    const now = Date.now();
    // Only log if enough time has passed since last log
    if (now - lastFocusLogTimestamp > FOCUS_LOG_INTERVAL) {
      lastFocusLogTimestamp = now;
      const isPreview = window.location.hostname.includes('lovableproject');
      // Log focus events but with reduced verbosity in production
      if (import.meta.env.DEV || isPreview) {
        console.log('Focus changed to:', 
          document.activeElement?.tagName, 
          document.activeElement?.id ? `#${document.activeElement.id}` : '',
          '- User initiated:', event.isTrusted ? 'Yes' : 'No'
        );
      }
    }
  });
  
  // Special handling for preview environment - avoid extra redraws
  if (window.location.hostname.includes('lovableproject')) {
    console.log('Running in Lovable preview environment - applying preview optimizations');
    
    // Only do this on initial load, not on subsequent interactions
    window.addEventListener('DOMContentLoaded', () => {
      // Use a single RAF instead of opacity toggling
      requestAnimationFrame(() => {
        document.body.classList.add('preview-optimized');
      });
    }, { once: true });
  }
  
  // Track autofocus elements - only once on initial load
  window.addEventListener('DOMContentLoaded', () => {
    const autofocusElements = document.querySelectorAll('[autofocus]');
    console.log(`Found ${autofocusElements.length} elements with autofocus attribute`);
    if (autofocusElements.length > 1) {
      console.warn('Multiple autofocus elements detected, this may cause focus conflicts');
    }
  }, { once: true });
  
  // Improved visibility change handling to prevent unnecessary refresh cycles
  document.addEventListener('visibilitychange', () => {
    const isVisible = document.visibilityState === 'visible';
    console.log(`[App] Page visibility changed: ${isVisible ? 'active' : 'background'}`);
    
    // Don't trigger any refreshes or validations on visibility change
    // We'll let the periodic checks handle those if needed
  });
}
