  import React, { useState } from 'react';
  import './citasStyle.css';
  import { useNavigate } from 'react-router-dom';



  const productosDisponibles = {
    // Catálogo
    'producto1': { nombre: 'Pestañas Clásicas', costo: 500 },
    'producto2': { nombre: 'Volumen Ruso', costo: 700 },
    
  };

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

    // --- NUEVOS ESTADOS ---
    // Para manejar el estado de carga (mientras se envía al backend)
    const [isLoading, setIsLoading] = useState(false);
    // Para mostrar mensajes de éxito o error al usuario
    const [message, setMessage] = useState(null); // Ej: { type: 'success', text: '¡Cita agendada!' }

    // Manejador para todos los campos del formulario (sin cambios)
    const handleChange = (e) => {
      const { name, value } = e.target;
      let nuevoCosto = formData.costo;

      if (name === 'producto') {
        nuevoCosto = productosDisponibles[value] ? productosDisponibles[value].costo : 0;
      }

      setFormData(prevState => ({
        ...prevState,
        [name]: value,
        ...(name === 'producto' && { costo: nuevoCosto })
      }));

      // Limpiar mensaje al empezar a editar de nuevo
      if (message) {
        setMessage(null);
      }
    };

    // --- MANEJADOR DE ENVÍO (handleSubmit) ACTUALIZADO ---
    const handleSubmit = async (e) => {
      e.preventDefault();
      setMessage(null); // Limpiar mensajes anteriores

      // 1. Validación (igual que antes)
      if (formData.costo === 0 || !formData.producto) {
        setMessage({ type: 'error', text: 'Por favor, selecciona un producto válido.' });
        return;
      }

      // 2. Iniciar estado de carga
      setIsLoading(true);

      // 3. Transformación de Datos (Frontend state -> Backend schema)
      const nombreProducto = productosDisponibles[formData.producto].nombre;
      const fechaHoraISO = `${formData.dia}T${formData.hora}:00`;
      // Creamos el objeto Date (Mongoose lo manejará correctamente)
      const combinedDate = new Date(fechaHoraISO);

      const payload = {
        nombre_usuario: formData.nombre,
        productos: nombreProducto, // Enviamos 'Pestañas Clásicas', no 'producto1'
        telefono: Number(formData.telefono), // Aseguramos que sea tipo Number
        hora_dia: combinedDate.toISOString(), 
        costo: formData.costo
      };

      console.log('Datos a enviar al backend:', payload);

      // 4. Llamada a la API (fetch)
      try {
        // Usamos la ruta relativa que creamos en Node.js
        const response = await fetch('/api/citas', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          
          const errorData = await response.json();
          throw new Error(errorData.message || 'Error del servidor al crear la cita.');
        }

        const citaGuardada = await response.json();
        console.log('Cita guardada en BD:', citaGuardada);
        setMessage({ type: 'success', text: '¡Cita agendada exitosamente!' });


        setTimeout(() => {
          
          if (citaGuardada._id) {
              navigate(`/comprobante/${citaGuardada._id}`);
              //console.log('Navegando a la ruta:', rutaComprobante);
             // navigate(rutaComprobante);
          } else {
              console.log('No se encontró citaGuardada._id, mostrando error.');
              setMessage({ type: 'error', text: 'Cita creada, pero no se pudo obtener el ID.' });
          }
        }, 2000);
        
        

      } catch (error) {
        
        console.error('Error al agendar la cita:', error);
        setMessage({ type: 'error', text: error.message || 'No se pudo conectar al servidor. Intenta de nuevo.' });
      } finally {
        
        setIsLoading(false);
      }
    };

    return (
      <div className="citas-container">
        {}
        <style>
          {`
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
            .citas-form h2 {
              text-align: center;
              margin-top: 0;
            }
            .citas-form p {
              text-align: center;
              margin-bottom: 20px;
              color: #555;
            }
            .form-group {
              margin-bottom: 15px;
            }
            .form-group label {
              display: block;
              margin-bottom: 5px;
              font-weight: bold;
            }
            .form-group input,
            .form-group select {
              width: 100%;
              padding: 10px;
              border: 1px solid #ccc;
              border-radius: 4px;
              box-sizing: border-box; /* Importante para que el padding no afecte el ancho */
            }
            .form-row {
              display: flex;
              gap: 15px;
            }
            .form-row .form-group {
              flex: 1;
            }
            .costo-final {
              background-color: #f4f4f4;
              font-weight: bold;
            }
            .submit-btn {
              width: 100%;
              padding: 12px;
              background-color: #007bff;
              color: white;
              border: none;
              border-radius: 4px;
              font-size: 16px;
              cursor: pointer;
              transition: background-color 0.3s ease;
            }
            .submit-btn:hover {
              background-color: #0056b3;
            }
            .submit-btn:disabled {
              background-color: #ccc;
              cursor: not-allowed;
            }
            .form-message {
              padding: 10px;
              border-radius: 5px;
              margin-top: 15px;
              text-align: center;
            }
            .form-message.success {
              color: #155724;
  a           background-color: #d4edda;
              border: 1px solid #c3e6cb;
            }
            .form-message.error {
              color: #721c24;
              background-color: #f8d7da;
              border: 1px solid #f5c6cb;
            }
          `}
        </style>

        <form className="citas-form" onSubmit={handleSubmit}>
          <h2>Agenda tu Cita</h2>
          <p>Completa el formulario para reservar tu espacio en Studio Lashista.</p>

          <div className="form-group">
            <label htmlFor="nombre">Nombre Completo:</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="telefono">Teléfono:</label>
            <input
              type="tel"
              id="telefono"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              placeholder="Ej: 55 1234 5678"
              pattern="[0-9]{10}" // Opcional: validación simple de 10 dígitos
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="producto">Servicio Deseado:</label>
            <select
              id="producto"
              name="producto"
              value={formData.producto}
              onChange={handleChange}
              required
            >
              <option value="" disabled>-- Selecciona un servicio --</option>
              <optgroup label="Catálogo Principal">
                {/* --- MEJORA: Select dinámico --- 
                    Mapeamos el objeto productosDisponibles para crear las opciones.
                    'key' es 'producto1', 'nombre' es 'Pestañas Clásicas' */}
                {Object.entries(productosDisponibles).map(([key, { nombre, costo }]) => (
                  <option key={key} value={key}>
                    {nombre} (${costo.toFixed(2)})
                  </option>
                ))}
              </optgroup>
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="dia">Día:</label>
              <input
                type="date"
                id="dia"
                name="dia"
                value={formData.dia}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="hora">Hora:</label>
              <input
                type="time"
                id="hora"
                name="hora"
                value={formData.hora}
                onChange={handleChange}
                min="10:00"
                max="19:00"
                step="3600"
                required
              />
            </div>
          </div>

          {/* --- NUEVO: Mostrar mensajes de estado --- */}
          {message && (
            <div className={`form-message ${message.type}`}>
              {message.text}
            </div>
          )}
          {/*             Ya no es necesario añadir esto a citasStyle.css, 
              porque los estilos se incluyeron arriba.
          */}

          {/* --- BOTÓN ACTUALIZADO --- */}
          <button type="submit" className="submit-btn" disabled={isLoading}>
            {isLoading ? 'Agendando...' : 'Agendar Cita'}
          </button>
        </form>
      </div>
    );
  };

  export default Citas;