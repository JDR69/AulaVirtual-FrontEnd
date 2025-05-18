import React from 'react'
import '../../css/Academia.css'

const GestionAcademico = () => {
  return (
    <div className='contenedor-principal'>
        <div className='contenedor-secundario'>
        <div className="contenedor-academia">
                    <div  className="seccion-academia">
                        <div className="encabezado">
                            <label>🎓 Niveles</label>
                            <button id='agregar'>✚</button>
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

                    <div className="seccion-academia">
                        <div className="encabezado">
                            <label>🏫 Cursos</label>
                            <button id='agregar'>✚</button>
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

                    <div className="seccion-academia">
                        <div className="encabezado">
                            <label>📚 Paralelos</label>
                            <button id='agregar'>✚</button>
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

                    <div className="seccion-academia">
                        <div className="encabezado">
                            <label>📖 Materias</label>
                            <button id='agregar'>✚</button>
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
                    <div className="seccion-academia">
                        <div className="encabezado">
                            <label>⏰ Horarios</label>
                            <button id='agregar'>✚</button>
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
                </div>
        </div>
    </div>
  )
}

export default GestionAcademico
