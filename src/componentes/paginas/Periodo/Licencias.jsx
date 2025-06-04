import React, { useState, useEffect } from 'react';
import '../../../componentes/css/Licencias.css';
import { obtenerLicenciaRequeet } from '../../../api/auth';

function Licencias() {
  const [licencias, setLicencias] = useState([]);
  const [formData, setFormData] = useState({
    motivo: '',
    fechaInicio: '',
    fechaFin: '',
    descripcion: '',
    documentoAdjunto: null
  });
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState(null);
  const [fechaConsulta, setFechaConsulta] = useState(formatearFecha(new Date()));

  // Función para formatear la fecha (YYYY-MM-DD)
  function formatearFecha(fecha) {
    const date = new Date(fecha);
    return date.toISOString().split('T')[0];
  }

  // Cargar licencias desde la API con la fecha especificada
  const cargarLicencias = async (fecha) => {
    try {
      setLoadingData(true);
      // Enviamos la fecha en el cuerpo de la solicitud
      const response = await obtenerLicenciaRequeet({ fecha });
      console.log("Licencias obtenidas:", response.data);
      setLicencias(response.data || []);
      setError(null);
    } catch (err) {
      console.error("Error al cargar las licencias:", err);
      setError(`Error al cargar las licencias: ${err.message}. Código: ${err.response?.status || 'desconocido'}`);
      setLicencias([]);
    } finally {
      setLoadingData(false);
    }
  };

  // Efecto inicial para cargar licencias con la fecha actual
  useEffect(() => {
    cargarLicencias(fechaConsulta);
  }, [fechaConsulta]);

  // Manejar cambio en la fecha de consulta
  const handleFechaConsultaChange = (e) => {
    const nuevaFecha = e.target.value;
    setFechaConsulta(nuevaFecha);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      documentoAdjunto: e.target.files[0]
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Aquí iría el código para enviar a la API
    // Por ahora solo simularemos el envío
    setTimeout(() => {
      const nuevaLicencia = {
        id: licencias.length > 0 ? Math.max(...licencias.map(l => l.id)) + 1 : 1,
        descripcion: formData.descripcion,
        fecha: formData.fechaInicio,
        alumno: 38,
        nombre_usuario: "Usuario Actual",
        imagen: "http://ejemplo.com/imagen.jpg"
      };
      
      setLicencias([...licencias, nuevaLicencia]);
      setFormData({
        motivo: '',
        fechaInicio: '',
        fechaFin: '',
        descripcion: '',
        documentoAdjunto: null
      });
      setLoading(false);
      alert('Solicitud de licencia enviada correctamente');
    }, 1000);
  };

  return (
    <div className='contenedor-principal'>
      <div className='contenedor-secundario'>

      <div className="licencias-container">
        <div className="licencias-header">
          <h1>Gestión de Licencias</h1>
          <p>Solicita y gestiona tus licencias académicas</p>
        </div>
        
        <div className="licencias-content">
          {/* <div className="licencias-form-section">
            <h2>Nueva Solicitud</h2>
            <form onSubmit={handleSubmit} className="licencia-form">
              <div className="form-group">
                <label htmlFor="motivo">Motivo</label>
                <select 
                  id="motivo" 
                  name="motivo" 
                  value={formData.motivo} 
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Seleccione un motivo</option>
                  <option value="Enfermedad">Enfermedad</option>
                  <option value="Viaje académico">Viaje académico</option>
                  <option value="Asunto familiar">Asunto familiar</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="fechaInicio">Fecha de inicio</label>
                  <input 
                    type="date" 
                    id="fechaInicio" 
                    name="fechaInicio" 
                    value={formData.fechaInicio} 
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="fechaFin">Fecha de finalización</label>
                  <input 
                    type="date" 
                    id="fechaFin" 
                    name="fechaFin" 
                    value={formData.fechaFin} 
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="descripcion">Descripción</label>
                <textarea 
                  id="descripcion" 
                  name="descripcion" 
                  value={formData.descripcion} 
                  onChange={handleInputChange}
                  rows="4"
                  placeholder="Describa detalladamente el motivo de su solicitud"
                  required
                ></textarea>
              </div>
              
              <div className="form-group">
                <label htmlFor="documentoAdjunto">Documento de respaldo</label>
                <input 
                  type="file" 
                  id="documentoAdjunto" 
                  name="documentoAdjunto" 
                  onChange={handleFileChange}
                />
                <small>Formatos aceptados: PDF, JPG, PNG (máx. 5MB)</small>
              </div>
              
              <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? 'Enviando...' : 'Enviar Solicitud'}
              </button>
            </form>
          </div> */}
          
          <div className="licencias-list-section">
            <h2>Mis Solicitudes</h2>
            <div className="filtro-fecha">
              <label htmlFor="fechaConsulta">Filtrar por fecha:</label>
              <input 
                type="date" 
                id="fechaConsulta"
                value={fechaConsulta}
                onChange={handleFechaConsultaChange}
                className="input-fecha-consulta"
              />
            </div>

            {loadingData ? (
              <p className="loading-message">Cargando licencias...</p>
            ) : error ? (
              <div>
                <p className="error-message">{error}</p>
                <p className="info-message">Mostrando datos de ejemplo mientras se resuelve el problema con el servidor.</p>
              </div>
            ) : licencias.length > 0 ? (
              <div className="licencias-table-container">
                <table className="licencias-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Descripción</th>
                      <th>Fecha</th>
                      <th>Usuario</th>
                      <th>Documento</th>
                    </tr>
                  </thead>
                  <tbody>
                    {licencias.map((licencia) => (
                      <tr key={licencia.id}>
                        <td>{licencia.id}</td>
                        <td>{licencia.descripcion}</td>
                        <td>{licencia.fecha}</td>
                        <td>{licencia.nombre_usuario}</td>
                        <td>
                          {licencia.imagen && (
                            <button className="btn-accion" onClick={() => window.open(licencia.imagen, '_blank')}>
                              Ver Documento
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="no-licencias">No hay licencias para la fecha seleccionada.</p>
            )}
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}

export default Licencias;