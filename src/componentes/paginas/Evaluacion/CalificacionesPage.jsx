import React, { useState, useEffect, useMemo } from 'react';
import { obtenerDimensionAsignadasRequest } from '../../../api/auth';
import '../../css/CalificacionesPage.css';

const dimensiones = {
    SER: ['ACTIVIDAD 1', 'ACTIVIDAD 2', 'ACTIVIDAD 3', 'ACTIVIDAD 7', 'ACTIVIDAD 8', 'ACTIVIDAD 9', 'ACTIVIDAD 10', 'ACTIVIDAD 11', 'ACTIVIDAD 12', 'ACTIVIDAD 13'],
    SABER: ['TAREA 1', 'TAREA 2', 'TAREA 3', 'TAREA 7', 'TAREA 8', 'TAREA 9', 'TAREA 10', 'TAREA 11', 'TAREA 12'],
    HACER: ['ACTIVIDAD 4', 'ACTIVIDAD 5', 'ACTIVIDAD 6', 'ACTIVIDAD 14', 'ACTIVIDAD 15', 'ACTIVIDAD 16'],
    DECIDIR: ['TAREA 4', 'TAREA 5', 'TAREA 6', 'TAREA 13', 'TAREA 14', 'TAREA 15'],
};





// JSON fijo que viene del backend (recortado por espacio, usa el completo que tienes)
const tareasPorAlumno = [
    {
        "alumno_id": 13,
        "nombre": "Pedrito",
        "tareas": [
            {
                "id": 1,
                "descripcion": "america colon",
                "puntaje": 0,
                "fecha_inicio": "2025-05-27",
                "fecha_entrega": "2025-05-28",
                "estado": true,
                "actividad": {
                    "id": 2,
                    "nombre": "Exposiciones",
                    "estado": true,
                    "dimensiones": [
                        {
                            "id": 1,
                            "descripcion": "Hacer",
                            "puntaje": 10
                        }
                    ]
                }
            },
            {
                "id": 13,
                "descripcion": "2",
                "puntaje": 0,
                "fecha_inicio": "2025-05-08",
                "fecha_entrega": "2025-05-20",
                "estado": true,
                "actividad": {
                    "id": 1,
                    "nombre": "OTRO",
                    "estado": true,
                    "dimensiones": [
                        {
                            "id": 1,
                            "descripcion": "Hacer",
                            "puntaje": 10
                        }
                    ]
                }
            },
            {
                "id": 25,
                "descripcion": "2",
                "puntaje": 0,
                "fecha_inicio": "2025-05-20",
                "fecha_entrega": "2025-05-28",
                "estado": true,
                "actividad": {
                    "id": 1,
                    "nombre": "OTRO",
                    "estado": true,
                    "dimensiones": [
                        {
                            "id": 1,
                            "descripcion": "Hacer",
                            "puntaje": 10
                        }
                    ]
                }
            }
        ]
    },
    {
        "alumno_id": 14,
        "nombre": "camavinga",
        "tareas": [
            {
                "id": 2,
                "descripcion": "america colon",
                "puntaje": 0,
                "fecha_inicio": "2025-05-27",
                "fecha_entrega": "2025-05-28",
                "estado": true,
                "actividad": {
                    "id": 2,
                    "nombre": "Exposiciones",
                    "estado": true,
                    "dimensiones": [
                        {
                            "id": 1,
                            "descripcion": "Hacer",
                            "puntaje": 10
                        }
                    ]
                }
            },
            {
                "id": 14,
                "descripcion": "2",
                "puntaje": 0,
                "fecha_inicio": "2025-05-08",
                "fecha_entrega": "2025-05-20",
                "estado": true,
                "actividad": {
                    "id": 1,
                    "nombre": "OTRO",
                    "estado": true,
                    "dimensiones": [
                        {
                            "id": 1,
                            "descripcion": "Hacer",
                            "puntaje": 10
                        }
                    ]
                }
            },
            {
                "id": 26,
                "descripcion": "2",
                "puntaje": 0,
                "fecha_inicio": "2025-05-20",
                "fecha_entrega": "2025-05-28",
                "estado": true,
                "actividad": {
                    "id": 1,
                    "nombre": "OTRO",
                    "estado": true,
                    "dimensiones": [
                        {
                            "id": 1,
                            "descripcion": "Hacer",
                            "puntaje": 10
                        }
                    ]
                }
            }
        ]
    },
    {
        "alumno_id": 15,
        "nombre": "Juanita",
        "tareas": [
            {
                "id": 3,
                "descripcion": "america colon",
                "puntaje": 0,
                "fecha_inicio": "2025-05-27",
                "fecha_entrega": "2025-05-28",
                "estado": true,
                "actividad": {
                    "id": 2,
                    "nombre": "Exposiciones",
                    "estado": true,
                    "dimensiones": [
                        {
                            "id": 1,
                            "descripcion": "Hacer",
                            "puntaje": 10
                        }
                    ]
                }
            },
            {
                "id": 15,
                "descripcion": "2",
                "puntaje": 0,
                "fecha_inicio": "2025-05-08",
                "fecha_entrega": "2025-05-20",
                "estado": true,
                "actividad": {
                    "id": 1,
                    "nombre": "OTRO",
                    "estado": true,
                    "dimensiones": [
                        {
                            "id": 1,
                            "descripcion": "Hacer",
                            "puntaje": 10
                        }
                    ]
                }
            },
            {
                "id": 27,
                "descripcion": "2",
                "puntaje": 0,
                "fecha_inicio": "2025-05-20",
                "fecha_entrega": "2025-05-28",
                "estado": true,
                "actividad": {
                    "id": 1,
                    "nombre": "OTRO",
                    "estado": true,
                    "dimensiones": [
                        {
                            "id": 1,
                            "descripcion": "Hacer",
                            "puntaje": 10
                        }
                    ]
                }
            }
        ]
    },
    {
        "alumno_id": 16,
        "nombre": "Ancelotti",
        "tareas": [
            {
                "id": 4,
                "descripcion": "america colon",
                "puntaje": 0,
                "fecha_inicio": "2025-05-27",
                "fecha_entrega": "2025-05-28",
                "estado": true,
                "actividad": {
                    "id": 2,
                    "nombre": "Exposiciones",
                    "estado": true,
                    "dimensiones": [
                        {
                            "id": 1,
                            "descripcion": "Hacer",
                            "puntaje": 10
                        }
                    ]
                }
            },
            {
                "id": 16,
                "descripcion": "2",
                "puntaje": 0,
                "fecha_inicio": "2025-05-08",
                "fecha_entrega": "2025-05-20",
                "estado": true,
                "actividad": {
                    "id": 1,
                    "nombre": "OTRO",
                    "estado": true,
                    "dimensiones": [
                        {
                            "id": 1,
                            "descripcion": "Hacer",
                            "puntaje": 10
                        }
                    ]
                }
            },
            {
                "id": 28,
                "descripcion": "2",
                "puntaje": 0,
                "fecha_inicio": "2025-05-20",
                "fecha_entrega": "2025-05-28",
                "estado": true,
                "actividad": {
                    "id": 1,
                    "nombre": "OTRO",
                    "estado": true,
                    "dimensiones": [
                        {
                            "id": 1,
                            "descripcion": "Hacer",
                            "puntaje": 10
                        }
                    ]
                }
            }
        ]
    },
    {
        "alumno_id": 17,
        "nombre": "Sofia",
        "tareas": [
            {
                "id": 5,
                "descripcion": "america colon",
                "puntaje": 0,
                "fecha_inicio": "2025-05-27",
                "fecha_entrega": "2025-05-28",
                "estado": true,
                "actividad": {
                    "id": 2,
                    "nombre": "Exposiciones",
                    "estado": true,
                    "dimensiones": [
                        {
                            "id": 1,
                            "descripcion": "Hacer",
                            "puntaje": 10
                        }
                    ]
                }
            },
            {
                "id": 17,
                "descripcion": "2",
                "puntaje": 0,
                "fecha_inicio": "2025-05-08",
                "fecha_entrega": "2025-05-20",
                "estado": true,
                "actividad": {
                    "id": 1,
                    "nombre": "OTRO",
                    "estado": true,
                    "dimensiones": [
                        {
                            "id": 1,
                            "descripcion": "Hacer",
                            "puntaje": 10
                        }
                    ]
                }
            },
            {
                "id": 29,
                "descripcion": "2",
                "puntaje": 0,
                "fecha_inicio": "2025-05-20",
                "fecha_entrega": "2025-05-28",
                "estado": true,
                "actividad": {
                    "id": 1,
                    "nombre": "OTRO",
                    "estado": true,
                    "dimensiones": [
                        {
                            "id": 1,
                            "descripcion": "Hacer",
                            "puntaje": 10
                        }
                    ]
                }
            }
        ]
    },
    {
        "alumno_id": 18,
        "nombre": "Raul Asencio",
        "tareas": [
            {
                "id": 6,
                "descripcion": "america colon",
                "puntaje": 0,
                "fecha_inicio": "2025-05-27",
                "fecha_entrega": "2025-05-28",
                "estado": true,
                "actividad": {
                    "id": 2,
                    "nombre": "Exposiciones",
                    "estado": true,
                    "dimensiones": [
                        {
                            "id": 1,
                            "descripcion": "Hacer",
                            "puntaje": 10
                        }
                    ]
                }
            },
            {
                "id": 18,
                "descripcion": "2",
                "puntaje": 0,
                "fecha_inicio": "2025-05-08",
                "fecha_entrega": "2025-05-20",
                "estado": true,
                "actividad": {
                    "id": 1,
                    "nombre": "OTRO",
                    "estado": true,
                    "dimensiones": [
                        {
                            "id": 1,
                            "descripcion": "Hacer",
                            "puntaje": 10
                        }
                    ]
                }
            },
            {
                "id": 30,
                "descripcion": "2",
                "puntaje": 0,
                "fecha_inicio": "2025-05-20",
                "fecha_entrega": "2025-05-28",
                "estado": true,
                "actividad": {
                    "id": 1,
                    "nombre": "OTRO",
                    "estado": true,
                    "dimensiones": [
                        {
                            "id": 1,
                            "descripcion": "Hacer",
                            "puntaje": 10
                        }
                    ]
                }
            }
        ]
    },
    {
        "alumno_id": 19,
        "nombre": "Briana",
        "tareas": [
            {
                "id": 7,
                "descripcion": "america colon",
                "puntaje": 0,
                "fecha_inicio": "2025-05-27",
                "fecha_entrega": "2025-05-28",
                "estado": true,
                "actividad": {
                    "id": 2,
                    "nombre": "Exposiciones",
                    "estado": true,
                    "dimensiones": [
                        {
                            "id": 1,
                            "descripcion": "Hacer",
                            "puntaje": 10
                        }
                    ]
                }
            },
            {
                "id": 19,
                "descripcion": "2",
                "puntaje": 0,
                "fecha_inicio": "2025-05-08",
                "fecha_entrega": "2025-05-20",
                "estado": true,
                "actividad": {
                    "id": 1,
                    "nombre": "OTRO",
                    "estado": true,
                    "dimensiones": [
                        {
                            "id": 1,
                            "descripcion": "Hacer",
                            "puntaje": 10
                        }
                    ]
                }
            },
            {
                "id": 31,
                "descripcion": "2",
                "puntaje": 0,
                "fecha_inicio": "2025-05-20",
                "fecha_entrega": "2025-05-28",
                "estado": true,
                "actividad": {
                    "id": 1,
                    "nombre": "OTRO",
                    "estado": true,
                    "dimensiones": [
                        {
                            "id": 1,
                            "descripcion": "Hacer",
                            "puntaje": 10
                        }
                    ]
                }
            }
        ]
    },
    {
        "alumno_id": 20,
        "nombre": "Flor",
        "tareas": [
            {
                "id": 8,
                "descripcion": "america colon",
                "puntaje": 0,
                "fecha_inicio": "2025-05-27",
                "fecha_entrega": "2025-05-28",
                "estado": true,
                "actividad": {
                    "id": 2,
                    "nombre": "Exposiciones",
                    "estado": true,
                    "dimensiones": [
                        {
                            "id": 1,
                            "descripcion": "Hacer",
                            "puntaje": 10
                        }
                    ]
                }
            },
            {
                "id": 20,
                "descripcion": "2",
                "puntaje": 0,
                "fecha_inicio": "2025-05-08",
                "fecha_entrega": "2025-05-20",
                "estado": true,
                "actividad": {
                    "id": 1,
                    "nombre": "OTRO",
                    "estado": true,
                    "dimensiones": [
                        {
                            "id": 1,
                            "descripcion": "Hacer",
                            "puntaje": 10
                        }
                    ]
                }
            },
            {
                "id": 32,
                "descripcion": "2",
                "puntaje": 0,
                "fecha_inicio": "2025-05-20",
                "fecha_entrega": "2025-05-28",
                "estado": true,
                "actividad": {
                    "id": 1,
                    "nombre": "OTRO",
                    "estado": true,
                    "dimensiones": [
                        {
                            "id": 1,
                            "descripcion": "Hacer",
                            "puntaje": 10
                        }
                    ]
                }
            }
        ]
    },
    {
        "alumno_id": 21,
        "nombre": "Peinado",
        "tareas": [
            {
                "id": 9,
                "descripcion": "america colon",
                "puntaje": 0,
                "fecha_inicio": "2025-05-27",
                "fecha_entrega": "2025-05-28",
                "estado": true,
                "actividad": {
                    "id": 2,
                    "nombre": "Exposiciones",
                    "estado": true,
                    "dimensiones": [
                        {
                            "id": 1,
                            "descripcion": "Hacer",
                            "puntaje": 10
                        }
                    ]
                }
            },
            {
                "id": 21,
                "descripcion": "2",
                "puntaje": 0,
                "fecha_inicio": "2025-05-08",
                "fecha_entrega": "2025-05-20",
                "estado": true,
                "actividad": {
                    "id": 1,
                    "nombre": "OTRO",
                    "estado": true,
                    "dimensiones": [
                        {
                            "id": 1,
                            "descripcion": "Hacer",
                            "puntaje": 10
                        }
                    ]
                }
            },
            {
                "id": 33,
                "descripcion": "2",
                "puntaje": 0,
                "fecha_inicio": "2025-05-20",
                "fecha_entrega": "2025-05-28",
                "estado": true,
                "actividad": {
                    "id": 1,
                    "nombre": "OTRO",
                    "estado": true,
                    "dimensiones": [
                        {
                            "id": 1,
                            "descripcion": "Hacer",
                            "puntaje": 10
                        }
                    ]
                }
            }
        ]
    },
    {
        "alumno_id": 22,
        "nombre": "Florinda",
        "tareas": [
            {
                "id": 10,
                "descripcion": "america colon",
                "puntaje": 0,
                "fecha_inicio": "2025-05-27",
                "fecha_entrega": "2025-05-28",
                "estado": true,
                "actividad": {
                    "id": 2,
                    "nombre": "Exposiciones",
                    "estado": true,
                    "dimensiones": [
                        {
                            "id": 1,
                            "descripcion": "Hacer",
                            "puntaje": 10
                        }
                    ]
                }
            },
            {
                "id": 22,
                "descripcion": "2",
                "puntaje": 0,
                "fecha_inicio": "2025-05-08",
                "fecha_entrega": "2025-05-20",
                "estado": true,
                "actividad": {
                    "id": 1,
                    "nombre": "OTRO",
                    "estado": true,
                    "dimensiones": [
                        {
                            "id": 1,
                            "descripcion": "Hacer",
                            "puntaje": 10
                        }
                    ]
                }
            },
            {
                "id": 34,
                "descripcion": "2",
                "puntaje": 0,
                "fecha_inicio": "2025-05-20",
                "fecha_entrega": "2025-05-28",
                "estado": true,
                "actividad": {
                    "id": 1,
                    "nombre": "OTRO",
                    "estado": true,
                    "dimensiones": [
                        {
                            "id": 1,
                            "descripcion": "Hacer",
                            "puntaje": 10
                        }
                    ]
                }
            }
        ]
    },
    {
        "alumno_id": 23,
        "nombre": "Ceci",
        "tareas": [
            {
                "id": 11,
                "descripcion": "america colon",
                "puntaje": 0,
                "fecha_inicio": "2025-05-27",
                "fecha_entrega": "2025-05-28",
                "estado": true,
                "actividad": {
                    "id": 2,
                    "nombre": "Exposiciones",
                    "estado": true,
                    "dimensiones": [
                        {
                            "id": 1,
                            "descripcion": "Hacer",
                            "puntaje": 10
                        }
                    ]
                }
            },
            {
                "id": 23,
                "descripcion": "2",
                "puntaje": 0,
                "fecha_inicio": "2025-05-08",
                "fecha_entrega": "2025-05-20",
                "estado": true,
                "actividad": {
                    "id": 1,
                    "nombre": "OTRO",
                    "estado": true,
                    "dimensiones": [
                        {
                            "id": 1,
                            "descripcion": "Hacer",
                            "puntaje": 10
                        }
                    ]
                }
            },
            {
                "id": 35,
                "descripcion": "2",
                "puntaje": 0,
                "fecha_inicio": "2025-05-20",
                "fecha_entrega": "2025-05-28",
                "estado": true,
                "actividad": {
                    "id": 1,
                    "nombre": "OTRO",
                    "estado": true,
                    "dimensiones": [
                        {
                            "id": 1,
                            "descripcion": "Hacer",
                            "puntaje": 10
                        }
                    ]
                }
            }
        ]
    },
    {
        "alumno_id": 24,
        "nombre": "Belligham",
        "tareas": [
            {
                "id": 12,
                "descripcion": "america colon",
                "puntaje": 0,
                "fecha_inicio": "2025-05-27",
                "fecha_entrega": "2025-05-28",
                "estado": true,
                "actividad": {
                    "id": 2,
                    "nombre": "Exposiciones",
                    "estado": true,
                    "dimensiones": [
                        {
                            "id": 1,
                            "descripcion": "Hacer",
                            "puntaje": 10
                        }
                    ]
                }
            },
            {
                "id": 24,
                "descripcion": "2",
                "puntaje": 0,
                "fecha_inicio": "2025-05-08",
                "fecha_entrega": "2025-05-20",
                "estado": true,
                "actividad": {
                    "id": 1,
                    "nombre": "OTRO",
                    "estado": true,
                    "dimensiones": [
                        {
                            "id": 1,
                            "descripcion": "Hacer",
                            "puntaje": 10
                        }
                    ]
                }
            },
            {
                "id": 36,
                "descripcion": "2",
                "puntaje": 0,
                "fecha_inicio": "2025-05-20",
                "fecha_entrega": "2025-05-28",
                "estado": true,
                "actividad": {
                    "id": 1,
                    "nombre": "OTRO",
                    "estado": true,
                    "dimensiones": [
                        {
                            "id": 1,
                            "descripcion": "Hacer",
                            "puntaje": 10
                        }
                    ]
                }
            }
        ]
    }
];

function generarNombreActividad(tarea) {
    const tipo = tarea.descripcion?.toLowerCase().includes("tarea") ? "TAREA" : "ACTIVIDAD";
    return `${tipo} ${tarea.actividad.id}`;
}

const CalificacionesPage = () => {
    const [estudiantes, setEstudiantes] = useState([]);
    const [notas, setNotas] = useState({});
    const actividades = useMemo(() => Object.values(dimensiones).flat(), []);


    useEffect(() => {
        fetchDimension();
    }, []);

    const fetchDimension = async () => {
        try {
            const materiaProfesor = JSON.parse(localStorage.getItem("materiaProfesor") || "null");
            const gestion2 = JSON.parse(localStorage.getItem("gestion") || "null");
            const id_cursoparalelo = materiaProfesor.horarios.curso_paralelo;
            const gestion =  9;//gestion2.gestion
            const horario_materia = materiaProfesor.horarios.id
            console.log(id_cursoparalelo)
            console.log(gestion)
            console.log(horario_materia)

            const res = await obtenerDimensionAsignadasRequest({id_cursoparalelo,gestion,horario_materia});

            console.log(res.data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        const nuevosAlumnos = [];
        const nuevasNotas = {};

        tareasPorAlumno.forEach((alumnoObj) => {
            const nombre = alumnoObj.nombre.toUpperCase();
            nuevosAlumnos.push(nombre);

            if (!nuevasNotas[nombre]) nuevasNotas[nombre] = {};

            alumnoObj.tareas.forEach(tarea => {
                const actividadFormateada = generarNombreActividad(tarea);
                nuevasNotas[nombre][actividadFormateada] = tarea.puntaje;
            });
        });

        setEstudiantes(nuevosAlumnos);
        setNotas(nuevasNotas);
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
            </div>
        </div>
    );
};

export default CalificacionesPage;
