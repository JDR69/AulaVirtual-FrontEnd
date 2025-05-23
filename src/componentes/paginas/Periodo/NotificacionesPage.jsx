import React, { useState } from 'react'
import '../../css/notificacion.css'

function NotificacionesPage() {
    // Ejemplo de notificaciones
    const [notificaciones, setNotificaciones] = useState([
        {
            id: 1,
            titulo: 'Nueva tarea',
            fecha: '2025-05-23 10:30',
            mensaje: 'Se ha publicado una nueva tarea en Matemáticas.',
        },
        {
            id: 2,
            titulo: 'Aviso importante',
            fecha: '2025-05-22 18:00',
            mensaje: 'Recuerda revisar el calendario académico.',
        },
         {
            id: 2,
            titulo: 'Aviso importante',
            fecha: '2025-05-22 18:00',
            mensaje: 'Recuerda revisar el calendario académico.',
        }
        
    ]);

    // Función para cerrar notificación
    const cerrarNotificacion = (id) => {
        setNotificaciones(notificaciones.filter(notif => notif.id !== id));
    };

    return (
        <div className='contenedor-principal'>
            <div className='contenedor-secundario'>
                <h1>Mis Notificaciones</h1>
                <div className='contenedor-notificaciones'>
                    <div className="notificaciones-grid">
                        {notificaciones.map(notif => (
                            <div className="notificacion-item" role="alert" aria-live="assertive" aria-atomic="true" key={notif.id}>
                                <div className="notificacion-header">
                                    <i className="bi bi-bell"></i>
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
                </div>
            </div>
        </div>
    )
}

export default NotificacionesPage