import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import * as XLSX from 'xlsx';
import API from '../services/axiosConfig';
import MaterialDatePicker from '../components/MaterialDatePicker';

var ITEMS_PER_PAGE = 8;

function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

const PROXIMAS_VACUNAS = [
  { id: 1, mascota: 'Max', vacuna: 'Rabia', fecha: '15/06/2025', inicial: 'M' },
  { id: 2, mascota: 'Luna', vacuna: 'Triple Felina', fecha: '10/12/2024', inicial: 'L' },
  { id: 3, mascota: 'Bella', vacuna: 'Rabia', fecha: '01/06/2025', inicial: 'B' },
  { id: 4, mascota: 'Coco', vacuna: 'Múltiple', fecha: '20/05/2025', inicial: 'C' },
];

const DONUT_COLORS = ['#5F7B65', '#D48C3D', '#D64A4A'];

const ESQUEMAS_MOCK = [
  { id: 'ESQ-2026-0001', especie: 'Perro', edad: '6-8 semanas', vacuna: 'Parvovirus', dosis: '1ml', refuerzo: 'Sí' },
  { id: 'ESQ-2026-0002', especie: 'Perro', edad: '8-10 semanas', vacuna: 'Moquillo', dosis: '1ml', refuerzo: 'Sí' },
  { id: 'ESQ-2026-0003', especie: 'Perro', edad: '12 semanas', vacuna: 'Rabia', dosis: '1ml', refuerzo: 'Anual' },
  { id: 'ESQ-2026-0004', especie: 'Gato', edad: '8 semanas', vacuna: 'Triple Felina', dosis: '0.5ml', refuerzo: 'Sí' },
];

const tabs = ['Registro de Vacunas', 'Esquemas de Vacunación'];

const estadoClass = {
  'Aplicada': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  'Próxima a Vencer': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  'Pendiente': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
};

function ModalDetalles({ vacuna, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl shadow-2xl w-full max-w-md mx-4" onClick={function (e) { e.stopPropagation(); }}>
        <div className="flex items-center justify-between p-6 pb-0">
          <h2 className="text-xl font-bold text-gray-900 dark:text-[#E0E0E0]">Detalle de Vacuna</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#333] text-gray-400 dark:text-[#808080] hover:text-gray-600 transition-colors cursor-pointer">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div className="bg-gray-50 dark:bg-[#2C2C2C] rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#5F7B65] flex items-center justify-center text-white text-sm font-bold shrink-0">{(vacuna.mascota?.nombre || '?')[0]}</div>
              <div>
                <p className="font-bold text-gray-900 dark:text-[#E0E0E0]">{vacuna.mascota?.nombre || 'Sin mascota'}</p>
                <p className="text-sm text-gray-500 dark:text-[#909090]">{vacuna.vacuna}</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><p className="text-xs text-gray-500 dark:text-[#909090] font-medium">Fecha Aplicación</p><p className="text-sm font-semibold text-gray-900 dark:text-[#E0E0E0]">{formatDate(vacuna.fechaAplicacion)}</p></div>
            <div><p className="text-xs text-gray-500 dark:text-[#909090] font-medium">Próxima Dosis</p><p className="text-sm font-semibold text-gray-900 dark:text-[#E0E0E0]">{formatDate(vacuna.proximaDosis)}</p></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><p className="text-xs text-gray-500 dark:text-[#909090] font-medium">Lote</p><p className="text-sm font-semibold text-gray-900 dark:text-[#E0E0E0]">{vacuna.lote || '—'}</p></div>
            <div><p className="text-xs text-gray-500 dark:text-[#909090] font-medium">Laboratorio</p><p className="text-sm font-semibold text-gray-900 dark:text-[#E0E0E0]">{vacuna.laboratorio || '—'}</p></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><p className="text-xs text-gray-500 dark:text-[#909090] font-medium">Aplicada por</p><p className="text-sm font-semibold text-gray-900 dark:text-[#E0E0E0]">{vacuna.aplicadaPor || '—'}</p></div>
            <div><p className="text-xs text-gray-500 dark:text-[#909090] font-medium">Estado</p><span className={'inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ' + (estadoClass[vacuna.estado] || 'bg-gray-100 text-gray-700')}>{vacuna.estado}</span></div>
          </div>
        </div>
        <div className="p-6 pt-0">
          <button onClick={onClose} className="w-full py-2.5 border border-gray-300 dark:border-[#404040] rounded-xl text-sm font-medium text-gray-700 dark:text-[#D0D0D0] hover:bg-gray-50 dark:hover:bg-[#2C2C2C] transition-colors cursor-pointer">Cerrar</button>
        </div>
      </div>
    </div>
  );
}

function ModalFiltroAvanzado({ open, onClose, filtrosActuales, onAplicar }) {
  var [desde, setDesde] = useState(filtrosActuales.fechaDesde || '');
  var [hasta, setHasta] = useState(filtrosActuales.fechaHasta || '');
  var [tipoVacuna, setTipoVacuna] = useState(filtrosActuales.tipoVacuna || 'Todos');
  var [estado, setEstado] = useState(filtrosActuales.estado || 'Todos');

  useEffect(function () {
    setDesde(filtrosActuales.fechaDesde || '');
    setHasta(filtrosActuales.fechaHasta || '');
    setTipoVacuna(filtrosActuales.tipoVacuna || 'Todos');
    setEstado(filtrosActuales.estado || 'Todos');
  }, [filtrosActuales]);

  if (!open) return null;

  function handleAplicar() {
    onAplicar({ fechaDesde: desde, fechaHasta: hasta, tipoVacuna, estado });
    onClose();
  }

  function handleLimpiar() {
    setDesde(''); setHasta(''); setTipoVacuna('Todos'); setEstado('Todos');
    onAplicar({ fechaDesde: '', fechaHasta: '', tipoVacuna: 'Todos', estado: 'Todos' });
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
            <label className={labelClass}>Tipo de Vacuna</label>
            <select value={tipoVacuna} onChange={function (e) { setTipoVacuna(e.target.value); }} className={selectClass}>
              <option value="Todos">Todos</option>
              <option value="Rabia">Rabia</option>
              <option value="Triple Felina">Triple Felina</option>
              <option value="Sextuple">Séxtuple</option>
              <option value="Octuple">Óctuple</option>
              <option value="Parvovirosis">Parvovirosis</option>
              <option value="Moquillo">Moquillo</option>
              <option value="Hepatitis">Hepatitis</option>
              <option value="Leucemia Felina">Leucemia Felina</option>
              <option value="Bordetella">Bordetella</option>
              <option value="Coronavirus">Coronavirus</option>
              <option value="Giardia">Giardia</option>
              <option value="Otra">Otra</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Estado</label>
            <select value={estado} onChange={function (e) { setEstado(e.target.value); }} className={selectClass}>
              <option value="Todos">Todos</option>
              <option value="Aplicada">Aplicada</option>
              <option value="Pendiente">Pendiente</option>
              <option value="Próxima a Vencer">Próxima a Vencer</option>
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

function ModalEditarVacuna({ vacuna, form, setForm, onClose, onGuardar }) {
  var inputClass = "w-full px-4 py-2.5 border border-gray-300 dark:border-[#404040] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5F7B65] focus:border-[#5F7B65] bg-white dark:bg-[#2C2C2C] text-gray-900 dark:text-[#E0E0E0]";
  var labelClass = "block text-sm font-medium text-gray-700 dark:text-[#D0D0D0] mb-1.5";
  var selectClass = "w-full px-4 py-2.5 border border-gray-300 dark:border-[#404040] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5F7B65] bg-white dark:bg-[#2C2C2C] text-gray-700 dark:text-[#D0D0D0] cursor-pointer";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl shadow-2xl w-full max-w-lg mx-4" onClick={function (e) { e.stopPropagation(); }}>
        <div className="flex items-center justify-between p-6 pb-0">
          <h2 className="text-xl font-bold text-gray-900 dark:text-[#E0E0E0]">Editar Vacuna</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#333] text-gray-400 dark:text-[#808080] hover:text-gray-600 transition-colors cursor-pointer">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-[#5F7B65] flex items-center justify-center text-white text-sm font-bold shrink-0">{(vacuna.mascota?.nombre || '?')[0]}</div>
            <div>
              <p className="font-bold text-gray-900 dark:text-[#E0E0E0]">{vacuna.mascota?.nombre || 'Sin mascota'}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Vacuna</label>
              <select value={form.vacuna} onChange={function (e) { setForm(Object.assign({}, form, { vacuna: e.target.value })); }} className={selectClass}>
                <option value="Rabia">Rabia</option>
                <option value="Triple Felina">Triple Felina</option>
                <option value="Sextuple">Séxtuple</option>
                <option value="Octuple">Óctuple</option>
                <option value="Parvovirosis">Parvovirosis</option>
                <option value="Moquillo">Moquillo</option>
                <option value="Hepatitis">Hepatitis</option>
                <option value="Leucemia Felina">Leucemia Felina</option>
                <option value="Bordetella">Bordetella</option>
                <option value="Coronavirus">Coronavirus</option>
                <option value="Giardia">Giardia</option>
                <option value="Otra">Otra</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Lote</label>
              <input type="text" value={form.lote} onChange={function (e) { setForm(Object.assign({}, form, { lote: e.target.value })); }} className={inputClass} placeholder="Lote" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <MaterialDatePicker value={form.fechaAplicacion} onChange={function (val) { setForm(Object.assign({}, form, { fechaAplicacion: val })); }} label="Fecha Aplicación" placeholder="DD/MM/YYYY" />
            </div>
            <div>
              <MaterialDatePicker value={form.proximaDosis} onChange={function (val) { setForm(Object.assign({}, form, { proximaDosis: val })); }} label="Próxima Dosis" placeholder="DD/MM/YYYY" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Aplicada por</label>
              <input type="text" value={form.aplicadaPor} onChange={function (e) { setForm(Object.assign({}, form, { aplicadaPor: e.target.value })); }} className={inputClass} placeholder="Nombre del veterinario" />
            </div>
            <div>
              <label className={labelClass}>Estado</label>
              <select value={form.estado} onChange={function (e) { setForm(Object.assign({}, form, { estado: e.target.value })); }} className={selectClass}>
                <option value="Aplicada">Aplicada</option>
                <option value="Pendiente">Pendiente</option>
                <option value="Próxima a Vencer">Próxima a Vencer</option>
              </select>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 p-6 pt-0">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl border border-gray-300 dark:border-[#404040] text-sm font-medium text-gray-700 dark:text-[#D0D0D0] hover:bg-gray-50 dark:hover:bg-[#2C2C2C] transition-colors cursor-pointer">Cancelar</button>
          <button onClick={onGuardar} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white shadow-sm transition-colors cursor-pointer" style={{ backgroundColor: '#5F7B65' }}>Guardar Cambios</button>
        </div>
      </div>
    </div>
  );
}

function ModalEliminarVacuna({ vacuna, onClose, onConfirmar }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl shadow-2xl w-full max-w-md mx-4" onClick={function (e) { e.stopPropagation(); }}>
        <div className="p-6">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" /></svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-[#E0E0E0] text-center mb-2">Eliminar Vacuna</h2>
          <p className="text-sm text-gray-500 dark:text-[#909090] text-center mb-6">
            ¿Estás seguro de eliminar la vacuna <strong>{vacuna.vacuna}</strong> de <strong>{vacuna.mascota?.nombre || 'Sin mascota'}</strong>? Esta acción no se puede deshacer.
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

function ModalDetalleEsquema({ esquema, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl shadow-2xl w-full max-w-md mx-4" onClick={function (e) { e.stopPropagation(); }}>
        <div className="flex items-center justify-between p-6 pb-0">
          <h2 className="text-xl font-bold text-gray-900 dark:text-[#E0E0E0]">Detalle del Esquema</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#333] text-gray-400 dark:text-[#808080] hover:text-gray-600 transition-colors cursor-pointer">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div className="bg-gray-50 dark:bg-[#2C2C2C] rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#5F7B65] flex items-center justify-center text-white text-sm font-bold shrink-0">{esquema.especie[0]}</div>
              <div>
                <p className="font-bold text-gray-900 dark:text-[#E0E0E0]">{esquema.especie}</p>
                <p className="text-sm text-gray-500 dark:text-[#909090]">{esquema.id}</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><p className="text-xs text-gray-500 dark:text-[#909090] font-medium">Edad</p><p className="text-sm font-semibold text-gray-900 dark:text-[#E0E0E0]">{esquema.edad}</p></div>
            <div><p className="text-xs text-gray-500 dark:text-[#909090] font-medium">Vacuna</p><p className="text-sm font-semibold text-gray-900 dark:text-[#E0E0E0]">{esquema.vacuna}</p></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><p className="text-xs text-gray-500 dark:text-[#909090] font-medium">Dosis</p><p className="text-sm font-semibold text-gray-900 dark:text-[#E0E0E0]">{esquema.dosis}</p></div>
            <div><p className="text-xs text-gray-500 dark:text-[#909090] font-medium">Refuerzo</p><span className={'inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ' + (esquema.refuerzo === 'No' ? 'bg-gray-100 text-gray-600 dark:bg-[#2C2C2C] dark:text-[#A0A0A0]' : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300')}>{esquema.refuerzo}</span></div>
          </div>
        </div>
        <div className="p-6 pt-0">
          <button onClick={onClose} className="w-full py-2.5 border border-gray-300 dark:border-[#404040] rounded-xl text-sm font-medium text-gray-700 dark:text-[#D0D0D0] hover:bg-gray-50 dark:hover:bg-[#2C2C2C] transition-colors cursor-pointer">Cerrar</button>
        </div>
      </div>
    </div>
  );
}

function ModalEditarEsquema({ esquema, onClose, onGuardar }) {
  var [form, setForm] = useState({ ...esquema });
  var inputClass = "w-full px-4 py-2.5 border border-gray-300 dark:border-[#404040] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5F7B65] focus:border-[#5F7B65] bg-white dark:bg-[#2C2C2C] text-gray-900 dark:text-[#E0E0E0]";
  var labelClass = "block text-sm font-medium text-gray-700 dark:text-[#D0D0D0] mb-1.5";
  var selectClass = "w-full px-4 py-2.5 border border-gray-300 dark:border-[#404040] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5F7B65] bg-white dark:bg-[#2C2C2C] text-gray-700 dark:text-[#D0D0D0] cursor-pointer";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl shadow-2xl w-full max-w-lg mx-4" onClick={function (e) { e.stopPropagation(); }}>
        <div className="flex items-center justify-between p-6 pb-0">
          <h2 className="text-xl font-bold text-gray-900 dark:text-[#E0E0E0]">Editar Esquema</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#333] text-gray-400 dark:text-[#808080] hover:text-gray-600 transition-colors cursor-pointer">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Especie</label>
              <select value={form.especie} onChange={function (e) { setForm(Object.assign({}, form, { especie: e.target.value })); }} className={selectClass}>
                <option>Perro</option><option>Gato</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Edad</label>
              <input type="text" value={form.edad} onChange={function (e) { setForm(Object.assign({}, form, { edad: e.target.value })); }} className={inputClass} placeholder="Ej: 6-8 semanas" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Vacuna</label>
              <input type="text" value={form.vacuna} onChange={function (e) { setForm(Object.assign({}, form, { vacuna: e.target.value })); }} className={inputClass} placeholder="Nombre de la vacuna" />
            </div>
            <div>
              <label className={labelClass}>Dosis</label>
              <input type="text" value={form.dosis} onChange={function (e) { setForm(Object.assign({}, form, { dosis: e.target.value })); }} className={inputClass} placeholder="Ej: 1ml" />
            </div>
          </div>
          <div>
            <label className={labelClass}>Refuerzo</label>
            <select value={form.refuerzo} onChange={function (e) { setForm(Object.assign({}, form, { refuerzo: e.target.value })); }} className={selectClass}>
              <option>Sí</option><option>No</option><option>Anual</option>
            </select>
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 p-6 pt-0">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl border border-gray-300 dark:border-[#404040] text-sm font-medium text-gray-700 dark:text-[#D0D0D0] hover:bg-gray-50 dark:hover:bg-[#2C2C2C] transition-colors cursor-pointer">Cancelar</button>
          <button onClick={function () { onGuardar(esquema.id, form); onClose(); }} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white shadow-sm transition-colors cursor-pointer" style={{ backgroundColor: '#5F7B65' }}>Guardar Cambios</button>
        </div>
      </div>
    </div>
  );
}

function ModalEliminarEsquema({ esquema, onClose, onConfirmar }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl shadow-2xl w-full max-w-md mx-4" onClick={function (e) { e.stopPropagation(); }}>
        <div className="p-6">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" /></svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-[#E0E0E0] text-center mb-2">Eliminar Esquema</h2>
          <p className="text-sm text-gray-500 dark:text-[#909090] text-center mb-6">
            ¿Estás seguro de eliminar el esquema <strong>{esquema.vacuna}</strong> para <strong>{esquema.especie}</strong>? Esta acción no se puede deshacer.
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

function Vacunacion() {
  const navigate = useNavigate();
  const [vacunas, setVacunas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Registro de Vacunas');
  const [search, setSearch] = useState('');
  const [filterEstado, setFilterEstado] = useState('');
  const [page, setPage] = useState(1);
  const [showModalFiltro, setShowModalFiltro] = useState(false);
  const [filtrosAvanzados, setFiltrosAvanzados] = useState({ fechaDesde: '', fechaHasta: '', tipoVacuna: 'Todos', estado: 'Todos' });
  const [showModalDetalle, setShowModalDetalle] = useState(null);
  const [editVacuna, setEditVacuna] = useState(null);
  const [deleteVacuna, setDeleteVacuna] = useState(null);
  const [formEdit, setFormEdit] = useState({ vacuna: '', lote: '', fechaAplicacion: '', proximaDosis: '', aplicadaPor: '', estado: 'Aplicada' });
  const [esquemas, setEsquemas] = useState(ESQUEMAS_MOCK);
  const [esquemaSearch, setEsquemaSearch] = useState('');
  const [esquemaFiltroEspecie, setEsquemaFiltroEspecie] = useState('Todos');
  const [esquemaDetalle, setEsquemaDetalle] = useState(null);
  const [esquemaEditar, setEsquemaEditar] = useState(null);
  const [esquemaEliminar, setEsquemaEliminar] = useState(null);

  function cargarVacunas() {
    API.get('/vacunas').then(function (res) { setVacunas(res.data); setLoading(false); }).catch(function () { setLoading(false); });
  }

  useEffect(function () { cargarVacunas(); }, []);

  var filtered = vacunas.filter(function (v) {
    var q = search.toLowerCase();
    var matchSearch = !q || (v.mascota?.nombre || '').toLowerCase().includes(q) || (v.vacuna || '').toLowerCase().includes(q) || (v.lote || '').toLowerCase().includes(q);
    var matchEstado = !filterEstado || v.estado === filterEstado;
    var matchFechaDesde = !filtrosAvanzados.fechaDesde || (v.fechaAplicacion && v.fechaAplicacion >= filtrosAvanzados.fechaDesde);
    var matchFechaHasta = !filtrosAvanzados.fechaHasta || (v.fechaAplicacion && v.fechaAplicacion <= filtrosAvanzados.fechaHasta);
    var matchTipoVacuna = filtrosAvanzados.tipoVacuna === 'Todos' || v.vacuna === filtrosAvanzados.tipoVacuna;
    var matchFiltroEstado = filtrosAvanzados.estado === 'Todos' || v.estado === filtrosAvanzados.estado;
    return matchSearch && matchEstado && matchFechaDesde && matchFechaHasta && matchTipoVacuna && matchFiltroEstado;
  });

  useEffect(function () { setPage(1); }, [search, filterEstado, filtrosAvanzados]);

  var totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE) || 1;
  var paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  function handleGuardarEdicion() {
    API.put('/vacunas/' + editVacuna.id, formEdit).then(function () {
      cargarVacunas();
      setEditVacuna(null);
    }).catch(function () {
      alert('Error al actualizar la vacuna');
    });
  }

  function handleEliminar() {
    API.delete('/vacunas/' + deleteVacuna.id).then(function () {
      cargarVacunas();
      setDeleteVacuna(null);
    }).catch(function () {
      alert('Error al eliminar la vacuna');
    });
  }

  function handleGuardarEsquema(id, form) {
    setEsquemas(esquemas.map(function (e) { return e.id === id ? Object.assign({}, e, form) : e; }));
  }

  function handleEliminarEsquema() {
    setEsquemas(esquemas.filter(function (e) { return e.id !== esquemaEliminar.id; }));
    setEsquemaEliminar(null);
  }

  var esquemasFiltrados = esquemas.filter(function (e) {
    var q = esquemaSearch.toLowerCase();
    var matchSearch = !q || e.especie.toLowerCase().includes(q) || e.vacuna.toLowerCase().includes(q);
    var matchEspecie = esquemaFiltroEspecie === 'Todos' || e.especie === esquemaFiltroEspecie;
    return matchSearch && matchEspecie;
  });

  function exportarEsquemasExcel() {
    var datos = esquemasFiltrados.map(function (e) {
      return { 'ID': e.id, 'Especie': e.especie, 'Edad': e.edad, 'Vacuna': e.vacuna, 'Dosis': e.dosis, 'Refuerzo': e.refuerzo };
    });
    var wb = XLSX.utils.book_new();
    var ws = XLSX.utils.json_to_sheet(datos);
    XLSX.utils.book_append_sheet(wb, ws, 'Esquemas');
    var fecha = new Date().toISOString().split('T')[0];
    XLSX.writeFile(wb, 'Esquemas_Vacunacion_' + fecha + '.xlsx');
  }

  function exportarExcel() {
    var datos = filtered.map(function (v) {
      return {
        'Fecha': formatDate(v.fechaAplicacion),
        'Mascota': v.mascota?.nombre || '',
        'Vacuna': v.vacuna || '',
        'Lote': v.lote || '',
        'Próxima Dosis': formatDate(v.proximaDosis),
        'Aplicada Por': v.aplicadaPor || '',
        'Estado': v.estado || '',
      };
    });
    var wb = XLSX.utils.book_new();
    var ws = XLSX.utils.json_to_sheet(datos);
    XLSX.utils.book_append_sheet(wb, ws, 'Vacunas');
    var fecha = new Date().toISOString().split('T')[0];
    XLSX.writeFile(wb, 'Vacunas_' + fecha + '.xlsx');
  }

  var totalAplicadas = vacunas.filter(function (v) { return v.estado === 'Aplicada'; }).length;
  var totalProximas = vacunas.filter(function (v) { return v.estado === 'Próxima a Vencer'; }).length;
  var totalPendientes = vacunas.filter(function (v) { return v.estado === 'Pendiente'; }).length;

  var donutData = [
    { name: 'Completos', value: totalAplicadas },
    { name: 'En Proceso', value: totalProximas },
    { name: 'Pendientes', value: totalPendientes },
  ].filter(function (d) { return d.value > 0; });
  if (donutData.length === 0) donutData.push({ name: 'Sin datos', value: 1 });

  const kpis = [
    { label: 'Total Aplicadas', value: totalAplicadas, icon: <svg className="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>, bg: 'bg-emerald-50' },
    { label: 'Próximas a Vencer', value: totalProximas, icon: <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>, bg: 'bg-blue-50' },
    { label: 'Pendientes', value: totalPendientes, icon: <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" /></svg>, bg: 'bg-orange-50' },
    { label: 'Esquemas Completos', value: totalAplicadas, icon: <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" /></svg>, bg: 'bg-purple-50' },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-none space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-[#E0E0E0]">Vacunación</h1>
            <p className="text-sm text-gray-500 dark:text-[#909090] mt-0.5">Control de vacunación de mascotas</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => navigate('/vacunacion/nueva')} className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors cursor-pointer" style={{ backgroundColor: '#5F7B65' }}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
              Nueva Vacuna
            </button>
            {activeTab === 'Esquemas de Vacunación' && (
              <button onClick={function () { /* TODO: navegar a crear esquema */ }} className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors cursor-pointer" style={{ backgroundColor: '#5F7B65' }}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                Nuevo Esquema
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-5">
          {kpis.map(function (k, i) {
            return (
              <div key={i} className="bg-white dark:bg-[#1E1E1E] rounded-xl shadow-sm border border-gray-100 dark:border-[#333] p-5 flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-gray-800 dark:text-[#E0E0E0]">{k.value}</p>
                  <p className="text-sm text-gray-500 dark:text-[#909090] mt-1">{k.label}</p>
                </div>
                <div className={'p-3 rounded-lg ' + k.bg}>{k.icon}</div>
              </div>
            );
          })}
        </div>

        <div className="border-b border-gray-200 dark:border-[#333]">
          <div className="flex gap-6">
            {tabs.map(function (tab) {
              return (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={'pb-3 text-sm font-medium transition-colors border-b-2 cursor-pointer ' + (activeTab === tab ? 'text-[#5F7B65] border-[#5F7B65]' : 'text-gray-500 dark:text-[#909090] border-transparent hover:text-gray-700 dark:hover:text-[#D0D0D0] hover:border-gray-300 dark:hover:border-[#404040]')}>
                  {tab}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {activeTab === 'Registro de Vacunas' && (
        <div className="flex-1 flex gap-6 mt-6 min-h-0">
          <div className="flex-1 flex flex-col min-h-0 space-y-4">
            <div className="flex-none bg-white dark:bg-[#1E1E1E] rounded-xl shadow-sm border border-gray-100 dark:border-[#333] p-4">
              <div className="flex items-center gap-3">
                <div className="relative flex-1">
                  <svg className="w-5 h-5 text-gray-400 dark:text-[#808080] absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                  </svg>
                  <input type="text" placeholder="Buscar por mascota, vacuna, lote..." value={search} onChange={function (e) { setSearch(e.target.value); }}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-[#404040] rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#5F7B65] focus:border-transparent transition-all bg-white dark:bg-[#2C2C2C] text-gray-900 dark:text-[#E0E0E0]" />
                </div>
                <select value={filterEstado} onChange={function (e) { setFilterEstado(e.target.value); }}
                  className="px-4 py-2.5 border border-gray-300 dark:border-[#404040] rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#5F7B65] focus:border-transparent bg-white dark:bg-[#2C2C2C] text-gray-700 dark:text-[#D0D0D0] cursor-pointer">
                  <option value="">Estado: Todos</option>
                  <option value="Aplicada">Aplicada</option>
                  <option value="Próxima a Vencer">Próxima a Vencer</option>
                  <option value="Pendiente">Pendiente</option>
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
              {loading ? (
                <div className="p-8 text-center text-gray-400 dark:text-[#808080]">Cargando vacunas...</div>
              ) : paginated.length === 0 ? (
                <div className="p-8 text-center text-gray-400 dark:text-[#808080]">No se encontraron vacunas.</div>
              ) : (
                <>
                  <div className="flex-1 overflow-auto min-h-0">
                    <table className="w-full">
                      <thead>
                        <tr className="text-gray-500 dark:text-[#909090] text-xs uppercase tracking-wider bg-gray-50 dark:bg-[#2C2C2C]">
                          <th className="text-left py-4 px-5 font-semibold">Fecha</th>
                          <th className="text-left py-4 px-5 font-semibold">Mascota</th>
                          <th className="text-left py-4 px-5 font-semibold">Vacuna</th>
                          <th className="text-left py-4 px-5 font-semibold">Lote</th>
                          <th className="text-left py-4 px-5 font-semibold">Próxima Dosis</th>
                          <th className="text-left py-4 px-5 font-semibold">Aplicada por</th>
                          <th className="text-center py-4 px-5 font-semibold">Estado</th>
                          <th className="text-center py-4 px-5 font-semibold">Acciones</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-[#333]">
                        {paginated.map(function (v) {
                          return (
                            <tr key={v.id} className="hover:bg-emerald-600/40 dark:hover:bg-emerald-900/20 transition-colors">
                              <td className="py-4 px-5 text-sm text-gray-800 dark:text-[#E0E0E0]">{formatDate(v.fechaAplicacion)}</td>
                              <td className="py-4 px-5">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-full bg-[#5F7B65] flex items-center justify-center text-white text-xs font-bold shrink-0">{(v.mascota?.nombre || '?')[0]}</div>
                                  <span className="text-sm font-medium text-gray-900 dark:text-[#E0E0E0]">{v.mascota?.nombre || 'Sin mascota'}</span>
                                </div>
                              </td>
                              <td className="py-4 px-5 text-sm text-gray-600 dark:text-[#A0A0A0]">{v.vacuna}</td>
                              <td className="py-4 px-5 text-sm text-gray-600 dark:text-[#A0A0A0]">{v.lote || '—'}</td>
                              <td className="py-4 px-5 text-sm text-gray-600 dark:text-[#A0A0A0]">{formatDate(v.proximaDosis)}</td>
                              <td className="py-4 px-5 text-sm text-gray-600 dark:text-[#A0A0A0]">{v.aplicadaPor || '—'}</td>
                              <td className="py-4 px-5 text-center">
                                <span className={'inline-block px-3 py-1 rounded-full text-xs font-semibold ' + (estadoClass[v.estado] || 'bg-gray-100 text-gray-700 dark:bg-[#2C2C2C] dark:text-[#D0D0D0]')}>{v.estado}</span>
                              </td>
                              <td className="py-4 px-5 text-center">
                                <div className="flex items-center justify-center gap-1">
                                  <button onClick={function () { setShowModalDetalle(v); }} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-500 hover:text-blue-700 transition-colors cursor-pointer" title="Ver">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>
                                  </button>
                                  <button onClick={function () { setEditVacuna(v); setFormEdit({ vacuna: v.vacuna || '', lote: v.lote || '', fechaAplicacion: v.fechaAplicacion || '', proximaDosis: v.proximaDosis || '', aplicadaPor: v.aplicadaPor || '', estado: v.estado || 'Aplicada' }); }} className="p-1.5 rounded-lg hover:bg-amber-50 text-amber-500 hover:text-amber-700 transition-colors cursor-pointer" title="Editar">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" /></svg>
                                  </button>
                                  <button onClick={function () { setDeleteVacuna(v); }} className="p-1.5 rounded-lg hover:bg-red-50 text-red-400 hover:text-red-600 transition-colors cursor-pointer" title="Eliminar">
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

          <div className="w-80 shrink-0 space-y-4">
            <div className="bg-white dark:bg-[#1E1E1E] rounded-xl shadow-sm border border-gray-100 dark:border-[#333] p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-gray-800 dark:text-[#E0E0E0]">Próximas Vacunas por Vencer</h4>
                <button className="text-xs text-[#5F7B65] font-medium hover:text-[#4E6553] transition-colors cursor-pointer bg-transparent border-none">Ver todas</button>
              </div>
              <div className="space-y-3">
                {PROXIMAS_VACUNAS.map(function (v) {
                  return (
                    <div key={v.id} className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#5F7B65] flex items-center justify-center text-white text-xs font-bold shrink-0">{v.inicial}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 dark:text-[#E0E0E0]">{v.mascota}</p>
                        <p className="text-xs text-gray-500 dark:text-[#909090]">{v.vacuna} · {v.fecha}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white dark:bg-[#1E1E1E] rounded-xl shadow-sm border border-gray-100 dark:border-[#333] p-5 space-y-4">
              <h4 className="text-sm font-bold text-gray-800 dark:text-[#E0E0E0]">Esquemas de Vacunación</h4>
              <div className="flex items-center justify-center">
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={donutData} cx="50%" cy="50%" innerRadius={60} outerRadius={85} paddingAngle={3} dataKey="value">
                      {donutData.map(function (entry, i) { return <Cell key={i} fill={DONUT_COLORS[i % DONUT_COLORS.length]} />; })}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2">
                {donutData.map(function (d, i) {
                  var total = donutData.reduce(function (sum, item) { return sum + item.value; }, 0);
                  var pct = total > 0 ? Math.round((d.value / total) * 100) : 0;
                  return (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full inline-block" style={{ backgroundColor: DONUT_COLORS[i] }} />
                        <span className="text-gray-600 dark:text-[#A0A0A0]">{d.name}</span>
                      </div>
                      <span className="font-semibold text-gray-800 dark:text-[#E0E0E0]">{pct}%</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                </svg>
                <div>
                  <p className="text-sm font-semibold text-emerald-800 mb-1">Mantén las vacunas al día</p>
                  <p className="text-xs text-emerald-700 leading-relaxed">Revisa periódicamente el calendario de vacunación de tus pacientes para evitar retrasos en las dosis.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'Esquemas de Vacunación' && (
        <div className="flex-1 flex flex-col mt-6 min-h-0 gap-4">
          <div className="flex-none bg-white dark:bg-[#1E1E1E] rounded-xl shadow-sm border border-gray-100 dark:border-[#333] p-4">
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <svg className="w-5 h-5 text-gray-400 dark:text-[#808080] absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
                <input type="text" placeholder="Buscar por especie o vacuna..." value={esquemaSearch} onChange={function (e) { setEsquemaSearch(e.target.value); }}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-[#404040] rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#5F7B65] focus:border-transparent transition-all bg-white dark:bg-[#2C2C2C] text-gray-900 dark:text-[#E0E0E0]" />
              </div>
              <select value={esquemaFiltroEspecie} onChange={function (e) { setEsquemaFiltroEspecie(e.target.value); }}
                className="px-4 py-2.5 border border-gray-300 dark:border-[#404040] rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#5F7B65] focus:border-transparent bg-white dark:bg-[#2C2C2C] text-gray-700 dark:text-[#D0D0D0] cursor-pointer">
                <option value="Todos">Especie: Todas</option>
                <option value="Perro">Perro</option>
                <option value="Gato">Gato</option>
              </select>
              <button onClick={exportarEsquemasExcel} className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 dark:border-[#404040] rounded-lg text-sm font-medium text-gray-700 dark:text-[#D0D0D0] hover:bg-gray-50 dark:hover:bg-[#2C2C2C] transition-colors cursor-pointer">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
                Exportar
              </button>
            </div>
          </div>

          <div className="flex-1 flex flex-col min-h-0 bg-white dark:bg-[#1E1E1E] rounded-xl shadow-sm border border-gray-100 dark:border-[#333] overflow-hidden">
            <div className="flex-1 overflow-auto min-h-0">
              <table className="w-full">
                <thead>
                  <tr className="text-gray-500 dark:text-[#909090] text-xs uppercase tracking-wider bg-gray-50 dark:bg-[#2C2C2C]">
                    <th className="text-left py-4 px-5 font-semibold">ID</th>
                    <th className="text-left py-4 px-5 font-semibold">Especie</th>
                    <th className="text-left py-4 px-5 font-semibold">Edad</th>
                    <th className="text-left py-4 px-5 font-semibold">Vacuna</th>
                    <th className="text-left py-4 px-5 font-semibold">Dosis</th>
                    <th className="text-left py-4 px-5 font-semibold">Refuerzo</th>
                    <th className="text-center py-4 px-5 font-semibold">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-[#333]">
                  {esquemasFiltrados.map(function (e) {
                    return (
                      <tr key={e.id} className="hover:bg-emerald-600/40 dark:hover:bg-emerald-900/20 transition-colors">
                        <td className="py-4 px-5 text-sm font-medium text-gray-800 dark:text-[#E0E0E0]">{e.id}</td>
                        <td className="py-4 px-5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-[#5F7B65] flex items-center justify-center text-white text-xs font-bold shrink-0">{e.especie[0]}</div>
                            <span className="text-sm font-medium text-gray-900 dark:text-[#E0E0E0]">{e.especie}</span>
                          </div>
                        </td>
                        <td className="py-4 px-5 text-sm text-gray-600 dark:text-[#A0A0A0]">{e.edad}</td>
                        <td className="py-4 px-5 text-sm text-gray-600 dark:text-[#A0A0A0]">{e.vacuna}</td>
                        <td className="py-4 px-5 text-sm text-gray-600 dark:text-[#A0A0A0]">{e.dosis}</td>
                        <td className="py-4 px-5">
                          <span className={'inline-block px-3 py-1 rounded-full text-xs font-semibold ' + (e.refuerzo === 'No' ? 'bg-gray-100 text-gray-600 dark:bg-[#2C2C2C] dark:text-[#A0A0A0]' : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300')}>{e.refuerzo}</span>
                        </td>
                        <td className="py-4 px-5 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button onClick={function () { setEsquemaDetalle(e); }} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-500 hover:text-blue-700 transition-colors cursor-pointer" title="Ver">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>
                            </button>
                            <button onClick={function () { setEsquemaEditar(e); }} className="p-1.5 rounded-lg hover:bg-amber-50 text-amber-500 hover:text-amber-700 transition-colors cursor-pointer" title="Editar">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" /></svg>
                            </button>
                            <button onClick={function () { setEsquemaEliminar(e); }} className="p-1.5 rounded-lg hover:bg-red-50 text-red-400 hover:text-red-600 transition-colors cursor-pointer" title="Eliminar">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {esquemasFiltrados.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-sm text-gray-400 dark:text-[#808080]">No se encontraron esquemas.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="flex-none flex items-center justify-between px-5 py-4 border-t border-gray-100 dark:border-[#333]">
              <p className="text-sm text-gray-500 dark:text-[#909090]">{esquemasFiltrados.length} esquema(s) registrado(s)</p>
            </div>
          </div>

          {esquemaDetalle && <ModalDetalleEsquema esquema={esquemaDetalle} onClose={function () { setEsquemaDetalle(null); }} />}
          {esquemaEditar && <ModalEditarEsquema esquema={esquemaEditar} onClose={function () { setEsquemaEditar(null); }} onGuardar={handleGuardarEsquema} />}
          {esquemaEliminar && <ModalEliminarEsquema esquema={esquemaEliminar} onClose={function () { setEsquemaEliminar(null); }} onConfirmar={handleEliminarEsquema} />}
        </div>
      )}

      {showModalDetalle && <ModalDetalles vacuna={showModalDetalle} onClose={function () { setShowModalDetalle(null); }} />}
      {editVacuna && <ModalEditarVacuna vacuna={editVacuna} form={formEdit} setForm={setFormEdit} onClose={function () { setEditVacuna(null); }} onGuardar={handleGuardarEdicion} />}
      {deleteVacuna && <ModalEliminarVacuna vacuna={deleteVacuna} onClose={function () { setDeleteVacuna(null); }} onConfirmar={handleEliminar} />}
      <ModalFiltroAvanzado open={showModalFiltro} onClose={function () { setShowModalFiltro(false); }} filtrosActuales={filtrosAvanzados} onAplicar={setFiltrosAvanzados} />
    </div>
  );
}

export default Vacunacion;
