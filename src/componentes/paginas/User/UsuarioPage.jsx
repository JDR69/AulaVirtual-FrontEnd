import React, { useState, useEffect } from 'react';
import '../../css/Usuario.css';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { obtenerUsuarioRequest, crearNuevoUsuarioRequest } from '../../../api/auth';

const UsuarioPage = () => {
    const [showForm, setShowForm] = useState(false);
    const [usuario, setUsuario] = useState({
        id: '',
        ci: '',
        rol: '',
        nombre: '',
        estado: '',
        genero: '',
        fechaNacimiento: '',
        telefono: '',
        matricula: '',
        especialidad: '',
    });

    const [usuarios, setUsuarios] = useState([]);
    const [editIndex, setEditIndex] = useState(null);

    // Cargar usuarios del backend al montar el componente
    useEffect(() => {
        fetchUsuarios();
    }, []);

    const fetchUsuarios = async () => {
        try {
            const res = await obtenerUsuarioRequest();
            const data = Array.isArray(res.data) ? res.data : [res.data];
            const usuariosAdaptados = data.map(u => ({
                id: u.id,
                ci: u.ci,
                rol: u.rol_nombre,
                nombre: u.nombre,
                estado: u.estado ? 'Activo' : 'Inactivo',
                genero: u.sexo === 'M' ? 'Masculino' : (u.sexo === 'F' ? 'Femenino' : ''),
                fechaNacimiento: u.fecha_nacimiento || '',
                telefono: u.alumno?.telefono || '',
                matricula: u.alumno?.matricula || '',
                especialidad: u.profesor?.especialidad || '',
            }));
            setUsuarios(usuariosAdaptados);
        } catch (error) {
            console.error('Error al obtener usuarios:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUsuario({ ...usuario, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (editIndex !== null) {
            // Aquí iría la lógica para editar usuario si tienes endpoint
            const updatedUsuarios = [...usuarios];
            updatedUsuarios[editIndex] = usuario;
            setUsuarios(updatedUsuarios);
            setEditIndex(null);
        } else {
            // Crear usuario en backend
            try {
                // Adaptar datos para el backend
                const newUser = {
                    ci: usuario.ci,
                    nombre: usuario.nombre,
                    fecha_nacimiento: usuario.fechaNacimiento,
                    sexo: usuario.genero === 'Masculino' ? 'M' : usuario.genero === 'Femenino' ? 'F' : '',
                    estado: usuario.estado === 'Activo',
                    telefono: usuario.telefono,
                    rol_nombre: usuario.rol,
                    alumno: usuario.rol === 'Alumno' ? {
                        matricula: usuario.matricula
                    } : null,
                    profesor: usuario.rol === 'Profesor' ? {
                        especialidad: usuario.especialidad
                    } : null
                };
                await crearNuevoUsuarioRequest(newUser);
                await fetchUsuarios();
            } catch (error) {
                alert('Error al crear usuario');
            }
        }
        setUsuario({
            id: '',
            ci: '',
            rol: '',
            nombre: '',
            estado: '',
            genero: '',
            fechaNacimiento: '',
            telefono: '',
            matricula: '',
            especialidad: '',
        });
        setShowForm(false);
    };

    const handleEditar = (index) => {
        setUsuario(usuarios[index]);
        setEditIndex(index);
        setShowForm(true);
    };

    const handleEliminar = (index) => {
        const updatedUsuarios = [...usuarios];
        updatedUsuarios.splice(index, 1);
        setUsuarios(updatedUsuarios);
    };
    const [filtroTexto, setFiltroTexto] = useState('');
    const [filtroRol, setFiltroRol] = useState('');
    const [filtroEstado, setFiltroEstado] = useState('');

    const usuariosFiltrados = usuarios.filter((u) => {
        const matchTexto = u.ci.toLowerCase().includes(filtroTexto.toLowerCase()) ||
            u.nombre.toLowerCase().includes(filtroTexto.toLowerCase());
        const matchRol = filtroRol === '' || u.rol === filtroRol;
        const matchEstado = filtroEstado === '' || u.estado === filtroEstado;
        return matchTexto && matchRol && matchEstado;
    });

    const generarPDF = () => {
        const doc = new jsPDF();
        doc.text('Reporte de Usuarios', 10, 10);
        autoTable(doc, {
            startY: 20,
            head: [['ID', 'CI', 'Rol', 'Nombre', 'Teléfono', 'Matrícula', 'Especialidad', 'Estado', 'Género', 'Fecha de Nacimiento']],
            body: usuarios.map(u => [
                u.id,
                u.ci,
                u.rol,
                u.nombre,
                u.telefono || '',
                u.rol === "Alumno" ? u.matricula : '',
                u.rol === "Profesor" ? u.especialidad : '',
                u.estado,
                u.genero,
                u.fechaNacimiento
            ]),
        });
        doc.save('reporte_usuarios.pdf');
    };

    const generarExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(usuarios);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Usuarios');
        XLSX.writeFile(workbook, 'reporte_usuarios.xlsx');
    };

    const generarHTML = () => {
        const ventana = window.open('', '_blank');
        ventana.document.write('<html><head><title>Reporte HTML</title></head><body>');
        ventana.document.write('<h1>Reporte de Usuarios</h1>');
        ventana.document.write('<table border="1"><tr><th>ID</th><th>CI</th><th>Rol</th><th>Nombre</th><th>Teléfono</th><th>Matrícula</th><th>Especialidad</th><th>Estado</th><th>Género</th><th>Fecha de Nacimiento</th></tr>');
        usuarios.forEach(u => {
            ventana.document.write(`<tr>
                <td>${u.id}</td>
                <td>${u.ci}</td>
                <td>${u.rol}</td>
                <td>${u.nombre}</td>
                <td>${u.telefono || ''}</td>
                <td>${u.rol === "Alumno" ? u.matricula : ''}</td>
                <td>${u.rol === "Profesor" ? u.especialidad : ''}</td>
                <td>${u.estado}</td>
                <td>${u.genero}</td>
                <td>${u.fechaNacimiento}</td>
            </tr>`);
        });
        ventana.document.write('</table></body></html>');
        ventana.document.close();
    };

    return (
        <div className='contenedor-principal'>
            <div className='contenedor-secundario'>
                <div className='contenedor-usuario'>
                    {!showForm && (
                        <>
                            <div id='titulo'>
                                <h1>Detalle de los Usuarios</h1>
                            </div>
                            <div className='filterReporte'>
                                <div id='buscadores'>
                                    <input
                                        className='form-control'
                                        type="text"
                                        placeholder='Buscar por CI o Nombre'
                                        value={filtroTexto}
                                        onChange={(e) => setFiltroTexto(e.target.value)}
                                    />
                                    <select
                                        value={filtroRol}
                                        onChange={(e) => setFiltroRol(e.target.value)}
                                        className='form-select'
                                    >
                                        <option value="">Filtrar por Rol</option>
                                        <option value="Alumno">Alumno</option>
                                        <option value="Profesor">Profesor</option>
                                    </select>
                                    <select
                                        className='form-select'
                                        value={filtroEstado}
                                        onChange={(e) => setFiltroEstado(e.target.value)}
                                    >
                                        <option value="">Filtrar por Estado</option>
                                        <option value="Activo">Activo</option>
                                        <option value="Inactivo">Inactivo</option>
                                    </select>
                                </div>
                                <div className="contenedor-reportes">
                                    <div className="grupo-botones">
                                        <button className="btn-reporte" onClick={generarPDF}>Reporte PDF</button>
                                        <button className="btn-reporte" onClick={generarExcel}>Reporte EXCEL</button>
                                        <button className="btn-reporte" onClick={generarHTML}>Reporte HTML</button>
                                    </div>
                                    <div className="grupo-botones">
                                        <button className="btn-nuevo" onClick={() => {
                                            setUsuario({
                                                id: '',
                                                ci: '',
                                                rol: '',
                                                nombre: '',
                                                estado: '',
                                                genero: '',
                                                fechaNacimiento: '',
                                                telefono: '',
                                                matricula: '',
                                                especialidad: '',
                                            });
                                            setEditIndex(null);
                                            setShowForm(true);
                                        }}>
                                            <i className="bi bi-person-fill-add"></i>  Nuevo
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className='dimensionTable'>
                                <table className='table-striped'>
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>CI</th>
                                            <th>Rol</th>
                                            <th>Nombre</th>
                                            <th>Teléfono</th>
                                            <th>Matrícula</th>
                                            <th>Especialidad</th>
                                            <th>Estado</th>
                                            <th>Género</th>
                                            <th>Fecha Nacimiento</th>
                                            <th>Acción</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {usuariosFiltrados.map((u, index) => (
                                            <tr key={u.id}>
                                                <td>{u.id}</td>
                                                <td>{u.ci}</td>
                                                <td>{u.rol}</td>
                                                <td>{u.nombre}</td>
                                                <td>{u.telefono || ''}</td>
                                                <td>{u.rol === "Alumno" ? u.matricula : ''}</td>
                                                <td>{u.rol === "Profesor" ? u.especialidad : ''}</td>
                                                <td>{u.estado}</td>
                                                <td>{u.genero}</td>
                                                <td>{u.fechaNacimiento}</td>
                                                <td>
                                                    <button className='btn btn-primary btn-sm' onClick={() => handleEditar(index)}>Editar</button>{' '}
                                                    <button className='btn btn-danger btn-sm' onClick={() => handleEliminar(index)}>Eliminar</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}

                    {showForm && (
                        <div className='form-gris'>
                            <form className='form-flotante' onSubmit={handleSubmit}>
                                <h1>{editIndex !== null ? 'Editar Usuario' : 'Registrar Usuario'}</h1>
                                <div className='contenedor-contenido'>
                                    <div className="mb-3">
                                        <label>CI:</label>
                                        <input className='form-control' name="ci" value={usuario.ci} onChange={handleChange} />
                                    </div>
                                    <div className="mb-3">
                                        <label>Rol:</label>
                                        <select
                                            className='form-select'
                                            name="rol"
                                            value={usuario.rol}
                                            onChange={handleChange}
                                        >
                                            <option value="">Seleccionar</option>
                                            <option value="Alumno">Alumno</option>
                                            <option value="Profesor">Profesor</option>
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label>Nombre:</label>
                                        <input className='form-control' name="nombre" value={usuario.nombre} onChange={handleChange} />
                                    </div>
                                    <div className="mb-3">
                                        <label>Teléfono:</label>
                                        <input className='form-control' name="telefono" value={usuario.telefono} onChange={handleChange} />
                                    </div>
                                    {usuario.rol === "Alumno" && (
                                        <div className="mb-3">
                                            <label>Matrícula:</label>
                                            <input className='form-control' name="matricula" value={usuario.matricula} onChange={handleChange} />
                                        </div>
                                    )}
                                    {usuario.rol === "Profesor" && (
                                        <div className="mb-3">
                                            <label>Especialidad:</label>
                                            <input className='form-control' name="especialidad" value={usuario.especialidad} onChange={handleChange} />
                                        </div>
                                    )}
                                    <div className="mb-3">
                                        <label>Estado:</label>
                                        <select name="estado" value={usuario.estado} onChange={handleChange} className='form-select'>
                                            <option value="">Seleccionar</option>
                                            <option value="Activo">Activo</option>
                                            <option value="Inactivo">Inactivo</option>
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label>Género:</label>
                                        <select name="genero" value={usuario.genero} onChange={handleChange} className='form-select'>
                                            <option value="">Seleccionar</option>
                                            <option value="Masculino">Masculino</option>
                                            <option value="Femenino">Femenino</option>
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label>Fecha de Nacimiento:</label>
                                        <input className='form-control' type="date" name="fechaNacimiento" value={usuario.fechaNacimiento} onChange={handleChange} />
                                    </div>

                                    <div className='contenedor-button'>
                                        <button type="submit" className='btn btn-success'>Guardar</button>
                                        <button type="button" className='btn btn-warning' onClick={() => setShowForm(false)}>Cancelar</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UsuarioPage;