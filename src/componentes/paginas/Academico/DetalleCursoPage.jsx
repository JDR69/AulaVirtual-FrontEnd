import React, { useState } from 'react';
import '../../css/DetalleCurso.css';
import { useAuth } from '../../../context/AuthContext';
import {
    nuevoDetalleCursoMateriaRequest, nuevoDetalleCursoParaleloRequest,
    eliminarDetalleCursoMateriaRequest
} from '../../../api/auth';

function DetalleCursoPage() {
    const { cursos, materias, paralelos, detalleCompleto } = useAuth();

    const [cursoSeleccionado, setCursoSeleccionado] = useState('');
    const [paraleloSeleccionado, setParaleloSeleccionado] = useState('');
    const [paralelosAsignados, setParalelosAsignados] = useState([]);
    const [materiaSeleccionada, setMateriaSeleccionada] = useState('');
    const [materiasAsignadas, setMateriasAsignadas] = useState([]);
    const [editIndex, setEditIndex] = useState(null);
    const [quitarIndex, setQuitarIndex] = useState(null);

    // Agregar materia a la lista temporal
    const agregarMateria = () => {
    if (!materiaSeleccionada) return;
    const idStr = String(materiaSeleccionada);
    if (materiasAsignadas.map(String).includes(idStr)) {
        alert('La materia ya fue agregada.');
        return;
    }
    setMateriasAsignadas([...materiasAsignadas, idStr]);
    setMateriaSeleccionada('');
};

    // Agregar paralelo a la lista temporal
   const agregarParalelo = () => {
    if (!paraleloSeleccionado) return;
    const idStr = String(paraleloSeleccionado);
    if (paralelosAsignados.map(String).includes(idStr)) {
        alert('El paralelo ya fue agregado.');
        return;
    }
    setParalelosAsignados([...paralelosAsignados, idStr]);
    setParaleloSeleccionado('');
};

    // Guardar o actualizar asignación
    const guardarAsignacion = async () => {
        try {

            const data = {
                curso: cursoSeleccionado,
                paralelos: paralelosAsignados.map((id) => parseInt(id)),
                materias: materiasAsignadas.map((id) => parseInt(id)),
            };

            await nuevoDetalleCursoMateriaRequest(data);
            await nuevoDetalleCursoParaleloRequest(data);

            setCursoSeleccionado('');
            setParalelosAsignados([]);
            setMateriasAsignadas([]);
            setEditIndex(null);
            alert('Registrado correctamente');
            window.location.reload();
        } catch (error) {
            console.log(error);
        }
    };
    // Eliminar paralelo de una asignación registrada
    const eliminarParaleloDeAsignacion = async (asigIndex, paraleloId) => {
        try {
            const data = {
                curso: cursos.find(c => c.nombre === detalleCompleto[asigIndex].curso).id,
                paralelo: paraleloId,
            };

            console.log(data);
            const res = await eliminarDetalleCursoMateriaRequest(data);
            alert('Implementa la lógica para eliminar el paralelo del curso en el backend');
            // window.location.reload();
        } catch (error) {
            console.log(error);
        }
    }

    // Eliminar materia de una asignación registrada
    const eliminarMateriaDeAsignacion = async (asigIndex, materiaId) => {
        try {
            const data = {
                curso: cursos.find(c => c.nombre === detalleCompleto[asigIndex].curso).id,
                materia: materiaId,
            };

            console.log(data);
            const res = await eliminarDetalleCursoMateriaRequest(data);
            alert('Implementa la lógica para eliminar la materia del curso en el backend');
            // window.location.reload();
        } catch (error) {
            console.log(error);
        }
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
                                setMateriasAsignadas([]);
                                setEditIndex(null);
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
                                        <button className="btn-eliminar" onClick={() => eliminarParaleloDeAsignacion(pId)}>×</button>
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
                                        {materias.find(x => x.id === parseInt(mat))?.nombre || mat}
                                        <button className="btn-eliminar" onClick={() => eliminarMateriaDeAsignacion(mat)}>×</button>
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
                                        <td>{reg.curso_nombre || reg.curso}</td>
                                        <td>
                                            {reg.paralelos.map((p) => (
                                                <span key={p.id} style={{ marginRight: 8 }}>
                                                    {p.nombre || p.descripcion}
                                                    {quitarIndex === index && (
                                                        <button
                                                            className="btn btn-danger btn-sm ms-1"
                                                            title="Eliminar paralelo"
                                                            onClick={() => eliminarParaleloDeAsignacion(index, p.id)}
                                                        >×</button>
                                                    )}
                                                </span>
                                            ))}
                                        </td>
                                        <td>
                                            {reg.materias.map((m) => (
                                                <span key={m.id} style={{ marginRight: 8 }}>
                                                    {m.nombre}
                                                    {quitarIndex === index && (
                                                        <button
                                                            className="btn btn-danger btn-sm ms-1"
                                                            title="Eliminar materia"
                                                            onClick={() => eliminarMateriaDeAsignacion(index, m.id)}
                                                        >×</button>
                                                    )}
                                                </span>
                                            ))}
                                        </td>
                                        <td>
                                            <button
                                                className={`btn btn-warning btn-sm me-2`}
                                                onClick={() => setQuitarIndex(quitarIndex === index ? null : index)}
                                            >
                                                {quitarIndex === index ? 'Cancelar' : 'Quitar'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DetalleCursoPage;