import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown, AlertCircle, CheckCircle, Target, Brain, BookOpen, Activity } from 'lucide-react';

// DATOS DE EJEMPLO AMPLIADOS
const datosJSON = [
    {
        "materia_id": 9,
        "nombre_materia": "Matematicas",
        "trimestre": {
            "id": 33,
            "nro": 1,
            "fecha_inicio": "2022-02-01",
            "fecha_final": "2022-05-01"
        },
        "dimensiones": [
            {
                "dimension_id": 5,
                "descripcion": "Ser",
                "promedio": 5.0
            },
            {
                "dimension_id": 6,
                "descripcion": "Saber",
                "promedio": 36.0
            },
            {
                "dimension_id": 7,
                "descripcion": "Hacer",
                "promedio": 18.0
            },
            {
                "dimension_id": 8,
                "descripcion": "Decidir",
                "promedio": 5.0
            },
            {
                "dimension_id": 9,
                "descripcion": "AutoEvaluacion",
                "promedio": 5.0
            },
            {
                "dimension_id": 10,
                "descripcion": "Extras",
                "promedio": null
            }
        ]
    },
    {
        "materia_id": 10,
        "nombre_materia": "Literatura",
        "trimestre": {
            "id": 33,
            "nro": 1,
            "fecha_inicio": "2022-02-01",
            "fecha_final": "2022-05-01"
        },
        "dimensiones": [
            {
                "dimension_id": 5,
                "descripcion": "Ser",
                "promedio": 5.0
            },
            {
                "dimension_id": 6,
                "descripcion": "Saber",
                "promedio": 36.0
            },
            {
                "dimension_id": 7,
                "descripcion": "Hacer",
                "promedio": 32.0
            },
            {
                "dimension_id": 8,
                "descripcion": "Decidir",
                "promedio": 5.0
            },
            {
                "dimension_id": 9,
                "descripcion": "AutoEvaluacion",
                "promedio": 5.0
            },
            {
                "dimension_id": 10,
                "descripcion": "Extras",
                "promedio": null
            }
        ]
    },
    {
        "materia_id": 11,
        "nombre_materia": "Quimica",
        "trimestre": {
            "id": 33,
            "nro": 1,
            "fecha_inicio": "2022-02-01",
            "fecha_final": "2022-05-01"
        },
        "dimensiones": [
            {
                "dimension_id": 5,
                "descripcion": "Ser",
                "promedio": 5.0
            },
            {
                "dimension_id": 6,
                "descripcion": "Saber",
                "promedio": 36.0
            },
            {
                "dimension_id": 7,
                "descripcion": "Hacer",
                "promedio": 40.0
            },
            {
                "dimension_id": 8,
                "descripcion": "Decidir",
                "promedio": 5.0
            },
            {
                "dimension_id": 9,
                "descripcion": "AutoEvaluacion",
                "promedio": 5.0
            },
            {
                "dimension_id": 10,
                "descripcion": "Extras",
                "promedio": null
            }
        ]
    },
    {
        "materia_id": 12,
        "nombre_materia": "Fisica",
        "trimestre": {
            "id": 33,
            "nro": 1,
            "fecha_inicio": "2022-02-01",
            "fecha_final": "2022-05-01"
        },
        "dimensiones": [
            {
                "dimension_id": 5,
                "descripcion": "Ser",
                "promedio": 5.0
            },
            {
                "dimension_id": 6,
                "descripcion": "Saber",
                "promedio": 45.0
            },
            {
                "dimension_id": 7,
                "descripcion": "Hacer",
                "promedio": 39.6
            },
            {
                "dimension_id": 8,
                "descripcion": "Decidir",
                "promedio": 5.0
            },
            {
                "dimension_id": 9,
                "descripcion": "AutoEvaluacion",
                "promedio": 5.0
            },
            {
                "dimension_id": 10,
                "descripcion": "Extras",
                "promedio": null
            }
        ]
    },
    {
        "materia_id": 13,
        "nombre_materia": "Religion",
        "trimestre": {
            "id": 33,
            "nro": 1,
            "fecha_inicio": "2022-02-01",
            "fecha_final": "2022-05-01"
        },
        "dimensiones": [
            {
                "dimension_id": 5,
                "descripcion": "Ser",
                "promedio": 5.0
            },
            {
                "dimension_id": 6,
                "descripcion": "Saber",
                "promedio": 18.0
            },
            {
                "dimension_id": 7,
                "descripcion": "Hacer",
                "promedio": 20.0
            },
            {
                "dimension_id": 8,
                "descripcion": "Decidir",
                "promedio": 5.0
            },
            {
                "dimension_id": 9,
                "descripcion": "AutoEvaluacion",
                "promedio": 5.0
            },
            {
                "dimension_id": 10,
                "descripcion": "Extras",
                "promedio": null
            }
        ]
    },
    {
        "materia_id": 14,
        "nombre_materia": "Biologia",
        "trimestre": {
            "id": 33,
            "nro": 1,
            "fecha_inicio": "2022-02-01",
            "fecha_final": "2022-05-01"
        },
        "dimensiones": [
            {
                "dimension_id": 5,
                "descripcion": "Ser",
                "promedio": 5.0
            },
            {
                "dimension_id": 6,
                "descripcion": "Saber",
                "promedio": 31.5
            },
            {
                "dimension_id": 7,
                "descripcion": "Hacer",
                "promedio": 40.0
            },
            {
                "dimension_id": 8,
                "descripcion": "Decidir",
                "promedio": 5.0
            },
            {
                "dimension_id": 9,
                "descripcion": "AutoEvaluacion",
                "promedio": 5.0
            },
            {
                "dimension_id": 10,
                "descripcion": "Extras",
                "promedio": null
            }
        ]
    },
    {
        "materia_id": 15,
        "nombre_materia": "Historia",
        "trimestre": {
            "id": 33,
            "nro": 1,
            "fecha_inicio": "2022-02-01",
            "fecha_final": "2022-05-01"
        },
        "dimensiones": [
            {
                "dimension_id": 5,
                "descripcion": "Ser",
                "promedio": 5.0
            },
            {
                "dimension_id": 6,
                "descripcion": "Saber",
                "promedio": 29.25
            },
            {
                "dimension_id": 7,
                "descripcion": "Hacer",
                "promedio": 40.0
            },
            {
                "dimension_id": 8,
                "descripcion": "Decidir",
                "promedio": 5.0
            },
            {
                "dimension_id": 9,
                "descripcion": "AutoEvaluacion",
                "promedio": 5.0
            },
            {
                "dimension_id": 10,
                "descripcion": "Extras",
                "promedio": null
            }
        ]
    },
    {
        "materia_id": 16,
        "nombre_materia": "Ingles",
        "trimestre": {
            "id": 33,
            "nro": 1,
            "fecha_inicio": "2022-02-01",
            "fecha_final": "2022-05-01"
        },
        "dimensiones": [
            {
                "dimension_id": 5,
                "descripcion": "Ser",
                "promedio": 5.0
            },
            {
                "dimension_id": 6,
                "descripcion": "Saber",
                "promedio": 33.3
            },
            {
                "dimension_id": 7,
                "descripcion": "Hacer",
                "promedio": 34.0
            },
            {
                "dimension_id": 8,
                "descripcion": "Decidir",
                "promedio": 5.0
            },
            {
                "dimension_id": 9,
                "descripcion": "AutoEvaluacion",
                "promedio": 5.0
            },
            {
                "dimension_id": 10,
                "descripcion": "Extras",
                "promedio": null
            }
        ]
    },
    {
        "materia_id": 17,
        "nombre_materia": "Artes",
        "trimestre": {
            "id": 33,
            "nro": 1,
            "fecha_inicio": "2022-02-01",
            "fecha_final": "2022-05-01"
        },
        "dimensiones": [
            {
                "dimension_id": 5,
                "descripcion": "Ser",
                "promedio": 4.0
            },
            {
                "dimension_id": 6,
                "descripcion": "Saber",
                "promedio": 24.75
            },
            {
                "dimension_id": 7,
                "descripcion": "Hacer",
                "promedio": 38.4
            },
            {
                "dimension_id": 8,
                "descripcion": "Decidir",
                "promedio": 3.5
            },
            {
                "dimension_id": 9,
                "descripcion": "AutoEvaluacion",
                "promedio": 5.0
            },
            {
                "dimension_id": 10,
                "descripcion": "Extras",
                "promedio": null
            }
        ]
    },
    {
        "materia_id": 18,
        "nombre_materia": "Deportes",
        "trimestre": {
            "id": 33,
            "nro": 1,
            "fecha_inicio": "2022-02-01",
            "fecha_final": "2022-05-01"
        },
        "dimensiones": [
            {
                "dimension_id": 5,
                "descripcion": "Ser",
                "promedio": 5.0
            },
            {
                "dimension_id": 6,
                "descripcion": "Saber",
                "promedio": 9.0
            },
            {
                "dimension_id": 7,
                "descripcion": "Hacer",
                "promedio": 16.0
            },
            {
                "dimension_id": 8,
                "descripcion": "Decidir",
                "promedio": 5.0
            },
            {
                "dimension_id": 9,
                "descripcion": "AutoEvaluacion",
                "promedio": 5.0
            },
            {
                "dimension_id": 10,
                "descripcion": "Extras",
                "promedio": null
            }
        ]
    },
    {
        "materia_id": 19,
        "nombre_materia": "Musica",
        "trimestre": {
            "id": 33,
            "nro": 1,
            "fecha_inicio": "2022-02-01",
            "fecha_final": "2022-05-01"
        },
        "dimensiones": [
            {
                "dimension_id": 5,
                "descripcion": "Ser",
                "promedio": 5.0
            },
            {
                "dimension_id": 6,
                "descripcion": "Saber",
                "promedio": 36.0
            },
            {
                "dimension_id": 7,
                "descripcion": "Hacer",
                "promedio": 40.0
            },
            {
                "dimension_id": 8,
                "descripcion": "Decidir",
                "promedio": 5.0
            },
            {
                "dimension_id": 9,
                "descripcion": "AutoEvaluacion",
                "promedio": 5.0
            },
            {
                "dimension_id": 10,
                "descripcion": "Extras",
                "promedio": null
            }
        ]
    },
    {
        "materia_id": 9,
        "nombre_materia": "Matematicas",
        "trimestre": {
            "id": 34,
            "nro": 2,
            "fecha_inicio": "2022-05-02",
            "fecha_final": "2022-08-01"
        },
        "dimensiones": [
            {
                "dimension_id": 5,
                "descripcion": "Ser",
                "promedio": 5.0
            },
            {
                "dimension_id": 6,
                "descripcion": "Saber",
                "promedio": 22.5
            },
            {
                "dimension_id": 7,
                "descripcion": "Hacer",
                "promedio": 32.0
            },
            {
                "dimension_id": 8,
                "descripcion": "Decidir",
                "promedio": 5.0
            },
            {
                "dimension_id": 9,
                "descripcion": "AutoEvaluacion",
                "promedio": 5.0
            },
            {
                "dimension_id": 10,
                "descripcion": "Extras",
                "promedio": null
            }
        ]
    },
    {
        "materia_id": 10,
        "nombre_materia": "Literatura",
        "trimestre": {
            "id": 34,
            "nro": 2,
            "fecha_inicio": "2022-05-02",
            "fecha_final": "2022-08-01"
        },
        "dimensiones": [
            {
                "dimension_id": 5,
                "descripcion": "Ser",
                "promedio": 5.0
            },
            {
                "dimension_id": 6,
                "descripcion": "Saber",
                "promedio": 36.0
            },
            {
                "dimension_id": 7,
                "descripcion": "Hacer",
                "promedio": 40.0
            },
            {
                "dimension_id": 8,
                "descripcion": "Decidir",
                "promedio": 5.0
            },
            {
                "dimension_id": 9,
                "descripcion": "AutoEvaluacion",
                "promedio": 5.0
            },
            {
                "dimension_id": 10,
                "descripcion": "Extras",
                "promedio": null
            }
        ]
    },
    {
        "materia_id": 11,
        "nombre_materia": "Quimica",
        "trimestre": {
            "id": 34,
            "nro": 2,
            "fecha_inicio": "2022-05-02",
            "fecha_final": "2022-08-01"
        },
        "dimensiones": [
            {
                "dimension_id": 5,
                "descripcion": "Ser",
                "promedio": 5.0
            },
            {
                "dimension_id": 6,
                "descripcion": "Saber",
                "promedio": 9.0
            },
            {
                "dimension_id": 7,
                "descripcion": "Hacer",
                "promedio": 20.0
            },
            {
                "dimension_id": 8,
                "descripcion": "Decidir",
                "promedio": 5.0
            },
            {
                "dimension_id": 9,
                "descripcion": "AutoEvaluacion",
                "promedio": 5.0
            },
            {
                "dimension_id": 10,
                "descripcion": "Extras",
                "promedio": null
            }
        ]
    },
    {
        "materia_id": 12,
        "nombre_materia": "Fisica",
        "trimestre": {
            "id": 34,
            "nro": 2,
            "fecha_inicio": "2022-05-02",
            "fecha_final": "2022-08-01"
        },
        "dimensiones": [
            {
                "dimension_id": 5,
                "descripcion": "Ser",
                "promedio": 5.0
            },
            {
                "dimension_id": 6,
                "descripcion": "Saber",
                "promedio": 29.25
            },
            {
                "dimension_id": 7,
                "descripcion": "Hacer",
                "promedio": 32.0
            },
            {
                "dimension_id": 8,
                "descripcion": "Decidir",
                "promedio": 5.0
            },
            {
                "dimension_id": 9,
                "descripcion": "AutoEvaluacion",
                "promedio": 5.0
            },
            {
                "dimension_id": 10,
                "descripcion": "Extras",
                "promedio": null
            }
        ]
    },
    {
        "materia_id": 13,
        "nombre_materia": "Religion",
        "trimestre": {
            "id": 34,
            "nro": 2,
            "fecha_inicio": "2022-05-02",
            "fecha_final": "2022-08-01"
        },
        "dimensiones": [
            {
                "dimension_id": 5,
                "descripcion": "Ser",
                "promedio": 5.0
            },
            {
                "dimension_id": 6,
                "descripcion": "Saber",
                "promedio": 27.0
            },
            {
                "dimension_id": 7,
                "descripcion": "Hacer",
                "promedio": 20.0
            },
            {
                "dimension_id": 8,
                "descripcion": "Decidir",
                "promedio": 5.0
            },
            {
                "dimension_id": 9,
                "descripcion": "AutoEvaluacion",
                "promedio": 5.0
            },
            {
                "dimension_id": 10,
                "descripcion": "Extras",
                "promedio": null
            }
        ]
    },
    {
        "materia_id": 14,
        "nombre_materia": "Biologia",
        "trimestre": {
            "id": 34,
            "nro": 2,
            "fecha_inicio": "2022-05-02",
            "fecha_final": "2022-08-01"
        },
        "dimensiones": [
            {
                "dimension_id": 5,
                "descripcion": "Ser",
                "promedio": 5.0
            },
            {
                "dimension_id": 6,
                "descripcion": "Saber",
                "promedio": 40.5
            },
            {
                "dimension_id": 7,
                "descripcion": "Hacer",
                "promedio": 40.0
            },
            {
                "dimension_id": 8,
                "descripcion": "Decidir",
                "promedio": 5.0
            },
            {
                "dimension_id": 9,
                "descripcion": "AutoEvaluacion",
                "promedio": 5.0
            },
            {
                "dimension_id": 10,
                "descripcion": "Extras",
                "promedio": null
            }
        ]
    },
    {
        "materia_id": 15,
        "nombre_materia": "Historia",
        "trimestre": {
            "id": 34,
            "nro": 2,
            "fecha_inicio": "2022-05-02",
            "fecha_final": "2022-08-01"
        },
        "dimensiones": [
            {
                "dimension_id": 5,
                "descripcion": "Ser",
                "promedio": 5.0
            },
            {
                "dimension_id": 6,
                "descripcion": "Saber",
                "promedio": 36.0
            },
            {
                "dimension_id": 7,
                "descripcion": "Hacer",
                "promedio": 40.0
            },
            {
                "dimension_id": 8,
                "descripcion": "Decidir",
                "promedio": 5.0
            },
            {
                "dimension_id": 9,
                "descripcion": "AutoEvaluacion",
                "promedio": 5.0
            },
            {
                "dimension_id": 10,
                "descripcion": "Extras",
                "promedio": null
            }
        ]
    },
    {
        "materia_id": 16,
        "nombre_materia": "Ingles",
        "trimestre": {
            "id": 34,
            "nro": 2,
            "fecha_inicio": "2022-05-02",
            "fecha_final": "2022-08-01"
        },
        "dimensiones": [
            {
                "dimension_id": 5,
                "descripcion": "Ser",
                "promedio": 5.0
            },
            {
                "dimension_id": 6,
                "descripcion": "Saber",
                "promedio": 43.2
            },
            {
                "dimension_id": 7,
                "descripcion": "Hacer",
                "promedio": 34.0
            },
            {
                "dimension_id": 8,
                "descripcion": "Decidir",
                "promedio": 5.0
            },
            {
                "dimension_id": 9,
                "descripcion": "AutoEvaluacion",
                "promedio": 5.0
            },
            {
                "dimension_id": 10,
                "descripcion": "Extras",
                "promedio": null
            }
        ]
    },
    {
        "materia_id": 17,
        "nombre_materia": "Artes",
        "trimestre": {
            "id": 34,
            "nro": 2,
            "fecha_inicio": "2022-05-02",
            "fecha_final": "2022-08-01"
        },
        "dimensiones": [
            {
                "dimension_id": 5,
                "descripcion": "Ser",
                "promedio": 3.75
            },
            {
                "dimension_id": 6,
                "descripcion": "Saber",
                "promedio": 33.75
            },
            {
                "dimension_id": 7,
                "descripcion": "Hacer",
                "promedio": 34.0
            },
            {
                "dimension_id": 8,
                "descripcion": "Decidir",
                "promedio": 4.25
            },
            {
                "dimension_id": 9,
                "descripcion": "AutoEvaluacion",
                "promedio": 4.5
            },
            {
                "dimension_id": 10,
                "descripcion": "Extras",
                "promedio": null
            }
        ]
    },
    {
        "materia_id": 18,
        "nombre_materia": "Deportes",
        "trimestre": {
            "id": 34,
            "nro": 2,
            "fecha_inicio": "2022-05-02",
            "fecha_final": "2022-08-01"
        },
        "dimensiones": [
            {
                "dimension_id": 5,
                "descripcion": "Ser",
                "promedio": 5.0
            },
            {
                "dimension_id": 6,
                "descripcion": "Saber",
                "promedio": 27.0
            },
            {
                "dimension_id": 7,
                "descripcion": "Hacer",
                "promedio": 6.0
            },
            {
                "dimension_id": 8,
                "descripcion": "Decidir",
                "promedio": 5.0
            },
            {
                "dimension_id": 9,
                "descripcion": "AutoEvaluacion",
                "promedio": 5.0
            },
            {
                "dimension_id": 10,
                "descripcion": "Extras",
                "promedio": null
            }
        ]
    },
    {
        "materia_id": 19,
        "nombre_materia": "Musica",
        "trimestre": {
            "id": 34,
            "nro": 2,
            "fecha_inicio": "2022-05-02",
            "fecha_final": "2022-08-01"
        },
        "dimensiones": [
            {
                "dimension_id": 5,
                "descripcion": "Ser",
                "promedio": 5.0
            },
            {
                "dimension_id": 6,
                "descripcion": "Saber",
                "promedio": 45.0
            },
            {
                "dimension_id": 7,
                "descripcion": "Hacer",
                "promedio": 40.0
            },
            {
                "dimension_id": 8,
                "descripcion": "Decidir",
                "promedio": 5.0
            },
            {
                "dimension_id": 9,
                "descripcion": "AutoEvaluacion",
                "promedio": 5.0
            },
            {
                "dimension_id": 10,
                "descripcion": "Extras",
                "promedio": null
            }
        ]
    },
    {
        "materia_id": 9,
        "nombre_materia": "Matematicas",
        "trimestre": {
            "id": 35,
            "nro": 3,
            "fecha_inicio": "2022-08-02",
            "fecha_final": "2022-11-01"
        },
        "dimensiones": [
            {
                "dimension_id": 5,
                "descripcion": "Ser",
                "promedio": 5.0
            },
            {
                "dimension_id": 6,
                "descripcion": "Saber",
                "promedio": 22.5
            },
            {
                "dimension_id": 7,
                "descripcion": "Hacer",
                "promedio": 40.0
            },
            {
                "dimension_id": 8,
                "descripcion": "Decidir",
                "promedio": 5.0
            },
            {
                "dimension_id": 9,
                "descripcion": "AutoEvaluacion",
                "promedio": 5.0
            },
            {
                "dimension_id": 10,
                "descripcion": "Extras",
                "promedio": null
            }
        ]
    },
    {
        "materia_id": 10,
        "nombre_materia": "Literatura",
        "trimestre": {
            "id": 35,
            "nro": 3,
            "fecha_inicio": "2022-08-02",
            "fecha_final": "2022-11-01"
        },
        "dimensiones": [
            {
                "dimension_id": 5,
                "descripcion": "Ser",
                "promedio": 5.0
            },
            {
                "dimension_id": 6,
                "descripcion": "Saber",
                "promedio": 4.5
            },
            {
                "dimension_id": 7,
                "descripcion": "Hacer",
                "promedio": 10.0
            },
            {
                "dimension_id": 8,
                "descripcion": "Decidir",
                "promedio": 5.0
            },
            {
                "dimension_id": 9,
                "descripcion": "AutoEvaluacion",
                "promedio": 5.0
            },
            {
                "dimension_id": 10,
                "descripcion": "Extras",
                "promedio": null
            }
        ]
    },
    {
        "materia_id": 11,
        "nombre_materia": "Quimica",
        "trimestre": {
            "id": 35,
            "nro": 3,
            "fecha_inicio": "2022-08-02",
            "fecha_final": "2022-11-01"
        },
        "dimensiones": [
            {
                "dimension_id": 5,
                "descripcion": "Ser",
                "promedio": 5.0
            },
            {
                "dimension_id": 6,
                "descripcion": "Saber",
                "promedio": 40.5
            },
            {
                "dimension_id": 7,
                "descripcion": "Hacer",
                "promedio": 32.0
            },
            {
                "dimension_id": 8,
                "descripcion": "Decidir",
                "promedio": 5.0
            },
            {
                "dimension_id": 9,
                "descripcion": "AutoEvaluacion",
                "promedio": 5.0
            },
            {
                "dimension_id": 10,
                "descripcion": "Extras",
                "promedio": null
            }
        ]
    },
    {
        "materia_id": 12,
        "nombre_materia": "Fisica",
        "trimestre": {
            "id": 35,
            "nro": 3,
            "fecha_inicio": "2022-08-02",
            "fecha_final": "2022-11-01"
        },
        "dimensiones": [
            {
                "dimension_id": 5,
                "descripcion": "Ser",
                "promedio": 5.0
            },
            {
                "dimension_id": 6,
                "descripcion": "Saber",
                "promedio": 29.25
            },
            {
                "dimension_id": 7,
                "descripcion": "Hacer",
                "promedio": 24.0
            },
            {
                "dimension_id": 8,
                "descripcion": "Decidir",
                "promedio": 5.0
            },
            {
                "dimension_id": 9,
                "descripcion": "AutoEvaluacion",
                "promedio": 5.0
            },
            {
                "dimension_id": 10,
                "descripcion": "Extras",
                "promedio": null
            }
        ]
    },
    {
        "materia_id": 13,
        "nombre_materia": "Religion",
        "trimestre": {
            "id": 35,
            "nro": 3,
            "fecha_inicio": "2022-08-02",
            "fecha_final": "2022-11-01"
        },
        "dimensiones": [
            {
                "dimension_id": 5,
                "descripcion": "Ser",
                "promedio": 5.0
            },
            {
                "dimension_id": 6,
                "descripcion": "Saber",
                "promedio": 22.5
            },
            {
                "dimension_id": 7,
                "descripcion": "Hacer",
                "promedio": 22.0
            },
            {
                "dimension_id": 8,
                "descripcion": "Decidir",
                "promedio": 5.0
            },
            {
                "dimension_id": 9,
                "descripcion": "AutoEvaluacion",
                "promedio": 5.0
            },
            {
                "dimension_id": 10,
                "descripcion": "Extras",
                "promedio": null
            }
        ]
    },
    {
        "materia_id": 14,
        "nombre_materia": "Biologia",
        "trimestre": {
            "id": 35,
            "nro": 3,
            "fecha_inicio": "2022-08-02",
            "fecha_final": "2022-11-01"
        },
        "dimensiones": [
            {
                "dimension_id": 5,
                "descripcion": "Ser",
                "promedio": 5.0
            },
            {
                "dimension_id": 6,
                "descripcion": "Saber",
                "promedio": 40.5
            },
            {
                "dimension_id": 7,
                "descripcion": "Hacer",
                "promedio": 40.0
            },
            {
                "dimension_id": 8,
                "descripcion": "Decidir",
                "promedio": 5.0
            },
            {
                "dimension_id": 9,
                "descripcion": "AutoEvaluacion",
                "promedio": 5.0
            },
            {
                "dimension_id": 10,
                "descripcion": "Extras",
                "promedio": null
            }
        ]
    },
    {
        "materia_id": 15,
        "nombre_materia": "Historia",
        "trimestre": {
            "id": 35,
            "nro": 3,
            "fecha_inicio": "2022-08-02",
            "fecha_final": "2022-11-01"
        },
        "dimensiones": [
            {
                "dimension_id": 5,
                "descripcion": "Ser",
                "promedio": 2.5
            },
            {
                "dimension_id": 6,
                "descripcion": "Saber",
                "promedio": 31.5
            },
            {
                "dimension_id": 7,
                "descripcion": "Hacer",
                "promedio": 40.0
            },
            {
                "dimension_id": 8,
                "descripcion": "Decidir",
                "promedio": 5.0
            },
            {
                "dimension_id": 9,
                "descripcion": "AutoEvaluacion",
                "promedio": 5.0
            },
            {
                "dimension_id": 10,
                "descripcion": "Extras",
                "promedio": null
            }
        ]
    },
    {
        "materia_id": 16,
        "nombre_materia": "Ingles",
        "trimestre": {
            "id": 35,
            "nro": 3,
            "fecha_inicio": "2022-08-02",
            "fecha_final": "2022-11-01"
        },
        "dimensiones": [
            {
                "dimension_id": 5,
                "descripcion": "Ser",
                "promedio": 5.0
            },
            {
                "dimension_id": 6,
                "descripcion": "Saber",
                "promedio": 38.25
            },
            {
                "dimension_id": 7,
                "descripcion": "Hacer",
                "promedio": 26.0
            },
            {
                "dimension_id": 8,
                "descripcion": "Decidir",
                "promedio": 5.0
            },
            {
                "dimension_id": 9,
                "descripcion": "AutoEvaluacion",
                "promedio": 0.0
            },
            {
                "dimension_id": 10,
                "descripcion": "Extras",
                "promedio": null
            }
        ]
    },
    {
        "materia_id": 17,
        "nombre_materia": "Artes",
        "trimestre": {
            "id": 35,
            "nro": 3,
            "fecha_inicio": "2022-08-02",
            "fecha_final": "2022-11-01"
        },
        "dimensiones": [
            {
                "dimension_id": 5,
                "descripcion": "Ser",
                "promedio": 3.5
            },
            {
                "dimension_id": 6,
                "descripcion": "Saber",
                "promedio": 38.25
            },
            {
                "dimension_id": 7,
                "descripcion": "Hacer",
                "promedio": 29.6
            },
            {
                "dimension_id": 8,
                "descripcion": "Decidir",
                "promedio": 4.5
            },
            {
                "dimension_id": 9,
                "descripcion": "AutoEvaluacion",
                "promedio": 3.5
            },
            {
                "dimension_id": 10,
                "descripcion": "Extras",
                "promedio": null
            }
        ]
    },
    {
        "materia_id": 18,
        "nombre_materia": "Deportes",
        "trimestre": {
            "id": 35,
            "nro": 3,
            "fecha_inicio": "2022-08-02",
            "fecha_final": "2022-11-01"
        },
        "dimensiones": [
            {
                "dimension_id": 5,
                "descripcion": "Ser",
                "promedio": 5.0
            },
            {
                "dimension_id": 6,
                "descripcion": "Saber",
                "promedio": 22.5
            },
            {
                "dimension_id": 7,
                "descripcion": "Hacer",
                "promedio": 20.0
            },
            {
                "dimension_id": 8,
                "descripcion": "Decidir",
                "promedio": 5.0
            },
            {
                "dimension_id": 9,
                "descripcion": "AutoEvaluacion",
                "promedio": 5.0
            },
            {
                "dimension_id": 10,
                "descripcion": "Extras",
                "promedio": null
            }
        ]
    },
    {
        "materia_id": 19,
        "nombre_materia": "Musica",
        "trimestre": {
            "id": 35,
            "nro": 3,
            "fecha_inicio": "2022-08-02",
            "fecha_final": "2022-11-01"
        },
        "dimensiones": [
            {
                "dimension_id": 5,
                "descripcion": "Ser",
                "promedio": 5.0
            },
            {
                "dimension_id": 6,
                "descripcion": "Saber",
                "promedio": 36.0
            },
            {
                "dimension_id": 7,
                "descripcion": "Hacer",
                "promedio": 36.0
            },
            {
                "dimension_id": 8,
                "descripcion": "Decidir",
                "promedio": 5.0
            },
            {
                "dimension_id": 9,
                "descripcion": "AutoEvaluacion",
                "promedio": 5.0
            },
            {
                "dimension_id": 10,
                "descripcion": "Extras",
                "promedio": null
            }
        ]
    }
]

function LibretaIA() {
  const [mostrar, setMostrar] = useState(false);
  const [vistaActual, setVistaActual] = useState('tabla');

  const trimestres = [...new Set(datosJSON.map(d => d.trimestre.nro))];

  const calcularTotal = (dimensiones) => {
    const saber = dimensiones.find(d => d.descripcion === 'Saber')?.promedio || 0;
    const hacer = dimensiones.find(d => d.descripcion === 'Hacer')?.promedio || 0;
    return (saber + hacer).toFixed(1);
  };

  // INTERPRETACIÓN MEJORADA CON IA
  const interpretarAvanzado = (saber, hacer, total) => {
    const equilibrio = Math.abs(saber - hacer);
    const nivel = parseFloat(total);
    
    let interpretacion = {
      nivel: '',
      fortalezas: [],
      debilidades: [],
      recomendaciones: [],
      color: '',
      icono: null
    };

    if (nivel >= 35) {
      interpretacion.nivel = "Excelencia Académica";
      interpretacion.color = "#10B981";
      interpretacion.icono = <CheckCircle className="w-5 h-5" />;
      interpretacion.fortalezas = ["Dominio completo de contenidos", "Aplicación práctica excelente"];
      interpretacion.recomendaciones = ["Explorar contenidos avanzados", "Mentorear a otros estudiantes"];
    } else if (nivel >= 30) {
      interpretacion.nivel = "Desempeño Sobresaliente";
      interpretacion.color = "#059669";
      interpretacion.icono = <TrendingUp className="w-5 h-5" />;
      interpretacion.fortalezas = ["Buen dominio teórico y práctico"];
      if (equilibrio > 3) {
        interpretacion.debilidades = saber > hacer ? ["Aplicación práctica por mejorar"] : ["Fundamentos teóricos por reforzar"];
      }
      interpretacion.recomendaciones = ["Mantener el nivel actual", "Buscar desafíos adicionales"];
    } else if (nivel >= 24) {
      interpretacion.nivel = "Progreso Satisfactorio";
      interpretacion.color = "#F59E0B";
      interpretacion.icono = <Target className="w-5 h-5" />;
      interpretacion.fortalezas = ["Base sólida establecida"];
      interpretacion.debilidades = ["Necesita consolidar conocimientos"];
      interpretacion.recomendaciones = ["Práctica adicional", "Refuerzo en áreas específicas"];
    } else {
      interpretacion.nivel = "Requiere Atención Inmediata";
      interpretacion.color = "#EF4444";
      interpretacion.icono = <AlertCircle className="w-5 h-5" />;
      interpretacion.debilidades = ["Fundamentos por construir", "Aplicación limitada"];
      interpretacion.recomendaciones = ["Plan de recuperación", "Apoyo pedagógico especializado"];
    }

    return interpretacion;
  };

  // PREDICCIÓN AVANZADA CON TENDENCIAS
  const predecirRendimiento = (materia) => {
    const materiaData = datosJSON.filter(d => d.nombre_materia === materia);
    if (materiaData.length < 2) return "Datos insuficientes para predicción";

    const tendencias = materiaData.map((d, idx) => ({
      trimestre: d.trimestre.nro,
      total: parseFloat(calcularTotal(d.dimensiones)),
      saber: d.dimensiones.find(dim => dim.descripcion === 'Saber')?.promedio || 0,
      hacer: d.dimensiones.find(dim => dim.descripcion === 'Hacer')?.promedio || 0
    })).sort((a, b) => a.trimestre - b.trimestre);

    const ultimosTres = tendencias.slice(-3);
    const promedioTendencia = ultimosTres.reduce((acc, curr, idx, arr) => {
      if (idx === 0) return 0;
      return acc + (curr.total - arr[idx-1].total);
    }, 0) / (ultimosTres.length - 1);

    const ultimoTotal = ultimosTres[ultimosTres.length - 1].total;
    const prediccionProximoTrimestre = ultimoTotal + promedioTendencia;

    let estado = {
      tendencia: '',
      prediccion: prediccionProximoTrimestre.toFixed(1),
      probabilidadExito: 0,
      recomendaciones: [],
      color: '',
      icono: null
    };

    if (promedioTendencia > 1) {
      estado.tendencia = "Tendencia Ascendente";
      estado.color = "#10B981";
      estado.icono = <TrendingUp className="w-5 h-5" />;
      estado.probabilidadExito = Math.min(95, 70 + (promedioTendencia * 10));
      estado.recomendaciones = ["Mantener estrategias actuales", "Incrementar desafíos"];
    } else if (promedioTendencia > -1) {
      estado.tendencia = "Estabilidad";
      estado.color = "#F59E0B";
      estado.icono = <Activity className="w-5 h-5" />;
      estado.probabilidadExito = Math.min(80, 60 + (ultimoTotal * 2));
      estado.recomendaciones = ["Diversificar métodos de estudio", "Buscar motivación adicional"];
    } else {
      estado.tendencia = "Riesgo de Declive";
      estado.color = "#EF4444";
      estado.icono = <TrendingDown className="w-5 h-5" />;
      estado.probabilidadExito = Math.max(20, 40 + (promedioTendencia * 5));
      estado.recomendaciones = ["Intervención inmediata", "Revisar métodos de enseñanza"];
    }

    return estado;
  };

  const agruparPorTrimestre = (nroTrimestre) => {
    return datosJSON.filter(m => m.trimestre.nro === nroTrimestre);
  };

  // Preparar datos para gráficos
  const prepararDatosEvolucion = () => {
    const materias = [...new Set(datosJSON.map(d => d.nombre_materia))];
    const datosEvolucion = trimestres.map(trimestre => {
      const punto = { trimestre: `T${trimestre}` };
      materias.forEach(materia => {
        const materiaData = datosJSON.find(d => d.nombre_materia === materia && d.trimestre.nro === trimestre);
        if (materiaData) {
          punto[materia] = parseFloat(calcularTotal(materiaData.dimensiones));
        }
      });
      return punto;
    });
    return datosEvolucion;
  };

  const prepararDatosRadar = () => {
    const ultimoTrimestre = Math.max(...trimestres);
    return agruparPorTrimestre(ultimoTrimestre).map(materia => ({
      materia: materia.nombre_materia,
      saber: materia.dimensiones.find(d => d.descripcion === 'SABER')?.promedio || 0,
      hacer: materia.dimensiones.find(d => d.descripcion === 'HACER')?.promedio || 0,
      total: parseFloat(calcularTotal(materia.dimensiones))
    }));
  };

  const colores = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff00'];

  return (
    <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
        color: 'white', 
        padding: '30px', 
        borderRadius: '15px', 
        marginBottom: '30px',
        textAlign: 'center'
      }}>
        <h1 style={{ margin: '0 0 10px 0', fontSize: '2.5rem', fontWeight: 'bold' }}>
          <Brain className="inline w-8 h-8 mr-3" />
          Libreta IA - Sistema Avanzado de Evaluación
        </h1>
        <p style={{ margin: '0 0 20px 0', fontSize: '1.1rem', opacity: '0.9' }}>
          Análisis predictivo e interpretación inteligente del rendimiento académico
        </p>
        
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button 
            onClick={() => setMostrar(true)}
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '25px',
              cursor: 'pointer',
              fontSize: '1rem',
              transition: 'all 0.3s'
            }}
            onMouseOver={(e) => e.target.style.background = 'rgba(255,255,255,0.3)'}
            onMouseOut={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
          >
            <BookOpen className="inline w-4 h-4 mr-2" />
            Mostrar Análisis
          </button>
        </div>
      </div>

      {mostrar && (
        <>
          <div style={{ 
            display: 'flex', 
            gap: '10px', 
            marginBottom: '30px', 
            flexWrap: 'wrap',
            justifyContent: 'center'
          }}>
            {['tabla', 'evolucion', 'comparativo', 'radar'].map(vista => (
              <button
                key={vista}
                onClick={() => setVistaActual(vista)}
                style={{
                  padding: '10px 20px',
                  border: vistaActual === vista ? '2px solid #667eea' : '1px solid #ddd',
                  background: vistaActual === vista ? '#667eea' : 'white',
                  color: vistaActual === vista ? 'white' : '#333',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  transition: 'all 0.3s'
                }}
              >
                {vista.charAt(0).toUpperCase() + vista.slice(1)}
              </button>
            ))}
          </div>

          {vistaActual === 'tabla' && trimestres.map((trimestre, idx) => (
            <div key={idx} style={{ 
              marginBottom: '40px', 
              background: 'white', 
              borderRadius: '15px', 
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              overflow: 'hidden'
            }}>
              <div style={{ 
                background: '#f8f9fa', 
                padding: '20px', 
                borderBottom: '1px solid #eee' 
              }}>
                <h2 style={{ margin: 0, color: '#333', fontSize: '1.5rem' }}>
                  📚 Trimestre {trimestre}
                </h2>
              </div>
              
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#667eea', color: 'white' }}>
                      <th style={{ padding: '15px', textAlign: 'left' }}>Materia</th>
                      <th style={{ padding: '15px', textAlign: 'center' }}>Saber</th>
                      <th style={{ padding: '15px', textAlign: 'center' }}>Hacer</th>
                      <th style={{ padding: '15px', textAlign: 'center' }}>Total</th>
                      <th style={{ padding: '15px', textAlign: 'left' }}>Análisis IA</th>
                      <th style={{ padding: '15px', textAlign: 'left' }}>Predicción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {agruparPorTrimestre(trimestre).map((materia, idx2) => {
                      const saber = materia.dimensiones.find(d => d.descripcion === 'Saber')?.promedio ?? 0;
                      const hacer = materia.dimensiones.find(d => d.descripcion === 'Hacer')?.promedio ?? 0;
                      const total = calcularTotal(materia.dimensiones);
                      const analisis = interpretarAvanzado(saber, hacer, total);
                      const prediccion = predecirRendimiento(materia.nombre_materia);
                      
                      return (
                        <tr key={idx2} style={{ borderBottom: '1px solid #eee' }}>
                          <td style={{ padding: '15px', fontWeight: 'bold' }}>{materia.nombre_materia}</td>
                          <td style={{ padding: '15px', textAlign: 'center' }}>{saber}</td>
                          <td style={{ padding: '15px', textAlign: 'center' }}>{hacer}</td>
                          <td style={{ 
                            padding: '15px', 
                            textAlign: 'center', 
                            fontWeight: 'bold',
                            color: analisis.color 
                          }}>
                            {total}
                          </td>
                          <td style={{ padding: '15px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px' }}>
                              {analisis.icono}
                              <span style={{ color: analisis.color, fontWeight: 'bold' }}>
                                {analisis.nivel}
                              </span>
                            </div>
                            <div style={{ fontSize: '0.85rem', color: '#666' }}>
                              {analisis.recomendaciones.slice(0, 2).join(', ')}
                            </div>
                          </td>
                          <td style={{ padding: '15px' }}>
                            {typeof prediccion === 'object' ? (
                              <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px' }}>
                                  {prediccion.icono}
                                  <span style={{ color: prediccion.color, fontWeight: 'bold' }}>
                                    {prediccion.tendencia}
                                  </span>
                                </div>
                                <div style={{ fontSize: '0.85rem', color: '#666' }}>
                                  Próx. trimestre: {prediccion.prediccion}
                                </div>
                                <div style={{ fontSize: '0.8rem', color: '#888' }}>
                                  Prob. éxito: {prediccion.probabilidadExito.toFixed(0)}%
                                </div>
                              </div>
                            ) : (
                              <span style={{ color: '#888', fontSize: '0.85rem' }}>{prediccion}</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ))}

          {vistaActual === 'evolucion' && (
            <div style={{ 
              background: 'white', 
              padding: '30px', 
              borderRadius: '15px', 
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)' 
            }}>
              <h3 style={{ marginBottom: '20px', color: '#333' }}>📈 Evolución del Rendimiento por Trimestre</h3>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={prepararDatosEvolucion()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="trimestre" />
                  <YAxis domain={[0, 40]} />
                  <Tooltip />
                  <Legend />
                  {[...new Set(datosJSON.map(d => d.nombre_materia))].map((materia, idx) => (
                    <Line 
                      key={materia}
                      type="monotone" 
                      dataKey={materia} 
                      stroke={colores[idx % colores.length]}
                      strokeWidth={3}
                      dot={{ r: 6 }}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {vistaActual === 'comparativo' && (
            <div style={{ 
              background: 'white', 
              padding: '30px', 
              borderRadius: '15px', 
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)' 
            }}>
              <h3 style={{ marginBottom: '20px', color: '#333' }}>📊 Comparativo Saber vs Hacer (Último Trimestre)</h3>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={prepararDatosRadar()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="materia" />
                  <YAxis domain={[0, 20]} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Saber" fill="#8884d8" name="Saber" />
                  <Bar dataKey="Hacer" fill="#82ca9d" name="Hacer" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {vistaActual === 'radar' && (
            <div style={{ 
              background: 'white', 
              padding: '30px', 
              borderRadius: '15px', 
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)' 
            }}>
              <h3 style={{ marginBottom: '20px', color: '#333' }}>🎯 Análisis Multidimensional (Último Trimestre)</h3>
              <ResponsiveContainer width="100%" height={400}>
                <RadarChart data={prepararDatosRadar()}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="materia" />
                  <PolarRadiusAxis domain={[0, 20]} />
                  <Radar name="Saber" dataKey="saber" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                  <Radar name="Hacer" dataKey="hacer" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.3} />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default LibretaIA;