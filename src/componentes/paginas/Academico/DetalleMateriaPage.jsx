import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import {
    obtenerMateriasRequest,
    obtenerHorariosRequest,
    obtenerUsuarioRequest,
    obtenerCursosRequest,
    obtenerParalelosRequest,
    nuevoDetalleMateriaRequest,
    obtenerDetalleMateriaRequest
} from '../../../api/auth';


function DetalleMateriaPage() {
    const [materias, setMaterias] = useState([]);
    const [profesores, setProfesores] = useState([]);
    const [horarios, setHorarios] = useState([]);
    const [cursos, setCursos] = useState([]);
    const [paralelos, setParalelos] = useState([]);
    const [detalleMateria,setDetalleMateria] = useState([]);

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

        obtenerDetalleMateriaRequest().then(res =>{
            console.log(res.data)
            setDetalleMateria((res.data || []))
        })

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

    // Add report generation functions
    const generarPDF = () => {
        const doc = new jsPDF();
        
        // Add title
        doc.setFontSize(18);
        doc.text('Reporte de Asignaciones', 14, 22);
        doc.setFontSize(11);
        doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 14, 30);
        
        // Define the table columns and data
        const columns = [
            { header: 'Materia', dataKey: 'materia' },
            { header: 'Profesor', dataKey: 'profesor' },
            { header: 'Horario', dataKey: 'horario' },
            { header: 'Curso', dataKey: 'curso' },
            { header: 'Paralelo', dataKey: 'paralelo' }
        ];
        
        const data = detalleMateria.map(asig => ({
            materia: asig.descripcion.materia_nombre,
            profesor: asig.descripcion.profesor_nombre,
            horario: asig.horarios[0].hora_inicial + ' - ' + asig.horarios[0].hora_final,
            curso: asig.horarios[0].nombre_curso,
            paralelo: asig.horarios[0].descripcion_paralelo
        }));
        
        // Generate the table
        doc.autoTable({
            columns,
            body: data,
            startY: 40,
            headStyles: { fillColor: [41, 128, 185], textColor: 255 },
            alternateRowStyles: { fillColor: [245, 245, 245] }
        });
        
        // Save the PDF
        doc.save('ReporteAsignaciones.pdf');
    };
    
    const generarExcel = () => {
        // Prepare the data
        const data = detalleMateria.map(asig => ({
            'Materia': asig.descripcion.materia_nombre,
            'Profesor': asig.descripcion.profesor_nombre,
            'Horario': asig.horarios[0].hora_inicial + ' - ' + asig.horarios[0].hora_final,
            'Curso': asig.horarios[0].nombre_curso,
            'Paralelo': asig.horarios[0].descripcion_paralelo
        }));
        
        // Create worksheet
        const worksheet = XLSX.utils.json_to_sheet(data);
        
        // Create workbook
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Asignaciones');
        
        // Generate Excel file
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
        
        // Save file
        saveAs(blob, 'ReporteAsignaciones.xlsx');
    };
    
    const generarHTML = () => {
        // Create HTML content
        let htmlContent = `
            <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Reporte de Asignaciones</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; }
                    h1 { color: #2980b9; }
                    table { border-collapse: collapse; width: 100%; margin-top: 20px; }
                    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                    th { background-color: #2980b9; color: white; }
                    tr:nth-child(even) { background-color: #f2f2f2; }
                    .date { margin-bottom: 20px; }
                </style>
            </head>
            <body>
                <h1>Reporte de Asignaciones</h1>
                <div class="date">Fecha: ${new Date().toLocaleDateString()}</div>
                <table>
                    <thead>
                        <tr>
                            <th>Materia</th>
                            <th>Profesor</th>
                            <th>Horario</th>
                            <th>Curso</th>
                            <th>Paralelo</th>
                        </tr>
                    </thead>
                    <tbody>
        `;
        
        // Add table rows
        detalleMateria.forEach(asig => {
            htmlContent += `
                <tr>
                    <td>${asig.descripcion.materia_nombre}</td>
                    <td>${asig.descripcion.profesor_nombre}</td>
                    <td>${asig.horarios[0].hora_inicial} - ${asig.horarios[0].hora_final}</td>
                    <td>${asig.horarios[0].nombre_curso}</td>
                    <td>${asig.horarios[0].descripcion_paralelo}</td>
                </tr>
            `;
        });
        
        // Close HTML tags
        htmlContent += `
                    </tbody>
                </table>
            </body>
            </html>
        `;
        
        // Create and download the HTML file
        const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
        saveAs(blob, 'ReporteAsignaciones.html');
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
                <div className="dimensionTable">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h2>Asignaciones Realizadas</h2>
                        <div className="btn-group">
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
                    <table className="table-striped table-bordered">
                        <thead>
                            <tr>
                                <th>Materia</th>
                                <th>Profesor</th>
                                <th>Horario</th>
                                <th>Curso</th>
                                <th>Paralelo</th>
                             
                            </tr>
                        </thead>
                        <tbody>
                            {detalleMateria.length === 0 ? (
                                <tr>
                                    <td colSpan="4" style={{ textAlign: 'center' }}>
                                        Sin asignaciones
                                    </td>
                                </tr>
                            ) : (
                                detalleMateria.map((asig, index) => (
                                    <tr key={index}>
                                        <td>{asig.descripcion.materia_nombre}</td>
                                        <td>{asig.descripcion.profesor_nombre}</td>
                                        <td>{asig.horarios[0].hora_inicial + ' - ' + asig.horarios[0].hora_final}</td>
                                        <td>{asig.horarios[0].nombre_curso}</td>
                                        <td>{asig.horarios[0].descripcion_paralelo}</td>
                                        
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