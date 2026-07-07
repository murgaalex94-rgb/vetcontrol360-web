import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/axiosConfig';
import MaterialDatePicker from '../components/MaterialDatePicker';

const VACUNAS_OPCIONES = ['Sextuple', 'Rabia', 'Bordetella', 'Múltiple', 'Parvovirus', 'Leucemia', 'Moquillo', 'Hepatitis'];
const LABORATORIOS = ['Zoetis', 'Merial', 'Boehringer Ingelheim', 'Virbac', 'MSD Animal Health', 'Elanco'];
const VETERINARIOS = ['Dra. María García', 'Dr. Carlos López', 'Dr. Roberto Sánchez', 'Dra. Ana Martínez'];
const VIA_APLICACION = ['Subcutánea', 'Intramuscular', 'Intranasal', 'Oral', 'Tópica'];

const INFO_VACUNAS = {
  'Sextuple': { desc: 'Protege contra moquillo, hepatitis, parvovirus, parainfluenza, leptospirosis y adenovirus.', enf: ['Moquillo', 'Hepatitis', 'Parvovirus', 'Parainfluenza', 'Leptospirosis'] },
  'Rabia': { desc: 'Vacuna antirrábica obligatoria. Protege contra el virus de la rabia.', enf: ['Rabia'] },
  'Bordetella': { desc: 'Protege contra la traqueobronquitis infecciosa canina.', enf: ['Bordetella bronchiseptica'] },
  'Múltiple': { desc: 'Vacuna combinada contra enfermedades comunes.', enf: ['Moquillo', 'Hepatitis', 'Parvovirus', 'Parainfluenza'] },
  'Parvovirus': { desc: 'Vacuna específica contra el parvovirus canino.', enf: ['Parvovirus'] },
  'Leucemia': { desc: 'Vacuna contra el virus de la leucemia felina.', enf: ['Leucemia Felina'] },
  'Moquillo': { desc: 'Vacuna contra el moquillo canino (Distemper).', enf: ['Moquillo'] },
  'Hepatitis': { desc: 'Vacuna contra la hepatitis infecciosa canina.', enf: ['Adenovirus canino tipo 1'] },
};

function MascotaSelector({ mascotas, value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const selected = mascotas.find((m) => m.id === Number(value));

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button type="button" onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 px-4 py-3 border border-gray-300 dark:border-[#404040] rounded-xl hover:border-sage transition-colors cursor-pointer text-left bg-white dark:bg-[#2C2C2C]">
        {selected ? (
          <>
            <div className="w-11 h-11 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-sm shrink-0 overflow-hidden">
              {selected.foto ? <img src={selected.foto} alt="" className="w-full h-full object-cover" /> : selected.nombre?.[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800 dark:text-[#E0E0E0]">{selected.nombre}</p>
              <p className="text-xs text-gray-500 dark:text-[#909090] truncate">{selected.especie || 'N/E'} · {selected.raza || 'Sin raza'} · {selected.peso ? `${selected.peso} kg` : ''}</p>
            </div>
          </>
        ) : (
          <p className="text-sm text-gray-400 dark:text-[#808080] flex-1">Seleccionar mascota</p>
        )}
        <svg className={`w-4 h-4 text-gray-400 dark:text-[#808080] shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
        </svg>
      </button>
      {open && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-[#333] rounded-xl shadow-lg max-h-64 overflow-y-auto">
          {mascotas.length === 0 ? (
            <p className="p-4 text-sm text-gray-500 text-center">No hay mascotas registradas</p>
          ) : mascotas.map((m) => (
            <button key={m.id} type="button" onClick={() => { onChange(m.id); setOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors text-left cursor-pointer ${Number(value) === m.id ? 'bg-emerald-50 dark:bg-emerald-900/20' : ''}`}>
              <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-xs shrink-0 overflow-hidden">
                {m.foto ? <img src={m.foto} alt="" className="w-full h-full object-cover" /> : m.nombre?.[0]}
              </div>
              <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800 dark:text-[#E0E0E0]">{m.nombre}</p>
              <p className="text-xs text-gray-500 dark:text-[#909090] truncate">{m.especie || 'N/E'} · {m.raza || 'Sin raza'} · {m.peso ? `${m.peso} kg` : ''}</p>
              </div>
              {Number(value) === m.id && (
                <svg className="w-4 h-4 text-emerald-600 shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function NuevaVacuna() {
  const navigate = useNavigate();
  const [mascotas, setMascotas] = useState([]);
  const [recordatorio, setRecordatorio] = useState(true);
  const [obsCount, setObsCount] = useState(0);
  const [notasCount, setNotasCount] = useState(0);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    mascotaId: '', vacuna: '', lote: '', laboratorio: '', fechaAplicacion: '', proximaDosis: '',
    aplicadaPor: '', viaAplicacion: '', sitioAplicacion: '', estado: 'Aplicada', observaciones: '',
    tipoRecordatorio: 'proxima_dosis', diasAntes: '7', notasAdicionales: '',
  });

  useEffect(() => {
    API.get('/mascotas').then(({ data }) => setMascotas(data)).catch(console.error);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (name === 'observaciones') setObsCount(value.length);
    if (name === 'notasAdicionales') setNotasCount(value.length);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await API.post('/vacunas', {
        mascota: { id: Number(form.mascotaId) },
        vacuna: form.vacuna,
        lote: form.lote,
        laboratorio: form.laboratorio || null,
        fechaAplicacion: form.fechaAplicacion,
        proximaDosis: form.proximaDosis || null,
        aplicadaPor: form.aplicadaPor,
        viaAplicacion: form.viaAplicacion || null,
        sitioAplicacion: form.sitioAplicacion || null,
        estado: form.estado,
        observaciones: form.observaciones || null,
      });
      navigate('/vacunacion');
    } catch (err) {
      console.error('Error al guardar vacuna:', err);
      alert('Error al guardar la vacuna. Intente nuevamente.');
    } finally {
      setSaving(false);
    }
  };

  const inputClass = "w-full px-4 py-2.5 border border-gray-300 dark:border-[#404040] rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all bg-white dark:bg-[#2C2C2C] text-gray-900 dark:text-[#E0E0E0] text-sm";
  const labelClass = "block text-sm font-medium text-gray-700 dark:text-[#B0B0B0] mb-1.5";
  const selectClass = `${inputClass} appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22%236b7280%22%3E%3Cpath%20fill-rule%3D%22evenodd%22%20d%3D%22M5.23%207.21a.75.75%200%20011.06.02L10%2011.168l3.71-3.938a.75.75%200%20111.08%201.04l-4.25%204.5a.75.75%200%2001-1.08%200l-4.25-4.5a.75.75%200%2001.02-1.06z%22%20clip-rule%3D%22evenodd%22%20%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem] bg-[right_0.5rem_center] bg-no-repeat pr-10 dark:bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22%23909090%22%3E%3Cpath%20fill-rule%3D%22evenodd%22%20d%3D%22M5.23%207.21a.75.75%200%20011.06.02L10%2011.168l3.71-3.938a.75.75%200%20111.08%201.04l-4.25%204.5a.75.75%200%2001-1.08%200l-4.25-4.5a.75.75%200%2001.02-1.06z%22%20clip-rule%3D%22evenodd%22%20%2F%3E%3C%2Fsvg%3E')]`;

  return (
    <div className="flex flex-col h-full gap-6">
      <div className="flex-none flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/vacunacion')} className="p-2 hover:bg-gray-200 dark:hover:bg-[#333] rounded-lg transition-colors cursor-pointer">
            <svg className="w-5 h-5 text-gray-600 dark:text-[#A0A0A0]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
          </button>
          <div>
            <nav className="text-sm text-gray-500 dark:text-[#909090] mb-1">
              <span className="hover:text-emerald-600 cursor-pointer" onClick={() => navigate('/vacunacion')}>Vacunación</span>
              <span className="mx-2">/</span>
              <span className="text-gray-800 dark:text-[#E0E0E0] font-medium">Nueva Vacuna</span>
            </nav>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-[#E0E0E0]">Nueva Vacuna</h1>
          </div>
        </div>
        <button onClick={() => navigate('/vacunacion')}
          className="px-5 py-2.5 border border-gray-300 dark:border-[#404040] text-gray-700 dark:text-[#D0D0D0] text-sm font-medium rounded-xl hover:bg-gray-50 dark:hover:bg-[#2C2C2C] transition-colors cursor-pointer flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" /></svg>
          Volver a Vacunación
        </button>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-6">
        <div className="col-span-8 space-y-5">
          <div className="grid grid-cols-2 gap-5">
            <div className="bg-white dark:bg-[#1E1E1E] rounded-xl shadow-sm border border-gray-100 dark:border-[#333] p-5">
              <h3 className="text-sm font-bold text-gray-800 dark:text-[#E0E0E0] mb-4 flex items-center gap-2">
                <span className="w-5 h-5 bg-emerald-100 rounded flex items-center justify-center">
                  <svg className="w-3 h-3 text-emerald-600" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Z" />
                  </svg>
                </span>
                Información de la Mascota
              </h3>
              <MascotaSelector mascotas={mascotas} value={form.mascotaId} onChange={(id) => setForm({ ...form, mascotaId: id })} />
            </div>

            <div className="bg-white dark:bg-[#1E1E1E] rounded-xl shadow-sm border border-gray-100 dark:border-[#333] p-5">
              <h3 className="text-sm font-bold text-gray-800 dark:text-[#E0E0E0] mb-4 flex items-center gap-2">
                <span className="w-5 h-5 bg-emerald-100 rounded flex items-center justify-center">
                  <svg className="w-3 h-3 text-emerald-600" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                  </svg>
                </span>
                Información de la Vacuna
              </h3>
              <div className="space-y-3.5">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>Vacuna *</label>
                    <select name="vacuna" value={form.vacuna} onChange={handleChange} required className={selectClass}>
                      <option value="">Seleccionar vacuna</option>
                      {VACUNAS_OPCIONES.map((v) => <option key={v} value={v}>{v}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Lote *</label>
                    <input type="text" name="lote" value={form.lote} onChange={handleChange} required className={inputClass} placeholder="Ej: L12345" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>Laboratorio</label>
                    <select name="laboratorio" value={form.laboratorio} onChange={handleChange} className={selectClass}>
                      <option value="">Seleccionar laboratorio</option>
                      {LABORATORIOS.map((l) => <option key={l} value={l}>{l}</option>)}
                    </select>
                  </div>
                  <div>
                    <MaterialDatePicker value={form.fechaAplicacion} onChange={function (val) { handleChange({ target: { name: 'fechaAplicacion', value: val } }); }} label="Fecha de Aplicación *" placeholder="DD/MM/YYYY" />
                  </div>
                </div>
                <div>
                  <MaterialDatePicker value={form.proximaDosis} onChange={function (val) { handleChange({ target: { name: 'proximaDosis', value: val } }); }} label="Próxima Dosis" placeholder="DD/MM/YYYY" />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5">
             <div className="bg-white dark:bg-[#1E1E1E] rounded-xl shadow-sm border border-gray-100 dark:border-[#333] p-5">
              <h3 className="text-sm font-bold text-gray-800 dark:text-[#E0E0E0] mb-4 flex items-center gap-2">
                <span className="w-5 h-5 bg-emerald-100 rounded flex items-center justify-center">
                  <svg className="w-3 h-3 text-emerald-600" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                </span>
                Detalles de la Aplicación
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Aplicada por *</label>
                    <select name="aplicadaPor" value={form.aplicadaPor} onChange={handleChange} required className={selectClass}>
                      <option value="">Seleccionar veterinario</option>
                      {VETERINARIOS.map((v) => <option key={v} value={v}>{v}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Vía de Aplicación</label>
                    <select name="viaAplicacion" value={form.viaAplicacion} onChange={handleChange} className={selectClass}>
                      <option value="">Seleccionar vía</option>
                      {VIA_APLICACION.map((v) => <option key={v} value={v}>{v}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Sitio de Aplicación</label>
                  <input type="text" name="sitioAplicacion" value={form.sitioAplicacion} onChange={handleChange} className={inputClass} placeholder="Ej: Miembro anterior derecho" />
                </div>
                <div>
                  <label className={labelClass}>Estado</label>
                  <div className="flex items-center gap-3 mt-1.5">
                    <button type="button" onClick={() => setForm({ ...form, estado: 'Aplicada' })}
                      className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 transition-all cursor-pointer border-2 ${
                          form.estado === 'Aplicada' ? 'bg-emerald-50 text-emerald-700 border-sage' : 'bg-white dark:bg-[#1E1E1E] text-emerald-600 dark:text-emerald-400 border-emerald-300 dark:border-emerald-700 hover:border-emerald-400 dark:hover:border-emerald-600'
                        }`}>
                       <span className={`w-2.5 h-2.5 rounded-full ${form.estado === 'Aplicada' ? 'bg-emerald-600' : 'bg-emerald-300'}`} />
                       Aplicada
                    </button>
                    <button type="button" onClick={() => setForm({ ...form, estado: 'Pendiente' })}
                      className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 transition-all cursor-pointer border-2 ${
                          form.estado === 'Pendiente' ? 'bg-red-50 text-red-700 border-red-400' : 'bg-white dark:bg-[#1E1E1E] text-orange-600 dark:text-orange-400 border-orange-300 dark:border-orange-700 hover:border-orange-400 dark:hover:border-orange-600'
                       }`}>
                       <span className={`w-2.5 h-2.5 rounded-full ${form.estado === 'Pendiente' ? 'bg-terracotta' : 'bg-orange-300'}`} />
                       Pendiente
                    </button>
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Observaciones</label>
                  <textarea name="observaciones" value={form.observaciones} onChange={handleChange} maxLength={250} rows={3}
                    className={`${inputClass} resize-none`} placeholder="Ej: Sin reacciones adversas. Mascota en buen estado." />
                  <p className="text-xs text-gray-400 dark:text-[#808080] mt-1 text-right">{obsCount}/250</p>
                </div>
              </div>
            </div>

             <div className="bg-white dark:bg-[#1E1E1E] rounded-xl shadow-sm border border-gray-100 dark:border-[#333] p-5">
              <h3 className="text-sm font-bold text-gray-800 dark:text-[#E0E0E0] mb-4 flex items-center gap-2">
                <span className="w-5 h-5 bg-emerald-100 rounded flex items-center justify-center">
                  <svg className="w-3 h-3 text-emerald-600" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
                  </svg>
                </span>
                Recordatorio y Próxima Dosis
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between bg-gray-50 dark:bg-[#2C2C2C] rounded-xl px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-[#E0E0E0]">Programar recordatorio</p>
                    <p className="text-xs text-gray-500 dark:text-[#909090]">El sistema generará un recordatorio automático.</p>
                  </div>
                  <button type="button" onClick={() => setRecordatorio(!recordatorio)}
                    className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer shrink-0 ${recordatorio ? 'bg-[#5F7B65]' : 'bg-gray-300'}`}>
                    <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${recordatorio ? 'translate-x-5' : ''}`} />
                  </button>
                </div>

                {recordatorio && (
                  <>
                    <div>
                      <label className={labelClass}>Tipo de Recordatorio</label>
                      <div className="flex items-center gap-4 mt-1">
                        {[
                          { value: 'proxima_dosis', label: 'Próxima dosis' },
                          { value: 'refuerzo_anual', label: 'Refuerzo anual' },
                          { value: 'personalizado', label: 'Personalizado' },
                        ].map((opt) => (
                          <label key={opt.value} className="flex items-center gap-2 text-sm text-gray-700 dark:text-[#B0B0B0] cursor-pointer">
                            <input type="radio" name="tipoRecordatorio" value={opt.value} checked={form.tipoRecordatorio === opt.value} onChange={handleChange}
                              className="appearance-none w-4 h-4 border-2 border-gray-300 rounded-full checked:border-[#5F7B65] checked:bg-[#5F7B65] transition-all" />
                            {opt.label}
                          </label>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className={labelClass}>Días antes del recordatorio</label>
                      <select name="diasAntes" value={form.diasAntes} onChange={handleChange} className={selectClass}>
                        <option value="1">1 día antes</option>
                        <option value="3">3 días antes</option>
                        <option value="7">7 días antes</option>
                        <option value="14">14 días antes</option>
                        <option value="30">30 días antes</option>
                      </select>
                    </div>
                    <div>
                      <label className={labelClass}>Notas Adicionales <span className="text-gray-400 font-normal">(opcional)</span></label>
                      <textarea name="notasAdicionales" value={form.notasAdicionales} onChange={handleChange} maxLength={250} rows={3}
                        className={`${inputClass} resize-none`} placeholder="Información adicional sobre la próxima dosis..." />
                      <p className="text-xs text-gray-400 dark:text-[#808080] mt-1 text-right">{notasCount}/250</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex-none flex items-center justify-between border-t border-gray-200 dark:border-[#333] bg-white dark:bg-[#1E1E1E] rounded-xl px-5 py-3 -mx-1">
            <button type="button" onClick={() => navigate('/vacunacion')}
              className="px-5 py-2.5 border border-gray-300 dark:border-[#404040] rounded-xl text-gray-700 dark:text-[#D0D0D0] font-medium hover:bg-gray-50 dark:hover:bg-[#2C2C2C] transition-colors cursor-pointer flex items-center gap-2 text-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
              Cancelar
            </button>
            <button type="submit" disabled={saving}
              className="px-6 py-2.5 bg-[#5F7B65] hover:bg-[#4E6553] text-white font-semibold rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer text-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
              {saving ? 'Guardando...' : 'Guardar Vacuna'}
            </button>
          </div>
        </div>

        <div className="col-span-4 flex flex-col h-full">
            <div className="flex-none bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-5 space-y-3">
            <h4 className="text-sm font-bold text-blue-800 dark:text-blue-300 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
              </svg>
              Información de la Vacuna
            </h4>
            <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">Selecciona una vacuna para ver información detallada como:</p>
            <div className="space-y-2">
              {['Descripción', 'Enfermedades que previene', 'Esquema recomendado', 'Indicaciones y contraindicaciones'].map((item) => (
                <div key={item} className="flex items-center gap-2 text-xs text-blue-700 dark:text-blue-300">
                  <svg className="w-3.5 h-3.5 text-blue-500 shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1 bg-white dark:bg-[#1E1E1E] rounded-xl shadow-sm border border-gray-100 dark:border-[#333] p-8 flex flex-col items-center justify-center mt-5">
            {form.vacuna && INFO_VACUNAS[form.vacuna] ? (
              <div className="space-y-2 text-center">
                <div className="w-12 h-12 mx-auto bg-emerald-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                </div>
                <p className="text-sm font-semibold text-gray-800 dark:text-[#E0E0E0]">{form.vacuna}</p>
                <p className="text-xs text-gray-500 dark:text-[#909090] leading-relaxed">{INFO_VACUNAS[form.vacuna].desc}</p>
                <div className="flex flex-wrap gap-1 justify-center mt-1">
                  {INFO_VACUNAS[form.vacuna].enf.map((e) => (
                    <span key={e} className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded text-[10px]">{e}</span>
                  ))}
                </div>
              </div>
            ) : (
              <>
                <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mb-3">
                  <svg className="w-7 h-7 text-emerald-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m5.25 0v3.75m-3.75 0h3.75m-3.75 3.75h3.75m-4.5 3.75h6.75A2.25 2.25 0 0 1 21 12.75v6.75A2.25 2.25 0 0 1 18.75 21H5.25A2.25 2.25 0 0 1 3 18.75v-6.75A2.25 2.25 0 0 1 5.25 9h1.5m3.75 0h1.5" />
                  </svg>
                </div>
                <p className="text-sm font-semibold text-gray-700 dark:text-[#B0B0B0]">Selecciona una vacuna</p>
                <p className="text-xs text-gray-400 dark:text-[#808080] mt-0.5">para ver su información detallada aquí.</p>
              </>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}

export default NuevaVacuna;
