import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import App from './App';
import { ProductsProvider } from './context/ProductsContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <ProductsProvider>
          <App />
        </ProductsProvider>
        <Toaster
          position="bottom-center"
          toastOptions={{
            duration: 2800,
            style: {
              background: '#162A45',
              color: '#FBF7EF',
              fontFamily: 'Jost, sans-serif',
              fontSize: '12px',
              borderRadius: '0',
              padding: '12px 18px',
            },
            success: { iconTheme: { primary: '#D6A32C', secondary: '#162A45' } },
          }}
        />
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>,
);
