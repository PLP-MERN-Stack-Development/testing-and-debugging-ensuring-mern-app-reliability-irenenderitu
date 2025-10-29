import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './App.css'

// Error handler for uncaught errors
const handleGlobalError = (error, errorInfo) => {
  console.error('[Global Error Handler] Uncaught error:', error);
  console.error('[Global Error Handler] Error info:', errorInfo);
  
  // In a real app, you might send this to an error reporting service
  // like Sentry, LogRocket, etc.
};

// Catch unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  console.error('[Global Error Handler] Unhandled promise rejection:', event.reason);
  event.preventDefault();
});

// Catch JavaScript errors
window.addEventListener('error', (event) => {
  console.error('[Global Error Handler] JavaScript error:', event.error);
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)