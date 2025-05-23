import React, { useState } from 'react';
import '../../css/DetalleCurso.css';
import { useAuth } from '../../../context/AuthContext';
import { nuevoDetalleCursoMateriaRequest, nuevoDetalleCursoParaleloRequest } from '../../../api/auth';

function DetalleCursoPage() {
    const { cursos, materias, paralelos, detalleCompleto} = useAuth();

    const [cursoSeleccionado, setCursoSeleccionado] = useState('');
    const [paraleloSeleccionado, setParaleloSeleccionado] = useState('');
    const [paralelosAsignados, setParalelosAsignados] = useState([]);
    const [materiaSeleccionada, setMateriaSeleccionada] = useState('');
    const [materiasAsignadas, setMateriasAsignadas] = useState([]);
    const [registros, setRegistros] = useState([]);
    const [editIndex, setEditIndex] = useState(null);

    const agregarMateria = () => {
        if (materiaSeleccionada && !materiasAsignadas.includes(materiaSeleccionada)) {
            setMateriasAsignadas([...materiasAsignadas, materiaSeleccionada]);
            setMateriaSeleccionada('');
        }
    };

    const quitarMateria = (materia) => {
        setMateriasAsignadas(materiasAsignadas.filter((m) => m !== materia));
    };

    const agregarParalelo = () => {
        if (paraleloSeleccionado && !paralelosAsignados.includes(paraleloSeleccionado)) {
            setParalelosAsignados([...paralelosAsignados, paraleloSeleccionado]);
            setParaleloSeleccionado('');
        }
    };

    const quitarParalelo = (p) => {
        setParalelosAsignados(paralelosAsignados.filter((x) => x !== p));
    };

    const guardarAsignacion = async () => {
        try {
            if (!cursoSeleccionado || paralelosAsignados.length === 0 || materiasAsignadas.length === 0) {
                alert("Por favor, completa todos los campos.");
                return;
            }
    
            const combinacionExistente = registros.some((r, i) =>
                i !== editIndex &&
                r.curso === cursoSeleccionado &&
                JSON.stringify(r.paralelos) === JSON.stringify(paralelosAsignados)
            );
    
            if (combinacionExistente) {
                alert("Ya existe una asignación para ese curso y paralelos.");
                return;
            }
    
            const data = {
                curso: cursoSeleccionado,
                paralelos: paralelosAsignados.map((id) => parseInt(id)),
                materias: materiasAsignadas.map((id) => parseInt(id)),
            }
    
            const res1 = await nuevoDetalleCursoMateriaRequest(data)
            const res2 = await nuevoDetalleCursoParaleloRequest(data)
            setCursoSeleccionado('');
            setParalelosAsignados([]);
            setMateriasAsignadas([]);   
            alert('Registrado correctamente')   
            window.location.reload() ;
        } catch (error) {
            console.log(error)
        }
    };

    const eliminarRegistro = (index) => {
        const copia = [...registros];
        copia.splice(index, 1);
        setRegistros(copia);
    };

    const editarRegistro = (index) => {
        const reg = registros[index];
        setCursoSeleccionado(reg.curso);
        setParalelosAsignados(reg.paralelos);
        setMateriasAsignadas(reg.materias);
        setEditIndex(index);
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
                                setParalelosAsignados([]);
                            }}
                        >
                            <option value="">Seleccione un curso</option>
                            {cursos.map((curso) => (
                                <option key={curso.id} value={curso.id}>{curso.nombre}</option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-3">
                        <label>Agregar Paralelo:</label>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <select
                                className="form-select"
                                value={paraleloSeleccionado}
                                onChange={(e) => setParaleloSeleccionado(e.target.value)}
                            >
                                <option value="">Seleccione un paralelo</option>
                                {paralelos.map((p) => (
                                    <option key={p.id} value={p.id}>{p.descripcion}</option>
                                ))}
                            </select>
                            <button className="btn btn-primary" onClick={agregarParalelo}>Agregar</button>
                        </div>
                        {paralelosAsignados.length > 0 && (
                            <div className="materias-container mt-2">
                                {paralelosAsignados.map((pId, idx) => (
                                    <span className="materia-chip" key={idx}>
                                        {paralelos.find(x => x.id === parseInt(pId))?.descripcion || pId}
                                        <button className="btn-eliminar" onClick={() => quitarParalelo(pId)}>×</button>
                                    </span>
                                ))}
                            </div>
                        )}
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
                                {materias.map((materia) => (
                                    <option key={materia.id} value={materia.id}>{materia.nombre}</option>
                                ))}
                            </select>
                            <button className="btn btn-primary" onClick={agregarMateria}>Agregar</button>
                        </div>
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
                                    <th>Paralelos</th>
                                    <th>Materias</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {detalleCompleto.map((reg, index) => (
                                    <tr key={index}>
                                        <td>{reg.curso}</td>
                                        <td>{reg.paralelos.map((p) => p.nombre).join(', ')}</td>
                                        <td>{reg.materias.map((m) => m.nombre).join(', ')}</td>
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