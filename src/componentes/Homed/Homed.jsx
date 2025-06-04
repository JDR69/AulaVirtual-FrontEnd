import React, { useState, useEffect } from "react";
import { Routes, Route, Outlet, useNavigate } from "react-router-dom";
import { Home } from "../paginas/User/Home";
import CustomNavbar from "../navbar/CustomNavbar";

{/* Rutas de usuario */ }
import PerfilUsuarioPage from "../paginas/User/PerfilUsuarioPage";
import UsuarioPage from "../paginas/User/UsuarioPage";
import BitacoraPage from "../paginas/User/BitacoraPage";
import PermisoPage from "../paginas/User/PermisoPage";
import GestionUsuario from "../paginas/User/GestionUsuario";
import DasboardProfesor from "../paginas/User/DasboardProfesor";

{/* Rutas de Academico */ }
import GestionAcademico from "../paginas/Academico/GestionAcademico";
import DetalleCursoPage from "../paginas/Academico/DetalleCursoPage";
import DetalleMateriaPage from "../paginas/Academico/DetalleMateriaPage";
import GestionarAlumnosPage from "../paginas/Academico/GestionarAlumnosPage";

{/* Rutas de Evaluacion */ }
import ActividadesPage from "../paginas/Evaluacion/ActividadesPage";
import CalificacionesPage from "../paginas/Evaluacion/CalificacionesPage";

{/* Rutas de Periodo */ }
import ParticipacionPage from "../paginas/Periodo/ParticipacionPage";
import NotificacionesPage from "../paginas/Periodo/NotificacionesPage";
import AsistenciaPage from "../paginas/Evaluacion/AsistenciaPage";
import AsistenciaDirector from "../paginas/Evaluacion/AsistenciaDirector";
import CrearNotificacionPage from "../paginas/Periodo/CrearNotificacionPage";
import Gestiones from "../paginas/Periodo/Gestiones";
import LibretaPage from "../paginas/Periodo/LibretaPage";
import TipoActividadPage from "../paginas/Evaluacion/TipoActividadPage";
import LibretaIA from "../paginas/Periodo/LibretaIA";

import SeleccionarGestionPage from "../paginas/Periodo/SeleccionarGestionPage";
import StudentAttendancePredictor from "../paginas/Periodo/AsistenciaIAPage";
import Licencias from "../paginas/Periodo/Licencias";



export const Homed = () => {
    //   const navigate = useNavigate();


    //   useEffect(() => {

    //     const userLocal = localStorage.getItem('user');
    //     if (userLocal?.length === 0 || userLocal === null) {
    //       console.log("No hay usuario");
    //       navigate("/login");
    //     }
    //   }, []);

    return (
        <div >
            <CustomNavbar />
            <div >
                <Routes>

                    <Route path="/homeda" element={<Home />} />
                    {/* Rutas de usuario */}
                    <Route path="/perfil-usuario" element={<PerfilUsuarioPage />} />
                    <Route path="/detalle-usuario" element={<UsuarioPage />} />
                    <Route path="/bitacora" element={<BitacoraPage />} />
                    <Route path="/permiso-usuario" element={<PermisoPage />} />
                    <Route path="/gestion-usuario" element={<GestionUsuario />} />
                    <Route path="/seleccionar-curso" element={<DasboardProfesor />} />
                    {/* Rutas de Academico */}
                    <Route path="/detalle-academica" element={<GestionAcademico />} />
                    <Route path="/detalle-curso" element={<DetalleCursoPage />} />
                    <Route path="/detalle-materia" element={<DetalleMateriaPage />} />
                    <Route path="/detalle-alumnos-gestion" element={<GestionarAlumnosPage />} />

                    {/* Rutas de Evaluacion */}
                    <Route path="/actividades" element={<ActividadesPage />} />
                    <Route path="/tipo-actividad" element={<TipoActividadPage />} />
                    <Route path="/calificaciones" element={<CalificacionesPage />} />
                    <Route path="/asistencia" element={<AsistenciaDirector />} />


                    {/* Rutas de Periodo */}
                    <Route path="/participacion" element={<ParticipacionPage />} />
                    <Route path="/notificacion" element={<NotificacionesPage />} />
                    <Route path="/crear-notificacion" element={<CrearNotificacionPage />} />
                    <Route path="/gestiones" element={<Gestiones />} />
                    <Route path="/libreta" element={<LibretaPage />} />
                    <Route path="/licencias" element={<Licencias />} />
                

                    <Route path="/libretaIA" element={<LibretaIA />} />
                    <Route path="/asistencia-ai" element={<StudentAttendancePredictor />} />


                    <Route path="/seleccionar-gestion" element={<SeleccionarGestionPage/>} />
                    <Route path="/asistencia-profesor" element={<AsistenciaPage/>} />
                    




                    <Route path="*" element={<div>No encontrado</div>} />

                </Routes>
                <Outlet />
            </div>
        </div>
    );
};
