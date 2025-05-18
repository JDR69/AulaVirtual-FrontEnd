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
          <div onClick={() => navigate("/dasboard/vehiculos")}>
          <i className="bi bi-bookmark-star-fill"></i>
            <h2>Academico</h2>
          </div>
          <div onClick={() => navigate("/dasboard/usuarios")}>
            <i className="bi bi-person-vcard"></i>
            <h2>Usuarios</h2>
          </div>
          <div onClick={() => navigate("/dasboard/regisChofer")}>
          <i className="bi bi-calendar2-week"></i>
            <h2>Evaluacion</h2>
          </div>
          <div onClick={() => navigate("/dasboard/seguros")}>
            <i className="bi bi-file-earmark-text-fill"></i>
            <h2>Periodos</h2>
          </div>
        </div>
        <GraficasDashboard />
      </div>
    </div>
  );
};
