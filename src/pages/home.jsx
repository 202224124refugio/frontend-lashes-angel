import React from 'react';
// Asegúrate de que Link esté importado
import { Link } from 'react-router-dom';
import './homeStyle.css';

// Componente SVG (sin cambios)
const PlaceholderSvg = ({ width = 300, height = 250, text = "Imagen Servicio" }) => (
  <svg 
    width="100%" 
    height={height} 
    viewBox={`0 0 ${width} ${height}`} 
    xmlns="http://www.w3.org/2000/svg" 
    style={{ background: '#e9e9e9', color: '#aaa', border: '1px solid #ddd' }}
  >
    <text 
      x="50%" 
      y="50%" 
      dominantBaseline="middle" 
      textAnchor="middle" 
      fontFamily="Arial, sans-serif" 
      fontSize="16"
      fill="#888"
    >
      {text}
    </text>
  </svg>
);


const Home = () => {
  return (
    <div className="home-container">
      {/* Banner Superior  */}
      <div className="top-banner">
        Reserva tu cita en línea y descubre nuestra Magia {'>'}
      </div>

      {/* 2. Encabezado Principal */}
      <header className="home-header">
        <div className="logo">
          Studio Lashista
        </div>
        <nav className="main-nav">
          {/* CAMBIADO: <a href> por <Link to> */}
          <Link to="/login" className="nav-button">Iniciar Sesión</Link>
          <Link to="/registro" className="nav-button secondary">Registro</Link>
          
          {/* CAMBIADO: <a href> por <Link to> */}
          <Link to="/citas" className="nav-button primary-cta">Agendar Cita</Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background-placeholder">
          <div className="hero-content">
            <h1>El Secreto de una Mirada Impactante</h1>
            <p>Descubre la perfección en cada pestaña.</p>
            <div className="hero-buttons">
              {/* CAMBIADO: <a href> por <Link to> */}
              <Link to="/citas" className="hero-btn primary">Agendar Cita</Link>
              <Link to="/servicios" className="hero-btn secondary">Ver Servicios</Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Sección de Accesos Rápidos */}
      <section className="quick-actions">
        
        {/* Catálogo de Productos */}
        <div className="action-card">
          <div className="action-icon">🛒</div>
          <h3>Catálogo de Productos</h3>
          <p>Encuentra los mejores productos para el cuidado de tus pestañas.</p>
          {/* CAMBIADO: <a href> por <Link to> */}
          <Link to="/productos" className="action-link">Ver catálogo completo</Link>
        </div>
        
        {/* Promociones */}
        <div className="action-card">
          <div className="action-icon">🔥</div>
          <h3>Promociones</h3>
          <p>Aprovecha nuestros descuentos y paquetes especiales del mes.</p>
          {/* CAMBIADO: <a href> por <Link to> */}
          <Link to="/promociones" className="action-link">Ver promociones</Link>
        </div>

        {/* Localización */}
        <div className="action-card">
          <div className="action-icon">📍</div>
          <h3>Nuestra Sucursal</h3>
          <p>Visítanos, estamos listos para atenderte. Encuentra cómo llegar.</p>
          {/* CAMBIADO: <a href> por <Link to> */}
          <Link to="/ubicacion" className="action-link">Visualizar localización</Link>
        </div>

      </section>

      {/* 5. Sección de Servicios */}
      <section className="services-section">
        <h2>Nuestros Servicios Destacados</h2>
        <div className="services-carousel">
          
          <div className="service-card">
            <PlaceholderSvg text="Lifting de Pestañas" />
            <h3>Lifting de Pestañas</h3>
            <p className="service-price">$800.00</p>
            {/* CAMBIADO: <a href> por <Link to> */}
            {/* Apunta a /citas (o /agendar si cambiaste la ruta) */}
            <Link to="/citas" className="service-btn">Agendar cita</Link>
          </div>
          
          <div className="service-card">
            <PlaceholderSvg text="Efecto Clásico" />
            <h3>Pestañas Clásicas</h3>
            <p className="service-price">$1,200.00</p>
            {/* CAMBIADO: <a href> por <Link to> */}
            <Link to="/citas" className="service-btn">Agendar cita</Link>
          </div>

          <div className="service-card">
            <PlaceholderSvg text="Volumen Ruso" />
            <h3>Volumen Ruso</h3>
            <p className="service-price">$1,700.00</p>
            {/* CAMBIADO: <a href> por <Link to> */}
            <Link to="/citas" className="service-btn">Agendar cita</Link>
          </div>

        </div>
      </section>

      {/* 6. Footer */}
      <footer className="home-footer">
        <p>© 2025 Studio Lashista. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
};

export default Home;