import React, { useState, useEffect } from 'react';
import { obtenerDimensionAsignadasRequest, obtenerAlumnosTareasAsiganadasRequest, actualizarTareasRequest } from '../../../api/auth';
import '../../css/CalificacionesPage.css';
// Add imports for report generation
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const CalificacionesPage = () => {
    const [datosPorTrimestre, setDatosPorTrimestre] = useState([]);
    const [columnasEditablesPorTrimestre, setColumnasEditablesPorTrimestre] = useState({});
    // Add state for report generation
    const [trimestreSeleccionadoReporte, setTrimestreSeleccionadoReporte] = useState('');

    useEffect(() => {
        fetchDimensionesPorTrimestre();
    }, []);

    const fetchDimensionesPorTrimestre = async () => {
        try {
            const materiaProfesor = JSON.parse(localStorage.getItem("materiaProfesor") || "null");
            const datosGestion = JSON.parse(localStorage.getItem("gestion") || "null");
            const trimestres = datosGestion?.detalle?.map(d => d.trimestre_info) || [];

            const id_cursoparalelo = materiaProfesor.horarios.curso_paralelo;
            const gestion = datosGestion.anio_escolar;
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
                console.log({id_cursoparalelo, 
                    gestion, 
                    horario_materia, 
                    fecha_inicio, 
                    fecha_fin})
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

    // Add report generation functions
    const generarPDF = () => {
        if (!trimestreSeleccionadoReporte) {
            alert("Por favor seleccione un trimestre para generar el reporte");
            return;
        }

        // Find the selected trimester data
        const trimestreData = datosPorTrimestre.find(t => t.trimestre.toString() === trimestreSeleccionadoReporte);
        if (!trimestreData) return;

        const doc = new jsPDF('landscape');
        
        // Add title
        doc.setFontSize(18);
        doc.text(`Reporte de Calificaciones - Trimestre ${trimestreData.trimestre}`, 14, 22);
        doc.setFontSize(11);
        doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 14, 30);
        doc.text(`Período: ${trimestreData.fechaInicio} a ${trimestreData.fechaFinal}`, 14, 38);
        
        // Prepare columns and data
        const columns = [
            { header: 'ALUMNO', dataKey: 'alumno' }
        ];
        
        // Add columns for each task in each dimension
        const tareaColumns = [];
        Object.entries(trimestreData.dimensionesProcesadas).forEach(([dimensionName, tareas]) => {
            tareas.forEach(tarea => {
                tareaColumns.push({
                    header: tarea,
                    dataKey: tarea
                });
            });
        });
        
        columns.push(...tareaColumns, { header: 'NOTA FINAL', dataKey: 'notaFinal' });
        
        // Prepare rows data
        const data = trimestreData.estudiantes.map(alumno => {
            const row = { alumno };
            
            // Add task grades
            Object.entries(trimestreData.dimensionesProcesadas).forEach(([dimensionName, tareas]) => {
                tareas.forEach(tarea => {
                    row[tarea] = trimestreData.notas[alumno]?.[tarea] || '-';
                });
            });
            
            // Calculate and add final grade
            let total = 0;
            trimestreData.dimensiones.forEach(dim => {
                const tareas = dim.actividades.flatMap(a => a.tareas);
                if (tareas.length > 0) {
                    const suma = tareas.reduce(
                        (acc, t) => acc + parseFloat(trimestreData.notas[alumno]?.[t.descripcion] ?? 0), 0
                    );
                    const promedio = suma / tareas.length;
                    total += promedio * (dim.dimension.puntaje / 100);
                }
            });
            
            row.notaFinal = total.toFixed(2);
            
            return row;
        });
        
        // Generate table
        doc.autoTable({
            columns,
            body: data,
            startY: 45,
            headStyles: { fillColor: [41, 128, 185], textColor: 255 },
            alternateRowStyles: { fillColor: [245, 245, 245] },
            styles: { fontSize: 8 },
            columnStyles: {
                notaFinal: { fillColor: [220, 252, 231] }
            }
        });
        
        // Save PDF
        doc.save(`ReporteCalificaciones_Trimestre_${trimestreData.trimestre}.pdf`);
    };
    
    const generarExcel = () => {
        if (!trimestreSeleccionadoReporte) {
            alert("Por favor seleccione un trimestre para generar el reporte");
            return;
        }

        // Find the selected trimester data
        const trimestreData = datosPorTrimestre.find(t => t.trimestre.toString() === trimestreSeleccionadoReporte);
        if (!trimestreData) return;
        
        // Prepare data
        const excelData = trimestreData.estudiantes.map(alumno => {
            const row = { 'ALUMNO': alumno };
            
            // Add tasks grades
            Object.entries(trimestreData.dimensionesProcesadas).forEach(([dimensionName, tareas]) => {
                tareas.forEach(tarea => {
                    row[tarea] = trimestreData.notas[alumno]?.[tarea] || '-';
                });
            });
            
            // Calculate final grade
            let total = 0;
            trimestreData.dimensiones.forEach(dim => {
                const tareas = dim.actividades.flatMap(a => a.tareas);
                if (tareas.length > 0) {
                    const suma = tareas.reduce(
                        (acc, t) => acc + parseFloat(trimestreData.notas[alumno]?.[t.descripcion] ?? 0), 0
                    );
                    const promedio = suma / tareas.length;
                    total += promedio * (dim.dimension.puntaje / 100);
                }
            });
            
            row['NOTA FINAL'] = total.toFixed(2);
            
            return row;
        });
        
        // Create worksheet
        const worksheet = XLSX.utils.json_to_sheet(excelData);
        
        // Create workbook
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, `Trimestre ${trimestreData.trimestre}`);
        
        // Generate Excel file
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
        
        // Save file
        saveAs(blob, `ReporteCalificaciones_Trimestre_${trimestreData.trimestre}.xlsx`);
    };
    
    const generarHTML = () => {
        if (!trimestreSeleccionadoReporte) {
            alert("Por favor seleccione un trimestre para generar el reporte");
            return;
        }

        // Find the selected trimester data
        const trimestreData = datosPorTrimestre.find(t => t.trimestre.toString() === trimestreSeleccionadoReporte);
        if (!trimestreData) return;
        
        // Create HTML content
        let htmlContent = `
            <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Reporte de Calificaciones - Trimestre ${trimestreData.trimestre}</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; }
                    h1 { color: #2980b9; }
                    table { border-collapse: collapse; width: 100%; margin-top: 20px; }
                    th, td { border: 1px solid #ddd; padding: 8px; text-align: center; }
                    th { background-color: #2980b9; color: white; }
                    tr:nth-child(even) { background-color: #f2f2f2; }
                    .date { margin-bottom: 20px; }
                    .nota-final { background-color: #dcfce7; font-weight: bold; }
                    .nota-reprobada { background-color: #fee2e2; color: #991b1b; }
                    .nota-aprobada { background-color: #dcfce7; color: #166534; }
                </style>
            </head>
            <body>
                <h1>Reporte de Calificaciones - Trimestre ${trimestreData.trimestre}</h1>
                <div class="date">Fecha: ${new Date().toLocaleDateString()}</div>
                <div>Período: ${trimestreData.fechaInicio} a ${trimestreData.fechaFinal}</div>
                <table>
                    <thead>
                        <tr>
                            <th>ALUMNO</th>
        `;
        
        // Add headers for each task in each dimension
        Object.entries(trimestreData.dimensionesProcesadas).forEach(([dimensionName, tareas]) => {
            tareas.forEach(tarea => {
                htmlContent += `<th>${tarea}</th>`;
            });
        });
        
        htmlContent += `<th>NOTA FINAL</th></tr></thead><tbody>`;
        
        // Add rows for each student
        trimestreData.estudiantes.forEach(alumno => {
            htmlContent += `<tr><td>${alumno}</td>`;
            
            // Add task grades
            Object.entries(trimestreData.dimensionesProcesadas).forEach(([dimensionName, tareas]) => {
                tareas.forEach(tarea => {
                    const nota = trimestreData.notas[alumno]?.[tarea] || '-';
                    htmlContent += `<td>${nota}</td>`;
                });
            });
            
            // Calculate final grade
            let total = 0;
            trimestreData.dimensiones.forEach(dim => {
                const tareas = dim.actividades.flatMap(a => a.tareas);
                if (tareas.length > 0) {
                    const suma = tareas.reduce(
                        (acc, t) => acc + parseFloat(trimestreData.notas[alumno]?.[t.descripcion] ?? 0), 0
                    );
                    const promedio = suma / tareas.length;
                    total += promedio * (dim.dimension.puntaje / 100);
                }
            });
            
            const notaFinal = total.toFixed(2);
            const notaClass = parseFloat(notaFinal) >= 51 ? 'nota-aprobada' : 'nota-reprobada';
            
            htmlContent += `<td class="${notaClass}">${notaFinal}</td></tr>`;
        });
        
        // Close HTML tags
        htmlContent += `
                    </tbody>
                </table>
            </body>
            </html>
        `;
        
        // Create and download HTML file
        const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
        saveAs(blob, `ReporteCalificaciones_Trimestre_${trimestreData.trimestre}.html`);
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
                {/* Responsive report generation panel */}
                <div className="reporte-panel">
                    <h2 className="reporte-titulo">Generar Reportes</h2>
                    <div className="reporte-controles">
                        <div className="reporte-selector">
                            <label htmlFor="selector-trimestre">Seleccione el trimestre:</label>
                            <select 
                                id="selector-trimestre"
                                value={trimestreSeleccionadoReporte} 
                                onChange={(e) => setTrimestreSeleccionadoReporte(e.target.value)}
                                className="form-select"
                            >
                                <option value="">Seleccionar...</option>
                                {datosPorTrimestre.map((trimestre, idx) => (
                                    <option key={idx} value={trimestre.trimestre}>
                                        Trimestre {trimestre.trimestre}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="reporte-botones">
                            <button className="btn btn-danger" onClick={generarPDF}>
                                <i className="fas fa-file-pdf"></i> PDF
                            </button>
                            <button className="btn btn-success" onClick={generarExcel}>
                                <i className="fas fa-file-excel"></i> Excel
                            </button>
                            <button className="btn btn-primary" onClick={generarHTML}>
                                <i className="fas fa-file-code"></i> HTML
                            </button>
                        </div>
                    </div>
                </div>
                
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