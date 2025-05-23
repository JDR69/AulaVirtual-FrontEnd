import React, { useState, useEffect } from 'react';
import "../../css/PerfilUsuarioPage.css";
import { obtenerUsuarioRequest } from '../../../api/auth';

const PerfilUsuarioPage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState({
    nombre: '',
    ci: '',
    fechaNacimiento: '',
    sexo: '',
    estado: '',
    rol_nombre: '',
    matricula: '',
    telefono: '',
    especialidad: ''
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await obtenerUsuarioRequest();
        const data = Array.isArray(res.data) ? res.data[0] : res.data;
        setUser({
          nombre: data.nombre || '',
          ci: data.ci || '',
          fechaNacimiento: data.fecha_nacimiento || '',
          sexo: data.sexo || '',
          estado: data.estado ? 'Activo' : 'Inactivo',
          rol_nombre: data.rol_nombre || '',
          matricula: data.alumno?.matricula || '',
          telefono: data.alumno?.telefono || '',
          especialidad: data.profesor?.especialidad || ''
        });
      } catch (error) {
        console.error('Error al obtener usuario:', error);
      }
    };
    fetchUser();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleEdit = () => {
    setIsEditing(!isEditing);
    // Aquí puedes agregar lógica para guardar cambios si es necesario
  };

  return (
    <div className='contenedor-principal'>
      <div className='contenedor-secundario'>
        <h1>Perfil de Usuario</h1>
        <div className='contenedor-perfil'>
          <div className="mb-3">
            <label>Nombre:</label>
            <input
              type="text"
              className="form-control"
              name="nombre"
              value={user.nombre}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>
          <div className="mb-3">
            <label>CI:</label>
            <input
              type="text"
              className="form-control"
              name="ci"
              value={user.ci}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>
          <div className="mb-3">
                <label>Teléfono:</label>
                <input
                  type="tel"
                  className="form-control"
                  name="telefono"
                  value={user.telefono}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>
          {/* Solo mostrar matrícula y teléfono si es alumno */}
          {user.rol_nombre === "Alumno" && (
            <>
              <div className="mb-3">
                <label>Matricula:</label>
                <input
                  type="text"
                  className="form-control"
                  name="matricula"
                  value={user.matricula}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>
              
            </>
          )}
          <div className="mb-3">
            <label>Fecha de Nacimiento:</label>
            <input
              type="date"
              className="form-control"
              name="fechaNacimiento"
              value={user.fechaNacimiento}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>
          <div className="mb-3">
            <label>Sexo:</label>
            <input
              type="text"
              className="form-control"
              name="sexo"
              value={user.sexo}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>
          {/* Solo mostrar especialidad si es profesor */}
          {user.rol_nombre === "Profesor" && (
            <div className="mb-3">
              <label>Especialidad:</label>
              <input
                type="text"
                className="form-control"
                name="especialidad"
                value={user.especialidad}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>
          )}
          <div className="mb-3">
            <label>Estado:</label>
            <input
              type="text"
              className="form-control"
              name="estado"
              value={user.estado}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>
        </div>
        <div className='contenedor-button'>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleEdit}
          >
            {isEditing ? 'Guardar' : 'Editar'}
          </button>
          <button
            type="button"
            className="btn btn-warning"
            onClick={() => setIsEditing(false)}
            disabled={!isEditing}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

export default PerfilUsuarioPage;