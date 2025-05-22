import React, { useState } from 'react';

function ParticipacionPage() {
    const [alumnos, setAlumnos] = useState([
        {
            id: 1,
            nombre: 'Juan Pérez',
            descripcion: 'Participante activo en clase',
            fecha: '2025-05-10',
            curso: 'Matemáticas'
        },
        {
            id: 2,
            nombre: 'Ana López',
            descripcion: 'Entrega tareas puntualmente',
            fecha: '2025-05-12',
            curso: 'Lenguaje'
        },
        {
            id: 3,
            nombre: 'Carlos Ruiz',
            descripcion: 'Participa en debates',
            fecha: '2025-05-15',
            curso: 'Historia'
        }
    ]);

    // Estados para los inputs
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [fecha, setFecha] = useState('');
    const [curso, setCurso] = useState('');

    const agregarAlumno = (e) => {
        e.preventDefault();
        if (!nombre || !descripcion || !fecha || !curso) return;
        const nuevoAlumno = {
            id: Date.now(),
            nombre,
            descripcion,
            fecha,
            curso
        };
        setAlumnos([...alumnos, nuevoAlumno]);
        setNombre('');
        setDescripcion('');
        setFecha('');
        setCurso('');
    };

    const eliminarAlumno = (id) => {
        setAlumnos(alumnos.filter(a => a.id !== id));
    };

    return (
        <div className='contenedor-principal'>
            <div className='contenedor-secundario'>
                <h1 className='titulo'>Participación</h1>
                 <div className='contenedor-contenido'>
                    <div>
                        <input
                            className="form-control"
                            type="text"
                            placeholder="Nombre"
                            value={nombre}
                            onChange={e => setNombre(e.target.value)}
                            required
                        />
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
                            onChange={e => setFecha(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <input
                            className="form-control"
                            type="text"
                            placeholder="Curso"
                            value={curso}
                            onChange={e => setCurso(e.target.value)}
                            required
                        />
                    </div>
                    <div className=''>
                        <button className="btn btn-primary"
                            onClick={agregarAlumno}>
                            <i className="bi bi-plus-circle-fill"></i>
                            Agregar
                        </button>
                    </div>
                </div>
                <div className='dimensionTable'>
                    <table className='table-striped'>
                        <thead>
                            <tr>
                                <th>Alumno</th>
                                <th>Descripción</th>
                                <th>Fecha</th>
                                <th>Curso</th>
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
                                    <td>
                                        <button className="btn btn-danger" onClick={() => eliminarAlumno(alumno.id)}>Eliminar</button>
                                    </td>
                                </tr>
                            ))}
                            {alumnos.length === 0 && (
                                <tr>
                                    <td colSpan="5">No hay alumnos registrados.</td>
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