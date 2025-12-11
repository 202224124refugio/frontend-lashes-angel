import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
//import { apiLashes } from '../servicios/axios.js'; 
import { apiLashes } from "../../servicios/axios";

import './AdminPanel.css';
//import '../login/login.css';


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

          { }
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

      <div className="">
        <form className="formulario2" onSubmit={handleSubmit}>
          <div className="campo2">
            <label htmlFor="prod-nombre">Nombre del Producto</label>
            <input
              type="text"
              id="prod-nombre"
              placeholder="Ej: Pestañas 5D"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </div>
          <div className="campo2">
            <label htmlFor="prod-desc">Descripción</label>
            <textarea
              id="prod-desc"
              placeholder="Descripción corta del producto..."
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
            ></textarea>
          </div>

          {/* Dropdowns de la BD */}
          <div className="campo2">
            <label htmlFor="prod-estilo">Estilo</label>
            <select id="prod-estilo" value={estiloId} onChange={(e) => setEstiloId(e.target.value)} required>
              <option value="" disabled>-- Seleccionar Estilo --</option>
              {estilos.map(estilo => (
                <option key={estilo._id} value={estilo._id}>{estilo.nombre}</option>
              ))}
            </select>
          </div>
          <div className="campo2">
            <label htmlFor="prod-diseno">Diseño</label>
            <select id="prod-diseno" value={disenoId} onChange={(e) => setDisenoId(e.target.value)} required>
              <option value="" disabled>-- Seleccionar Diseño --</option>
              {disenos.map(diseno => (
                <option key={diseno._id} value={diseno._id}>{diseno.nombre}</option>
              ))}
            </select>
          </div>
          <div className="campo2">
            <label htmlFor="prod-tecnica">Técnica</label>
            <select id="prod-tecnica" value={tecnicaId} onChange={(e) => setTecnicaId(e.target.value)} required>
              <option value="" disabled>-- Seleccionar Técnica --</option>
              {tecnicas.map(tecnica => (
                <option key={tecnica._id} value={tecnica._id}>{tecnica.nombre}</option>
              ))}
            </select>
          </div>

          <div className="campo2">
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

          <button type="submit" className="boton2" disabled={submitting}>
            {submitting ? 'Guardando...' : 'Guardar Producto'}
          </button>
        </form>
      </div>
    </div>
  );
};

const PanelOfertas = () => {
  const [catalogo, setCatalogo] = useState([]);
  const [ofertas, setOfertas] = useState([]);

  // Campos del formulario
  const [productoId, setProductoId] = useState("");
  const [descripcionCondiciones, setDescripcionCondiciones] = useState("");
  const [precio, setPrecio] = useState("");

  const [loading, setLoading] = useState(true);
  const [editandoId, setEditandoId] = useState(null);

  // 🔄 Cargar productos y ofertas al montar
  useEffect(() => {
    const loadData = async () => {
      try {
        const [resCatalogo, resOfertas] = await Promise.all([
          apiLashes.get("/catalogo"),
          apiLashes.get("/ofertas/lista")
        ]);

        setCatalogo(resCatalogo.data);
        setOfertas(resOfertas.data);
      } catch (err) {
        console.error("Error cargando datos:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // 📝 Guardar o Actualizar Oferta
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      productoId,
      descripcionCondiciones,
      precio,
    };

    try {
      if (editandoId === null) {
        // Crear
        await apiLashes.post("/ofertas/crear", payload);
        alert("Oferta creada correctamente");
      } else {
        // Modificar
        await apiLashes.patch(`/ofertas/actualizar/${editandoId}`, payload);
        alert("Oferta actualizada correctamente");
      }

      // recargar
      const res = await apiLashes.get("/ofertas/lista");
      setOfertas(res.data);

      // limpiar form
      setProductoId("");
      setDescripcionCondiciones("");
      setPrecio("");
      setEditandoId(null);

    } catch (err) {
      console.error("Error guardando oferta:", err);
      alert("Error al guardar la oferta");
    }
  };

  // 🗑 Eliminar oferta
  const eliminarOferta = async (id) => {
    if (!confirm("¿Eliminar oferta?")) return;
    await apiLashes.delete(`/ofertas/eliminar/${id}`);

    const res = await apiLashes.get("/ofertas/lista");
    setOfertas(res.data);
  };

  // ✏ Cargar datos de oferta seleccionada
  const editarOferta = (oferta) => {
    setEditandoId(oferta._id);
    setProductoId(oferta.productoId);
    setDescripcionCondiciones(oferta.descripcionCondiciones);
    setPrecio(oferta.precio);
  };

  if (loading) return <p>Cargando datos...</p>;

  return (
    <div>
      <h3>Gestión de Ofertas</h3>

      <h4>{editandoId ? "Editar Oferta" : "Crear Nueva Oferta"}</h4>

      <form className="admin-form" onSubmit={handleSubmit}>

        {/* Producto del catálogo */}
        <div className="campo2">
          <label>Seleccionar Producto</label>
          <select
            value={productoId}
            onChange={(e) => setProductoId(e.target.value)}
            required
          >
            <option value="">-- Selecciona un producto --</option>
            {catalogo.map((p) => (
              <option key={p._id} value={p._id}>
                {p.nombre} (${p.precio})
              </option>
            ))}
          </select>
        </div>

        {/* Condiciones */}
        <div className="campo2">
          <label>Condiciones</label>
          <textarea
            placeholder="Ej: Válido solo en servicios individuales..."
            value={descripcionCondiciones}
            onChange={(e) => setDescripcionCondiciones(e.target.value)}
            required
          ></textarea>
        </div>

        {/* Precio */}
        <div className="campo2">
          <label>Precio de oferta</label>
          <input
            type="number"
            min="0"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
            placeholder="1200"
            required
          />
        </div>

        <button type="submit" className="boton2">
          {editandoId ? "Guardar Cambios" : "Crear Oferta"}
        </button>
      </form>

      <hr className="admin-divider" />

      {/* 📄 Lista de ofertas */}
      <h4>Ofertas Existentes</h4>

      <div className="admin-item-list">
        {ofertas.length === 0 && <p>No hay ofertas registradas.</p>}

        {ofertas.map((of) => (
          <div className="admin-item" key={of._id}>
            <span>
              <b>{of.nombre}</b> — ${of.precio}
              <br />
              <small>{of.descripcion}</small>
              <br />
              <small>Condiciones: {of.descripcionCondiciones}</small>
            </span>

            <div>
              <button
                className="boton2"
                onClick={() => editarOferta(of)}
              >
                Modificar
              </button>

              <button
                className="boton2"
                onClick={() => eliminarOferta(of._id)}
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


const PanelCaracteristicas = () => {
  // --- ESTADOS PARA ALMACENAR DATOS ---
  const [estilos, setEstilos] = useState([]);
  const [disenos, setDisenos] = useState([]);
  const [tecnicas, setTecnicas] = useState([]);

  // --- ESTADOS PARA FORMULARIOS (Nombre y Descripción son requeridos [cite: 4, 2, 6]) ---
  const [formEstilo, setFormEstilo] = useState({ nombre: '', descripcion: '' });
  const [formDiseno, setFormDiseno] = useState({ nombre: '', descripcion: '' });
  const [formTecnica, setFormTecnica] = useState({ nombre: '', descripcion: '' });

  // --- ESTADOS PARA MODO EDICIÓN ---
  const [editandoEstilo, setEditandoEstilo] = useState(null); // Guarda el ID si se está editando
  const [editandoDiseno, setEditandoDiseno] = useState(null);
  const [editandoTecnica, setEditandoTecnica] = useState(null);

  // --- CARGAR DATOS AL INICIAR ---
  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      // Rutas GET definidas en tus routers [cite: 8, 10, 11] y app.js [cite: 72]
      const [resEstilos, resDisenos, resTecnicas] = await Promise.all([
        apiLashes.get('/estilos'),
        apiLashes.get('/disenos'),
        apiLashes.get('/tecnicas')
      ]);
      setEstilos(resEstilos.data);
      setDisenos(resDisenos.data);
      setTecnicas(resTecnicas.data);
    } catch (error) {
      console.error("Error cargando características:", error);
    }
  };

  // --- MANEJADORES GENÉRICOS (Para evitar repetir código) ---

  // 1. Manejar cambios en los inputs
  const handleChange = (e, setForm, form) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 2. Manejar Guardar (Crear o Actualizar)
  const handleSave = async (e, tipo, form, setForm, editandoId, setEditandoId, endpoint) => {
    e.preventDefault();
    if (!form.nombre || !form.descripcion) return alert("Nombre y descripción son obligatorios");

    try {
      if (editandoId) {
        // ACTUALIZAR (PUT /actualizar/:id) [cite: 8, 9, 11]
        await apiLashes.put(`/${endpoint}/actualizar/${editandoId}`, form);
        alert(`${tipo} actualizado correctamente`);
      } else {
        // CREAR (POST /crear) [cite: 8, 9, 11]
        await apiLashes.post(`/${endpoint}/crear`, form);
        alert(`${tipo} creado correctamente`);
      }
      // Limpiar formulario y recargar
      setForm({ nombre: '', descripcion: '' });
      setEditandoId(null);
      cargarDatos();
    } catch (error) {
      console.error(`Error guardando ${tipo}:`, error);
      alert(`Error al guardar ${tipo}`);
    }
  };

  // 3. Manejar Eliminar
  const handleDelete = async (id, endpoint) => {
    if (!window.confirm("¿Seguro que deseas eliminar este elemento?")) return;
    try {
      // ELIMINAR (DELETE /eliminar/:id) [cite: 8, 9, 12]
      await apiLashes.delete(`/${endpoint}/eliminar/${id}`);
      cargarDatos();
    } catch (error) {
      console.error("Error eliminando:", error);
    }
  };

  // 4. Preparar Edición (Carga los datos en el input)
  const handleEdit = (item, setForm, setEditandoId) => {
    setForm({ nombre: item.nombre, descripcion: item.descripcion });
    setEditandoId(item._id);
  };

  return (
    <div>
      <h3>Gestión de Características</h3>
      <p>Agrega, modifica o elimina los Estilos, Diseños y Técnicas.</p>
      <p style={{ fontSize: '1rem', color: '#0b0b0bff' }}>* Nota: Se requiere nombre y descripción para guardar.</p>

      {/* --- SECCIÓN ESTILOS --- */}
      <div className="admin-sub-panel">
        <h4>Estilos</h4>
        <form className="admin-form-inline" onSubmit={(e) => handleSave(e, 'Estilo', formEstilo, setFormEstilo, editandoEstilo, setEditandoEstilo, 'estilos')}>
          <div className="campo2">
            <input
              type="text" name="nombre" placeholder="Nombre estilo"
              value={formEstilo.nombre} onChange={(e) => handleChange(e, setFormEstilo, formEstilo)}
            />
          </div>
          <div className="campo2">
            <input
              type="text" name="descripcion" placeholder="Descripción"
              value={formEstilo.descripcion} onChange={(e) => handleChange(e, setFormEstilo, formEstilo)}
            />
          </div>
          <button type="submit" className="boton3">
            {editandoEstilo ? 'Actualizar' : 'Agregar'}
          </button>
          {editandoEstilo && <button type="button" className="login-submit-btn danger" onClick={() => { setEditandoEstilo(null); setFormEstilo({ nombre: '', descripcion: '' }) }}>Cancelar</button>}
        </form>

        <div className="admin-item-list">
          {estilos.map((item) => (
            <div className="admin-item" key={item._id}>
              <span><b>{item.nombre}</b>: {item.descripcion}</span>
              <div>
                <button className="boton3" onClick={() => handleEdit(item, setFormEstilo, setEditandoEstilo)}>Editar</button>
                <button className="boton3" onClick={() => handleDelete(item._id, 'estilos')}>Eliminar</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- SECCIÓN DISEÑOS --- */}
      <div className="admin-sub-panel">
        <h4>Diseños</h4>
        <form className="admin-form-inline" onSubmit={(e) => handleSave(e, 'Diseño', formDiseno, setFormDiseno, editandoDiseno, setEditandoDiseno, 'disenos')}>
          <div className="campo2">
            <input
              type="text" name="nombre" placeholder="Nombre diseño"
              value={formDiseno.nombre} onChange={(e) => handleChange(e, setFormDiseno, formDiseno)}
            />
          </div>
          <div className="campo2">
            <input
              type="text" name="descripcion" placeholder="Descripción"
              value={formDiseno.descripcion} onChange={(e) => handleChange(e, setFormDiseno, formDiseno)}
            />
          </div>
          <button type="submit" className="boton3">
            {editandoDiseno ? 'Actualizar' : 'Agregar'}
          </button>
          {editandoDiseno && <button type="button" className="login-submit-btn danger" onClick={() => { setEditandoDiseno(null); setFormDiseno({ nombre: '', descripcion: '' }) }}>Cancelar</button>}
        </form>

        <div className="admin-item-list">
          {disenos.map((item) => (
            <div className="admin-item" key={item._id}>
              <span><b>{item.nombre}</b>: {item.descripcion}</span>
              <div>
                <button className="boton3" onClick={() => handleEdit(item, setFormDiseno, setEditandoDiseno)}>Editar</button>
                <button className="boton3" onClick={() => handleDelete(item._id, 'disenos')}>Eliminar</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- SECCIÓN TÉCNICAS --- */}
      <div className="admin-sub-panel">
        <h4>Técnicas</h4>
        <form className="admin-form-inline" onSubmit={(e) => handleSave(e, 'Técnica', formTecnica, setFormTecnica, editandoTecnica, setEditandoTecnica, 'tecnicas')}>
          <div className="campo2">
            <input
              type="text" name="nombre" placeholder="Nombre técnica"
              value={formTecnica.nombre} onChange={(e) => handleChange(e, setFormTecnica, formTecnica)}
            />
          </div>
          <div className="campo2">
            <input
              type="text" name="descripcion" placeholder="Descripción"
              value={formTecnica.descripcion} onChange={(e) => handleChange(e, setFormTecnica, formTecnica)}
            />
          </div>
          <button type="submit" className="boton3">
            {editandoTecnica ? 'Actualizar' : 'Agregar'}
          </button>
          {editandoTecnica && <button type="button" className="login-submit-btn danger" onClick={() => { setEditandoTecnica(null); setFormTecnica({ nombre: '', descripcion: '' }) }}>Cancelar</button>}
        </form>

        <div className="admin-item-list">
          {tecnicas.map((item) => (
            <div className="admin-item" key={item._id}>
              <span><b>{item.nombre}</b>: {item.descripcion}</span>
              <div>
                <button className="boton3" onClick={() => handleEdit(item, setFormTecnica, setEditandoTecnica)}>Editar</button>
                <button className="boton3" onClick={() => handleDelete(item._id, 'tecnicas')}>Eliminar</button>
              </div>
            </div>
          ))}
        </div>
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
        className="boton3"
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
                      className="boton3"
                      onClick={() => guardarEdicion(cita._id)}
                    >
                      Guardar
                    </button>

                    <button
                      className="boton3"
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
                      className="boton3"
                      onClick={() => handleEditar(cita)}
                    >
                      Editar
                    </button>

                    <button
                      className="boton3"
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