import React from 'react';
import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../../context/AuthContext';
import '../../css/Homedas.css'
import GraficasDashboard from './GraficasDashboard';
export const Home = () => {

  // const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className='contenedor-principal'>
      <div className='contenedor-secundario'>
        <div className="containerHome">
          <div onClick={() => navigate("/profesor/asistencia")}>
          <i className="bi bi-bookmark-star-fill"></i>
            <h2>Asistencia</h2>
          </div>
          <div onClick={() => navigate("/profesor/actividades")}>
            <i className="bi bi-person-vcard"></i>
            <h2>Actividades</h2>
          </div>
          <div onClick={() => navigate("/profesor/calificaciones")}>
          <i className="bi bi-calendar2-week"></i>
            <h2>Calificaciones</h2>
          </div>
          <div onClick={() => navigate("/profesor/participacion")}>
            <i className="bi bi-file-earmark-text-fill"></i>
            <h2>participacion</h2>
          </div>
        </div>
        <GraficasDashboard />
      </div>
    </div>
  );
};

