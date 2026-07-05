import { useState, useMemo } from 'react';
import * as XLSX from 'xlsx';

var ITEMS_PER_PAGE = 5;
var nextId = 6;

var mockConfiguraciones = [
  { id: 1, codigo: 'CFG-2026-0001', modulo: 'General', nombre: 'Nombre de la Clínica', valor: 'VetControl 360', estado: 'Activo' },
  { id: 2, codigo: 'CFG-2026-0002', modulo: 'General', nombre: 'Dirección', valor: 'Av. Principal 123', estado: 'Activo' },
  { id: 3, codigo: 'CFG-2026-0003', modulo: 'Facturación', nombre: 'IGV (%)', valor: '18%', estado: 'Activo' },
  { id: 4, codigo: 'CFG-2026-0004', modulo: 'Vacunación', nombre: 'Días de Recordatorio', valor: '7 días', estado: 'Activo' },
  { id: 5, codigo: 'CFG-2026-0005', modulo: 'Citas', nombre: 'Duración Mínima', valor: '30 min', estado: 'Inactivo' },
];

var modulos = ['Todos los módulos', 'General', 'Facturación', 'Vacunación', 'Citas', 'Roles', 'Parámetros'];

function ModalDetalles({ ajuste, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl shadow-2xl w-full max-w-lg mx-4" onClick={function (e) { e.stopPropagation(); }}>
        <div className="flex items-center justify-between p-6 pb-0">
          <h2 className="text-xl font-bold text-gray-900 dark:text-[#E0E0E0]">Detalle del Ajuste</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#333] text-gray-400 dark:text-[#808080] hover:text-gray-600 transition-colors cursor-pointer">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div className="bg-gray-50 dark:bg-[#2C2C2C] rounded-xl p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-12 w-12 flex items-center justify-center rounded-full bg-[#5F7B65] text-white font-bold text-sm">{ajuste.codigo}</div>
              <div>
                <p className="font-bold text-gray-900 dark:text-[#E0E0E0]">{ajuste.nombre}</p>
                <p className="text-sm text-gray-500 dark:text-[#909090]">{ajuste.codigo}</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><p className="text-xs text-gray-500 dark:text-[#909090] font-medium">Módulo</p><p className="text-sm font-semibold text-gray-900 dark:text-[#E0E0E0]">{ajuste.modulo}</p></div>
            <div><p className="text-xs text-gray-500 dark:text-[#909090] font-medium">Valor Actual</p><p className="text-sm font-semibold text-gray-900 dark:text-[#E0E0E0]">{ajuste.valor}</p></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><p className="text-xs text-gray-500 dark:text-[#909090] font-medium">Estado</p><span className={'inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ' + (ajuste.estado === 'Activo' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300')}>{ajuste.estado}</span></div>
          </div>
        </div>
        <div className="p-6 pt-0">
          <button onClick={onClose} className="w-full py-2.5 border border-gray-300 dark:border-[#404040] rounded-xl text-sm font-medium text-gray-700 dark:text-[#D0D0D0] hover:bg-gray-50 dark:hover:bg-[#2C2C2C] transition-colors cursor-pointer">Cerrar</button>
        </div>
      </div>
    </div>
  );
}

function ModalEditar({ ajuste, onClose, onGuardar }) {
  var [form, setForm] = useState({ valor: ajuste.valor || '', estado: ajuste.estado || 'Activo' });
  var inputClass = 'w-full rounded-lg border border-gray-300 dark:border-[#404040] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#5F7B65] focus:border-[#5F7B65] bg-white dark:bg-[#2C2C2C] text-gray-900 dark:text-[#E0E0E0]';
  var labelClass = 'block text-sm font-medium text-gray-700 dark:text-[#D0D0D0] mb-1';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl shadow-2xl w-full max-w-lg mx-4" onClick={function (e) { e.stopPropagation(); }}>
        <div className="flex items-center justify-between p-6 pb-0">
          <h2 className="text-xl font-bold text-gray-900 dark:text-[#E0E0E0]">Editar Ajuste</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#333] text-gray-400 dark:text-[#808080] hover:text-gray-600 transition-colors cursor-pointer">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 flex items-center justify-center rounded-full bg-[#5F7B65] text-white font-bold text-xs shrink-0">{ajuste.codigo}</div>
            <div>
              <p className="font-bold text-gray-900 dark:text-[#E0E0E0]">{ajuste.nombre}</p>
              <p className="text-sm text-gray-500 dark:text-[#909090]" style={{ color: '#64748B' }}>{ajuste.modulo} · {ajuste.codigo}</p>
            </div>
          </div>
          <div>
            <label className={labelClass}>Valor Actual</label>
            <input type="text" value={form.valor} onChange={function (e) { setForm(Object.assign({}, form, { valor: e.target.value })); }} className={inputClass} placeholder="Valor del ajuste" />
          </div>
          <div>
            <label className={labelClass}>Estado</label>
            <select value={form.estado} onChange={function (e) { setForm(Object.assign({}, form, { estado: e.target.value })); }} className={inputClass + ' cursor-pointer'}>
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
            </select>
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 p-6 pt-0">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl border border-gray-300 dark:border-[#404040] text-sm font-medium text-gray-700 dark:text-[#D0D0D0] hover:bg-gray-50 dark:hover:bg-[#2C2C2C] transition-colors cursor-pointer">Cancelar</button>
          <button onClick={function () { onGuardar(ajuste.id, form); }} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white shadow-sm transition-colors cursor-pointer" style={{ backgroundColor: '#5F7B65' }}>Guardar Cambios</button>
        </div>
      </div>
    </div>
  );
}

function ModalEliminar({ ajuste, onClose, onConfirmar }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl shadow-2xl w-full max-w-md mx-4" onClick={function (e) { e.stopPropagation(); }}>
        <div className="p-6">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" /></svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-[#E0E0E0] text-center mb-2">Eliminar Ajuste</h2>
          <p className="text-sm text-gray-500 dark:text-[#909090] text-center mb-6">
            ¿Estás seguro de eliminar el ajuste <strong>{ajuste.nombre}</strong> ({ajuste.codigo})? Esta acción no se puede deshacer.
          </p>
          <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-300 dark:border-[#404040] text-sm font-medium text-gray-700 dark:text-[#D0D0D0] hover:bg-gray-50 dark:hover:bg-[#2C2C2C] transition-colors cursor-pointer">Cancelar</button>
            <button onClick={onConfirmar} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white shadow-sm transition-colors cursor-pointer" style={{ backgroundColor: '#DC2626' }}>Eliminar</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ModalFiltroAvanzado({ open, onClose, filtrosActuales, onAplicar }) {
  var [modulo, setModulo] = useState(filtrosActuales.modulo || 'Todos los módulos');
  var [estado, setEstado] = useState(filtrosActuales.estado || 'Todos');

  if (!open) return null;

  function handleAplicar() {
    onAplicar({ modulo: modulo || 'Todos los módulos', estado: estado || 'Todos' });
    onClose();
  }

  function handleLimpiar() {
    setModulo('Todos los módulos');
    setEstado('Todos');
    onAplicar({ modulo: 'Todos los módulos', estado: 'Todos' });
    onClose();
  }

  var inputClass = "w-full px-4 py-2.5 border border-gray-300 dark:border-[#404040] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5F7B65] focus:border-[#5F7B65] bg-white dark:bg-[#2C2C2C] text-gray-900 dark:text-[#E0E0E0]";
  var labelClass = "block text-sm font-medium text-gray-700 dark:text-[#D0D0D0] mb-1.5";

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
          <div>
            <label className={labelClass}>Módulo</label>
            <select value={modulo} onChange={function (e) { setModulo(e.target.value); }} className={inputClass + ' cursor-pointer'}>
              <option value="Todos los módulos">Todos los módulos</option>
              <option value="General">General</option>
              <option value="Facturación">Facturación</option>
              <option value="Vacunación">Vacunación</option>
              <option value="Citas">Citas</option>
              <option value="Roles">Roles</option>
              <option value="Parámetros">Parámetros</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Estado</label>
            <select value={estado} onChange={function (e) { setEstado(e.target.value); }} className={inputClass + ' cursor-pointer'}>
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

var kpis = [
  { label: 'Ajustes Activos', value: 4, icon: <svg className="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>, bg: 'bg-emerald-50' },
  { label: 'Módulos Configurados', value: 4, icon: <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" /></svg>, bg: 'bg-blue-50' },
  { label: 'Ajustes Inactivos', value: 1, icon: <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" /></svg>, bg: 'bg-orange-50' },
  { label: 'Total Ajustes', value: 5, icon: <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" /></svg>, bg: 'bg-purple-50' },
];

function ConfiguracionPage() {
  var [configuraciones, setConfiguraciones] = useState(mockConfiguraciones);
  var [search, setSearch] = useState('');
  var [filterModulo, setFilterModulo] = useState('Todos los módulos');
  var [page, setPage] = useState(1);
  var [showModalFiltro, setShowModalFiltro] = useState(false);
  var [filtrosAvanzados, setFiltrosAvanzados] = useState({ modulo: 'Todos los módulos', estado: 'Todos' });
  var [showDetalle, setShowDetalle] = useState(null);
  var [editAjuste, setEditAjuste] = useState(null);
  var [deleteAjuste, setDeleteAjuste] = useState(null);

  var filtered = useMemo(function () {
    return configuraciones.filter(function (c) {
      var q = search.toLowerCase();
      var matchSearch = !q || c.nombre.toLowerCase().includes(q) || c.codigo.toLowerCase().includes(q) || c.modulo.toLowerCase().includes(q) || c.valor.toLowerCase().includes(q);
      var matchModulo = filterModulo === 'Todos los módulos' || c.modulo === filterModulo;
      var matchFiltroModulo = filtrosAvanzados.modulo === 'Todos los módulos' || c.modulo === filtrosAvanzados.modulo;
      var matchFiltroEstado = filtrosAvanzados.estado === 'Todos' || c.estado === filtrosAvanzados.estado;
      return matchSearch && matchModulo && matchFiltroModulo && matchFiltroEstado;
    });
  }, [configuraciones, search, filterModulo, filtrosAvanzados]);

  useMemo(function () { setPage(1); }, [search, filterModulo, filtrosAvanzados]);

  var totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE) || 1;
  var paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  function handleGuardarEdicion(id, form) {
    setConfiguraciones(configuraciones.map(function (c) {
      return c.id === id ? Object.assign({}, c, form) : c;
    }));
    setEditAjuste(null);
  }

  function handleEliminar() {
    setConfiguraciones(configuraciones.filter(function (c) { return c.id !== deleteAjuste.id; }));
    setDeleteAjuste(null);
  }

  function exportarExcel() {
    var datos = filtered.map(function (c) {
      return { 'ID': c.codigo, 'Módulo': c.modulo, 'Nombre del Ajuste': c.nombre, 'Valor Actual': c.valor, 'Estado': c.estado };
    });
    var wb = XLSX.utils.book_new();
    var ws = XLSX.utils.json_to_sheet(datos);
    XLSX.utils.book_append_sheet(wb, ws, 'Configuracion');
    var fecha = new Date().toISOString().split('T')[0];
    XLSX.writeFile(wb, 'Configuracion_' + fecha + '.xlsx');
  }

  var estadosCount = configuraciones.filter(function (c) { return c.estado === 'Activo'; }).length;
  var modulosCount = [...new Set(configuraciones.map(function (c) { return c.modulo; }))].length;

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-none space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-[#E0E0E0]">Configuración del Sistema</h1>
            <p className="text-sm text-gray-500 dark:text-[#909090] mt-0.5">Administra los parámetros generales de la clínica</p>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-5">
          {kpis.map(function (k, i) {
            var val = i === 0 ? estadosCount : i === 1 ? modulosCount : i === 2 ? configuraciones.length - estadosCount : configuraciones.length;
            return (
              <div key={i} className="bg-white dark:bg-[#1E1E1E] rounded-xl shadow-sm border border-gray-100 dark:border-[#333] p-5 flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-gray-800 dark:text-[#E0E0E0]">{val}</p>
                  <p className="text-sm text-gray-500 dark:text-[#909090] mt-1">{k.label}</p>
                </div>
                <div className={'p-3 rounded-lg ' + k.bg}>{k.icon}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex-1 flex flex-col min-h-0 mt-6 space-y-4">
        <div className="flex-none bg-white dark:bg-[#1E1E1E] rounded-xl shadow-sm border border-gray-100 dark:border-[#333] p-4">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <svg className="w-5 h-5 text-gray-400 dark:text-[#808080] absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
              <input type="text" placeholder="Buscar ajuste por nombre..." value={search} onChange={function (e) { setSearch(e.target.value); }}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-[#404040] rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#5F7B65] focus:border-transparent transition-all bg-white dark:bg-[#2C2C2C] text-gray-900 dark:text-[#E0E0E0]" />
            </div>
            <select value={filterModulo} onChange={function (e) { setFilterModulo(e.target.value); }}
              className="px-4 py-2.5 border border-gray-300 dark:border-[#404040] rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#5F7B65] focus:border-transparent bg-white dark:bg-[#2C2C2C] text-gray-700 dark:text-[#D0D0D0] cursor-pointer">
              {modulos.map(function (m) { return <option key={m} value={m}>{m}</option>; })}
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
        </div>

        <div className="flex-1 flex flex-col min-h-0 bg-white dark:bg-[#1E1E1E] rounded-xl shadow-sm border border-gray-100 dark:border-[#333] overflow-hidden">
          {paginated.length === 0 ? (
            <div className="p-8 text-center text-gray-400 dark:text-[#808080]">No se encontraron ajustes.</div>
          ) : (
            <>
              <div className="flex-1 overflow-auto min-h-0">
                <table className="w-full">
                  <thead>
                    <tr className="text-gray-500 dark:text-[#909090] text-xs uppercase tracking-wider bg-gray-50 dark:bg-[#2C2C2C]">
                      <th className="text-left py-4 px-5 font-semibold">ID</th>
                      <th className="text-left py-4 px-5 font-semibold">Módulo</th>
                      <th className="text-left py-4 px-5 font-semibold">Nombre del Ajuste</th>
                      <th className="text-left py-4 px-5 font-semibold">Valor Actual</th>
                      <th className="text-center py-4 px-5 font-semibold">Estado</th>
                      <th className="text-center py-4 px-5 font-semibold">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-[#333]">
                    {paginated.map(function (c) {
                      return (
                        <tr key={c.id} className="hover:bg-emerald-600/40 dark:hover:bg-emerald-900/20 transition-colors">
                          <td className="py-4 px-5 text-sm font-semibold text-gray-800 dark:text-[#E0E0E0]">{c.codigo}</td>
                          <td className="py-4 px-5 text-sm text-gray-600 dark:text-[#A0A0A0]">{c.modulo}</td>
                          <td className="py-4 px-5 text-sm font-medium text-gray-900 dark:text-[#E0E0E0]">{c.nombre}</td>
                          <td className="py-4 px-5 text-sm text-gray-600 dark:text-[#A0A0A0]">{c.valor}</td>
                          <td className="py-4 px-5 text-center">
                            <span className={'inline-block px-3 py-1 rounded-full text-xs font-semibold ' + (c.estado === 'Activo' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300')}>{c.estado}</span>
                          </td>
                          <td className="py-4 px-5 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <button onClick={function () { setShowDetalle(c); }} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-500 hover:text-blue-700 transition-colors cursor-pointer" title="Ver">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>
                              </button>
                              <button onClick={function () { setEditAjuste(c); }} className="p-1.5 rounded-lg hover:bg-amber-50 text-amber-500 hover:text-amber-700 transition-colors cursor-pointer" title="Editar">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" /></svg>
                              </button>
                              <button onClick={function () { setDeleteAjuste(c); }} className="p-1.5 rounded-lg hover:bg-red-50 text-red-400 hover:text-red-600 transition-colors cursor-pointer" title="Eliminar">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="flex-none flex items-center justify-between px-5 py-4 border-t border-gray-100 dark:border-[#333]">
                <p className="text-sm text-gray-500 dark:text-[#909090]">Mostrando {paginated.length} de {filtered.length} registros</p>
                <div className="flex items-center gap-2">
                  <button onClick={function () { setPage(Math.max(1, page - 1)); }} disabled={page === 1} className={'px-3 py-1.5 text-sm font-medium rounded-lg transition-colors cursor-pointer ' + (page === 1 ? 'text-gray-300 dark:text-[#808080] cursor-not-allowed' : 'text-gray-600 dark:text-[#A0A0A0] hover:bg-gray-100 dark:hover:bg-[#333]')}>&lt; Anterior</button>
                  {Array.from({ length: totalPages }, function (_, i) { return i + 1; }).map(function (n) {
                    return (
                      <button key={n} onClick={function () { setPage(n); }} className={'h-8 w-8 rounded-lg text-sm font-medium transition-colors cursor-pointer ' + (n === page ? 'bg-[#5F7B65] text-white' : 'text-gray-600 dark:text-[#A0A0A0] hover:bg-gray-100 dark:hover:bg-[#333]')}>{n}</button>
                    );
                  })}
                  <button onClick={function () { setPage(Math.min(totalPages, page + 1)); }} disabled={page === totalPages} className={'px-3 py-1.5 text-sm font-medium rounded-lg transition-colors cursor-pointer ' + (page === totalPages ? 'text-gray-300 dark:text-[#808080] cursor-not-allowed' : 'text-gray-600 dark:text-[#A0A0A0] hover:bg-gray-100 dark:hover:bg-[#333]')}>Siguiente &gt;</button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {showDetalle && <ModalDetalles ajuste={showDetalle} onClose={function () { setShowDetalle(null); }} />}
      {editAjuste && <ModalEditar ajuste={editAjuste} onClose={function () { setEditAjuste(null); }} onGuardar={handleGuardarEdicion} />}
      {deleteAjuste && <ModalEliminar ajuste={deleteAjuste} onClose={function () { setDeleteAjuste(null); }} onConfirmar={handleEliminar} />}
      <ModalFiltroAvanzado open={showModalFiltro} onClose={function () { setShowModalFiltro(false); }} filtrosActuales={filtrosAvanzados} onAplicar={setFiltrosAvanzados} />
    </div>
  );
}

export default ConfiguracionPage;
