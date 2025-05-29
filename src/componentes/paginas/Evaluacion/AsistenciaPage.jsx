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
          matricula: user.alumno?.matricula || '',
          asistencia: false
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
      updated[index].asistencia = true;
      setEstudiantes(sortEstudiantes(updated));
      setMensaje(`✅ ${updated[index].nombre} marcado como presente`);
    } else {
      setMensaje('❌ Estudiante no encontrado');
    }

    setTimeout(() => {
      setMensaje('');
      inputRef.current.value = '';
      inputRef.current.focus();
    }, 1500);
  };

  // Ordenar estudiantes: presentes primero
  const sortEstudiantes = (list) => {
    return [...list].sort((a, b) => Number(b.asistencia) - Number(a.asistencia));
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleManualToggle = (index) => {
    const updated = [...estudiantes];
    updated[index].asistencia = !updated[index].asistencia;
    setEstudiantes(sortEstudiantes(updated));
  };

  const handleGuardar = async () => {
    try {
      // Preparar los datos SOLO con nombre, fecha y estado
      const asistenciasData = estudiantes.map(est => ({
        nombre: est.nombre,       // nombre del alumno
        fecha: fecha,             // fecha seleccionada
        estado: est.asistencia    // estado de asistencia (true/false)
      }));
      
      // Llamar a la API para guardar las asistencias
      await crearAsistenciaRequest(asistenciasData);
      
      const presentes = estudiantes.filter(e => e.asistencia).length;
      const ausentes = estudiantes.length - presentes;
      
      setMensaje(`✅ Asistencia guardada para el ${fecha}. Presentes: ${presentes}, Ausentes: ${ausentes}`);
      
      // Resetear asistencias después de guardar
      const resetEstudiantes = estudiantes.map(est => ({...est, asistencia: false}));
      setEstudiantes(resetEstudiantes);
      
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
          />
        </div>

        <div style={{ marginBottom: '20px', color: 'green', fontWeight: 'bold' }}>
          {mensaje}
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className='table table-striped'>
            <thead>
              <tr style={{ background: '#005f99', color: '#fff' }}>
                <th>CI</th>
                <th>Nombre</th>
                <th>Matrícula</th>
                <th>¿Presente?</th>
              </tr>
            </thead>
            <tbody>
              {estudiantes.length > 0 ? (
                estudiantes.map((est, index) => (
                  <tr key={est.id} style={{ background: est.asistencia ? '#e6ffed' : '#fff' }}>
                    <td>{est.ci}</td>
                    <td>{est.nombre}</td>
                    <td>{est.matricula}</td>
                    <td style={{ textAlign: 'center' }}>
                      <input
                        type="checkbox"
                        checked={est.asistencia}
                        onChange={() => handleManualToggle(index)}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center">No hay estudiantes disponibles</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div style={{ marginTop: '20px', textAlign: 'right' }}>
          <button 
            onClick={handleGuardar} 
            className='btn btn-primary'
            disabled={estudiantes.length === 0}
          >
            Guardar Asistencia
          </button>
        </div>
      </div>
    </div>
  )
}

export default AsistenciaPage