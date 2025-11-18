import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";
import { apiLashes, setAuthToken } from "../../servicios/axios";

const Login = () => {0
  const navigate = useNavigate();

  // Estado para los datos del formulario
  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    password: "",
  });

  const [error, setError] = useState("");

  // Lista de correos administrativos
  const adminEmails = [
    "studiolashesadmmi_operator_1@gmail.com",
    "studiolashesadmmi_operator_2@gmail.com",
    "studiolashesadmmi_operator_3@gmail.com",
  ];

  // Manejar cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Enviar formulario
  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const { correo, password } = formData;

    const response = await apiLashes.post("/usuarios/login", {
      correo,
      password,
    });

    if (response.status === 200) {
      const { token, usuario } = response.data;

      // Guardar token y usuario
      localStorage.setItem("token", token);
      localStorage.setItem("usuario", JSON.stringify(usuario));

      // Configurar Axios para enviar token en futuras peticiones
      setAuthToken(token);

      // Redirigir según rol
      if (usuario.isAdmin) navigate("/admin");
      else navigate("/");
    }
  } catch (err) {
    console.error("❌ Error al iniciar sesión:", err);
    setError("Correo o contraseña incorrectos. Intenta de nuevo.");
  }
};

  return (
    <div className="login-page-container">
      <header className="login-header">
        <a href="/" className="login-logo">
          Studio Lashista
        </a>
      </header>

      <div className="login-form-wrapper">
        <form className="login-form" onSubmit={handleSubmit}>
          <h2>Iniciar Sesión</h2>
          <p className="login-subtitle">
            Ingresa a tu cuenta para gestionar tus citas.
          </p>

          {/* Campo: Nombre */}
          <div className="input-group">
            <label htmlFor="nombre">Nombre</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              placeholder="Tu nombre completo"
              value={formData.nombre}
              onChange={handleChange}
              required
            />
          </div>

          {/* Campo: Correo Electrónico */}
          <div className="input-group">
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

          {/* Campo: Contraseña */}
          <div className="input-group">
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

          {/* Mostrar mensaje de error */}
          {error && <p className="error-message">{error}</p>}

          {/* Botón */}
          <button type="submit" className="login-submit-btn">
            Entrar
          </button>

          <div className="login-footer-link">
            ¿No tienes cuenta? <a href="/register">Regístrate aquí</a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
