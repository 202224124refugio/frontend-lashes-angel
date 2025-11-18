import React, { createContext, useContext, useState, useEffect } from 'react';

// 1. Crear el Contexto
const AuthContext = createContext(null);

// 2. Crear el Proveedor del Contexto
// Este componente envolverá tu aplicación
export const AuthProvider = ({ children }) => {
    
    // 3. Estado para guardar el token y los datos del usuario
    const [authData, setAuthData] = useState(null);

    // 4. useEffect para cargar los datos al iniciar la app
    // Esto revisa si ya había una sesión guardada en localStorage
    useEffect(() => {
        const storedData = localStorage.getItem('authData');
        if (storedData) {
            setAuthData(JSON.parse(storedData));
        }
    }, []);

    // 5. Función de Login
    // Esta función será llamada por tu componente de Login
    const login = (data) => {
        // Asumimos que 'data' es lo que nos devuelve el backend: { token, usuario }
        setAuthData(data);
        // Guardamos en localStorage para persistir la sesión
        localStorage.setItem('authData', JSON.stringify(data));
    };

    // 6. Función de Logout
    const logout = () => {
        setAuthData(null);
        localStorage.removeItem('authData');
        // Aquí podrías redirigir al home si lo deseas
        // window.location.href = '/'; 
    };

    // 7. Pasamos el estado y las funciones al "value" del proveedor
    const value = {
        authData,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// 8. Hook personalizado para consumir el contexto fácilmente
// En lugar de importar useContext(AuthContext) en todos lados,
// solo importaremos useAuth()
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }
    return context;
};