import React, { useState } from 'react'
import '../../css/Academia.css'
import { useAuth } from '../../../context/AuthContext'

const GestionAcademico = () => {
  const {
    cursos,
    setCursos,
    materias,
    setMaterias,
    horarios,
    setHorarios,
    niveles,
    setNiveles,
    paralelos,
    setParalelos
  } = useAuth();

  const [editar, setEditar] = useState(false)
  const [index, setIndex] = useState(null)

  const [mostrarEstado, setMostrarEstado] = useState(false)
  const [mostrarCurso, setMostrarCurso] = useState(false)
  const [mostrarParalelo, setMostrarParalelo] = useState(false)
  const [mostrarMateria, setMostrarMateria] = useState(false)
  const [mostrarHorario, setMostrarHorario] = useState(false)

  const [nuevoCurso, setNuevoCurso] = useState({ nombre: '', estado: true })
  const [nuevoDato, setNuevoDato] = useState({ nombre: '', estado: true })
  const [nuevoParalelo, setNuevoParalelo] = useState({ descripcion: '', estado: true })
  const [nuevaMateria, setNuevaMateria] = useState({ nombre: '', descripcion: '', estado: true })
  const [nuevoHorario, setNuevoHorario] = useState({ inicio: '', fin: '' })

  //CRUD DE NIVELES

  const nuevoNivel = () => {
    setNuevoDato({ nombre: '', estado: true })
    setEditar(false)
    setIndex(null)
    setMostrarEstado(true)
  }
  const guardarNivel_backend = () => {
    if (editar) {
      setNiveles(niveles.map((nivel, i) => i === index ? nuevoDato : nivel))
      setEditar(false)
    } else {
      setNiveles([nuevoDato, ...niveles])
    }
    setMostrarEstado(false)
    setNuevoDato({ nombre: '', estado: true })
  }

  const eliminarNivel_backend = (index) => {
    setNiveles(niveles.filter((nivel, i) => i !== index))
  }

  const editarNivel_backend = (nivel, index) => {
    setNuevoDato(nivel)
    setEditar(true)
    setIndex(index)
    setMostrarEstado(true)
  }

  //CRUD DE CURSOS
  const nuevoCursoAcademia = () => {
    setNuevoCurso({ nombre: '', estado: true })
    setEditar(false)
    setIndex(null)
    setMostrarCurso(true)
  }
  const guardarCurso_backend = () => {
    if (editar) {
      setCursos(cursos.map((curso, i) => i === index ? nuevoCurso : curso))
      setEditar(false)
    } else {
      setCursos([nuevoCurso, ...cursos])
    }
    setMostrarCurso(false)
    setNuevoCurso({ nombre: '', estado: true })
  }

  const eliminarCurso_backend = (index) => {
    setCursos(cursos.filter((curso, i) => i !== index))
  }

  const editarCurso_backend = (curso, index) => {
    setNuevoCurso(curso)
    setEditar(true)
    setIndex(index)
    setMostrarCurso(true)
  }

  //CRUD DE PARALELOS
  const nuevoParaleloAcademia = () => {
    setNuevoParalelo({ descripcion: '', estado: true })
    setEditar(false)
    setIndex(null)
    setMostrarParalelo(true)
  }
  const guardarParalelo_backend = () => {
    if (editar) {
      setParalelos(paralelos.map((paralelo, i) => i === index ? nuevoParalelo : paralelo))
      setEditar(false)
    } else {
      setParalelos([nuevoParalelo, ...paralelos])
    }
    setMostrarParalelo(false)
    setNuevoParalelo({ descripcion: '', estado: true })
  }

  const eliminarParalelo_backend = (index) => {
    setParalelos(paralelos.filter((paralelo, i) => i !== index))
  }

  const editarParalelo_backend = (paralelo, index) => {
    setNuevoParalelo(paralelo)
    setEditar(true)
    setIndex(index)
    setMostrarParalelo(true)
  }

  //CRUD DE MATERIAS
  const nuevoMateriaAcademia = () => {
    setNuevaMateria({ nombre: '', descripcion: '', estado: true })
    setEditar(false)
    setIndex(null)
    setMostrarMateria(true)
  }
  const guardarMateria_backend = () => {
    if (editar) {
      setMaterias(materias.map((materia, i) => i === index ? nuevaMateria : materia))
      setEditar(false)
    } else {
      setMaterias([nuevaMateria, ...materias])
    }
    setMostrarMateria(false)
    setNuevaMateria({ nombre: '', descripcion: '', estado: true })
  }

  const eliminarMateria_backend = (index) => {
    setMaterias(materias.filter((materia, i) => i !== index))
  }

  const editarMateria_backend = (materia, index) => {
    setNuevaMateria(materia)
    setEditar(true)
    setIndex(index)
    setMostrarMateria(true)
  }

  //CRUD DE HORARIOS
  const nuevoHorarioAcademia = () => {
    setNuevoHorario({ inicio: '', fin: '' })
    setEditar(false)
    setIndex(null)
    setMostrarHorario(true)
  }
  const guardarHorario_backend = () => {
    if (editar) {
      setHorarios(horarios.map((horario, i) => i === index ? nuevoHorario : horario))
      setEditar(false)
    } else {
      setHorarios([nuevoHorario, ...horarios])
    }
    setMostrarHorario(false)
    setNuevoHorario({ inicio: '', fin: '' })
  }

  const eliminarHorario_backend = (index) => {
    setHorarios(horarios.filter((horario, i) => i !== index))
  }

  const editarHorario_backend = (horario, index) => {
    setNuevoHorario(horario)
    setEditar(true)
    setIndex(index)
    setMostrarHorario(true)
  }

  return (
    <div className='contenedor-principal'>
      <div className='contenedor-secundario'>
        <div className="contenedor-academia">
          {/* SECCION NIVELES */}
          <div className="seccion-academia">
            <div className="encabezado">
              <label>🎓 Niveles</label>
              <button id='agregar' onClick={nuevoNivel}>✚</button>
            </div>
            <div className="dimensionTable">
              <table className="table-striped">
                <thead>
                  <tr><th>ID</th><th>Nombre</th><th>Estado</th><th>Acciones</th></tr>
                </thead>
                <tbody>
                  {niveles.map((nivel, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{nivel.nombre}</td>
                      <td>{nivel.estado ? 'Activo' : 'Inactivo'}</td>
                      <td>
                        <button className='btn btn-primary' onClick={() => editarNivel_backend(nivel, index)}><i className="bi bi-pencil-square"></i></button>
                        <button onClick={() => eliminarNivel_backend(index)} className='btn btn-danger'><i className="bi bi-trash3-fill"></i></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {
            mostrarEstado && (
              <div className='form-gris'>
                <div className='form-flotante'>
                  <div className='form-academia'>
                    <label>Descripcion del Nivel</label>
                    <input
                      type="text"
                      name='nombre'
                      value={nuevoDato.nombre}
                      onChange={(e) => setNuevoDato({ ...nuevoDato, [e.target.name]: e.target.value })}
                      placeholder='nombre del nivel'
                    />
                    <div id='botone-option'>
                      <button onClick={guardarNivel_backend} className='btn btn-success'>{editar ? 'Actualizar' : 'Guardar'}</button>
                      <button onClick={() => setMostrarEstado(false)} className='btn btn-danger'>Cancelar</button>
                    </div>
                  </div>
                </div>
              </div>
            )
          }

          {/* SECCION CURSOS */}
          <div className="seccion-academia">
            <div className="encabezado">
              <label>🏫 Cursos</label>
              <button id='agregar' onClick={nuevoCursoAcademia}>✚</button>
            </div>
            <div className="dimensionTable">
              <table className="table-striped">
                <thead>
                  <tr><th>ID</th><th>Nombre</th><th>Estado</th><th>Acciones</th></tr>
                </thead>
                <tbody>
                  {
                    cursos.map((curso, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{curso.nombre}</td>
                        <td>{curso.estado ? 'Activo' : 'Inactivo'}</td>
                        <td>
                          <button className='btn btn-primary' onClick={() => editarCurso_backend(curso, index)}><i className="bi bi-pencil-square"></i></button>
                          <button onClick={() => eliminarCurso_backend(index)} className='btn btn-danger'><i className="bi bi-trash3-fill"></i></button>
                        </td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>
          </div>
          {
            mostrarCurso && (
              <div className='form-gris'>
                <div className='form-flotante'>
                  <div className='form-academia'>
                    <label>Nombre del Curso</label>
                    <input
                      type="text"
                      name='nombre'
                      value={nuevoCurso.nombre}
                      onChange={(e) => setNuevoCurso({ ...nuevoCurso, [e.target.name]: e.target.value })}
                      placeholder='nombre del curso'
                    />
                    <div id='botone-option'>
                      <button onClick={guardarCurso_backend} className='btn btn-success'>{editar ? 'Actualizar' : 'Guardar'}</button>
                      <button onClick={() => setMostrarCurso(false)} className='btn btn-danger'>Cancelar</button>
                    </div>
                  </div>
                </div>
              </div>
            )
          }

          {/* SECCION PARALELOS */}
          <div className="seccion-academia">
            <div className="encabezado">
              <label>📚 Paralelos</label>
              <button id='agregar' onClick={nuevoParaleloAcademia}>✚</button>
            </div>
            <div className="dimensionTable">
              <table className="table-striped">
                <thead>
                  <tr><th>ID</th><th>Descripción</th><th>Estado</th><th>Acciones</th></tr>
                </thead>
                <tbody>
                  {
                    paralelos.map((paralelo, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{paralelo.descripcion}</td>
                        <td>{paralelo.estado ? 'Activo' : 'Inactivo'}</td>
                        <td>
                          <button className='btn btn-primary' onClick={() => editarParalelo_backend(paralelo, index)}><i className="bi bi-pencil-square"></i></button>
                          <button onClick={() => eliminarParalelo_backend(index)} className='btn btn-danger'><i className="bi bi-trash3-fill"></i></button>
                        </td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>
          </div>
          {
            mostrarParalelo && (
              <div className='form-gris'>
                <div className='form-flotante'>
                  <div className='form-academia'>
                    <label>Descripción del Paralelo</label>
                    <input
                      type="text"
                      name='descripcion'
                      value={nuevoParalelo.descripcion}
                      onChange={(e) => setNuevoParalelo({ ...nuevoParalelo, [e.target.name]: e.target.value })}
                      placeholder='descripción del paralelo'
                    />
                    <div id='botone-option'>
                      <button onClick={guardarParalelo_backend} className='btn btn-success'>{editar ? 'Actualizar' : 'Guardar'}</button>
                      <button onClick={() => setMostrarParalelo(false)} className='btn btn-danger'>Cancelar</button>
                    </div>
                  </div>
                </div>
              </div>
            )
          }

          {/* SECCION MATERIAS */}
          <div className="seccion-academia">
            <div className="encabezado">
              <label>📖 Materias</label>
              <button id='agregar' onClick={nuevoMateriaAcademia}>✚</button>
            </div>
            <div className="dimensionTable">
              <table className="table-striped">
                <thead>
                  <tr><th>ID</th><th>Nombre</th><th>Descripción</th><th>Estado</th><th>Acciones</th></tr>
                </thead>
                <tbody>
                  {
                    materias.map((materia, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{materia.nombre}</td>
                        <td>{materia.descripcion}</td>
                        <td>{materia.estado ? 'Activo' : 'Inactivo'}</td>
                        <td>
                          <button className='btn btn-primary' onClick={() => editarMateria_backend(materia, index)}><i className="bi bi-pencil-square"></i></button>
                          <button onClick={() => eliminarMateria_backend(index)} className='btn btn-danger'><i className="bi bi-trash3-fill"></i></button>
                        </td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>
          </div>
          {
            mostrarMateria && (
              <div className='form-gris'>
                <div className='form-flotante'>
                  <div className='form-academia'>
                    <label>Nombre de la Materia</label>
                    <input
                      type="text"
                      name='nombre'
                      value={nuevaMateria.nombre}
                      onChange={(e) => setNuevaMateria({ ...nuevaMateria, [e.target.name]: e.target.value })}
                      placeholder='nombre de la materia'
                    />
                    <label>Descripción</label>
                    <input
                      type="text"
                      name='descripcion'
                      value={nuevaMateria.descripcion}
                      onChange={(e) => setNuevaMateria({ ...nuevaMateria, [e.target.name]: e.target.value })}
                      placeholder='descripción de la materia'
                    />
                    <div id='botone-option'>
                      <button onClick={guardarMateria_backend} className='btn btn-success'>{editar ? 'Actualizar' : 'Guardar'}</button>
                      <button onClick={() => setMostrarMateria(false)} className='btn btn-danger'>Cancelar</button>
                    </div>
                  </div>
                </div>
              </div>
            )
          }

          {/* SECCION HORARIOS */}
          <div className="seccion-academia">
            <div className="encabezado">
              <label>⏰ Horarios</label>
              <button id='agregar' onClick={nuevoHorarioAcademia}>✚</button>
            </div>
            <div className="dimensionTable">
              <table className="table-striped">
                <thead>
                  <tr><th>ID</th><th>Horario Inicial</th><th>Horario Final</th><th>Acciones</th></tr>
                </thead>
                <tbody>
                  {
                    horarios.map((horario, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{horario.inicio}</td>
                        <td>{horario.fin}</td>
                        <td>
                          <button className='btn btn-primary' onClick={() => editarHorario_backend(horario, index)}><i className="bi bi-pencil-square"></i></button>
                          <button onClick={() => eliminarHorario_backend(index)} className='btn btn-danger'><i className="bi bi-trash3-fill"></i></button>
                        </td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>
          </div>
          {
            mostrarHorario && (
              <div className='form-gris'>
                <div className='form-flotante'>
                  <div className='form-academia'>
                    <label>Horario Inicial</label>
                    <input
                      type="time"
                      name='inicio'
                      value={nuevoHorario.inicio}
                      onChange={(e) => setNuevoHorario({ ...nuevoHorario, [e.target.name]: e.target.value })}
                    />
                    <label>Horario Final</label>
                    <input
                      type="time"
                      name='fin'
                      value={nuevoHorario.fin}
                      onChange={(e) => setNuevoHorario({ ...nuevoHorario, [e.target.name]: e.target.value })}
                    />
                    <div id='botone-option'>
                      <button onClick={guardarHorario_backend} className='btn btn-success'>{editar ? 'Actualizar' : 'Guardar'}</button>
                      <button onClick={() => setMostrarHorario(false)} className='btn btn-danger'>Cancelar</button>
                    </div>
                  </div>
                </div>
              </div>
            )
          }

        </div>
      </div>
    </div>
  )
}

export default GestionAcademico
