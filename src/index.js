import React from 'react';
import {createRoot} from 'react-dom/client';

import App from './App';

const rootId = 'root';
const rootElement = document.getElementById(rootId);
if (!rootElement) {
    throw new Error(`Unable to find element with id '${rootId}'`);
}

createRoot(rootElement).render(
    <React.StrictMode>
        <App/>
    </React.StrictMode>,
)
