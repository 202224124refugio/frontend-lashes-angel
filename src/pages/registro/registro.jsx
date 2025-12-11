import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiLashes } from "../../servicios/axios";

const Register = () => {

  const [nombre, setNombre] = useState('');
  const [correo, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');


  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();


    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);
    setError('');

    try {

      const payload = {
        nombre: nombre,
        correo: correo,
        password: password

      };


      const response = await apiLashes.post('/usuarios/crear-usuario', payload);

      console.log('Respuesta del servidor:', response.data);
      setLoading(false);


      alert('¡Usuario registrado con éxito! Serás redirigido al inicio de sesión.');
      navigate('/login');

    } catch (err) {

      setLoading(false);
      console.error('Error en el registro:', err);


      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Error al registrar el usuario. Inténtalo de nuevo.');
      }
    }
  };

  return (

    <div className="contenedor-app">
      <div className="imagen"></div>

      <div className="app">
        <div className="login-form-wrapper">
          {/* --- 9. Conectar el formulario al handleSubmit --- */}
          <form className="login-form" onSubmit={handleSubmit}>
            <h2 className="nombre-pagina">Crear Cuenta</h2>
            <p className="descripcion-pagina">
              Regístrate para poder agendar tu cita.
            </p>

            {/* Campo: Nombre */}
            <div className="campo2">
              <label htmlFor="nombre">Nombre</label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                placeholder="Tu nombre completo"
                required
                value={nombre} // <-- 10. Conectar al estado
                onChange={(e) => setNombre(e.target.value)} // <-- 11. Actualizar estado
              />
            </div>

            {/* Campo: Correo Electrónico */}
            <div className="campo2">
              <label htmlFor="correo">Correo Electrónico</label>
              <input
                type="email"
                id="correo"
                name="correo"
                placeholder="tu@correo.com"
                required
                value={correo} // <-- 10. Conectar al estado
                onChange={(e) => setEmail(e.target.value)} // <-- 11. Actualizar estado
              />
            </div>

            {/* Campo: Contraseña */}
            <div className="campo2">
              <label htmlFor="password">Contraseña</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="••••••••"
                required
                value={password} // <-- 10. Conectar al estado
                onChange={(e) => setPassword(e.target.value)} // <-- 11. Actualizar estado
              />
            </div>

            {/* Campo: Confirmar Contraseña */}
            <div className="campo2">
              <label htmlFor="confirm-password">Confirmar Contraseña</label>
              <input
                type="password"
                id="confirm-password"
                name="confirm-password"
                placeholder="••••••••"
                required
                value={confirmPassword} // <-- 10. Conectar al estado
                onChange={(e) => setConfirmPassword(e.target.value)} // <-- 11. Actualizar estado
              />
            </div>

            {/* --- 12. Mostrar mensaje de error si existe --- */}
            {error && <p className="error-message">{error}</p>}

            {/* Botón de envío */}
            {/* --- 13. Deshabilitar botón mientras carga --- */}
            <button
              type="submit"
              className="boton2"
              disabled={loading} // <-- Deshabilitado si está cargando
            >
              {loading ? 'Registrando...' : 'Registrarme'}
            </button>

            {/* Enlace a Login */}
            <div className="acciones">
              <Link to="../">Volver a la página principal</Link>
              <Link to="/login">¿Ya tienes cuenta? Inicia Sesión aquí</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;