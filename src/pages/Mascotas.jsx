import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/axiosConfig';
import * as XLSX from 'xlsx';

var ITEMS_PER_PAGE = 5;

function calcularEdad(fechaNac) {
  if (!fechaNac) return '';
  const nac = new Date(fechaNac);
  const hoy = new Date();
  let años = hoy.getFullYear() - nac.getFullYear();
  const meses = hoy.getMonth() - nac.getMonth();
  if (meses < 0 || (meses === 0 && hoy.getDate() < nac.getDate())) años--;
  if (años > 0) return `${años} año${años !== 1 ? 's' : ''}`;
  const m = meses < 0 ? meses + 12 : meses;
  if (m > 0) return `${m} mes${m !== 1 ? 'es' : ''}`;
  return 'Recién nacido';
}

function ModalDetalles({ mascota, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl shadow-2xl w-full max-w-lg mx-4" onClick={function (e) { e.stopPropagation(); }}>
        <div className="flex items-center justify-between p-6 pb-0">
          <h2 className="text-xl font-bold text-gray-900 dark:text-[#E0E0E0]">Detalles de la Mascota</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#333] text-gray-400 dark:text-[#808080] hover:text-gray-600 transition-colors cursor-pointer">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div className="bg-gray-50 dark:bg-[#2C2C2C] rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="h-14 w-14 flex items-center justify-center rounded-full bg-[#5F7B65] text-white text-lg font-bold shrink-0">{mascota.nombre?.charAt(0)?.toUpperCase() || '?'}</div>
              <div>
                <p className="font-bold text-gray-900 dark:text-[#E0E0E0]">{mascota.nombre}</p>
                <p className="text-sm text-gray-500 dark:text-[#909090]">{mascota.especie || '-'} · {mascota.raza || '-'}</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><p className="text-xs text-gray-500 dark:text-[#909090] font-medium">Dueño</p><p className="text-sm font-semibold text-gray-900 dark:text-[#E0E0E0]">{mascota.cliente?.nombre || '-'}</p></div>
            <div><p className="text-xs text-gray-500 dark:text-[#909090] font-medium">Especie</p><p className="text-sm font-semibold text-gray-900 dark:text-[#E0E0E0]">{mascota.especie || '-'}</p></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><p className="text-xs text-gray-500 dark:text-[#909090] font-medium">Raza</p><p className="text-sm font-semibold text-gray-900 dark:text-[#E0E0E0]">{mascota.raza || '-'}</p></div>
            <div><p className="text-xs text-gray-500 dark:text-[#909090] font-medium">Sexo</p><p className="text-sm font-semibold text-gray-900 dark:text-[#E0E0E0]">{mascota.sexo || '-'}</p></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><p className="text-xs text-gray-500 dark:text-[#909090] font-medium">Edad</p><p className="text-sm font-semibold text-gray-900 dark:text-[#E0E0E0]">{calcularEdad(mascota.fechaNacimiento) || '-'}</p></div>
            <div><p className="text-xs text-gray-500 dark:text-[#909090] font-medium">Peso</p><p className="text-sm font-semibold text-gray-900 dark:text-[#E0E0E0]">{mascota.peso ? mascota.peso + ' kg' : '-'}</p></div>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-[#909090] font-medium">Estado</p>
            <span className={'inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ' + (mascota.estado === 'Activo' || !mascota.estado ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' : mascota.estado === 'Inactivo' ? 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300' : 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300')}>{mascota.estado || 'Activo'}</span>
          </div>
        </div>
        <div className="p-6 pt-0">
          <button onClick={onClose} className="w-full py-2.5 border border-gray-300 dark:border-[#404040] rounded-xl text-sm font-medium text-gray-700 dark:text-[#D0D0D0] hover:bg-gray-50 dark:hover:bg-[#2C2C2C] transition-colors cursor-pointer">Cerrar</button>
        </div>
      </div>
    </div>
  );
}

function ModalEditar({ mascota, clientes, onClose, onGuardar }) {
  var [form, setForm] = useState({
    nombre: mascota.nombre,
    especie: mascota.especie,
    raza: mascota.raza,
    sexo: mascota.sexo || '',
    fechaNacimiento: mascota.fechaNacimiento || '',
    color: mascota.color || '',
    microchip: mascota.microchip || '',
    peso: mascota.peso || '',
    tipoPelaje: mascota.tipoPelaje || '',
    tamano: mascota.tamano || '',
    esterilizado: mascota.esterilizado === true ? 'si' : mascota.esterilizado === false ? 'no' : '',
    estado: mascota.estado || 'Activo',
    notas: mascota.notas || '',
    clienteId: mascota.cliente?.id || ''
  });
  var inputClass = 'w-full rounded-lg border border-gray-300 dark:border-[#404040] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#5F7B65] focus:border-[#5F7B65] bg-white dark:bg-[#2C2C2C] text-gray-900 dark:text-[#E0E0E0]';
  var labelClass = 'block text-sm font-medium text-gray-700 dark:text-[#D0D0D0] mb-1';
  var selectClass = 'w-full rounded-lg border border-gray-300 dark:border-[#404040] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#5F7B65] focus:border-[#5F7B65] bg-white dark:bg-[#2C2C2C] text-gray-900 dark:text-[#E0E0E0]';

  function handleChange(e) {
    setForm(Object.assign({}, form, { [e.target.name]: e.target.value }));
  }

  function handleSubmit() {
    onGuardar(mascota.id, form);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto" onClick={function (e) { e.stopPropagation(); }}>
        <div className="flex items-center justify-between p-6 pb-0">
          <h2 className="text-xl font-bold text-gray-900 dark:text-[#E0E0E0]">Editar Mascota</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#333] text-gray-400 dark:text-[#808080] hover:text-gray-600 transition-colors cursor-pointer">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className={labelClass}>Nombre *</label><input type="text" name="nombre" value={form.nombre} onChange={handleChange} className={inputClass} /></div>
            <div><label className={labelClass}>Especie *</label>
              <select name="especie" value={form.especie} onChange={handleChange} className={selectClass}>
                <option value="">Seleccionar</option>
                <option value="Perro">Perro</option>
                <option value="Gato">Gato</option>
                <option value="Ave">Ave</option>
                <option value="Roedor">Roedor</option>
                <option value="Reptil">Reptil</option>
                <option value="Otro">Otro</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className={labelClass}>Raza</label><input type="text" name="raza" value={form.raza} onChange={handleChange} className={inputClass} /></div>
            <div><label className={labelClass}>Sexo</label>
              <select name="sexo" value={form.sexo} onChange={handleChange} className={selectClass}>
                <option value="">Seleccionar</option>
                <option value="Macho">Macho</option>
                <option value="Hembra">Hembra</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div><label className={labelClass}>Fecha Nacimiento</label><input type="date" name="fechaNacimiento" value={form.fechaNacimiento} onChange={handleChange} className={inputClass} /></div>
            <div><label className={labelClass}>Color</label><input type="text" name="color" value={form.color} onChange={handleChange} className={inputClass} /></div>
            <div><label className={labelClass}>Peso (kg)</label><input type="number" step="0.1" min="0" name="peso" value={form.peso} onChange={handleChange} className={inputClass} /></div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div><label className={labelClass}>Microchip</label><input type="text" name="microchip" value={form.microchip} onChange={handleChange} className={inputClass} /></div>
            <div><label className={labelClass}>Tipo Pelaje</label>
              <select name="tipoPelaje" value={form.tipoPelaje} onChange={handleChange} className={selectClass}>
                <option value="">Seleccionar</option>
                <option value="Corto">Corto</option>
                <option value="Mediano">Mediano</option>
                <option value="Largo">Largo</option>
                <option value="Sin pelo">Sin pelo</option>
                <option value="Rizado">Rizado</option>
              </select>
            </div>
            <div><label className={labelClass}>Tamaño</label>
              <select name="tamano" value={form.tamano} onChange={handleChange} className={selectClass}>
                <option value="">Seleccionar</option>
                <option value="Pequeño">Pequeño</option>
                <option value="Mediano">Mediano</option>
                <option value="Grande">Grande</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div><label className={labelClass}>Esterilizado</label>
              <select name="esterilizado" value={form.esterilizado} onChange={handleChange} className={selectClass}>
                <option value="">Seleccionar</option>
                <option value="si">Sí</option>
                <option value="no">No</option>
              </select>
            </div>
            <div><label className={labelClass}>Estado</label>
              <select name="estado" value={form.estado} onChange={handleChange} className={selectClass}>
                <option value="Activo">Activo</option>
                <option value="Inactivo">Inactivo</option>
                <option value="En tratamiento">En tratamiento</option>
              </select>
            </div>
          </div>
          <div>
            <label className={labelClass}>Notas</label>
            <textarea name="notas" value={form.notas} onChange={handleChange} rows={3} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Dueño *</label>
            <select name="clienteId" value={form.clienteId} onChange={handleChange} className={selectClass}>
              <option value="">Seleccionar dueño</option>
              {clientes.map(function (c) { return <option key={c.id} value={c.id}>{c.nombre}</option>; })}
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

function ModalEliminar({ mascota, onClose, onConfirmar }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl shadow-2xl w-full max-w-sm mx-4" onClick={function (e) { e.stopPropagation(); }}>
        <div className="p-6 text-center">
          <div className="mx-auto h-14 w-14 flex items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30 mb-4">
            <svg className="w-7 h-7 text-red-600" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-[#E0E0E0] mb-1">¿Eliminar mascota?</h3>
          <p className="text-sm text-gray-500 dark:text-[#909090]">¿Estás seguro de que deseas eliminar a <span className="font-semibold text-gray-900 dark:text-[#E0E0E0]">{mascota.nombre}</span>? Esta acción no se puede deshacer.</p>
        </div>
        <div className="flex gap-3 p-6 pt-0">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-300 dark:border-[#404040] text-sm font-medium text-gray-700 dark:text-[#D0D0D0] hover:bg-gray-50 dark:hover:bg-[#2C2C2C] transition-colors cursor-pointer">Cancelar</button>
          <button onClick={function () { onConfirmar(mascota.id); onClose(); }} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors cursor-pointer">Eliminar</button>
        </div>
      </div>
    </div>
  );
}

function ModalFiltroAvanzado({ open, onClose, filtrosActuales, onAplicar, especies }) {
  var [desde, setDesde] = useState(filtrosActuales.fechaDesde || '');
  var [hasta, setHasta] = useState(filtrosActuales.fechaHasta || '');
  var [especie, setEspecie] = useState(filtrosActuales.especie || 'Todos');
  var [raza, setRaza] = useState(filtrosActuales.raza || '');
  var [estado, setEstado] = useState(filtrosActuales.estado || 'Todos');

  var razasPorEspecie = {
    Perro: ['Labrador Retriever', 'Pastor Alemán', 'Golden Retriever', 'Bulldog', 'Beagle', 'Chihuahua', 'Poodle', 'Dálmata', 'Otro'],
    Gato: ['Siamés', 'Persa', 'Maine Coon', 'Bengalí', 'Angora', 'Sphynx', 'Otro'],
  };

  useEffect(function () {
    setDesde(filtrosActuales.fechaDesde || '');
    setHasta(filtrosActuales.fechaHasta || '');
    setEspecie(filtrosActuales.especie || 'Todos');
    setRaza(filtrosActuales.raza || '');
    setEstado(filtrosActuales.estado || 'Todos');
  }, [filtrosActuales]);

  if (!open) return null;

  var razasDisponibles = especie !== 'Todos' ? (razasPorEspecie[especie] || ['Otro']) : [];

  function handleAplicar() {
    onAplicar({ fechaDesde: desde, fechaHasta: hasta, especie: especie, raza: raza, estado: estado });
    onClose();
  }

  function handleLimpiar() {
    setDesde(''); setHasta(''); setEspecie('Todos'); setRaza(''); setEstado('Todos');
    onAplicar({ fechaDesde: '', fechaHasta: '', especie: 'Todos', raza: '', estado: 'Todos' });
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
              <label className={labelClass}>Fecha Desde</label>
              <input type="date" value={desde} onChange={function (e) { setDesde(e.target.value); }} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Fecha Hasta</label>
              <input type="date" value={hasta} onChange={function (e) { setHasta(e.target.value); }} className={inputClass} />
            </div>
          </div>
          <div>
            <label className={labelClass}>Especie</label>
            <select value={especie} onChange={function (e) { setEspecie(e.target.value); setRaza(''); }} className={selectClass}>
              <option value="Todos">Todos</option>
              {especies.map(function (e) { return <option key={e} value={e}>{e}</option>; })}
            </select>
          </div>
          {razasDisponibles.length > 0 && (
            <div>
              <label className={labelClass}>Raza</label>
              <select value={raza} onChange={function (e) { setRaza(e.target.value); }} className={selectClass}>
                <option value="">Todas las razas</option>
                {razasDisponibles.map(function (r) { return <option key={r} value={r}>{r}</option>; })}
              </select>
            </div>
          )}
          <div>
            <label className={labelClass}>Estado</label>
            <select value={estado} onChange={function (e) { setEstado(e.target.value); }} className={selectClass}>
              <option value="Todos">Todos</option>
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
              <option value="En tratamiento">En tratamiento</option>
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

function Mascotas() {
  var navigate = useNavigate();
  var [mascotas, setMascotas] = useState([]);
  var [clientes, setClientes] = useState([]);
  var [loading, setLoading] = useState(true);
  var [showModalDetalles, setShowModalDetalles] = useState(null);
  var [showModalEditar, setShowModalEditar] = useState(null);
  var [showModalEliminar, setShowModalEliminar] = useState(null);
  var [search, setSearch] = useState('');
  var [especieFilter, setEspecieFilter] = useState('');
  var [page, setPage] = useState(1);
  var [showModalFiltro, setShowModalFiltro] = useState(false);
  var [filtrosAvanzados, setFiltrosAvanzados] = useState({ fechaDesde: '', fechaHasta: '', especie: 'Todos', raza: '', estado: 'Todos' });

  useEffect(function () {
    async function loadData() {
      try {
        var [mascRes, cliRes] = await Promise.all([
          API.get('/mascotas'),
          API.get('/clientes'),
        ]);
        setMascotas(mascRes.data);
        setClientes(cliRes.data);
      } catch (err) {
        console.error('Error cargando datos:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  function aplicarFiltrosAvanzados(lista) {
    var f = filtrosAvanzados;
    return lista.filter(function (m) {
      if (f.fechaDesde && m.fechaNacimiento && m.fechaNacimiento < f.fechaDesde) return false;
      if (f.fechaHasta && m.fechaNacimiento && m.fechaNacimiento > f.fechaHasta) return false;
      if (f.especie !== 'Todos' && m.especie !== f.especie) return false;
      if (f.raza && m.raza !== f.raza) return false;
      if (f.estado !== 'Todos' && m.estado !== f.estado) return false;
      return true;
    });
  }

  var filtered = aplicarFiltrosAvanzados(mascotas).filter(function (m) {
    var q = search.toLowerCase();
    var matchSearch = !q || m.nombre?.toLowerCase().includes(q) || (m.especie && m.especie.toLowerCase().includes(q)) || (m.raza && m.raza.toLowerCase().includes(q));
    var matchEspecie = !especieFilter || m.especie === especieFilter;
    return matchSearch && matchEspecie;
  });

  var totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE) || 1;
  var paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  useEffect(function () { setPage(1); }, [search, especieFilter, filtrosAvanzados]);

  async function handleGuardarMascota(id, datos) {
    try {
      var body = {
        nombre: datos.nombre,
        especie: datos.especie,
        raza: datos.raza,
        sexo: datos.sexo || null,
        fechaNacimiento: datos.fechaNacimiento || null,
        color: datos.color || null,
        microchip: datos.microchip || null,
        peso: datos.peso ? Number(datos.peso) : null,
        tipoPelaje: datos.tipoPelaje || null,
        tamano: datos.tamano || null,
        esterilizado: datos.esterilizado === 'si' ? true : datos.esterilizado === 'no' ? false : null,
        estado: datos.estado || 'Activo',
        notas: datos.notas || null,
        cliente: datos.clienteId ? { id: Number(datos.clienteId) } : null,
      };
      var res = await API.put('/mascotas/' + id, body);
      setMascotas(mascotas.map(function (m) {
        if (m.id !== id) return m;
        var cliente = clientes.find(function (c) { return c.id === Number(datos.clienteId); });
        return Object.assign({}, res.data, { cliente: cliente || m.cliente });
      }));
    } catch (err) {
      console.error('Error al actualizar mascota:', err);
    }
  }

  async function handleEliminarMascota(id) {
    try {
      await API.delete('/mascotas/' + id);
      setMascotas(mascotas.filter(function (m) { return m.id !== id; }));
    } catch (err) {
      console.error('Error al eliminar mascota:', err);
    }
  }

  function exportarExcel() {
    var datos = paginated.map(function (m) {
      return {
        ID: String(m.id).padStart(4, '0'),
        Nombre: m.nombre,
        Especie: m.especie || '',
        Raza: m.raza || '',
        Dueno: m.cliente?.nombre || '',
        Estado: m.estado || 'Activo',
      };
    });
    var wb = XLSX.utils.book_new();
    var ws = XLSX.utils.json_to_sheet(datos);
    XLSX.utils.book_append_sheet(wb, ws, 'Mascotas');
    var fecha = new Date().toISOString().split('T')[0];
    XLSX.writeFile(wb, 'Mascotas_' + fecha + '.xlsx');
  }

  var especies = [...new Set(mascotas.map(function (m) { return m.especie; }).filter(Boolean))];

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-none space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-[#E0E0E0]">Módulo de Mascotas</h1>
            <p className="text-sm text-gray-500 dark:text-[#909090] mt-1">Administra las mascotas registradas en el sistema</p>
          </div>
          <button onClick={function () { navigate('/mascotas/nueva'); }} className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors cursor-pointer" style={{ backgroundColor: '#5F7B65' }}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
            Nueva Mascota
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-xl border border-gray-200 dark:border-[#333] bg-white dark:bg-[#1E1E1E] p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-[#909090] font-medium">Total Mascotas</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-[#E0E0E0] mt-1">{loading ? '...' : mascotas.length}</p>
              </div>
              <div className="h-11 w-11 flex items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Z" /></svg>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-gray-200 dark:border-[#333] bg-white dark:bg-[#1E1E1E] p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-[#909090] font-medium">Caninos</p>
                <p className="text-2xl font-bold text-amber-600 mt-1">{loading ? '...' : mascotas.filter(function (m) { return m.especie === 'Perro'; }).length}</p>
              </div>
              <div className="h-11 w-11 flex items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" /></svg>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-gray-200 dark:border-[#333] bg-white dark:bg-[#1E1E1E] p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-[#909090] font-medium">Felinos</p>
                <p className="text-2xl font-bold text-purple-600 mt-1">{loading ? '...' : mascotas.filter(function (m) { return m.especie === 'Gato'; }).length}</p>
              </div>
              <div className="h-11 w-11 flex items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6Z" /></svg>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-gray-200 dark:border-[#333] bg-white dark:bg-[#1E1E1E] p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-[#909090] font-medium">Clientes</p>
                <p className="text-2xl font-bold text-emerald-600 mt-1">{loading ? '...' : clientes.length}</p>
              </div>
              <div className="h-11 w-11 flex items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" /></svg>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 dark:border-[#333] bg-white dark:bg-[#1E1E1E] p-4 shadow-sm">
          <div className="flex flex-col sm:flex-row items-end gap-3">
            <div className="relative flex-1">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-[#808080]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>
              <input type="text" placeholder="Buscar por nombre, especie..." value={search} onChange={function (e) { setSearch(e.target.value); }} className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-[#404040] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5F7B65] focus:border-[#5F7B65] bg-white dark:bg-[#2C2C2C] text-gray-900 dark:text-[#E0E0E0]" />
            </div>
            <select value={especieFilter} onChange={function (e) { setEspecieFilter(e.target.value); }} className="rounded-lg border border-gray-300 dark:border-[#404040] px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#5F7B65] cursor-pointer bg-white dark:bg-[#2C2C2C] text-gray-700 dark:text-[#D0D0D0]">
              <option value="">Todas las especies</option>
              {especies.map(function (esp) { return <option key={esp} value={esp}>{esp}</option>; })}
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
          <div className="p-8 text-center text-gray-400 dark:text-[#808080]">Cargando mascotas...</div>
        ) : paginated.length === 0 ? (
          <div className="p-8 text-center text-gray-400 dark:text-[#808080]">No se encontraron mascotas.</div>
        ) : (
          <>
            <div className="flex-1 overflow-auto min-h-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 dark:bg-[#2C2C2C] text-left">
                    <th className="px-4 py-3 font-semibold text-gray-600 dark:text-[#A0A0A0]">ID</th>
                    <th className="px-4 py-3 font-semibold text-gray-600 dark:text-[#A0A0A0]">Nombre</th>
                    <th className="px-4 py-3 font-semibold text-gray-600 dark:text-[#A0A0A0]">Especie</th>
                    <th className="px-4 py-3 font-semibold text-gray-600 dark:text-[#A0A0A0]">Raza</th>
                    <th className="px-4 py-3 font-semibold text-gray-600 dark:text-[#A0A0A0]">Dueño</th>
                    <th className="px-4 py-3 font-semibold text-gray-600 dark:text-[#A0A0A0] text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-[#333]">
                  {paginated.map(function (m) {
                    return (
                      <tr key={m.id} className="hover:bg-gray-50 dark:hover:bg-[#2C2C2C] transition-colors">
                        <td className="px-4 py-3 text-xs font-mono font-semibold text-[#5F7B65]">{String(m.id).padStart(4, '0')}</td>
                        <td className="px-4 py-3 font-medium text-gray-900 dark:text-[#E0E0E0]">{m.nombre}</td>
                        <td className="px-4 py-3 text-gray-600 dark:text-[#A0A0A0]">{m.especie || '-'}</td>
                        <td className="px-4 py-3 text-gray-600 dark:text-[#A0A0A0]">{m.raza || '-'}</td>
                        <td className="px-4 py-3 text-gray-600 dark:text-[#A0A0A0]">{m.cliente?.nombre || '-'}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center gap-1">
                            <button onClick={function () { setShowModalDetalles(m); }} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-500 hover:text-blue-700 transition-colors cursor-pointer" title="Ver Detalles">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>
                            </button>
                            <button onClick={function () { setShowModalEditar(m); }} className="p-1.5 rounded-lg hover:bg-amber-50 text-amber-500 hover:text-amber-700 transition-colors cursor-pointer" title="Editar">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" /></svg>
                            </button>
                            <button onClick={function () { setShowModalEliminar(m); }} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 hover:text-red-700 transition-colors cursor-pointer" title="Eliminar">
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

            <div className="flex-none flex items-center justify-end gap-2 px-4 py-3 border-t border-gray-100 dark:border-[#333]">
              <button onClick={function () { setPage(Math.max(1, page - 1)); }} disabled={page === 1} className={'px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors cursor-pointer ' + (page === 1 ? 'border-gray-200 dark:border-[#333] text-gray-300 dark:text-[#808080] cursor-not-allowed' : 'border-gray-300 dark:border-[#404040] text-gray-700 dark:text-[#D0D0D0] hover:bg-gray-50 dark:hover:bg-[#2C2C2C]')}>Anterior</button>
              {Array.from({ length: totalPages }, function (_, i) { return i + 1; }).map(function (n) {
                return (
                  <button key={n} onClick={function () { setPage(n); }} className={'h-8 w-8 rounded-lg text-sm font-medium transition-colors cursor-pointer ' + (n === page ? 'bg-[#5F7B65] text-white' : 'border border-gray-300 dark:border-[#404040] text-gray-700 dark:text-[#D0D0D0] hover:bg-gray-50 dark:hover:bg-[#2C2C2C]')}>{n}</button>
                );
              })}
              <button onClick={function () { setPage(Math.min(totalPages, page + 1)); }} disabled={page === totalPages} className={'px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors cursor-pointer ' + (page === totalPages ? 'border-gray-200 dark:border-[#333] text-gray-300 dark:text-[#808080] cursor-not-allowed' : 'border-gray-300 dark:border-[#404040] text-gray-700 dark:text-[#D0D0D0] hover:bg-gray-50 dark:hover:bg-[#2C2C2C]')}>Siguiente</button>
            </div>
          </>
        )}
      </div>

      {showModalDetalles && <ModalDetalles mascota={showModalDetalles} onClose={function () { setShowModalDetalles(null); }} />}
      {showModalEditar && <ModalEditar mascota={showModalEditar} clientes={clientes} onClose={function () { setShowModalEditar(null); }} onGuardar={handleGuardarMascota} />}
      {showModalEliminar && <ModalEliminar mascota={showModalEliminar} onClose={function () { setShowModalEliminar(null); }} onConfirmar={handleEliminarMascota} />}
      <ModalFiltroAvanzado open={showModalFiltro} onClose={function () { setShowModalFiltro(false); }} filtrosActuales={filtrosAvanzados} onAplicar={setFiltrosAvanzados} especies={especies} />
    </div>
  );
}

export default Mascotas;
