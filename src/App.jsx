import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/home.jsx";
import Login from "./pages/login/login.jsx";
import Register from "./pages/registro/registro.jsx";
import AdminPanel from './pages/admin/AdminPanel.jsx';
import { setAuthToken } from "./servicios/axios"; 
import Citas from "./pages/citas/citas.jsx";
import ImprimirComprobante from "./pages/citas/imprimirComprobante.jsx";
import RutaProtegida from './components/RutaProtegida'; // Importación correcta

// Restaurar sesión al recargar la página
const token = localStorage.getItem("token");
if (token) setAuthToken(token);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* --- RUTAS PÚBLICAS (Cualquiera entra) --- */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Register/>}/>

        {/* --- RUTAS PROTEGIDAS PARA ADMINISTRADORES --- */}
        {/* Solo usuarios con rol: 'admin' pasan por aquí */}
        <Route element={<RutaProtegida soloAdmin={true} />}>
             {/* NOTA: Asegúrate de que tu Login redirija a "/admin" si es admin */}
            <Route path="/admin" element={<AdminPanel />}/>
        </Route>

        {/* --- RUTAS PROTEGIDAS PARA CLIENTES (Y ADMINS) --- */}
        {/* Cualquier usuario logueado puede entrar aquí */}
        <Route element={<RutaProtegida soloAdmin={false} />}>
            <Route path="/citas" element={<Citas/>}/>
            <Route path="/comprobante/:id" element={<ImprimirComprobante/>}/>
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;