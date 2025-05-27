import React, { useEffect, useState } from 'react';
import '../../css/DarboardProfesor.css';
import { useAuth } from '../../../context/AuthContext';
import { obtenerDetalleMateriaProfesorRequest } from '../../../api/auth';
import { useNavigate } from 'react-router-dom';

const DasboardProfesor = () => {
    const { materiaProfesor, setMateriaProfesor, setCursoYParalelo, user, cargarGestion } = useAuth();
    const [materiasB, setMateriasB] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (materiaProfesor && !window.location.pathname.includes('/homeda')) {
            navigate('/dasboard/homeda');
            return;
        }

        if (user && user.id) {
            fetchUsuarios();
        }
    }, [user, materiaProfesor, navigate]);

    const fetchUsuarios = async () => {
        try {
            setLoading(true);
            console.log("Obteniendo materias para el profesor:", user.id);
            const res = await obtenerDetalleMateriaProfesorRequest(user.id);
            await cargarGestion(); // Cargar la gestión más reciente desde el contexto
            setMateriasB(res.data);
            setLoading(false);
        } catch (error) {
            console.error('Error al obtener usuarios:', error);
            setLoading(false);
        }
    };

    const handleCourseSelection = (mat) => {
        console.log("Curso seleccionado:", mat);
        setMateriaProfesor(mat);
        setCursoYParalelo({
            materia: mat.descripcion.materia_nombre,
            curso: mat.horarios.nombre_curso,
            paralelo: mat.horarios.descripcion_paralelo,
        });
        navigate('/dasboard/homeda');
    };

    return (
        <div className='contenedor-principal'>
            <div className='contenedor-secundario'>
                <div className="dashboard-container">
                    <h1 className="dashboard-title">Seleccionar el Curso</h1>

                    {loading ? (
                        <div className="d-flex justify-content-center">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Cargando...</span>
                            </div>
                        </div>
                    ) : materiasB.length === 0 ? (
                        <div className="alert alert-info">
                            No hay cursos asignados para este profesor.
                        </div>
                    ) : (
                        <div className="cards-container">
                            {materiasB.map((mat, index) => (
                                <div
                                    key={index}
                                    className="card2"
                                    onClick={() => handleCourseSelection(mat)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <h2 className="card-title">
                                        {mat.descripcion.materia_nombre} - Curso: {mat.horarios.nombre_curso} {mat.horarios.descripcion_paralelo}
                                    </h2>
                                    <p><strong>Horario:</strong> {mat.horarios.hora_inicial} - {mat.horarios.hora_final}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DasboardProfesor;