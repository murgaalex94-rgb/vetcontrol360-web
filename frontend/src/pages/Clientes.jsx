import { useState, useEffect } from 'react';
import API from '../services/axiosConfig';
import NuevoClienteModal from '../components/NuevoClienteModal';
import MaterialDatePicker from '../components/MaterialDatePicker';
import * as XLSX from 'xlsx';

var ITEMS_PER_PAGE = 10;

function generarCodigoCliente(id) {
  var year = new Date().getFullYear();
  var num = String(id).padStart(4, '0');
  return 'CLI-' + year + '-' + num;
}

function ModalDetalles({ cliente, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl shadow-2xl w-full max-w-lg mx-4" onClick={function (e) { e.stopPropagation(); }}>
        <div className="flex items-center justify-between p-6 pb-0">
          <h2 className="text-xl font-bold text-gray-900 dark:text-[#E0E0E0]">Detalles del Cliente</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#333] text-gray-400 dark:text-[#808080] hover:text-gray-600 transition-colors cursor-pointer">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div className="bg-gray-50 dark:bg-[#2C2C2C] rounded-xl p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-12 w-12 flex items-center justify-center rounded-full bg-[#5F7B65] text-white font-bold text-sm">{generarCodigoCliente(cliente.id)}</div>
              <div>
                <p className="font-bold text-gray-900 dark:text-[#E0E0E0]">{cliente.nombre}</p>
                <p className="text-sm text-gray-500 dark:text-[#909090]">{generarCodigoCliente(cliente.id)}</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><p className="text-xs text-gray-500 dark:text-[#909090] font-medium">DNI</p><p className="text-sm font-semibold text-gray-900 dark:text-[#E0E0E0]">{cliente.dni || '—'}</p></div>
            <div><p className="text-xs text-gray-500 dark:text-[#909090] font-medium">Estado</p><span className={'inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ' + (cliente.estado === 'Activo' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300')}>{cliente.estado || 'Activo'}</span></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><p className="text-xs text-gray-500 dark:text-[#909090] font-medium">Teléfono</p><p className="text-sm font-semibold text-gray-900 dark:text-[#E0E0E0]">{cliente.telefono || '—'}</p></div>
            <div><p className="text-xs text-gray-500 dark:text-[#909090] font-medium">Email</p><p className="text-sm font-semibold text-gray-900 dark:text-[#E0E0E0]">{cliente.email || '—'}</p></div>
          </div>
          {cliente.direccion && <div><p className="text-xs text-gray-500 dark:text-[#909090] font-medium">Dirección</p><p className="text-sm font-semibold text-gray-900 dark:text-[#E0E0E0]">{cliente.direccion}{cliente.distrito ? ', ' + cliente.distrito : ''}{cliente.departamento ? ', ' + cliente.departamento : ''}</p></div>}
        </div>
        <div className="p-6 pt-0">
          <button onClick={onClose} className="w-full py-2.5 border border-gray-300 dark:border-[#404040] rounded-xl text-sm font-medium text-gray-700 dark:text-[#D0D0D0] hover:bg-gray-50 dark:hover:bg-[#2C2C2C] transition-colors cursor-pointer">Cerrar</button>
        </div>
      </div>
    </div>
  );
}

function ModalEditar({ cliente, onClose, onGuardar }) {
  var [form, setForm] = useState({
    nombre: cliente.nombre || '',
    apellidos: cliente.apellidos || '',
    dni: cliente.dni || '',
    telefono: cliente.telefono || '',
    whatsapp: cliente.whatsapp || '',
    email: cliente.email || '',
    fechaNacimiento: cliente.fechaNacimiento || '',
    edad: cliente.edad || '',
    genero: cliente.genero || '',
    estadoCivil: cliente.estadoCivil || '',
    direccion: cliente.direccion || '',
    departamento: cliente.departamento || '',
    provincia: cliente.provincia || '',
    distrito: cliente.distrito || '',
    referencia: cliente.referencia || '',
    notas: cliente.notas || '',
    estado: cliente.estado || 'Activo',
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
        whatsapp: form.whatsapp || null,
        email: form.email || null,
        fechaNacimiento: form.fechaNacimiento || null,
        edad: form.edad ? Number(form.edad) : null,
        referencia: form.referencia || null,
        notas: form.notas || null,
      });
      await API.put('/clientes/' + cliente.id, payload);
      onGuardar(cliente.id, form);
      onClose();
    } catch (err) {
      alert('Error al guardar: ' + (err.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto" onClick={function (e) { e.stopPropagation(); }}>
        <div className="flex items-center justify-between p-6 pb-0">
          <h2 className="text-xl font-bold text-gray-900 dark:text-[#E0E0E0]">Editar Cliente</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#333] text-gray-400 dark:text-[#808080] hover:text-gray-600 transition-colors cursor-pointer">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="p-6 space-y-5">
          <div>
            <h3 className="text-sm font-semibold text-gray-800 dark:text-[#E0E0E0] mb-3 pb-1 border-b border-gray-100 dark:border-[#333]">Datos Personales</h3>
            <div className="grid grid-cols-2 gap-4">
              <div><label className={labelClass}>Nombre *</label><input type="text" name="nombre" value={form.nombre} onChange={handleChange} className={inputClass} /></div>
              <div><label className={labelClass}>Apellidos *</label><input type="text" name="apellidos" value={form.apellidos} onChange={handleChange} className={inputClass} /></div>
              <div><label className={labelClass}>DNI *</label><input type="text" name="dni" value={form.dni} onChange={handleChange} maxLength={8} className={inputClass} /></div>
              <div><MaterialDatePicker value={form.fechaNacimiento} onChange={function (val) { handleChange({ target: { name: 'fechaNacimiento', value: val } }); }} label="Fecha Nacimiento" /></div>
              <div><label className={labelClass}>Edad</label><input type="number" name="edad" value={form.edad} onChange={handleChange} className={inputClass} /></div>
              <div><label className={labelClass}>Género</label><select name="genero" value={form.genero} onChange={handleChange} className={inputClass}><option value="">Seleccionar</option><option value="Masculino">Masculino</option><option value="Femenino">Femenino</option><option value="Otro">Otro</option></select></div>
              <div><label className={labelClass}>Estado Civil</label><select name="estadoCivil" value={form.estadoCivil} onChange={handleChange} className={inputClass}><option value="">Seleccionar</option><option value="Soltero/a">Soltero/a</option><option value="Casado/a">Casado/a</option><option value="Divorciado/a">Divorciado/a</option><option value="Viudo/a">Viudo/a</option></select></div>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-800 dark:text-[#E0E0E0] mb-3 pb-1 border-b border-gray-100 dark:border-[#333]">Información de Contacto</h3>
            <div className="grid grid-cols-2 gap-4">
              <div><label className={labelClass}>Teléfono *</label><input type="text" name="telefono" value={form.telefono} onChange={handleChange} className={inputClass} /></div>
              <div><label className={labelClass}>WhatsApp</label><input type="text" name="whatsapp" value={form.whatsapp} onChange={handleChange} className={inputClass} /></div>
              <div className="col-span-2"><label className={labelClass}>Email</label><input type="email" name="email" value={form.email} onChange={handleChange} className={inputClass} /></div>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-800 dark:text-[#E0E0E0] mb-3 pb-1 border-b border-gray-100 dark:border-[#333]">Dirección</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2"><label className={labelClass}>Dirección</label><input type="text" name="direccion" value={form.direccion} onChange={handleChange} className={inputClass} /></div>
              <div><label className={labelClass}>Departamento</label><input type="text" name="departamento" value={form.departamento} onChange={handleChange} className={inputClass} /></div>
              <div><label className={labelClass}>Provincia</label><input type="text" name="provincia" value={form.provincia} onChange={handleChange} className={inputClass} /></div>
              <div><label className={labelClass}>Distrito</label><input type="text" name="distrito" value={form.distrito} onChange={handleChange} className={inputClass} /></div>
              <div className="col-span-2"><label className={labelClass}>Referencia</label><input type="text" name="referencia" value={form.referencia} onChange={handleChange} className={inputClass} /></div>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-800 dark:text-[#E0E0E0] mb-3 pb-1 border-b border-gray-100 dark:border-[#333]">Información Adicional</h3>
            <div className="grid grid-cols-2 gap-4">
              <div><label className={labelClass}>Estado</label><select name="estado" value={form.estado} onChange={handleChange} className={inputClass}><option value="Activo">Activo</option><option value="Inactivo">Inactivo</option></select></div>
              <div className="col-span-2"><label className={labelClass}>Notas</label><textarea name="notas" value={form.notas} onChange={handleChange} rows={3} className={inputClass} /></div>
            </div>
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

function ModalEliminar({ cliente, onClose, onConfirmar }) {
  var [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    setDeleting(true);
    try {
      await API.delete('/clientes/' + cliente.id);
      onConfirmar(cliente.id);
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
          <h3 className="text-lg font-bold text-gray-900 dark:text-[#E0E0E0] mb-1">¿Eliminar cliente?</h3>
          <p className="text-sm text-gray-500 dark:text-[#909090]">¿Estás seguro de que deseas eliminar a <span className="font-semibold text-gray-900 dark:text-[#E0E0E0]">{cliente.nombre}</span>? Esta acción no se puede deshacer.</p>
        </div>
        <div className="flex gap-3 p-6 pt-0">
          <button onClick={onClose} disabled={deleting} className="flex-1 py-2.5 rounded-xl border border-gray-300 dark:border-[#404040] text-sm font-medium text-gray-700 dark:text-[#D0D0D0] hover:bg-gray-50 dark:hover:bg-[#2C2C2C] transition-colors cursor-pointer">Cancelar</button>
          <button onClick={handleDelete} disabled={deleting} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors cursor-pointer disabled:opacity-50">{deleting ? 'Eliminando...' : 'Eliminar'}</button>
        </div>
      </div>
    </div>
  );
}

function ModalFiltroAvanzado({ open, onClose, filtrosActuales, onAplicar }) {
  var [desde, setDesde] = useState(filtrosActuales.fechaDesde || '');
  var [hasta, setHasta] = useState(filtrosActuales.fechaHasta || '');
  var [mascotas, setMascotas] = useState(filtrosActuales.mascotas || 'Todos');
  var [estado, setEstado] = useState(filtrosActuales.estado || 'Todos');

  useEffect(function () {
    setDesde(filtrosActuales.fechaDesde || '');
    setHasta(filtrosActuales.fechaHasta || '');
    setMascotas(filtrosActuales.mascotas || 'Todos');
    setEstado(filtrosActuales.estado || 'Todos');
  }, [filtrosActuales]);

  if (!open) return null;

  function handleAplicar() {
    onAplicar({ fechaDesde: desde, fechaHasta: hasta, mascotas: mascotas, estado: estado });
    onClose();
  }

  function handleLimpiar() {
    setDesde(''); setHasta(''); setMascotas('Todos'); setEstado('Todos');
    onAplicar({ fechaDesde: '', fechaHasta: '', mascotas: 'Todos', estado: 'Todos' });
    onClose();
  }

  var inputClass = "w-full px-4 py-2.5 border border-gray-300 dark:border-[#404040] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5F7B65] focus:border-[#5F7B65] bg-white dark:bg-[#2C2C2C] text-gray-900 dark:text-[#E0E0E0]";
  var labelClass = "block text-sm font-medium text-gray-700 dark:text-[#D0D0D0] mb-1.5";
  var selectClass = "w-full px-4 py-2.5 border border-gray-300 dark:border-[#404040] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5F7B65] cursor-pointer bg-white dark:bg-[#2C2C2C] text-gray-700 dark:text-[#D0D0D0] appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22%236b7280%22%3E%3Cpath%20fill-rule%3D%22evenodd%22%20d%3D%22M5.23%207.21a.75.75%200%20011.06.02L10%2011.168l3.71-3.938a.75.75%200%20111.08%201.04l-4.25%204.5a.75.75%200%2001-1.08%200l-4.25-4.5a.75.75%200%2001.02-1.06z%22%20clip-rule%3D%22evenodd%22%20%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem] bg-[right_0.5rem_center] bg-no-repeat pr-10";

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
            <label className={labelClass}>Número de Mascotas</label>
            <select value={mascotas} onChange={function (e) { setMascotas(e.target.value); }} className={selectClass}>
              <option value="Todos">Todos</option>
              <option value="Con mascotas">Con mascotas</option>
              <option value="Sin mascotas">Sin mascotas</option>
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
var ROL_VETERINARIO = 2;
var ROL_ASISTENTE = 3;

var userData = JSON.parse(localStorage.getItem('user') || '{}');
var idRol = userData.idRol || 0;

function Clientes() {
  var [clientes, setClientes] = useState([]);
  var [loading, setLoading] = useState(true);
  var [showModalNuevo, setShowModalNuevo] = useState(false);
  var [showModalDetalles, setShowModalDetalles] = useState(null);
  var [showModalEditar, setShowModalEditar] = useState(null);
  var [showModalEliminar, setShowModalEliminar] = useState(null);
  var [search, setSearch] = useState('');
  var [estadoFilter, setEstadoFilter] = useState('');
  var [page, setPage] = useState(1);
  var [showModalFiltro, setShowModalFiltro] = useState(false);
  var [filtrosAvanzados, setFiltrosAvanzados] = useState({ fechaDesde: '', fechaHasta: '', mascotas: 'Todos', estado: 'Todos' });

  function cargarClientes() {
    setLoading(true);
    API.get('/clientes')
      .then(function (res) { setClientes(res.data); })
      .catch(function (err) { alert('Error al cargar clientes: ' + (err.response?.data?.message || err.message)); })
      .finally(function () { setLoading(false); });
  }

  useEffect(function () { cargarClientes(); }, []);

  function aplicarFiltrosAvanzados(lista) {
    var f = filtrosAvanzados;
    return lista.filter(function (c) {
      if (f.fechaDesde && c.fechaNacimiento && c.fechaNacimiento < f.fechaDesde) return false;
      if (f.fechaHasta && c.fechaNacimiento && c.fechaNacimiento > f.fechaHasta) return false;
      if (f.mascotas === 'Con mascotas' && !c.mascotasCount) return false;
      if (f.mascotas === 'Sin mascotas' && c.mascotasCount) return false;
      if (f.estado !== 'Todos' && c.estado !== f.estado) return false;
      return true;
    });
  }

  var filtered = aplicarFiltrosAvanzados(clientes).filter(function (c) {
    var q = search.toLowerCase();
    var matchSearch = !q || (c.nombre || '').toLowerCase().includes(q) || (c.dni || '').includes(q) || (c.telefono || '').includes(q) || (generarCodigoCliente(c.id) || '').toLowerCase().includes(q);
    var matchEstado = !estadoFilter || c.estado === estadoFilter;
    return matchSearch && matchEstado;
  });

  var totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE) || 1;
  var paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  useEffect(function () { setPage(1); }, [search, estadoFilter]);

  function refrescarLista() {
    cargarClientes();
  }

  function handleGuardarCliente() {
    refrescarLista();
  }

  function handleEliminarCliente() {
    refrescarLista();
  }

  function handleNuevoCliente() {
    setShowModalNuevo(false);
    refrescarLista();
  }

  function exportarExcel() {
    var datos = paginated.map(function (c) {
      return {
        Codigo: generarCodigoCliente(c.id),
        Nombre: c.nombre,
        DNI: c.dni || '',
        Telefono: c.telefono || '',
        Email: c.email || '',
        Mascotas: c.mascotasCount || 0,
        Estado: c.estado || 'Activo',
      };
    });
    var wb = XLSX.utils.book_new();
    var ws = XLSX.utils.json_to_sheet(datos);
    XLSX.utils.book_append_sheet(wb, ws, 'Clientes');
    var fecha = new Date().toISOString().split('T')[0];
    XLSX.writeFile(wb, 'Clientes_' + fecha + '.xlsx');
  }

  var totalActivos = clientes.filter(function (c) { return c.estado === 'Activo'; }).length;
  var totalConMascotas = clientes.filter(function (c) { return c.mascotasCount > 0; }).length;

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-none space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-[#E0E0E0]">Módulo de Clientes</h1>
            <p className="text-sm text-gray-500 dark:text-[#909090] mt-1">Administra los clientes y sus mascotas</p>
          </div>
          <button onClick={function () { setShowModalNuevo(true); }} className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors cursor-pointer" style={{ backgroundColor: '#5F7B65' }}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
            Nuevo Cliente
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-xl border border-gray-200 dark:border-[#333] bg-white dark:bg-[#1E1E1E] p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-[#909090] font-medium">Total Clientes</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-[#E0E0E0] mt-1">{clientes.length}</p>
              </div>
              <div className="h-11 w-11 flex items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" /></svg>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-gray-200 dark:border-[#333] bg-white dark:bg-[#1E1E1E] p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-[#909090] font-medium">Clientes Activos</p>
                <p className="text-2xl font-bold text-emerald-600 mt-1">{totalActivos}</p>
              </div>
              <div className="h-11 w-11 flex items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-gray-200 dark:border-[#333] bg-white dark:bg-[#1E1E1E] p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-[#909090] font-medium">Nuevos este mes</p>
                <p className="text-2xl font-bold text-amber-600 mt-1">2</p>
              </div>
              <div className="h-11 w-11 flex items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" /></svg>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-gray-200 dark:border-[#333] bg-white dark:bg-[#1E1E1E] p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-[#909090] font-medium">Con Mascotas</p>
                <p className="text-2xl font-bold text-purple-600 mt-1">{totalConMascotas}</p>
              </div>
              <div className="h-11 w-11 flex items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z" /></svg>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 dark:border-[#333] bg-white dark:bg-[#1E1E1E] p-4 shadow-sm">
          <div className="flex flex-col sm:flex-row items-end gap-3">
            <div className="relative flex-1">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-[#808080]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>
              <input type="text" placeholder="Buscar por nombre, DNI, código..." value={search} onChange={function (e) { setSearch(e.target.value); }} className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-[#404040] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5F7B65] focus:border-[#5F7B65] bg-white dark:bg-[#2C2C2C] text-gray-900 dark:text-[#E0E0E0]" />
            </div>
            <select value={estadoFilter} onChange={function (e) { setEstadoFilter(e.target.value); }} className="rounded-lg border border-gray-300 dark:border-[#404040] px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#5F7B65] cursor-pointer bg-white dark:bg-[#2C2C2C] text-gray-700 dark:text-[#D0D0D0]">
              <option value="">Todos los estados</option>
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
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
      </div>

      <div className="flex-1 flex flex-col min-h-0 rounded-xl border border-gray-200 dark:border-[#333] bg-white dark:bg-[#1E1E1E] shadow-sm overflow-hidden mt-6">
        {loading ? (
          <div className="p-8 text-center text-gray-400 dark:text-[#808080]">Cargando clientes...</div>
        ) : paginated.length === 0 ? (
          <div className="p-8 text-center text-gray-400 dark:text-[#808080]">No se encontraron clientes.</div>
        ) : (
          <>
            <div className="flex-1 overflow-auto min-h-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 dark:bg-[#2C2C2C] text-left">
                    <th className="px-4 py-3 font-semibold text-gray-600 dark:text-[#A0A0A0]">Código</th>
                    <th className="px-4 py-3 font-semibold text-gray-600 dark:text-[#A0A0A0]">Nombre</th>
                    <th className="px-4 py-3 font-semibold text-gray-600 dark:text-[#A0A0A0]">DNI</th>
                    <th className="px-4 py-3 font-semibold text-gray-600 dark:text-[#A0A0A0]">Teléfono</th>
                    <th className="px-4 py-3 font-semibold text-gray-600 dark:text-[#A0A0A0]">Email</th>
                    <th className="px-4 py-3 font-semibold text-gray-600 dark:text-[#A0A0A0] text-center">Mascotas</th>
                    <th className="px-4 py-3 font-semibold text-gray-600 dark:text-[#A0A0A0] text-center">Estado</th>
                    <th className="px-4 py-3 font-semibold text-gray-600 dark:text-[#A0A0A0] text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-[#333]">
                  {paginated.map(function (c) {
                    return (
                      <tr key={c.id} className="hover:bg-gray-50 dark:hover:bg-[#2C2C2C] transition-colors">
                        <td className="px-4 py-3 text-xs font-mono font-semibold text-[#5F7B65]">{generarCodigoCliente(c.id)}</td>
                        <td className="px-4 py-3 font-medium text-gray-900 dark:text-[#E0E0E0]">{c.nombre}</td>
                        <td className="px-4 py-3 text-gray-600 dark:text-[#A0A0A0] font-mono text-xs">{c.dni || '—'}</td>
                        <td className="px-4 py-3 text-gray-600 dark:text-[#A0A0A0]">{c.telefono || '—'}</td>
                        <td className="px-4 py-3 text-gray-600 dark:text-[#A0A0A0]">{c.email || '—'}</td>
                        <td className="px-4 py-3 text-center">
                          <span className="inline-flex items-center gap-1 text-purple-600 font-semibold">{c.mascotasCount || 0}</span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ' + (c.estado === 'Activo' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' : 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300')}>{c.estado || 'Activo'}</span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center gap-1">
                            <button onClick={function () { setShowModalDetalles(c); }} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-500 hover:text-blue-700 transition-colors cursor-pointer" title="Ver Detalles">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>
                            </button>
                            {idRol !== ROL_ASISTENTE && (
                              <button onClick={function () { setShowModalEditar(c); }} className="p-1.5 rounded-lg hover:bg-amber-50 text-amber-500 hover:text-amber-700 transition-colors cursor-pointer" title="Editar">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" /></svg>
                              </button>
                            )}
                            {idRol === ROL_ADMIN && (
                              <button onClick={function () { setShowModalEliminar(c); }} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 hover:text-red-700 transition-colors cursor-pointer" title="Eliminar">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="flex-none flex items-center justify-end gap-2 px-4 py-3 border-t border-gray-100 dark:border-[#333]">
              <button onClick={function () { setPage(Math.max(1, page - 1)); }} disabled={page === 1} className={'px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors cursor-pointer ' + (page === 1 ? 'border-gray-200 dark:border-[#333] text-gray-300 dark:text-[#808080] cursor-not-allowed' : 'border-gray-300 dark:border-[#404040] text-gray-700 dark:text-[#D0D0D0] hover:bg-gray-50 dark:hover:bg-[#2C2C2C]')}>Anterior</button>
              {Array.from({ length: totalPages }, function (_, i) { return i + 1; }).map(function (n) {
                return (
                  <button key={n} onClick={function () { setPage(n); }} className={'h-8 w-8 rounded-lg text-sm font-medium transition-colors cursor-pointer ' + (n === page ? 'bg-[#0B5E4B] text-white' : 'border border-gray-300 dark:border-[#404040] text-gray-700 dark:text-[#D0D0D0] hover:bg-gray-50 dark:hover:bg-[#2C2C2C]')}>{n}</button>
                );
              })}
              <button onClick={function () { setPage(Math.min(totalPages, page + 1)); }} disabled={page === totalPages} className={'px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors cursor-pointer ' + (page === totalPages ? 'border-gray-200 dark:border-[#333] text-gray-300 dark:text-[#808080] cursor-not-allowed' : 'border-gray-300 dark:border-[#404040] text-gray-700 dark:text-[#D0D0D0] hover:bg-gray-50 dark:hover:bg-[#2C2C2C]')}>Siguiente</button>
            </div>
          </>
        )}
      </div>

      {showModalNuevo && <NuevoClienteModal onClose={function () { setShowModalNuevo(false); }} onCreado={function () { handleNuevoCliente(); }} />}
      {showModalDetalles && <ModalDetalles cliente={showModalDetalles} onClose={function () { setShowModalDetalles(null); }} />}
      {showModalEditar && <ModalEditar cliente={showModalEditar} onClose={function () { setShowModalEditar(null); }} onGuardar={handleGuardarCliente} />}
      {showModalEliminar && <ModalEliminar cliente={showModalEliminar} onClose={function () { setShowModalEliminar(null); }} onConfirmar={handleEliminarCliente} />}
      <ModalFiltroAvanzado open={showModalFiltro} onClose={function () { setShowModalFiltro(false); }} filtrosActuales={filtrosAvanzados} onAplicar={setFiltrosAvanzados} />
    </div>
  );
}

export default Clientes;
