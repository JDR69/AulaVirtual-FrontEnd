import React, { useState, useEffect } from 'react'
import { obtenerUsuarioRequest } from '../../../api/auth'

function CrearNotificacionPage() {
  const [usuarios, setUsuarios] = useState([])
  const [loading, setLoading] = useState(true)
  const [tipoDestinatario, setTipoDestinatario] = useState('')
  const [usuarioEspecifico, setUsuarioEspecifico] = useState('')
  const [titulo, setTitulo] = useState('')
  const [contenido, setContenido] = useState('')
  const [fecha, setFecha] = useState('')

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

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Crear objeto con los datos de la notificación
    const notificacion = {
      tipo_destinatario: tipoDestinatario,
      usuario_especifico: tipoDestinatario === 'especifico' ? usuarioEspecifico : null,
      titulo,
      contenido,
      fecha,
      estado
    }
    
    console.log('Datos de notificación a enviar:', notificacion)
    // Aquí iría la lógica para enviar la notificación al backend
  }

  return (
    <div className='contenedor-principal'>
      <div className='contenedor-secundario'>
     
        <div onSubmit={handleSubmit} className='contenedor-notificaciones '>
               <h1>Crear Notificación</h1>
          {/* Selector de destinatario */}
          <div className='contenedor-contenido'>
            <label htmlFor="tipoDestinatario">Destinatario:</label>
            <select 
              id="tipoDestinatario" 
              className='form-control'
              value={tipoDestinatario}
              onChange={(e) => setTipoDestinatario(e.target.value)}
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
              <label htmlFor="usuarioEspecifico">Seleccionar Usuario:</label>
              <select 
                id="usuarioEspecifico" 
                className='form-control'
                value={usuarioEspecifico}
                onChange={(e) => setUsuarioEspecifico(e.target.value)}
                required
              >
                <option value="">Seleccione un usuario</option>
                {loading ? (
                  <option disabled>Cargando usuarios...</option>
                ) : (
                  usuarios.map(usuario => (
                    <option key={usuario.id} value={usuario.id}>
                      {usuario.nombre} {usuario.apellido} - {usuario.rol_nombre || 'Sin rol'}
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

          {/* Campo de título (ya existente pero ahora con estado controlado) */}
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

          {/* Campo de contenido (ya existente pero ahora con estado controlado) */}
          <div className='contenedor-contenido'>
            <label htmlFor="contenido">Contenido:</label>
            <textarea 
              id="contenido" 
              className='form-control' 
              rows="4"
              value={contenido}
              onChange={(e) => setContenido(e.target.value)}
              required
            ></textarea>
          </div>

          <button type="submit" className='btn btn-primary'>Enviar Notificación</button>
        </div>
      </div>
    </div>
  )
}

export default CrearNotificacionPage