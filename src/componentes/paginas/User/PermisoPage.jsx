import React from 'react'
import '../../css/Permiso.css'

const PermisoPage = () => {
    return (
        <div className='contenedor-principal'>
            <div className='contenedor-secundario'>
                <div className="contenedor-permiso">
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
                                    <tr>
                                        <td>1</td>
                                        <td>Profesor</td>
                                        <td><button>✏️</button> <button>🗑️</button></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

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
                                    <tr>
                                        <td>1</td>
                                        <td>Ver Reportes</td>
                                        <td><button>✏️</button> <button>🗑️</button></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div id="permisos" className="seccion-permiso">
                        <div className="encabezado">
                            <label>🧩 Permisos por Rol</label>
                            <select className="selector-rol">
                                <option>Seleccione un rol</option>
                                <option>Profesor</option>
                                <option>Alumno</option>
                            </select>
                        </div>
                        <div className="checkbox-container">
                            <label><input type="checkbox" /> Ver Reportes</label>
                            <label><input type="checkbox" /> Crear Tareas</label>
                            <label><input type="checkbox" /> Editar Usuarios</label>
                        </div>
                        <button className="btn-guardar">💾 Guardar Cambios</button>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default PermisoPage
