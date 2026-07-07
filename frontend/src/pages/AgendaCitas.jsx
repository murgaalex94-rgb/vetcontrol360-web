import { useState, useEffect, Fragment, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/axiosConfig';

var DIAS_SEMANA = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
var MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Setiembre', 'Octubre', 'Noviembre', 'Diciembre'];
var NOMBRE_DIA = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

function getWeekDays(fromDate) {
  var d = fromDate ? new Date(fromDate) : new Date();
  var dayOfWeek = d.getDay();
  var monday = new Date(d);
  monday.setDate(d.getDate() - ((dayOfWeek + 6) % 7));
  return Array.from({ length: 7 }, function (_, i) {
    var day = new Date(monday);
    day.setDate(monday.getDate() + i);
    return { dia: day.getDate(), nombre: DIAS_SEMANA[i], mes: MESES[day.getMonth()], fecha: day };
  });
}

var HORAS = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];
var ALTURA_HORA = 64;

function transformCita(c) {
  var fecha = new Date(c.fecha + 'T' + c.hora);
  var h = Number(c.hora.split(':')[0]);
  var m = Number(c.hora.split(':')[1]);
  var inicioMin = h * 60 + m;
  var finMin = inicioMin + (c.duracion || 30);
  var hFin = String(Math.floor(finMin / 60)).padStart(2, '0');
  var mFin = String(finMin % 60).padStart(2, '0');
  var especie = (c.mascota && c.mascota.especie) || '';
  var emoji = especie.toLowerCase().indexOf('gato') !== -1 ? '🐈' : '🐕';
  return {
    id: c.id,
    mascota: (c.mascota && c.mascota.nombre) || 'Mascota',
    emoji: emoji,
    fecha: fecha.getDate(),
    horaInicio: String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0'),
    horaFin: hFin + ':' + mFin,
    tipo: c.tipoCita || 'Consulta General',
    veterinario: c.veterinario || '',
    motivo: c.motivo || '',
    notas: c.notas || '',
  };
}

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
  var [citas, setCitas] = useState([]);
  var [loadingCitas, setLoadingCitas] = useState(true);
  var [fechaEnfoque, setFechaEnfoque] = useState(new Date());
  var [citaSeleccionada, setCitaSeleccionada] = useState(null);
  var [miniMes, setMiniMes] = useState(new Date().getMonth());
  var [miniAño, setMiniAño] = useState(new Date().getFullYear());
  var [scrollCitaId, setScrollCitaId] = useState(null);
  var scrollRef = useRef(null);

  useEffect(function () {
    var timer = setInterval(function () { setAhora(new Date()); }, 60000);
    return function () { clearInterval(timer); };
  }, []);

  useEffect(function () {
    API.get('/citas').then(function (res) {
      setCitas(res.data.map(transformCita));
      setLoadingCitas(false);
    }).catch(function () {
      setLoadingCitas(false);
    });
  }, []);

  useEffect(function () {
    if (scrollCitaId !== null && scrollRef.current) {
      var cita = citas.find(function (c) { return c.id === scrollCitaId; });
      if (cita) {
        var top = horaToPx(cita.horaInicio);
        scrollRef.current.scrollTop = Math.max(0, top - 80);
      }
      setScrollCitaId(null);
    }
  }, [scrollCitaId, citas]);

  var semanaActual = getWeekDays(fechaEnfoque);
  var diaSeleccionado = fechaEnfoque.getDate();
  var diaActual = new Date().getDate();
  var currentTop = Math.max(0, (ahora.getHours() - 8) * ALTURA_HORA + (ahora.getMinutes() / 60) * ALTURA_HORA);

  var rangoFecha = (function () {
    if (vista === 'dia') {
      var df = fechaEnfoque;
      return df.getDate() + ' de ' + MESES[df.getMonth()] + ', ' + df.getFullYear();
    }
    var p = semanaActual[0].fecha;
    var u = semanaActual[6].fecha;
    var mismoMes = p.getMonth() === u.getMonth();
    if (mismoMes) {
      return p.getDate() + ' - ' + u.getDate() + ' de ' + MESES[p.getMonth()] + ', ' + p.getFullYear();
    }
    return p.getDate() + ' ' + MESES[p.getMonth()].slice(0, 3) + ' - ' + u.getDate() + ' ' + MESES[u.getMonth()].slice(0, 3) + ', ' + p.getFullYear();
  })();

  var hoyDate = new Date();
  var mesActual = fechaEnfoque.getMonth();
  var añoActual = fechaEnfoque.getFullYear();
  var diasEnMes = new Date(añoActual, mesActual + 1, 0).getDate();
  var diasConCitas = new Set(citas.map(function (c) { return c.fecha; }));

  function getDayInfo(diaNum) {
    var found = semanaActual.find(function (s) { return s.dia === diaNum; });
    if (found) return found;
    var f = new Date(fechaEnfoque);
    f.setDate(diaNum);
    return { dia: diaNum, nombre: NOMBRE_DIA[f.getDay()], mes: MESES[f.getMonth()] };
  }

  function irAHoy() {
    var hoy = new Date();
    setFechaEnfoque(hoy);
    setMiniMes(hoy.getMonth());
    setMiniAño(hoy.getFullYear());
  }

  function navegarAnterior() {
    if (vista === 'dia') {
      var d = new Date(fechaEnfoque);
      d.setDate(d.getDate() - 1);
      setFechaEnfoque(d);
    } else if (vista === 'semana') {
      var w = new Date(fechaEnfoque);
      w.setDate(w.getDate() - 7);
      setFechaEnfoque(w);
    } else {
      var m = new Date(fechaEnfoque);
      m.setMonth(m.getMonth() - 1);
      setFechaEnfoque(m);
    }
  }

  function navegarSiguiente() {
    if (vista === 'dia') {
      var d = new Date(fechaEnfoque);
      d.setDate(d.getDate() + 1);
      setFechaEnfoque(d);
    } else if (vista === 'semana') {
      var w = new Date(fechaEnfoque);
      w.setDate(w.getDate() + 7);
      setFechaEnfoque(w);
    } else {
      var m = new Date(fechaEnfoque);
      m.setMonth(m.getMonth() + 1);
      setFechaEnfoque(m);
    }
  }

  function miniMesAnterior() {
    if (miniMes === 0) { setMiniMes(11); setMiniAño(miniAño - 1); }
    else { setMiniMes(miniMes - 1); }
  }

  function miniMesSiguiente() {
    if (miniMes === 11) { setMiniMes(0); setMiniAño(miniAño + 1); }
    else { setMiniMes(miniMes + 1); }
  }

  function seleccionarFecha(dia, mes, año) {
    var d = new Date(año, mes, dia);
    setFechaEnfoque(d);
    setVista('dia');
  }

  function seleccionarCita(cita) {
    var hoy = new Date();
    var mesRef = hoy.getMonth();
    var añoRef = hoy.getFullYear();
    if (cita.fecha < hoy.getDate() && cita.fecha <= 5 && hoy.getDate() > 20) {
      mesRef = mesRef + 1;
      if (mesRef > 11) { mesRef = 0; añoRef = añoRef + 1; }
    }
    if (cita.fecha > 20 && hoy.getDate() <= 5) {
      mesRef = mesRef - 1;
      if (mesRef < 0) { mesRef = 11; añoRef = añoRef - 1; }
    }
    var d = new Date(añoRef, mesRef, cita.fecha);
    setFechaEnfoque(d);
    setVista('dia');
    setScrollCitaId(cita.id);
  }

  function irAMesView() {
    setVista('mes');
  }

  var numCols = vista === 'dia' ? 1 : 7;
  var columnas = vista === 'dia' ? [getDayInfo(diaSeleccionado)] : semanaActual;
  var gridTemplate = '70px repeat(' + numCols + ', 1fr)';

  var proximasCitas = loadingCitas ? [] : citas.slice().sort(function (a, b) {
    if (a.fecha !== b.fecha) return a.fecha - b.fecha;
    return a.horaInicio.localeCompare(b.horaInicio);
  }).slice(0, 5);

  var miniDiasEnMes = new Date(miniAño, miniMes + 1, 0).getDate();
  var miniPrimerDia = new Date(miniAño, miniMes, 1);
  var miniOffset = (miniPrimerDia.getDay() + 6) % 7;

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

  function getDotColor(tipo) {
    if (tipo === 'Consulta General') return 'bg-green-500';
    if (tipo === 'Vacunación') return 'bg-purple-500';
    if (tipo === 'Desparasitación') return 'bg-blue-500';
    return 'bg-orange-500';
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-[#121212]">
      <div className="flex-none flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-900/20">
            <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-[#E0E0E0]">Agenda / Citas</h1>
            <p className="text-sm text-gray-500 dark:text-[#909090]">Gestiona y programa citas de tus pacientes</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={irAHoy} className="flex items-center gap-2 rounded-xl border border-gray-300 dark:border-[#404040] bg-white dark:bg-[#1E1E1E] px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-[#D0D0D0] hover:bg-gray-50 dark:hover:bg-[#2C2C2C] cursor-pointer">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" /></svg>
            Hoy
          </button>
          <button onClick={function () { navigate('/agenda/nueva'); }} className="flex items-center gap-2 rounded-xl bg-[#5F7B65] px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#4E6553] cursor-pointer">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
            Nueva Cita
          </button>
        </div>
      </div>

      <div className="flex-none flex items-center justify-between px-6 mb-4">
        <div className="flex items-center gap-2">
          <button onClick={navegarAnterior} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#333] cursor-pointer">
            <svg className="w-4 h-4 text-gray-600 dark:text-[#A0A0A0]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" /></svg>
          </button>
          <h2 className="text-base font-bold text-gray-800 dark:text-[#E0E0E0]">{rangoFecha}</h2>
          <button onClick={navegarSiguiente} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#333] cursor-pointer">
            <svg className="w-4 h-4 text-gray-600 dark:text-[#A0A0A0]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" /></svg>
          </button>
        </div>
        <div className="flex items-center gap-1 bg-gray-100 dark:bg-[#2C2C2C] rounded-lg p-0.5">
          {['Día', 'Semana', 'Mes'].map(function (label) {
            var v = label === 'Día' ? 'dia' : label === 'Mes' ? 'mes' : label.toLowerCase();
            var active = vista === v;
            return (
              <button key={label} onClick={function () { setVista(v); }} className={'px-4 py-1.5 text-sm font-medium rounded-md transition-colors cursor-pointer ' + (active ? 'bg-[#5F7B65] text-white shadow-sm' : 'text-gray-600 dark:text-[#A0A0A0] hover:text-gray-800 dark:hover:text-[#E0E0E0]')}>{label}</button>
            );
          })}
        </div>
        <div className="flex items-center gap-2">
          <select className="rounded-lg border border-gray-300 dark:border-[#404040] bg-white dark:bg-[#1E1E1E] px-3 py-1.5 text-sm text-gray-700 dark:text-[#D0D0D0]">
            <option>Todos los veterinarios</option>
            <option>Dr. Juan Pérez</option>
            <option>Dra. Ana Torres</option>
          </select>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-auto grid grid-cols-12 gap-6 px-6 pb-6">
        <div className="col-span-9 flex flex-col min-h-0 bg-white dark:bg-[#1E1E1E] rounded-2xl border border-gray-200 dark:border-[#333] shadow-sm overflow-hidden">
          {vista !== 'mes' ? (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: gridTemplate, borderBottom: '1px solid #e5e7eb' }}>
                <div className="p-3" style={{ borderRight: '1px solid #e5e7eb' }} />
                {columnas.map(function (d) {
                  var esHoy = d.dia === diaActual;
                  return (
                    <div key={d.dia} className="p-3 text-center" style={{ borderRight: '1px solid #e5e7eb' }}>
                      <p className="text-xs text-gray-500 dark:text-[#909090]">{d.nombre}</p>
                      <div className="flex justify-center my-1">
                        {esHoy ? (
                          <span className="text-sm font-bold bg-[#5F7B65] text-white rounded-full w-7 h-7 flex items-center justify-center">{d.dia}</span>
                        ) : (
                          <span className="text-lg font-bold text-gray-800 dark:text-[#E0E0E0]">{d.dia}</span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 dark:text-[#808080]">{d.mes}</p>
                    </div>
                  );
                })}
              </div>

              <div ref={scrollRef} className="relative flex-1 overflow-y-auto">
                <div style={{ display: 'grid', gridTemplateColumns: gridTemplate }}>
                  {HORAS.slice(0, -1).map(function (h) {
                    return (
                      <Fragment key={h}>
                        <div style={{ height: ALTURA_HORA, borderRight: '1px solid #e5e7eb', borderBottom: '1px solid #e5e7eb', textAlign: 'right', paddingRight: '16px', paddingTop: '0' }}>
                          <span className="text-xs text-gray-400 dark:text-[#808080] block" style={{ marginTop: '-8px' }}>{String(h).padStart(2, '0')}:00</span>
                        </div>
                        {columnas.map(function (col) {
                          return <div key={'cell-' + col.dia + '-' + h} style={{ height: ALTURA_HORA, borderRight: '1px solid #e5e7eb', borderBottom: '1px solid #e5e7eb' }} />;
                        })}
                      </Fragment>
                    );
                  })}
                  <div style={{ height: ALTURA_HORA, borderRight: '1px solid #e5e7eb', textAlign: 'right', paddingRight: '16px' }}>
                    <span className="text-xs text-gray-400 dark:text-[#808080] block" style={{ marginTop: '-8px' }}>18:00</span>
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
                      onClick={function () { setCitaSeleccionada(cita); }}
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
                      <p className="text-xs font-bold text-gray-800 dark:text-[#E0E0E0] truncate">{cita.emoji} {cita.mascota}</p>
                      <p className="text-[10px] text-gray-500 dark:text-[#909090]">{cita.horaInicio} - {cita.horaFin}</p>
                      <p className="text-[9px] truncate" style={{ color: getTextColor(cita.tipo) }}>{cita.tipo}</p>
                    </div>
                  );
                })}

                {currentTop > 0 && vista === 'semana' && (
                  <div className="absolute left-[70px] right-0 border-t-2 border-red-400 z-30 pointer-events-none" style={{ top: currentTop }}>
                    <div className="absolute -left-1 -top-2 w-3 h-3 bg-red-400 rounded-full"></div>
                    <span className="absolute text-[10px] font-bold text-red-400 bg-white dark:bg-gray-900 px-1.5 py-0.5 rounded" style={{ left: '-62px', top: '-12px' }}>{ahora.getHours().toString().padStart(2,'0')}:{ahora.getMinutes().toString().padStart(2,'0')}</span>
                  </div>
                )}
              </div>

              <div className="px-4 py-3 border-t border-gray-200 dark:border-[#333] flex items-center gap-4 text-xs">
                <span className="font-semibold text-gray-600 dark:text-[#A0A0A0]">Tipos de Cita:</span>
                {Object.keys(tipoColores).map(function (nombre) {
                  var dotColor = nombre === 'Consulta General' ? 'bg-green-500' : nombre === 'Vacunación' ? 'bg-purple-500' : nombre === 'Desparasitación' ? 'bg-blue-500' : 'bg-orange-500';
                  return (
                    <div key={nombre} className="flex items-center gap-1.5">
                      <span className={'w-2.5 h-2.5 rounded-full ' + dotColor}></span>
                      <span className="text-gray-600 dark:text-[#A0A0A0]">{nombre}</span>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="flex flex-col h-full p-6 overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-800 dark:text-[#E0E0E0]">{MESES[mesActual]} {añoActual}</h3>
              </div>
              <div className="grid grid-cols-7 gap-0 text-center border-b border-gray-200 dark:border-[#333] pb-2 mb-2">
                {['Lu','Ma','Mi','Ju','Vi','Sá','Do'].map(function (d) { return <span key={d} className="text-xs font-semibold text-gray-500 dark:text-[#909090] py-1">{d}</span>; })}
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
                      onClick={function () { seleccionarFecha(d, mesActual, añoActual); }}
                      className={'flex flex-col items-center justify-start pt-2 pb-1 rounded-lg transition-colors cursor-pointer hover:bg-gray-100 dark:bg-[#2C2C2C] ' + (esHoy ? 'border border-[#5F7B65]' : '') + (esSeleccionado ? ' bg-[#5F7B65]/10' : '')}
                    >
                      <span className={'text-xs font-bold ' + (esHoy ? 'bg-[#5F7B65] text-white rounded-full w-6 h-6 flex items-center justify-center' : 'text-gray-700 dark:text-[#D0D0D0]')}>{d}</span>
                      {tieneCita && <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1"></span>}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="col-span-3 space-y-4">
          <div className="bg-white dark:bg-[#1E1E1E] rounded-xl border border-gray-200 dark:border-[#333] shadow-sm p-4">
            <div className="flex items-center justify-between mb-3">
              <button onClick={miniMesAnterior} className="p-1 rounded hover:bg-gray-100 dark:hover:bg-[#333] cursor-pointer">
                <svg className="w-4 h-4 text-gray-500 dark:text-[#909090]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" /></svg>
              </button>
              <h4 className="text-sm font-bold text-gray-800 dark:text-[#E0E0E0]">{MESES[miniMes]} {miniAño}</h4>
              <button onClick={miniMesSiguiente} className="p-1 rounded hover:bg-gray-100 dark:hover:bg-[#333] cursor-pointer">
                <svg className="w-4 h-4 text-gray-500 dark:text-[#909090]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" /></svg>
              </button>
            </div>
            <div className="grid grid-cols-7 gap-0 text-center text-xs mb-1">
              {['Lu','Ma','Mi','Ju','Vi','Sá','Do'].map(function (d) { return <span key={d} className="text-gray-400 dark:text-[#808080] py-1 text-[10px]">{d}</span>; })}
            </div>
            <div className="grid grid-cols-7 gap-0 text-center">
              {Array.from({length: miniOffset + miniDiasEnMes}, function (_, i) {
                if (i < miniOffset) return <span key={'e-' + i} />;
                var d = i - miniOffset + 1;
                var isToday = d === hoyDate.getDate() && miniMes === hoyDate.getMonth() && miniAño === hoyDate.getFullYear();
                var isSelected = d === fechaEnfoque.getDate() && miniMes === fechaEnfoque.getMonth() && miniAño === fechaEnfoque.getFullYear();
                return (
                  <button
                    key={d}
                    onClick={function () { seleccionarFecha(d, miniMes, miniAño); }}
                    className={'text-xs py-1 mx-auto cursor-pointer hover:font-bold ' + (isToday ? 'bg-[#5F7B65] text-white rounded-full w-6 h-6 flex items-center justify-center text-[10px]' : isSelected ? 'bg-[#5F7B65]/20 text-[#5F7B65] rounded-full w-6 h-6 flex items-center justify-center font-bold' : 'text-gray-700 dark:text-[#D0D0D0]')}
                  >{d}</button>
                );
              })}
            </div>
          </div>

          <div className="bg-white dark:bg-[#1E1E1E] rounded-xl border border-gray-200 dark:border-[#333] shadow-sm p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-bold text-gray-800 dark:text-[#E0E0E0]">Próximas Citas</h4>
              <button onClick={irAHoy} className="text-xs text-emerald-600 font-semibold cursor-pointer">Ver todas</button>
            </div>
            <div className="space-y-3">
              {loadingCitas ? (
                <p className="text-xs text-gray-400 dark:text-[#808080] text-center py-3">Cargando citas...</p>
              ) : proximasCitas.length === 0 ? (
                <p className="text-xs text-gray-400 dark:text-[#808080] text-center py-3">No hay citas programadas</p>
              ) : proximasCitas.map(function (c) {
                return (
                  <div key={c.id} onClick={function () { seleccionarCita(c); }} className="flex items-start justify-between cursor-pointer hover:bg-gray-50 dark:hover:bg-[#2C2C2C] rounded-lg p-1 -mx-1 transition-colors">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className={'w-2 h-2 rounded-full ' + getDotColor(c.tipo)}></span>
                        <span className="text-sm font-medium text-gray-800 dark:text-[#E0E0E0]">{c.emoji} {c.mascota}</span>
                      </div>
                      <p className="text-xs text-gray-400 dark:text-[#808080] ml-3.5">{c.horaInicio}</p>
                    </div>
                    <span className="text-[10px] text-gray-400 dark:text-[#808080]">{c.tipo}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white dark:bg-[#1E1E1E] rounded-xl border border-gray-200 dark:border-[#333] shadow-sm p-4">
            <h4 className="text-sm font-bold text-gray-800 dark:text-[#E0E0E0] mb-3">Estadísticas del Día</h4>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Programadas', valor: 6, color: 'text-blue-600', bg: 'bg-blue-50', icon: 'calendar' },
                { label: 'Confirmadas', valor: 5, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20', icon: 'check' },
                { label: 'Canceladas', valor: 0, color: 'text-red-600', bg: 'bg-red-50', icon: 'x' },
                { label: 'Pendientes', valor: 1, color: 'text-gray-600 dark:text-[#A0A0A0]', bg: 'bg-gray-100 dark:bg-[#2C2C2C]', icon: 'clock' },
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
                    <p className="text-[11px] text-gray-600 dark:text-[#A0A0A0]">{s.label}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {citaSeleccionada && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={function () { setCitaSeleccionada(null); }}>
          <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl shadow-xl border border-gray-200 dark:border-[#333] w-full max-w-md mx-4 overflow-hidden" onClick={function (e) { e.stopPropagation(); }}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-[#333]">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{citaSeleccionada.emoji}</span>
                <div>
                  <h3 className="text-lg font-bold text-gray-800 dark:text-[#E0E0E0]">{citaSeleccionada.mascota}</h3>
                  <p className="text-sm text-gray-500 dark:text-[#909090]">{citaSeleccionada.horaInicio} - {citaSeleccionada.horaFin}</p>
                </div>
              </div>
              <button onClick={function () { setCitaSeleccionada(null); }} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-[#333] cursor-pointer">
                <svg className="w-5 h-5 text-gray-500 dark:text-[#909090]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="px-6 py-4 space-y-4">
              <div>
                <p className="text-xs font-semibold text-gray-500 dark:text-[#909090] uppercase tracking-wider">Tipo de Cita</p>
                <p className={'text-sm font-medium mt-0.5 ' + (citaSeleccionada.tipo === 'Consulta General' ? 'text-green-700 dark:text-green-400' : citaSeleccionada.tipo === 'Vacunación' ? 'text-purple-700 dark:text-purple-400' : citaSeleccionada.tipo === 'Desparasitación' ? 'text-blue-700 dark:text-blue-400' : 'text-orange-700 dark:text-orange-400')}>{citaSeleccionada.tipo}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 dark:text-[#909090] uppercase tracking-wider">Motivo</p>
                <p className="text-sm text-gray-700 dark:text-[#D0D0D0] mt-0.5">{citaSeleccionada.motivo}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 dark:text-[#909090] uppercase tracking-wider">Veterinario</p>
                <p className="text-sm text-gray-700 dark:text-[#D0D0D0] mt-0.5">{citaSeleccionada.veterinario}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 dark:text-[#909090] uppercase tracking-wider">Notas</p>
                <p className="text-sm text-gray-700 dark:text-[#D0D0D0] mt-0.5">{citaSeleccionada.notas}</p>
              </div>
            </div>
            <div className="px-6 py-3 bg-gray-50 dark:bg-[#2C2C2C] border-t border-gray-200 dark:border-[#333] flex justify-end gap-2">
              <button onClick={function () { setCitaSeleccionada(null); }} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-[#D0D0D0] bg-white dark:bg-[#1E1E1E] border border-gray-300 dark:border-[#404040] rounded-lg hover:bg-gray-50 dark:hover:bg-[#2C2C2C] cursor-pointer">Cerrar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AgendaCitas;
