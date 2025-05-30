import React, { useState, useEffect } from 'react';
import { obtenerDimensionAsignadasRequest, obtenerAlumnosTareasAsiganadasRequest, actualizarTareasRequest } from '../../../api/auth';
import '../../css/CalificacionesPage.css';

const CalificacionesPage = () => {
    const [datosPorTrimestre, setDatosPorTrimestre] = useState([]);
    const [columnasEditablesPorTrimestre, setColumnasEditablesPorTrimestre] = useState({});

    useEffect(() => {
        fetchDimensionesPorTrimestre();
    }, []);

    const fetchDimensionesPorTrimestre = async () => {
        try {
            const materiaProfesor = JSON.parse(localStorage.getItem("materiaProfesor") || "null");
            const datosGestion = JSON.parse(localStorage.getItem("gestion") || "null");
            const trimestres = datosGestion?.detalle?.map(d => d.trimestre_info) || [];

            const id_cursoparalelo = materiaProfesor.horarios.curso_paralelo;
            const gestion = datosGestion.gestion;
            const horario_materia = materiaProfesor.horarios.id;

            const nuevosDatos = [];
            const nuevasColumnasEditables = {};

            for (const t of trimestres) {
                // CORREGIDO: Enviamos las fechas para filtrar por trimestre
                const fecha_inicio = t.fecha_inicio;
                const fecha_fin = t.fecha_final;

                const res1 = await obtenerDimensionAsignadasRequest({ 
                    id_cursoparalelo, 
                    gestion, 
                    horario_materia, 
                    fecha_inicio, 
                    fecha_fin 
                });
                const res2 = await obtenerAlumnosTareasAsiganadasRequest({ 
                    id_cursoparalelo, 
                    gestion, 
                    horario_materia, 
                    fecha_inicio, 
                    fecha_fin 
                });

                const estudiantes = [];
                const notas = {};

                res2.data.forEach(alumnoObj => {
                    const nombre = alumnoObj.nombre.toUpperCase();
                    estudiantes.push(nombre);
                    notas[nombre] = {};
                    alumnoObj.tareas.forEach(tarea => {
                        notas[nombre][tarea.descripcion] = tarea.puntaje;
                    });
                });

                // CORREGIDO: Simplificamos la estructura de dimensiones
                const dimensionesProcesadas = {};
                res1.data.forEach(d => {
                    const nombreDim = d.dimension.descripcion.toUpperCase();
                    dimensionesProcesadas[nombreDim] = [];
                    
                    d.actividades.forEach(act => {
                        act.tareas.forEach(tarea => {
                            dimensionesProcesadas[nombreDim].push(tarea.descripcion);
                        });
                    });
                });

                // CORREGIDO: Inicializamos columnas editables para cada trimestre
                nuevasColumnasEditables[t.nro] = {};

                nuevosDatos.push({
                    trimestre: t.nro,
                    fechaInicio: t.fecha_inicio,
                    fechaFinal: t.fecha_final,
                    dimensiones: res1.data,
                    tareasPorAlumno: res2.data,
                    estudiantes,
                    notas,
                    dimensionesProcesadas
                });
            }

            setDatosPorTrimestre(nuevosDatos);
            setColumnasEditablesPorTrimestre(nuevasColumnasEditables);
        } catch (error) {
            console.log(error);
        }
    };

    // CORREGIDO: Toggle por trimestre específico
    const toggleColumnaEditable = (trimestre, idTarea) => {
        setColumnasEditablesPorTrimestre(prev => ({
            ...prev,
            [trimestre]: {
                ...prev[trimestre],
                [idTarea]: !prev[trimestre]?.[idTarea]
            }
        }));
    };

    const handleNotaChange = (datosIndex, alumnoNombre, tareaId, nuevoValor) => {
        const nuevosDatos = [...datosPorTrimestre];
        nuevosDatos[datosIndex].notas[alumnoNombre][tareaId] = nuevoValor;
        setDatosPorTrimestre(nuevosDatos);
    };

    const enviarCalificacionTareaSeleccionada = async (datosIndex) => {
        const datos = datosPorTrimestre[datosIndex];
        const columnasEditables = columnasEditablesPorTrimestre[datos.trimestre] || {};
        const tareaSeleccionadaId = Object.keys(columnasEditables).find(id => columnasEditables[id]);

        if (!tareaSeleccionadaId) {
            alert(`Primero selecciona una columna del Trimestre ${datos.trimestre} con el checkbox`);
            return;
        }

        const payload = [];
        datos.tareasPorAlumno.forEach(alumno => {
            const nombre = alumno.nombre.toUpperCase();
            const tarea = alumno.tareas.find(t => t.descripcion === tareaSeleccionadaId);
            if (tarea) {
                const puntajeEditado = datos.notas[nombre]?.[tareaSeleccionadaId];
                payload.push({
                    alumno: alumno.alumno_id,
                    id: tarea.id,
                    puntaje: puntajeEditado !== undefined ? parseFloat(puntajeEditado) : tarea.puntaje
                });
            }
        });

        try {
            await actualizarTareasRequest(payload);
            alert(`Calificaciones del Trimestre ${datos.trimestre} guardadas exitosamente`);
            // CORREGIDO: Recargamos datos en lugar de toda la página
            await fetchDimensionesPorTrimestre();
        } catch (error) {
            console.error(error);
            alert('Hubo un error al guardar');
        }
    };

    if (datosPorTrimestre.length === 0) {
        return (
            <div className="contenedor-principal">
                <div className='contenedor-secundario'>
                    <div style={{ textAlign: 'center', marginTop: '50px', fontSize: '18px', color: '#666' }}>
                        Cargando datos de los trimestres...
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="contenedor-principal">
            <div className='contenedor-secundario'>
                {datosPorTrimestre.map((datos, index) => {
                    const dimensiones = datos.dimensionesProcesadas;
                    const columnasEditables = columnasEditablesPorTrimestre[datos.trimestre] || {};

                    return (
                        <div key={index} style={{ marginBottom: '50px', border: '2px solid #e5e7eb', borderRadius: '8px', padding: '20px' }}>
                            {/* CORREGIDO: Header más informativo */}
                            <h1>
                                Trimestre {datos.trimestre} 
                                <small style={{ fontSize: '14px', color: '#666', marginLeft: '10px' }}>
                                    ({datos.fechaInicio} a {datos.fechaFinal})
                                </small>
                            </h1>
                            
                            <button 
                                onClick={() => enviarCalificacionTareaSeleccionada(index)} 
                                className='btn btn-success'
                                style={{ marginBottom: '20px' }}
                            >
                                Guardar Cambios - Trimestre {datos.trimestre}
                            </button>

                            {/* Mostrar mensaje si no hay datos */}
                            {datos.estudiantes.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                                    No hay estudiantes registrados para este trimestre
                                </div>
                            ) : (
                                <div className="tabla-scroll">
                                    <table className="tabla-calificaciones">
                                        <thead>
                                            <tr>
                                                <th rowSpan={3} className="columna-alumnos">ALUMNOS</th>
                                                {/* CORREGIDO: Mostramos dimensiones con sus puntajes */}
                                                {datos.dimensiones.map((dimension, dimIndex) => (
                                                    <th 
                                                        key={dimIndex} 
                                                        colSpan={dimension.actividades.reduce((total, act) => total + act.tareas.length, 0)}
                                                    >
                                                        {dimension.dimension.descripcion.toUpperCase()} : {dimension.dimension.puntaje}
                                                    </th>
                                                ))}
                                                <th rowSpan={3} className="columna-alumnos">Nota Final</th>
                                            </tr>
                                            <tr>
                                                {Object.entries(dimensiones).map(([nombreDim, tareas]) =>
                                                    tareas.length > 0 ? (
                                                        tareas.map((tarea, i) => (
                                                            <th key={`${nombreDim}-${i}`}>
                                                                <label style={{ 
                                                                    fontSize: '10px', 
                                                                    display: 'flex', 
                                                                    flexDirection: 'column', 
                                                                    alignItems: 'center' 
                                                                }}>
                                                                    {/* CORREGIDO: Checkbox por trimestre */}
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={!!columnasEditables[tarea]}
                                                                        onChange={() => toggleColumnaEditable(datos.trimestre, tarea)}
                                                                    />
                                                                    Habilitar edición
                                                                </label>
                                                            </th>
                                                        ))
                                                    ) : (
                                                        <th key={`${nombreDim}-empty`}>Sin tareas</th>
                                                    )
                                                )}
                                            </tr>
                                            <tr>
                                                {Object.entries(dimensiones).map(([nombreDim, tareas]) =>
                                                    tareas.length > 0 ? (
                                                        tareas.map((descripcion, i) => (
                                                            <th key={`${nombreDim}-desc-${i}`} className="encabezado-vertical">
                                                                {descripcion}
                                                            </th>
                                                        ))
                                                    ) : (
                                                        <th key={`${nombreDim}-desc-empty`} className="encabezado-vertical">
                                                            Sin tareas
                                                        </th>
                                                    )
                                                )}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {datos.estudiantes.map((alumno, i) => {
                                                // CORREGIDO: Cálculo de promedio más claro
                                                const calcularPromedio = () => {
                                                    let total = 0;
                                                    datos.dimensiones.forEach(dim => {
                                                        const tareas = dim.actividades.flatMap(a => a.tareas);
                                                        if (tareas.length > 0) {
                                                            const suma = tareas.reduce((acc, t) => 
                                                                acc + parseFloat(datos.notas[alumno]?.[t.descripcion] ?? 0), 0
                                                            );
                                                            const promedio = suma / tareas.length;
                                                            total += promedio * (dim.dimension.puntaje / 100);
                                                        }
                                                    });
                                                    return total;
                                                };

                                                const promedioFinal = calcularPromedio();

                                                return (
                                                    <tr key={i}>
                                                        <td className="columna-alumnos">{alumno}</td>
                                                        {Object.entries(dimensiones).map(([nombreDim, tareas]) =>
                                                            tareas.length > 0 ? (
                                                                tareas.map((tarea, j) => (
                                                                    <td key={`${alumno}-${nombreDim}-${j}`} className="celda-nota">
                                                                        {columnasEditables[tarea] ? (
                                                                            <input
                                                                                type="number"
                                                                                value={datos.notas[alumno]?.[tarea] ?? ''}
                                                                                onChange={(e) => handleNotaChange(index, alumno, tarea, e.target.value)}
                                                                                style={{ width: '80px', textAlign: 'center' }}
                                                                                min="0"
                                                                                max="100"
                                                                            />
                                                                        ) : (
                                                                            datos.notas[alumno]?.[tarea] ?? '-'
                                                                        )}
                                                                    </td>
                                                                ))
                                                            ) : (
                                                                <td key={`${alumno}-${nombreDim}-empty`} className="celda-nota">
                                                                    -
                                                                </td>
                                                            )
                                                        )}
                                                        <td 
                                                            className="columna-final" 
                                                            style={{
                                                                fontWeight: 'bold',
                                                                textAlign: 'center',
                                                                backgroundColor: promedioFinal >= 51 ? '#dcfce7' : '#fee2e2',
                                                                color: promedioFinal >= 51 ? '#166534' : '#991b1b'
                                                            }}
                                                        >
                                                            {promedioFinal.toFixed(2)}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default CalificacionesPage;