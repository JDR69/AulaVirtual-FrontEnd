import React, { useState, useRef, useEffect } from 'react'
import { obtenerUsuarioRequest, crearAsistenciaRequest } from '../../../api/auth'

function AsistenciaPage() {
  const fechaActual = new Date().toISOString().split('T')[0];
  const [fecha, setFecha] = useState(fechaActual);
  const [mensaje, setMensaje] = useState('');
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);
  
  // Estado para manejar los estudiantes y su asistencia
  const [estudiantes, setEstudiantes] = useState([]);
  // Agregar un nuevo estado para rastrear asistencias ya registradas
  const [asistenciasRegistradas, setAsistenciasRegistradas] = useState(new Set());

  // Cargar los estudiantes desde la API
  useEffect(() => {
    const cargarEstudiantes = async () => {
      try {
        setCargando(true);
        const response = await obtenerUsuarioRequest();
        
        // Filtrar solo los usuarios con rol de Alumno (rol 5)
        const alumnosData = response.data.filter(user => user.rol === 5);
        
        // Formatear los datos para nuestro uso
        const alumnosFormateados = alumnosData.map(user => ({
          id: user.id,
          ci: user.ci,
          nombre: user.nombre,
          estado: false // inicialmente todos ausentes
        }));
        
        setEstudiantes(alumnosFormateados);
        setCargando(false);
      } catch (err) {
        console.error("Error al cargar los estudiantes:", err);
        setError("No se pudieron cargar los estudiantes. Intente nuevamente.");
        setCargando(false);
      }
    };
    
    cargarEstudiantes();
  }, []);

  // Capturar CI escaneado
  const handleScan = (e) => {
    const ciIngresado = e.target.value.trim();
    const index = estudiantes.findIndex(est => est.ci === ciIngresado);

    if (index !== -1) {
      const updated = [...estudiantes];
      updated[index].estado = true; // Marcamos como presente
      setEstudiantes(sortEstudiantes(updated));
      
      // Actualizamos inmediatamente la asistencia de este alumno
      const alumnoActualizado = updated[index];
      actualizarAsistencia(alumnoActualizado);
      
      setMensaje(`✅ ${alumnoActualizado.nombre} marcado como presente`);
    } else {
      setMensaje('❌ Estudiante no encontrado');
    }

    setTimeout(() => {
      setMensaje('');
      inputRef.current.value = '';
      inputRef.current.focus();
    }, 1500);
  };

  // Función para actualizar la asistencia de un alumno individual
  const actualizarAsistencia = async (alumno) => {
    try {
      // Estructura correcta según el modelo backend
      const asistenciaData = {
        fecha: fecha,        // Fecha actual
        estado: alumno.estado, // true o false (presente/ausente)
        alumno: alumno.id    // ID del alumno (relación ForeignKey)
      };
      
      // Al crear una nueva asistencia, no pasamos ID pues el backend lo genera
      await crearAsistenciaRequest(asistenciaData);
      console.log(`Asistencia actualizada para ${alumno.nombre}`);
      
      // Registrar que este alumno ya tiene su asistencia actualizada
      setAsistenciasRegistradas(prev => new Set([...prev, alumno.id]));
      
    } catch (error) {
      console.error(`Error al actualizar asistencia de ${alumno.nombre}:`, error);
      console.error("Detalles:", error.response?.data);
    }
  };

  // Ordenar estudiantes: presentes primero
  const sortEstudiantes = (list) => {
    return [...list].sort((a, b) => Number(b.estado) - Number(a.estado));
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleManualToggle = (index) => {
    const updated = [...estudiantes];
    updated[index].estado = !updated[index].estado;
    setEstudiantes(sortEstudiantes(updated));
    actualizarAsistencia(updated[index]); // Actualizar cuando se cambia manualmente
  };

  const handleGuardarTodos = async () => {
    try {
      let procesados = 0;
      let errores = 0;
      
      // Solo procesar estudiantes que no han sido registrados todavía
      for (const est of estudiantes) {
        // Skip estudiantes cuya asistencia ya ha sido registrada
        if (!asistenciasRegistradas.has(est.id)) {
          const asistenciaData = {
            fecha: fecha,        // Fecha actual
            estado: est.estado,  // Estado de asistencia (true/false)
            alumno: est.id       // ID del alumno (relación ForeignKey)
          };
          
          try {
            await crearAsistenciaRequest(asistenciaData);
            procesados++;
            
            // Agregar a la lista de registrados
            setAsistenciasRegistradas(prev => new Set([...prev, est.id]));
          } catch (err) {
            errores++;
            console.error(`Error al guardar asistencia para ${est.id}:`, err);
          }
        }
      }
      
      const presentes = estudiantes.filter(e => e.estado).length;
      const ausentes = estudiantes.length - presentes;
      
      if (procesados > 0) {
        setMensaje(`✅ Asistencia guardada. Registros procesados: ${procesados}. Presentes: ${presentes}, Ausentes: ${ausentes}`);
      } else if (errores > 0) {
        setMensaje(`⚠️ Hubo ${errores} errores al guardar las asistencias.`);
      } else {
        setMensaje(`ℹ️ No hay nuevas asistencias para guardar.`);
      }
    } catch (error) {
      console.error("Error al guardar la asistencia:", error);
      setMensaje('❌ Error al guardar la asistencia');
    }
  };

  // Mostrar indicador de carga mientras se obtienen los datos
  if (cargando) {
    return (
      <div className="contenedor-principal" style={{ padding: '30px', textAlign: 'center' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p>Cargando lista de estudiantes...</p>
      </div>
    );
  }

  // Mostrar mensaje de error si hay algún problema
  if (error) {
    return (
      <div className="contenedor-principal" style={{ padding: '30px', textAlign: 'center' }}>
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="contenedor-principal" style={{ padding: '30px', fontFamily: 'Arial' }}>
      <div className="contenedor-secundario" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ marginBottom: '20px' }}>Registro de Asistencia</h1>

        {/* Input para el escáner */}
        <div style={{ marginBottom: '20px' }}>
          <label className='form-label'>Escanear CI:</label>
          <input
            placeholder='Escanear CI del estudiante'
            className='form-control'
            type="text"
            ref={inputRef}
            onChange={handleScan}
          />
        </div>

        <div style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
          <label className='form-label' style={{ marginRight: '10px' }}>Fecha:</label>
          <input
            type="date"
            className="form-control"
            value={fecha}
            onChange={e => setFecha(e.target.value)}
            style={{ padding: '6px' }}
            readOnly // La fecha es del día y no se puede cambiar
          />
        </div>

        <div style={{ marginBottom: '20px', color: 'green', fontWeight: 'bold' }}>
          {mensaje}
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className='table table-striped'>
            <thead>
              <tr style={{ background: '#005f99', color: '#fff' }}>
                <th>ID</th>
                <th>Nombre</th>
                <th>¿Presente?</th>
              </tr>
            </thead>
            <tbody>
              {estudiantes.length > 0 ? (
                estudiantes.map((est, index) => (
                  <tr key={est.id} style={{ background: est.estado ? '#e6ffed' : '#fff' }}>
                    <td>{est.id}</td>
                    <td>{est.nombre}</td>
                    <td style={{ textAlign: 'center' }}>
                      <input
                        type="checkbox"
                        checked={est.estado}
                        onChange={() => handleManualToggle(index)}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center">No hay estudiantes disponibles</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div style={{ marginTop: '20px', textAlign: 'right' }}>
          <button 
            onClick={handleGuardarTodos} 
            className='btn btn-primary'
            disabled={estudiantes.length === 0}
          >
            Guardar Todas las Asistencias
          </button>
        </div>
      </div>
    </div>
  )
}

export default AsistenciaPage