import { lazy, Suspense } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Layout from '../components/Layout';

// Carga diferida para mejor rendimiento
const Home = lazy(() => import('../pages/Home'));
const Reserva = lazy(() => import('../pages/Reserva'));
const Servicios = lazy(() => import('../pages/Servicios'));
const Login = lazy(() => import('../pages/Login'));
const Registrar = lazy(() => import('../pages/Registrar'));
const Turnos = lazy(() => import('../pages/Turnos'));
const Categorias = lazy(() => import('../pages/Categorias'));
const FAQ = lazy(() => import('../pages/FAQ'));
const SobreNosotros = lazy(() => import('../pages/SobreNosotros'));
const AdminLogin = lazy(() => import('../pages/admin/AdminLogin.jsx'));
const AdminDashboard = lazy(() => import('../pages/admin/AdminDashboard'));
const AdminServicios = lazy(() => import('../pages/admin/AdminServicios'));
const AdminTurnos = lazy(() => import('../pages/admin/AdminTurnos'));
const AdminCuentas = lazy(() => import('../pages/admin/AdminCuentas'));
const AdminRegistrar = lazy(() => import('../pages/admin/AdminRegistrar'));
const ContactoModal = lazy(() => import('../components/ContactoModal'));
const ProfesionalDashboard = lazy(() => import('../pages/admin/ProfesionalDashboard'));
const CrearAdmin = lazy(() => import('../pages/admin/CrearAdmin'));
const VerificarEmail = lazy(() => import('../pages/VerificarEmail.jsx'));
const RegistroProfesional = lazy(() => import('../pages/admin/RegistroProfesional.jsx'));

const AppRoutes = () => {
  const location = useLocation();
  const state = location.state;

  return (
    <Suspense fallback={<div className="loading">Cargando...</div>}>
      <Routes location={state?.backgroundLocation || location}>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registrar />} />
          <Route path="/reservas" element={<Reserva />} />
          <Route path="/turnos" element={<Turnos />} />
          <Route path="/contacto" element={<ContactoModal />} />
          <Route path="/categorias" element={<Categorias />} />
          <Route path="/servicios" element={<Servicios />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/sobre-nosotros" element={<SobreNosotros />} />
          <Route path="/SobreNosotros" element={<Navigate to="/sobre-nosotros" replace />} />
          <Route path="/verificar-email" element={<VerificarEmail />} />
        </Route>

        <Route path="/admin">
          <Route path="login" element={<AdminLogin />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="servicios" element={<AdminServicios />} />
          <Route path="turnos" element={<AdminTurnos />} />
          <Route path="cuentas" element={<AdminCuentas />} />
          <Route path="registrar" element={<AdminRegistrar />} />
          <Route path="crear-admin" element={<CrearAdmin />} />
          <Route path="registro-profesional" element={<RegistroProfesional />} />
          <Route path="profesional/dashboard" element={<ProfesionalDashboard />} />
        </Route>

        {/* Redirección para rutas no reconocidas */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {state?.backgroundLocation && (
        <Routes>
          <Route path="/contacto" element={<ContactoModal />} />
        </Routes>
      )}
    </Suspense>
  );
};

export default AppRoutes;
