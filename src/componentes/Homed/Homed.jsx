import React, { useState, useEffect } from "react";
import { Routes, Route, Outlet, useNavigate } from "react-router-dom";
import Home from "../paginas/User/Home";
import CustomNavbar from "../navbar/CustomNavbar";
import PerfilUsuarioPage from "../paginas/User/PerfilUsuarioPage";
import UsuarioPage from "../paginas/User/UsuarioPage";
import BitacoraPage from "../paginas/User/BitacoraPage";
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
                    <Route path="*" element={<div>No encontrado</div>} />
                </Routes>
                <Outlet />
            </div>
        </div>
    );
};
