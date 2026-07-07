import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import MaterialDatePicker from '../components/MaterialDatePicker';
import NuevoProveedorModal from '../components/NuevoProveedorModal';
import API from '../services/axiosConfig';

var PROVEEDORES_INICIALES = [
  { id: 1, nombre: 'Vet Pharma' },
  { id: 2, nombre: 'Zoetis' },
  { id: 3, nombre: 'Royal Canin' },
  { id: 4, nombre: 'Bayer' },
  { id: 5, nombre: 'Whiskas' },
  { id: 6, nombre: 'Kong' },
];

var FORMATOS_PERMITIDOS = ['image/jpeg', 'image/png', 'image/webp'];
var MAX_SIZE = 5 * 1024 * 1024;

function NuevoProducto() {
  const navigate = useNavigate();
  var fileInputRef = useRef(null);
  var [proveedores, setProveedores] = useState(PROVEEDORES_INICIALES);
  var [showModalProveedor, setShowModalProveedor] = useState(false);
  var [imagenPreview, setImagenPreview] = useState(null);
  var [imagenNombre, setImagenNombre] = useState('');
  var [imagenError, setImagenError] = useState('');
  var [dragOver, setDragOver] = useState(false);
  const [form, setForm] = useState({
    nombre: '', categoria: '', sku: '', tipo: '', presentacion: '', unidad: '', descripcion: '',
    proveedor: '', precioCompra: '', precioVenta: '', margen: '',
    stockActual: 0, stockMinimo: 0, stockMaximo: '', ubicacion: '',
    fechaVencimiento: '', lote: '', fabricante: '', almacenamiento: '', registroSanitario: '', notas: '',
  });
  const [descCount, setDescCount] = useState(0);
  const [notasCount, setNotasCount] = useState(0);
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (name === 'descripcion') setDescCount(value.length);
    if (name === 'notas') setNotasCount(value.length);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await API.post('/productos', {
        nombre: form.nombre,
        categoria: form.categoria,
        sku: form.sku,
        tipo: form.tipo,
        presentacion: form.presentacion,
        unidad: form.unidad,
        descripcion: form.descripcion,
        proveedor: form.proveedor,
        precioCompra: form.precioCompra ? Number(form.precioCompra) : null,
        precioVenta: form.precioVenta ? Number(form.precioVenta) : null,
        stockActual: Number(form.stockActual),
        stockMinimo: Number(form.stockMinimo),
        stockMaximo: form.stockMaximo ? Number(form.stockMaximo) : null,
        ubicacion: form.ubicacion || null,
        fechaVencimiento: form.fechaVencimiento || null,
        lote: form.lote || null,
        fabricante: form.fabricante || null,
        almacenamiento: form.almacenamiento || null,
      });
      navigate('/inventario');
    } catch (err) {
      console.error('Error al guardar producto:', err);
      alert('Error al guardar el producto. Intente nuevamente.');
    } finally {
      setSaving(false);
    }
  };

  function handleProveedorCreado(nuevo) {
    setProveedores(function (prev) { return prev.concat(nuevo); });
  }

  var validarYPrevisualizar = useCallback(function (file) {
    setImagenError('');
    if (!file) return;
    if (!FORMATOS_PERMITIDOS.includes(file.type)) {
      setImagenError('Formato no permitido. Usa JPG, PNG o WEBP.');
      return;
    }
    if (file.size > MAX_SIZE) {
      setImagenError('La imagen supera los 5MB.');
      return;
    }
    setImagenNombre(file.name);
    var reader = new FileReader();
    reader.onload = function (e) { setImagenPreview(e.target.result); };
    reader.readAsDataURL(file);
  }, []);

  function handleFileSelect(e) {
    var file = e.target.files[0];
    if (file) validarYPrevisualizar(file);
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragOver(false);
    var file = e.dataTransfer.files[0];
    if (file) validarYPrevisualizar(file);
  }

  function handleDragOver(e) {
    e.preventDefault();
    setDragOver(true);
  }

  function handleDragLeave() {
    setDragOver(false);
  }

  function handleRemoveImage() {
    setImagenPreview(null);
    setImagenNombre('');
    setImagenError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  const inputClass = "w-full px-4 py-2.5 border border-gray-300 dark:border-[#3A3A3A] rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white dark:bg-[#2C2C2C] text-gray-900 dark:text-[#E0E0E0] text-sm";
  const labelClass = "block text-sm font-medium text-gray-700 dark:text-[#B0B0B0] mb-1.5";
  const selectClass = inputClass + " appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22%236b7280%22%3E%3Cpath%20fill-rule%3D%22evenodd%22%20d%3D%22M5.23%207.21a.75.75%200%20011.06.02L10%2011.168l3.71-3.938a.75.75%200%20111.08%201.04l-4.25%204.5a.75.75%200%2001-1.08%200l-4.25-4.5a.75.75%200%2001.02-1.06z%22%20clip-rule%3D%22evenodd%22%20%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem] bg-[right_0.5rem_center] bg-no-repeat pr-10 dark:bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22%23909090%22%3E%3Cpath%20fill-rule%3D%22evenodd%22%20d%3D%22M5.23%207.21a.75.75%200%20011.06.02L10%2011.168l3.71-3.938a.75.75%200%20111.08%201.04l-4.25%204.5a.75.75%200%2001-1.08%200l-4.25-4.5a.75.75%200%2001.02-1.06z%22%20clip-rule%3D%22evenodd%22%20%2F%3E%3C%2Fsvg%3E')]";

  return (
    <div className="flex flex-col h-full gap-6">
      <div className="flex-none flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/inventario')} className="p-2 hover:bg-gray-200 dark:hover:bg-[#333] rounded-lg transition-colors cursor-pointer">
            <svg className="w-5 h-5 text-gray-600 dark:text-[#A0A0A0]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
          </button>
          <div>
            <nav className="text-sm text-gray-500 dark:text-[#909090] mb-1">
              <span className="hover:text-blue-600 cursor-pointer" onClick={() => navigate('/inventario')}>Inventario</span>
              <span className="mx-2">/</span>
              <span className="hover:text-blue-600 cursor-pointer" onClick={() => navigate('/inventario')}>Farmacia</span>
              <span className="mx-2">/</span>
              <span className="hover:text-blue-600 cursor-pointer" onClick={() => navigate('/inventario')}>Productos</span>
              <span className="mx-2">/</span>
              <span className="text-gray-800 dark:text-[#E0E0E0] font-medium">Nuevo Producto</span>
            </nav>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-[#E0E0E0]">Nuevo Producto</h1>
          </div>
        </div>
        <button onClick={() => navigate('/inventario')} className="flex items-center gap-2 rounded-xl border border-gray-300 dark:border-[#3A3A3A] bg-white dark:bg-[#2C2C2C] px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-[#D0D0D0] transition-colors hover:bg-gray-50 dark:hover:bg-[#333] cursor-pointer">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" /></svg>
          Volver a Productos
        </button>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-6">
        <div className="col-span-9 space-y-5">
          <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl shadow-sm border border-gray-200 dark:border-[#333] p-6">
            <h2 className="text-base font-bold text-gray-800 dark:text-[#E0E0E0] mb-5 flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 text-xs font-bold">1</span>
              Información General
            </h2>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="col-span-2">
                <label className={labelClass}>Nombre del Producto *</label>
                <input type="text" name="nombre" value={form.nombre} onChange={handleChange} required className={inputClass} placeholder="Ingrese el nombre del producto" />
              </div>
              <div>
                <label className={labelClass}>Categoría *</label>
                <select name="categoria" value={form.categoria} onChange={handleChange} required className={selectClass}>
                  <option value="">Seleccione</option>
                  <option value="Medicamentos">Medicamentos</option>
                  <option value="Alimentos">Alimentos</option>
                  <option value="Accesorios">Accesorios</option>
                  <option value="Vacunas">Vacunas</option>
                  <option value="Higiene">Higiene</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <label className={labelClass}>Código / SKU *</label>
                <input type="text" name="sku" value={form.sku} onChange={handleChange} required className={inputClass} placeholder="Ej: MED-001" />
              </div>
              <div>
                <label className={labelClass}>Tipo de Producto *</label>
                <select name="tipo" value={form.tipo} onChange={handleChange} required className={selectClass}>
                  <option value="">Seleccione</option>
                  <option value="Medicamento">Medicamento</option>
                  <option value="Alimento">Alimento</option>
                  <option value="Accesorio">Accesorio</option>
                  <option value="Insumo">Insumo</option>
                  <option value="Equipo">Equipo</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Presentación *</label>
                <select name="presentacion" value={form.presentacion} onChange={handleChange} required className={selectClass}>
                  <option value="">Seleccione</option>
                  <option value="Tableta">Tableta</option>
                  <option value="Jarabe">Jarabe</option>
                  <option value="Inyectable">Inyectable</option>
                  <option value="Polvo">Polvo</option>
                  <option value="Crema">Crema</option>
                  <option value="Solución">Solución</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <label className={labelClass}>Unidad de Medida *</label>
                <select name="unidad" value={form.unidad} onChange={handleChange} required className={selectClass}>
                  <option value="">Seleccione</option>
                  <option value="mg">mg</option>
                  <option value="g">g</option>
                  <option value="kg">kg</option>
                  <option value="ml">ml</option>
                  <option value="l">L</option>
                  <option value="unidad">Unidad</option>
                  <option value="caja">Caja</option>
                </select>
              </div>
              <div className="col-span-2" />
            </div>
            <div>
              <label className={labelClass}>Descripción</label>
              <div className="relative">
                <textarea name="descripcion" value={form.descripcion} onChange={handleChange} maxLength={500} rows={3} className={inputClass + ' resize-none'} placeholder="Descripción del producto..." />
                <span className="absolute bottom-3 right-3 text-xs text-gray-400 dark:text-[#808080]">{descCount}/500</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl shadow-sm border border-gray-200 dark:border-[#333] p-6">
            <h2 className="text-base font-bold text-gray-800 dark:text-[#E0E0E0] mb-5 flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 text-xs font-bold">2</span>
              Proveedor y Precios
            </h2>
            <div className="flex items-end gap-3 mb-4">
              <div className="flex-1">
                <label className={labelClass}>Proveedor *</label>
                <select name="proveedor" value={form.proveedor} onChange={handleChange} required className={selectClass}>
                  <option value="">Seleccione un proveedor</option>
                  {proveedores.map(function (p) { return <option key={p.id} value={p.nombre}>{p.nombre}</option>; })}
                </select>
              </div>
              <button type="button" onClick={function () { setShowModalProveedor(true); }} className="shrink-0 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors cursor-pointer py-2.5">
                + Nuevo Proveedor
              </button>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className={labelClass}>Precio de Compra *</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">S/</span>
                  <input type="number" name="precioCompra" value={form.precioCompra} onChange={handleChange} required step="0.01" min="0" className={inputClass + ' pl-9'} placeholder="0.00" />
                </div>
              </div>
              <div>
                <label className={labelClass}>Precio de Venta *</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">S/</span>
                  <input type="number" name="precioVenta" value={form.precioVenta} onChange={handleChange} required step="0.01" min="0" className={inputClass + ' pl-9'} placeholder="0.00" />
                </div>
              </div>
              <div>
                <label className={labelClass}>Margen de Ganancia</label>
                <div className="relative">
                  <input type="number" name="margen" value={form.margen} onChange={handleChange} step="0.1" min="0" max="100" className={inputClass + ' pr-9'} placeholder="0" />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-[#909090] text-sm">%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl shadow-sm border border-gray-200 dark:border-[#333] p-6">
            <h2 className="text-base font-bold text-gray-800 dark:text-[#E0E0E0] mb-5 flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 text-xs font-bold">3</span>
              Inventario
            </h2>
            <div className="grid grid-cols-4 gap-4 mb-4">
              <div>
                <label className={labelClass}>Stock Actual *</label>
                <input type="number" name="stockActual" value={form.stockActual} onChange={handleChange} required min="0" className={inputClass} placeholder="0" />
              </div>
              <div>
                <label className={labelClass}>Stock Mínimo *</label>
                <input type="number" name="stockMinimo" value={form.stockMinimo} onChange={handleChange} required min="0" className={inputClass} placeholder="0" />
              </div>
              <div>
                <label className={labelClass}>Stock Máximo</label>
                <input type="number" name="stockMaximo" value={form.stockMaximo} onChange={handleChange} min="0" className={inputClass} placeholder="Opcional" />
              </div>
              <div>
                <label className={labelClass}>Ubicación</label>
                <select name="ubicacion" value={form.ubicacion} onChange={handleChange} className={selectClass}>
                  <option value="">Seleccione</option>
                  <option value="Almacén A">Almacén A</option>
                  <option value="Almacén B">Almacén B</option>
                  <option value="Farmacia">Farmacia</option>
                  <option value="Vitrina">Vitrina</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl shadow-sm border border-gray-200 dark:border-[#333] p-6">
            <h2 className="text-base font-bold text-gray-800 dark:text-[#E0E0E0] mb-5 flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 text-xs font-bold">4</span>
              Información Adicional
            </h2>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <MaterialDatePicker value={form.fechaVencimiento} onChange={function (val) { handleChange({ target: { name: 'fechaVencimiento', value: val } }); }} label="Fecha de Vencimiento" placeholder="DD/MM/YYYY" />
              </div>
              <div>
                <label className={labelClass}>Número de Lote</label>
                <input type="text" name="lote" value={form.lote} onChange={handleChange} className={inputClass} placeholder="Ej: LOTE-001" />
              </div>
              <div>
                <label className={labelClass}>Fabricante / Marca</label>
                <input type="text" name="fabricante" value={form.fabricante} onChange={handleChange} className={inputClass} placeholder="Nombre del fabricante" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className={labelClass}>Condiciones de Almacenamiento</label>
                <select name="almacenamiento" value={form.almacenamiento} onChange={handleChange} className={selectClass}>
                  <option value="">Seleccione</option>
                  <option value="Temperatura ambiente">Temperatura ambiente</option>
                  <option value="Refrigerado (2-8°C)">Refrigerado (2-8°C)</option>
                  <option value="Congelado (-20°C)">Congelado (-20°C)</option>
                  <option value="Lugar fresco y seco">Lugar fresco y seco</option>
                  <option value="Protegido de la luz">Protegido de la luz</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Registro Sanitario</label>
                <input type="text" name="registroSanitario" value={form.registroSanitario} onChange={handleChange} className={inputClass} placeholder="Ej: RS-12345" />
              </div>
            </div>
            <div>
              <label className={labelClass}>Notas Adicionales</label>
              <div className="relative">
                <textarea name="notas" value={form.notas} onChange={handleChange} maxLength={250} rows={2} className={inputClass + ' resize-none'} placeholder="Información adicional..." />
                <span className="absolute bottom-3 right-3 text-xs text-gray-400 dark:text-[#808080]">{notasCount}/250</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 pt-2">
            <button type="button" onClick={() => navigate('/inventario')} className="px-6 py-3 border border-gray-300 dark:border-[#3A3A3A] rounded-xl text-gray-700 dark:text-[#D0D0D0] font-medium hover:bg-gray-50 dark:hover:bg-[#2C2C2C] transition-colors cursor-pointer flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
              Cancelar
            </button>
            <button type="submit" disabled={saving} className="flex-1 py-3 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50" style={{ backgroundColor: '#5F7B65' }}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
              {saving ? 'Guardando...' : 'Guardar Producto'}
            </button>
          </div>
        </div>

        <div className="col-span-3 space-y-5">
          <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl shadow-sm border border-gray-200 dark:border-[#333] p-6">
            <h3 className="text-sm font-bold text-gray-800 dark:text-[#E0E0E0] mb-4">Subir imagen</h3>
            <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={handleFileSelect} className="hidden" />
            {imagenPreview ? (
              <div className="relative">
                <img src={imagenPreview} alt="Vista previa" className="w-full h-40 object-cover rounded-xl border border-gray-200 dark:border-[#3A3A3A]" />
                <p className="text-xs text-gray-500 dark:text-[#909090] mt-2 text-center truncate">{imagenNombre}</p>
                <button type="button" onClick={handleRemoveImage} className="mt-2 w-full rounded-lg border border-red-300 dark:border-red-700 bg-white dark:bg-[#2C2C2C] px-3 py-1.5 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors cursor-pointer">
                  Quitar imagen
                </button>
              </div>
            ) : (
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={function () { if (fileInputRef.current) fileInputRef.current.click(); }}
                className={'border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors ' + (dragOver ? 'border-[#5F7B65] bg-[#5F7B65]/5' : 'border-gray-300 dark:border-[#3A3A3A] hover:border-[#5F7B65] hover:bg-[#5F7B65]/5')}
              >
                <svg className="w-12 h-12 text-gray-300 dark:text-[#606060] mb-3" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Zm16.5-7.5A2.25 2.25 0 0 0 18 15.75M6.75 6.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" />
                </svg>
                <p className="text-sm font-medium text-gray-600 dark:text-[#A0A0A0] mb-1">Arrastra tu imagen aquí</p>
                <p className="text-xs text-gray-400 dark:text-[#808080] mb-3">o haz clic para seleccionar</p>
                <button type="button" className="px-4 py-2 bg-white dark:bg-[#2C2C2C] border border-gray-300 dark:border-[#3A3A3A] rounded-lg text-sm font-medium text-gray-700 dark:text-[#D0D0D0] hover:bg-gray-50 dark:hover:bg-[#333] transition-colors cursor-pointer">
                  Seleccionar archivo
                </button>
                <p className="text-xs text-gray-400 dark:text-[#808080] mt-2 text-center">Formatos: JPG, PNG, WEBP (Máx. 5MB)</p>
              </div>
            )}
            {imagenError && <p className="text-xs text-red-500 mt-2">{imagenError}</p>}
          </div>

          <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl shadow-sm border border-gray-200 dark:border-[#333] p-5">
            <h3 className="text-sm font-bold text-gray-800 dark:text-[#E0E0E0] mb-3">Resumen del Producto</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-500 dark:text-[#909090]">Categoría:</span><span className="text-gray-800 dark:text-[#E0E0E0] font-medium">{form.categoria || '—'}</span></div>
              <div className="flex justify-between"><span className="text-gray-500 dark:text-[#909090]">Proveedor:</span><span className="text-gray-800 dark:text-[#E0E0E0] font-medium">{form.proveedor || '—'}</span></div>
              <div className="flex justify-between"><span className="text-gray-500 dark:text-[#909090]">Stock Actual:</span><span className="text-gray-800 dark:text-[#E0E0E0] font-medium">{form.stockActual || 0}</span></div>
              <div className="flex justify-between"><span className="text-gray-500 dark:text-[#909090]">Precio Compra:</span><span className="text-gray-800 dark:text-[#E0E0E0] font-medium">S/ {form.precioCompra ? parseFloat(form.precioCompra).toFixed(2) : '0.00'}</span></div>
              <div className="flex justify-between"><span className="text-gray-500 dark:text-[#909090]">Precio Venta:</span><span className="text-gray-800 dark:text-[#E0E0E0] font-medium">S/ {form.precioVenta ? parseFloat(form.precioVenta).toFixed(2) : '0.00'}</span></div>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 space-y-2">
            <h4 className="text-sm font-bold text-blue-800 dark:text-blue-300 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" /></svg>
              Información
            </h4>
            <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">Los campos marcados con <span className="font-bold">*</span> son obligatorios.</p>
          </div>
        </div>
      </form>

      {showModalProveedor && (
        <NuevoProveedorModal
          onClose={function () { setShowModalProveedor(false); }}
          onProveedorCreado={handleProveedorCreado}
        />
      )}
    </div>
  );
}

export default NuevoProducto;
