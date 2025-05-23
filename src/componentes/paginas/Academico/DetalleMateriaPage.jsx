import React, { useState, useEffect } from 'react';
import {
    obtenerMateriasRequest,
    obtenerHorariosRequest,
    obtenerUsuarioRequest,
    obtenerCursosRequest,
    obtenerParalelosRequest,
    nuevoDetalleMateriaRequest
} from '../../../api/auth';

function DetalleMateriaPage() {
    const [materias, setMaterias] = useState([]);
    const [profesores, setProfesores] = useState([]);
    const [horarios, setHorarios] = useState([]);
    const [cursos, setCursos] = useState([]);
    const [paralelos, setParalelos] = useState([]);

    const [materiaSeleccionada, setMateriaSeleccionada] = useState('');
    const [profesorSeleccionado, setProfesorSeleccionado] = useState('');
    const [horarioSeleccionado, setHorarioSeleccionado] = useState('');
    const [cursoSeleccionado, setCursoSeleccionado] = useState('');
    const [paraleloSeleccionado, setParaleloSeleccionado] = useState('');

    const [asignaciones, setAsignaciones] = useState([]);
    const [modoEdicion, setModoEdicion] = useState(false);
    const [indiceEditando, setIndiceEditando] = useState(null);


    useEffect(() => {

        obtenerMateriasRequest().then(res => {
            setMaterias(res.data || []);
        });

        obtenerHorariosRequest().then(res => {
            setHorarios(res.data || []);
        });

        obtenerUsuarioRequest().then(res => {

            setProfesores(
                (res.data || [])
                    .filter(u => u.rol_nombre === 'Profesor')
                    .map(u => ({
                        id: u.id,
                        nombre: u.nombre
                    }))
            );

        });

        obtenerCursosRequest().then(res => {
            setCursos((res.data || []));
        });
        obtenerParalelosRequest().then(res => {
            setParalelos((res.data || []));
        });
    }, []);

    const limpiarFormulario = () => {
        setMateriaSeleccionada('');
        setProfesorSeleccionado('');
        setHorarioSeleccionado('');
        setCursoSeleccionado('');
        setParaleloSeleccionado('');

        setModoEdicion(false);
        setIndiceEditando(null);
    };

    const asignarMateria = async () => {
        try {
            if (materiaSeleccionada && profesorSeleccionado && horarioSeleccionado && cursoSeleccionado && paraleloSeleccionado) {
                if (modoEdicion) {
                    const nuevasAsignaciones = [...asignaciones];
                    nuevasAsignaciones[indiceEditando] = {
                        materia: materiaSeleccionada,
                        profesor: profesorSeleccionado,
                        horario: horarioSeleccionado,
                        curso: cursoSeleccionado,
                        paralelo: paraleloSeleccionado
    
    
                    };
                    console.log(nuevasAsignaciones)
                    setAsignaciones(nuevasAsignaciones);
                } else {
                    setAsignaciones([
                        ...asignaciones,
                        {
                            materia: materiaSeleccionada,
                            profesor: profesorSeleccionado,
                            horario: horarioSeleccionado,
                            curso: cursoSeleccionado,
                            paralelo: paraleloSeleccionado
                        }
                    ]);
                    const data = {
                        materia: parseInt(materiaSeleccionada),
                        profesor: parseInt(profesorSeleccionado),
                        horario: parseInt(horarioSeleccionado),
                        curso: parseInt(cursoSeleccionado),
                        paralelo: parseInt(paraleloSeleccionado)
                    }
                    console.log(data)
                    const re = await nuevoDetalleMateriaRequest(data)
                    console.log(re.data)

                }
                limpiarFormulario();
            } else {
                alert('Por favor seleccione materia, profesor y horario.');
            }
            
        } catch (error) {
            console.log(error)
        }
    };

    const eliminarAsignacion = (index) => {
        const nuevasAsignaciones = asignaciones.filter((_, i) => i !== index);
        setAsignaciones(nuevasAsignaciones);
        if (modoEdicion && index === indiceEditando) {
            limpiarFormulario();
        }
    };

    const editarAsignacion = (index) => {
        const asignacion = asignaciones[index];
        setMateriaSeleccionada(asignacion.materia);
        setProfesorSeleccionado(asignacion.profesor);
        setHorarioSeleccionado(asignacion.horario);
        setCursoSeleccionado(asignacion.curso);
        setParaleloSeleccionado(asignacion.paralelo);
        setModoEdicion(true);
        setIndiceEditando(index);
    };

    return (
        <div className='contenedor-principal'>
            <div className='contenedor-secundario'>
                <h1>Detalle de la Materia</h1>
                <div className='contenedor-contenido'>

                    {/* Select Materia */}
                    <div className="mb-3">
                        <label>Materia:</label>
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
                    </div>

                    {/* Select Profesor */}
                    <div className="mb-3">
                        <label>Profesor:</label>
                        <select
                            className="form-select"
                            value={profesorSeleccionado}
                            onChange={(e) => setProfesorSeleccionado(e.target.value)}
                        >
                            <option value="">Seleccione un profesor</option>
                            {profesores.map((nombre, index) => (
                                <option key={index} value={nombre.id}>{nombre.nombre}</option>
                            ))}
                        </select>
                    </div>

                    {/* Select Horario */}
                    <div className="mb-3">
                        <label>Horario:</label>
                        <select
                            className="form-select"
                            value={horarioSeleccionado}
                            onChange={(e) => setHorarioSeleccionado(e.target.value)}
                        >
                            <option value="">Seleccione un horario</option>
                            {horarios.map((horario) => (
                                <option key={horario.id} value={horario.id}>
                                    {horario.hora_inicial} - {horario.hora_final}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Select Curso */}
                    <div className="mb-3">
                        <label>Curso:</label>
                        <select
                            className="form-select"
                            value={cursoSeleccionado}
                            onChange={(e) => setCursoSeleccionado(e.target.value)}
                        >
                            <option value="">Seleccione un curso</option>
                            {cursos.map((curso) => (
                                <option key={curso.id} value={curso.id}>{curso.nombre}</option>
                            ))}
                        </select>
                    </div>

                    {/* Select Paralelo */}
                    <div className="mb-3">
                        <label>Paralelo:</label>
                        <select
                            className="form-select"
                            value={paraleloSeleccionado}
                            onChange={(e) => setParaleloSeleccionado(e.target.value)}
                        >
                            <option value="">Seleccione un paralelo</option>
                            {paralelos.map((paralelo) => (
                                <option key={paralelo.id} value={paralelo.id}>{paralelo.descripcion}</option>
                            ))}
                        </select>
                    </div>

                    {/* Botón Asignar */}
                    <div className="mb-3">
                        <button className="btn btn-success" onClick={asignarMateria}>
                            {modoEdicion ? 'Actualizar' : 'Asignar'}
                        </button>
                        {modoEdicion && (
                            <button className="btn btn-secondary ms-2" onClick={limpiarFormulario}>
                                Cancelar
                            </button>
                        )}
                    </div>
                </div>

                {/* Tabla de asignaciones */}
                {/* Tabla de asignaciones */}
                <div className="dimensionTable">
                    <h2>Asignaciones Realizadas</h2>
                    <table className="table-striped table-bordered">
                        <thead>
                            <tr>
                                <th>Materia</th>
                                <th>Profesor</th>
                                <th>Horario</th>
                                <th>Curso</th>
                                <th>Paralelo</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {asignaciones.length === 0 ? (
                                <tr>
                                    <td colSpan="4" style={{ textAlign: 'center' }}>
                                        Sin asignaciones
                                    </td>
                                </tr>
                            ) : (
                                asignaciones.map((asig, index) => (
                                    <tr key={index}>
                                        <td>{asig.materia}</td>
                                        <td>{asig.profesor}</td>
                                        <td>{asig.horario}</td>
                                        <td>{asig.curso}</td>
                                        <td>{asig.paralelo}</td>
                                        <td>
                                            <button
                                                className="btn btn-warning btn-sm me-2"
                                                onClick={() => editarAsignacion(index)}
                                            >
                                                Editar
                                            </button>
                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() => eliminarAsignacion(index)}
                                            >
                                                Eliminar
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default DetalleMateriaPage;