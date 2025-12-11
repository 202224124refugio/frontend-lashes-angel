import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";
import { apiLashes, setAuthToken } from "../../servicios/axios";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    correo: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const { correo, password } = formData;

      const response = await apiLashes.post("/usuarios/login", {
        correo,
        password,
      });

      // 🔍 LOGS PARA VER LO QUE LLEGA DESDE EL BACKEND
      console.log("📩 Datos completos recibidos del backend:", response.data);

      if (response.status === 200) {
        const { token, usuario } = response.data;

        console.log("🔑 Token recibido:", token);
        console.log("👤 Usuario recibido:", usuario);

        localStorage.setItem("token", token);
        localStorage.setItem("usuario", JSON.stringify(usuario));

        setAuthToken(token);

        // 🔍 Saber a qué página redirige según rol
        if (usuario.rol === "admin") {
          console.log("➡️ Rol admin detectado. Redirigiendo a /admin");
          navigate("/admin");
        } else {
          console.log("➡️ Usuario normal. Redirigiendo a /");
          navigate("/");
        }
      }
    } catch (err) {
      console.error("❌ Error al iniciar sesión:", err);
      setError("Correo o contraseña incorrectos. Intenta de nuevo.");
    }
  };

  return (
    <div className="contenedor-app">
      <div className="imagen"></div>

      <div className="app">
        <div className="login-form-wrapper">
          <form className="login-form" onSubmit={handleSubmit}>
            <h2 className="nombre-pagina">Iniciar Sesión</h2>
            <p className="descripcion-pagina">
              Ingresa a tu cuenta para gestionar tus citas.
            </p>

            {/* Correo */}
            <div className="campo2">
              <label htmlFor="correo">Correo Electrónico</label>
              <input
                type="email"
                id="correo"
                name="correo"
                placeholder="tu@correo.com"
                value={formData.correo}
                onChange={handleChange}
                required
              />
            </div>

            {/* Contraseña */}
            <div className="campo2">
              <label htmlFor="password">Contraseña</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            {/* Error */}
            {error && <p className="error-message">{error}</p>}

            {/* Botón */}
            <button type="submit" className="boton2">
              Entrar
            </button>

            <div className="acciones">
              <a href="../">Volver a la página principal</a>
              <a href="/registro">¿Aún no tienes una cuenta? Crear una</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
