import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/axiosConfig';
import MaterialDatePicker from '../components/MaterialDatePicker';

function computeEstado(p) {
  if (p.stockActual === 0 && p.fechaVencimiento) return 'Vencido';
  if (p.stockActual < p.stockMinimo) return p.stockActual === 0 ? 'Crítico' : 'Bajo';
  return 'Normal';
}

function formatFecha(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

const estadoStyles = {
  Normal: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  Bajo: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
  Crítico: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  Vencido: 'bg-gray-100 text-gray-600 dark:bg-[#2C2C2C] dark:text-[#A0A0A0]',
};

function ModalDetallesProducto({ producto, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl shadow-2xl w-full max-w-lg mx-4" onClick={function (e) { e.stopPropagation(); }}>
        <div className="flex items-center justify-between p-6 pb-0">
          <h2 className="text-xl font-bold text-gray-900 dark:text-[#E0E0E0]">Detalles del Producto</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#333] text-gray-400 dark:text-[#808080] hover:text-gray-600 transition-colors cursor-pointer">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div className="bg-gray-50 dark:bg-[#2C2C2C] rounded-xl p-4">
            <div className="flex items-center gap-3 mb-3">
              <img src={producto.imagen} alt={producto.nombre} className="w-12 h-12 rounded-lg object-cover ring-1 ring-gray-200 dark:ring-[#404040]" />
              <div>
                <p className="font-bold text-gray-900 dark:text-[#E0E0E0]">{producto.nombre}</p>
                <p className="text-sm text-gray-500 dark:text-[#909090]">SKU: {producto.sku}</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><p className="text-xs text-gray-500 dark:text-[#909090] font-medium">Categoría</p><span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 mt-1">{producto.categoria}</span></div>
            <div><p className="text-xs text-gray-500 dark:text-[#909090] font-medium">Proveedor</p><p className="text-sm font-semibold text-gray-900 dark:text-[#E0E0E0] mt-1">{producto.proveedor}</p></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><p className="text-xs text-gray-500 dark:text-[#909090] font-medium">Stock Actual</p><p className="text-sm font-semibold text-gray-900 dark:text-[#E0E0E0] mt-1">{producto.stockActual}</p></div>
            <div><p className="text-xs text-gray-500 dark:text-[#909090] font-medium">Stock Mínimo</p><p className="text-sm font-semibold text-gray-900 dark:text-[#E0E0E0] mt-1">{producto.stockMinimo}</p></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><p className="text-xs text-gray-500 dark:text-[#909090] font-medium">Precio Compra</p><p className="text-sm font-semibold text-gray-900 dark:text-[#E0E0E0] mt-1">S/ {(producto.precioCompra || 0).toFixed(2)}</p></div>
            <div><p className="text-xs text-gray-500 dark:text-[#909090] font-medium">Precio Venta</p><p className="text-sm font-semibold text-gray-900 dark:text-[#E0E0E0] mt-1">S/ {(producto.precioVenta || 0).toFixed(2)}</p></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><p className="text-xs text-gray-500 dark:text-[#909090] font-medium">Vencimiento</p><p className="text-sm font-semibold text-gray-900 dark:text-[#E0E0E0] mt-1">{formatFecha(producto.fechaVencimiento)}</p></div>
            <div><p className="text-xs text-gray-500 dark:text-[#909090] font-medium">Estado</p><span className={'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold mt-1 ' + estadoStyles[producto.estado]}>{producto.estado}</span></div>
          </div>
        </div>
        <div className="p-6 pt-0">
          <button onClick={onClose} className="w-full py-2.5 border border-gray-300 dark:border-[#404040] rounded-xl text-sm font-medium text-gray-700 dark:text-[#D0D0D0] hover:bg-gray-50 dark:hover:bg-[#2C2C2C] transition-colors cursor-pointer">Cerrar</button>
        </div>
      </div>
    </div>
  );
}

function ModalEditarProducto({ producto, onClose, onGuardar }) {
  var [form, setForm] = useState({
    nombre: producto.nombre || '',
    sku: producto.sku || '',
    categoria: producto.categoria || '',
    proveedor: producto.proveedor || '',
    stockActual: producto.stockActual || 0,
    stockMinimo: producto.stockMinimo || 0,
    precioCompra: producto.precioCompra || 0,
    precioVenta: producto.precioVenta || 0,
    fechaVencimiento: producto.fechaVencimiento || '',
    estado: producto.estado || 'Normal',
  });
  var [saving, setSaving] = useState(false);
  var inputClass = 'w-full rounded-lg border border-gray-300 dark:border-[#404040] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#5F7B65] focus:border-[#5F7B65] bg-white dark:bg-[#2C2C2C] text-gray-900 dark:text-[#E0E0E0]';
  var labelClass = 'block text-sm font-medium text-gray-700 dark:text-[#D0D0D0] mb-1';

  function handleChange(e) {
    setForm(Object.assign({}, form, { [e.target.name]: e.target.value }));
  }

  async function handleSubmit() {
    setSaving(true);
    try {
      var payload = Object.assign({}, form, {
        stockActual: Number(form.stockActual),
        stockMinimo: Number(form.stockMinimo),
        precioCompra: Number(form.precioCompra),
        precioVenta: Number(form.precioVenta),
      });
      await API.put('/productos/' + producto.id, payload);
      onGuardar(producto.id, form);
      onClose();
    } catch (err) {
      alert('Error al guardar: ' + (err.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto" onClick={function (e) { e.stopPropagation(); }}>
        <div className="flex items-center justify-between p-6 pb-0">
          <h2 className="text-xl font-bold text-gray-900 dark:text-[#E0E0E0]">Editar Producto</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#333] text-gray-400 dark:text-[#808080] hover:text-gray-600 transition-colors cursor-pointer">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2"><label className={labelClass}>Nombre</label><input type="text" name="nombre" value={form.nombre} onChange={handleChange} className={inputClass} /></div>
            <div><label className={labelClass}>SKU</label><input type="text" name="sku" value={form.sku} onChange={handleChange} className={inputClass} /></div>
            <div><label className={labelClass}>Categoría</label><select name="categoria" value={form.categoria} onChange={handleChange} className={inputClass}><option>Medicamentos</option><option>Alimentos</option><option>Accesorios</option><option>Vacunas</option><option>Higiene</option></select></div>
            <div><label className={labelClass}>Proveedor</label><select name="proveedor" value={form.proveedor} onChange={handleChange} className={inputClass}><option>Vet Pharma</option><option>Zoetis</option><option>Royal Canin</option><option>Bayer</option><option>Whiskas</option><option>Kong</option><option>Virbac</option></select></div>
            <div><label className={labelClass}>Stock Actual</label><input type="number" name="stockActual" value={form.stockActual} onChange={handleChange} className={inputClass} /></div>
            <div><label className={labelClass}>Stock Mínimo</label><input type="number" name="stockMinimo" value={form.stockMinimo} onChange={handleChange} className={inputClass} /></div>
            <div><label className={labelClass}>Precio Compra</label><input type="number" step="0.01" name="precioCompra" value={form.precioCompra} onChange={handleChange} className={inputClass} /></div>
            <div><label className={labelClass}>Precio Venta</label><input type="number" step="0.01" name="precioVenta" value={form.precioVenta} onChange={handleChange} className={inputClass} /></div>
            <div><MaterialDatePicker value={form.fechaVencimiento} onChange={function (val) { handleChange({ target: { name: 'fechaVencimiento', value: val } }); }} label="Vencimiento" placeholder="DD/MM/YYYY" /></div>
            <div><label className={labelClass}>Estado</label><select name="estado" value={form.estado} onChange={handleChange} className={inputClass}><option>Normal</option><option>Bajo</option><option>Crítico</option><option>Vencido</option></select></div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 p-6 pt-0">
          <button onClick={onClose} disabled={saving} className="px-5 py-2.5 rounded-xl border border-gray-300 dark:border-[#404040] text-sm font-medium text-gray-700 dark:text-[#D0D0D0] hover:bg-gray-50 dark:hover:bg-[#2C2C2C] transition-colors cursor-pointer">Cancelar</button>
          <button onClick={handleSubmit} disabled={saving} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white shadow-sm transition-colors cursor-pointer disabled:opacity-50" style={{ backgroundColor: '#5F7B65' }}>{saving ? 'Guardando...' : 'Guardar Cambios'}</button>
        </div>
      </div>
    </div>
  );
}

function ModalEliminarProducto({ producto, onClose, onConfirmar }) {
  var [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    setDeleting(true);
    try {
      await API.delete('/productos/' + producto.id);
      onConfirmar(producto.id);
      onClose();
    } catch (err) {
      alert('Error al eliminar: ' + (err.response?.data?.message || err.message));
      setDeleting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl shadow-2xl w-full max-w-sm mx-4" onClick={function (e) { e.stopPropagation(); }}>
        <div className="p-6 text-center">
          <div className="mx-auto h-14 w-14 flex items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30 mb-4">
            <svg className="w-7 h-7 text-red-600" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-[#E0E0E0] mb-1">¿Eliminar producto?</h3>
          <p className="text-sm text-gray-500 dark:text-[#909090]">¿Estás seguro de que deseas eliminar <span className="font-semibold text-gray-900 dark:text-[#E0E0E0]">{producto.nombre}</span>? Esta acción no se puede deshacer.</p>
        </div>
        <div className="flex gap-3 p-6 pt-0">
          <button onClick={onClose} disabled={deleting} className="flex-1 py-2.5 rounded-xl border border-gray-300 dark:border-[#404040] text-sm font-medium text-gray-700 dark:text-[#D0D0D0] hover:bg-gray-50 dark:hover:bg-[#2C2C2C] transition-colors cursor-pointer">Cancelar</button>
          <button onClick={handleDelete} disabled={deleting} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors cursor-pointer disabled:opacity-50">{deleting ? 'Eliminando...' : 'Eliminar'}</button>
        </div>
      </div>
    </div>
  );
}

const ITEMS_PER_PAGE = 8;

function GestionInventario() {
  const navigate = useNavigate();
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('Todas');
  const [filtroProveedor, setFiltroProveedor] = useState('Todos');
  const [filtroEstado, setFiltroEstado] = useState('Todos');
  const [paginaActual, setPaginaActual] = useState(1);
  const [showModalDetalle, setShowModalDetalle] = useState(null);
  const [showModalEditar, setShowModalEditar] = useState(null);
  const [showModalEliminar, setShowModalEliminar] = useState(null);

  useEffect(() => {
    API.get('/productos').then((res) => {
      const mapped = res.data.map((p) => ({ ...p, estado: computeEstado(p), imagen: p.imagen || 'https://placehold.co/50x50/DBEAFE/1E40AF?text=PROD' }));
      setProductos(mapped);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const categorias = ['Todas', 'Medicamentos', 'Alimentos', 'Accesorios', 'Vacunas', 'Higiene'];
  const proveedores = ['Todos', 'Vet Pharma', 'Zoetis', 'Royal Canin', 'Bayer', 'Whiskas', 'Kong', 'Virbac'];
  const estados = ['Todos', 'Normal', 'Bajo', 'Crítico', 'Vencido'];

  const productosFiltrados = useMemo(() => {
    return productos.filter((p) => {
      const coincideBusqueda = (p.nombre || '').toLowerCase().includes(busqueda.toLowerCase()) || (p.sku || '').toLowerCase().includes(busqueda.toLowerCase());
      const coincideCategoria = filtroCategoria === 'Todas' || p.categoria === filtroCategoria;
      const coincideProveedor = filtroProveedor === 'Todos' || p.proveedor === filtroProveedor;
      const coincideEstado = filtroEstado === 'Todos' || p.estado === filtroEstado;
      return coincideBusqueda && coincideCategoria && coincideProveedor && coincideEstado;
    });
  }, [productos, busqueda, filtroCategoria, filtroProveedor, filtroEstado]);

  const totalPaginas = Math.ceil(productosFiltrados.length / ITEMS_PER_PAGE);
  const productosPagina = productosFiltrados.slice((paginaActual - 1) * ITEMS_PER_PAGE, paginaActual * ITEMS_PER_PAGE);
  const inicio = productosFiltrados.length > 0 ? (paginaActual - 1) * ITEMS_PER_PAGE + 1 : 0;
  const fin = Math.min(paginaActual * ITEMS_PER_PAGE, productosFiltrados.length);

  const limpiarFiltros = () => {
    setBusqueda('');
    setFiltroCategoria('Todas');
    setFiltroProveedor('Todos');
    setFiltroEstado('Todos');
    setPaginaActual(1);
  };

  var handleGuardarEdicion = function (id, form) {
    setProductos(function (prev) {
      return prev.map(function (p) {
        if (p.id !== id) return p;
        var updated = Object.assign({}, p, form);
        updated.estado = computeEstado(updated);
        return updated;
      });
    });
  };

  var handleEliminar = function (id) {
    setProductos(function (prev) { return prev.filter(function (p) { return p.id !== id; }); });
  };

  const selectClass = "rounded-xl border border-gray-300 dark:border-[#404040] bg-white dark:bg-[#2C2C2C] px-4 py-2.5 text-sm text-gray-800 dark:text-[#E0E0E0] transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 w-full appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22%236b7280%22%3E%3Cpath%20fill-rule%3D%22evenodd%22%20d%3D%22M5.23%207.21a.75.75%200%20011.06.02L10%2011.168l3.71-3.938a.75.75%200%20111.08%201.04l-4.25%204.5a.75.75%200%2001-1.08%200l-4.25-4.5a.75.75%200%2001.02-1.06z%22%20clip-rule%3D%22evenodd%22%20%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem] bg-[right_0.5rem_center] bg-no-repeat pr-10 dark:bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22%23909090%22%3E%3Cpath%20fill-rule%3D%22evenodd%22%20d%3D%22M5.23%207.21a.75.75%200%20011.06.02L10%2011.168l3.71-3.938a.75.75%200%20111.08%201.04l-4.25%204.5a.75.75%200%2001-1.08%200l-4.25-4.5a.75.75%200%2001.02-1.06z%22%20clip-rule%3D%22evenodd%22%20%2F%3E%3C%2Fsvg%3E')]";

  const totalValor = productos.reduce((sum, p) => sum + (p.precioCompra || 0) * (p.stockActual || 0), 0);
  const stockBajo = productos.filter((p) => p.stockActual < p.stockMinimo && p.stockActual > 0).length;
  const proximosVencer = productos.filter((p) => p.estado === 'Vencido').length;
  const totalProximos = productos.filter((p) => p.estado === 'Crítico' || p.estado === 'Bajo').length;

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-none items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0-3-3m3 3 3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-[#E0E0E0]">Inventario</h1>
            <p className="text-sm text-gray-500 dark:text-[#909090]">Inventario / Farmacia / Productos</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 rounded-xl border border-gray-300 dark:border-[#404040] bg-white dark:bg-[#2C2C2C] px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-[#D0D0D0] transition-colors hover:bg-gray-50 dark:hover:bg-[#333] cursor-pointer">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
            Importar Productos
          </button>
          <button onClick={() => navigate('/inventario/nuevo')} className="flex items-center gap-2 rounded-xl bg-[#5F7B65] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#5F7B65]/80 cursor-pointer">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
            Nuevo Producto
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-[#333] shadow-sm p-5">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800 dark:text-[#E0E0E0]">{productos.length}</p>
              <p className="text-sm text-gray-500 dark:text-[#909090]">Total de Productos</p>
              <p className="text-xs text-gray-400 dark:text-[#808080]">Productos registrados</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-[#333] shadow-sm p-5">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800 dark:text-[#E0E0E0]">{totalProximos}</p>
              <p className="text-sm text-gray-500 dark:text-[#909090]">Stock Bajo</p>
              <p className="text-xs text-gray-400 dark:text-[#808080]">Productos con stock bajo</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-[#333] shadow-sm p-5">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800 dark:text-[#E0E0E0]">{proximosVencer}</p>
              <p className="text-sm text-gray-500 dark:text-[#909090]">Próximos a Vencer</p>
              <p className="text-xs text-gray-400 dark:text-[#808080]">En los próximos 30 días</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-[#333] shadow-sm p-5">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50">
              <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800 dark:text-[#E0E0E0]">S/ {totalValor.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              <p className="text-sm text-gray-500 dark:text-[#909090]">Valor Total del Inventario</p>
              <p className="text-xs text-gray-400 dark:text-[#808080]">Valor de compra total</p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 dark:border-[#333] bg-white dark:bg-[#1E1E1E] p-4 shadow-sm">
        <div className="flex flex-col lg:flex-row items-end lg:items-center gap-3">
          <div className="relative flex-1 w-full">
            <svg className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-[#808080]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
            <input type="text" value={busqueda} onChange={(e) => { setBusqueda(e.target.value); setPaginaActual(1); }} placeholder="Buscar por nombre de producto..." className="w-full rounded-xl border border-gray-300 dark:border-[#404040] bg-white dark:bg-[#2C2C2C] pl-10 pr-4 py-2.5 text-sm text-gray-800 dark:text-[#E0E0E0] placeholder-gray-400 dark:placeholder-[#808080] transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
          </div>
          <select value={filtroCategoria} onChange={(e) => { setFiltroCategoria(e.target.value); setPaginaActual(1); }} className={selectClass}>
            <option value="Todas">Categoría</option>
            {categorias.filter(c => c !== 'Todas').map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={filtroProveedor} onChange={(e) => { setFiltroProveedor(e.target.value); setPaginaActual(1); }} className={selectClass}>
            <option value="Todos">Proveedor</option>
            {proveedores.filter(p => p !== 'Todos').map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
          <select value={filtroEstado} onChange={(e) => { setFiltroEstado(e.target.value); setPaginaActual(1); }} className={selectClass}>
            <option value="Todos">Estado</option>
            {estados.filter(e => e !== 'Todos').map((e) => <option key={e} value={e}>{e}</option>)}
          </select>
          <button className="flex items-center gap-2 rounded-xl border border-gray-300 dark:border-[#404040] bg-white dark:bg-[#2C2C2C] px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-[#D0D0D0] transition-colors hover:bg-gray-50 dark:hover:bg-[#333] cursor-pointer">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z" /></svg>
            Filtro Avanzado
          </button>
          <button onClick={limpiarFiltros} className="flex items-center gap-2 rounded-xl border border-gray-300 dark:border-[#404040] bg-white dark:bg-[#2C2C2C] px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-[#D0D0D0] transition-colors hover:bg-gray-50 dark:hover:bg-[#333] cursor-pointer">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
            Limpiar filtros
          </button>
          <button className="flex items-center gap-2 rounded-xl border border-gray-300 dark:border-[#404040] bg-white dark:bg-[#2C2C2C] px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-[#D0D0D0] transition-colors hover:bg-gray-50 dark:hover:bg-[#333] cursor-pointer">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
            Exportar
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col min-h-0 rounded-2xl bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-[#333] shadow-sm overflow-hidden mt-6">
        <div className="flex-1 overflow-auto min-h-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-[#333] bg-gray-50 dark:bg-[#2C2C2C]">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-[#909090] uppercase tracking-wider">Producto</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-[#909090] uppercase tracking-wider">Categoría</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-[#909090] uppercase tracking-wider">Proveedor</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-[#909090] uppercase tracking-wider">Stock Actual</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-[#909090] uppercase tracking-wider">Stock Mínimo</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-[#909090] uppercase tracking-wider">Precio Compra</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-[#909090] uppercase tracking-wider">Precio Venta</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-[#909090] uppercase tracking-wider">Vencimiento</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-[#909090] uppercase tracking-wider">Estado</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 dark:text-[#909090] uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-[#333]">
              {productosPagina.map((p) => (
                <tr key={p.id} className="transition-colors hover:bg-gray-50 dark:hover:bg-[#2C2C2C]">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={p.imagen} alt={p.nombre} className="w-10 h-10 rounded-lg object-cover ring-1 ring-gray-200 dark:ring-[#404040]" />
                      <div>
                        <p className="text-sm font-medium text-gray-800 dark:text-[#E0E0E0]">{p.nombre}</p>
                        <p className="text-xs text-gray-400 dark:text-[#808080]">SKU: {p.sku}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300">{p.categoria}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-[#A0A0A0]">{p.proveedor}</td>
                  <td className="px-4 py-3">
                    <span className={`text-sm font-semibold ${p.stockActual === 0 ? 'text-red-600 dark:text-red-400' : p.stockActual < p.stockMinimo ? 'text-orange-600 dark:text-orange-400' : 'text-gray-800 dark:text-[#E0E0E0]'}`}>
                      {p.stockActual}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500 dark:text-[#909090]">{p.stockMinimo}</td>
                  <td className="px-4 py-3 text-sm text-gray-800 dark:text-[#E0E0E0]">S/ {(p.precioCompra || 0).toFixed(2)}</td>
                  <td className="px-4 py-3 text-sm text-gray-800 dark:text-[#E0E0E0] font-medium">S/ {(p.precioVenta || 0).toFixed(2)}</td>
                  <td className="px-4 py-3 text-sm text-gray-500 dark:text-[#909090]">{formatFecha(p.fechaVencimiento)}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${estadoStyles[p.estado]}`}>{p.estado}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-1">
                      <button onClick={function () { setShowModalDetalle(p); }} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-500 hover:text-blue-700 transition-colors cursor-pointer" title="Ver Detalles">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>
                      </button>
                      <button onClick={function () { setShowModalEditar(p); }} className="p-1.5 rounded-lg hover:bg-amber-50 text-amber-500 hover:text-amber-700 transition-colors cursor-pointer" title="Editar">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" /></svg>
                      </button>
                      <button onClick={function () { setShowModalEliminar(p); }} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 hover:text-red-700 transition-colors cursor-pointer" title="Eliminar">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {productosPagina.length === 0 && (
                <tr>
                  <td colSpan={10} className="px-4 py-12 text-center text-sm text-gray-400 dark:text-[#808080]">No se encontraron productos con los filtros aplicados.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex-none flex items-center justify-between border-t border-gray-200 dark:border-[#333] px-4 py-3">
          <p className="text-sm text-gray-500 dark:text-[#909090]">Mostrando {inicio} a {fin} de {productosFiltrados.length} productos</p>
          <div className="flex items-center gap-1">
            <button onClick={() => setPaginaActual((p) => Math.max(1, p - 1))} disabled={paginaActual === 1} className="flex items-center justify-center rounded-lg border border-gray-300 dark:border-[#404040] bg-white dark:bg-[#2C2C2C] px-2.5 py-1.5 text-sm font-medium text-gray-700 dark:text-[#D0D0D0] transition-colors hover:bg-gray-50 dark:hover:bg-[#333] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" /></svg>
            </button>
            {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((pag) => (
              <button key={pag} onClick={() => setPaginaActual(pag)} className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-semibold transition-colors cursor-pointer ${paginaActual === pag ? 'bg-[#5F7B65] text-white' : 'border border-gray-300 dark:border-[#404040] bg-white dark:bg-[#2C2C2C] text-gray-700 dark:text-[#D0D0D0] hover:bg-gray-50 dark:hover:bg-[#333]'}`}>{pag}</button>
            ))}
            <button onClick={() => setPaginaActual((p) => Math.min(totalPaginas, p + 1))} disabled={paginaActual === totalPaginas} className="flex items-center justify-center rounded-lg border border-gray-300 dark:border-[#404040] bg-white dark:bg-[#2C2C2C] px-2.5 py-1.5 text-sm font-medium text-gray-700 dark:text-[#D0D0D0] transition-colors hover:bg-gray-50 dark:hover:bg-[#333] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" /></svg>
            </button>
          </div>
        </div>
      </div>

      {showModalDetalle && <ModalDetallesProducto producto={showModalDetalle} onClose={function () { setShowModalDetalle(null); }} />}
      {showModalEditar && <ModalEditarProducto producto={showModalEditar} onClose={function () { setShowModalEditar(null); }} onGuardar={handleGuardarEdicion} />}
      {showModalEliminar && <ModalEliminarProducto producto={showModalEliminar} onClose={function () { setShowModalEliminar(null); }} onConfirmar={handleEliminar} />}
    </div>
  );
}

export default GestionInventario;
