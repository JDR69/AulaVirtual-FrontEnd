import React, { useState, useEffect } from 'react'
import '../../css/Gestion.css'
import { crearNuevaGestionRequest ,obtenerGestionRequest , crearNuevoTrimestreRequest} from '../../../api/auth';

function Gestiones() {
  const [gestionData, setGestionData] = useState({
    anio_escolar: '',
    estado: true
  });

  const [trimestreData, setTrimestreData] = useState({
    nro: '',
    fecha_inicio: '',
    fecha_fin: '',
    estado: true,
    gestion_id: ''
  });

  // Datos de ejemplo para mostrar en la tabla
  const [gestiones, setGestiones] = useState([]);

  const [trimestres, setTrimestres] = useState([
    { id: 1, nro: 1, nombre: '1er', fecha_inicio: '2024-02-01', fecha_fin: '2024-05-01', estado: 'habilitado', gestion_id: 1 },
    { id: 2, nro: 2, nombre: '2do', fecha_inicio: '2024-05-01', fecha_fin: '2024-08-01', estado: 'habilitado', gestion_id: 1 },
    { id: 3, nro: 3, nombre: '3er', fecha_inicio: '2024-08-01', fecha_fin: '2024-12-01', estado: 'habilitado', gestion_id: 1 },
  ]);

  const handleGestionChange = (e) => {
    const { name, value } = e.target;
    setGestionData({
      ...gestionData,
      [name]: value
    });
  };

  const handleTrimestreChange = (e) => {
    const { name, value } = e.target;
    setTrimestreData({
      ...trimestreData,
      [name]: value
    });
  };

  const handleGestionSubmit = async (e) => {
    e.preventDefault();
    try {
      // Simular agregar una nueva gestión
      const newGestion = {
        anio_escolar: parseInt(gestionData.anio_escolar),
        estado: gestionData.estado
      };
      console.log('Datos de gestión:', newGestion);
      const res = await crearNuevaGestionRequest(newGestion)
      console.log(res.data)
      // setGestiones([...gestiones, newGestion]);
      // setGestionData({
      //   anio: '',
      //   estado: 'habilitado'
      // });

    } catch (error) {
      const mensaje = error.response?.data?.error || "Error al crear la gestión";
      console.error(mensaje);
      alert(mensaje);
    }

  };

  

  const getNombreTrimestre = (nro) => {
    switch (nro) {
      case 1: return '1er';
      case 2: return '2do';
      case 3: return '3er';
      case 4: return '4to';
      default: return `${nro}º`;
    }
  };

  const handleTrimestreSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Datos de trimestre:', trimestreData);
  
      // Simular agregar un nuevo trimestre
      const newTrimestre = {
        id: trimestres.length + 1,
        nro: parseInt(trimestreData.nro),
        nombre: getNombreTrimestre(parseInt(trimestreData.nro)),
        fecha_inicio: trimestreData.fecha_inicio,
        fecha_fin: trimestreData.fecha_fin,
        estado: trimestreData.estado,
        gestion_id: parseInt(trimestreData.gestion_id)
      };

      const data = {
        nro : parseInt(trimestreData.nro),
        fecha_inicio: trimestreData.fecha_inicio,
        fecha_final: trimestreData.fecha_fin,
        estado: trimestreData.estado,
        gestion: parseInt(trimestreData.gestion_id)

      }
      const res = await crearNuevoTrimestreRequest(data)
      console.log(res.data)
      console.log(data)
  
      setTrimestres([...trimestres, newTrimestre]);
      setTrimestreData({
        nro: '',
        fecha_inicio: '',
        fecha_fin: '',
        estado: true,
        gestion_id: ''
      });  
    } catch (error) {
      
    }
  };

  // Función para obtener los trimestres de una gestión específica
  const getTrimestresByGestion = (gestionId) => {
    return trimestres.filter(trimestre => trimestre.gestion_id === gestionId);
  };

  // Función para formatear fechas en formato simple
  const formatSimpleDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' });
    return `${day}-${month}`;
  };

  useEffect ( () =>{
      fecthAnio();
  },[])

  const fecthAnio = async() =>{
     try {
        const res = await obtenerGestionRequest();
        setGestiones(res.data)
        console.log(res.data)
     } catch (error) {
        console.log(error)
     }
  }

  return (
    <div className='contenedor-principal'>
      <div className='contenedor-secundario'>
        <div className='gestion-container'>
          <div className='gestion-header'>
            <h1>Gestión de Periodos Académicos</h1>
            <p>Administra los años académicos y sus respectivos trimestres</p>
          </div>

          <div className='gestion-forms-container'>
            {/* Formulario de Gestión */}
            <div className='gestion-form card'>
              <div className='card-header'>
                <h2>Agregar Año Académico</h2>
              </div>
              <div className='card-body'>
                <form onSubmit={handleGestionSubmit}>
                  <div className='input-group'>
                    <label htmlFor="anio">Año:</label>
                    <input
                      type="number"
                      id="anio"
                      name="anio_escolar"
                      value={gestionData.anio_escolar}
                      onChange={handleGestionChange}
                      placeholder="Ej: 2025"
                      required
                    />
                  </div>

                  <div className='input-group'>
                    <label htmlFor="estado">Estado:</label>
                    <select
                      id="estado"
                      name="estado"
                      value={gestionData.estado}
                      onChange={handleGestionChange}
                    >
                      <option value={true}>Habilitado</option>
                      <option value={false}>Deshabilitado</option>
                    </select>
                  </div>

                  <div className='form-actions'>
                    <button type="submit" className='btn btn-primary'>
                      <i className="fas fa-save"></i> Guardar Año
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Formulario de Trimestre */}
            <div className='trimestre-form card'>
              <div className='card-header'>
                <h2>Agregar Trimestre</h2>
              </div>
              <div className='card-body'>
                <form onSubmit={handleTrimestreSubmit}>
                  <div className='input-group'>
                    <label htmlFor="gestion_id">Año Académico:</label>
                    <select
                      id="gestion_id"
                      name="gestion_id"
                      value={trimestreData.gestion_id}
                      onChange={handleTrimestreChange}
                      required
                    >
                      <option value="">Seleccione un año</option>
                      {gestiones.map((gestion) => (
                        <option key={gestion.id} value={gestion.id}>
                          {gestion.anio_escolar}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className='input-group'>
                    <label htmlFor="nro">Número:</label>
                    <input
                      type="number"
                      id="nro"
                      name="nro"
                      min="1"
                      max="4"
                      value={trimestreData.nro}
                      onChange={handleTrimestreChange}
                      placeholder="Ej: 1"
                      required
                    />
                  </div>

                  <div className='form-row'>
                    <div className='input-group'>
                      <label htmlFor="fecha_inicio">Fecha Inicio:</label>
                      <input
                        type="date"
                        id="fecha_inicio"
                        name="fecha_inicio"
                        value={trimestreData.fecha_inicio}
                        onChange={handleTrimestreChange}
                        required
                      />
                    </div>

                    <div className='input-group'>
                      <label htmlFor="fecha_fin">Fecha Fin:</label>
                      <input
                        type="date"
                        id="fecha_fin"
                        name="fecha_fin"
                        value={trimestreData.fecha_fin}
                        onChange={handleTrimestreChange}
                        required
                      />
                    </div>
                  </div>

                  <div className='input-group'>
                    <label htmlFor="estado_trimestre">Estado:</label>
                    <select
                      id="estado_trimestre"
                      name="estado"
                      value={trimestreData.estado}
                      onChange={handleTrimestreChange}
                    >
                      <option value={true}>Habilitado</option>
                      <option value={false}>Deshabilitado</option>
                    </select>
                  </div>

                  <div className='form-actions'>
                    <button type="submit" className='btn btn-secondary'>
                      <i className="fas fa-calendar-plus"></i> Guardar Trimestre
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Tabla de Gestiones y Trimestres */}
          <div className='gestion-table card'>
            <div className='card-header'>
              <h2>Periodos Académicos</h2>
            </div>
            <div className='card-body'>
              <div className='table-responsive'>
                <table>
                  <thead>
                    <tr>
                      <th>Gestión</th>
                      <th>Trimestre</th>
                      <th>Fecha Inicio</th>
                      <th>Fecha Fin</th>
                      <th>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {gestiones.map((gestion) => {
                      const gestionTrimestres = getTrimestresByGestion(gestion.id);

                      if (gestionTrimestres.length === 0) {
                        return (
                          <tr key={gestion.id}>
                            <td>{gestion.anio_escolar}</td>
                            <td colSpan={4} className="empty-message">
                              No hay trimestres registrados
                            </td>
                          </tr>
                        );
                      }

                      return gestionTrimestres.map((trimestre, index) => (
                        <tr key={trimestre.id}>
                          {index === 0 && (
                            <td rowSpan={gestionTrimestres.length} className="year-cell">
                              {gestion.anio}
                            </td>
                          )}
                          <td>{trimestre.nombre}</td>
                          <td>{formatSimpleDate(trimestre.fecha_inicio)}</td>
                          <td>{formatSimpleDate(trimestre.fecha_fin)}</td>
                          <td>
                            <span className={`status-badge ${trimestre.estado}`}>
                              {trimestre.estado}
                            </span>
                          </td>
                        </tr>
                      ));
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Gestiones