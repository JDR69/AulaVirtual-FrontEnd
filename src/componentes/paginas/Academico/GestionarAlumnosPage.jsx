import React, { useState, useEffect } from 'react';
import '../../css/Gestion.css';
import {
    obtenerGestionRequest,
    obtenerDetalleCompletoPorCurso,
    obtenerUsuarioRequest,
    obtenerCursosRequest,
    crearLibretaRequest,
} from '../../../api/auth';

function GestionarAlumnosPage() {
    const [alumnos, setAlumnos] = useState([]);
    const [gestiones, setGestiones] = useState([]);
    const [cursos, setCursos] = useState([]);
    const [cursoB, setCursosB] = useState([])
    const [paralelos, setParalelos] = useState([]);

    const [registroData, setRegistroData] = useState({
        alumno_id: '',
        curso: '',
        gestion_id: '',
        paralelo: '',
        description: 'Primera inscripción',
    });

    const [busquedaAlumno, setBusquedaAlumno] = useState('');
    const [sugerencias, setSugerencias] = useState([]);

    // Manejar cambios en el formulario
    const handleRegistroChange = (e) => {
        const { name, value } = e.target;

        console.log(`Campo cambiado: ${name}, Valor: ${value}`); // Depuración

        setRegistroData({ ...registroData, [name]: value });

        // Si se selecciona un curso, actualizar los paralelos correspondientes
        if (name === 'curso') {
            console.log(cursos)
            const cursoSeleccionado = cursos.find((c) => c.nombre === value);
            console.log('Curso seleccionado:', cursoSeleccionado); // Depuración

            // Buscar los paralelos del curso seleccionado
            if (cursoSeleccionado) {
                setParalelos(cursoSeleccionado.paralelos || []);
            } else {
                setParalelos([]);
            }
        }
    };

    // Buscar alumnos
    const handleBusquedaChange = (e) => {
        const valor = e.target.value;
        setBusquedaAlumno(valor);

        if (valor.trim().length >= 3) {
            const sugeridos = alumnos.filter((a) => {
                const nombreCompleto = `${a.nombre || ''} ${a.apellido || ''}`.toLowerCase();
                const ci = (a.ci || '').toLowerCase();
                return nombreCompleto.includes(valor.toLowerCase()) || ci.includes(valor.toLowerCase());
            });
            setSugerencias(sugeridos);
        } else {
            setSugerencias([]);
        }
    };


    const seleccionarAlumno = (alumno) => {
        setRegistroData({
            ...registroData,
            alumno_id: alumno.id,
        });
        setBusquedaAlumno(`${alumno.nombre || 'Desconocido'} ${alumno.apellido || ''}`);
        setSugerencias([]);
    };

    // Consumir datos de la API
    const fetchData = async () => {
        try {
            const [gestionesRes, detalleCursosRes, usuariosRes, cursosR] = await Promise.all([
                obtenerGestionRequest(),
                obtenerDetalleCompletoPorCurso(),
                obtenerUsuarioRequest(),
                obtenerCursosRequest(),
            ]);

            setGestiones(gestionesRes.data);

            // Procesar los cursos desde la respuesta de obtenerDetalleCompletoPorCurso
            const cursosProcesados = detalleCursosRes.data.map((detalle, index) => ({
                id: index + 1, // Generar un ID único si no existe
                nombre: detalle.curso,
                paralelos: detalle.paralelos || [], // Asegurarse de que paralelos sea un array
            }));
            setCursos(cursosProcesados);

            // Filtrar solo los usuarios con rol de alumno
            const alumnosFiltrados = usuariosRes.data.filter((usuario) => usuario.rol_nombre === 'Alumno');
            setAlumnos(alumnosFiltrados);

            console.log(cursosR.data)
            setCursosB(cursosR.data)
        } catch (error) {
            console.error('Error al obtener datos:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Manejar el envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();

        const { alumno_id, curso, gestion_id, paralelo, description } = registroData;

        // Validar que todos los campos estén completos
        if (!alumno_id || !curso || !gestion_id || !paralelo) {
            alert('Por favor, complete todos los campos antes de registrar.');
            return;
        }

        const cursoSeleccionado = cursoB.find((c) => c.nombre === curso);
        const gestionSelecion = gestiones.find((g) => g.gestion === parseInt(gestion_id));
        const data = {
            alumno: alumno_id,
            curso: parseInt(cursoSeleccionado.id),
            gestion: parseInt(gestion_id),
            paralelo: parseInt(paralelo),
            descripcion: "inscripcion correcta",
            anio_escolar: gestionSelecion.anio_escolar,
        };

        try {
            const response = await crearLibretaRequest(data);
            console.log(response.data);

            // Si el registro es exitoso, limpiar los inputs
            if (response.status === 201) {
                alert('Alumno registrado exitosamente.');
                setRegistroData({
                    alumno_id: '',
                    curso: '',
                    gestion_id: '',
                    paralelo: '',
                    description: 'Primera inscripción',
                });
                setBusquedaAlumno('');
                setSugerencias([]);
            }
        } catch (error) {
            if (error.response) {
                console.error('Error al registrar al alumno:', error.response.data);
                const { message, errores } = error.response.data;
                alert(`Error: ${message}\n${errores ? errores.map((err) => JSON.stringify(err)).join('\n') : ''}`);
            } else {
                console.error('Error al registrar al alumno:', error);
                alert('Ocurrió un error al registrar al alumno. Intente nuevamente.');
            }
        }
    };

    return (
        <div className="contenedor-principal">
            <div className="contenedor-secundario">
                <div className="gestion-container">
                    <div className="gestion-header">
                        <h1>Gestión Académica de Alumnos</h1>
                        <p>Registrar alumnos en un año académico</p>
                    </div>

                    <div className="gestion-table card">
                        <div className="registro-form card">
                            <div className="card-header">
                                <h2>Registrar Alumno en Gestión</h2>
                            </div>
                            <div className="card-body">
                                <form onSubmit={handleSubmit}>
                                    <div className="input-group">
                                        <label>Buscar Alumno:</label>
                                        <div className="acomodar">
                                            <input
                                                type="text"
                                                id="busqueda"
                                                value={busquedaAlumno}
                                                onChange={handleBusquedaChange}
                                                placeholder="Ej: Juan Pérez"
                                                autoComplete="off"
                                                required
                                            />
                                            {busquedaAlumno.trim().length >= 3 && sugerencias.length > 0 && (
                                                <ul className="sugerencias">
                                                    {sugerencias.map((alumno) => (
                                                        <li
                                                            key={alumno.id}
                                                            onClick={() => seleccionarAlumno(alumno)}
                                                            className="sugerencia-item"
                                                        >
                                                            {alumno.nombre} {alumno.apellido}
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                    </div>
                                    <div className="input-group">
                                        <label htmlFor="curso">Curso:</label>
                                        <select
                                            id="curso"
                                            name="curso"
                                            value={registroData.curso}
                                            onChange={handleRegistroChange}
                                            required
                                        >
                                            <option value="">Seleccione el curso</option>
                                            {cursos.map((curso) => (
                                                <option key={curso.id} value={curso.nombre}>
                                                    {curso.nombre}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="input-group">
                                        <label htmlFor="paralelo">Paralelo:</label>
                                        <select
                                            id="paralelo"
                                            name="paralelo"
                                            value={registroData.paralelo}
                                            onChange={handleRegistroChange}
                                            required
                                        >
                                            <option value="">Seleccione el paralelo</option>
                                            {paralelos.map((paralelo) => (
                                                <option key={paralelo.id} value={paralelo.id}>
                                                    {paralelo.nombre}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="input-group">
                                        <label htmlFor="gestion">Gestión Académica:</label>
                                        <select
                                            id="gestion"
                                            name="gestion_id"
                                            value={registroData.gestion_id}
                                            onChange={handleRegistroChange}
                                            required
                                        >
                                            <option value="">Seleccione una gestión</option>
                                            {gestiones.map((gestion) => (
                                                <option key={gestion.gestion} value={gestion.gestion}>
                                                    {gestion.anio_escolar}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="form-actions">
                                        <button type="submit" className="btn btn-success">
                                            Registrar Alumno
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>

                    <div className="gestion-table card">
                        <div className="card-header">
                            <h2>Gestiones Registradas</h2>
                        </div>
                        <div className="card-body">
                            <div className="table-responsive">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Año Escolar</th>
                                            <th>Estado</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {gestiones.map((gestion) => (
                                            <tr key={gestion.gestion}>
                                                <td>{gestion.gestion}</td>
                                                <td>{gestion.anio_escolar}</td>
                                                <td>
                                                    <span className={`status-badge ${gestion.estado ? 'habilitado' : 'deshabilitado'}`}>
                                                        {gestion.estado ? 'Habilitado' : 'Deshabilitado'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default GestionarAlumnosPage;