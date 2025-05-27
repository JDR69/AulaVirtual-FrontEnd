import React, { useState, useEffect } from 'react';
import { obtenerDimensionRequest } from '../../../api/auth';

function TipoActividadPage() {
  const [actividades, setActividades] = useState([]);
  const [dimensiones, setDimensiones] = useState([]);
  const [formData, setFormData] = useState({
    nombre: '',
    estado: '',
    dimension: '',
    puntaje: '',
  });

  // Cargar dimensiones al montar el componente
  useEffect(() => {
    const fetchDimensiones = async () => {
      try {
        const response = await obtenerDimensionRequest();
        console.log('Respuesta de la API:', response); // Depuración
        if (Array.isArray(response.data)) {
          setDimensiones(response.data); // Asegúrate de acceder a `response.data`
        } else {
          console.error('La respuesta de obtenerDimensionRequest no es un array:', response);
        }
      } catch (error) {
        console.error('Error al obtener dimensiones:', error);
      }
    };

    fetchDimensiones();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Si el campo es "dimension", actualiza también el puntaje
    if (name === 'dimension') {
      const selectedDimension = dimensiones.find(
        (dimension) => dimension.descripcion === value
      );
      setFormData({
        ...formData,
        [name]: value,
        puntaje: selectedDimension ? selectedDimension.puntaje : '',
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setActividades([...actividades, formData]);
    setFormData({ nombre: '', estado: '', dimension: '', puntaje: '' });
  };

  return (
    <div className="contenedor-principal">
      <div className="contenedor-secundario">
        <h1>Tipo de Actividad</h1>
        <form onSubmit={handleSubmit} className="gestion-forms-container">
          <div className="input-group">
            <label htmlFor="nombre">Nombre</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="estado">Estado</label>
            <select
              id="estado"
              name="estado"
              value={formData.estado}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione</option>
              <option value="Habilitado">Habilitado</option>
              <option value="Deshabilitado">Deshabilitado</option>
            </select>
          </div>
          <div className="input-group">
            <label htmlFor="dimension">Dimensión</label>
            <select
              id="dimension"
              name="dimension"
              value={formData.dimension}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione</option>
              {Array.isArray(dimensiones) &&
                dimensiones.map((dimension) => (
                  <option key={dimension.id} value={dimension.descripcion}>
                    {dimension.descripcion}
                  </option>
                ))}
            </select>
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary2">
              Crear Actividad
            </button>
          </div>
        </form>

        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Estado</th>
                <th>Dimensión</th>
                <th>Puntaje</th>
              </tr>
            </thead>
            <tbody>
              {actividades.length > 0 ? (
                actividades.map((actividad, index) => (
                  <tr key={index}>
                    <td>{actividad.nombre}</td>
                    <td>{actividad.estado}</td>
                    <td>{actividad.dimension}</td>
                    <td>{actividad.puntaje}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="empty-message">
                    No hay actividades registradas.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default TipoActividadPage;