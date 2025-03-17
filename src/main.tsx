
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './utils/api.ts' // Import API mocks to initialize them

// Add Google Fonts for improved typography
const fontLinkElement = document.createElement('link');
fontLinkElement.rel = 'stylesheet';
fontLinkElement.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Poppins:wght@400;500;600;700&display=swap';
document.head.appendChild(fontLinkElement);

// Initialize the app
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
