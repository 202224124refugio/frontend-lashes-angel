import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import './ImprimirComprobantes.css';

// Importamos la librería para convertir HTML a Imagen
// ¡IMPORTANTE! Debes añadir esta librería a tu proyecto.
// 1. Ejecuta: npm install html-to-image
// 2. O, para este ejemplo, usaremos html2canvas desde un CDN.
//    Añade esto a tu public/index.html:
//    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
import html2canvas from 'html2canvas';

const ImprimirComprobante = () => {
  // 1. Obtener el ID de la cita desde la URL (ej: /comprobante/605c7... )
  const { Id } = useParams();
  
  const [cita, setCita] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // 2. Ref para apuntar al 'ticket' que queremos convertir en imagen
  const comprobanteRef = useRef(null);

  // 3. Efecto para buscar los datos de la cita en la BD cuando el componente carga
  useEffect(() => {
    const fetchCita = async () => {
      try {
        setIsLoading(true);
        // Usamos la ruta GET que definiste en citasRutas.js
        const response = await fetch(`/api/citas/${Id}`);
        
        if (!response.ok) {
          throw new Error('No se pudo encontrar la cita.');
        }

        const data = await response.json();
        setCita(data);
        setError(null);

      } catch (err) {
        setError(err.message);
        setCita(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCita();
  }, [Id]); // Se ejecuta cada vez que el citaId cambie

  // 4. Función para descargar el comprobante como imagen
  const handleDownloadImage = () => {
    if (!comprobanteRef.current) return;

    // Usamos html2canvas (asegúrate de que esté importado o cargado)
    html2canvas(comprobanteRef.current).then((canvas) => {
      // Convertir el canvas a una URL de imagen PNG
      const imgData = canvas.toDataURL('image/png');
      
      // Crear un link temporal para descargarla
      const link = document.createElement('a');
      link.href = imgData;
      link.download = `comprobante-cita-${Id}.png`;
      link.click();
    });
  };

  // 5. Funciones para formatear la fecha y hora
  const formatFecha = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('es-MX', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatHora = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString('es-MX', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  // --- Renderizado del componente ---

  if (isLoading) {
    return <div className="comprobante-page"><div className="loader">Cargando comprobante...</div></div>;
  }

  if (error) {
    return <div className="comprobante-page"><div className="error-msg">{error}</div></div>;
  }

  if (!cita) {
    return <div className="comprobante-page"><div className="error-msg">No hay datos de la cita.</div></div>;
  }

  return (
    <div className="comprobante-page">
      <div className="comprobante-container">
        
        {/* === ESTE ES EL 'TICKET' QUE SE CONVERTIRÁ EN IMAGEN === */}
        <div className="comprobante-ticket" ref={comprobanteRef}>
          <div className="ticket-header">
            <h2>Studio Lashista</h2>
            <h3>Comprobante de Cita</h3>
            <p>¡Gracias por tu preferencia!</p>
          </div>
          <div className="ticket-details">
            <dl>
              <dt>Cliente:</dt>
              <dd>{cita.nombre_usuario}</dd>
              
              <dt>Servicio:</dt>
              <dd>{cita.productos}</dd>
              
              <dt>Fecha:</dt>
              <dd>{formatFecha(cita.hora_dia)}</dd>
              
              <dt>Hora:</dt>
              <dd>{formatHora(cita.hora_dia)}</dd>
              
              <dt>Costo Total:</dt>
              <dd className="costo-total">$ {cita.costo.toFixed(2)} MXN</dd>

              <dt>ID de Cita:</dt>
              <dd className="cita-id">{cita._id}</dd>
            </dl>
          </div>
          <div className="ticket-footer">
            <p>Guarda este comprobante. ¡Te esperamos!</p>
          </div>
        </div>
        {/* ======================================================= */}

        <div className="comprobante-actions">
          <button onClick={handleDownloadImage} className="btn-download">
            Descargar Comprobante (PNG)
          </button>
          <Link to="/" className="btn-home">
            Volver al inicio
          </Link>
        </div>

      </div>
    </div>
  );
};

export default ImprimirComprobante;