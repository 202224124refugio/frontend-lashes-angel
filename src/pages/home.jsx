import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './home.css';

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
  const navigate = useNavigate();
  // Estado para saber si el usuario está logueado
  const [usuarioLogueado, setUsuarioLogueado] = useState(false);

  // 1. Verificar sesión al cargar la página
  useEffect(() => {
    const token = localStorage.getItem('token');
    // Si token existe es true, si es null es false
    setUsuarioLogueado(!!token);
  }, []);

  // 2. Función para Cerrar Sesión
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    setUsuarioLogueado(false); // Actualiza la vista inmediatamente
    navigate('/'); // Opcional: Recarga el home o manda al login
  };

  return (
    <div className="home-container">

      {/* Encabezado Principal */}
      <header className="home-header">
        <h1 className="titulo">StudioLash <span> beautiful</span> </h1>
      </header>
      <div className='nav-bg'>
        <nav className="navegacion-principal contenedor">
          {/* --- RENDERIZADO CONDICIONAL --- */}
          {usuarioLogueado ? (
            /* OPCIÓN A: USUARIO LOGUEADO (Ve Agendar y Salir) */
            <>
              <Link to="/citas" className="...">Agendar Cita</Link>

              {/* Botón Cerrar Sesión (Estilizado como link secundario o botón rojo) */}
              <button
                onClick={handleLogout}
                className="..."
              /*style={{ cursor: 'pointer', border: 'none', background: '#ffebee', color: '#d32f2f' }}*/
              >
                Cerrar Sesión
              </button>
            </>
          ) : (
            /* OPCIÓN B: NO LOGUEADO (Ve Login y Registro) */
            <>
              <Link to="/login" className="nav-button">Iniciar Sesión</Link>
              <Link to="/registro" className="nav-button secondary">Registro</Link>
            </>
          )}
        </nav>
      </div>

      {/* Hero Section */}

      <section className="hero">
        <div className="contenido-hero">
          <div className="hero-background-placeholder">
            <div className="hero-content">
              <h2>El Secreto de una Mirada Impactante</h2>

              <div className="ubicacion">
                <svg xmlns="http://www.w3.org/2000/svg" width="88" height="88" viewBox="0 0 24 24" fill="none"
                  stroke="#C0857D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                  class="icon icon-tabler icons-tabler-outline icon-tabler-eye-closed">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M21 9c-2.4 2.667 -5.4 4 -9 4c-3.6 0 -6.6 -1.333 -9 -4" />
                  <path d="M3 15l2.5 -3.8" />
                  <path d="M21 14.976l-2.492 -3.776" />
                  <path d="M9 17l.5 -4" />
                  <path d="M15 17l-.5 -4" />
                </svg>
                <p>Descubre la perfección en cada pestaña</p>
              </div>
              {/*
              <div className="hero-buttons">
                {/* Aquí también aplicamos la lógica: Si no está logueado, lo mandamos a registrarse o loguearse 
              {usuarioLogueado ? (
                <Link to="/citas" className="boton">Agendar Cita</Link>
              ) : (
                <Link to="/login" className="boton">Iniciar Sesión para Agendar</Link>
              )}
            </div>
              */}
            </div>
          </div>
        </div>
      </section >


      {/* Sección de Accesos Rápidos */}
      < main className="contenedor sombra" >
        <h2>Catálogo</h2>
        <section className="quick-actions">

          {/* Catálogo de Productos */}

          <section className="servicio">
            <h3> Pestañas Clasicas</h3>
            <div className="action-icon"></div>
            <img
              src="https://carolinarodriguez.cl/wp-content/uploads/2021/11/pestanas-11.jpg"
              alt="Pestañas clasicas"
              className="mi-imagen"
            />
            <div className="descripcion-img">
              <p>Las extensiones de pestañas clásicas consisten en aplicar una extensión por cada pestaña natural, creando un realce natural y sutil que aporta longitud y una suave curvatura. Este estilo es perfecto para quienes buscan un efecto similar al de la máscara de pestañas sin el esfuerzo diario de maquillarse. Las pestañas clásicas proporcionan una mirada elegante y discreta, ideal para el día a día.</p>
            </div>
          </section>

          <section className="servicio">
            <h3> Pestañas hibridas</h3>
            <div className="action-icon"></div>
            <img
              src="https://sobeautybycarmela.com/cdn/shop/products/extensionesdepestanashibridas.png?v=1672929534&width=823"
              alt="Pestañas hibridas"
              className="mi-imagen"
            />
            <div className="descripcion-img">
              <p>Las pestañas híbridas son el punto medio perfecto entre las pestañas clásicas y las de volumen, ya que ofrecen una elegancia natural con un toque dramático. Las pestañas híbridas se crean con una mezcla 50/50 de pestañas clásicas y extensiones de volumen, aunque las proporciones pueden ajustarse según el resultado final deseado por la clienta.</p>
            </div>
          </section>


          <section className="servicio">
            <h3> Pestañas rimel</h3>
            <div className="action-icon"></div>
            <img
              src="https://i0.wp.com/romaly.cl/wp-content/uploads/2024/08/Pestanas-efecto-rimel-1.jpg?fit=800%2C800&ssl=1"
              alt="Pestañas rimel"
              className="mi-imagen"
            />
            <div className="descripcion-img">
              <p>Las pestañas efecto rímel son un tipo de extensiones de pestañas diseñadas para imitar el aspecto de las pestañas cubiertas con varias capas de máscara de pestañas. Estas extensiones suelen tener una apariencia más dramática y voluminosa, con un acabado similar al que se lograría con una máscara de pestañas de efecto rímel, son ideales para aquellas personas que desean un look más llamativo y dramático, perfecto para ocasiones especiales o para quienes prefieren un estilo de maquillaje más audaz en su día a día.</p>
            </div>
          </section>

          <section className="servicio">
            <h3> Pestañas wispy</h3>
            <div className="action-icon"></div>
            <img
              src="https://lashury.co.nz/wp-content/uploads/2021/09/cheap-wispy-eyelash-extensions-north-shore-albany-takapuna-auckland-600x600.jpg"
              alt="Pestañas wispy"
              className="mi-imagen"
            />
            <div className="descripcion-img">
              <p>Las pestañas wispy son un tipo de pestañas que utiliza longitudes y grosores variados para imitar el patrón de crecimiento natural e irregular de las pestañas reales. Este estilo crea un aspecto suave que añade textura y profundidad sin ser demasiado dramático. La técnica consiste en colocar estratégicamente pestañas más largas entre las más cortas, resultando en un efecto plumoso que realza los ojos manteniendo una apariencia natural. Ideal para clientes que buscan un look de pestañas personalizado y sofisticado.</p>
            </div>
          </section>

          <section className="servicio">
            <h3> Pestañas Volumen hawaiano</h3>
            <div className="action-icon"></div>
            <img
              src="https://img2.elyerromenu.com/images/ethereal-beauty/hawaianas-q/img.webp"
              alt="Pestañas volumen hawaiano"
              className="mi-imagen"
            />
            <div className="descripcion-img">
              <p>La extensión de pestañas de Volumen Hawaiano es un tratamiento estético avanzado que implica la aplicación de múltiples extensiones de pestañas ultrafinas a cada pestaña natural individual para crear una apariencia de pestañas más largas, más gruesas y dramáticas, si quieres que tu mirada se vea natural, las pestañas pelo a pelo son ideales para ti. Para que tu mirada se vea más poblada, pero con un volumen moderado, lo que buscas es la técnica 3D y si deseas una mirada con mucho impacto y con mucho volumen, la técnica rusa es lo que buscas.</p>
            </div>
          </section>

          <section className="servicio">
            <h3> Pestañas volumen egipcio</h3>
            <div className="action-icon"></div>
            <img
              src="https://i0.wp.com/perkylashes.com/wp-content/uploads/2023/06/pestanas-volumen-egipcio-1.png?ssl=1"
              alt="Pestañas volumen egipcio"
              className="mi-imagen"
            />
            <div className="descripcion-img">
              <p>Las pestañas volumen egipcio son una técnica de extensiones de pestañas que ofrece un efecto voluminoso y expresivo. Estas pestañas utilizan fibra tecnológica para crear un acabado intenso y denso, logrando un volumen espectacular con menor peso y mayo retención.</p>
            </div>
          </section>

          <section className="servicio">
            <h3> Pestañas volumen</h3>
            <div className="action-icon"></div>
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSchbOizh-UVMeq0WMYg0FwIAI7esm75WQphG_gjYs6bQ&s=10"
              alt="Pestañas volumen"
              className="mi-imagen"
            />
            <div className="descripcion-img">
              <p>Las extensiones de pestañas de volumen proporcionan una mirada más intensa y glamurosa que supera el efecto de las pestañas clásicas o postizas. Esta técnica, a veces llamada volumen ruso, fue desarrollada por artistas de pestañas rusas para crear una línea de pestañas densa y lujosa con un acabado suave y ligero.</p>
            </div>
          </section>


          <section className="servicio">
            <h3> Pestañas mega volumen</h3>
            <div className="action-icon"></div>
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcROF3sepZRAbY7kGtzfRfR_BnvQu8lVAtB0wAWIBhdgmUHR1L9nE_Bg_31o&s=10"
              alt="Pestañas mega volumen"
              className="mi-imagen"
            />
            <div className="descripcion-img">
              <p>Las pestañas mega volumen son una técnica de extensión de pestañas que ofrece un volumen y dramatismo excepcionales. Se caracterizan por la aplicación de múltiples extensiones ultrafinas en forma de abanico sobre cada pestaña natural, creando un aspecto denso y esponjoso. Este estilo es ideal para quienes buscan un efecto audaz y glamoroso, logrando una mirada impactante, lujosa y muy voluminosa. </p>
            </div>
          </section>


        </section>
      </main >

      {/* Sección de Servicios 
      < main className="contenedor sombra" >
        <section className="services-section">
          <h2>Nuestros Servicios Destacados</h2>
          <div className="services-carousel">

            <div className="service-card">
              <PlaceholderSvg text="Lifting de Pestañas" />
              <h3>Lifting de Pestañas</h3>
              <p className="service-price">$800.00</p>
              {/* Solo permite agendar si está logueado, sino manda a login 
              <Link to={usuarioLogueado ? "/citas" : "/login"} className="service-btn">
                Agendar cita
              </Link>
            </div>

            <div className="service-card">
              <PlaceholderSvg text="Efecto Clásico" />
              <h3>Pestañas Clásicas</h3>
              <p className="service-price">$1,200.00</p>
              <Link to={usuarioLogueado ? "/citas" : "/login"} className="service-btn">
                Agendar cita
              </Link>
            </div>

            <div className="service-card">
              <PlaceholderSvg text="Volumen Ruso" />
              <h3>Volumen Ruso</h3>
              <p className="service-price">$1,700.00</p>
              <Link to={usuarioLogueado ? "/citas" : "/login"} className="service-btn">
                Agendar cita
              </Link>
            </div>

          </div>
        </section>
      </main >

      */}

      {/* Footer */}
      < footer className="footer" >
        <p>© 2025 StudioLash. Todos los derechos reservados.</p>
      </footer >
    </div >
  );
};

export default Home;