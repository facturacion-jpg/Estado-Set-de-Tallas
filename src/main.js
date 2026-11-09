import ReactDOM from 'react-dom/client';
import {html} from './lib.js';
import App from './App.js';
import './styles.css';

ReactDOM.createRoot(document.getElementById('root')).render(html`<${App}/>`);
