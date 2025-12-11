import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
// import './ImprimirComprobante.css'; // Asegúrate de tener tu CSS importado

import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const ImprimirComprobante = () => {
  const { id: citaId } = useParams();
  
  const [cita, setCita] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const comprobanteRef = useRef(null);

  // Consulta a la BD (Igual que antes)
  useEffect(() => {
    const fetchCita = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/citas/${citaId}`);
        
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

  // --- NUEVA FUNCIÓN PARA DESCARGAR PDF ---
  const handleDownloadPDF = () => {
    const input = comprobanteRef.current;
    
    // 1. Capturamos el HTML como imagen de alta calidad
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      
      // 2. Creamos el PDF (p = portrait/vertical, mm = milímetros, a4 = tamaño papel)
      const pdf = new jsPDF('p', 'mm', 'a4');

      // 3. Calculamos las dimensiones para que encaje en el PDF
      const pdfWidth = pdf.internal.pageSize.getWidth(); // Ancho del A4 (aprox 210mm)
      const pdfHeight = pdf.internal.pageSize.getHeight(); // Alto del A4
      
      const imgProps = pdf.getImageProperties(imgData);
      
      // Ajustamos el ancho de la imagen al ancho del PDF (menos márgenes si quieres)
      // Aquí dejaremos 20mm de margen total (10mm a cada lado)
      const margin = 10;
      const imgWidth = pdfWidth - (margin * 2);
      
      // Calculamos la altura proporcional para no deformar la imagen
      const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

      // 4. Añadimos la imagen al PDF (x, y, ancho, alto)
      pdf.addImage(imgData, 'PNG', margin, 20, imgWidth, imgHeight);
      
      // 5. Guardamos el PDF
      pdf.save(`Comprobante_Lashista_${citaId}.pdf`);
    });
  };

  // Funciones de formato 
  const formatFecha = (isoString) => {
    if(!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleDateString('es-MX', {
      day: 'numeric', month: 'long', year: 'numeric',
    });
  };

  const formatHora = (isoString) => {
    if(!isoString) return '';
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
        
        {/* === TICKET A IMPRIMIR === */}
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

        {/* === BOTONES DE ACCIÓN === */}
        <div className="comprobante-actions">
          {/* Cambiamos el texto y la función del botón */}
          <button onClick={handleDownloadPDF} className="btn-download">
            Descargar Comprobante (PDF)
          </button>
          
          <Link to="/" className="btn-home">
            Volver al inicio
          </Link>
        </div>

      </div>
      
      {/* Estilos CSS Inline para asegurar que funcione rápido (puedes moverlos al .css) */}
      <style>{`
        .comprobante-page { display: flex; justify-content: center; padding: 40px; background: #f4f4f9; min-height: 100vh; }
        .comprobante-container { background: white; max-width: 400px; width: 100%; border-radius: 10px; box-shadow: 0 10px 25px rgba(0,0,0,0.1); overflow: hidden; }
        .comprobante-ticket { padding: 30px; background: #fff; }
        .ticket-header { text-align: center; border-bottom: 2px dashed #e8a0bf; padding-bottom: 20px; margin-bottom: 20px; }
        .ticket-header h2 { color: #d17a9e; margin: 0; }
        .ticket-details dt { font-weight: bold; color: #555; margin-top: 10px; font-size: 0.9rem; }
        .ticket-details dd { margin: 0; padding-bottom: 5px; border-bottom: 1px solid #eee; color: #333; }
        .costo-total { color: #d17a9e !important; font-size: 1.4rem !important; font-weight: bold; text-align: right; margin-top: 10px !important; border: none !important; }
        .cita-id { font-size: 0.75rem !important; color: #aaa !important; }
        .ticket-footer { text-align: center; margin-top: 20px; padding-top: 20px; border-top: 2px dashed #e8a0bf; font-size: 0.8rem; color: #777; }
        .comprobante-actions { padding: 20px; display: flex; flex-direction: column; gap: 10px; background: #f9f9f9; }
        .btn-download { background: #d17a9e; color: white; border: none; padding: 12px; border-radius: 5px; cursor: pointer; font-weight: bold; font-size: 1rem; }
        .btn-download:hover { background: #c0628b; }
        .btn-home { text-align: center; color: #d17a9e; text-decoration: none; padding: 10px; border: 1px solid #d17a9e; border-radius: 5px; }
      `}</style>
    </div>
  );
};

export default ImprimirComprobante;