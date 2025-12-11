import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';

import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// IMPORTANTE: backend desde variable de entorno
const API_URL = import.meta.env.VITE_API_URL;

const ImprimirComprobante = () => {
  const { id: citaId } = useParams();

  const [cita, setCita] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const comprobanteRef = useRef(null);

  // ============================================
  // CONSULTAR CITA POR ID
  // ============================================
  useEffect(() => {
    const fetchCita = async () => {
      try {
        setIsLoading(true);

        // RUTA CORREGIDA
        const response = await fetch(`${API_URL}/api/citas/${citaId}`);

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
  }, [citaId]);


  // ============================================
  // DESCARGAR PDF
  // ============================================
  const handleDownloadPDF = () => {
    const input = comprobanteRef.current;

    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const margin = 10;
      const imgWidth = pdfWidth - margin * 2;

      const imgProps = pdf.getImageProperties(imgData);
      const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

      pdf.addImage(imgData, 'PNG', margin, 20, imgWidth, imgHeight);

      pdf.save(`Comprobante_Lashista_${citaId}.pdf`);
    });
  };


  // Formatos
  const formatFecha = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleDateString('es-MX', {
      day: 'numeric', month: 'long', year: 'numeric',
    });
  };

  const formatHora = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleTimeString('es-MX', {
      hour: '2-digit', minute: '2-digit', hour12: true,
    });
  };


  if (isLoading) return <div>Cargando comprobante...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!cita) return <div>No se encontraron datos.</div>;

  return (
    <div className="comprobante-page">
      <div className="comprobante-container">

        {/* === CONTENIDO DEL COMPROBANTE === */}
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
            <p>Por favor presenta este comprobante al llegar.</p>
          </div>
        </div>

        {/* === BOTONES === */}
        <div className="comprobante-actions">
          <button onClick={handleDownloadPDF} className="btn-download">
            Descargar Comprobante (PDF)
          </button>

          <Link to="/" className="btn-home">
            Volver al inicio
          </Link>
        </div>
      </div>

      {/* Estilos */}
      <style>{`
        .comprobante-page { display: flex; justify-content: center; padding: 40px; background: #f4f4f9; min-height: 100vh; }
        .comprobante-container { background: white; max-width: 400px; width: 100%; border-radius: 10px; box-shadow: 0 10px 25px rgba(0,0,0,0.1); overflow: hidden; }
        .comprobante-ticket { padding: 30px; background: #fff; }
        .ticket-header { text-align: center; border-bottom: 2px dashed #e8a0bf; padding-bottom: 20px; margin-bottom: 20px; }
        .ticket-header h2 { color: #d17a9e; margin: 0; }
        .ticket-details dt { font-weight: bold; color: #555; margin-top: 10px; font-size: 0.9rem; }
        .ticket-details dd { margin: 0; padding-bottom: 5px; border-bottom: 1px solid #eee; color: #333; }
        .costo-total { color: #d17a9e !important; font-size: 1.4rem !important; font-weight: bold; }
        .cita-id { font-size: 0.75rem !important; color: #aaa !important; }
        .comprobante-actions { padding: 20px; display: flex; flex-direction: column; gap: 10px; background: #f9f9f9; }
        .btn-download { background: #d17a9e; color: white; border: none; padding: 12px; border-radius: 5px; cursor: pointer; font-weight: bold; font-size: 1rem; }
        .btn-home { text-align: center; color: #d17a9e; border: 1px solid #d17a9e; padding: 10px; border-radius: 5px; text-decoration: none; }
      `}</style>
    </div>
  );
};

export default ImprimirComprobante;
