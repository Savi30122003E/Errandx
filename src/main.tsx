import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import {LanguageProvider} from './context/LanguageContext';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <LanguageProvider>
    <App />
  </LanguageProvider>
);

// Offline-capable app shell (PWA). Only in production builds so dev hot-reload stays clean.
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      /* the app works fine without it */
    });
  });
}
