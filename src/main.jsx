import { createRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';
import App from './app/App.jsx';
import './styles/global.css';
flushSync(() => createRoot(document.getElementById('app')).render(<App />));
// Controllers must initialize after their DOM hosts have mounted.
import('./app/bootstrap.js').catch(error => { console.error(error); document.getElementById('stage').textContent = 'Unable to start Mandi. Please reload.'; });
