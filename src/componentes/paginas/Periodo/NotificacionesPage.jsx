import React from 'react'

function NotificacionesPage() {
    // Ejemplo de notificaciones
    const notificaciones = [
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

        }
    ];

    return (
        <div className='contenedor-principal'>
            <div className='contenedor-secundario'>
                <h1>Mis Notificaciones</h1>
                <div className='contenedor-buttones'>
                    <div className="toast-container position-static">
                        {notificaciones.map(notif => (
                            <div className="toast show" role="alert" aria-live="assertive" aria-atomic="true" key={notif.id}>
                                <div className="toast-header">
                                    <i class="bi bi-bell"></i>
                                    <strong className="me-auto">{notif.titulo}</strong>
                                    <small className="text-body-secondary">{notif.fecha}</small>
                                    <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                                </div>
                                <div className="toast-body">
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