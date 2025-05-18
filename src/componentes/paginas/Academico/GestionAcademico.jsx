import React, { useState } from 'react'
import '../../css/Academia.css'

const GestionAcademico = () => {
  const [mostrarEstado, setMostrarEstado] = useState(false)
  const [mostrarCurso, setMostrarCurso] = useState(false)
  const [mostrarParalelo, setMostrarParalelo] = useState(false)
  const [mostrarMateria, setMostrarMateria] = useState(false)
  const [mostrarHorario, setMostrarHorario] = useState(false)

  const [nuevoCurso, setNuevoCurso] = useState({ nombre: '', estado: true })
  const [nuevoDato, setNuevoDato] = useState({ descripcion: '', estado: true })
  const [nuevaMateria, setNuevaMateria] = useState({ nombre: '', descripcion: '', estado: true })
  const [nuevoHorario, setNuevoHorario] = useState({ inicio: '', fin: '' })

  return (
    <div className='contenedor-principal'>
      <div className='contenedor-secundario'>
        <div className="contenedor-academia">

          {/* SECCION NIVELES */}
          <div className="seccion-academia">
            <div className="encabezado">
              <label>🎓 Niveles</label>
              <button id='agregar' onClick={() => setMostrarEstado(!mostrarEstado)}>✚</button>
            </div>
            <div className="dimensionTable">
              <table className="table-striped">
                <thead>
                  <tr><th>ID</th><th>Nombre</th><th>Estado</th><th>Acciones</th></tr>
                </thead>
                <tbody><tr><td>1</td><td>Profesor</td><td><button>✏️</button> <button>🗑️</button></td></tr></tbody>
              </table>
            </div>
          </div>
          {
            mostrarEstado && (
              <div className='form-gris'>
                <div className='form-flotante'>
                  <label>Descripcion del Nivel</label>
                  <input
                    type="text"
                    name='nombre'
                    value={nuevoCurso.nombre}
                    onChange={(e) => setNuevoCurso({ ...nuevoCurso, [e.target.name]: e.target.value })}
                    placeholder='nombre del nivel'
                  />
                  <button onClick={() => setMostrarEstado(false)}>Cancelar</button>
                </div>
              </div>
            )
          }

          {/* SECCION CURSOS */}
          <div className="seccion-academia">
            <div className="encabezado">
              <label>🏫 Cursos</label>
              <button id='agregar' onClick={() => setMostrarCurso(!mostrarCurso)}>✚</button>
            </div>
            <div className="dimensionTable">
              <table className="table-striped">
                <thead>
                  <tr><th>ID</th><th>Nombre</th><th>Estado</th><th>Acciones</th></tr>
                </thead>
                <tbody><tr><td>1</td><td>Ver Reportes</td><td><button>✏️</button> <button>🗑️</button></td></tr></tbody>
              </table>
            </div>
          </div>
          {
            mostrarCurso && (
              <div className='form-gris'>
                <div className='form-flotante'>
                  <label>Nombre del Curso</label>
                  <input
                    type="text"
                    name='descripcion'
                    value={nuevoDato.descripcion}
                    onChange={(e) => setNuevoDato({ ...nuevoDato, [e.target.name]: e.target.value })}
                    placeholder='nombre del curso'
                  />
                  <button onClick={() => setMostrarCurso(false)}>Cancelar</button>
                </div>
              </div>
            )
          }

          {/* SECCION PARALELOS */}
          <div className="seccion-academia">
            <div className="encabezado">
              <label>📚 Paralelos</label>
              <button id='agregar' onClick={() => setMostrarParalelo(!mostrarParalelo)}>✚</button>
            </div>
            <div className="dimensionTable">
              <table className="table-striped">
                <thead>
                  <tr><th>ID</th><th>Descripción</th><th>Estado</th><th>Acciones</th></tr>
                </thead>
                <tbody><tr><td>1</td><td>A</td><td><button>✏️</button> <button>🗑️</button></td></tr></tbody>
              </table>
            </div>
          </div>
          {
            mostrarParalelo && (
              <div className='form-gris'>
                <div className='form-flotante'>
                  <label>Descripción del Paralelo</label>
                  <input
                    type="text"
                    name='descripcion'
                    value={nuevoDato.descripcion}
                    onChange={(e) => setNuevoDato({ ...nuevoDato, [e.target.name]: e.target.value })}
                    placeholder='descripción del paralelo'
                  />
                  <button onClick={() => setMostrarParalelo(false)}>Cancelar</button>
                </div>
              </div>
            )
          }

          {/* SECCION MATERIAS */}
          <div className="seccion-academia">
            <div className="encabezado">
              <label>📖 Materias</label>
              <button id='agregar' onClick={() => setMostrarMateria(!mostrarMateria)}>✚</button>
            </div>
            <div className="dimensionTable">
              <table className="table-striped">
                <thead>
                  <tr><th>ID</th><th>Nombre</th><th>Descripción</th><th>Estado</th><th>Acciones</th></tr>
                </thead>
                <tbody><tr><td>1</td><td>Matemática</td><td>Básico</td><td><button>✏️</button> <button>🗑️</button></td></tr></tbody>
              </table>
            </div>
          </div>
          {
            mostrarMateria && (
              <div className='form-gris'>
                <div className='form-flotante'>
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
                  <button onClick={() => setMostrarMateria(false)}>Cancelar</button>
                </div>
              </div>
            )
          }

          {/* SECCION HORARIOS */}
          <div className="seccion-academia">
            <div className="encabezado">
              <label>⏰ Horarios</label>
              <button id='agregar' onClick={() => setMostrarHorario(!mostrarHorario)}>✚</button>
            </div>
            <div className="dimensionTable">
              <table className="table-striped">
                <thead>
                  <tr><th>ID</th><th>Horario Inicial</th><th>Horario Final</th><th>Acciones</th></tr>
                </thead>
                <tbody><tr><td>1</td><td>08:00</td><td>10:00</td><td><button>✏️</button> <button>🗑️</button></td></tr></tbody>
              </table>
            </div>
          </div>
          {
            mostrarHorario && (
              <div className='form-gris'>
                <div className='form-flotante'>
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
                  <button onClick={() => setMostrarHorario(false)}>Cancelar</button>
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
