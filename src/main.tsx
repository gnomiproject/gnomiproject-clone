
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './styles/customColors.css'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './lib/queryClient'

// Add comprehensive logging to track application initialization and focus issues
console.log('Main.tsx: Application initializing');

// Add listener to track focus events for debugging
if (typeof window !== 'undefined') {
  document.addEventListener('focusin', () => {
    console.log('Focus changed to:', document.activeElement?.tagName, 
      document.activeElement?.id ? `#${document.activeElement.id}` : '');
  });
  
  // Log any autofocus elements on the page
  window.addEventListener('DOMContentLoaded', () => {
    const autofocusElements = document.querySelectorAll('[autofocus]');
    console.log(`Found ${autofocusElements.length} elements with autofocus attribute`);
  });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>,
)
