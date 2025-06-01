import React, { useState, useEffect } from 'react';
import {
    obtenerCursosRequest,
    obtenerUsuarioRequest,
    obtenerMateriasRequest,
    crearParticipacionesRequest,
    obtenerParticipacionesRequest
} from '../../../api/auth';

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

    return (
        <div className='contenedor-principal'>
            <div className='contenedor-secundario'>
                <h1 className='titulo'>Participación</h1>

                {error && <div className="alert alert-danger">{error}</div>}

                {/* Formulario para listar participaciones */}
                <div className='contenedor-contenido'>
                    <h2>Listar Participaciones</h2>
                    <div>
                        <select
                            className="form-select"
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
                        {loadingAlumnos && <small className="text-muted">Cargando alumnos...</small>}
                    </div>
                    <div>
                        <select
                            className="form-select"
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
                        {loadingMaterias && <small className="text-muted">Cargando materias...</small>}
                    </div>
                    <div>
                        <button className="btn btn-primary" onClick={listarParticipaciones}>
                            Listar Participaciones
                        </button>
                    </div>
                </div>

                {/* Formulario para agregar participaciones */}
                <div className='contenedor-contenido mt-4'>
                    <h2>Agregar Participación</h2>
                    <div>
                        <select
                            className="form-select"
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
                        {loadingAlumnos && <small className="text-muted">Cargando alumnos...</small>}
                    </div>
                    <div>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Descripción"
                            value={descripcion}
                            onChange={e => setDescripcion(e.target.value)}
                        />
                    </div>
                    <div>
                        <select
                            className="form-select"
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
                        {loadingCursos && <small className="text-muted">Cargando cursos...</small>}
                    </div>
                    <div>
                        <select
                            className="form-select"
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
                        {loadingMaterias && <small className="text-muted">Cargando materias...</small>}
                    </div>
                    <div>
                        <button className="btn btn-success" onClick={agregarAlumno}>
                            Agregar Participación
                        </button>
                    </div>
                </div>

                {/* Tabla de participaciones */}
                <div className='dimensionTable mt-4'>
                    <h2>Participaciones Registradas</h2>
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
                            {alumnos.map(participacion => (
                                <tr key={participacion.id}>
                                    <td>{participacion.nombre}</td>
                                    <td>{participacion.descripcion}</td>
                                    <td>{participacion.fecha}</td>
                                    <td>{participacion.curso}</td>
                                    <td>{participacion.materia}</td>
                                    <td>
                                        <button className="btn btn-danger" onClick={() => eliminarAlumno(participacion.id)}>Eliminar</button>
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