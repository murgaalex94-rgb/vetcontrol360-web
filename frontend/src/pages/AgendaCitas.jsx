import { useState, useEffect, Fragment } from 'react';
import { useNavigate } from 'react-router-dom';

var DIAS_SEMANA = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
var MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Setiembre', 'Octubre', 'Noviembre', 'Diciembre'];
var NOMBRE_DIA = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

function getWeekDays() {
  var today = new Date();
  var dayOfWeek = today.getDay();
  var monday = new Date(today);
  monday.setDate(today.getDate() - ((dayOfWeek + 6) % 7));
  return Array.from({ length: 7 }, function (_, i) {
    var d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return { dia: d.getDate(), nombre: DIAS_SEMANA[i], mes: MESES[d.getMonth()], fecha: d };
  });
}

var HORAS = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];
var ALTURA_HORA = 64;

var citasMock = [
  { id: 1, mascota: 'Max', emoji: '🐕', fecha: 29, horaInicio: '09:00', horaFin: '09:30', tipo: 'Consulta General' },
  { id: 2, mascota: 'Luna', emoji: '🐈', fecha: 29, horaInicio: '11:00', horaFin: '11:30', tipo: 'Vacunación' },
  { id: 3, mascota: 'Simba', emoji: '🐈', fecha: 30, horaInicio: '10:00', horaFin: '10:30', tipo: 'Consulta General' },
  { id: 4, mascota: 'Firulai', emoji: '🐕', fecha: 1, horaInicio: '08:30', horaFin: '09:00', tipo: 'Consulta General' },
  { id: 5, mascota: 'Mora', emoji: '🐈', fecha: 1, horaInicio: '10:30', horaFin: '11:00', tipo: 'Desparasitación' },
  { id: 6, mascota: 'Kira', emoji: '🐈', fecha: 2, horaInicio: '09:00', horaFin: '09:45', tipo: 'Consulta General' },
  { id: 7, mascota: 'Coco', emoji: '🐈', fecha: 2, horaInicio: '13:00', horaFin: '13:30', tipo: 'Consulta General' },
  { id: 8, mascota: 'Simba', emoji: '🐈', fecha: 3, horaInicio: '10:30', horaFin: '11:00', tipo: 'Vacunación' },
  { id: 9, mascota: 'Toby', emoji: '🐕', fecha: 3, horaInicio: '16:00', horaFin: '16:30', tipo: 'Desparasitación' },
  { id: 10, mascota: 'Bobby', emoji: '🐈', fecha: 4, horaInicio: '13:00', horaFin: '13:45', tipo: 'Consulta General' },
  { id: 11, mascota: 'Bella', emoji: '🐕', fecha: 4, horaInicio: '15:00', horaFin: '15:30', tipo: 'Control' },
  { id: 12, mascota: 'Peluché', emoji: '🐕', fecha: 5, horaInicio: '12:30', horaFin: '13:00', tipo: 'Desparasitación' },
  { id: 13, mascota: 'Nala', emoji: '🐕', fecha: 5, horaInicio: '13:30', horaFin: '14:00', tipo: 'Consulta General' },
  { id: 14, mascota: 'Rocky', emoji: '🐕', fecha: 5, horaInicio: '15:30', horaFin: '16:00', tipo: 'Control' },
];

var tipoColores = {
  'Consulta General': { bg: 'bg-green-50 dark:bg-green-900/20', border: 'border-l-green-500', text: 'text-green-700 dark:text-green-400' },
  'Vacunación': { bg: 'bg-purple-50 dark:bg-purple-900/20', border: 'border-l-purple-500', text: 'text-purple-700 dark:text-purple-400' },
  'Desparasitación': { bg: 'bg-blue-50 dark:bg-blue-900/20', border: 'border-l-blue-500', text: 'text-blue-700 dark:text-blue-400' },
  'Control': { bg: 'bg-orange-50 dark:bg-orange-900/20', border: 'border-l-orange-500', text: 'text-orange-700 dark:text-orange-400' },
};

function horaToPx(horaStr) {
  var parts = horaStr.split(':');
  var h = Number(parts[0]);
  var m = Number(parts[1]);
  return (h - 8 + m / 60) * ALTURA_HORA;
}

function AgendaCitas() {
  var navigate = useNavigate();
  var [vista, setVista] = useState('semana');
  var [ahora, setAhora] = useState(new Date());
  var [citas] = useState(citasMock);
  var [semanaActual, setSemanaActual] = useState(getWeekDays);
  var [diaSeleccionado, setDiaSeleccionado] = useState(new Date().getDate());

  useEffect(function () {
    var timer = setInterval(function () { setAhora(new Date()); }, 60000);
    return function () { clearInterval(timer); };
  }, []);

  var diaActual = new Date().getDate();
  var currentTop = Math.max(0, (ahora.getHours() - 8) * ALTURA_HORA + (ahora.getMinutes() / 60) * ALTURA_HORA);

  var rangoFecha = (function () {
    var p = semanaActual[0].fecha;
    var u = semanaActual[6].fecha;
    var mismoMes = p.getMonth() === u.getMonth();
    if (mismoMes) {
      return p.getDate() + ' - ' + u.getDate() + ' de ' + MESES[p.getMonth()] + ', ' + p.getFullYear();
    }
    return p.getDate() + ' ' + MESES[p.getMonth()].slice(0, 3) + ' - ' + u.getDate() + ' ' + MESES[u.getMonth()].slice(0, 3) + ', ' + p.getFullYear();
  })();

  var hoyDate = new Date();
  var mesActual = hoyDate.getMonth();
  var añoActual = hoyDate.getFullYear();
  var diasEnMes = new Date(añoActual, mesActual + 1, 0).getDate();
  var diasConCitas = new Set(citas.map(function (c) { return c.fecha; }));

  function getDayInfo(diaNum) {
    var found = semanaActual.find(function (s) { return s.dia === diaNum; });
    if (found) return found;
    var f = new Date();
    f.setDate(diaNum);
    return { dia: diaNum, nombre: NOMBRE_DIA[f.getDay()], mes: MESES[f.getMonth()] };
  }

  function irAHoy() {
    setSemanaActual(getWeekDays());
    setVista('semana');
    setDiaSeleccionado(new Date().getDate());
  }

  var numCols = vista === 'dia' ? 1 : 7;
  var columnas = vista === 'dia' ? [getDayInfo(diaSeleccionado)] : semanaActual;
  var gridTemplate = '70px repeat(' + numCols + ', 1fr)';

  function getBorderColor(tipo) {
    if (tipo === 'Consulta General') return '#22c55e';
    if (tipo === 'Vacunación') return '#a855f7';
    if (tipo === 'Desparasitación') return '#3b82f6';
    return '#f97316';
  }

  function getBgColor(tipo) {
    if (tipo === 'Consulta General') return '#f0fdf4';
    if (tipo === 'Vacunación') return '#faf5ff';
    if (tipo === 'Desparasitación') return '#eff6ff';
    return '#fff7ed';
  }

  function getTextColor(tipo) {
    if (tipo === 'Consulta General') return '#15803d';
    if (tipo === 'Vacunación') return '#6b21a8';
    if (tipo === 'Desparasitación') return '#1d4ed8';
    return '#c2410c';
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="flex-none flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
            <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Agenda / Citas</h1>
            <p className="text-sm text-gray-500">Gestiona y programa citas de tus pacientes</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={irAHoy} className="flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" /></svg>
            Hoy
          </button>
          <button onClick={function () { navigate('/agenda/nueva'); }} className="flex items-center gap-2 rounded-xl bg-[#5F7B65] px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#4E6553] cursor-pointer">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
            + Nueva Cita
          </button>
        </div>
      </div>

      <div className="flex-none flex items-center justify-between px-6 mb-4">
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-lg hover:bg-gray-100 cursor-pointer">
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" /></svg>
          </button>
          <h2 className="text-base font-bold text-gray-800">{rangoFecha}</h2>
          <button className="p-2 rounded-lg hover:bg-gray-100 cursor-pointer">
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" /></svg>
          </button>
        </div>
        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-0.5">
          {['Día', 'Semana', 'Mes'].map(function (label) {
            var v = label === 'Día' ? 'dia' : label === 'Mes' ? 'mes' : label.toLowerCase();
            var active = vista === v;
            return (
              <button key={label} onClick={function () { setVista(v); }} className={'px-4 py-1.5 text-sm font-medium rounded-md transition-colors cursor-pointer ' + (active ? 'bg-[#5F7B65] text-white shadow-sm' : 'text-gray-600 hover:text-gray-800')}>{label}</button>
            );
          })}
        </div>
        <div className="flex items-center gap-2">
          <select className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700">
            <option>Todos los veterinarios</option>
            <option>Dr. Juan Pérez</option>
            <option>Dra. Ana Torres</option>
          </select>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-auto grid grid-cols-12 gap-6 px-6 pb-6">
        <div className="col-span-9 flex flex-col min-h-0 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          {vista !== 'mes' ? (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: gridTemplate, borderBottom: '1px solid #e5e7eb' }}>
                <div className="p-3" style={{ borderRight: '1px solid #e5e7eb' }} />
                {columnas.map(function (d) {
                  var esHoy = d.dia === diaActual;
                  return (
                    <div key={d.dia} className="p-3 text-center" style={{ borderRight: '1px solid #e5e7eb' }}>
                      <p className="text-xs text-gray-500">{d.nombre}</p>
                      <div className="flex justify-center my-1">
                        {esHoy ? (
                          <span className="text-sm font-bold bg-[#5F7B65] text-white rounded-full w-7 h-7 flex items-center justify-center">{d.dia}</span>
                        ) : (
                          <span className="text-lg font-bold text-gray-800">{d.dia}</span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400">{d.mes}</p>
                    </div>
                  );
                })}
              </div>

              <div className="relative flex-1 overflow-y-auto">
                <div style={{ display: 'grid', gridTemplateColumns: gridTemplate }}>
                  {HORAS.slice(0, -1).map(function (h) {
                    return (
                      <Fragment key={h}>
                        <div style={{ height: ALTURA_HORA, borderRight: '1px solid #e5e7eb', borderBottom: '1px solid #e5e7eb', textAlign: 'right', paddingRight: '16px', paddingTop: '0' }}>
                          <span className="text-xs text-gray-400 block" style={{ marginTop: '-8px' }}>{String(h).padStart(2, '0')}:00</span>
                        </div>
                        {columnas.map(function (col) {
                          return <div key={'cell-' + col.dia + '-' + h} style={{ height: ALTURA_HORA, borderRight: '1px solid #e5e7eb', borderBottom: '1px solid #e5e7eb' }} />;
                        })}
                      </Fragment>
                    );
                  })}
                  <div style={{ height: ALTURA_HORA, borderRight: '1px solid #e5e7eb', textAlign: 'right', paddingRight: '16px' }}>
                    <span className="text-xs text-gray-400 block" style={{ marginTop: '-8px' }}>18:00</span>
                  </div>
                  {columnas.map(function (col) {
                    return <div key={'last-' + col.dia} style={{ height: ALTURA_HORA, borderRight: '1px solid #e5e7eb' }} />;
                  })}
                </div>

                {(vista === 'dia' ? citas.filter(function (c) { return c.fecha === diaSeleccionado; }) : citas).map(function (cita) {
                  var colIndex = vista === 'dia' ? 0 : semanaActual.findIndex(function (d) { return d.dia === cita.fecha; });
                  if (colIndex === -1) return null;
                  var top = horaToPx(cita.horaInicio);
                  var height = Math.max(horaToPx(cita.horaFin) - top, 48);

                  return (
                    <div
                      key={cita.id}
                      className="absolute z-20 shadow-sm rounded-md p-1.5 cursor-pointer hover:shadow-md transition-shadow"
                      style={{
                        top: top + 2,
                        left: 'calc(70px + (100% - 70px) / ' + numCols + ' * ' + colIndex + ' + 4px)',
                        width: 'calc((100% - 70px) / ' + numCols + ' - 8px)',
                        height: height - 4,
                        backgroundColor: getBgColor(cita.tipo),
                        borderLeft: '3px solid ' + getBorderColor(cita.tipo),
                      }}
                    >
                      <p className="text-xs font-bold text-gray-800 truncate">{cita.emoji} {cita.mascota}</p>
                      <p className="text-[10px] text-gray-500">{cita.horaInicio} - {cita.horaFin}</p>
                      <p className="text-[9px] truncate" style={{ color: getTextColor(cita.tipo) }}>{cita.tipo}</p>
                    </div>
                  );
                })}

                {currentTop > 0 && (
                  <div className="absolute left-[70px] right-0 border-t-2 border-red-400 z-30 pointer-events-none" style={{ top: currentTop }}>
                    <div className="absolute -left-1 -top-2 w-3 h-3 bg-red-400 rounded-full"></div>
                    <span className="absolute text-[10px] font-bold text-red-400 bg-gray-900 px-1.5 py-0.5 rounded" style={{ left: '-62px', top: '-12px' }}>{ahora.getHours().toString().padStart(2,'0')}:{ahora.getMinutes().toString().padStart(2,'0')}</span>
                  </div>
                )}
              </div>

              <div className="px-4 py-3 border-t border-gray-200 flex items-center gap-4 text-xs">
                <span className="font-semibold text-gray-600">Tipos de Cita:</span>
                {Object.keys(tipoColores).map(function (nombre) {
                  var dotColor = nombre === 'Consulta General' ? 'bg-green-500' : nombre === 'Vacunación' ? 'bg-purple-500' : nombre === 'Desparasitación' ? 'bg-blue-500' : 'bg-orange-500';
                  return (
                    <div key={nombre} className="flex items-center gap-1.5">
                      <span className={'w-2.5 h-2.5 rounded-full ' + dotColor}></span>
                      <span className="text-gray-600">{nombre}</span>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="flex flex-col h-full p-6 overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-800">{MESES[mesActual]} {añoActual}</h3>
              </div>
              <div className="grid grid-cols-7 gap-0 text-center border-b border-gray-200 pb-2 mb-2">
                {['Lu','Ma','Mi','Ju','Vi','Sá','Do'].map(function (d) { return <span key={d} className="text-xs font-semibold text-gray-500 py-1">{d}</span>; })}
              </div>
              <div className="flex-1 grid grid-cols-7 gap-px" style={{ gridTemplateRows: 'repeat(6, minmax(0, 1fr))' }}>
                {Array.from({length: 42}, function (_, i) {
                  var primerDia = new Date(añoActual, mesActual, 1);
                  var offset = (primerDia.getDay() + 6) % 7;
                  var d = i - offset + 1;
                  var esValido = d >= 1 && d <= diasEnMes;
                  if (!esValido) {
                    return <div key={i} />;
                  }
                  var tieneCita = diasConCitas.has(d);
                  var esHoy = d === new Date().getDate();
                  var esSeleccionado = d === diaSeleccionado;
                  return (
                    <button
                      key={i}
                      onClick={function () { setDiaSeleccionado(d); setVista('dia'); }}
                      className={'flex flex-col items-center justify-start pt-2 pb-1 rounded-lg transition-colors cursor-pointer hover:bg-gray-100 ' + (esHoy ? 'border border-[#5F7B65]' : '') + (esSeleccionado ? ' bg-[#5F7B65]/10' : '')}
                    >
                      <span className={'text-xs font-bold ' + (esHoy ? 'bg-[#5F7B65] text-white rounded-full w-6 h-6 flex items-center justify-center' : 'text-gray-700')}>{d}</span>
                      {tieneCita && <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1"></span>}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="col-span-3 space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
            <div className="flex items-center justify-between mb-3">
              <button className="p-1 rounded hover:bg-gray-100 cursor-pointer">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" /></svg>
              </button>
              <h4 className="text-sm font-bold text-gray-800">{MESES[mesActual]} {añoActual}</h4>
              <button className="p-1 rounded hover:bg-gray-100 cursor-pointer">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" /></svg>
              </button>
            </div>
            <div className="grid grid-cols-7 gap-0 text-center text-xs mb-1">
              {['Lu','Ma','Mi','Ju','Vi','Sá','Do'].map(function (d) { return <span key={d} className="text-gray-400 py-1 text-[10px]">{d}</span>; })}
            </div>
            <div className="grid grid-cols-7 gap-0 text-center">
              {Array.from({length: diasEnMes}, function (_, i) {
                var d = i + 1;
                var isToday = d === hoyDate.getDate();
                return (
                  <span key={d} className={'text-xs py-1 ' + (isToday ? 'bg-[#5F7B65] text-white rounded-full w-6 h-6 mx-auto flex items-center justify-center text-[10px]' : 'text-gray-700')}>{d}</span>
                );
              })}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-bold text-gray-800">Próximas Citas</h4>
              <button className="text-xs text-emerald-600 font-semibold cursor-pointer">Ver todas</button>
            </div>
            <div className="space-y-3">
              {[
                { hora: '11:30', mascota: 'Peluché 🐕', tipo: 'Vacunación', dot: 'bg-purple-500' },
                { hora: '16:00', mascota: 'Kira 🐈', tipo: 'Control', dot: 'bg-orange-500' },
              ].map(function (c, i) {
                return (
                  <div key={i} className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className={'w-2 h-2 rounded-full ' + c.dot}></span>
                        <span className="text-sm font-medium text-gray-800">{c.mascota}</span>
                      </div>
                      <p className="text-xs text-gray-400 ml-3.5">{c.hora}</p>
                    </div>
                    <span className="text-[10px] text-gray-400">{c.tipo}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
            <h4 className="text-sm font-bold text-gray-800 mb-3">Estadísticas del Día</h4>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Programadas', valor: 6, color: 'text-blue-600', bg: 'bg-blue-50', icon: 'calendar' },
                { label: 'Confirmadas', valor: 5, color: 'text-emerald-600', bg: 'bg-emerald-50', icon: 'check' },
                { label: 'Canceladas', valor: 0, color: 'text-red-600', bg: 'bg-red-50', icon: 'x' },
                { label: 'Pendientes', valor: 1, color: 'text-gray-600', bg: 'bg-gray-100', icon: 'clock' },
              ].map(function (s) {
                var iconSvg = s.icon === 'calendar' ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" /></svg>
                ) : s.icon === 'check' ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
                ) : s.icon === 'x' ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
                );
                return (
                  <div key={s.label} className={'rounded-lg p-3 ' + s.bg}>
                    <div className={'flex items-center gap-1 mb-1 ' + s.color}>
                      {iconSvg}
                      <p className="text-xl font-bold">{s.valor}</p>
                    </div>
                    <p className="text-[11px] text-gray-600">{s.label}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AgendaCitas;
