import { Routes, Route, Navigate } from "react-router-dom";
import { SideBar } from "../principalPage/SideBar";
import Header from "../Header";
import AbmAlumno from "../pages/AbmAlumno";
import PaginaPrincipal from "../pages/Main";
import AbmProfesor from "../pages/AbmProfesor";
import AbmDia from "../pages/AbmDia";
import AbmTipoClase from "../pages/AbmTipoClase";
import AbmLocalidad from "../pages/AbmLocalidad";
import AbmRangoEtario from "../pages/AbmRangoEtario";
import InscripcionClase from "../pages/InscripcionClase";
import CronogramaPage from "../pages/CronogramaPage";
import ConfigurarCronograma from "../pages/ConfigurarCronograma";
import InscripcionProfesor from "../pages/InscripcionProfesor";
import ClasesAlumnos from "../components/ClaseAlumno/ClasesAlumnos";
import Asistencia from "../pages/Asistencia";
import LoginPage from "../pages/LoginPage";
import UnauthorizedPage from "../pages/UnauthorizedPage";
import ProtectedRoute from "../components/ProtectedRoute";
import { useAuth } from "../contexts/AuthContext";

function Aplicacion() {
  const { isAuthenticated } = useAuth();

  // Si no está autenticado, mostrar solo la página de login
  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  // Si está autenticado, mostrar la aplicación completa
  return (
    <div className="d-flex">
      <SideBar isModalOpen={false} />
      <div className="flex-grow-1 d-flex flex-column">
        <div className="p-0 m-0">
          <Header />
        </div>
        <div
          className="flex-grow-1 overflow-auto p-3"
          style={{ height: "calc(100vh - 80px)" }}
        >
          <Routes>
            {/* Rutas públicas para usuarios autenticados */}
            <Route path="/" element={<PaginaPrincipal />} />
            
            {/* Rutas protegidas por roles */}
            <Route 
              path="gestionalumno" 
              element={
                <ProtectedRoute requiredRoles={['ROLE_RECEPCIONISTA', 'ROLE_ADMIN']}>
                  <AbmAlumno />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="gestionprofesor" 
              element={
                <ProtectedRoute requiredRoles={['ROLE_ADMIN']}>
                  <AbmProfesor />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="gestiondia" 
              element={
                <ProtectedRoute requiredRoles={['ROLE_ADMIN']}>
                  <AbmDia />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="gestiontipoclase" 
              element={
                <ProtectedRoute requiredRoles={['ROLE_ADMIN']}>
                  <AbmTipoClase />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="gestionlocalidad" 
              element={
                <ProtectedRoute requiredRoles={['ROLE_ADMIN']}>
                  <AbmLocalidad />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="gestionrangoetario" 
              element={
                <ProtectedRoute requiredRoles={['ROLE_ADMIN']}>
                  <AbmRangoEtario />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="clasesAlumnos" 
              element={
                <ProtectedRoute requiredRoles={['ROLE_ADMIN']}>
                  <ClasesAlumnos />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="configurar-cronograma" 
              element={
                <ProtectedRoute requiredRoles={['ROLE_ADMIN']}>
                  <ConfigurarCronograma />
                </ProtectedRoute>
              } 
            />
            
            {/* Rutas para RECEPCIONISTA y ADMIN */}
            <Route 
              path="inscripcion-clase" 
              element={
                <ProtectedRoute requiredRoles={['ROLE_RECEPCIONISTA', 'ROLE_ADMIN']}>
                  <InscripcionClase />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="inscripcion-profesor" 
              element={
                <ProtectedRoute requiredRoles={['ROLE_RECEPCIONISTA', 'ROLE_ADMIN']}>
                  <InscripcionProfesor />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="asistencia" 
              element={
                <ProtectedRoute requiredRoles={['ROLE_RECEPCIONISTA', 'ROLE_ADMIN']}>
                  <Asistencia />
                </ProtectedRoute>
              } 
            />
            
            {/* Página de error 401 */}
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
            
            {/* Redirección por defecto */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default Aplicacion;
