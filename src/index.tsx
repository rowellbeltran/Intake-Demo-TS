import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Global Styles
const globalStyles = `
  * {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  
  body {
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
    font-size: 14px;
    line-height: 1.6;
    color: #1f2937;
  }
  
  h1, h2, h3, h4, h5, h6 {
    margin: 0;
    font-weight: 600;
    letter-spacing: -0.01em;
  }
  
  input, select, textarea, button {
    font-family: inherit;
    font-size: inherit;
  }
  
  button {
    cursor: pointer;
  }
  
  input:focus, select:focus, textarea:focus {
    outline: 2px solid #2563eb;
    outline-offset: 2px;
  }
  
  table {
    border-collapse: collapse;
  }
`;

const style = document.createElement('style');
style.innerHTML = globalStyles;
document.head.appendChild(style);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);