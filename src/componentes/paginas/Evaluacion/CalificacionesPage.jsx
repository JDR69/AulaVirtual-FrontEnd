import React, { useState, useEffect } from 'react'
import '../../css/CalificacionesPage.css'

function CalificacionesPage() {
    const [estudiantes, setEstudiantes] = useState([]);
    const [estudianteSeleccionado, setEstudianteSeleccionado] = useState('');
    const [tareas, setTareas] = useState([]);
    const [cargando, setCargando] = useState(false);
    const [notasModificadas, setNotasModificadas] = useState({});
    const [guardando, setGuardando] = useState(false);
    const [mensaje, setMensaje] = useState('');
    
    // Nuevos estados para el buscador
    const [busqueda, setBusqueda] = useState('');
    const [resultadosBusqueda, setResultadosBusqueda] = useState([]);
    const [mostrarResultados, setMostrarResultados] = useState(false);

    // Simulación de datos (reemplazar con llamadas a API reales)
    useEffect(() => {
        // Simulación de carga de estudiantes
        setEstudiantes([
            { id: '1', nombre: 'Juan Pérez' },
            { id: '2', nombre: 'María García' },
            { id: '3', nombre: 'Carlos López' },
            { id: '4', nombre: 'Ana Martínez' },
            { id: '5', nombre: 'Roberto Jiménez' },
            { id: '6', nombre: 'Laura Sánchez' },
        ]);
    }, []);

    // Cargar tareas cuando se seleccione un estudiante
    useEffect(() => {
        if (estudianteSeleccionado) {
            setCargando(true);
            setNotasModificadas({});
            // Simulación de llamada a API para obtener tareas del estudiante seleccionado
            setTimeout(() => {
                setTareas([
                    {
                        id: '1',
                        tipo: 'Tarea',
                        descripcion: 'Investigación sobre bases de datos',
                        fechaEntrega: '2025-06-10',
                        puntaje: '85/100'
                    },
                    {
                        id: '2',
                        tipo: 'Examen',
                        descripcion: 'Evaluación parcial',
                        fechaEntrega: '2025-05-20',
                        puntaje: '90/100'
                    },
                    {
                        id: '3',
                        tipo: 'Proyecto',
                        descripcion: 'Desarrollo de aplicación web',
                        fechaEntrega: '2025-07-01',
                        puntaje: '95/100'
                    }
                ]);
                setCargando(false);
            }, 500);
        } else {
            setTareas([]);
        }
    }, [estudianteSeleccionado]);

    // Función para manejar la búsqueda
    const handleBusquedaChange = (e) => {
        const valor = e.target.value;
        setBusqueda(valor);
        
        if (valor.trim() === '') {
            setResultadosBusqueda([]);
            setMostrarResultados(false);
            return;
        }
        
        // Filtrar estudiantes que coincidan con la búsqueda
        const resultados = estudiantes.filter(estudiante => 
            estudiante.nombre.toLowerCase().includes(valor.toLowerCase())
        );
        
        setResultadosBusqueda(resultados);
        setMostrarResultados(true);
    };

    // Seleccionar un estudiante del resultado de búsqueda
    const seleccionarEstudiante = (estudiante) => {
        setEstudianteSeleccionado(estudiante.id);
        setBusqueda(estudiante.nombre);
        setMostrarResultados(false);
        setMensaje('');
    };

    // Enfocar en el campo de búsqueda
    const mostrarBusqueda = () => {
        setMostrarResultados(true);
    };

    // Cerrar resultados cuando se hace clic fuera del área de búsqueda
    const cerrarResultados = () => {
        // Usar un pequeño retraso para permitir que el clic en un resultado funcione
        setTimeout(() => {
            setMostrarResultados(false);
        }, 200);
    };

    const handleNotaChange = (tareaId, valor) => {
        // Validar que el valor esté entre 0 y 100
        const numericValue = parseInt(valor, 10);
        if (isNaN(numericValue) || numericValue < 0 || numericValue > 100) {
            return;
        }
        
        setNotasModificadas({
            ...notasModificadas,
            [tareaId]: valor
        });
    }

    const guardarCalificacion = (tareaId) => {
        if (!notasModificadas[tareaId]) {
            setMensaje('Debe ingresar una calificación');
            return;
        }

        setGuardando(true);
        // Aquí iría la llamada a la API para guardar la calificación
        setTimeout(() => {
            // Actualizar la tarea con la nueva calificación
            const nuevasTareas = tareas.map(tarea => {
                if (tarea.id === tareaId) {
                    return {
                        ...tarea,
                        puntaje: `${notasModificadas[tareaId]}/100`
                    };
                }
                return tarea;
            });
            
            setTareas(nuevasTareas);
            setGuardando(false);
            setMensaje('Calificación guardada correctamente');
            
            // Limpiar la nota modificada
            const nuevasNotasModificadas = { ...notasModificadas };
            delete nuevasNotasModificadas[tareaId];
            setNotasModificadas(nuevasNotasModificadas);
            
            // Limpiar el mensaje después de 3 segundos
            setTimeout(() => {
                setMensaje('');
            }, 3000);
        }, 1000);
    }

    // Limpiar la búsqueda y el estudiante seleccionado
    const limpiarBusqueda = () => {
        setBusqueda('');
        setEstudianteSeleccionado('');
        setResultadosBusqueda([]);
        setMostrarResultados(false);
    };

    return (
        <div className='contenedor-principal'>
            <div className='contenedor-secundario'>
                <h1>Calificaciones</h1>
                <div className='contenedor-contenido'>
                    <div className='contenedor-buscador'>
                         <div className="buscador-wrapper">
                            <div className="input-group">
                                <input 
                                    type="text"
                                    id="busqueda-estudiante"
                                    className="form-control"
                                    placeholder="Ingrese nombre del estudiante"
                                    value={busqueda}
                                    onChange={handleBusquedaChange}
                                    onFocus={mostrarBusqueda}
                                    onBlur={cerrarResultados}
                                />
                                {busqueda && (
                                    <button 
                                        className="btn btn-outline-secondary" 
                                        type="button"
                                        onClick={limpiarBusqueda}
                                    >
                                        <i className="bi bi-x"></i>
                                    </button>
                                )}
                            </div>
                            
                            {mostrarResultados && resultadosBusqueda.length > 0 && (
                                <div className="resultados-busqueda">
                                    {resultadosBusqueda.map(estudiante => (
                                        <div 
                                            key={estudiante.id} 
                                            className="resultado-item"
                                            onClick={() => seleccionarEstudiante(estudiante)}
                                        >
                                            {estudiante.nombre}
                                        </div>
                                    ))}
                                </div>
                            )}
                            
                            {mostrarResultados && busqueda && resultadosBusqueda.length === 0 && (
                                <div className="resultados-busqueda">
                                    <div className="resultado-item no-resultados">
                                        No se encontraron estudiantes
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {mensaje && (
                        <div className={mensaje.includes('correctamente') ? 'mensaje-exito' : 'mensaje-error'}>
                            {mensaje}
                        </div>
                    )}

                    {cargando ? (
                        <p>Cargando tareas...</p>
                    ) : (
                        <>
                            {estudianteSeleccionado && (
                                <>
                                    {tareas.length > 0 ? (
                                        <div className='dimensionTable'>
                                             <h2>Tareas y Evaluaciones</h2>
                                            <table className='table-striped'>
                                                <thead>
                                                    <tr>
                                                        <th>Tipo</th>
                                                        <th>Descripción</th>
                                                        <th>Fecha Entrega</th>
                                                        <th>Puntaje Actual</th>
                                                        <th>Nueva Calificación</th>
                                                        <th>Acción</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {tareas.map(tarea => (
                                                        <tr key={tarea.id}>
                                                            <td>{tarea.tipo}</td>
                                                            <td>{tarea.descripcion}</td>
                                                            <td>{new Date(tarea.fechaEntrega).toLocaleDateString()}</td>
                                                            <td>{tarea.puntaje}</td>
                                                            <td>
                                                                <input 
                                                                    type="number" 
                                                                    min="0"
                                                                    max="100"
                                                                    className="form-control nota-input"
                                                                    value={notasModificadas[tarea.id] || ''}
                                                                    onChange={(e) => handleNotaChange(tarea.id, e.target.value)}
                                                                    placeholder="0-100"
                                                                />
                                                                /100
                                                            </td>
                                                            <td>
                                                                <button 
                                                                    className="btn btn-primary"
                                                                    onClick={() => guardarCalificacion(tarea.id)}
                                                                    disabled={!notasModificadas[tarea.id] || guardando}
                                                                >
                                                                    {guardando ? 'Guardando...' : 'Guardar Calificación'}
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : (
                                        <p>No hay tareas disponibles para este estudiante.</p>
                                    )}
                                </>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

export default CalificacionesPage