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

// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../../../context/AuthContext';
// import '../../css/Homedas.css'
// import GraficasDashboard from './GraficasDashboard';

// export const Home = () => {
//   const { usuarios } = useAuth();
//   const navigate = useNavigate();

//   // Verificar si el usuario tiene el rol de profesor
//   const esProfesor = usuarios && usuarios.idRol === 2; // Asumiendo que el id de rol para profesor es 2
//   // También podrías verificar por nombre: usuarios && usuarios.rol === "profesor"

//   // Función para manejar la navegación con validación de rol
//   const handleNavigate = (path) => {
//     if (esProfesor) {
//       navigate(path);
//     } else {
//       // Mostrar mensaje si no es profesor
//       alert("Solo los profesores tienen acceso a esta función");
//     }
//   };

//   return (
//     <div className='contenedor-principal'>
//       <div className='contenedor-secundario'>
//         <div className="containerHome">
//           <div 
//             onClick={() => handleNavigate("/dasboard/vehiculos")}
//             className={!esProfesor ? "disabled-item" : ""}
//           >
//             <i className="bi bi-bookmark-star-fill"></i>
//             <h2>Academico</h2>
//           </div>
//           <div 
//             onClick={() => handleNavigate("/dasboard/usuarios")}
//             className={!esProfesor ? "disabled-item" : ""}
//           >
//             <i className="bi bi-person-vcard"></i>
//             <h2>Usuarios</h2>
//           </div>
//           <div 
//             onClick={() => handleNavigate("/dasboard/regisChofer")}
//             className={!esProfesor ? "disabled-item" : ""}
//           >
//             <i className="bi bi-calendar2-week"></i>
//             <h2>Evaluacion</h2>
//           </div>
//           <div 
//             onClick={() => handleNavigate("/dasboard/seguros")}
//             className={!esProfesor ? "disabled-item" : ""}
//           >
//             <i className="bi bi-file-earmark-text-fill"></i>
//             <h2>Periodos</h2>
//           </div>
//         </div>
//         <GraficasDashboard />
//       </div>
//     </div>
//   );
// };