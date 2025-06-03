import React, { useState, useEffect } from 'react'
import { obtenerUsuarioRequest, crearNuevaNotificacionRequest } from '../../../api/auth'

function CrearNotificacionPage() {
  const [usuarios, setUsuarios] = useState([])
  const [loading, setLoading] = useState(true)
  const [tipoDestinatario, setTipoDestinatario] = useState('')
  const [usuario, setUsuario] = useState('') 
  const [titulo, setTitulo] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [fecha, setFecha] = useState('')
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  // Estado siempre será true como se requiere
  const estado = true

  useEffect(() => {
    const cargarUsuarios = async () => {
      try {
        const response = await obtenerUsuarioRequest()
        setUsuarios(response.data)
        setLoading(false)
      } catch (error) {
        console.error("Error al cargar usuarios:", error)
        setLoading(false)
      }
    }

    cargarUsuarios()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)
    
    // Verificar si se ha seleccionado un usuario específico cuando es necesario
    if (tipoDestinatario === 'especifico' && !usuario) {
      setError("Por favor seleccione un usuario específico");
      return;
    }
    
    // Crear objeto con los datos de la notificación según el formato requerido
    const notificacion = {
      titulo,
      fecha,
      estado,
      // Si es un usuario específico, mandamos su ID, si no, mandamos cadena vacía
      usuario: tipoDestinatario === 'especifico' ? usuario : '',
      mensaje
    }
    
    console.log('Datos de notificación a enviar:', notificacion)
    
    try {
      const response = await crearNuevaNotificacionRequest(notificacion, parseInt(notificacion.usuario))
      console.log('Notificación enviada exitosamente:', response)
      setSuccess(true)
      // Resetear el formulario
      setTitulo('')
      setFecha('')
      setMensaje('')
      setUsuario('')
      setTipoDestinatario('')
    } catch (error) {
      console.error("Error al enviar la notificación:", error)
      setError("Error al enviar la notificación. Por favor, intente nuevamente.")
    }
  }

  return (
    <div className='contenedor-principal'>
      <div className='contenedor-secundario'>
     
        <form onSubmit={handleSubmit} className='contenedor-notificaciones'>
          <h1>Crear Notificación</h1>
          
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}
          
          {success && (
            <div className="alert alert-success" role="alert">
              Notificación enviada exitosamente.
            </div>
          )}
          
          {/* Selector de destinatario */}
          <div className='contenedor-contenido'>
            <label htmlFor="tipoDestinatario">Destinatario:</label>
            <select 
              id="tipoDestinatario" 
              className='form-control'
              value={tipoDestinatario}
              onChange={(e) => {
                setTipoDestinatario(e.target.value);
                // Resetear el usuario seleccionado cuando cambia el tipo de destinatario
                setUsuario('');
              }}
              required
            >
              <option value="">Seleccione un destinatario</option>
              <option value="alumnos">Todos los Alumnos</option>
              <option value="profesores">Todos los Profesores</option>
              <option value="especifico">Usuario Específico</option>
            </select>
          </div>

          {/* Selector de usuario específico (solo visible si se selecciona "específico") */}
          {tipoDestinatario === 'especifico' && (
            <div className='contenedor-contenido'>
              <label htmlFor="usuario">Seleccionar Usuario:</label>
              <select 
                id="usuario" 
                className='form-control'
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                required
              >
                <option value="">Seleccione un usuario</option>
                {loading ? (
                  <option disabled>Cargando usuarios...</option>
                ) : (
                  usuarios.map(u => (
                    <option key={u.id} value={u.id}>
                      {u.nombre} {u.apellido} - {u.rol_nombre || 'Sin rol'}
                    </option>
                  ))
                )}
              </select>
            </div>
          )}

          {/* Campo de fecha */}
          <div className='contenedor-contenido'>
            <label htmlFor="fecha">Fecha:</label>
            <input 
              type="date" 
              id="fecha" 
              className='form-control'
              value={fecha}
              onChange={(e) => setFecha(e.target.value)} 
              required
            />
          </div>

          {/* Campo de título */}
          <div className='contenedor-contenido'>
            <label htmlFor="titulo">Título:</label>
            <input 
              type="text" 
              id="titulo" 
              className='form-control'
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)} 
              required
            />
          </div>

          {/* Campo de mensaje */}
          <div className='contenedor-contenido'>
            <label htmlFor="mensaje">Mensaje:</label>
            <textarea 
              id="mensaje" 
              className='form-control' 
              rows="4"
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
              required
            ></textarea>
          </div>

          <button type="submit" className='btn btn-primary'>Enviar Notificación</button>
        </form>
      </div>
    </div>
  )
}

export default CrearNotificacionPage