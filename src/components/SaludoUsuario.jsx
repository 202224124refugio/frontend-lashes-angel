import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx'; // Ajusta la ruta a tu AuthContext y añado .jsx
import './SaludoUsuario.css'; // Crea un archivo CSS para darle estilo

const SaludoUsuario = () => {
    // 1. Obtén los datos del contexto
    const { authData, logout } = useAuth();

    // 2. Si no hay datos (nadie logueado), no muestres nada o muestra "Login"
    if (!authData) {
        return (
            <div className="saludo-container">
                <Link to="/login" className="saludo-link">Iniciar Sesión</Link>
            </div>
        );
    }

    // 3. Si hay datos, muestra el nombre y el botón de logout
    return (
        <div className="saludo-container">
            <span className="saludo-texto">Hola, {authData.usuario.nombre}</span>
            <button onClick={logout} className="saludo-logout-btn">
                Cerrar Sesión
            </button>
        </div>
    );
};



export default SaludoUsuario;