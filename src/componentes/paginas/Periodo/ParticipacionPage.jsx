import React, { useState, useEffect } from 'react';
import { obtenerCursosRequest, obtenerUsuarioRequest, obtenerMateriasRequest } from '../../../api/auth';

function ParticipacionPage() {
    // Estados para datos desde API
    const [listaAlumnos, setListaAlumnos] = useState([]);
    const [listaCursos, setListaCursos] = useState([]);
    const [listaMaterias, setListaMaterias] = useState([]);
    const [loadingAlumnos, setLoadingAlumnos] = useState(true);
    const [loadingCursos, setLoadingCursos] = useState(true);
    const [loadingMaterias, setLoadingMaterias] = useState(true);
    const [error, setError] = useState(null);

    const [alumnos, setAlumnos] = useState([
        {
            id: 1,
            nombre: 'Juan Pérez',
            descripcion: 'Participante activo en clase',
            fecha: '2025-05-10',
            curso: 'Matemáticas',
            materia: 'Álgebra'
        },
        {
            id: 2,
            nombre: 'Ana López',
            descripcion: 'Entrega tareas puntualmente',
            fecha: '2025-05-12',
            curso: 'Lenguaje',
            materia: 'Literatura'
        },
        {
            id: 3,
            nombre: 'Carlos Ruiz',
            descripcion: 'Participa en debates',
            fecha: '2025-05-15',
            curso: 'Historia',
            materia: 'Historia Universal'
        }
    ]);

    // Estados para los inputs
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [fecha, setFecha] = useState('');
    const [curso, setCurso] = useState('');
    const [materia, setMateria] = useState('');
    const [mostrarFormulario, setMostrarFormulario] = useState(false);

    // Cargar datos desde API
    useEffect(() => {
        // Establecer la fecha actual
        const hoy = new Date();
        const fechaFormateada = hoy.toISOString().split('T')[0];
        setFecha(fechaFormateada);
        
        // Cargar alumnos
        const fetchAlumnos = async () => {
            try {
                setLoadingAlumnos(true);
                const response = await obtenerUsuarioRequest();
                // Filtrar solo alumnos (aquí deberías ajustar según tu estructura de roles)
                const soloAlumnos = response.data.filter(usuario => 
                    usuario.rol && usuario.rol_nombre === "Alumno"
                );
                
                const alumnosFormateados = soloAlumnos.map(alumno => ({
                    id: alumno.id,
                    nombre: `${alumno.nombre} ${alumno.apellido || ''}`
                }));
                
                setListaAlumnos(alumnosFormateados);
                setLoadingAlumnos(false);
            } catch (error) {
                console.error("Error al cargar alumnos:", error);
                setError("Error al cargar la lista de alumnos");
                setLoadingAlumnos(false);
            }
        };

        // Cargar cursos
        const fetchCursos = async () => {
            try {
                setLoadingCursos(true);
                const response = await obtenerCursosRequest();
                setListaCursos(response.data);
                setLoadingCursos(false);
            } catch (error) {
                console.error("Error al cargar cursos:", error);
                setError("Error al cargar la lista de cursos");
                setLoadingCursos(false);
            }
        };

        // Cargar materias
        const fetchMaterias = async () => {
            try {
                setLoadingMaterias(true);
                const response = await obtenerMateriasRequest();
                setListaMaterias(response.data);
                setLoadingMaterias(false);
            } catch (error) {
                console.error("Error al cargar materias:", error);
                setError("Error al cargar la lista de materias");
                setLoadingMaterias(false);
            }
        };

        fetchAlumnos();
        fetchCursos();
        fetchMaterias();
    }, []);

    const agregarAlumno = (e) => {
        e.preventDefault();
        if (!nombre || !descripcion || !curso || !materia) return;
        
        // Asegurar que la fecha sea la actual
        const hoy = new Date();
        const fechaActual = hoy.toISOString().split('T')[0];
        
        // Encontrar el nombre completo del alumno seleccionado
        const alumnoSeleccionado = listaAlumnos.find(a => a.id.toString() === nombre.toString());
        const nombreAlumno = alumnoSeleccionado ? alumnoSeleccionado.nombre : nombre;
        
        // Encontrar el nombre del curso seleccionado
        const cursoSeleccionado = listaCursos.find(c => c.id.toString() === curso.toString());
        const nombreCurso = cursoSeleccionado ? cursoSeleccionado.nombre : curso;
        
        // Encontrar el nombre de la materia seleccionada
        const materiaSeleccionada = listaMaterias.find(m => m.id.toString() === materia.toString());
        const nombreMateria = materiaSeleccionada ? materiaSeleccionada.nombre : materia;
        
        const nuevoAlumno = {
            id: Date.now(),
            nombre: nombreAlumno,
            descripcion,
            fecha: fechaActual,
            curso: nombreCurso,
            materia: nombreMateria
        };
        
        setAlumnos([...alumnos, nuevoAlumno]);
        setNombre('');
        setDescripcion('');
        setCurso('');
        setMateria('');
        setMostrarFormulario(false);
    };

    const eliminarAlumno = (id) => {
        setAlumnos(alumnos.filter(a => a.id !== id));
    };

    const toggleFormulario = () => {
        setMostrarFormulario(!mostrarFormulario);
    };

    return (
        <div className='contenedor-principal'>
            <div className='contenedor-secundario'>
                <h1 className='titulo'>Participación</h1>
                
                <div className='mb-3'>
                    <button className="btn btn-primary"
                        onClick={toggleFormulario}>
                        <i className="bi bi-plus-circle-fill"></i>
                        {mostrarFormulario ? 'Cancelar' : 'Agregar'}
                    </button>
                </div>
                
                {error && <div className="alert alert-danger">{error}</div>}
                
                {mostrarFormulario && (
                    <div className='contenedor-contenido'>
                        <div>
                            <select
                                className="form-select"
                                value={nombre}
                                onChange={e => setNombre(e.target.value)}
                                required
                                disabled={loadingAlumnos}
                            >
                                <option value="">Seleccione un alumno</option>
                                {listaAlumnos.map(alumno => (
                                    <option key={alumno.id} value={alumno.id}>
                                        {alumno.nombre}
                                    </option>
                                ))}
                            </select>
                            {loadingAlumnos && <small className="text-muted">Cargando alumnos...</small>}
                        </div>
                        <div>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Descripción"
                                value={descripcion}
                                onChange={e => setDescripcion(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <input
                                className="form-control"
                                type="date"
                                value={fecha}
                                readOnly
                                required
                            />
                        </div>
                        <div>
                            <select
                                className="form-select"
                                value={curso}
                                onChange={e => setCurso(e.target.value)}
                                required
                                disabled={loadingCursos}
                            >
                                <option value="">Seleccione un curso</option>
                                {listaCursos.map(curso => (
                                    <option key={curso.id} value={curso.id}>
                                        {curso.nombre}
                                    </option>
                                ))}
                            </select>
                            {loadingCursos && <small className="text-muted">Cargando cursos...</small>}
                        </div>
                        <div>
                            <select
                                className="form-select"
                                value={materia}
                                onChange={e => setMateria(e.target.value)}
                                required
                                disabled={loadingMaterias}
                            >
                                <option value="">Seleccione una materia</option>
                                {listaMaterias.map(materia => (
                                    <option key={materia.id} value={materia.id}>
                                        {materia.nombre}
                                    </option>
                                ))}
                            </select>
                            {loadingMaterias && <small className="text-muted">Cargando materias...</small>}
                        </div>
                        <div>
                            <button className="btn btn-success"
                                onClick={agregarAlumno}>
                                Guardar
                            </button>
                        </div>
                    </div>
                )}
                
                <div className='dimensionTable'>
                    <table className='table-striped'>
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
                            {alumnos.map(alumno => (
                                <tr key={alumno.id}>
                                    <td>{alumno.nombre}</td>
                                    <td>{alumno.descripcion}</td>
                                    <td>{alumno.fecha}</td>
                                    <td>{alumno.curso}</td>
                                    <td>{alumno.materia}</td>
                                    <td>
                                        <button className="btn btn-danger" onClick={() => eliminarAlumno(alumno.id)}>Eliminar</button>
                                    </td>
                                </tr>
                            ))}
                            {alumnos.length === 0 && (
                                <tr>
                                    <td colSpan="6">No hay alumnos registrados.</td>
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