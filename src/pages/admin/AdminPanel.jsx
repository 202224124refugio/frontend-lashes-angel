import React, { useState, useEffect } from 'react'; 
import { Link } from 'react-router-dom';
//import { apiLashes } from '../servicios/axios.js'; 
import { apiLashes } from "../../servicios/axios";

import './AdminPanel.css';
import '../login/login.css';


const AdminPanel = () => {
  // ... (El resto de este componente principal no cambia) ...
  const [selectedPanel, setSelectedPanel] = useState('productos');

 
  const handlePanelChange = (e) => {
    setSelectedPanel(e.target.value);
  };

  
  const renderPanel = () => {
    switch (selectedPanel) {
      case 'productos':
        return <PanelProductos />;
      case 'ofertas':
        return <PanelOfertas />;
      case 'caracteristicas':
        return <PanelCaracteristicas />;
      case 'citas':
        return <PanelCitas />;
      default:
        return <PanelProductos />;
    }
  };

  return (
   
    <div className="login-page-container">
      <header className="login-header">
        <Link to="/" className="login-logo">
          Studio Lashista (Admin)
        </Link>
      </header>

      <div className="login-form-wrapper">
        <div className="login-form admin-card">
          
          <h2>Panel de Administración</h2>
          <p className="login-subtitle">
            Selecciona una sección para gestionar el contenido.
          </p>

          {/*  Lista Desplegable Principal */}
          <div className="input-group">
            <label htmlFor="panel-select">Seleccionar Panel</label>
            <select 
              id="panel-select" 
              className="admin-select" 
              value={selectedPanel} 
              onChange={handlePanelChange}
            >
              <option value="productos">Gestión de Productos</option>
              <option value="ofertas">Gestión de Ofertas</option>
              <option value="caracteristicas">Gestión de Características</option>
              <option value="citas">Gestión de Citas</option>
            </select>
          </div>

          {}
          <hr className="admin-divider" />

          {/* renderiza el panel seleccionado */}
          <div className="admin-panel-content">
            {renderPanel()}
          </div>

        </div>
      </div>
    </div>
  );
};


const PanelProductos = () => {
  // --- Estados para las listas (vienen de la BD) ---
  const [estilos, setEstilos] = useState([]);
  const [disenos, setDisenos] = useState([]);
  const [tecnicas, setTecnicas] = useState([]);

  // --- Estados para el formulario del nuevo producto ---
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [estiloId, setEstiloId] = useState('');
  const [disenoId, setDisenoId] = useState('');
  const [tecnicaId, setTecnicaId] = useState('');
  const [precio, setPrecio] = useState('');

  // --- Estados para la UI (Carga y Errores) ---
  const [loadingLists, setLoadingLists] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // --- Cargar datos de los Dropdowns (al montar el componente) ---
  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        setLoadingLists(true);
        setError('');
        
        // Hacemos las 3 peticiones en paralelo
        const [resEstilos, resDisenos, resTecnicas] = await Promise.all([
          apiLashes.get('/estilos'), 
          apiLashes.get('/disenos'), 
          apiLashes.get('/tecnicas') 
        ]);

        setEstilos(resEstilos.data);
        setDisenos(resDisenos.data);
        setTecnicas(resTecnicas.data);

      } catch (err) {
        console.error("Error cargando datos para los dropdowns:", err);
        setError('Error al cargar las opciones. Intente recargar.');
      } finally {
        setLoadingLists(false);
      }
    };

    fetchDropdownData();
  }, []); // El array vacío [] asegura que se ejecute solo una vez

  // --- Manejador para guardar el nuevo producto ---
  const handleSubmit = async (e) => {
    e.preventDefault(); // Evita que se recargue la página
    setSubmitting(true);
    setError('');

    // Validación simple
    if (!nombre || !estiloId || !disenoId || !tecnicaId || !precio) {
      setError('Todos los campos son obligatorios (excepto descripción).');
      setSubmitting(false);
      return;
    }

    try {
      const payload = {
        nombre,
        descripcion,
        estilo: estiloId, // Enviamos el ID seleccionado
        diseno: disenoId,
        tecnica: tecnicaId,
        precio: parseFloat(precio) // Aseguramos que sea un número
      };

      // Asumimos que la ruta es /api/productos/crear
      const response = await apiLashes.post('/catalogo/crear', payload);

      alert('¡Producto creado exitosamente!');
      console.log('Producto guardado:', response.data);

      // Limpiar el formulario
      setNombre('');
      setDescripcion('');
      setEstiloId('');
      setDisenoId('');
      setTecnicaId('');
      setPrecio('');

    } catch (err) {
      console.error("Error al guardar el producto:", err);
      setError(err.response?.data?.message || 'Error al guardar el producto.');
    } finally {
      setSubmitting(false);
    }
  };

  // Si está cargando las listas, muestra un mensaje
  if (loadingLists) {
    return <p>Cargando opciones...</p>;
  }

  return (
    <div>
      <h3>Gestión de Productos</h3>
      
      <h4>Agregar Nuevo Producto</h4>
      <form className="admin-form" onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="prod-nombre">Nombre del Producto</label>
          <input 
            type="text" 
            id="prod-nombre" 
            placeholder="Ej: Pestañas 5D" 
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </div>
        <div className="input-group">
          <label htmlFor="prod-desc">Descripción</label>
          <textarea 
            id="prod-desc" 
            placeholder="Descripción corta del producto..."
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
          ></textarea>
        </div>
        
        {/* Dropdowns de la BD */}
        <div className="input-group">
          <label htmlFor="prod-estilo">Estilo</label>
          <select id="prod-estilo" value={estiloId} onChange={(e) => setEstiloId(e.target.value)} required>
            <option value="" disabled>-- Seleccionar Estilo --</option>
            {estilos.map(estilo => (
              <option key={estilo._id} value={estilo._id}>{estilo.nombre}</option>
            ))}
          </select>
        </div>
        <div className="input-group">
          <label htmlFor="prod-diseno">Diseño</label>
          <select id="prod-diseno" value={disenoId} onChange={(e) => setDisenoId(e.target.value)} required>
            <option value="" disabled>-- Seleccionar Diseño --</option>
            {disenos.map(diseno => (
              <option key={diseno._id} value={diseno._id}>{diseno.nombre}</option>
            ))}
          </select>
        </div>
        <div className="input-group">
          <label htmlFor="prod-tecnica">Técnica</label>
          <select id="prod-tecnica" value={tecnicaId} onChange={(e) => setTecnicaId(e.target.value)} required>
            <option value="" disabled>-- Seleccionar Técnica --</option>
            {tecnicas.map(tecnica => (
              <option key={tecnica._id} value={tecnica._id}>{tecnica.nombre}</option>
            ))}
          </select>
        </div>

        <div className="input-group">
          <label htmlFor="prod-precio">Precio</label>
          <input 
            type="number" 
            id="prod-precio" 
            placeholder="1500.00" 
            min="0" 
            step="0.01" 
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
            required
          />
        </div>

        {/* Muestra errores si los hay */}
        {error && <p className="error-message">{error}</p>}

        <button type="submit" className="login-submit-btn" disabled={submitting}>
          {submitting ? 'Guardando...' : 'Guardar Producto'}
  B     </button>
      </form>
    </div>
  );
};

const PanelOfertas = () => {
  const [productos, setProductos] = useState([]);
  const [ofertas, setOfertas] = useState([]);

  return (
    <div>
      <h3>Gestión de Ofertas</h3>
      
      <h4>Crear Nueva Oferta</h4>
      <form className="admin-form">
        <div className="input-group">
          <label htmlFor="oferta-producto">Seleccionar Producto</label>
          <select id="oferta-producto">
            <option value="">-- Seleccionar un producto de la lista --</option>
            {/* // TODO: Mapear 'productos' desde la BD
            {productos.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
            */}
            <option value="mockP1">Pestañas 5D (Mock)</option>
            <option value="mockP2">Lifting (Mock)</option>
          </select>
        </div>
        <div className="input-group">
          <label htmlFor="oferta-precio">Nuevo Precio de Oferta</label>
          <input type="number" id="oferta-precio" placeholder="1200.00" />
        </div>
        <button type="submit" className="login-submit-btn">Crear Oferta</button>
      </form>

      <hr className="admin-divider" />

      <h4>Ofertas Existentes</h4>
      <div className="admin-item-list">
        {/* // TODO: Mapear 'ofertas' desde la BD */}
        <div className="admin-item">
          <span>Oferta: Pestañas 5D - $1200.00</span>
          <div>
            <button className="login-submit-btn secondary">Modificar</button>
            <button className="login-submit-btn danger">Eliminar</button>
          </div>
        </div>
        {/* ... más ofertas ... */}
      </div>
    </div>
  );
};

const PanelCaracteristicas = () => {
  // ... (tu código original) ...
  return (
    <div>
      <h3>Gestión de Características</h3>
      <p>Agrega, modifica o elimina los Estilos, Diseños y Técnicas.</p>

      {/* Gestión de Estilos */}
      <div className="admin-sub-panel">
        <h4>Estilos</h4>
        <form className="admin-form-inline">
          <input type="text" placeholder="Nuevo nombre de estilo" />
          <button type="submit" className="login-submit-btn">Agregar</button>
        </form>
        <div className="admin-item-list">
          <div className="admin-item">
            <span>Natural</span>
            <button className="login-submit-btn danger small">Eliminar</button>
          </div>
        </div>
      </div>

      {/* Gestión de Diseños */}
      <div className="admin-sub-panel">
        <h4>Diseños</h4>
      _   <form className="admin-form-inline">
          <input type="text" placeholder="Nuevo nombre de diseño" />
          <button type="submit" className="login-submit-btn">Agregar</button>
        </form>
        {/* ... lista de diseños ... */}
      </div>

      {/* Gestión de Técnicas */}
      <div className="admin-sub-panel">
        <h4>Técnicas</h4>
        <form className="admin-form-inline">
          <input type="text" placeholder="Nueva nombre de técnica" />
          <button type="submit" className="login-submit-btn">Agregar</button>
        </form>
        {/* ... lista de técnicas ... */}
      </div>
    </div>
  );
};

// --- 4. Panel de Citas (Sin modificar) ---
// --- Panel de Citas ---
// --- Panel de Citas Profesional ---
const PanelCitas = () => {
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editId, setEditId] = useState(null);
  const [formEdit, setFormEdit] = useState({
    nombre_usuario: "",
    productos: "",
    telefono: "",
    hora_dia: "",
    costo: ""
  });

  // Obtener citas
  const cargarCitas = async () => {
    try {
      setLoading(true);
      const response = await apiLashes.get("/citas");
      setCitas(response.data);
      setError("");
    } catch (err) {
      setError("No se pudieron cargar las citas.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarCitas();
  }, []);

  // Iniciar edición
  const handleEditar = (cita) => {
    setEditId(cita._id);
    setFormEdit({
      nombre_usuario: cita.nombre_usuario,
      productos: cita.productos,
      telefono: cita.telefono,
      hora_dia: cita.hora_dia.slice(0, 16),
      costo: cita.costo
    });
  };

  // Guardar edición
  const guardarEdicion = async (id) => {
    try {
      await apiLashes.put(`/citas/${id}`, formEdit);
      alert("Cita actualizada");
      setEditId(null);
      cargarCitas();
    } catch {
      alert("Error al actualizar la cita");
    }
  };

  // Eliminar cita
  const eliminarCita = async (id) => {
    if (!confirm("¿Eliminar esta cita?")) return;

    try {
      await apiLashes.delete(`/citas/${id}`);
      cargarCitas();
    } catch {
      alert("Error al eliminar la cita");
    }
  };

  return (
    <div>
      <h3>Gestión de Citas</h3>

      <button
        onClick={cargarCitas}
        className="login-submit-btn"
        style={{ marginBottom: "15px" }}
      >
        Recargar
      </button>

      {loading && <p>Cargando citas...</p>}
      {error && <p className="error-message">{error}</p>}

      <table className="citas-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Producto</th>
            <th>Teléfono</th>
            <th>Fecha y Hora</th>
            <th>Costo</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {citas.map((cita) =>
            editId === cita._id ? (
              // --- FILA EN MODO EDICIÓN ---
              <tr key={cita._id} className="citas-edit-row">
                <td>
                  <input
                    value={formEdit.nombre_usuario}
                    onChange={(e) =>
                      setFormEdit({ ...formEdit, nombre_usuario: e.target.value })
                    }
                    className="admin-edit-input"
                  />
                </td>

                <td>
                  <input
                    value={formEdit.productos}
                    onChange={(e) =>
                      setFormEdit({ ...formEdit, productos: e.target.value })
                    }
                    className="admin-edit-input"
                  />
                </td>

                <td>
                  <input
                    value={formEdit.telefono}
                    onChange={(e) =>
                      setFormEdit({ ...formEdit, telefono: e.target.value })
                    }
                    className="admin-edit-input"
                  />
                </td>

                <td>
                  <input
                    type="datetime-local"
                    value={formEdit.hora_dia}
                    onChange={(e) =>
                      setFormEdit({ ...formEdit, hora_dia: e.target.value })
                    }
                    className="admin-edit-input"
                  />
                </td>

                <td>
                  <input
                    type="number"
                    value={formEdit.costo}
                    onChange={(e) =>
                      setFormEdit({ ...formEdit, costo: e.target.value })
                    }
                    className="admin-edit-input"
                  />
                </td>

                <td>
                  <div className="citas-actions">
                    <button
                      className="login-submit-btn btn-small"
                      onClick={() => guardarEdicion(cita._id)}
                    >
                      Guardar
                    </button>

                    <button
                      className="login-submit-btn danger btn-small"
                      onClick={() => setEditId(null)}
                    >
                      Cancelar
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              // --- FILA NORMAL ---
              <tr key={cita._id}>
                <td>{cita.nombre_usuario}</td>
                <td>{cita.productos}</td>
                <td>{cita.telefono}</td>
                <td>{new Date(cita.hora_dia).toLocaleString()}</td>
                <td>${cita.costo}</td>

                <td>
                  <div className="citas-actions">
                    <button
                      className="login-submit-btn secondary btn-small"
                      onClick={() => handleEditar(cita)}
                    >
                      Editar
                    </button>

                    <button
                      className="login-submit-btn danger btn-small"
                      onClick={() => eliminarCita(cita._id)}
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
};



export default AdminPanel;