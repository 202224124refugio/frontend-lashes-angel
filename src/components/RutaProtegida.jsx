import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const RutaProtegida = ({ soloAdmin = false }) => {
    const token = localStorage.getItem('token');
    const usuarioStr = localStorage.getItem('usuario');
    const usuario = usuarioStr ? JSON.parse(usuarioStr) : null;

    // 1. Si no hay token, adiós.
    if (!token) {
        return <Navigate to="/" replace />;
    }


    if (soloAdmin) {
        if (usuario?.rol !== 'admin') {
            return <Navigate to="/" replace />;
        }
    }

    return <Outlet />;
};

export default RutaProtegida;