console.log("main.tsx: File loaded - very first line");

import { StrictMode } from 'react'
console.log("main.tsx: React StrictMode imported");

import { createRoot } from 'react-dom/client'
console.log("main.tsx: createRoot imported");

import App from './App.tsx'
console.log("main.tsx: App component imported");

import './index.css'
console.log("main.tsx: CSS imported");

console.log("main.tsx: Starting application initialization");

try {
  console.log("main.tsx: Getting root element");
  const rootElement = document.getElementById('root');
  
  if (!rootElement) {
    console.error("main.tsx: Root element not found!");
    throw new Error("Root element not found");
  }
  
  console.log("main.tsx: Root element found, creating React root");
  const root = createRoot(rootElement);
  
  console.log("main.tsx: Rendering App component");
  root.render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
  
  console.log("main.tsx: App component rendered successfully");
} catch (error) {
  console.error("main.tsx: Critical error during app initialization:", error);
  console.error("main.tsx: Error stack:", error.stack);
  
  // Try to show error in the DOM
  const rootElement = document.getElementById('root');
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="color: white; background-color: red; padding: 20px; font-family: monospace;">
        <h1>Application Error</h1>
        <p>Error: ${error.message}</p>
        <pre>${error.stack}</pre>
      </div>
    `;
  }
}