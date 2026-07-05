import { useState, useEffect, Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/axiosConfig';

const DIAS_SEMANA = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
const MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Setiembre', 'Octubre', 'Noviembre', 'Diciembre'];

function getWeekDays() {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((dayOfWeek + 6) % 7));
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    return { dia: d.getDate(), nombre: DIAS_SEMANA[i], completo: dayNames[d.getDay()] + ' ' + d.getDate() };
  });
}

const semanaActual = getWeekDays();

const HORAS = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];

const citas = [
  { id: 1, mascota: 'Max', veterinario: 'Dra. María García', fecha: 20, horaInicio: '09:00', horaFin: '09:30', tipo: 'Consulta General' },
  { id: 2, mascota: 'Luna', veterinario: 'Dr. Carlos López', fecha: 20, horaInicio: '10:30', horaFin: '11:00', tipo: 'Vacunación' },
  { id: 3, mascota: 'Rocky', veterinario: 'Dra. María García', fecha: 21, horaInicio: '08:30', horaFin: '09:00', tipo: 'Desparasitación' },
  { id: 4, mascota: 'Kira', veterinario: 'Dr. Roberto Sánchez', fecha: 22, horaInicio: '09:00', horaFin: '09:45', tipo: 'Consulta General' },
  { id: 5, mascota: 'Peluché', veterinario: 'Dra. Ana Martínez', fecha: 22, horaInicio: '11:30', horaFin: '12:00', tipo: 'Vacunación' },
  { id: 6, mascota: 'Kira', veterinario: 'Dr. Roberto Sánchez', fecha: 22, horaInicio: '16:00', horaFin: '16:30', tipo: 'Control / Revisión' },
  { id: 7, mascota: 'Simba', veterinario: 'Dra. María García', fecha: 23, horaInicio: '10:00', horaFin: '10:30', tipo: 'Desparasitación' },
  { id: 8, mascota: 'Luna', veterinario: 'Dr. Carlos López', fecha: 23, horaInicio: '14:00', horaFin: '14:45', tipo: 'Consulta General' },
  { id: 9, mascota: 'Max', veterinario: 'Dra. Ana Martínez', fecha: 24, horaInicio: '09:30', horaFin: '10:00', tipo: 'Control / Revisión' },
  { id: 10, mascota: 'Rocky', veterinario: 'Dr. Roberto Sánchez', fecha: 24, horaInicio: '15:00', horaFin: '15:30', tipo: 'Vacunación' },
  { id: 11, mascota: 'Simba', veterinario: 'Dra. María García', fecha: 25, horaInicio: '11:00', horaFin: '11:30', tipo: 'Consulta General' },
];

const tipoColores = {
  'Consulta General': { bg: 'bg-green-100/80 border-green-400', text: 'text-green-800', dot: 'bg-green-500' },
  'Vacunación': { bg: 'bg-purple-100/80 border-purple-400', text: 'text-purple-800', dot: 'bg-purple-500' },
  'Desparasitación': { bg: 'bg-blue-50 border-blue-400', text: 'text-blue-800', dot: 'bg-blue-500' },
  'Control / Revisión': { bg: 'bg-orange-100/80 border-orange-400', text: 'text-orange-800', dot: 'bg-orange-500' },
};

const HORA_ALTURA = 60;

function parseHora(hora) {
  const [h, m] = hora.split(':').map(Number);
  return h + m / 60;
}

function calcularTop(horaInicio) {
  const horas = parseHora(horaInicio);
  return (horas - 8) * HORA_ALTURA;
}

function calcularAltura(horaInicio, horaFin) {
  return (parseHora(horaFin) - parseHora(horaInicio)) * HORA_ALTURA;
}

function MiniCalendario() {
  return (
    <div className="bg-white dark:bg-[#1E1E1E] rounded-xl border border-gray-200 dark:border-[#333] shadow-sm p-4">
      <div className="flex items-center justify-between mb-3">
        <button className="p-1 rounded hover:bg-gray-100 dark:hover:bg-[#333] transition-colors cursor-pointer">
          <svg className="w-4 h-4 text-gray-500 dark:text-[#909090]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" /></svg>
        </button>
        <h4 className="text-sm font-bold text-gray-800 dark:text-[#E0E0E0]">{MESES[new Date().getMonth()]} {new Date().getFullYear()}</h4>
        <button className="p-1 rounded hover:bg-gray-100 dark:hover:bg-[#333] transition-colors cursor-pointer">
          <svg className="w-4 h-4 text-gray-500 dark:text-[#909090]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" /></svg>
        </button>
      </div>
      <div className="grid grid-cols-7 gap-0 text-center mb-1">
        {['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá', 'Do'].map((d) => (
          <span key={d} className="text-[10px] font-semibold text-gray-400 dark:text-[#808080] py-1">{d}</span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-0 text-center">
        {[null, null, null, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31].map((d, i) => (
          <span key={i} className={`text-xs py-1 ${d === new Date().getDate() ? 'bg-[#5F7B65] text-white rounded-full w-7 h-7 mx-auto flex items-center justify-center' : d ? 'text-gray-700 dark:text-[#D0D0D0]' : ''}`}>
            {d || ''}
          </span>
        ))}
      </div>
    </div>
  );
}

function ProximasCitas() {
  const hoy = [
    { hora: '11:30', mascota: 'Peluché', tipo: 'Vacunación' },
    { hora: '16:00', mascota: 'Kira', tipo: 'Control / Revisión' },
  ];
  return (
    <div className="bg-white dark:bg-[#1E1E1E] rounded-xl border border-gray-200 dark:border-[#333] shadow-sm p-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-bold text-gray-800 dark:text-[#E0E0E0]">Próximas Citas</h4>
        <button className="text-xs text-emerald-600 font-semibold hover:text-emerald-700 transition-colors cursor-pointer">Ver todas</button>
      </div>
      <div className="space-y-2">
        {hoy.map((c, i) => (
          <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-[#2C2C2C] transition-colors">
            <span className={`w-2 h-2 rounded-full ${tipoColores[c.tipo].dot}`} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 dark:text-[#E0E0E0]">{c.mascota}</p>
              <p className="text-xs text-gray-400 dark:text-[#808080]">{c.hora}</p>
            </div>
            <span className="text-[10px] text-gray-500 dark:text-[#909090]">{c.tipo}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Estadisticas() {
  const stats = [
    { label: 'Programadas', valor: 6, color: 'bg-blue-50 text-blue-600' },
    { label: 'Confirmadas', valor: 5, color: 'bg-emerald-50 text-emerald-600' },
    { label: 'Canceladas', valor: 0, color: 'bg-red-50 text-red-600' },
    { label: 'Pendientes', valor: 1, color: 'bg-gray-100 text-gray-600' },
  ];
  return (
    <div className="bg-white dark:bg-[#1E1E1E] rounded-xl border border-gray-200 dark:border-[#333] shadow-sm p-4">
      <h4 className="text-sm font-bold text-gray-800 dark:text-[#E0E0E0] mb-3">Estadísticas del Día</h4>
      <div className="grid grid-cols-2 gap-2">
        {stats.map((s) => (
          <div key={s.label} className={`rounded-lg p-3 ${s.color}`}>
            <p className="text-xl font-bold">{s.valor}</p>
            <p className="text-[11px] font-medium opacity-80">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function AgendaCitas() {
  const navigate = useNavigate();
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [vista, setVista] = useState('semana');

  useEffect(() => {
    API.get('/citas').then((res) => {
      const mapped = res.data.map((c) => ({
        id: c.id,
        mascota: c.mascota?.nombre || 'Sin mascota',
        veterinario: c.veterinario || '',
        fecha: c.fecha ? new Date(c.fecha).getDate() : 0,
        horaInicio: c.hora ? c.hora.substring(0, 5) : '08:00',
        horaFin: c.hora ? (() => { const [h, m] = c.hora.split(':').map(Number); const end = h * 60 + m + (c.duracion || 30); return Math.floor(end / 60) + ':' + String(end % 60).padStart(2, '0'); })() : '08:30',
        tipo: c.tipoCita || 'Consulta General',
      }));
      setCitas(mapped);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-col h-full gap-5">
      <div className="flex-none flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
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
          <button className="flex items-center gap-2 rounded-xl border border-gray-300 dark:border-[#404040] bg-white dark:bg-[#2C2C2C] px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-[#D0D0D0] transition-colors hover:bg-gray-50 dark:hover:bg-[#333] cursor-pointer">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" /></svg>
            Hoy
          </button>
          <button onClick={() => navigate('/agenda/nueva')} className="flex items-center gap-2 rounded-xl bg-[#5F7B65] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#4E6553] cursor-pointer">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
            Nueva Cita
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#333] transition-colors cursor-pointer">
            <svg className="w-4 h-4 text-gray-600 dark:text-[#A0A0A0]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" /></svg>
          </button>
          <h2 className="text-base font-bold text-gray-800 dark:text-[#E0E0E0] min-w-[200px] text-center">{semanaActual[0].dia} - {semanaActual[6].dia} de {MESES[new Date().getMonth()]}, {new Date().getFullYear()}</h2>
          <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#333] transition-colors cursor-pointer">
            <svg className="w-4 h-4 text-gray-600 dark:text-[#A0A0A0]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" /></svg>
          </button>
        </div>
        <div className="flex items-center gap-1 bg-gray-100 dark:bg-[#2C2C2C] rounded-lg p-0.5">
          {['Día', 'Semana', 'Mes'].map((v) => (
            <button key={v} onClick={() => setVista(v.toLowerCase())} className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors cursor-pointer ${vista === v.toLowerCase() ? 'bg-[#5F7B65] text-white shadow-sm' : 'text-gray-600 dark:text-[#A0A0A0] hover:text-gray-800 dark:hover:text-[#E0E0E0]'}`}>{v}</button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <select className="rounded-lg border border-gray-300 dark:border-[#404040] bg-white dark:bg-[#2C2C2C] px-3 py-1.5 text-sm text-gray-700 dark:text-[#D0D0D0] appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22%236b7280%22%3E%3Cpath%20fill-rule%3D%22evenodd%22%20d%3D%22M5.23%207.21a.75.75%200%20011.06.02L10%2011.168l3.71-3.938a.75.75%200%20111.08%201.04l-4.25%204.5a.75.75%200%2001-1.08%200l-4.25-4.5a.75.75%200%2001.02-1.06z%22%20clip-rule%3D%22evenodd%22%20%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem] bg-[right_0.25rem_center] bg-no-repeat pr-7 dark:bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22%23909090%22%3E%3Cpath%20fill-rule%3D%22evenodd%22%20d%3D%22M5.23%207.21a.75.75%200%20011.06.02L10%2011.168l3.71-3.938a.75.75%200%20111.08%201.04l-4.25%204.5a.75.75%200%2001-1.08%200l-4.25-4.5a.75.75%200%2001.02-1.06z%22%20clip-rule%3D%22evenodd%22%20%2F%3E%3C%2Fsvg%3E')]">
            <option>Todos los veterinarios</option>
            <option>Dra. María García</option>
            <option>Dr. Carlos López</option>
            <option>Dr. Roberto Sánchez</option>
            <option>Dra. Ana Martínez</option>
          </select>
          <button className="flex items-center gap-1.5 rounded-lg border border-gray-300 dark:border-[#404040] bg-white dark:bg-[#2C2C2C] px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-[#D0D0D0] hover:bg-gray-50 dark:hover:bg-[#333] transition-colors cursor-pointer">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z" /></svg>
            Filtros
          </button>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-auto grid grid-cols-12 gap-6">
        <div className="col-span-9">
          <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl border border-gray-200 dark:border-[#333] shadow-sm overflow-hidden">
            <div className="grid grid-cols-[60px_repeat(7,1fr)] border-b border-gray-200 dark:border-[#333] bg-gray-50 dark:bg-[#2C2C2C]">
              <div className="p-2 border-r border-gray-200 dark:border-[#333]" />
              {semanaActual.map((d) => (
                <div key={d.dia} className="p-2 text-center border-r border-gray-200 dark:border-[#333] last:border-r-0">
                  <p className="text-[11px] font-semibold text-gray-500 dark:text-[#909090]">{d.nombre}</p>
                  <p className={`text-sm font-bold mt-0.5 ${d.dia === new Date().getDate() ? 'bg-[#5F7B65] text-white w-7 h-7 rounded-full flex items-center justify-center mx-auto' : 'text-gray-800 dark:text-[#E0E0E0]'}`}>
                    {d.dia}
                  </p>
                </div>
              ))}
            </div>

            <div className="relative grid grid-cols-[60px_repeat(7,1fr)]">
              {HORAS.slice(0, -1).map((h) => (
                <Fragment key={h}>
                  <div className="border-r border-b border-gray-100 dark:border-[#2C2C2C] px-2 pt-0" style={{ height: HORA_ALTURA }}>
                    <span className="text-[11px] text-gray-400 dark:text-[#808080] -mt-2 block">{String(h).padStart(2, '0')}:00</span>
                  </div>
                  {semanaActual.map((d) => (
                    <div key={`cell-${d.dia}-${h}`} className="border-r border-b border-gray-100 dark:border-[#2C2C2C] last:border-r-0 hover:bg-gray-50/50 dark:hover:bg-[#1E1E1E]/50 transition-colors" style={{ height: HORA_ALTURA }} />
                  ))}
                </Fragment>
              ))}
              <div className="border-r border-gray-100 dark:border-[#2C2C2C]" style={{ height: HORA_ALTURA }}>
                <span className="text-[11px] text-gray-400 dark:text-[#808080] px-2 -mt-2 block">18:00</span>
              </div>
              {semanaActual.map((d) => (
                <div key={`last-${d.dia}`} className="border-r border-gray-100 dark:border-[#2C2C2C] last:border-r-0" style={{ height: HORA_ALTURA }} />
              ))}

              {citas.map((cita) => {
                const col = semanaActual.findIndex((d) => d.dia === cita.fecha) + 1;
                const top = calcularTop(cita.horaInicio);
                const altura = calcularAltura(cita.horaInicio, cita.horaFin);
                const colores = tipoColores[cita.tipo];
                return (
                  <div
                    key={cita.id}
                    className={`absolute left-0 right-0 mx-1 rounded-lg border-l-2 px-2 py-1 overflow-hidden cursor-pointer transition-opacity hover:opacity-90 ${colores.bg} ${colores.text}`}
                    style={{
                      top: top + 2,
                      height: altura - 4,
                      gridColumn: `${col + 1} / ${col + 2}`,
                      position: 'absolute',
                      left: `calc((100% - 60px) / 7 * ${col - 1} + 60px + 4px)`,
                      width: `calc((100% - 60px) / 7 - 8px)`,
                    }}
                  >
                    <p className="text-[11px] font-bold leading-tight truncate">{cita.mascota}</p>
                    <p className="text-[10px] opacity-80 leading-tight">{cita.horaInicio} - {cita.horaFin}</p>
                    <p className="text-[9px] opacity-70 leading-tight hidden 2xl:block truncate">{cita.tipo}</p>
                  </div>
                );
              })}

              <div className="absolute left-[60px] right-0 border-t-2 border-red-500 z-10 pointer-events-none" style={{ top: (new Date().getHours() - 8) * HORA_ALTURA + (new Date().getMinutes() / 60) * HORA_ALTURA + 0.5 }}>
                <div className="absolute -left-1 -top-2 w-3 h-3 bg-red-500 rounded-full" />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6 mt-4 px-2">
            {Object.entries(tipoColores).map(([tipo, colores]) => (
              <div key={tipo} className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-sm ${colores.bg}`} />
                <span className="text-xs text-gray-600 dark:text-[#A0A0A0]">{tipo}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-3 space-y-4">
          <MiniCalendario />
          <ProximasCitas />
          <Estadisticas />
        </div>
      </div>
    </div>
  );
}

export default AgendaCitas;
