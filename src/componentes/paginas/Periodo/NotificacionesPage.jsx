import React, { useState, useEffect } from 'react'
import '../../css/Notificacion.css'
import { obtenerNotificacionesRequest, actualizarNotificacionesRequest } from '../../../api/auth'
import { useAuth } from '../../../context/AuthContext';

function NotificacionesPage() {
    // Estado para almacenar las notificaciones de la API
    const [notificaciones, setNotificaciones] = useState([]);
    const [cargando, setCargando] = useState(true);
    const {user}= useAuth();

    // Cargar notificaciones al inicio
    useEffect(() => {
        const cargarNotificaciones = async () => {
            try {
                console.log("Cargando notificaciones para el usuario:", user);
                const response = await obtenerNotificacionesRequest(user.id);
             
                // Extraemos las notificaciones según la estructura específica
                let notificacionesProcesadas = [];
                
                if (response.data && Array.isArray(response.data)) {
                    // La API devuelve un array de objetos donde cada objeto tiene una propiedad 'notificaciones'
                    notificacionesProcesadas = response.data.map(item => item.notificaciones);
                } else if (response.data && response.data.notificaciones) {
                    // Si solo hay un objeto con propiedad 'notificaciones'
                    notificacionesProcesadas = [response.data.notificaciones];
                } else {
               notificacionesProcesadas = [];
                }

                setNotificaciones(notificacionesProcesadas);
                } catch (error) {
                   setNotificaciones([]);
            } finally {
                setCargando(false);
            }
        };

        cargarNotificaciones();
    }, [user]);

    // Función para cambiar el estado de una notificación individual
    const cambiarEstado = async (id) => {
        try {
            // Encuentra la notificación que se está cambiando
            const notificacion = notificaciones.find(notif => notif.id === id);
            if (!notificacion) return;
            
            // Actualiza localmente el estado de la notificación siempre a false cuando se hace clic
            setNotificaciones(notificaciones.map(notif => 
                notif.id === id ? {...notif, estado: false} : notif
            ));
            
            // Actualiza el estado en el backend usando la función definida en auth.js
            try {
                const response = await actualizarNotificacionesRequest(id, {
                    ...notificacion,
                    estado: false
                });
               } catch (backendError) {
               }
        } catch (error) {
            console.error("Error al cambiar el estado de la notificación:", error);
        }
    };

    // Función para cerrar notificación
    const cerrarNotificacion = (id) => {
        setNotificaciones(notificaciones.filter(notif => notif.id !== id));
    };

    return (
        <div className='contenedor-principal'>
            <div className='contenedor-secundario'>
                <h1>Mis Notificaciones</h1>
                <div className='contenedor-notificaciones'>
                    {cargando ? (
                        <p>Cargando notificaciones...</p>
                    ) : notificaciones.length === 0 ? (
                        <p className="text-center">No tienes notificaciones</p>
                    ) : (
                        <div className="notificaciones-grid">
                            {notificaciones.map((notif, index) => (
                                <div 
                                    className={`notificacion-item ${notif.estado ? 'leido' : 'no-leido'}`} 
                                    role="alert" 
                                    aria-live="assertive" 
                                    aria-atomic="true" 
                                    key={notif.id || index}
                                >
                                    <div className="notificacion-header">
                                        <div className="notificacion-estado">
                                            <input 
                                                type="checkbox" 
                                                checked={!notif.estado} // Invertimos la lógica para que checked=true cuando estado=false
                                                onChange={() => cambiarEstado(notif.id)}
                                                className="notificacion-checkbox"
                                                id={`notif-check-${notif.id || index}`}
                                            />
                                            <label htmlFor={`notif-check-${notif.id || index}`}>
                                                <i className="bi bi-bell"></i>
                                            </label>
                                        </div>
                                        <strong className="notificacion-titulo">{notif.titulo}</strong>
                                        <small className="notificacion-fecha">{notif.fecha}</small>
                                        <button 
                                            type="button" 
                                            className="notificacion-cerrar" 
                                            onClick={() => cerrarNotificacion(notif.id)}
                                            aria-label="Close">
                                            &times;
                                        </button>
                                    </div>
                                    <div className="notificacion-cuerpo">
                                        {notif.mensaje}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default NotificacionesPage