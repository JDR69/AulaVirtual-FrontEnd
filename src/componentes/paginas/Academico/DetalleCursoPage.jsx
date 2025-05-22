import React, { useState } from 'react';
import '../../css/DetalleCurso.css'

const dataCursos = {
    "1ro Primaria": ["A", "B"],
    "2do Primaria": ["A", "B", "C"],
};

const listaMaterias = [
    "Matemáticas",
    "Lenguaje",
    "Ciencias Naturales",
    "Ciencias Sociales",
    "Inglés",
    "Educación Física",
];

function DetalleCursoPage() {
    const [cursoSeleccionado, setCursoSeleccionado] = useState('');
    const [paraleloSeleccionado, setParaleloSeleccionado] = useState('');
    const [materiaSeleccionada, setMateriaSeleccionada] = useState('');
    const [materiasAsignadas, setMateriasAsignadas] = useState([]);
    const [registros, setRegistros] = useState([]);
    const [editIndex, setEditIndex] = useState(null);

    const paralelosDisponibles = cursoSeleccionado ? dataCursos[cursoSeleccionado] : [];

    const agregarMateria = () => {
        if (
            materiaSeleccionada &&
            !materiasAsignadas.includes(materiaSeleccionada)
        ) {
            setMateriasAsignadas([...materiasAsignadas, materiaSeleccionada]);
            setMateriaSeleccionada('');
        }
    };

    const guardarAsignacion = () => {
        if (!cursoSeleccionado || !paraleloSeleccionado || materiasAsignadas.length === 0) {
            alert("Por favor, completa todos los campos.");
            return;
        }

        const combinacionExistente = registros.some(
            (r, i) =>
                i !== editIndex &&
                r.curso === cursoSeleccionado &&
                r.paralelo === paraleloSeleccionado
        );

        if (combinacionExistente) {
            alert("Ya existe una asignación para ese curso y paralelo.");
            return;
        }

        const nuevoRegistro = {
            curso: cursoSeleccionado,
            paralelo: paraleloSeleccionado,
            materias: materiasAsignadas,
        };

        if (editIndex !== null) {
            const copia = [...registros];
            copia[editIndex] = nuevoRegistro;
            setRegistros(copia);
            setEditIndex(null);
        } else {
            setRegistros([...registros, nuevoRegistro]);
        }

        setCursoSeleccionado('');
        setParaleloSeleccionado('');
        setMateriasAsignadas([]);
    };

    const eliminarRegistro = (index) => {
        const copia = [...registros];
        copia.splice(index, 1);
        setRegistros(copia);
    };

    const editarRegistro = (index) => {
        const reg = registros[index];
        setCursoSeleccionado(reg.curso);
        setParaleloSeleccionado(reg.paralelo);
        setMateriasAsignadas(reg.materias);
        setEditIndex(index);
    };

    const quitarMateria = (materia) => {
        setMateriasAsignadas(materiasAsignadas.filter((m) => m !== materia));
    };

    return (
        <div className="contenedor-principal">
            <div className="contenedor-secundario">
                <h1 className="titulo">Detalle del Curso</h1>
                <div className="contenedor-contenido">

                    <div className="mb-3">
                        <label>Curso:</label>
                        <select
                            className="form-select"
                            value={cursoSeleccionado}
                            onChange={(e) => {
                                setCursoSeleccionado(e.target.value);
                                setParaleloSeleccionado('');
                            }}
                        >
                            <option value="">Seleccione un curso</option>
                            {Object.keys(dataCursos).map((curso) => (
                                <option key={curso} value={curso}>{curso}</option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-3">
                        <label>Paralelo:</label>
                        <select
                            className="form-select"
                            value={paraleloSeleccionado}
                            onChange={(e) => setParaleloSeleccionado(e.target.value)}
                            disabled={!cursoSeleccionado}
                        >
                            <option value="">Seleccione un paralelo</option>
                            {paralelosDisponibles.map((p) => (
                                <option key={p} value={p}>{p}</option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-3">
                        <label>Agregar Materia:</label>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <select
                                className="form-select"
                                value={materiaSeleccionada}
                                onChange={(e) => setMateriaSeleccionada(e.target.value)}
                            >
                                <option value="">Seleccione una materia</option>
                                {listaMaterias.map((materia) => (
                                    <option key={materia} value={materia}>{materia}</option>
                                ))}
                            </select>
                            <button className="btn btn-primary" onClick={agregarMateria}>Agregar</button>
                        </div>

                        {/* Materias Asignadas con Estilo Bonito */}
                        {materiasAsignadas.length > 0 && (
                            <div className="materias-container mt-2">
                                {materiasAsignadas.map((mat, idx) => (
                                    <span className="materia-chip" key={idx}>
                                        {mat}
                                        <button className="btn-eliminar" onClick={() => quitarMateria(mat)}>×</button>
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Tabla */}
                    <div className="dimensionTable">

                        <h2>Asignaciones Registradas</h2>
                        <div className="mb-3">
                            <button className="btn btn-success" onClick={guardarAsignacion}>
                                {editIndex !== null ? 'Actualizar Asignación' : 'Guardar Asignación'}
                            </button>
                        </div>
                        <table className="table-striped">
                            <thead>
                                <tr>
                                    <th>Curso</th>
                                    <th>Paralelo</th>
                                    <th>Materias</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {registros.map((reg, index) => (
                                    <tr key={index}>
                                        <td>{reg.curso}</td>
                                        <td>{reg.paralelo}</td>
                                        <td>{reg.materias.join(', ')}</td>
                                        <td>
                                            <button className="btn btn-warning btn-sm me-2" onClick={() => editarRegistro(index)}>Editar</button>
                                            <button className="btn btn-danger btn-sm" onClick={() => eliminarRegistro(index)}>Eliminar</button>
                                        </td>
                                    </tr>
                                ))}
                                {registros.length === 0 && (
                                    <tr>
                                        <td colSpan="4" className="text-center">No hay asignaciones registradas.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default DetalleCursoPage;
