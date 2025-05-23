import React, { useState } from 'react'
import '../../css/Permiso.css'
import { useAuth } from '../../../context/AuthContext'

const PermisoPage = () => {
  const { roles, privilegios, permisos } = useAuth();
  const [rolSeleccionado, setRolSeleccionado] = useState('');
  const [permisosDelRol, setPermisosDelRol] = useState([]);

  const handleSeleccionarRol = (e) => {
    const rolNombre = e.target.value;
    setRolSeleccionado(rolNombre);

    const rolEncontrado = permisos.find((p) => p.rol === rolNombre);
    setPermisosDelRol(rolEncontrado ? [...rolEncontrado.permisos] : []);
  };

  const handleTogglePermiso = (id) => {
    const nuevosPermisos = permisosDelRol.map((permiso) =>
      permiso.id === id ? { ...permiso, estado: !permiso.estado } : permiso
    );
    setPermisosDelRol(nuevosPermisos);
  };

  // Enviar cambios al backend
  const handleGuardarCambios = async () => {
    try {
      for (const permiso of permisosDelRol) {
        await fetch('/api/permisos/actualizar/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            rol: permiso.rol.id,
            privilegio: permiso.privilegio.id,
            estado: permiso.estado
          })
        });
      }
      alert("Cambios guardados correctamente");
    } catch (error) {
      console.error("Error al guardar permisos:", error);
      alert("Ocurrió un error al guardar los permisos.");
    }
  };
  return (
    <div className='contenedor-principal'>
      <div className='contenedor-secundario'>
        <div className="contenedor-permiso">

          {/* Sección Roles */}
          <div id="roles" className="seccion-permiso">
            <div className="encabezado">
              <label>🧑‍💼 Roles</label>
              <button className="btn-agregar">➕ Agregar Rol</button>
            </div>
            <div className="dimensionTable">
              <table className="table-striped">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {roles.map((rol) => (
                    <tr key={rol.id}>
                      <td>{rol.id}</td>
                      <td>{rol.nombre}</td>
                      <td>🛠️</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Sección Privilegios */}
          <div id="privilegios" className="seccion-permiso">
            <div className="encabezado">
              <label>🔐 Privilegios</label>
              <button className="btn-agregar">➕ Agregar Privilegio</button>
            </div>
            <div className="dimensionTable">
              <table className="table-striped">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Descripción</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {privilegios.map((privilegio) => (
                    <tr key={privilegio.id}>
                      <td>{privilegio.id}</td>
                      <td>{privilegio.descripcion}</td>
                      <td>🛠️</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Sección de selección de rol */}
          <div id="permisos" className="seccion-permiso">
            <div className="encabezado">
              <label>🧩 Permisos por Rol</label>
              <select className="selector-rol" onChange={handleSeleccionarRol}>
                <option value="">Seleccione un rol</option>
                {permisos.map((rol) => (
                  <option key={rol.rol} value={rol.rol}>{rol.rol}</option>
                ))}
              </select>
            </div>

            {/* Checkboxes editables */}
            <div className="checkbox-container">
              {permisosDelRol.map((permiso) => (
                <label key={permiso.id}>
                  <input
                    type="checkbox"
                    checked={permiso.estado}
                    onChange={() => handleTogglePermiso(permiso.id)}
                  />
                  {permiso.privilegio.descripcion}
                </label>
              ))}
            </div>

            <button className="btn-guardar" onClick={handleGuardarCambios}>
              💾 Guardar Cambios
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PermisoPage;
