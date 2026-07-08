import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import * as XLSX from 'xlsx';
import API from '../services/axiosConfig';
import MaterialDatePicker from '../components/MaterialDatePicker';
import NuevoProveedorModal from '../components/NuevoProveedorModal';

function generarCodigoProveedor(id) {
  var anio = new Date().getFullYear();
  var num = String(id).padStart(4, '0');
  return 'PRO-' + anio + '-' + num;
}

var coloresRubro = { Medicamentos: 'bg-blue-50 text-blue-700', Alimentos: 'bg-amber-50 text-amber-700', Accesorios: 'bg-purple-50 text-purple-700', Servicios: 'bg-gray-50 text-gray-700' };

function ModalDetalleProveedor({ proveedor, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl shadow-2xl w-full max-w-md mx-4" onClick={function (e) { e.stopPropagation(); }}>
        <div className="flex items-center justify-between p-6 pb-0">
          <h2 className="text-xl font-bold text-gray-900 dark:text-[#E0E0E0]">Detalle del Proveedor</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#333] text-gray-400 dark:text-[#808080] hover:text-gray-600 transition-colors cursor-pointer">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div className="bg-gray-50 dark:bg-[#2C2C2C] rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#5F7B65] flex items-center justify-center text-white text-sm font-bold shrink-0">{proveedor.nombre[0]}</div>
              <div>
                <p className="font-bold text-gray-900 dark:text-[#E0E0E0]">{proveedor.nombre}</p>
                <p className="text-sm text-gray-500 dark:text-[#909090]">{proveedor.codigo}</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><p className="text-xs text-gray-500 dark:text-[#909090] font-medium">RUC</p><p className="text-sm font-semibold text-gray-900 dark:text-[#E0E0E0]">{proveedor.ruc}</p></div>
            <div><p className="text-xs text-gray-500 dark:text-[#909090] font-medium">Rubro</p><span className={'inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ' + (coloresRubro[proveedor.rubro] || 'bg-gray-50 text-gray-700')}>{proveedor.rubro}</span></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><p className="text-xs text-gray-500 dark:text-[#909090] font-medium">Teléfono</p><p className="text-sm font-semibold text-gray-900 dark:text-[#E0E0E0]">{proveedor.telefono}</p></div>
            <div><p className="text-xs text-gray-500 dark:text-[#909090] font-medium">Email</p><p className="text-sm font-semibold text-gray-900 dark:text-[#E0E0E0]">{proveedor.email}</p></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><p className="text-xs text-gray-500 dark:text-[#909090] font-medium">Dirección</p><p className="text-sm font-semibold text-gray-900 dark:text-[#E0E0E0]">{proveedor.direccion}</p></div>
            <div><p className="text-xs text-gray-500 dark:text-[#909090] font-medium">Estado</p><span className={'inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ' + (proveedor.estado === 'Activo' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700')}>{proveedor.estado}</span></div>
          </div>
        </div>
        <div className="p-6 pt-0">
          <button onClick={onClose} className="w-full py-2.5 border border-gray-300 dark:border-[#404040] rounded-xl text-sm font-medium text-gray-700 dark:text-[#D0D0D0] hover:bg-gray-50 dark:hover:bg-[#2C2C2C] transition-colors cursor-pointer">Cerrar</button>
        </div>
      </div>
    </div>
  );
}

function ModalEditarProveedor({ proveedor, onClose, onGuardar }) {
  var [form, setForm] = useState({ nombre: proveedor.nombre || '', ruc: proveedor.ruc || '', rubro: proveedor.rubro || 'Medicamentos', telefono: proveedor.telefono || '', email: proveedor.email || '', direccion: proveedor.direccion || '', estado: proveedor.estado || 'Activo' });

  function handleChange(e) {
    setForm(Object.assign({}, form, { [e.target.name]: e.target.value }));
  }

  function handleSubmit() {
    onGuardar(proveedor.id, form);
    onClose();
  }

  var inputClass = 'w-full rounded-lg border border-gray-300 dark:border-[#404040] bg-white dark:bg-[#2C2C2C] px-4 py-2.5 text-sm text-gray-900 dark:text-[#E0E0E0] focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500';
  var labelClass = 'block text-sm font-medium text-gray-700 dark:text-[#C0C0C0] mb-1';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl shadow-2xl w-full max-w-2xl mx-4" onClick={function (e) { e.stopPropagation(); }}>
        <div className="flex items-center justify-between p-6 pb-0">
          <h2 className="text-xl font-bold text-gray-900 dark:text-[#E0E0E0]">Editar Proveedor</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#2C2C2C] text-gray-400 dark:text-[#808080] hover:text-gray-600 transition-colors cursor-pointer">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Nombre Proveedor *</label>
              <input type="text" name="nombre" value={form.nombre} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>RUC *</label>
              <input type="text" name="ruc" value={form.ruc} onChange={handleChange} className={inputClass} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Rubro</label>
              <select name="rubro" value={form.rubro} onChange={handleChange} className={inputClass}>
                <option value="Medicamentos">Medicamentos</option>
                <option value="Alimentos">Alimentos</option>
                <option value="Accesorios">Accesorios</option>
                <option value="Servicios">Servicios</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Teléfono</label>
              <input type="text" name="telefono" value={form.telefono} onChange={handleChange} className={inputClass} />
            </div>
          </div>
          <div>
            <label className={labelClass}>Email</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Dirección</label>
            <input type="text" name="direccion" value={form.direccion} onChange={handleChange} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Estado</label>
            <select name="estado" value={form.estado} onChange={handleChange} className={inputClass}>
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
            </select>
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 p-6 pt-0">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl border border-gray-300 dark:border-[#404040] text-sm font-medium text-gray-700 dark:text-[#D0D0D0] hover:bg-gray-50 dark:hover:bg-[#2C2C2C] transition-colors cursor-pointer">Cancelar</button>
          <button onClick={handleSubmit} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white shadow-sm transition-colors cursor-pointer" style={{ backgroundColor: '#5F7B65' }}>Guardar Cambios</button>
        </div>
      </div>
    </div>
  );
}

function ModalEliminarProveedor({ proveedor, onClose, onConfirmar }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl shadow-2xl w-full max-w-sm mx-4" onClick={function (e) { e.stopPropagation(); }}>
        <div className="p-6 text-center">
          <div className="mx-auto h-14 w-14 flex items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30 mb-4">
            <svg className="w-7 h-7 text-red-600" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-[#E0E0E0] mb-1">¿Eliminar proveedor?</h3>
          <p className="text-sm text-gray-500 dark:text-[#909090]">¿Estás seguro de eliminar a <span className="font-semibold text-gray-900 dark:text-[#E0E0E0]">{proveedor.nombre}</span>? Esta acción no se puede deshacer.</p>
        </div>
        <div className="flex gap-3 p-6 pt-0">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-300 dark:border-[#404040] text-sm font-medium text-gray-700 dark:text-[#D0D0D0] hover:bg-gray-50 dark:hover:bg-[#2C2C2C] transition-colors cursor-pointer">Cancelar</button>
          <button onClick={function () { onConfirmar(proveedor.id); onClose(); }} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors cursor-pointer">Eliminar</button>
        </div>
      </div>
    </div>
  );
}

function ModalFiltroAvanzado({ open, onClose, filtrosActuales, onAplicar }) {
  var [desde, setDesde] = useState(filtrosActuales.fechaDesde || '');
  var [hasta, setHasta] = useState(filtrosActuales.fechaHasta || '');
  var [rubro, setRubro] = useState(filtrosActuales.rubro || 'Todos');
  var [estado, setEstado] = useState(filtrosActuales.estado || 'Todos');

  if (!open) return null;

  function handleAplicar() {
    onAplicar({ fechaDesde: desde, fechaHasta: hasta, rubro, estado });
    onClose();
  }

  function handleLimpiar() {
    setDesde(''); setHasta(''); setRubro('Todos'); setEstado('Todos');
    onAplicar({ fechaDesde: '', fechaHasta: '', rubro: 'Todos', estado: 'Todos' });
    onClose();
  }

  var inputClass = "w-full px-4 py-2.5 border border-gray-300 dark:border-[#404040] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5F7B65] focus:border-[#5F7B65] bg-white dark:bg-[#2C2C2C] text-gray-900 dark:text-[#E0E0E0]";
  var labelClass = "block text-sm font-medium text-gray-700 dark:text-[#D0D0D0] mb-1.5";
  var selectClass = "w-full px-4 py-2.5 border border-gray-300 dark:border-[#404040] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5F7B65] cursor-pointer bg-white dark:bg-[#2C2C2C] text-gray-700 dark:text-[#D0D0D0]";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl shadow-2xl w-full max-w-md mx-4" onClick={function (e) { e.stopPropagation(); }}>
        <div className="flex items-center justify-between p-6 pb-0">
          <h2 className="text-xl font-bold text-gray-900 dark:text-[#E0E0E0]">Filtro Avanzado</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#333] text-gray-400 dark:text-[#808080] hover:text-gray-600 transition-colors cursor-pointer">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <MaterialDatePicker value={desde} onChange={setDesde} label="Fecha Desde" placeholder="DD/MM/YYYY" />
            </div>
            <div>
              <MaterialDatePicker value={hasta} onChange={setHasta} label="Fecha Hasta" placeholder="DD/MM/YYYY" />
            </div>
          </div>
          <div>
            <label className={labelClass}>Rubro</label>
            <select value={rubro} onChange={function (e) { setRubro(e.target.value); }} className={selectClass}>
              <option value="Todos">Todos</option>
              <option value="Medicamentos">Medicamentos</option>
              <option value="Alimentos">Alimentos</option>
              <option value="Accesorios">Accesorios</option>
              <option value="Servicios">Servicios</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Estado</label>
            <select value={estado} onChange={function (e) { setEstado(e.target.value); }} className={selectClass}>
              <option value="Todos">Todos</option>
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
            </select>
          </div>
        </div>
        <div className="flex items-center justify-between gap-3 p-6 pt-0">
          <button onClick={handleLimpiar} className="px-5 py-2.5 rounded-xl border border-gray-300 dark:border-[#404040] text-sm font-medium text-gray-700 dark:text-[#D0D0D0] hover:bg-gray-50 dark:hover:bg-[#2C2C2C] transition-colors cursor-pointer">Limpiar Filtros</button>
          <div className="flex gap-3">
            <button onClick={onClose} className="px-5 py-2.5 rounded-xl border border-gray-300 dark:border-[#404040] text-sm font-medium text-gray-700 dark:text-[#D0D0D0] hover:bg-gray-50 dark:hover:bg-[#2C2C2C] transition-colors cursor-pointer">Cancelar</button>
            <button onClick={handleAplicar} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white shadow-sm transition-colors cursor-pointer" style={{ backgroundColor: '#5F7B65' }}>Aplicar Filtros</button>
          </div>
        </div>
      </div>
    </div>
  );
}

var ROL_ADMIN = 1;
var userData = JSON.parse(localStorage.getItem('user') || '{}');
var idRol = userData.idRol;

function ProveedoresPage() {
  var navigate = useNavigate();
  var [searchParams] = useSearchParams();
  var highlightRef = useRef(null);
  var [proveedores, setProveedores] = useState([]);
  var [busqueda, setBusqueda] = useState('');
  var [filtroEstado, setFiltroEstado] = useState('Todos');
  var [filtroRubro, setFiltroRubro] = useState('Todos');
  var [pagina, setPagina] = useState(1);
  var [showModal, setShowModal] = useState(false);
  var [showModalFiltro, setShowModalFiltro] = useState(false);
  var [filtrosAvanzados, setFiltrosAvanzados] = useState({ fechaDesde: '', fechaHasta: '', rubro: 'Todos', estado: 'Todos' });
  var [showModalDetalle, setShowModalDetalle] = useState(null);
  var [showModalEditar, setShowModalEditar] = useState(null);
  var [showModalEliminar, setShowModalEliminar] = useState(null);
  var [highlightedId, setHighlightedId] = useState(null);
  var porPagina = 10;

  function cargarProveedores() {
    API.get('/proveedores').then(function (res) {
      setProveedores(res.data);
    }).catch(function (err) {
      console.error('[Proveedores] Error al cargar:', err.response?.status, err.response?.data || err.message);
      setProveedores([]);
    });
  }

  useEffect(function () { cargarProveedores(); }, []);

  useEffect(function () {
    var highlight = searchParams.get('highlight');
    if (highlight && proveedores.length > 0) {
      var found = proveedores.find(function (p) { return p.nombre.toLowerCase() === highlight.toLowerCase(); });
      if (found) {
        setHighlightedId(found.id);
        var pageIndex = proveedores.indexOf(found);
        var pageNum = Math.floor(pageIndex / porPagina) + 1;
        setPagina(pageNum);
        setTimeout(function () {
          if (highlightRef.current) {
            highlightRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 100);
      }
    }
  }, [searchParams, proveedores]);

  function handleProveedorCreado() {
    cargarProveedores();
    setShowModal(false);
  }

  function handleGuardarProveedor(id, datos) {
    API.put('/proveedores/' + id, datos).then(function () {
      cargarProveedores();
    }).catch(function () {
      alert('Error al actualizar el proveedor');
    });
  }

  function handleEliminarProveedor(id) {
    API.delete('/proveedores/' + id).then(function () {
      cargarProveedores();
    }).catch(function () {
      alert('Error al eliminar el proveedor');
    });
  }

  function aplicarFiltrosAvanzados(lista) {
    var f = filtrosAvanzados;
    return lista.filter(function (p) {
      if (f.rubro !== 'Todos' && p.rubro !== f.rubro) return false;
      if (f.estado !== 'Todos' && p.estado !== f.estado) return false;
      return true;
    });
  }

  var filtradosBase = proveedores.filter(function (p) {
    var coincideBusqueda = p.nombre.toLowerCase().includes(busqueda.toLowerCase()) || (p.ruc || '').includes(busqueda) || (p.rubro || '').toLowerCase().includes(busqueda.toLowerCase()) || (p.codigo || '').toLowerCase().includes(busqueda.toLowerCase());
    var coincideEstado = filtroEstado === 'Todos' || p.estado === filtroEstado;
    var coincideRubro = filtroRubro === 'Todos' || p.rubro === filtroRubro;
    return coincideBusqueda && coincideEstado && coincideRubro;
  });

  var filtrados = aplicarFiltrosAvanzados(filtradosBase);

  var totalPaginas = Math.ceil(filtrados.length / porPagina) || 1;
  var paginados = filtrados.slice((pagina - 1) * porPagina, pagina * porPagina);

  var totalActivos = proveedores.filter(function (p) { return p.estado === 'Activo'; }).length;

  function exportarExcel() {
    var datos = filtrados.map(function (p) {
      return {
        'Código': p.codigo,
        'Proveedor': p.nombre,
        'RUC': p.ruc || '',
        'Rubro': p.rubro || '',
        'Teléfono': p.telefono || '',
        'Email': p.email || '',
        'Estado': p.estado || '',
      };
    });
    var wb = XLSX.utils.book_new();
    var ws = XLSX.utils.json_to_sheet(datos);
    XLSX.utils.book_append_sheet(wb, ws, 'Proveedores');
    var fecha = new Date().toISOString().split('T')[0];
    XLSX.writeFile(wb, 'Proveedores_' + fecha + '.xlsx');
  }

  return (
    <div className="flex flex-col h-full gap-6">
      <div className="flex flex-none items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-[#E0E0E0]">Gestión de Proveedores</h1>
          <p className="text-sm text-gray-500 dark:text-[#909090] mt-1">Administra los proveedores de insumos y medicamentos</p>
        </div>
        <button onClick={function () { setShowModal(true); }} className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors cursor-pointer" style={{ backgroundColor: '#5F7B65' }}>
          <span className="text-lg">+</span> Nuevo Proveedor
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-gray-200 dark:border-[#333] bg-white dark:bg-[#1E1E1E] p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-[#909090] font-medium">Total Proveedores</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-[#E0E0E0] mt-1">{proveedores.length}</p>
            </div>
            <div className="h-11 w-11 flex items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.15-.463 1.265-1.07l1.69-10.16A1.125 1.125 0 0 0 20.25 7.25H5.25L4.063 3.04A1.125 1.125 0 0 0 2.954 2.25H.75" /></svg>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 dark:border-[#333] bg-white dark:bg-[#1E1E1E] p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-[#909090] font-medium">Proveedores Activos</p>
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{totalActivos}</p>
            </div>
            <div className="h-11 w-11 flex items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 dark:border-[#333] bg-white dark:bg-[#1E1E1E] p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-[#909090] font-medium">Último Pedido</p>
              <p className="text-lg font-bold text-gray-900 dark:text-[#E0E0E0] mt-1">Hoy</p>
            </div>
            <div className="h-11 w-11 flex items-center justify-center rounded-xl bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 dark:border-[#333] bg-white dark:bg-[#1E1E1E] p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-[#909090] font-medium">Productos Asociados</p>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-1">{proveedores.reduce(function (sum, p) { return sum + (p.totalProductos || 0); }, 0)}</p>
              <p className="text-xs text-gray-400 dark:text-[#808080]">En total a través de proveedores</p>
            </div>
            <div className="h-11 w-11 flex items-center justify-center rounded-xl bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0-3-3m3 3 3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" /></svg>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col min-h-0 rounded-xl border border-gray-200 dark:border-[#333] bg-white dark:bg-[#1E1E1E] shadow-sm">
        <div className="p-4 border-b border-gray-100 dark:border-[#333] flex flex-col sm:flex-row gap-3">
          <input type="text" placeholder="Buscar por nombre, código, RUC o rubro..." value={busqueda} onChange={function (e) { setBusqueda(e.target.value); setPagina(1); }} className="flex-1 rounded-lg border border-gray-300 dark:border-[#404040] bg-white dark:bg-[#2C2C2C] px-4 py-2.5 text-sm text-gray-900 dark:text-[#E0E0E0] placeholder-gray-400 dark:placeholder-[#808080] focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" />
          <select value={filtroEstado} onChange={function (e) { setFiltroEstado(e.target.value); setPagina(1); }} className="rounded-lg border border-gray-300 dark:border-[#404040] bg-white dark:bg-[#2C2C2C] px-3 py-2.5 text-sm text-gray-700 dark:text-[#D0D0D0] focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer">
            <option value="Todos">Todos los estados</option>
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
          </select>
          <select value={filtroRubro} onChange={function (e) { setFiltroRubro(e.target.value); setPagina(1); }} className="rounded-lg border border-gray-300 dark:border-[#404040] bg-white dark:bg-[#2C2C2C] px-3 py-2.5 text-sm text-gray-700 dark:text-[#D0D0D0] focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer">
            <option value="Todos">Todos los rubros</option>
            <option value="Medicamentos">Medicamentos</option>
            <option value="Alimentos">Alimentos</option>
            <option value="Accesorios">Accesorios</option>
          </select>
          <button onClick={function () { setShowModalFiltro(true); }} className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 dark:border-[#404040] rounded-lg text-sm font-medium text-gray-700 dark:text-[#D0D0D0] hover:bg-gray-50 dark:hover:bg-[#2C2C2C] transition-colors cursor-pointer">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.3 48.3 0 0 1 12 3Z" /></svg>
            Filtro Avanzado
          </button>
          <button onClick={exportarExcel} className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 dark:border-[#404040] rounded-lg text-sm font-medium text-gray-700 dark:text-[#D0D0D0] hover:bg-gray-50 dark:hover:bg-[#2C2C2C] transition-colors cursor-pointer">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
            Exportar
          </button>
        </div>

        <div className="flex-1 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 dark:bg-[#2C2C2C] text-left">
                <th className="px-4 py-3 font-semibold text-gray-600 dark:text-[#909090]">Código</th>
                <th className="px-4 py-3 font-semibold text-gray-600 dark:text-[#909090]">Proveedor</th>
                <th className="px-4 py-3 font-semibold text-gray-600 dark:text-[#909090]">RUC</th>
                <th className="px-4 py-3 font-semibold text-gray-600 dark:text-[#909090]">Rubro</th>
                <th className="px-4 py-3 font-semibold text-gray-600 dark:text-[#909090]">Teléfono</th>
                <th className="px-4 py-3 font-semibold text-gray-600 dark:text-[#909090]">Email</th>
                <th className="px-4 py-3 font-semibold text-gray-600 dark:text-[#909090]">Estado</th>
                <th className="px-4 py-3 font-semibold text-gray-600 dark:text-[#909090]">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-[#333]">
              {paginados.length === 0 ? (
                <tr><td colSpan={8} className="px-4 py-12 text-center text-gray-400 dark:text-[#808080]">No se encontraron proveedores</td></tr>
              ) : (
                paginados.map(function (prov) {
                  var esActivo = prov.estado === 'Activo';
                  var iniciales = prov.nombre.split(' ').map(function (w) { return w[0]; }).join('').substring(0, 2).toUpperCase();
                  var isHighlighted = highlightedId === prov.id;
                  return (
                    <tr key={prov.id} ref={isHighlighted ? highlightRef : null} className={'transition-colors ' + (isHighlighted ? 'bg-emerald-50 dark:bg-emerald-900/20 ring-2 ring-emerald-400 dark:ring-emerald-600' : 'hover:bg-gray-50 dark:hover:bg-[#2C2C2C]')}>
                      <td className="px-4 py-3 text-gray-500 dark:text-[#909090] font-mono text-xs">{prov.codigo}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 flex items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-xs font-bold shrink-0">{iniciales}</div>
                          <span className="font-medium text-gray-900 dark:text-[#E0E0E0]">{prov.nombre}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600 dark:text-[#B0B0B0] font-mono text-xs">{prov.ruc}</td>
                      <td className="px-4 py-3">
                        <span className={'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ' + (coloresRubro[prov.rubro] || 'bg-gray-50 text-gray-700')}>{prov.rubro}</span>
                      </td>
                      <td className="px-4 py-3 text-gray-600 dark:text-[#B0B0B0]">{prov.telefono}</td>
                      <td className="px-4 py-3 text-gray-600 dark:text-[#B0B0B0]">{prov.email}</td>
                      <td className="px-4 py-3">
                        <span className={'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ' + (esActivo ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700')}>
                          {prov.estado}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button onClick={function () { navigate('/inventario?proveedor=' + encodeURIComponent(prov.nombre)); }} className="p-1.5 rounded-lg hover:bg-purple-50 text-purple-500 hover:text-purple-700 transition-colors cursor-pointer" title="Ver productos en inventario">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0-3-3m3 3 3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" /></svg>
                          </button>
                          <button onClick={function () { setShowModalDetalle(prov); }} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-500 hover:text-blue-700 transition-colors cursor-pointer" title="Ver">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>
                          </button>
                          <button onClick={function () { setShowModalEditar(prov); }} className="p-1.5 rounded-lg hover:bg-amber-50 text-amber-500 hover:text-amber-700 transition-colors cursor-pointer" title="Editar">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" /></svg>
                          </button>
                          {idRol === ROL_ADMIN && (
                          <button onClick={function () { setShowModalEliminar(prov); }} className="p-1.5 rounded-lg hover:bg-red-50 text-red-400 hover:text-red-600 transition-colors cursor-pointer" title="Eliminar">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>
                          </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-end gap-2 p-4 border-t border-gray-100 dark:border-[#333]">
          <button onClick={function () { if (pagina > 1) setPagina(pagina - 1); }} disabled={pagina === 1} className={'px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors cursor-pointer ' + (pagina === 1 ? 'border-gray-200 dark:border-[#333] text-gray-300 dark:text-[#606060] cursor-not-allowed' : 'border-gray-300 dark:border-[#404040] text-gray-700 dark:text-[#C0C0C0] hover:bg-gray-50 dark:hover:bg-[#2C2C2C]')}>{'< Anterior'}</button>
          {Array.from({ length: totalPaginas }, function (_, i) { return i + 1; }).map(function (n) {
            return (
              <button key={n} onClick={function () { setPagina(n); }} className={'h-8 w-8 rounded-lg text-sm font-medium transition-colors cursor-pointer ' + (n === pagina ? 'bg-[#5F7B65] text-white' : 'border border-gray-300 dark:border-[#404040] text-gray-700 dark:text-[#C0C0C0] hover:bg-gray-50 dark:hover:bg-[#2C2C2C]')}>{n}</button>
            );
          })}
          <button onClick={function () { if (pagina < totalPaginas) setPagina(pagina + 1); }} disabled={pagina === totalPaginas} className={'px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors cursor-pointer ' + (pagina === totalPaginas ? 'border-gray-200 dark:border-[#333] text-gray-300 dark:text-[#606060] cursor-not-allowed' : 'border-gray-300 dark:border-[#404040] text-gray-700 dark:text-[#C0C0C0] hover:bg-gray-50 dark:hover:bg-[#2C2C2C]')}>{'Siguiente >'}</button>
        </div>
      </div>

      {showModal && <NuevoProveedorModal onClose={function () { setShowModal(false); }} onCreado={handleProveedorCreado} />}
      {showModalDetalle && <ModalDetalleProveedor proveedor={showModalDetalle} onClose={function () { setShowModalDetalle(null); }} />}
      {showModalEditar && <ModalEditarProveedor proveedor={showModalEditar} onClose={function () { setShowModalEditar(null); }} onGuardar={handleGuardarProveedor} />}
      {showModalEliminar && <ModalEliminarProveedor proveedor={showModalEliminar} onClose={function () { setShowModalEliminar(null); }} onConfirmar={handleEliminarProveedor} />}
      <ModalFiltroAvanzado open={showModalFiltro} onClose={function () { setShowModalFiltro(false); }} filtrosActuales={filtrosAvanzados} onAplicar={setFiltrosAvanzados} />
    </div>
  );
}

export default ProveedoresPage;
