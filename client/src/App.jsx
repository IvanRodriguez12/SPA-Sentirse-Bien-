import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'
import { Toaster } from 'react-hot-toast';
import AppRoutes from './routes/AppRoutes';
import './app.css';
import './index.css';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <AppRoutes />
    <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#81c784',
            color: '#fff',
          },
        }}></Toaster>
    </ErrorBoundary>
  );
}

export default App;
