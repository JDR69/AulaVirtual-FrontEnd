import React, { useState, useEffect } from 'react';
import {
    obtenerCursosRequest,
    obtenerUsuarioRequest,
    obtenerMateriasRequest,
    crearParticipacionesRequest,
    obtenerParticipacionesRequest
} from '../../../api/auth';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import '../../../componentes/css/Participacion.css';

function ParticipacionPage() {
    // Estados para datos desde API
    const [listaAlumnos, setListaAlumnos] = useState([]);
    const [listaCursos, setListaCursos] = useState([]);
    const [listaMaterias, setListaMaterias] = useState([]);
    const [loadingAlumnos, setLoadingAlumnos] = useState(true);
    const [loadingCursos, setLoadingCursos] = useState(true);
    const [loadingMaterias, setLoadingMaterias] = useState(true);
    const [error, setError] = useState(null);

    // Estados para los inputs
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [fecha, setFecha] = useState('');
    const [curso, setCurso] = useState('');
    const [materia, setMateria] = useState('');

    // Estado para las participaciones
    const [alumnos, setAlumnos] = useState([]);

    // Cargar datos desde API al montar el componente
    useEffect(() => {
        const hoy = new Date();
        setFecha(hoy.toISOString().split('T')[0]);

        const fetchData = async () => {
            await Promise.all([fetchAlumnos(), fetchCursos(), fetchMaterias()]);
        };

        fetchData();
    }, []);

    // Funciones para cargar datos desde la API
    const fetchAlumnos = async () => {
        try {
            setLoadingAlumnos(true);
            const response = await obtenerUsuarioRequest();
            const soloAlumnos = response.data.filter(usuario => usuario.rol_nombre === "Alumno" && usuario.alumno);
            const alumnosFormateados = soloAlumnos.map(alumno => ({
                id: alumno.id,
                nombre: `${alumno.nombre} ${alumno.alumno?.matricula || ''}`
            }));
            setListaAlumnos(alumnosFormateados);
        } catch (error) {
            console.error("Error al cargar alumnos:", error);
            setError("Error al cargar la lista de alumnos");
        } finally {
            setLoadingAlumnos(false);
        }
    };

    const fetchCursos = async () => {
        try {
            setLoadingCursos(true);
            const response = await obtenerCursosRequest();
            setListaCursos(response.data);
        } catch (error) {
            console.error("Error al cargar cursos:", error);
            setError("Error al cargar la lista de cursos");
        } finally {
            setLoadingCursos(false);
        }
    };

    const fetchMaterias = async () => {
        try {
            setLoadingMaterias(true);
            const response = await obtenerMateriasRequest();
            setListaMaterias(response.data);
        } catch (error) {
            console.error("Error al cargar materias:", error);
            setError("Error al cargar la lista de materias");
        } finally {
            setLoadingMaterias(false);
        }
    };

    // Función para listar participaciones
    const listarParticipaciones = async () => {
        if (!nombre || !materia) {
            alert("Por favor, seleccione un alumno y una materia.");
            return;
        }

        try {
            const response = await obtenerParticipacionesRequest(nombre, materia);
            const participaciones = response.data.map(participacion => ({
                id: participacion.id,
                nombre: listaAlumnos.find(a => a.id === participacion.alumno)?.nombre || "Desconocido",
                descripcion: participacion.descripcion,
                fecha: participacion.fecha,
                curso: listaCursos.find(c => c.id === participacion.curso)?.nombre || "Desconocido",
                materia: listaMaterias.find(m => m.id === participacion.materia)?.nombre || "Desconocido"
            }));
            setAlumnos(participaciones);
        } catch (error) {
            console.error("Error al cargar participaciones:", error);
            setError("Error al cargar las participaciones");
        }
    };

    // Función para agregar una nueva participación
    const agregarAlumno = async (e) => {
        e.preventDefault();
        if (!nombre || !descripcion || !curso || !materia) {
            alert("Por favor, complete todos los campos.");
            return;
        }

        try {
            const payload = {
                descripcion,
                fecha,
                alumno: parseInt(nombre),
                curso: parseInt(curso),
                materia: parseInt(materia)
            };

            const response = await crearParticipacionesRequest(payload);

            if (response.status === 201) {
                const nuevoAlumno = {
                    id: response.data.data.id,
                    nombre: listaAlumnos.find(a => a.id === parseInt(nombre))?.nombre || "Desconocido",
                    descripcion: response.data.data.descripcion,
                    fecha: response.data.data.fecha,
                    curso: listaCursos.find(c => c.id === parseInt(curso))?.nombre || "Desconocido",
                    materia: listaMaterias.find(m => m.id === parseInt(materia))?.nombre || "Desconocido"
                };
                setAlumnos([...alumnos, nuevoAlumno]);
                limpiarFormulario();
                alert("Participación creada exitosamente.");
            } else {
                alert("Error al crear la participación.");
            }
        } catch (error) {
            console.error("Error al crear la participación:", error);
            alert("Ocurrió un error al intentar crear la participación.");
        }
    };

    // Función para eliminar una participación
    const eliminarAlumno = (id) => {
        setAlumnos(alumnos.filter(a => a.id !== id));
    };

    // Función para limpiar el formulario
    const limpiarFormulario = () => {
        setNombre('');
        setDescripcion('');
        setCurso('');
        setMateria('');
    };

    // Funciones para exportar datos
    const exportToPDF = () => {
        if (alumnos.length === 0) {
            alert("No hay datos para exportar");
            return;
        }

        const doc = new jsPDF();
        
        // Añadir título
        doc.setFontSize(18);
        doc.text("Reporte de Participaciones", 14, 22);
        
        // Añadir fecha de generación
        doc.setFontSize(11);
        const fecha = new Date().toLocaleString();
        doc.text(`Generado: ${fecha}`, 14, 30);
        
        // Crear tabla
        const headers = [["Alumno", "Descripción", "Fecha", "Curso", "Materia"]];
        const data = alumnos.map(item => [
            item.nombre,
            item.descripcion,
            item.fecha,
            item.curso,
            item.materia
        ]);
        
        doc.autoTable({
            head: headers,
            body: data,
            startY: 35,
            styles: {
                fontSize: 10,
                cellPadding: 3,
                overflow: 'linebreak'
            },
            headStyles: {
                fillColor: [76, 132, 255],
                textColor: 255
            },
            alternateRowStyles: {
                fillColor: [240, 240, 240]
            }
        });
        
        doc.save("participaciones.pdf");
    };

    const exportToExcel = () => {
        if (alumnos.length === 0) {
            alert("No hay datos para exportar");
            return;
        }

        const data = alumnos.map(item => ({
            "Alumno": item.nombre,
            "Descripción": item.descripcion,
            "Fecha": item.fecha,
            "Curso": item.curso,
            "Materia": item.materia
        }));
        
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Participaciones");
        
        // Generar archivo Excel y descargarlo
        XLSX.writeFile(workbook, "participaciones.xlsx");
    };

    const exportToHTML = () => {
        if (alumnos.length === 0) {
            alert("No hay datos para exportar");
            return;
        }

        let html = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Reporte de Participaciones</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                h1 { color: #4c84ff; text-align: center; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th, td { padding: 10px; border: 1px solid #ddd; text-align: left; }
                th { background-color: #f2f2f2; }
                tr:nth-child(even) { background-color: #f9f9f9; }
                .footer { margin-top: 30px; font-style: italic; text-align: right; }
            </style>
        </head>
        <body>
            <h1>Reporte de Participaciones</h1>
            <p>Fecha de generación: ${new Date().toLocaleString()}</p>
            <table>
                <thead>
                    <tr>
                        <th>Alumno</th>
                        <th>Descripción</th>
                        <th>Fecha</th>
                        <th>Curso</th>
                        <th>Materia</th>
                    </tr>
                </thead>
                <tbody>
        `;

        alumnos.forEach(item => {
            html += `
                <tr>
                    <td>${item.nombre}</td>
                    <td>${item.descripcion}</td>
                    <td>${item.fecha}</td>
                    <td>${item.curso}</td>
                    <td>${item.materia}</td>
                </tr>
            `;
        });

        html += `
                </tbody>
            </table>
            <div class="footer">Reporte generado desde el Sistema de Aula Virtual</div>
        </body>
        </html>
        `;

        // Crear un blob y descargar el archivo HTML
        const blob = new Blob([html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = "participaciones.html";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className='titi1'>
            <div className='titi2'>
                <h1 className='titi3'>Registro de Participación</h1>

                {error && <div className="alert alert-danger">{error}</div>}

                {/* Formulario para listar participaciones */}
                <div className='titi2'>
                    <h2 className='titi4'>Listar Participaciones</h2>
                    <div className='titi16'>
                        <select
                            className="titi5"
                            value={nombre}
                            onChange={e => setNombre(e.target.value)}
                            disabled={loadingAlumnos}
                        >
                            <option value="">Seleccione un alumno</option>
                            {listaAlumnos.map(alumno => (
                                <option key={alumno.id} value={alumno.id}>
                                    {alumno.nombre}
                                </option>
                            ))}
                        </select>
                        {loadingAlumnos && <small className="titi15">Cargando alumnos...</small>}
                    </div>
                    <div className='titi16'>
                        <select
                            className="titi5"
                            value={materia}
                            onChange={e => setMateria(e.target.value)}
                            disabled={loadingMaterias}
                        >
                            <option value="">Seleccione una materia</option>
                            {listaMaterias.map(materia => (
                                <option key={materia.id} value={materia.id}>
                                    {materia.nombre}
                                </option>
                            ))}
                        </select>
                        {loadingMaterias && <small className="titi15">Cargando materias...</small>}
                    </div>
                    <div className='titi6'>
                        <button className="titi7" onClick={listarParticipaciones}>
                            Listar Participaciones
                        </button>
                    </div>
                </div>

                {/* Formulario para agregar participaciones */}
                <div className='titi2'>
                    <h2 className='titi4'>Agregar Participación</h2>
                    <div className='titi16'>
                        <select
                            className="titi5"
                            value={nombre}
                            onChange={e => setNombre(e.target.value)}
                            disabled={loadingAlumnos}
                        >
                            <option value="">Seleccione un alumno</option>
                            {listaAlumnos.map(alumno => (
                                <option key={alumno.id} value={alumno.id}>
                                    {alumno.nombre}
                                </option>
                            ))}
                        </select>
                        {loadingAlumnos && <small className="titi15">Cargando alumnos...</small>}
                    </div>
                    <div className='titi16'>
                        <input
                            type="text"
                            className="titi5"
                            placeholder="Descripción"
                            value={descripcion}
                            onChange={e => setDescripcion(e.target.value)}
                        />
                    </div>
                    <div className='titi16'>
                        <select
                            className="titi5"
                            value={curso}
                            onChange={e => setCurso(e.target.value)}
                            disabled={loadingCursos}
                        >
                            <option value="">Seleccione un curso</option>
                            {listaCursos.map(curso => (
                                <option key={curso.id} value={curso.id}>
                                    {curso.nombre}
                                </option>
                            ))}
                        </select>
                        {loadingCursos && <small className="titi15">Cargando cursos...</small>}
                    </div>
                    <div className='titi16'>
                        <select
                            className="titi5"
                            value={materia}
                            onChange={e => setMateria(e.target.value)}
                            disabled={loadingMaterias}
                        >
                            <option value="">Seleccione una materia</option>
                            {listaMaterias.map(materia => (
                                <option key={materia.id} value={materia.id}>
                                    {materia.nombre}
                                </option>
                            ))}
                        </select>
                        {loadingMaterias && <small className="titi15">Cargando materias...</small>}
                    </div>
                    <div className='titi6'>
                        <button className="titi7 titi8" onClick={agregarAlumno}>
                            Agregar Participación
                        </button>
                    </div>
                </div>

                {/* Tabla de participaciones */}
                <div className='titi2'>
                    <h2 className='titi4'>Participaciones Registradas</h2>
                    
                    {/* Botones de exportación */}
                    <div className='titi11'>
                        <button className="titi7 titi12" onClick={exportToPDF}>
                            Exportar PDF
                        </button>
                        <button className="titi7 titi13" onClick={exportToExcel}>
                            Exportar Excel
                        </button>
                        <button className="titi7 titi14" onClick={exportToHTML}>
                            Exportar HTML
                        </button>
                    </div>
                    
                    <table className='titi10'>
                        <thead>
                            <tr>
                                <th>Alumno</th>
                                <th>Descripción</th>
                                <th>Fecha</th>
                                <th>Curso</th>
                                <th>Materia</th>
                                <th>Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            {alumnos.map(participacion => (
                                <tr key={participacion.id}>
                                    <td>{participacion.nombre}</td>
                                    <td>{participacion.descripcion}</td>
                                    <td>{participacion.fecha}</td>
                                    <td>{participacion.curso}</td>
                                    <td>{participacion.materia}</td>
                                    <td>
                                        <button className="titi7 titi9" onClick={() => eliminarAlumno(participacion.id)}>Eliminar</button>
                                    </td>
                                </tr>
                            ))}
                            {alumnos.length === 0 && (
                                <tr>
                                    <td colSpan="6">No hay participaciones registradas.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default ParticipacionPage;