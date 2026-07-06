import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import API from '../services/axiosConfig';
import MaterialDatePicker from '../components/MaterialDatePicker';

var PRIMARY = '#5F7B65';

const tipoColores = {
  'Consulta General': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  'Vacunación': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  'Desparasitación': 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300',
  'Control / Revisión': 'bg-orange-50 text-orange-600 dark:bg-orange-900/30 dark:text-orange-300',
};

const actividadReciente = [
  { id: 1, texto: 'Se creó una nueva cita para Max', hora: 'Hace 5 min', color: 'bg-blue-500', icono: 'calendar' },
  { id: 2, texto: 'Se registró la venta F-000129', hora: 'Hace 12 min', color: 'bg-green-500', icono: 'dollar' },
  { id: 3, texto: 'Se actualizó el stock de Doxivet', hora: 'Hace 30 min', color: 'bg-orange-500', icono: 'box' },
  { id: 4, texto: 'Vacuna aplicada a Luna', hora: 'Hace 1 hora', color: 'bg-purple-500', icono: 'syringe' },
  { id: 5, texto: 'Nuevo paciente registrado: Simba', hora: 'Hace 2 horas', color: 'bg-teal-500', icono: 'paw' },
];

const recordatorios = [
  { id: 1, texto: 'Llamar a Juan Pérez para confirmar cita', etiqueta: 'Mañana', colorEtiqueta: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300', prioridad: 'alta' },
  { id: 2, texto: 'Revisar stock de vacunas antirrábicas', etiqueta: '3 días', colorEtiqueta: 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300', prioridad: 'media' },
  { id: 3, texto: 'Enviar recordatorios de vacunación', etiqueta: 'Pendiente', colorEtiqueta: 'bg-gray-50 dark:bg-[#2C2C2C] text-gray-500 dark:text-[#909090]', prioridad: 'baja' },
  { id: 4, texto: 'Pagar proveedor Vet Pharma', etiqueta: '5 días', colorEtiqueta: 'bg-orange-50 text-orange-600 dark:bg-orange-900/30 dark:text-orange-300', prioridad: 'media' },
  { id: 5, texto: 'Actualizar inventario de alimentos', etiqueta: 'Pendiente', colorEtiqueta: 'bg-gray-50 dark:bg-[#2C2C2C] text-gray-500 dark:text-[#909090]', prioridad: 'baja' },
];

const topMascotas = [
  { nombre: 'Max', visitas: 5, color: 'bg-blue-500' },
  { nombre: 'Luna', visitas: 4, color: 'bg-blue-400' },
  { nombre: 'Rocky', visitas: 3, color: 'bg-blue-300' },
  { nombre: 'Coco', visitas: 3, color: 'bg-blue-300' },
  { nombre: 'Simba', visitas: 2, color: 'bg-blue-200' },
];

const notificacionesMock = [
  { id: 1, mensaje: 'Stock crítico: Doxivet tiene 2 unidades', modulo: 'inventario', leida: false },
  { id: 2, mensaje: 'Nuevo cliente registrado: María López', modulo: 'clientes', leida: false },
  { id: 3, mensaje: 'Cita confirmada para Max mañana 10:00', modulo: 'agenda', leida: false },
  { id: 4, mensaje: 'Factura F-000130 está pendiente de pago', modulo: 'facturacion', leida: true },
  { id: 5, mensaje: 'Vacuna antirrábica vence en 7 días (lote V-342)', modulo: 'inventario', leida: true },
  { id: 6, mensaje: 'Recordatorio: Cumpleaños de Luna este sábado', modulo: 'mascotas', leida: false },
];

var sucursalUnica = { id: 1, nombre: 'VetCare Clínica', direccion: 'Av. Principal 123' };

var modulos = {
  inventario: '/inventario',
  clientes: '/clientes',
  agenda: '/agenda',
  facturacion: '/facturacion',
  mascotas: '/mascotas',
};

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-[#333] rounded-lg shadow-sm px-3 py-2 text-xs">
        <p className="font-semibold text-gray-700 dark:text-[#D0D0D0]">Día {label}</p>
        <p className="text-emerald-600 font-bold">S/ {Number(payload[0].value).toLocaleString('es-PE', { minimumFractionDigits: 2 })}</p>
      </div>
    );
  }
  return null;
}

function ActivityIcon({ type }) {
  var icons = {
    calendar: <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" /></svg>,
    dollar: <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>,
    box: <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0-3-3m3 3 3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" /></svg>,
    syringe: <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 0-6.23.693L5 14.5m14.8.8 1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0 1 12 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" /></svg>,
    paw: <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m7.725-9.25H5.904m7.725 0a2.25 2.25 0 0 0-2.25-2.25H5.904a2.25 2.25 0 0 0-2.25 2.25v8.25a2.25 2.25 0 0 0 2.25 2.25h2.25a2.25 2.25 0 0 0 2.25-2.25V9.75" /></svg>,
  };
  return icons[type] || icons.calendar;
}

function formatCurrency(val) {
  if (val == null || isNaN(val)) return 'S/ 0.00';
  return 'S/ ' + Number(val).toLocaleString('es-PE', { minimumFractionDigits: 2 });
}

function formatFechaDisplay(d) {
  return d.toLocaleDateString('es-PE', { day: 'numeric', month: 'long', year: 'numeric' });
}

function Dashboard() {
  var navigate = useNavigate();
  var [resumen, setResumen] = useState(null);
  var [ventas, setVentas] = useState([]);
  var [citasHoy, setCitasHoy] = useState([]);
  var [invResumen, setInvResumen] = useState([]);
  var [proxVencer, setProxVencer] = useState([]);
  var [fechaSeleccionada, setFechaSeleccionada] = useState(new Date());
  var [mostrarCalendario, setMostrarCalendario] = useState(false);
  var [mostrarNotificaciones, setMostrarNotificaciones] = useState(false);
  var [notificaciones, setNotificaciones] = useState(notificacionesMock);

  var notificacionesNoLeidas = notificaciones.filter(function (n) { return !n.leida; });

  var refCalendario = useRef(null);
  var refNotificaciones = useRef(null);

  function fetchData() {
    var params = {};
    params.fecha = fechaSeleccionada.toISOString().split('T')[0];
    params.clinica = sucursalUnica.id;

    API.get('/dashboard/resumen', { params: params }).then(function (r) { setResumen(r.data); }).catch(function () {});
    API.get('/dashboard/ventas', { params: params }).then(function (r) { setVentas(r.data); }).catch(function () {});
    API.get('/citas/hoy', { params: params }).then(function (r) { setCitasHoy(r.data); }).catch(function () {});
    API.get('/dashboard/inventario/resumen', { params: params }).then(function (r) { setInvResumen(r.data); }).catch(function () {});
    API.get('/dashboard/inventario/proximos-a-vencer', { params: params }).then(function (r) { setProxVencer(r.data); }).catch(function () {});
  }

  useEffect(function () {
    fetchData();
  }, [fechaSeleccionada]);

  useEffect(function () {
    function handleClickOutside(e) {
      if (refCalendario.current && !refCalendario.current.contains(e.target)) setMostrarCalendario(false);
      if (refNotificaciones.current && !refNotificaciones.current.contains(e.target)) setMostrarNotificaciones(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return function () { document.removeEventListener('mousedown', handleClickOutside); };
  }, []);

  function handleDateChange(d) {
    setFechaSeleccionada(d);
    setMostrarCalendario(false);
  }

  function handleNotificacionClick(n) {
    setNotificaciones(notificaciones.map(function (x) { return x.id === n.id ? Object.assign({}, x, { leida: true }) : x; }));
    setMostrarNotificaciones(false);
    if (modulos[n.modulo]) navigate(modulos[n.modulo]);
  }

  var totalVentas = ventas.reduce(function (sum, v) { return sum + (v.ventas || 0); }, 0);
  var totalProductos = invResumen.reduce(function (sum, c) { return sum + (c.valor || 0); }, 0);

  return (
    <div className="flex flex-col h-full gap-6">
      <div className="flex-none flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-[#E0E0E0]">{'\u00A1'}Bienvenido, Dr. Juan! {'\uD83D\uDC4B'}</h1>
          <p className="text-sm text-gray-500 dark:text-[#909090] mt-0.5">Aquí tienes un resumen de la actividad de tu clínica hoy.</p>
        </div>
        <div className="flex items-center gap-3 relative">
          <div className="relative" ref={refCalendario}>
            <button onClick={function () { setMostrarCalendario(!mostrarCalendario); setMostrarNotificaciones(false); setMostrarClinicas(false); }} className="flex items-center gap-2 text-sm text-gray-600 dark:text-[#A0A0A0] bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-[#333] rounded-lg px-3 py-2 hover:bg-gray-50 dark:hover:bg-[#2C2C2C] transition-colors cursor-pointer">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" /></svg>
              {formatFechaDisplay(fechaSeleccionada)}
            </button>
            {mostrarCalendario && (
              <div className="absolute right-0 top-full mt-2 z-50 bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-[#333] rounded-2xl shadow-xl p-3">
                <MaterialDatePicker value={fechaSeleccionada} onChange={handleDateChange} />
              </div>
            )}
          </div>

          <div className="relative" ref={refNotificaciones}>
            <button onClick={function () { setMostrarNotificaciones(!mostrarNotificaciones); setMostrarCalendario(false); setMostrarClinicas(false); }} className="relative p-2.5 rounded-lg border border-gray-200 dark:border-[#333] bg-white dark:bg-[#1E1E1E] hover:bg-gray-50 dark:hover:bg-[#2C2C2C] transition-colors cursor-pointer">
              <svg className="w-5 h-5 text-gray-500 dark:text-[#909090]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" /></svg>
              {notificacionesNoLeidas.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[9px] text-white flex items-center justify-center font-bold">{notificacionesNoLeidas.length}</span>
              )}
            </button>
            {mostrarNotificaciones && (
              <div className="absolute right-0 top-full mt-2 z-50 w-80 bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-[#333] rounded-2xl shadow-xl overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100 dark:border-[#333]">
                  <p className="text-sm font-bold text-gray-800 dark:text-[#E0E0E0]">Notificaciones</p>
                  <p className="text-[11px] text-gray-400 dark:text-[#808080]">{notificacionesNoLeidas.length} sin leer</p>
                </div>
                <div className="max-h-72 overflow-y-auto">
                  {notificaciones.length === 0 ? (
                    <p className="text-xs text-gray-400 dark:text-[#808080] text-center py-6">No hay notificaciones</p>
                  ) : (
                    notificaciones.map(function (n) {
                      return (
                        <button key={n.id} onClick={function () { handleNotificacionClick(n); }} className={'w-full text-left px-4 py-3 flex items-start gap-3 hover:bg-gray-50 dark:hover:bg-[#2C2C2C] transition-colors border-b border-gray-50 dark:border-[#2C2C2C] last:border-0 cursor-pointer ' + (!n.leida ? 'bg-[#5F7B65]/5 dark:bg-[#5F7B65]/10' : '')}>
                          <div className={'h-2 w-2 rounded-full mt-1.5 shrink-0 ' + (!n.leida ? 'bg-[#5F7B65]' : 'bg-transparent')} />
                          <div className="flex-1 min-w-0">
                            <p className={'text-xs leading-relaxed ' + (!n.leida ? 'font-semibold text-gray-800 dark:text-[#E0E0E0]' : 'text-gray-600 dark:text-[#909090]')}>{n.mensaje}</p>
                            <p className="text-[10px] text-gray-400 dark:text-[#808080] mt-0.5 capitalize">Módulo: {n.modulo}</p>
                          </div>
                        </button>
                      );
                    })
                  )}
                </div>
                <button onClick={function () { setNotificaciones(notificaciones.map(function (x) { return Object.assign({}, x, { leida: true }); })); }} className="w-full text-center text-xs font-semibold text-[#5F7B65] py-2.5 border-t border-gray-100 dark:border-[#333] hover:bg-gray-50 dark:hover:bg-[#2C2C2C] transition-colors cursor-pointer">Marcar todas como leídas</button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 rounded-lg border border-gray-200 dark:border-[#333] bg-white dark:bg-[#2C2C2C] px-3 py-2 text-sm text-gray-700 dark:text-[#D0D0D0] min-w-[140px] select-none">
            <div className="h-8 w-8 rounded-lg flex items-center justify-center text-xs font-bold bg-[#5F7B65] text-white shrink-0">{sucursalUnica.nombre.charAt(0)}</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800 dark:text-[#E0E0E0] truncate">{sucursalUnica.nombre}</p>
              <p className="text-[11px] text-gray-400 dark:text-[#808080] truncate">{sucursalUnica.direccion}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-4">
        <div className="bg-white dark:bg-[#1E1E1E] rounded-xl shadow-sm border border-gray-100 dark:border-[#333] p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-blue-50"><svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" /></svg></div>
          </div>
          <p className="text-2xl font-bold text-gray-800 dark:text-[#E0E0E0]">{resumen ? resumen.citasHoy : '—'}</p>
          <p className="text-sm text-gray-500 dark:text-[#909090]">Citas de Hoy</p>
          <button onClick={function () { navigate('/agenda'); }} className="text-xs text-blue-600 font-medium mt-2 hover:text-blue-600 cursor-pointer">Ver agenda {'\u2192'}</button>
        </div>

        <div className="bg-white dark:bg-[#1E1E1E] rounded-xl shadow-sm border border-gray-100 dark:border-[#333] p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-green-50"><svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" /></svg></div>
          </div>
          <p className="text-2xl font-bold text-gray-800 dark:text-[#E0E0E0]">{resumen ? resumen.pacientesAtendidos : '—'}</p>
          <p className="text-sm text-gray-500 dark:text-[#909090]">Pacientes Atendidos</p>
          <button onClick={function () { navigate('/mascotas'); }} className="text-xs text-green-600 font-medium mt-2 hover:text-green-700 cursor-pointer">Ver historial {'\u2192'}</button>
        </div>

        <div className="bg-white dark:bg-[#1E1E1E] rounded-xl shadow-sm border border-gray-100 dark:border-[#333] p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-purple-100"><svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg></div>
          </div>
          <p className="text-2xl font-bold text-gray-800 dark:text-[#E0E0E0]">{resumen ? formatCurrency(resumen.ventasDia) : '—'}</p>
          <p className="text-sm text-gray-500 dark:text-[#909090]">Ventas del Día</p>
        </div>

        <div className="bg-white dark:bg-[#1E1E1E] rounded-xl shadow-sm border border-gray-100 dark:border-[#333] p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-orange-50"><svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0-3-3m3 3 3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" /></svg></div>
          </div>
          <p className="text-2xl font-bold text-gray-800 dark:text-[#E0E0E0]">{resumen ? resumen.stockBajo : '—'}</p>
          <p className="text-sm text-gray-500 dark:text-[#909090]">Stock Bajo</p>
          <button onClick={function () { navigate('/inventario'); }} className="text-xs text-orange-600 font-medium mt-2 hover:text-orange-600 cursor-pointer">Ver inventario {'\u2192'}</button>
        </div>

        <div className="bg-white dark:bg-[#1E1E1E] rounded-xl shadow-sm border border-gray-100 dark:border-[#333] p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-red-50"><svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" /></svg></div>
          </div>
          <p className="text-2xl font-bold text-gray-800 dark:text-[#E0E0E0]">{resumen ? resumen.pendientesPago : '—'}</p>
          <p className="text-sm text-gray-500 dark:text-[#909090]">Pendientes de Pago</p>
          <button onClick={function () { navigate('/facturacion'); }} className="text-xs text-red-600 font-medium mt-2 hover:text-red-600 cursor-pointer">Ver facturación {'\u2192'}</button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl border border-gray-200 dark:border-[#333] shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-gray-800 dark:text-[#E0E0E0]">Resumen de Ventas</h3>
            <span className="text-[10px] text-gray-400 dark:text-[#808080]">Últimos 7 días</span>
          </div>
          <div className="flex items-end gap-2 mb-2">
            <p className="text-2xl font-bold text-gray-800 dark:text-[#E0E0E0]">{formatCurrency(totalVentas)}</p>
          </div>
          <p className="text-xs text-gray-400 dark:text-[#808080] mb-4">Total acumulado</p>
          {ventas.length > 0 ? (
            <ResponsiveContainer width="100%" height={160}>
              <LineChart data={ventas} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
                <XAxis dataKey="dia" tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="ventas" stroke="#10B981" strokeWidth={2} dot={{ fill: '#10B981', r: 3 }} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[160px] text-xs text-gray-400 dark:text-[#808080]">No hay datos de ventas</div>
          )}
        </div>

        <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl border border-gray-200 dark:border-[#333] shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-gray-800 dark:text-[#E0E0E0]">Citas de Hoy</h3>
            <button onClick={function () { navigate('/agenda'); }} className="text-xs text-blue-600 font-semibold hover:text-blue-600 cursor-pointer">Ver todas</button>
          </div>
          <div className="space-y-3">
            {citasHoy.length === 0 ? (
              <p className="text-xs text-gray-400 dark:text-[#808080] text-center py-4">No hay citas para hoy</p>
            ) : (
              citasHoy.slice(0, 5).map(function (c) {
                return (
                  <div key={c.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-[#2C2C2C] transition-colors">
                    <span className="text-xs font-semibold text-gray-500 dark:text-[#909090] w-16 shrink-0">{c.hora ? c.hora.substring(0, 5) : '—'}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 dark:text-[#E0E0E0]">{c.mascota ? c.mascota.nombre : '—'}</p>
                      <p className="text-[11px] text-gray-400 dark:text-[#808080]">{c.veterinario || '—'}</p>
                    </div>
                    <span className={'text-[10px] font-semibold px-2 py-0.5 rounded-full ' + (tipoColores[c.tipoCita] || 'bg-gray-50 dark:bg-[#2C2C2C] text-gray-500 dark:text-[#909090]')}>{c.tipoCita || '—'}</span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl border border-gray-200 dark:border-[#333] shadow-sm p-5">
            <h3 className="text-sm font-bold text-gray-800 dark:text-[#E0E0E0] mb-4">Inventario - Resumen</h3>
            <div className="flex items-center gap-4">
              <div className="relative" style={{ width: 120, height: 120 }}>
                <PieChart width={120} height={120}>
                  <Pie data={invResumen.length > 0 ? invResumen : [{ nombre: 'Sin datos', valor: 1, color: '#E5E7EB' }]} cx={60} cy={60} innerRadius={40} outerRadius={55} paddingAngle={2} dataKey="valor">
                    {(invResumen.length > 0 ? invResumen : [{ nombre: 'Sin datos', valor: 1, color: '#E5E7EB' }]).map(function (entry, i) { return <Cell key={i} fill={entry.color} />; })}
                  </Pie>
                </PieChart>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <p className="text-lg font-bold text-gray-800 dark:text-[#E0E0E0] leading-none">{totalProductos}</p>
                  <p className="text-[9px] text-gray-400 dark:text-[#808080]">Productos</p>
                </div>
              </div>
              <div className="space-y-1.5 flex-1">
                {(invResumen.length > 0 ? invResumen : []).map(function (d) {
                  return (
                    <div key={d.nombre} className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />{d.nombre}</span>
                      <span className="font-semibold text-gray-700 dark:text-[#D0D0D0]">{d.valor}</span>
                    </div>
                  );
                })}
                {invResumen.length === 0 && <p className="text-xs text-gray-400 dark:text-[#808080] text-center py-2">Cargando...</p>}
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl border border-gray-200 dark:border-[#333] shadow-sm p-5">
            <h3 className="text-sm font-bold text-gray-800 dark:text-[#E0E0E0] mb-3">Productos Próximos a Vencer</h3>
            <div className="space-y-2.5">
              {proxVencer.length === 0 ? (
                <p className="text-xs text-gray-400 dark:text-[#808080] text-center py-4">Sin productos próximos a vencer</p>
              ) : (
                proxVencer.slice(0, 5).map(function (p, i) {
                  var diasColor = p.dias <= 10 ? 'text-red-600' : p.dias <= 30 ? 'text-orange-600' : 'text-green-600';
                  return (
                    <div key={i} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-[#2C2C2C] transition-colors">
                      <div>
                        <p className="text-sm font-medium text-gray-800 dark:text-[#E0E0E0]">{p.nombre}</p>
                        <p className="text-[11px] text-gray-400 dark:text-[#808080]">Lote: {p.lote}</p>
                      </div>
                      <span className={'text-xs font-bold ' + diasColor}>{p.dias} días</span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 flex-1 min-h-0">
        <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl border border-gray-200 dark:border-[#333] shadow-sm p-5">
          <h3 className="text-sm font-bold text-gray-800 dark:[#E0E0E0] mb-4">Pacientes Más Atendidos</h3>
          <div className="space-y-3">
            {topMascotas.map(function (m, i) {
              var porcentaje = (m.visitas / 5) * 100;
              return (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700 dark:text-[#D0D0D0]">{i + 1}. {m.nombre}</span>
                    <span className="text-xs text-gray-500 dark:text-[#909090]">{m.visitas} visitas</span>
                  </div>
                  <div className="h-2 bg-gray-100 dark:bg-[#333] rounded-full overflow-hidden">
                    <div className={'h-full rounded-full ' + m.color} style={{ width: porcentaje + '%' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl border border-gray-200 dark:border-[#333] shadow-sm p-5">
          <h3 className="text-sm font-bold text-gray-800 dark:text-[#E0E0E0] mb-4">Actividad Reciente</h3>
          <div className="space-y-3">
            {actividadReciente.map(function (a) {
              return (
                <div key={a.id} className="flex items-start gap-3">
                  <div className={'h-7 w-7 flex items-center justify-center rounded-full text-white shrink-0 ' + a.color}>
                    <ActivityIcon type={a.icono} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-700 dark:text-[#D0D0D0]">{a.texto}</p>
                    <p className="text-[11px] text-gray-400 dark:text-[#808080]">{a.hora}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl border border-gray-200 dark:border-[#333] shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-gray-800 dark:text-[#E0E0E0]">Recordatorios y Tareas</h3>
            <button className="text-xs text-blue-600 font-semibold hover:text-blue-600 cursor-pointer">+ Nuevo</button>
          </div>
          <div className="space-y-2.5">
            {recordatorios.map(function (r) {
              return (
                <div key={r.id} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-[#2C2C2C] transition-colors border border-gray-100 dark:border-[#333]">
                  <div className={'h-4 w-4 rounded border-2 flex items-center justify-center shrink-0 ' + (r.prioridad === 'alta' ? 'border-red-400' : r.prioridad === 'media' ? 'border-yellow-400' : 'border-gray-300 dark:border-[#404040]')} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-700 dark:text-[#D0D0D0] truncate">{r.texto}</p>
                  </div>
                  <span className={'text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ' + r.colorEtiqueta}>{r.etiqueta}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
