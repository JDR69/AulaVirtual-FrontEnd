import React from 'react'
import '../../css/DarboardProfesor.css'
import { useAuth } from '../../../context/AuthContext'

const DasboardProfesor = () => {
    const {materiaProfesor,setMateriaProfesor} = useAuth();
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

    return (
        <div className='contenedor-principal'>
            <div className='contenedor-secundario'>
                <div className="dashboard-container">
                    <h1 className="dashboard-title">Seleccionar el Curso</h1>
                    <div className="cards-container">
                        {materias.map((item, index) => (
                            <div key={index} className="card" onClick={()=> setMateriaProfesor("hola")}>
                                <h2 className="card-title">
                                    {item.materia} - Grupo {item.grupo}
                                </h2>
                                <p><strong>Día:</strong> {item.dia}</p>
                                <p><strong>Horario:</strong> {item.hora_inicio} - {item.hora_fin}</p>
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
