import React, { useState } from 'react';

function ActividadesPage() {
    const [showModal, setShowModal] = useState(false);
    const [actividades, setActividades] = useState([]);
    const [form, setForm] = useState({
        tipo: '',
        descripcion: '',
        fechaInicio: '',
        fechaFin: '',
        horaInicio: '',
        horaFin: '',
        Curso: '',
        estado: ''
    });
    const [editIndex, setEditIndex] = useState(null);

    // Estados para los buscadores
    const [searchDescripcion, setSearchDescripcion] = useState('');
    const [searchFecha, setSearchFecha] = useState('');
    const [searchCurso, setSearchCurso] = useState('');
    const [searchEstado, setSearchEstado] = useState('');

    const handleOpenModal = () => setShowModal(true);
    const handleCloseModal = () => {
        setShowModal(false);
        setForm({
            tipo: '',
            descripcion: '',
            fechaInicio: '',
            fechaFin: '',
            horaInicio: '',
            horaFin: '',
            Curso: '',
            estado: ''
        });
        setEditIndex(null);
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editIndex !== null) {
            const nuevasActividades = [...actividades];
            nuevasActividades[editIndex] = form;
            setActividades(nuevasActividades);
        } else {
            setActividades([...actividades, form]);
        }
        handleCloseModal();
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
        const CursoMatch = act.Curso.toLowerCase().includes(searchCurso.toLowerCase());
        const estadoMatch = searchEstado === '' || act.estado === searchEstado;
        return descripcionMatch && fechaMatch && CursoMatch && estadoMatch;
    });
    const exportarPDF = () => {
        const doc = new jsPDF();
        doc.text('Reporte de Actividades', 14, 10);
        doc.autoTable({
            head: [['Tipo', 'Descripción', 'Fecha Inicio', 'Fecha Fin', 'Hora Inicio', 'Hora Fin', 'Curso', 'Estado']],
            body: actividadesFiltradas.map(act => [
                act.tipo, act.descripcion, act.fechaInicio, act.fechaFin, act.horaInicio, act.horaFin, act.Curso, act.estado
            ]),
        });
        doc.save('actividades.pdf');
    };

    // Exportar a Excel
    const exportarExcel = () => {
        const ws = XLSX.utils.json_to_sheet(actividadesFiltradas);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Actividades');
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
        saveAs(data, 'actividades.xlsx');
    };

    // Exportar a HTML
    const exportarHTML = () => {
        let html = `
            <html>
            <head><title>Reporte de Actividades</title></head>
            <body>
            <h2>Reporte de Actividades</h2>
            <table border="1" cellpadding="5" cellspacing="0">
                <thead>
                    <tr>
                        <th>Tipo</th>
                        <th>Descripción</th>
                        <th>Fecha Inicio</th>
                        <th>Fecha Fin</th>
                        <th>Hora Inicio</th>
                        <th>Hora Fin</th>
                        <th>Curso</th>
                        <th>Estado</th>
                    </tr>
                </thead>
                <tbody>
                    ${actividadesFiltradas.map(act => `
                        <tr>
                            <td>${act.tipo}</td>
                            <td>${act.descripcion}</td>
                            <td>${act.fechaInicio}</td>
                            <td>${act.fechaFin}</td>
                            <td>${act.horaInicio}</td>
                            <td>${act.horaFin}</td>
                            <td>${act.Curso}</td>
                            <td>${act.estado}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            </body>
            </html>
        `;
        const blob = new Blob([html], { type: 'text/html' });
        saveAs(blob, 'actividades.html');
    };
    return (
        <div className='contenedor-principal'>
            <div className='contenedor-secundario'>
                <h1>Actividades</h1>
                {/* Buscadores */}
                <div className="row my-3">
                    <div className="col-md-3 mb-2">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Buscar por descripción"
                            value={searchDescripcion}
                            onChange={e => setSearchDescripcion(e.target.value)}
                        />
                    </div>
                    <div className="col-md-3 mb-2">
                        <input
                            type="date"
                            className="form-control"
                            placeholder="Buscar por fecha"
                            value={searchFecha}
                            onChange={e => setSearchFecha(e.target.value)}
                        />
                    </div>
                    <div className="col-md-3 mb-2">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Buscar por Curso"
                            value={searchCurso}
                            onChange={e => setSearchCurso(e.target.value)}
                        />
                    </div>
                    <div className="col-md-3 mb-2">
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
                    <button className="btn btn-primary"
                        onClick={handleOpenModal}
                    >
                        <i className="bi bi-plus-circle-fill"></i>
                        Crear Actividad
                    </button>
                    <button className="btn btn-danger" onClick={exportarPDF}>
                        Exportar PDF
                    </button>
                    <button className="btn btn-success" onClick={exportarExcel}>
                        Exportar Excel
                    </button>
                    <button className="btn btn-info" onClick={exportarHTML}>
                        Exportar HTML
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
                                <th>Hora Inicio</th>
                                <th>Hora Fin</th>
                                <th>Curso</th>
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
                                    <td>{act.horaInicio}</td>
                                    <td>{act.horaFin}</td>
                                    <td>{act.Curso}</td>
                                    <td>{act.estado}</td>
                                    <td>
                                        <button className="btn btn-warning btn-sm me-2" onClick={() => handleEditar(actividades.indexOf(act))}>Editar</button>
                                        <button className="btn btn-danger btn-sm" onClick={() => handleEliminar(actividades.indexOf(act))}>Eliminar</button>
                                    </td>
                                </tr>
                            ))}
                            {actividadesFiltradas.length === 0 && (
                                <tr>
                                    <td colSpan="9" className="text-center">No hay actividades registradas.</td>
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
                                    <label className="form-label">Hora de Inicio</label>
                                    <input type="time" className="form-control" name="horaInicio" value={form.horaInicio} onChange={handleChange} required />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Hora de Fin</label>
                                    <input type="time" className="form-control" name="horaFin" value={form.horaFin} onChange={handleChange} required />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Curso + Paralelo</label>
                                    <select type="text" className="form-select" name="Curso" value={form.Curso} onChange={handleChange} required >
                                        <option value="">Seleccionar</option>
                                        <option value="Pendiente">Pendiente</option>
                                    </select>
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