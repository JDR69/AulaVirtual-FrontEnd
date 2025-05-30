import React, { useState, useEffect } from 'react';
import '../../css/Libreta.css'; // Importar el nuevo archivo CSS
import { obtenerGestionRequest, obtenerUsuarioRequest, obtenerNotaAlumnosGestionRequest } from '../../../api/auth';

function LibretaPage() {
    const [busquedaAlumno, setBusquedaAlumno] = useState('');
    const [sugerencias, setSugerencias] = useState([]);
    const [alumnoSeleccionado, setAlumnoSeleccionado] = useState(null);
    const [alumnos, setAlumnos] = useState([]);
    const [gestiones, setGestiones] = useState([]);
    const [gestionSeleccionada, setGestionSeleccionada] = useState("");
    const [notasData, setNotasData] = useState([]);

    // Función para procesar y estructurar los datos de notas
    const procesarDatosNotas = (datosOriginales) => {
        const materiasMap = new Map();

        datosOriginales.forEach(item => {
            const materiaId = item.materia_id;
            const trimestre = item.trimestre.nro;
            const nombreMateria = item.nombre_materia;

            // Calcular promedio de todas las dimensiones para este trimestre
            const promediosValidos = item.dimensiones
                .filter(dim => dim.promedio !== null)
                .map(dim => dim.promedio);

            const promedioTrimestre = promediosValidos.length > 0
                ? (promediosValidos.reduce((sum, val) => sum + val, 0))
                : null;

            if (!materiasMap.has(materiaId)) {
                materiasMap.set(materiaId, {
                    materia_id: materiaId,
                    nombre_materia: nombreMateria,
                    trimestre1: null,
                    trimestre2: null,
                    trimestre3: null
                });
            }

            const materia = materiasMap.get(materiaId);
            materia[`trimestre${trimestre}`] = promedioTrimestre;
        });

        return Array.from(materiasMap.values());
    };

    // Calcular promedio con 2 decimales
    const calcularNotaFinal = (trimestre1, trimestre2, trimestre3) => {
        const notas = [trimestre1, trimestre2, trimestre3].filter(nota => nota !== null);
        if (notas.length === 0) return '0.00';
        const suma = notas.reduce((acc, nota) => acc + nota, 0);
        return (suma / notas.length).toFixed(2);
    };

    // Determina si el alumno aprobó en base al promedio general
    const determinarAprobacion = (materias = []) => {
        if (materias.length === 0) return 'Sin materias';

        let totalPromedio = 0;
        let materiasConNotas = 0;

        materias.forEach(materia => {
            const notaFinal = parseFloat(calcularNotaFinal(materia.trimestre1, materia.trimestre2, materia.trimestre3));
            if (notaFinal > 0) {
                totalPromedio += notaFinal;
                materiasConNotas++;
            }
        });

        if (materiasConNotas === 0) return 'Sin calificaciones';

        const promedio = totalPromedio / materiasConNotas;
        return promedio >= 60 ? 'Aprobado' : 'Reprobado';
    };

    // Manejar el cambio en el input de búsqueda
    const handleBusquedaChange = (e) => {
        const valor = e.target.value;
        setBusquedaAlumno(valor);
        if (valor.trim().length >= 3) {
            const sugeridos = alumnos.filter((a) =>
                a.nombre.toLowerCase().includes(valor.toLowerCase())
            );
            setSugerencias(sugeridos);
        } else {
            setSugerencias([]);
        }
    };

    const seleccionarAlumno = (alumno) => {
        setBusquedaAlumno(alumno.nombre);
        setAlumnoSeleccionado(alumno);
        setSugerencias([]);
    };

    useEffect(() => {
        if (alumnoSeleccionado && gestionSeleccionada) {
            obtenerNotas();
        }
    }, [alumnoSeleccionado, gestionSeleccionada]);

    const obtenerNotas = async () => {
        try {
            const id = parseInt(alumnoSeleccionado.id);
            const gestion = parseInt(gestionSeleccionada);
            const res = await obtenerNotaAlumnosGestionRequest(id, gestion);
            console.log('Datos originales:', res.data);

            const datosEstructurados = procesarDatosNotas(res.data);
            console.log('Datos estructurados:', datosEstructurados);
            setNotasData(datosEstructurados);
        } catch (error) {
            console.log(error);
        }
    };

    const fetchData = async () => {
        try {
            const [gestionesRes, usuariosRes] = await Promise.all([
                obtenerGestionRequest(),
                obtenerUsuarioRequest(),
            ]);

            setGestiones(gestionesRes.data);
            const alumnosFiltrados = usuariosRes.data.filter((usuario) => usuario.rol_nombre === 'Alumno');
            setAlumnos(alumnosFiltrados);
        } catch (error) {
            console.error('Error al obtener datos:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className='contenedor-principal'>
            <div className="contenedor-secundario">
                <div className="libreta-container">
                    <div className="libreta-header">
                        <h1>Libreta de Calificaciones</h1>

                        <div>
                            <h3>Seleccionar Gestión</h3>
                            <select
                                name="gestion"
                                className='form-select'
                                value={gestionSeleccionada}
                                onChange={(e) => setGestionSeleccionada(e.target.value)}
                                required
                            >
                                <option value="">Seleccionar la Gestión</option>
                                {gestiones.map((gestion) => (
                                    <option key={gestion.gestion} value={gestion.anio_escolar}>
                                        {gestion.anio_escolar}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="acomodar">
                            <h3>Buscar Alumno</h3>
                            <input
                                type="text"
                                className='form-control'
                                value={busquedaAlumno}
                                onChange={handleBusquedaChange}
                                placeholder="Ej: Juan Pérez"
                                autoComplete="off"
                                required
                                id="busqueda"
                            />
                            {busquedaAlumno.trim().length >= 3 && sugerencias.length > 0 && (
                                <ul className="sugerencias">
                                    {sugerencias.map((alumno) => (
                                        <li
                                            key={alumno.id}
                                            onClick={() => seleccionarAlumno(alumno)}
                                            className="sugerencia-item"
                                        >
                                            {alumno.nombre}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>

                    {alumnoSeleccionado && (
                        <div className="libreta-datos">
                            <div className="datos-alumno-card">
                                <div className="datos-alumno-header">
                                    <h2>Datos del Alumno</h2>
                                </div>
                                <div className="datos-alumno-body">
                                    <div className="alumno-info-item">
                                        <span className="alumno-info-label">Nombre Completo:</span>
                                        <span className="alumno-info-value">{alumnoSeleccionado.alumno?.nombre_usuario || alumnoSeleccionado.nombre}</span>
                                    </div>
                                    <div className="alumno-info-item">
                                        <span className="alumno-info-label">CI:</span>
                                        <span className="alumno-info-value">{alumnoSeleccionado.ci}</span>
                                    </div>
                                    <div className="alumno-info-item">
                                        <span className="alumno-info-label">Estado del Curso:</span>
                                        <span className={`estado-curso ${
                                            determinarAprobacion(notasData) === 'Aprobado' 
                                                ? 'estado-aprobado' 
                                                : determinarAprobacion(notasData) === 'Reprobado'
                                                    ? 'estado-reprobado'
                                                    : 'estado-sin-calificar'
                                        }`}>
                                            {determinarAprobacion(notasData)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="materias-card">
                                <div className="materias-header">
                                    <h2>Materias y Calificaciones</h2>
                                </div>
                                <div className="materias-body">
                                    <div className="tabla-calificaciones-wrapper">
                                        <table className="tabla-calificaciones">
                                            <thead>
                                                <tr>
                                                    <th>Materia</th>
                                                    <th>1er Trimestre</th>
                                                    <th>2do Trimestre</th>
                                                    <th>3er Trimestre</th>
                                                    <th>Nota Final</th>
                                                    <th>Estado</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {notasData.length > 0 ? (
                                                    notasData.map((materia) => {
                                                        const notaFinal = parseFloat(
                                                            calcularNotaFinal(
                                                                materia.trimestre1,
                                                                materia.trimestre2,
                                                                materia.trimestre3
                                                            )
                                                        );
                                                        const estado =
                                                            notaFinal >= 60
                                                                ? 'Aprobado'
                                                                : notaFinal > 0
                                                                    ? 'Reprobado'
                                                                    : 'Sin calificar';

                                                        return (
                                                            <tr key={materia.materia_id}>
                                                                <td><strong>{materia.nombre_materia}</strong></td>
                                                                <td className="nota-destacada">{materia.trimestre1 ? materia.trimestre1.toFixed(2) : '-'}</td>
                                                                <td className="nota-destacada">{materia.trimestre2 ? materia.trimestre2.toFixed(2) : '-'}</td>
                                                                <td className="nota-destacada">{materia.trimestre3 ? materia.trimestre3.toFixed(2) : '-'}</td>
                                                                <td className="nota-destacada">{notaFinal > 0 ? notaFinal.toFixed(2) : '-'}</td>
                                                                <td>
                                                                    <span
                                                                        className={
                                                                            estado === 'Aprobado'
                                                                                ? 'aprobado'
                                                                                : estado === 'Reprobado'
                                                                                    ? 'reprobado'
                                                                                    : 'sin-calificar'
                                                                        }
                                                                    >
                                                                        {estado}
                                                                    </span>
                                                                </td>
                                                            </tr>
                                                        );
                                                    })
                                                ) : (
                                                    <tr>
                                                        <td colSpan="6" className="mensaje-sin-datos">
                                                            {alumnoSeleccionado && gestionSeleccionada
                                                                ? 'No se encontraron calificaciones para este alumno en la gestión seleccionada.'
                                                                : 'Selecciona un alumno y una gestión para ver las calificaciones.'}
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default LibretaPage;