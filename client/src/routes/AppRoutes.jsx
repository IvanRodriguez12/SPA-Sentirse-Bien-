import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from '../components/Layout';
import LoadingSpinner from '../components/LoadingSpinner';

// Carga diferida para mejor performance
const Home = lazy(() => import('../pages/Home'));
const BookAppointment = lazy(() => import('../pages/BookAppointment'));
const Servicios = lazy(() => import('../pages/Servicios'));
const SobreNosotros = lazy(() => import('../pages/SobreNosotros'));
const Login = lazy(() => import('../pages/Login'));
const Registrar = lazy(() => import('../pages/Registrar'));

const AppRoutes = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/sobre-nosotros" element={<SobreNosotros />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registrar />} />
          <Route path="/reservas" element={<BookAppointment />} />
          <Route path="/servicios" element={<Servicios/>} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;