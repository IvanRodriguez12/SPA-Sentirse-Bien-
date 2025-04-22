import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from '../components/Layout';

// Carga diferida para mejor performance
const Home = lazy(() => import('../pages/Home'));
const Reserva = lazy(() => import('../pages/Reserva'));
const Servicios = lazy(() => import('../pages/Servicios'));
const SobreNosotros = lazy(() => import('../pages/SobreNosotros'));
const Login = lazy(() => import('../pages/Login'));
const Registrar = lazy(() => import('../pages/Registrar'));
const Turnos = lazy(() => import('../pages/Turnos'));
const Contacto = lazy(() => import('../pages/Contacto'));
const Categorias = lazy(() => import('../pages/Categorias'));

const AppRoutes = () => {
  return (
    <Suspense fallback={<div className="loading">Cargando...</div>}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/sobre-nosotros" element={<SobreNosotros />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registrar />} />
          <Route path="/reservas" element={<Reserva />} />
          <Route path="/turnos" element={<Turnos />} /> 
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/categorias" element={<Categorias />} />
          <Route path="/servicios" element={<Servicios/>} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;