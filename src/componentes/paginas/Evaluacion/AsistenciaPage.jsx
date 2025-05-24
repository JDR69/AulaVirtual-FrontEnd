import React, { useState, useRef, useEffect } from 'react'

function AsistenciaPage() {
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0])
  const [mensaje, setMensaje] = useState('')
  const inputRef = useRef(null)

  const [estudiantes, setEstudiantes] = useState([
    { id: 1, ci: '022000293305', nombre: "Juan Pérez", asistencia: false },
    { id: 2, ci: '8801116006861', nombre: "María García", asistencia: false },
    { id: 3, ci: '777560223218', nombre: "Carlos López", asistencia: false },
  ])

  // Capturar CI escaneado
  const handleScan = (e) => {
    const ciIngresado = e.target.value.trim()
    const index = estudiantes.findIndex(est => est.ci === ciIngresado)

    if (index !== -1) {
      const updated = [...estudiantes]
      updated[index].asistencia = true
      setEstudiantes(sortEstudiantes(updated))
      setMensaje(`✅ ${updated[index].nombre} marcado como presente`)
    } else {
      setMensaje('❌ Estudiante no encontrado')
    }

    setTimeout(() => {
      setMensaje('')
      inputRef.current.value = ''
      inputRef.current.focus()
    }, 1500)
  }

  // Ordenar estudiantes: presentes primero
  const sortEstudiantes = (list) => {
    return [...list].sort((a, b) => Number(b.asistencia) - Number(a.asistencia))
  }

  useEffect(() => {
    inputRef.current.focus()
    setEstudiantes(prev => sortEstudiantes(prev))
  }, [])

  const handleManualToggle = (index) => {
    const updated = [...estudiantes]
    updated[index].asistencia = !updated[index].asistencia
    setEstudiantes(sortEstudiantes(updated))
  }

  const handleGuardar = () => {
    const presentes = estudiantes.filter(e => e.asistencia).length
    const ausentes = estudiantes.length - presentes
    alert(`Asistencia guardada para el ${fecha}.\nPresentes: ${presentes}, Ausentes: ${ausentes}`)
  }

  return (
    <div className="contenedor-principal" style={{ padding: '30px', fontFamily: 'Arial' }}>
      <div className="contenedor-secundario" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ marginBottom: '20px' }}>Registro de Asistencia</h1>

        {/* Input oculto para el escáner */}
        <input
          type="text"
          ref={inputRef}
          onChange={handleScan}
        />

        <div style={{ marginBottom: '10px' }}>
          <label><strong>Fecha:</strong></label>
          <input
            type="date"
            value={fecha}
            onChange={e => setFecha(e.target.value)}
            style={{ padding: '6px', marginLeft: '10px' }}
          />
        </div>

        <div style={{ marginBottom: '20px', color: 'green', fontWeight: 'bold' }}>
          {mensaje}
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#005f99', color: '#fff' }}>
              <th>ID</th>
              <th>CI</th>
              <th>Nombre</th>
              <th>¿Presente?</th>
            </tr>
          </thead>
          <tbody>
            {estudiantes.map((est, index) => (
              <tr key={est.id} style={{ background: est.asistencia ? '#e6ffed' : '#fff' }}>
                <td>{est.id}</td>
                <td>{est.ci}</td>
                <td>{est.nombre}</td>
                <td style={{ textAlign: 'center' }}>
                  <input
                    type="checkbox"
                    checked={est.asistencia}
                    onChange={() => handleManualToggle(index)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ marginTop: '20px', textAlign: 'right' }}>
          <button onClick={handleGuardar} style={{
            padding: '10px 20px',
            backgroundColor: '#005f99',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}>
            Guardar Asistencia
          </button>
        </div>
      </div>
    </div>
  )
}

export default AsistenciaPage



// import React, { useState } from 'react'

// function AsistenciaPage() {
//   // Estado para manejar la fecha
//   const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]); // Fecha actual en formato YYYY-MM-DD
  
//   // Estado para manejar la lista de estudiantes
//   const [estudiantes, setEstudiantes] = useState([
//     { id: 1, nombre: "Juan Pérez", asistencia: false },
//     { id: 2, nombre: "María García", asistencia: false },

//   ]);


//   const handleAsistenciaChange = (id) => {
//     setEstudiantes(estudiantes.map(estudiante => 
//       estudiante.id === id ? { ...estudiante, asistencia: !estudiante.asistencia } : estudiante
//     ));
//   };

//   // Función para manejar el cambio de fecha
//   const handleFechaChange = (e) => {
//     setFecha(e.target.value);
//     };

//   return (
//     <div className='contenedor-principal'>
//       <div className='contenedor-secundario'>
//         <h1>Registro de Asistencia</h1>
        
//         {/* Selector de fecha */}
//         <div style={{ marginBottom: '20px' }}>
//           <label style={{ marginRight: '10px', fontWeight: 'bold' }}>
//             Fecha de asistencia:
//           </label>
//           <input 
//             type="date" 
//             value={fecha} 
//             onChange={handleFechaChange}
//             className="form-control"
//             style={{ display: 'inline-block', width: 'auto' }}
//           />
//         </div>
        
//         <div className='dimensionTable'>
//           <table className='table-striped'>
//             <thead>
//               <tr>
//                 <th>ID</th>
//                 <th>Nombre</th>
//                 <th>Asistencia</th>
//               </tr>
//             </thead>
//             <tbody>
//               {estudiantes.map((estudiante) => (
//                 <tr key={estudiante.id}>
//                   <td>{estudiante.id}</td>
//                   <td>{estudiante.nombre}</td>
//                   <td>
//                     <input 
//                       type="checkbox" 
//                       checked={estudiante.asistencia} 
//                       onChange={() => handleAsistenciaChange(estudiante.id)}
//                     />
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
          
//           <div className="botones-container" style={{ marginTop: '20px', textAlign: 'right' }}>
//             <button className="btn btn-primary">Guardar Asistencia</button>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default AsistenciaPage