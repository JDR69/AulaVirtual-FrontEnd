import React, { useState } from 'react'
import '../../css/Permiso.css'
import { useAuth } from '../../../context/AuthContext'
import { crearNuevoRolRequest, nuevoPrivilegioRequest,
      actualizarRolRequest, actualizarPrivilegioRequest
 } from '../../../api/auth'

const PermisoPage = () => {
  const { roles, privilegios, permisos } = useAuth();
  const [rolSeleccionado, setRolSeleccionado] = useState('');
  const [permisosDelRol, setPermisosDelRol] = useState([]);
  const [mostrarForm, setMostrarForm] = useState(null); // 'rol' | 'privilegio' | 'editarRol' | 'editarPrivilegio' | null
  const [nuevoRol, setNuevoRol] = useState({ nombre: '' });
  const [nuevoPrivilegio, setNuevoPrivilegio] = useState({ descripcion: '' });
  const [editandoItem, setEditandoItem] = useState(false); // Para almacenar el item que se está editando

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

  // Crear nuevo rol
  const handleCrearNuevoRol = async (e) => {
    e.preventDefault();
    if (!nuevoRol.nombre) {
      alert('Debe ingresar el nombre para el nuevo rol.');
      return;
    }
    try {
      const data = {
        nombre: nuevoRol.nombre
      }
      await crearNuevoRolRequest(data);
      alert('Rol creado correctamente');
      setNuevoRol({ nombre: '' });
      setMostrarForm(null);
    } catch (error) {
      console.log(error);
      alert('Error al crear el rol');
    }
  };

  // Crear nuevo privilegio
  const handleCrearNuevoPrivilegio = async (e) => {
    e.preventDefault();
    if (!nuevoPrivilegio.descripcion) {
      alert('Debe ingresar la descripción para el nuevo privilegio.');
      return;
    }
    try {
      await nuevoPrivilegioRequest({ descripcion: nuevoPrivilegio.descripcion });
      alert('Privilegio creado correctamente');
      setNuevoPrivilegio({ descripcion: '' });
      setMostrarForm(null);
    } catch (error) {
      alert('Error al crear el privilegio');
    }
  };

  // FUNCIONES PARA EDITAR ROL
  const handleEditarRol = (rol) => {
    setEditandoItem(rol);
    setNuevoRol({ nombre: rol.nombre });
    setMostrarForm('editarRol');
  };
const handleActualizarRol = async (e) => {
  e.preventDefault();
  if (!nuevoRol.nombre) {
    alert('Debe ingresar el nombre del rol.');
    return;
  }
  try {
    const data = {
      nombre: nuevoRol.nombre
    };
    // Pasar el ID como segundo parámetro separado
    await actualizarRolRequest(data, editandoItem.id);
    alert('Rol actualizado correctamente');
    cerrarModal();
  } catch (error) {
    console.log(error);
    alert('Error al actualizar el rol');
  }
};

  // FUNCIONES PARA EDITAR PRIVILEGIO
  const handleEditarPrivilegio = (privilegio) => {
  setEditandoItem(privilegio); // Guarda el objeto privilegio completo
  setNuevoPrivilegio({ descripcion: privilegio.descripcion });
  setMostrarForm('editarPrivilegio');
};

const handleActualizarPrivilegio = async (e) => {
  e.preventDefault();
  if (!nuevoPrivilegio.descripcion) {
    alert('Debe ingresar la descripción del privilegio.');
    return;
  }
  try {
    const data = {
      descripcion: nuevoPrivilegio.descripcion
    };
    // Pasar el ID como segundo parámetro separado
    await actualizarPrivilegioRequest(data, editandoItem.id);
    alert('Privilegio actualizado correctamente');
    cerrarModal();
  } catch (error) {
    console.log(error);
    alert('Error al actualizar el privilegio');
  }
};

  // Función para cerrar modal y limpiar estados
  const cerrarModal = () => {
    setMostrarForm(null);
    setEditandoItem(null);
    setNuevoRol({ nombre: '' });
    setNuevoPrivilegio({ descripcion: '' });
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
      {/* Modal global para agregar/editar rol o privilegio */}
      {mostrarForm && (
        <div className="modal-overlay">
          <div className="form-flotante">
            
            {/* MODAL AGREGAR ROL */}
            {mostrarForm === 'rol' && (
              <>
                <h2>Agregar Nuevo Rol</h2>
                <form onSubmit={handleCrearNuevoRol}>
                  <input
                    className='form-control'
                    type="text"
                    placeholder="Nombre del rol"
                    value={nuevoRol.nombre}
                    onChange={e => setNuevoRol({ ...nuevoRol, nombre: e.target.value })}
                  />
                <div className='contenedor-contenido'>
                  <button type="submit" className="btn btn-success">Guardar</button>
                  <button type="button" className="btn btn-danger" onClick={cerrarModal}>Cancelar</button>
                  </div>
                </form>
              </>
            )}

            {/* MODAL EDITAR ROL */}
            {mostrarForm === 'editarRol' && (
              <>
                <h2>Editar Rol</h2>
                <form onSubmit={handleActualizarRol}>
                  <input
                    className='form-control'
                    type="text"
                    placeholder="Nombre del rol"
                    value={nuevoRol.nombre}
                    onChange={e => setNuevoRol({ ...nuevoRol, nombre: e.target.value })}
                  />
                   <div className='contenedor-contenido'>
                  <button type="submit" className="btn btn-success">Guardar</button>
                  <button type="button" className="btn btn-danger" onClick={cerrarModal}>Cancelar</button>
                  </div>
                </form>
              </>
            )}

            {/* MODAL AGREGAR PRIVILEGIO */}
            {mostrarForm === 'privilegio' && (
              <>
                <h2>Agregar Nuevo Privilegio</h2>
                <form onSubmit={handleCrearNuevoPrivilegio}>
                  <input
                    className='form-control'
                    type="text"
                    placeholder="Descripción del privilegio"
                    value={nuevoPrivilegio.descripcion}
                    onChange={e => setNuevoPrivilegio({ descripcion: e.target.value })}
                  />
                  <div className='contenedor-contenido'>
                  <button type="submit" className="btn btn-success">Guardar</button>
                  <button type="button" className="btn btn-danger" onClick={cerrarModal}>Cancelar</button>
                  </div>
                </form>
              </>
            )}

            {/* MODAL EDITAR PRIVILEGIO */}
            {mostrarForm === 'editarPrivilegio' && (
              <>
                <h2>Editar Privilegio</h2>
                <form onSubmit={handleActualizarPrivilegio}>
                  <input
                    className='form-control'
                    type="text"
                    placeholder="Descripción del privilegio"
                    value={nuevoPrivilegio.descripcion}
                    onChange={e => setNuevoPrivilegio({ descripcion: e.target.value })}
                  />
                   <div className='contenedor-contenido'>
                  <button type="submit" className="btn btn-success">Guardar</button>
                  <button type="button" className="btn btn-danger" onClick={cerrarModal}>Cancelar</button>
                  </div>
                </form>
              </>
            )}

          </div>
        </div>
      )}

      <div className='contenedor-secundario'>
        <div className="contenedor-permiso">

          {/* Sección Roles */}
          <div id="roles" className="seccion-permiso">
            <div className="encabezado">
              <label>🧑‍💼 Roles</label>
              <button className="btn-agregar" onClick={() => setMostrarForm('rol')}>➕ Agregar Rol</button>
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
                      <td>
                        <button 
                          onClick={() => handleEditarRol(rol)}
                          style={{ 
                            background: 'none', 
                            border: 'none', 
                            cursor: 'pointer', 
                            fontSize: '16px' 
                          }}
                          title="Editar rol"
                        >
                          🛠️
                        </button>
                      </td>
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
              <button className="btn-agregar" onClick={() => setMostrarForm('privilegio')}>➕ Agregar Privilegio</button>
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
                      <td>
                        <button 
                          onClick={() => handleEditarPrivilegio(privilegio)}
                          style={{ 
                            background: 'none', 
                            border: 'none', 
                            cursor: 'pointer', 
                            fontSize: '16px' 
                          }}
                          title="Editar privilegio"
                        >
                          🛠️
                        </button>
                      </td>
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