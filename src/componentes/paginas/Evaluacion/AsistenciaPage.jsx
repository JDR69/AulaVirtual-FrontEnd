import React, { useState, useRef, useEffect } from 'react';
import {  crearAsistenciaRequest, obtenerAlumnosRequest, obtenerAsistenciaRequest } from '../../../api/auth';
import { useAuth } from '../../../context/AuthContext'; // Importar el contexto

function AsistenciaPage() {
  const { gestion, materiaProfesor } = useAuth(); // Obtener gestión y materiaProfesor desde el contexto
  const fechaActual = new Date().toISOString().split('T')[0];
  const [fecha, setFecha] = useState(fechaActual);
  const [mensaje, setMensaje] = useState('');
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  // Estado para manejar los estudiantes y su asistencia
  const [estudiantes, setEstudiantes] = useState([]);
  const [asistenciasRegistradas, setAsistenciasRegistradas] = useState(new Set());

  // Cargar los estudiantes desde la API
  useEffect(() => {
   
    const cargarEstudiantes = async () => {
    
      try {
        setCargando(true);

        // Validar que anio_escolar y curso_paralelo estén disponibles
        if (!gestion || !materiaProfesor?.horarios?.curso_paralelo) {
          setError('Año escolar o curso paralelo no seleccionados. Verifique la configuración.');
          setCargando(false);
          return;
        }

        // Seleccionar la última gestión (o ajusta la lógica según sea necesario)
       
        const anioEscolar = JSON.parse(localStorage.getItem('gestion'));
        console.log("Gestión seleccionada:", anioEscolar.anio_escolar);
        const cursoParalelo = JSON.parse(localStorage.getItem('materiaProfesor'));
        console.log("Año Escolar:", cursoParalelo.horarios.curso_paralelo);

        // Llamar a la API con anio_escolar y curso_paralelo
        const response = await obtenerAlumnosRequest(anioEscolar.anio_escolar,cursoParalelo.horarios.curso_paralelo);
        console.log("Respuesta de la API:", response.data);
        const alumnosFormateados = response.data.map(user => ({
          nombre: user.nombre_usuario,
          estado: false // inicialmente todos ausentes
        }));

        setEstudiantes(alumnosFormateados);
        setCargando(false);
      } catch (err) {
        console.error('Error al cargar los estudiantes:', err);
        setError('No se pudieron cargar los estudiantes. Intente nuevamente.');
        setCargando(false);
      }
    };

    cargarEstudiantes();
  }, [gestion, materiaProfesor]); // Dependencias para recargar si cambian

  // Capturar CI escaneado
  const handleScan = (e) => {
    const ciIngresado = e.target.value.trim();
    const index = estudiantes.findIndex(est => est.ci === ciIngresado);

    if (index !== -1) {
      const updated = [...estudiantes];
      updated[index].estado = true; // Marcamos como presente
      setEstudiantes(updated);

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
      const asistenciaData = {
        fecha: fecha,
        estado: alumno.estado,
        alumno: alumno.id
      };

      await crearAsistenciaRequest(asistenciaData);
      console.log(`Asistencia actualizada para ${alumno.nombre}`);
      setAsistenciasRegistradas(prev => new Set([...prev, alumno.id]));
    } catch (error) {
      console.error(`Error al actualizar asistencia de ${alumno.nombre}:`, error);
    }
  };

  // Nueva función para obtener asistencias según la fecha
  const obtenerAsistencias = async () => {
    try {
      setCargando(true);

      // Validar que la fecha esté seleccionada
      if (!fecha) {
        setError('Por favor, seleccione una fecha válida.');
        setCargando(false);
        return;
      }

      // Validar que anio_escolar y curso_paralelo estén disponibles
      if (!gestion || !materiaProfesor?.horarios?.curso_paralelo) {
        setError('Año escolar o curso paralelo no seleccionados. Verifique la configuración.');
        setCargando(false);
        return;
      }

      const anioEscolar = JSON.parse(localStorage.getItem('gestion'));
      const cursoParalelo = JSON.parse(localStorage.getItem('materiaProfesor'));

      // Llamar a la API para obtener los alumnos
      const alumnosResponse = await obtenerAlumnosRequest(anioEscolar.anio_escolar, cursoParalelo.horarios.curso_paralelo);
      console.log("Alumnos obtenidos:", alumnosResponse.data);

      // Llamar a la API para obtener las asistencias registradas
      const asistenciasResponse = await obtenerAsistenciaRequest({
        fecha,
        alumnos: alumnosResponse.data.map(alumno => ({ id: alumno.alumno }))
      });
      console.log("Asistencias registradas:", asistenciasResponse.data);

      // Combinar los datos de los alumnos con las asistencias
      const asistenciasFormateadas = alumnosResponse.data.map(alumno => {
        const asistencia = asistenciasResponse.data.find(a => a.id === alumno.alumno); // Cambiar a alumno.alumno si es necesario
        return {
          id: alumno.alumno, // Asegúrate de usar el campo correcto para el ID
          nombre: alumno.nombre_usuario,
          estado: asistencia ? true : false // Solo marcar como presente si tiene asistencia
        };
      });

      setEstudiantes(asistenciasFormateadas);
      setCargando(false);
    } catch (err) {
      console.error('Error al obtener las asistencias:', err);
      setError('No se pudieron obtener las asistencias. Intente nuevamente.');
      setCargando(false);
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

        <div>
          <button className='btn btn-primary' onClick={obtenerAsistencias}>
            Obtener Asistencias
          </button>
        </div>

        <div style={{ marginBottom: '20px', color: 'green', fontWeight: 'bold' }}>
          {mensaje}
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className='table table-striped'>
            <thead>
              <tr style={{ background: '#005f99', color: '#fff' }}>
              
                <th>Nombre</th>
                <th>¿Presente?</th>
              </tr>
            </thead>
            <tbody>
              {estudiantes.length > 0 ? (
                estudiantes.map((est, index) => (
                  <tr key={est.id} style={{ background: est.estado ? '#e6ffed' : '#fff' }}>
                    <td>{est.nombre}</td>
                    <td style={{ textAlign: 'center' }}>
                      {est.estado ? (
                        <input
                          type="checkbox"
                          checked={true} // Marcado si asistió
                          readOnly
                        />
                      ) : (
                        // Verificar si la fecha seleccionada es anterior, igual o posterior a la fecha actual
                        fecha === new Date().toISOString().split('T')[0] ? (
                          <input
                            type="checkbox"
                            checked={false} // Desmarcado si es la fecha actual
                            readOnly
                          />
                        ) : (
                          <span style={{ color: 'red', fontWeight: 'bold' }}>No asistió</span> // Mensaje si no asistió en fechas anteriores
                        )
                      )}
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
      </div>
    </div>
  );
}

export default AsistenciaPage;