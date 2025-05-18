import React, { useState } from 'react';
import "../../css/PerfilUsuarioPage.css";

const PerfilUsuarioPage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser ] = useState({
    nombre: "Vinicius",
    ci: "12345678",
    matricula: "20230001",
    telefono: "123456789",
    fechaNacimiento: "01-05-2000",
    sexo: "Masculino",
    especialidad: "gambeta",
    estado: "Activo"
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser ({ ...user, [name]: value });
  };

  const handleEdit = () => {
    setIsEditing(!isEditing);
  };

  return (
    <div className='contenedor-principal'>
      <div className='contenedor-secundario' id='contenedor-secundario-Perfil'>
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

