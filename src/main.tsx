import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';
import { BonkooProvider } from './state/context';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BonkooProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </BonkooProvider>
  </StrictMode>,
);
