// App.jsx (CORREGIDO)
import { Toaster } from 'react-hot-toast';
import AppRoutes from './routes/AppRoutes';
import './app.css';
import './index.css';
import ErrorBoundary from './components/ErrorBoundary';
import { AdminAuthProvider } from './context/AdminAuthContext';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AdminAuthProvider>
          <AppRoutes />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#81c784',
                color: '#fff',
              },
            }}
          />
        </AdminAuthProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;