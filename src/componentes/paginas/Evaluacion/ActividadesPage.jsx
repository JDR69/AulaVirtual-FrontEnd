import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext'; // Importar el contexto
import { crearNuevoTareaRequest } from '../../../api/auth'; // Importar la función para crear tareas

function ActividadesPage() {
    const { cursoSeleccionado, detalleCompleto } = useAuth(); // Obtener datos del contexto
    const [showModal, setShowModal] = useState(false);
    const [actividades, setActividades] = useState([]);
    const [form, setForm] = useState({
        tipo: '',
        descripcion: '',
        fechaInicio: '',
        fechaFin: '',
        estado: '',
        materia: '',
        curso: '',
        paralelo: ''
    });
    const [editIndex, setEditIndex] = useState(null);

    // Estados para los buscadores
    const [searchDescripcion, setSearchDescripcion] = useState('');
    const [searchFecha, setSearchFecha] = useState('');
    const [searchEstado, setSearchEstado] = useState('');

    // Obtener la gestión y actividad dinámicamente
    const obtenerGestionYActividad = () => {
        // Lógica para obtener la gestión y actividad del curso seleccionado
        const gestionActual = detalleCompleto?.gestion || 9; // Valor por defecto si no está definido
        const actividadActual = detalleCompleto?.actividad || null; // Obtener el ID de la actividad actual
        return { gestion: gestionActual, actividad: actividadActual };
    };

    // Cargar datos de materia, curso y paralelo al iniciar
    useEffect(() => {
        if (cursoSeleccionado) {
            setForm((prevForm) => ({
                ...prevForm,
                materia: cursoSeleccionado.materia,
                curso: cursoSeleccionado.curso,
                paralelo: cursoSeleccionado.paralelo
            }));
        } else {
            // Si no está en el contexto, intentar cargar desde localStorage
            const savedCurso = localStorage.getItem('cursoSeleccionado');
            if (savedCurso) {
                const parsedCurso = JSON.parse(savedCurso);
                setForm((prevForm) => ({
                    ...prevForm,
                    materia: parsedCurso.materia,
                    curso: parsedCurso.curso,
                    paralelo: parsedCurso.paralelo
                }));
            }
        }
    }, [cursoSeleccionado]);

    const handleOpenModal = () => setShowModal(true);
    const handleCloseModal = () => {
        setShowModal(false);
        setForm({
            tipo: '',
            descripcion: '',
            fechaInicio: '',
            fechaFin: '',
            estado: '',
            materia: cursoSeleccionado?.materia || '',
            curso: cursoSeleccionado?.curso || '',
            paralelo: cursoSeleccionado?.paralelo || ''
        });
        setEditIndex(null);
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Obtener gestión y actividad dinámicamente
        const { gestion, actividad } = obtenerGestionYActividad();

        if (!actividad) {
            alert("No se pudo determinar la actividad actual. Verifica los datos del curso.");
            return;
        }

        // Preparar los datos para el backend
        const tareaData = {
            id_cursoparalelo: cursoSeleccionado?.curso_paralelo, // Tomar del contexto
            gestion, // Gestión dinámica
            descripcion: form.descripcion,
            puntaje: 20, // Ajustar según sea necesario
            fecha_inicio: form.fechaInicio,
            fecha_entrega: form.fechaFin,
            estado: form.estado.toLowerCase(), // Convertir a minúsculas si es necesario
            actividad, // Actividad dinámica
            horario_materia: cursoSeleccionado?.materia, // Tomar del contexto
        };

        // Mostrar en consola los datos que se enviarán
        console.log("Datos enviados al backend:", tareaData);

        try {
            if (editIndex !== null) {
                // Actualizar actividad localmente
                const nuevasActividades = [...actividades];
                nuevasActividades[editIndex] = form;
                setActividades(nuevasActividades);
            } else {
                // Enviar nueva tarea al backend
                await crearNuevoTareaRequest(tareaData);
                setActividades([...actividades, form]); // Agregar la nueva actividad localmente
            }
            handleCloseModal();
        } catch (error) {
            console.error("Error al enviar los datos:", error);
            alert("Ocurrió un error al guardar la tarea. Inténtalo nuevamente.");
        }
    };

    const handleEditar = (index) => {
        setForm(actividades[index]);
        setEditIndex(index);
        setShowModal(true);
    };

    const handleEliminar = (index) => {
        const nuevasActividades = actividades.filter((_, i) => i !== index);
        setActividades(nuevasActividades);
    };

    // Filtrado de actividades según los buscadores
    const actividadesFiltradas = actividades.filter((act) => {
        const descripcionMatch = act.descripcion.toLowerCase().includes(searchDescripcion.toLowerCase());
        const fechaMatch = searchFecha === '' || act.fechaInicio === searchFecha || act.fechaFin === searchFecha;
        const estadoMatch = searchEstado === '' || act.estado === searchEstado;
        return descripcionMatch && fechaMatch && estadoMatch;
    });

    return (
        <div className='contenedor-principal'>
            <div className='contenedor-secundario'>
                <h1>Actividades</h1>
                {/* Buscadores */}
                <div className="row my-3">
                    <div className="col-md-4 mb-2">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Buscar por descripción"
                            value={searchDescripcion}
                            onChange={e => setSearchDescripcion(e.target.value)}
                        />
                    </div>
                    <div className="col-md-4 mb-2">
                        <input
                            type="date"
                            className="form-control"
                            placeholder="Buscar por fecha"
                            value={searchFecha}
                            onChange={e => setSearchFecha(e.target.value)}
                        />
                    </div>
                    <div className="col-md-4 mb-2">
                        <select
                            className="form-select"
                            value={searchEstado}
                            onChange={e => setSearchEstado(e.target.value)}
                        >
                            <option value="">Todos los estados</option>
                            <option value="Pendiente">Pendiente</option>
                            <option value="Entregado">Entregado</option>
                            <option value="Calificado">Calificado</option>
                        </select>
                    </div>
                </div>
                <div className='contenedor-buttones'>
                    <button className="btn btn-primary" onClick={handleOpenModal}>
                        <i className="bi bi-plus-circle-fill"></i> Crear Actividad
                    </button>
                    <button className="btn btn-secondary ms-2">
                        <i className="bi bi-file-earmark-text"></i> Generar Reporte
                    </button>
                </div>

                {/* Tabla de actividades */}
                <div className="table-responsive mt-4">
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>Tipo</th>
                                <th>Descripción</th>
                                <th>Fecha Inicio</th>
                                <th>Fecha Fin</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {actividadesFiltradas.map((act, idx) => (
                                <tr key={idx}>
                                    <td>{act.tipo}</td>
                                    <td>{act.descripcion}</td>
                                    <td>{act.fechaInicio}</td>
                                    <td>{act.fechaFin}</td>
                                    <td>{act.estado}</td>
                                    <td>
                                        <button className="btn btn-warning btn-sm me-2" onClick={() => handleEditar(actividades.indexOf(act))}>Editar</button>
                                        <button className="btn btn-danger btn-sm" onClick={() => handleEliminar(actividades.indexOf(act))}>Eliminar</button>
                                    </td>
                                </tr>
                            ))}
                            {actividadesFiltradas.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="text-center">No hay actividades registradas.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            {/* Modal */}
            {showModal && (
                <div className='form-gris'>
                    <div className="form-flotante">
                        <div className="modal-header">
                            <h5 className="modal-title">{editIndex !== null ? 'Editar Actividad' : 'Nueva Actividad'}</h5>
                            <button type="button" className="btn-close" onClick={handleCloseModal}></button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label">Tipo de Actividad</label>
                                    <select className="form-select" name="tipo" value={form.tipo} onChange={handleChange} required>
                                        <option value="">Seleccionar</option>
                                        <option value="Examen">Examen</option>
                                        <option value="Tarea">Tarea</option>
                                        <option value="Proyecto">Proyecto</option>
                                        <option value="Otro">Otro</option>
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Descripción</label>
                                    <input type="text" className="form-control" name="descripcion" value={form.descripcion} onChange={handleChange} required />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Fecha de Inicio</label>
                                    <input type="date" className="form-control" name="fechaInicio" value={form.fechaInicio} onChange={handleChange} required />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Fecha de Fin</label>
                                    <input type="date" className="form-control" name="fechaFin" value={form.fechaFin} onChange={handleChange} required />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Estado</label>
                                    <select className="form-select" name="estado" value={form.estado} onChange={handleChange} required>
                                        <option value="">Seleccionar</option>
                                        <option value="Pendiente">Pendiente</option>
                                        <option value="Entregado">Entregado</option>
                                        <option value="Calificado">Calificado</option>
                                    </select>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-danger" onClick={handleCloseModal}>
                                        Cancelar
                                    </button>
                                    <button type="submit" className="btn btn-success">
                                        {editIndex !== null ? 'Guardar Cambios' : 'Guardar Actividad'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ActividadesPage;