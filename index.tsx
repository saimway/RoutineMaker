
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { pdfjs } from 'react-pdf';

// PDF worker path needs to be configured at the entry point.
// Using a CDN and the version from the pdfjs object ensures compatibility.
// This is a common fix for deployment environments like Vercel where static asset paths can be tricky.
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.mjs`;

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
