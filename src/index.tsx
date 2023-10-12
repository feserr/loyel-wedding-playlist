import './index.css';

import 'bootstrap/dist/css/bootstrap.min.css';

import { createRoot } from 'react-dom/client';

import App from './components/App/App';
import registerServiceWorker from './registerServiceWorker';

const rootElement: HTMLElement | null = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

const root = createRoot(rootElement);
root.render(<App />)

registerServiceWorker();
