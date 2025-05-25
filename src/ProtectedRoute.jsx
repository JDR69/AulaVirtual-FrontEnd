import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../src/context/AuthContext';

const ProtectedRoute = () => {
    const { isAuthenticated, isLoading, checkAuth } = useAuth();
    
    // Verifica el estado de autenticación antes de renderizar
    if (isLoading) {
        return <div>Cargando...</div>; // Muestra un indicador de carga mientras se verifica
    }
    
    // Verifica si el usuario está autenticado
    const isUserAuth = checkAuth();
    
    // Redirige a login si no está autenticado
    if (!isUserAuth) {
        return <Navigate to="/" replace />;
    }
    
    // Permite el acceso a la ruta protegida
    return <Outlet />;
};

export default ProtectedRoute;