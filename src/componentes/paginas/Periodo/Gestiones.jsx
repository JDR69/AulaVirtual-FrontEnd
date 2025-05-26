import React, { useState, useEffect } from 'react';
import '../../css/Gestion.css';
import { crearNuevaGestionRequest, obtenerGestionRequest, crearNuevoTrimestreRequest } from '../../../api/auth';

function Gestiones() {
  const [gestionData, setGestionData] = useState({
    anio_escolar: '',
    estado: true,
  });

  const [trimestreData, setTrimestreData] = useState({
    nro: '',
    fecha_inicio: '',
    fecha_fin: '',
    estado: true,
    gestion: '', // ID de la gestión
  });

  const [gestiones, setGestiones] = useState([]);

  const handleGestionChange = (e) => {
    const { name, value } = e.target;
    setGestionData({
      ...gestionData,
      [name]: value,
    });
  };

  const handleTrimestreChange = (e) => {
    const { name, value } = e.target;
    setTrimestreData({
      ...trimestreData,
      [name]: value,
    });
  };

  const handleGestionSubmit = async (e) => {
    e.preventDefault();
    try {
      const newGestion = {
        anio_escolar: parseInt(gestionData.anio_escolar),
        estado: gestionData.estado,
      };
      const res = await crearNuevaGestionRequest(newGestion);
      console.log("Gestión creada:", res.data);
      fetchGestiones();
    } catch (error) {
      const mensaje = error.response?.data?.error || 'Error al crear la gestión';
      console.error(mensaje);
      alert(mensaje);
    }
  };

  const handleTrimestreSubmit = async (e) => {
    e.preventDefault();

    // Validaciones
    if (!trimestreData.gestion) {
      alert("Debe seleccionar un año académico.");
      return;
    }
    if (!trimestreData.nro || trimestreData.nro < 1 || trimestreData.nro > 4) {
      alert("El número de trimestre debe estar entre 1 y 4.");
      return;
    }
    if (!trimestreData.fecha_inicio || !trimestreData.fecha_fin) {
      alert("Debe ingresar las fechas de inicio y fin.");
      return;
    }
    if (new Date(trimestreData.fecha_inicio) >= new Date(trimestreData.fecha_fin)) {
      alert("La fecha de inicio debe ser anterior a la fecha de fin.");
      return;
    }

    // Obtener la gestión seleccionada
    const gestionSeleccionada = gestiones.find(
      (gestion) => gestion.gestion === parseInt(trimestreData.gestion)
    );

    if (!gestionSeleccionada) {
      alert("La gestión seleccionada no es válida.");
      return;
    }

    // Validar que no tenga más de 3 trimestres
    if (gestionSeleccionada.trimestres.length >= 3) {
      alert("La gestión seleccionada ya tiene 3 trimestres registrados.");
      return;
    }

    // Validar que las fechas no se solapen con los trimestres existentes
    const fechaInicioNueva = new Date(trimestreData.fecha_inicio);
    const fechaFinNueva = new Date(trimestreData.fecha_fin);

    const conflicto = gestionSeleccionada.trimestres.some((trimestre) => {
      const fechaInicioExistente = new Date(trimestre.fecha_inicio);
      const fechaFinExistente = new Date(trimestre.fecha_fin);

      return (
        (fechaInicioNueva >= fechaInicioExistente && fechaInicioNueva <= fechaFinExistente) ||
        (fechaFinNueva >= fechaInicioExistente && fechaFinNueva <= fechaFinExistente) ||
        (fechaInicioNueva <= fechaInicioExistente && fechaFinNueva >= fechaFinExistente)
      );
    });

    if (conflicto) {
      alert("El rango de fechas del trimestre no debe interferir con otros trimestres de la misma gestión.");
      return;
    }

    try {
      const data = {
        nro: parseInt(trimestreData.nro),
        fecha_inicio: trimestreData.fecha_inicio,
        fecha_final: trimestreData.fecha_fin,
        estado: trimestreData.estado,
        gestion: parseInt(trimestreData.gestion), // ID de la gestión
      };

      console.log("Datos enviados al backend:", data);

      const res = await crearNuevoTrimestreRequest(data);
      console.log("Trimestre creado:", res.data);
      fetchGestiones();
      alert("Trimestre creado exitosamente.");
    } catch (error) {
      console.error("Error al crear el trimestre:", error.response?.data || error);
      alert(error.response?.data?.error || "Error al crear el trimestre.");
    }
  };

  const fetchGestiones = async () => {
    try {
      const res = await obtenerGestionRequest();
      const gestionesConTrimestres = res.data.map((gestion) => ({
        ...gestion,
        trimestres: gestion.detalle.map((detalle) => ({
          id: detalle.trimestre_info.id,
          nro: detalle.trimestre_info.nro,
          fecha_inicio: detalle.trimestre_info.fecha_inicio,
          fecha_fin: detalle.trimestre_info.fecha_final,
          estado: detalle.trimestre_info.estado ? 'habilitado' : 'deshabilitado',
        })),
      }));
      setGestiones(gestionesConTrimestres);
    } catch (error) {
      console.error('Error al obtener las gestiones:', error);
    }
  };

  const formatSimpleDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' });
    return `${day}-${month}`;
  };

  useEffect(() => {
    fetchGestiones();
  }, []);

  return (
    <div className="contenedor-principal">
      <div className="contenedor-secundario">
        <div className="gestion-container">
          <div className="gestion-header">
            <h1>Gestión de Periodos Académicos</h1>
            <p>Administra los años académicos y sus respectivos trimestres</p>
          </div>

          <div className="gestion-forms-container">
            <div className="gestion-form card">
              <div className="card-header">
                <h2>Agregar Año Académico</h2>
              </div>
              <div className="card-body">
                <form onSubmit={handleGestionSubmit}>
                  <div className="input-group">
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

                  <div className="input-group">
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

                  <div className="form-actions">
                    <button type="submit" className="btn btn-primary">
                      <i className="fas fa-save"></i> Guardar Año
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <div className="trimestre-form card">
              <div className="card-header">
                <h2>Agregar Trimestre</h2>
              </div>
              <div className="card-body">
                <form onSubmit={handleTrimestreSubmit}>
                  <div className="input-group">
                    <label htmlFor="gestion">Año Académico:</label>
                    <select
                      id="gestion"
                      name="gestion"
                      value={trimestreData.gestion}
                      onChange={handleTrimestreChange}
                      required
                    >
                      <option value="">Seleccione un año</option>
                      {gestiones.map((gestion) => (
                        <option key={gestion.gestion} value={gestion.gestion}>
                          {gestion.anio_escolar}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="input-group">
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

                  <div className="form-row">
                    <div className="input-group">
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

                    <div className="input-group">
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

                  <div className="input-group">
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

                  <div className="form-actions">
                    <button type="submit" className="btn btn-secondary">
                      <i className="fas fa-calendar-plus"></i> Guardar Trimestre
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <div className="gestion-table card">
            <div className="card-header">
              <h2>Periodos Académicos</h2>
            </div>
            <div className="card-body">
              <div className="table-responsive">
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
                      if (gestion.trimestres.length === 0) {
                        return (
                          <tr key={gestion.gestion}>
                            <td>{gestion.anio_escolar}</td>
                            <td colSpan={4} className="empty-message">
                              No hay trimestres registrados
                            </td>
                          </tr>
                        );
                      }

                      return gestion.trimestres.map((trimestre, index) => (
                        <tr key={trimestre.id}>
                          {index === 0 && (
                            <td rowSpan={gestion.trimestres.length} className="year-cell">
                              {gestion.anio_escolar}
                            </td>
                          )}
                          <td>{trimestre.nro}</td>
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
  );
}

export default Gestiones;