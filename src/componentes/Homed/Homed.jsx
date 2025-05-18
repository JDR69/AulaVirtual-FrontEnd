import React, { useState, useEffect } from "react";
import { Routes, Route, Outlet, useNavigate } from "react-router-dom";
import { Home } from "../paginas/User/Home";
import CustomNavbar from "../navbar/CustomNavbar";
import PerfilUsuarioPage from "../paginas/User/PerfilUsuarioPage";
import UsuarioPage from "../paginas/User/UsuarioPage";
import BitacoraPage from "../paginas/User/BitacoraPage";
import PermisoPage from "../paginas/User/PermisoPage";
import GestionAlumno from "../paginas/User/GestionAlumno";
import GestionAcademico from "../paginas/Academico/GestionAcademico";
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
                    <Route path="/perfil-usuario" element={<PerfilUsuarioPage />} />
                    <Route path="/detalle-usuario" element={<UsuarioPage />} />
                    <Route path="/bitacora" element={<BitacoraPage />} />
                    <Route path="/permiso-usuario" element={<PermisoPage />} />
                    <Route path="/detalle-academica" element={<GestionAcademico />} />

                    <Route path="/gestion-alumno" element={<GestionAlumno />} />
                    <Route path="*" element={<div>No encontrado</div>} />
                </Routes>
                <Outlet />
            </div>
        </div>
    );
};
