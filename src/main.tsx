import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AcademicProvider } from './contexts/AcademicContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <AcademicProvider>
        <App />
      </AcademicProvider>
    </ErrorBoundary>
  </StrictMode>,
);
