import React, { useState, useEffect, useMemo } from 'react';
import { obtenerDimensionAsignadasRequest, obtenerAlumnosTareasAsiganadasRequest ,actualizarTareasRequest} from '../../../api/auth';
import '../../css/CalificacionesPage.css';

const CalificacionesPage = () => {
    const [estudiantes, setEstudiantes] = useState([]);
    const [notas, setNotas] = useState([]);
    const [dimensionesB, setDimensionesB] = useState([]);
    const [tareasPorAlumno, setTareasPorAlumno] = useState([]);
    const [columnasEditables, setColumnasEditables] = useState({});
    // guarda el ID de la tarea que se puede editar


    const dimensiones = useMemo(() => {
        const resultado = {};

        dimensionesB.forEach(d => {
            const nombreDimension = d.dimension.descripcion.toUpperCase();
            resultado[nombreDimension] = [];

            d.actividades.forEach(act => {
                act.tareas.forEach(tarea => {
                    resultado[nombreDimension].push(tarea.descripcion);
                });
            });
        });
        console.log(resultado)
        return resultado;
    }, [dimensionesB]);

    useEffect(() => {
        fetchDimension();
    }, []);

    const fetchDimension = async () => {
        try {
            const materiaProfesor = JSON.parse(localStorage.getItem("materiaProfesor") || "null");
            const gestion2 = JSON.parse(localStorage.getItem("gestion") || "null");
            const id_cursoparalelo = materiaProfesor.horarios.curso_paralelo;
            const gestion = 9;//gestion2.gestion
            const horario_materia = materiaProfesor.horarios.id
            console.log(id_cursoparalelo)
            console.log(gestion)
            console.log(horario_materia)

            const res = await obtenerDimensionAsignadasRequest({ id_cursoparalelo, gestion, horario_materia });
            const res2 = await obtenerAlumnosTareasAsiganadasRequest({ id_cursoparalelo, gestion, horario_materia });

            console.log(res.data)
            setDimensionesB(res.data)
            console.log(res2.data)
            setTareasPorAlumno(res2.data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (tareasPorAlumno.length === 0) return;

        const nuevosAlumnos = [];
        const nuevasNotas = {};

        tareasPorAlumno.forEach((alumnoObj) => {
            const nombre = alumnoObj.nombre.toUpperCase();
            nuevosAlumnos.push(nombre);

            if (!nuevasNotas[nombre]) nuevasNotas[nombre] = {};

            alumnoObj.tareas.forEach(tarea => {
                const tareaId = tarea.descripcion;
                nuevasNotas[nombre][tareaId] = tarea.puntaje;
            });
        });

        setEstudiantes(nuevosAlumnos);
        setNotas(nuevasNotas);
    }, [tareasPorAlumno]);

    const handleNotaChange = (alumnoNombre, tareaId, nuevoValor) => {
        setNotas(prev => ({
            ...prev,
            [alumnoNombre]: {
                ...prev[alumnoNombre],
                [tareaId]: nuevoValor
            }
        }));
    };


    const toggleColumnaEditable = (idTarea) => {
        setColumnasEditables(prev => ({
            ...prev,
            [idTarea]: !prev[idTarea]
        }));
    };

    const tareaSeleccionadaId = Object.keys(columnasEditables).find(id => columnasEditables[id]);


    const enviarCalificacionTareaSeleccionada = async () => {
        const tareaSeleccionadaId = Object.keys(columnasEditables).find(id => columnasEditables[id]);
        if (!tareaSeleccionadaId) {
            alert('Primero selecciona una columna con el checkbox');
            return;
        }

        console.log(tareaSeleccionadaId)

        const payload = [];
        console.log(tareasPorAlumno)
        tareasPorAlumno.forEach(alumno => {
            const nombre = alumno.nombre.toUpperCase();
            const tarea = alumno.tareas.find(t => t.descripcion === tareaSeleccionadaId);
            if (tarea) {
                const puntajeEditado = notas[nombre]?.[tareaSeleccionadaId];
                payload.push({
                    alumno: alumno.alumno_id,
                    id: tarea.id,
                    puntaje: puntajeEditado !== undefined ? parseFloat(puntajeEditado) : tarea.puntaje
                });
            }

        });

        console.log(payload)
        console.log(notas)

        try {
            const response = await actualizarTareasRequest(payload);
            console.log(response.data)
            window.location.reload()
        } catch (error) {
            console.error(error);
            alert('Hubo un error al guardar');
        }
    };




    return (
        <div className="contenedor-principal">
            <div className='contenedor-secundario'>
                <h1>TRIMESTRE 1</h1>
                <button onClick={enviarCalificacionTareaSeleccionada} className='btn btn-success'>
                    Guardar Cambios
                </button>
                <div className="tabla-scroll">
                    <table className="tabla-calificaciones">
                        <thead>
                            <tr>
                                <th rowSpan={3} className="columna-alumnos">ALUMNOS</th>
                                {Object.entries(dimensionesB).map(([key, value]) => (
                                    <th
                                        key={key}
                                        colSpan={value.actividades.reduce((total, act) => total + act.tareas.length, 0)}
                                    >
                                        {value.dimension.descripcion}
                                    </th>
                                ))}
                            </tr>
                            <tr>
                                {Object.values(dimensiones).flat().map((tarea, i) => (
                                    <th key={i}>
                                        <label style={{ fontSize: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                            <input
                                                type="checkbox"
                                                checked={!!columnasEditables[tarea]}
                                                onChange={() => toggleColumnaEditable(tarea)}
                                            />
                                            Habilitar edición
                                        </label>
                                    </th>
                                ))}
                            </tr>
                            <tr>
                                {Object.values(dimensiones).flat().map((descripcion, i) => (
                                    <th key={i} className="encabezado-vertical">{descripcion}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {estudiantes.map((alumno, i) => (
                                <tr key={i}>
                                    <td className="columna-alumnos">{alumno}</td>
                                    {
                                        Object.values(dimensiones).flat().map((tarea, j) => (
                                            <td key={j} className="celda-nota">
                                                {columnasEditables[tarea] ? (
                                                    <input
                                                        type="number"
                                                        value={notas[alumno]?.[tarea] ?? ''}
                                                        onChange={(e) => handleNotaChange(alumno, tarea, e.target.value)}
                                                        style={{ width: '50px', textAlign: 'center' }}
                                                    />
                                                ) : (
                                                    notas[alumno]?.[tarea] ?? ''
                                                )}
                                            </td>
                                        ))
                                    }
                                </tr>
                            ))}
                        </tbody>



                    </table>
                </div>
            </div>
        </div>
    );
};

export default CalificacionesPage;
