import React, { useState, useEffect } from 'react';
import './citasStyle.css';
import { useNavigate } from 'react-router-dom';

const Citas = () => {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    producto: '',
    dia: '',
    hora: '',
    costo: 0
  });

  const [productos, setProductos] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const res = await fetch("/api/catalogo/");
        const data = await res.json();
        setProductos(data);
      } catch (error) {
        console.error("Error al cargar productos:", error);
      }
    };

    fetchProductos();
  }, []);


  const handleChange = (e) => {
    const { name, value } = e.target;
    let nuevoCosto = formData.costo;

    if (name === "producto") {
      const prod = productos.find((p) => p._id === value);
      nuevoCosto = prod ? prod.precio : 0;
    }

    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
      ...(name === "producto" && { costo: nuevoCosto }),
    }));

    if (message) setMessage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (formData.costo === 0 || !formData.producto) {
      setMessage({ type: "error", text: "Por favor, selecciona un producto válido." });
      return;
    }

    const ahora = new Date();
    const fechaSeleccionada = new Date(`${formData.dia}T${formData.hora}:00`);

    if (fechaSeleccionada < ahora) {
      setMessage({
        type: "error",
        text: "No puedes agendar una cita en una fecha u hora pasada.",
      });
      return;
    }

    setIsLoading(true);

    const productoSeleccionado = productos.find(p => p._id === formData.producto);
    const fechaHoraISO = `${formData.dia}T${formData.hora}:00`;
    const combinedDate = new Date(fechaHoraISO);

    const payload = {
      nombre_usuario: formData.nombre,
      productos: productoSeleccionado.nombre,
      telefono: Number(formData.telefono),
      hora_dia: combinedDate.toISOString(),
      costo: formData.costo,
    };

    try {
      const response = await fetch('/api/citas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al crear la cita.');
      }

      const citaGuardada = await response.json();
      setMessage({ type: "success", text: "¡Cita agendada exitosamente!" });

      setTimeout(() => {
        if (citaGuardada._id) {
          navigate(`/comprobante/${citaGuardada._id}`);
        } else {
          setMessage({ type: "error", text: "Cita creada, pero no se pudo obtener el ID." });
        }
      }, 2000);

    } catch (error) {
      console.error("Error al agendar cita:", error);
      setMessage({ type: "error", text: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="contenedor-app">
      {/*
      <style>{`
        .citas-container {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 20px;
          font-family: Arial, sans-serif;
        }
        .citas-form {
          background: #ffffff;
          border: 1px solid #ddd;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          padding: 24px;
          width: 100%;
          max-width: 500px;
        }
        .form-message.success {
          color: #155724;
          background-color: #d4edda;
          border: 1px solid #c3e6cb;
          padding: 10px;
          border-radius: 5px;
          margin-top: 15px;
          text-align: center;
        }
        .form-message.error {
          color: #721c24;
          background-color: #f8d7da;
          border: 1px solid #f5c6cb;
          padding: 10px;
          border-radius: 5px;
          margin-top: 15px;
          text-align: center;
        }
      `}</style>
      */}
      <div className="imagen"></div>

      <div className="app">

        <h2 className="nombre-pagina">Agenda tu Cita</h2>
        <p className="descripcion-pagina">Completa el formulario para reservar tu espacio en Studio Lashista.</p>

        <form className="formulario2" onSubmit={handleSubmit}>

          <div className="campo2">
            <label>Nombre Completo:</label>
            <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} required />
          </div>

          <div className="campo2">
            <label>Teléfono:</label>
            <input type="tel" name="telefono" value={formData.telefono} onChange={handleChange} pattern="[0-9]{10}" required />
          </div>

          <div className="campo2">
            <label>Servicio Deseado:</label>
            <select name="producto" value={formData.producto} onChange={handleChange} required>
              <option value="">-- Selecciona un servicio --</option>

              {productos.length > 0 ? (
                productos.map((prod) => (
                  <option key={prod._id} value={prod._id}>
                    {prod.nombre} (${prod.precio})
                  </option>
                ))
              ) : (
                <option disabled>Cargando productos...</option>
              )}

            </select>
          </div>


          <div className="campo2">
            <label>Día:</label>
            <input type="date" name="dia" value={formData.dia} onChange={handleChange} min={new Date().toISOString().split("T")[0]} required />
          </div>

          <div className="campo2">
            <label>Hora:</label>
            <input type="time" name="hora" value={formData.hora} onChange={handleChange} min="10:00" max="19:00" step="3600" required />
          </div>


          {message && (
            <div className={`form-message ${message.type}`}>{message.text}</div>
          )}

          <button type="submit" className="boton2" disabled={isLoading}>
            {isLoading ? 'Agendando...' : 'Agendar Cita'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Citas;
