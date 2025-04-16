import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter } from 'react-router-dom'; // Importa BrowserRouter

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter> {/* Envuelve AuthProvider con BrowserRouter */}
      <AuthProvider>
        <App />
        <Toaster position="bottom-right" />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);