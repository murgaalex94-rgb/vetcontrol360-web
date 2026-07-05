import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const clientes = [
  { id: 1, nombre: 'Juan Pérez García', telefono: '987 654 321' },
  { id: 2, nombre: 'María López Ruiz', telefono: '912 345 678' },
  { id: 3, nombre: 'Carlos Torres Vega', telefono: '923 456 789' },
];

const mascotas = [
  { id: 1, nombre: 'Max', especie: 'Perro', raza: 'Golden Retriever', edad: '3 años', peso: '28.5 kg', clienteId: 1, foto: 'https://placehold.co/100x100/E6F7F6/0D9488?text=Max' },
  { id: 2, nombre: 'Luna', especie: 'Gato', raza: 'Siamés', edad: '2 años', peso: '4.2 kg', clienteId: 2, foto: 'https://placehold.co/100x100/E6F7F6/0D9488?text=Luna' },
  { id: 3, nombre: 'Rocky', especie: 'Perro', raza: 'Labrador', edad: '5 años', peso: '32 kg', clienteId: 3, foto: 'https://placehold.co/100x100/E6F7F6/0D9488?text=Rocky' },
  { id: 4, nombre: 'Kira', especie: 'Gato', raza: 'Persa', edad: '4 años', peso: '3.8 kg', clienteId: 1, foto: 'https://placehold.co/100x100/E6F7F6/0D9488?text=Kira' },
];

const tiposCita = [
  { id: 1, nombre: 'Consulta General', color: 'bg-green-500' },
  { id: 2, nombre: 'Vacunación', color: 'bg-purple-500' },
  { id: 3, nombre: 'Desparasitación', color: 'bg-blue-500' },
  { id: 4, nombre: 'Control / Revisión', color: 'bg-orange-500' },
  { id: 5, nombre: 'Emergencia', color: 'bg-red-500' },
];

const duraciones = [
  { value: '15', label: '15 minutos' },
  { value: '30', label: '30 minutos' },
  { value: '45', label: '45 minutos' },
  { value: '60', label: '1 hora' },
  { value: '90', label: '1 hora 30 min' },
  { value: '120', label: '2 horas' },
];

const veterinarios = [
  { id: 1, nombre: 'Dra. María García', especialidad: 'Medicina General', foto: 'https://i.pravatar.cc/150?img=5' },
  { id: 2, nombre: 'Dr. Carlos López', especialidad: 'Cirugía', foto: 'https://i.pravatar.cc/150?img=12' },
  { id: 3, nombre: 'Dr. Roberto Sánchez', especialidad: 'Dermatología', foto: 'https://i.pravatar.cc/150?img=15' },
  { id: 4, nombre: 'Dra. Ana Martínez', especialidad: 'Medicina Felina', foto: 'https://i.pravatar.cc/150?img=9' },
];

const consultorios = [
  { id: 1, nombre: 'Consultorio 1', disponible: true },
  { id: 2, nombre: 'Consultorio 2', disponible: true },
  { id: 3, nombre: 'Consultorio 3', disponible: false },
  { id: 4, nombre: 'Sala de Emergencia', disponible: true },
];

const inputClass = "w-full px-4 py-2.5 border border-gray-300 dark:border-[#404040] rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all bg-white dark:bg-[#2C2C2C] text-gray-900 dark:text-[#E0E0E0] text-sm";
const labelClass = "block text-sm font-medium text-gray-700 dark:text-[#B0B0B0] mb-1.5";
const selectClass = inputClass + " appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22%236b7280%22%3E%3Cpath%20fill-rule%3D%22evenodd%22%20d%3D%22M5.23%207.21a.75.75%200%20011.06.02L10%2011.168l3.71-3.938a.75.75%200%20111.08%201.04l-4.25%204.5a.75.75%200%2001-1.08%200l-4.25-4.5a.75.75%200%2001.02-1.06z%22%20clip-rule%3D%22evenodd%22%20%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem] bg-[right_0.5rem_center] bg-no-repeat pr-10 dark:bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22%23909090%22%3E%3Cpath%20fill-rule%3D%22evenodd%22%20d%3D%22M5.23%207.21a.75.75%200%20011.06.02L10%2011.168l3.71-3.938a.75.75%200%20111.08%201.04l-4.25%204.5a.75.75%200%2001-1.08%200l-4.25-4.5a.75.75%200%2001.02-1.06z%22%20clip-rule%3D%22evenodd%22%20%2F%3E%3C%2Fsvg%3E')]";

function NuevaCita() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    clienteId: '', mascotaId: '', tipoCita: '', fecha: '', hora: '', motivo: '', duracion: '30',
    veterinarioId: '', consultorioId: '', notas: '', recordatorio: true, whatsapp: true, email: true,
  });
  const [motivoCount, setMotivoCount] = useState(0);
  const [notasCount, setNotasCount] = useState(0);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
    if (name === 'motivo') setMotivoCount(value.length);
    if (name === 'notas') setNotasCount(value.length);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Guardar cita:', form);
  };

  const mascotaSel = mascotas.find((m) => m.id === Number(form.mascotaId));
  const clienteSel = clientes.find((c) => c.id === Number(form.clienteId));
  const tipoSel = tiposCita.find((t) => t.id === Number(form.tipoCita));
  const vetSel = veterinarios.find((v) => v.id === Number(form.veterinarioId));
  const consultSel = consultorios.find((c) => c.id === Number(form.consultorioId));

  return (
    <div className="flex flex-col h-full gap-6">
      <div className="flex-none flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/agenda')} className="p-2 hover:bg-gray-200 dark:hover:bg-[#333] rounded-lg transition-colors cursor-pointer">
            <svg className="w-5 h-5 text-gray-600 dark:text-[#A0A0A0]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
          </button>
          <div>
            <nav className="text-sm text-gray-500 dark:text-[#909090] mb-1">
              <span className="hover:text-emerald-600 cursor-pointer" onClick={() => navigate('/agenda')}>Agenda</span>
              <span className="mx-2">/</span>
              <span className="hover:text-emerald-600 cursor-pointer" onClick={() => navigate('/agenda')}>Citas</span>
              <span className="mx-2">/</span>
              <span className="text-gray-800 dark:text-[#E0E0E0] font-medium">Nueva Cita</span>
            </nav>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-[#E0E0E0]">Nueva Cita</h1>
          </div>
        </div>
        <button onClick={() => navigate('/agenda')} className="flex items-center gap-2 rounded-xl border border-gray-300 dark:border-[#404040] bg-white dark:bg-[#2C2C2C] px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-[#D0D0D0] transition-colors hover:bg-gray-50 dark:hover:bg-[#333] cursor-pointer">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" /></svg>
          Volver a Agenda
        </button>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-6">
        <div className="col-span-7 space-y-5">
          <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl shadow-sm border border-gray-100 dark:border-[#333] p-6">
            <h2 className="text-base font-bold text-gray-800 dark:text-[#E0E0E0] mb-5 flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 text-xs font-bold">1</span>
              Información del Paciente
            </h2>
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className={labelClass}>Cliente (Dueño) *</label>
                <select name="clienteId" value={form.clienteId} onChange={handleChange} required className={selectClass}>
                  <option value="">Seleccionar cliente</option>
                  {clientes.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                </select>
                {clienteSel && <p className="text-xs text-gray-400 dark:text-[#808080] mt-1.5 pl-1">{clienteSel.telefono}</p>}
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <label className={labelClass}>Mascota *</label>
                  <button type="button" className="text-xs font-medium text-emerald-600 hover:text-emerald-700 transition-colors cursor-pointer">+ Nueva mascota</button>
                </div>
                <select name="mascotaId" value={form.mascotaId} onChange={handleChange} required className={selectClass}>
                  <option value="">Seleccionar mascota</option>
                  {mascotas.map((m) => <option key={m.id} value={m.id}>{m.nombre} - {m.raza}</option>)}
                </select>
                {mascotaSel && (
                  <div className="flex items-center gap-3 mt-3 p-2 rounded-lg bg-gray-50 dark:bg-[#2C2C2C]">
                    <img src={mascotaSel.foto} alt={mascotaSel.nombre} className="w-9 h-9 rounded-full" />
                    <div className="text-xs text-gray-500 dark:text-[#909090]">
                      <p className="font-semibold text-gray-700 dark:text-[#B0B0B0]">{mascotaSel.nombre}</p>
                      <p>{mascotaSel.raza} · {mascotaSel.edad} · {mascotaSel.peso}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-base font-bold text-gray-800 mb-5 flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 text-xs font-bold">2</span>
              Detalles de la Cita
            </h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className={labelClass}>Tipo de Cita *</label>
                <select name="tipoCita" value={form.tipoCita} onChange={handleChange} required className={selectClass}>
                  <option value="">Seleccionar tipo</option>
                  {tiposCita.map((t) => <option key={t.id} value={t.id}>{t.nombre}</option>)}
                </select>
                {tipoSel && (
                  <div className="flex items-center gap-2 mt-2">
                    <span className={'w-2.5 h-2.5 rounded-full ' + tipoSel.color} />
                    <span className="text-xs text-gray-500 dark:text-[#909090]">{tipoSel.nombre}</span>
                  </div>
                )}
              </div>
              <div>
                <label className={labelClass}>Fecha *</label>
                <input type="date" name="fecha" value={form.fecha} onChange={handleChange} required className={inputClass} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Motivo de la Cita *</label>
                <div className="relative">
                  <textarea name="motivo" value={form.motivo} onChange={handleChange} required maxLength={250} rows={3} className={inputClass + ' resize-none'} placeholder="Describa el motivo de la consulta..." />
                  <span className="absolute bottom-3 right-3 text-xs text-gray-400 dark:text-[#808080]">{motivoCount}/250</span>
                </div>
              </div>
              <div>
                <label className={labelClass}>Duración Estimada</label>
                <select name="duracion" value={form.duracion} onChange={handleChange} className={selectClass}>
                  {duraciones.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
                </select>
              </div>
            </div>
            {form.fecha && (
              <div className="mt-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-3 flex items-start gap-3">
                <svg className="w-5 h-5 text-blue-500 dark:text-blue-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" /></svg>
                <p className="text-sm text-blue-700 dark:text-blue-300">La cita se programará para el <span className="font-semibold">{form.fecha}</span>.</p>
              </div>
            )}
          </div>

          <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl shadow-sm border border-gray-100 dark:border-[#333] p-6">
            <h2 className="text-base font-bold text-gray-800 dark:text-[#E0E0E0] mb-5 flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 text-xs font-bold">3</span>
              Asignación
            </h2>
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className={labelClass}>Veterinario *</label>
                <select name="veterinarioId" value={form.veterinarioId} onChange={handleChange} required className={selectClass}>
                  <option value="">Seleccionar veterinario</option>
                  {veterinarios.map((v) => <option key={v.id} value={v.id}>{v.nombre}</option>)}
                </select>
                {vetSel && (
                  <div className="flex items-center gap-3 mt-3 p-2 rounded-lg bg-gray-50 dark:bg-[#2C2C2C]">
                    <img src={vetSel.foto} alt={vetSel.nombre} className="w-8 h-8 rounded-full" />
                    <div className="text-xs">
                      <p className="font-semibold text-gray-700 dark:text-[#B0B0B0]">{vetSel.nombre}</p>
                      <p className="text-gray-400 dark:text-[#808080]">{vetSel.especialidad}</p>
                    </div>
                  </div>
                )}
              </div>
              <div>
                <label className={labelClass}>Consultorio / Sala *</label>
                <select name="consultorioId" value={form.consultorioId} onChange={handleChange} required className={selectClass}>
                  <option value="">Seleccionar consultorio</option>
                  {consultorios.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                </select>
                {consultSel && (
                  <p className={'text-xs mt-1.5 pl-1 ' + (consultSel.disponible ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500')}>
                    {consultSel.disponible ? 'Disponible a esta hora' : 'No disponible'}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl shadow-sm border border-gray-100 dark:border-[#333] p-6">
            <h2 className="text-base font-bold text-gray-800 dark:text-[#E0E0E0] mb-5 flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 text-xs font-bold">4</span>
              Notas y Recordatorios
            </h2>
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className={labelClass}>Notas <span className="text-gray-400 font-normal">(Opcional)</span></label>
                <div className="relative">
                  <textarea name="notas" value={form.notas} onChange={handleChange} maxLength={250} rows={3} className={inputClass + ' resize-none'} placeholder="Notas adicionales..." />
                  <span className="absolute bottom-3 right-3 text-xs text-gray-400 dark:text-[#808080]">{notasCount}/250</span>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className={labelClass}>Recordatorio para el Cliente</label>
                  <div className="flex items-center gap-3 mt-2">
                    <button type="button" onClick={() => setForm({ ...form, recordatorio: !form.recordatorio })} className={'relative w-11 h-6 rounded-full transition-colors cursor-pointer ' + (form.recordatorio ? 'bg-[#5F7B65]' : 'bg-gray-300')}>
                      <span className={'absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ' + (form.recordatorio ? 'translate-x-5' : '')} />
                    </button>
                    <span className="text-sm text-gray-600 dark:text-[#A0A0A0]">{form.recordatorio ? 'Activado' : 'Desactivado'}</span>
                  </div>
                </div>
                {form.recordatorio && (
                  <div>
                    <label className={labelClass}>Enviar recordatorio por:</label>
                    <div className="space-y-2 mt-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" name="whatsapp" checked={form.whatsapp} onChange={handleChange} className="w-4 h-4 rounded border-gray-300 dark:border-[#404040] text-emerald-600 focus:ring-emerald-500 bg-white dark:bg-[#2C2C2C]" />
                        <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                        <span className="text-sm text-gray-600 dark:text-[#A0A0A0]">WhatsApp</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" name="email" checked={form.email} onChange={handleChange} className="w-4 h-4 rounded border-gray-300 dark:border-[#404040] text-emerald-600 focus:ring-emerald-500 bg-white dark:bg-[#2C2C2C]" />
                        <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" /></svg>
                        <span className="text-sm text-gray-600 dark:text-[#A0A0A0]">Correo electrónico</span>
                      </label>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 pt-2">
            <button type="button" onClick={() => navigate('/agenda')} className="px-6 py-3 border border-gray-300 dark:border-[#404040] rounded-xl text-gray-700 dark:text-[#D0D0D0] font-medium hover:bg-gray-50 dark:hover:bg-[#2C2C2C] transition-colors cursor-pointer flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
              Cancelar
            </button>
            <button type="submit" className="flex-1 py-3 bg-[#5F7B65] hover:bg-[#4E6553] text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
              Guardar Cita
            </button>
          </div>
        </div>

        <div className="col-span-5 space-y-5">
          <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl shadow-sm border border-gray-100 dark:border-[#333] p-6">
            <h3 className="text-sm font-bold text-gray-800 dark:text-[#E0E0E0] mb-4">Resumen de la Cita</h3>
            <div className="space-y-5">
              <div className="flex flex-col items-center text-center border-b border-gray-100 dark:border-[#333] pb-4">
                {mascotaSel ? (
                  <>
                    <img src={mascotaSel.foto} alt={mascotaSel.nombre} className="w-20 h-20 rounded-full object-cover mb-3 ring-2 ring-emerald-100" />
                    <p className="text-base font-bold text-gray-800 dark:text-[#E0E0E0]">{mascotaSel.nombre}</p>
                    <p className="text-xs text-gray-400 dark:text-[#808080]">{mascotaSel.raza} · {mascotaSel.edad} · {mascotaSel.peso}</p>
                  </>
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-[#2C2C2C] flex items-center justify-center mb-3">
                    <svg className="w-8 h-8 text-gray-300 dark:text-[#606060]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Z" /></svg>
                  </div>
                )}
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-gray-500 dark:text-[#909090]">Cliente:</span><span className="text-gray-800 dark:text-[#E0E0E0] font-medium">{clienteSel?.nombre || '—'}</span></div>
                <div className="flex justify-between"><span className="text-gray-500 dark:text-[#909090]">Teléfono:</span><span className="text-gray-800 dark:text-[#E0E0E0]">{clienteSel?.telefono || '—'}</span></div>
                <div className="border-t border-gray-100 dark:border-[#333]" />
                <div className="flex justify-between"><span className="text-gray-500 dark:text-[#909090]">Tipo de Cita:</span><span className="text-gray-800 dark:text-[#E0E0E0] font-medium flex items-center gap-1.5">{tipoSel ? <><span className={'w-2 h-2 rounded-full ' + tipoSel.color} />{tipoSel.nombre}</> : '—'}</span></div>
                <div className="flex justify-between"><span className="text-gray-500 dark:text-[#909090]">Fecha:</span><span className="text-gray-800 dark:text-[#E0E0E0] font-medium">{form.fecha || '—'}</span></div>
                <div className="flex justify-between"><span className="text-gray-500 dark:text-[#909090]">Duración:</span><span className="text-gray-800 dark:text-[#E0E0E0]">{duraciones.find((d) => d.value === form.duracion)?.label || '—'}</span></div>
                <div className="border-t border-gray-100 dark:border-[#333]" />
                <div className="flex justify-between"><span className="text-gray-500 dark:text-[#909090]">Veterinario:</span><span className="text-gray-800 dark:text-[#E0E0E0] font-medium">{vetSel?.nombre || '—'}</span></div>
                <div className="flex justify-between"><span className="text-gray-500 dark:text-[#909090]">Consultorio:</span><span className="text-gray-800 dark:text-[#E0E0E0]">{consultSel?.nombre || '—'}</span></div>
              </div>
            </div>

            <div className="mt-5 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-3 flex items-start gap-2">
              <svg className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" /></svg>
              <p className="text-xs text-emerald-700 dark:text-emerald-300 leading-relaxed">Por favor confirma que toda la información sea correcta antes de guardar la cita.</p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default NuevaCita;
