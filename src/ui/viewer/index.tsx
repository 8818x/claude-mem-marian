// Modified by the Marian fork: apply the saved theme before mounting.
import React from 'react';
import { createRoot } from 'react-dom/client';
import { applyTheme, readTheme } from './themes';
import { App } from './App';
import { ErrorBoundary } from './components/ErrorBoundary';

applyTheme(readTheme());

const container = document.getElementById('root');
if (!container) {
  throw new Error('Root element not found');
}

const root = createRoot(container);
root.render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
