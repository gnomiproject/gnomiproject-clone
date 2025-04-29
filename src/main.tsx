
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './styles/customColors.css'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './lib/queryClient'

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

// Track DOM focus events with preview-specific handling
if (typeof window !== 'undefined') {
  document.addEventListener('focusin', (event) => {
    const isPreview = window.location.hostname.includes('lovableproject');
    // Log focus events but with reduced verbosity in production
    if (import.meta.env.DEV || isPreview) {
      console.log('Focus changed to:', 
        document.activeElement?.tagName, 
        document.activeElement?.id ? `#${document.activeElement.id}` : '',
        '- User initiated:', event.isTrusted ? 'Yes' : 'No'
      );
    }
  });
  
  // Special handling for preview environment
  if (window.location.hostname.includes('lovableproject')) {
    console.log('Running in Lovable preview environment - applying preview optimizations');
    
    // Force layout recalculation after a short delay
    window.addEventListener('DOMContentLoaded', () => {
      setTimeout(() => {
        document.body.style.opacity = '0.99';
        requestAnimationFrame(() => {
          document.body.style.opacity = '1';
        });
      }, 200);
    });
  }
  
  // Track autofocus elements
  window.addEventListener('DOMContentLoaded', () => {
    const autofocusElements = document.querySelectorAll('[autofocus]');
    console.log(`Found ${autofocusElements.length} elements with autofocus attribute`);
    if (autofocusElements.length > 1) {
      console.warn('Multiple autofocus elements detected, this may cause focus conflicts');
    }
  });
}

// Use a more controlled mount process with preview-specific handling
const mountApp = () => {
  try {
    const rootElement = document.getElementById('root');
    if (!rootElement) {
      console.error('Root element not found in DOM');
      return;
    }

    ReactDOM.createRoot(rootElement).render(
      <React.StrictMode>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </React.StrictMode>
    );
    console.log('Main.tsx: Application mounted successfully');
  } catch (error) {
    console.error('Failed to mount application:', error);
  }
};

// Adaptive mounting strategy based on environment
if (window.location.hostname.includes('lovableproject')) {
  // In preview, use a small delay to ensure DOM is fully ready
  console.log('Using preview-optimized mounting strategy');
  window.addEventListener('DOMContentLoaded', () => {
    setTimeout(mountApp, 100);
  });
} else if ('requestIdleCallback' in window) {
  // Use requestIdleCallback for non-critical initialization in regular browsers
  window.requestIdleCallback(mountApp);
} else {
  // Fallback to setTimeout
  setTimeout(mountApp, 1);
}
