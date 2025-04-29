
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './styles/customColors.css'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './lib/queryClient'

// Add comprehensive logging to track application initialization and resource loading issues
console.log('Main.tsx: Application initializing');

// Track network errors with proper type checking for different HTML elements
window.addEventListener('error', (e) => {
  if (e.target instanceof HTMLElement) {
    // Determine the resource URL based on element type
    let resourceUrl = '';
    
    if (e.target instanceof HTMLScriptElement || e.target instanceof HTMLImageElement) {
      resourceUrl = e.target.src;
    } else if (e.target instanceof HTMLLinkElement) {
      resourceUrl = e.target.href;
    }
    
    console.warn('Resource error:', resourceUrl, '- Target:', e.target.tagName);
  }
});

// Add listener to track focus events for debugging
if (typeof window !== 'undefined') {
  document.addEventListener('focusin', (event) => {
    console.log('Focus changed to:', 
      document.activeElement?.tagName, 
      document.activeElement?.id ? `#${document.activeElement.id}` : '',
      '- Was user initiated:', event.isTrusted ? 'Yes' : 'No'
    );
  });
  
  // Track autofocus elements when DOM is ready
  window.addEventListener('DOMContentLoaded', () => {
    const autofocusElements = document.querySelectorAll('[autofocus]');
    console.log(`Found ${autofocusElements.length} elements with autofocus attribute`);
    if (autofocusElements.length > 1) {
      console.warn('Multiple autofocus elements detected, this may cause focus conflicts');
    }
  });
}

// Use a more controlled mount process
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

// Use requestIdleCallback for non-critical initialization if available
if ('requestIdleCallback' in window) {
  window.requestIdleCallback(mountApp);
} else {
  // Fallback to setTimeout
  setTimeout(mountApp, 1);
}
