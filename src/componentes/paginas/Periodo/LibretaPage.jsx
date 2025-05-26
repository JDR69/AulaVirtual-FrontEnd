import React, { useState } from 'react';
import '../../css/Libreta.css'; // Importar el nuevo archivo CSS

function LibretaPage() {
    // Datos simulados de alumnos
    const alumnos = [
        {
            id: 1,
            nombre: 'Juan Pérez',
            curso: 'Matemáticas Avanzadas',
            materias: [
                { nombre: 'Matemáticas', trimestres: [85, 90, 80] },
                { nombre: 'Historia', trimestres: [70, 75, 65] },
                { nombre: 'Ciencias', trimestres: [50, 55, 60] },
                { nombre: 'Inglés', trimestres: [90, 85, 95] },
            ],
        },
        {
            id: 2,
            nombre: 'María López',
            curso: 'Historia del Arte',
            materias: [
                { nombre: 'Arte', trimestres: [95, 90, 85] },
                { nombre: 'Historia', trimestres: [88, 85, 80] },
                { nombre: 'Filosofía', trimestres: [76, 70, 75] },
                { nombre: 'Inglés', trimestres: [85, 80, 90] },
            ],
        },
    ];

    // Estado para el alumno seleccionado
    const [alumnoSeleccionado, setAlumnoSeleccionado] = useState(null);

    // Función para calcular la nota final (promedio de los trimestres)
    const calcularNotaFinal = (trimestres) => {
        const suma = trimestres.reduce((acc, nota) => acc + nota, 0);
        return (suma / trimestres.length).toFixed(2); // Promedio con 2 decimales
    };

    // Función para determinar si aprobó o no
    const determinarAprobacion = (materias) => {
        const promedio = materias.reduce((acc, materia) => acc + parseFloat(calcularNotaFinal(materia.trimestres)), 0) / materias.length;
        return promedio >= 60 ? 'Aprobado' : 'Reprobado';
    };

    // Manejar la selección del alumno
    const manejarBusqueda = (e) => {
        const idAlumno = parseInt(e.target.value, 10);
        const alumno = alumnos.find((a) => a.id === idAlumno);
        setAlumnoSeleccionado(alumno || null);
    };

    return (
        <div className="libreta-container">
            <div className="libreta-header">
                <h1>Libreta de Calificaciones</h1>
                <h3>Buscar Alumno</h3>
                <select onChange={manejarBusqueda} defaultValue="" className="form-select">
                    <option value="" disabled>Seleccione un alumno</option>
                    {alumnos.map((alumno) => (
                        <option key={alumno.id} value={alumno.id}>
                            {alumno.nombre}
                        </option>
                    ))}
                </select>
            </div>

            {alumnoSeleccionado && (
                <div className="libreta-datos">
                    <div className="card">
                        <div className="card-header">
                            <h2>Datos del Alumno</h2>
                        </div>
                        <div className="card-body">
                            <form className="datos-alumno-form">
                                <div className="form-row">
                                    <div className="input-group">
                                        <label>Nombre Completo:</label>
                                        <input
                                            type="text"
                                            value={alumnoSeleccionado.nombre}
                                            readOnly
                                            className="form-control"
                                        />
                                    </div>
                                    <div className="input-group">
                                        <label>Curso:</label>
                                        <input
                                            type="text"
                                            value={alumnoSeleccionado.curso}
                                            readOnly
                                            className="form-control"
                                        />
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="input-group">
                                        <label>Estado del Curso:</label>
                                        <input
                                            type="text"
                                            value={determinarAprobacion(alumnoSeleccionado.materias)}
                                            readOnly
                                            className="form-control"
                                        />
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>

                    <div className="card">
                        <div className="card-header">
                            <h2>Materias y Calificaciones</h2>
                        </div>
                        <div className="card-body">
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
                                    {alumnoSeleccionado.materias.map((materia, index) => {
                                        const notaFinal = calcularNotaFinal(materia.trimestres);
                                        return (
                                            <tr key={index}>
                                                <td>{materia.nombre}</td>
                                                <td>{materia.trimestres[0]}</td>
                                                <td>{materia.trimestres[1]}</td>
                                                <td>{materia.trimestres[2]}</td>
                                                <td>{notaFinal}</td>
                                                <td>{notaFinal >= 60 ? 'Aprobado' : 'Reprobado'}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default LibretaPage;