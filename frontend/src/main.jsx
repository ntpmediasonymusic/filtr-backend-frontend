import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import './index.css'
import App from './App.jsx'
import { GTMProvider } from './context/GTMContext.jsx';

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <GTMProvider
        gtmId="GTM-NW2SVN5N">
        <App />
      </GTMProvider>
    </BrowserRouter>
  </StrictMode>
);
