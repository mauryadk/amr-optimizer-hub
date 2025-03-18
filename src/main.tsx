
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './utils/api.ts' // Import API mocks to initialize them

// Add Google Fonts for improved typography - Inter for UI and Poppins for headings
const fontLinkElement = document.createElement('link');
fontLinkElement.rel = 'stylesheet';
fontLinkElement.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Poppins:wght@400;500;600;700&display=swap';
document.head.appendChild(fontLinkElement);

// Add custom styles for professional appearance
const styleElement = document.createElement('style');
styleElement.textContent = `
  :root {
    --font-sans: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
    --font-heading: 'Poppins', var(--font-sans);
  }
  
  html {
    font-feature-settings: "cv02", "cv03", "cv04", "cv09", "cv11";
  }
  
  h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-heading);
  }
  
  body {
    font-family: var(--font-sans);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  
  .page-transition {
    animation: fadeIn 0.3s ease-in-out;
  }
  
  @keyframes fadeIn {
    from { opacity: 0.7; }
    to { opacity: 1; }
  }
`;
document.head.appendChild(styleElement);

// Initialize the app
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
