import React, { useState } from 'react';

function GestionAlumno() {
    const [mostrarTabla, setMostrarTabla] = useState(false);
    const [alumnos, setAlumnos] = useState([
        { id: 1, nombre: 'Juan Pérez', ci: '12345678', matricula: 'MAT001', telefono: '78901234', fechaNacimiento: '2000-01-01', sexo: 'Masculino', especialidad: 'Informática', estado: 'Activo' },
        { id: 2, nombre: 'Ana López', ci: '87654321', matricula: 'MAT002', telefono: '71234567', fechaNacimiento: '2001-05-15', sexo: 'Femenino', especialidad: 'Electrónica', estado: 'Activo' }
    ]);
    const [formData, setFormData] = useState({
        id: null,
        nombre: '',
        ci: '',
        matricula: '',
        telefono: '',
        fechaNacimiento: '',
        sexo: '',
        especialidad: '',
        estado: ''
    });
    const [editando, setEditando] = useState(false);

    const handleListarClick = () => {
        setMostrarTabla(true);
        setEditando(false);
    };

    const handleEditar = (id) => {
        const alumno = alumnos.find(a => a.id === id);
        if (alumno) {
            setFormData(alumno);
            setMostrarTabla(false);
            setEditando(true);
        }
    };

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = () => {
        if (editando) {
            setAlumnos(alumnos.map(a => (a.id === formData.id ? formData : a)));
            setEditando(false);
        } else {
            const nuevoAlumno = {
                ...formData,
                id: alumnos.length + 1
            };
            setAlumnos([...alumnos, nuevoAlumno]);
        }
        setFormData({
            id: null,
            nombre: '',
            ci: '',
            matricula: '',
            telefono: '',
            fechaNacimiento: '',
            sexo: '',
            especialidad: '',
            estado: ''
        });
    };

    return (
        <div className='contenedor-principal'>
            <div className='contenedor-secundario'>
                <h1>Gestion Alumno</h1>
                <div className='contenedor-reportes' id='gestion'>
                    <div className="grupo-botones">
                        <button className="btn-reporte" onClick={() => {
                            setMostrarTabla(false);
                            setEditando(false);
                        }}>Registro</button>
                        <button className="btn-reporte" onClick={handleListarClick}>Listar</button>
                    </div>
                </div>

                {!mostrarTabla && (
                    <div className='contenedor-perfil'>
                        <div className="mb-3">
                            <label>Nombre:</label>
                            <input type="text" className="form-control" name="nombre" value={formData.nombre} onChange={handleChange} />
                        </div>
                        <div className="mb-3">
                            <label>CI:</label>
                            <input type="text" className="form-control" name="ci" value={formData.ci} onChange={handleChange} />
                        </div>
                        <div className="mb-3">
                            <label>Matricula:</label>
                            <input type="text" className="form-control" name="matricula" value={formData.matricula} onChange={handleChange} />
                        </div>
                        <div className="mb-3">
                            <label>Teléfono:</label>
                            <input type="tel" className="form-control" name="telefono" value={formData.telefono} onChange={handleChange} />
                        </div>
                        <div className="mb-3">
                            <label>Fecha Nacimiento:</label>
                            <input type="date" className="form-control" name="fechaNacimiento" value={formData.fechaNacimiento} onChange={handleChange} />
                        </div>
                        <div className="mb-3">
                            <label>Sexo:</label>
                            <input type="text" className="form-control" name="sexo" value={formData.sexo} onChange={handleChange} />
                        </div>
                        <div className="mb-3">
                            <label>Especialidad:</label>
                            <input type="text" className="form-control" name="especialidad" value={formData.especialidad} onChange={handleChange} />
                        </div>
                        <div className="mb-3">
                            <label>Estado:</label>
                            <input type="text" className="form-control" name="estado" value={formData.estado} onChange={handleChange} />
                        </div>

                        <div className='contenedor-button'>
                            <button type="button" className="btn btn-primary" onClick={handleSubmit}>
                                {editando ? 'Guardar Cambios' : 'Registrar Alumno'}
                            </button>
                        </div>
                    </div>
                )}

                {mostrarTabla && (
                    <div className='dimensionTable'>
                        <h1>Listado de Alumnos</h1>
                        <table className='table-striped'>
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>CI</th>
                                    <th>Matricula</th>
                                    <th>Teléfono</th>
                                    <th>Fecha Nacimiento</th>
                                    <th>Sexo</th>
                                    <th>Especialidad</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {alumnos.map(alumno => (
                                    <tr key={alumno.id}>
                                        <td>{alumno.nombre}</td>
                                        <td>{alumno.ci}</td>
                                        <td>{alumno.matricula}</td>
                                        <td>{alumno.telefono}</td>
                                        <td>{alumno.fechaNacimiento}</td>
                                        <td>{alumno.sexo}</td>
                                        <td>{alumno.especialidad}</td>
                                        <td>{alumno.estado}</td>
                                        <td>
                                            <button className="btn btn-warning" onClick={() => handleEditar(alumno.id)}>Editar</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default GestionAlumno;
