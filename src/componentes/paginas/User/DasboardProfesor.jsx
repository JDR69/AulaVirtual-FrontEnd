import React, { useEffect, useState } from 'react'
import '../../css/DarboardProfesor.css'
import { useAuth } from '../../../context/AuthContext'
import { obtenerDetalleMateriaProfesorRequest } from '../../../api/auth'

const DasboardProfesor = () => {
    const { materiaProfesor, setMateriaProfesor, user } = useAuth();
    const [materiasB, setMateriasB] = useState([])
    const materias = [
        {
            materia: 'Matemáticas',
            grupo: 'A',
            dia: 'Lunes',
            hora_inicio: '08:00',
            hora_fin: '09:30',
        },
        {
            materia: 'Física',
            grupo: 'B',
            dia: 'Martes',
            hora_inicio: '10:00',
            hora_fin: '11:30',
        },
        {
            materia: 'Química',
            grupo: 'C',
            dia: 'Miércoles',
            hora_inicio: '13:00',
            hora_fin: '14:30',
        },
    ]

    useEffect(() => {
        if (user && user.id) {
            fetchUsuarios();
        }
    }, [user]);


    const fetchUsuarios = async () => {
        try {
            console.log(user)
            const res = await obtenerDetalleMateriaProfesorRequest(user.id);
            console.log(res.data)
            setMateriasB(res.data)
        } catch (error) {
            console.error('Error al obtener usuarios:', error);
        }
    };

    return (
        <div className='contenedor-principal'>
            <div className='contenedor-secundario'>
                <div className="dashboard-container">
                    <h1 className="dashboard-title">Seleccionar el Curso</h1>
                    <div className="cards-container">
                        {materiasB.map((mat, index) => (
                            <div key={index} className="card" onClick={() => setMateriaProfesor(mat)}>
                                <h2 className="card-title">
                                    {mat.descripcion.materia_nombre} - Curso: {mat.horarios.nombre_curso}  {mat.horarios.descripcion_paralelo}
                                </h2>
                                <p><strong>Horario:</strong> {mat.horarios.hora_inicial} - {mat.horarios.hora_final}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {/* <div className="form-gris">
                <div className="d-flex justify-content-center">
                    <div className="spinner-border text-light" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </div> */}

        </div>
    )
}

export default DasboardProfesor
