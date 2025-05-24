import React, { useState } from 'react'

function AsistenciaPage() {
  // Estado para manejar la fecha
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]); // Fecha actual en formato YYYY-MM-DD
  
  // Estado para manejar la lista de estudiantes
  const [estudiantes, setEstudiantes] = useState([
    { id: 1, nombre: "Juan Pérez", asistencia: false },
    { id: 2, nombre: "María García", asistencia: false },

  ]);


  const handleAsistenciaChange = (id) => {
    setEstudiantes(estudiantes.map(estudiante => 
      estudiante.id === id ? { ...estudiante, asistencia: !estudiante.asistencia } : estudiante
    ));
  };

  // Función para manejar el cambio de fecha
  const handleFechaChange = (e) => {
    setFecha(e.target.value);
    };

  return (
    <div className='contenedor-principal'>
      <div className='contenedor-secundario'>
        <h1>Registro de Asistencia</h1>
        
        {/* Selector de fecha */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ marginRight: '10px', fontWeight: 'bold' }}>
            Fecha de asistencia:
          </label>
          <input 
            type="date" 
            value={fecha} 
            onChange={handleFechaChange}
            className="form-control"
            style={{ display: 'inline-block', width: 'auto' }}
          />
        </div>
        
        <div className='dimensionTable'>
          <table className='table-striped'>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Asistencia</th>
              </tr>
            </thead>
            <tbody>
              {estudiantes.map((estudiante) => (
                <tr key={estudiante.id}>
                  <td>{estudiante.id}</td>
                  <td>{estudiante.nombre}</td>
                  <td>
                    <input 
                      type="checkbox" 
                      checked={estudiante.asistencia} 
                      onChange={() => handleAsistenciaChange(estudiante.id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          <div className="botones-container" style={{ marginTop: '20px', textAlign: 'right' }}>
            <button className="btn btn-primary">Guardar Asistencia</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AsistenciaPage