import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";


import Home from "./pages/home.jsx";
import Login from "./pages/login/login.jsx";
import Register from "./pages/registro/registro.jsx";
import AdminPanel from './pages/admin/AdminPanel.jsx';
import { setAuthToken } from "./servicios/axios";	
import Citas from "./pages/citas/citas.jsx";
import ImprimirComprobante from "./pages/citas/ImprimirComprobante.jsx";

const token = localStorage.getItem("token");
if (token) setAuthToken(token);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Register/>}/>
        <Route path="/admin" element={<AdminPanel />}/>
        <Route path="/citas" element={<Citas/>}/>
        <Route path="/comprobante/:id" element={<ImprimirComprobante/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;