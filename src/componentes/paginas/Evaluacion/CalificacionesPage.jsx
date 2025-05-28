import React, { useState, useEffect, useMemo } from 'react';
import '../../css/CalificacionesPage.css';

const dimensiones = {
    SER: ['ACTIVIDAD 1', 'ACTIVIDAD 2', 'ACTIVIDAD 3', 'ACTIVIDAD 7', 'ACTIVIDAD 8', 'ACTIVIDAD 9', 'ACTIVIDAD 10', 'ACTIVIDAD 11', 'ACTIVIDAD 12', 'ACTIVIDAD 13'],
    SABER: ['TAREA 1', 'TAREA 2', 'TAREA 3', 'TAREA 7', 'TAREA 8', 'TAREA 9', 'TAREA 10', 'TAREA 11', 'TAREA 12'],
    HACER: ['ACTIVIDAD 4', 'ACTIVIDAD 5', 'ACTIVIDAD 6', 'ACTIVIDAD 14', 'ACTIVIDAD 15', 'ACTIVIDAD 16'],
    DECIDIR: ['TAREA 4', 'TAREA 5', 'TAREA 6', 'TAREA 13', 'TAREA 14', 'TAREA 15'],
};

const CalificacionesPage = () => {
    const [estudiantes, setEstudiantes] = useState([]);
    const [notas, setNotas] = useState({});


    const actividades = useMemo(() => Object.values(dimensiones).flat(), []);

    useEffect(() => {
        setEstudiantes(['JUAN', 'PEDRO', 'JUANITA', 'LAURA', 'MARTÍN', 'SOFÍA',
            'CARLOS', 'ANDREA', 'FABIÁN', 'MELISSA', 'ROBERTO', 'PATRICIA',
            'LUCAS', 'GABRIELA', 'DIEGO', 'PAOLA', 'RICARDO', 'KAREN',
            'FERNANDO', 'VALERIA', 'ANTONIO', 'NATALIA', 'CRISTIAN', 'LORENA',
            'JAVIER', 'VERÓNICA', 'ALEJANDRO', 'CAMILA', 'SEBASTIÁN', 'MAITE']);
        setNotas({
            JUAN: { 'ACTIVIDAD 1': 50, 'TAREA 1': 70, 'ACTIVIDAD 4': 85, 'TAREA 10': 77 },
            PEDRO: { 'ACTIVIDAD 1': 60, 'TAREA 1': 6, 'TAREA 3': 90, 'ACTIVIDAD 15': 55 },
            JUANITA: { 'TAREA 2': 88, 'ACTIVIDAD 5': 73, 'TAREA 13': 81 },
            LAURA: { 'ACTIVIDAD 2': 95, 'TAREA 4': 100, 'TAREA 15': 89 },
            MARTÍN: { 'ACTIVIDAD 6': 77, 'TAREA 6': 91, 'ACTIVIDAD 14': 80 },
            SOFÍA: { 'TAREA 5': 68, 'ACTIVIDAD 3': 89, 'TAREA 14': 84 },
            CARLOS: { 'TAREA 5': 68, 'ACTIVIDAD 3': 89, 'TAREA 14': 84 },
        });
    }, []);

    return (
        <div className="contenedor-principal">
            <div className='contenedor-secundario'>
                <h1>TRIMESTRE 1</h1>
                <div className="tabla-scroll">
                    <table className="tabla-calificaciones">
                        <thead>
                            <tr>
                                <th rowSpan={2} className="columna-alumnos">ALUMNOS</th>
                                {Object.entries(dimensiones).map(([dim, acts]) => (
                                    <th key={dim} colSpan={acts.length}>{dim}</th>
                                ))}
                            </tr>
                            <tr>
                                {actividades.map((actividad, i) => (
                                    <th key={i} className="encabezado-vertical">{actividad}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {estudiantes.map((alumno, i) => (
                                <tr key={i}>
                                    <td className="columna-alumnos">{alumno}</td>
                                    {actividades.map((actividad, j) => (
                                        <td key={j} className="celda-nota">{notas[alumno]?.[actividad] ?? ''}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <h1>TRIMESTRE 2</h1>
                <div className="tabla-scroll">
                    <table className="tabla-calificaciones">
                        <thead>
                            <tr>
                                <th rowSpan={2} className="columna-alumnos">ALUMNOS</th>
                                {Object.entries(dimensiones).map(([dim, acts]) => (
                                    <th key={dim} colSpan={acts.length}>{dim}</th>
                                ))}
                            </tr>
                            <tr>
                                {actividades.map((actividad, i) => (
                                    <th key={i} className="encabezado-vertical">{actividad}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {estudiantes.map((alumno, i) => (
                                <tr key={i}>
                                    <td className="columna-alumnos">{alumno}</td>
                                    {actividades.map((actividad, j) => (
                                        <td key={j} className="celda-nota">{notas[alumno]?.[actividad] ?? ''}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <h1>TRIMESTRE 3</h1>
                <div className="tabla-scroll">
                    <table className="tabla-calificaciones">
                        <thead>
                            <tr>
                                <th rowSpan={2} className="columna-alumnos">ALUMNOS</th>
                                {Object.entries(dimensiones).map(([dim, acts]) => (
                                    <th key={dim} colSpan={acts.length}>{dim}</th>
                                ))}
                            </tr>
                            <tr>
                                {actividades.map((actividad, i) => (
                                    <th key={i} className="encabezado-vertical">{actividad}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {estudiantes.map((alumno, i) => (
                                <tr key={i}>
                                    <td className="columna-alumnos">{alumno}</td>
                                    {actividades.map((actividad, j) => (
                                        <td key={j} className="celda-nota">{notas[alumno]?.[actividad] ?? ''}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default CalificacionesPage;
