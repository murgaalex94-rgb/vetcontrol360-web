import { useState } from 'react';
import API from '../services/axiosConfig';
import ubigeoPeru from '../data/ubigeoPeru';
import MaterialDatePicker from './MaterialDatePicker';

const INITIAL_FORM = {
  nombres: '',
  apellidos: '',
  dni: '',
  fechaNacimiento: '',
  edad: '',
  genero: '',
  estadoCivil: '',
  telefono: '',
  whatsapp: '',
  email: '',
  direccion: '',
  departamento: '',
  provincia: '',
  distrito: '',
  referencia: '',
  notas: '',
};

function NuevoClienteModal({ onClose, onCreado }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'dni' && !/^\d*$/.test(value)) return;

    const updates = { [name]: value };

    if (name === 'departamento') {
      updates.provincia = '';
      updates.distrito = '';
    } else if (name === 'provincia') {
      updates.distrito = '';
    } else if (name === 'fechaNacimiento' && value) {
      updates.edad = calcularEdad(value);
    }

    setForm((prev) => ({ ...prev, ...updates }));
  };

  const calcularEdad = (fecha) => {
    if (!fecha) return '';
    const hoy = new Date();
    const nacimiento = new Date(fecha);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    return edad >= 0 ? edad.toString() : '';
  };

  const limpiarForm = () => {
    setForm(INITIAL_FORM);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    console.log('=== DATOS DEL CLIENTE ===');
    console.log('Sección 1 - Datos Personales:', {
      nombres: form.nombres,
      apellidos: form.apellidos,
      dni: form.dni,
      fechaNacimiento: form.fechaNacimiento,
      edad: form.edad,
      genero: form.genero,
      estadoCivil: form.estadoCivil,
    });
    console.log('Sección 2 - Información de Contacto:', {
      telefono: form.telefono,
      whatsapp: form.whatsapp,
      email: form.email,
    });
    console.log('Sección 3 - Dirección:', {
      direccion: form.direccion,
      departamento: form.departamento,
      provincia: form.provincia,
      distrito: form.distrito,
      referencia: form.referencia,
    });
    console.log('Sección 4 - Información Adicional:', {
      notas: form.notas,
    });
    console.log('=======================');

    setSaving(true);
    try {
      var payload = {
        nombre: `${form.nombres} ${form.apellidos}`.trim(),
        apellidos: form.apellidos,
        dni: form.dni,
        telefono: form.telefono,
        whatsapp: form.whatsapp || null,
        email: form.email || null,
        fechaNacimiento: form.fechaNacimiento || null,
        edad: form.edad ? Number(form.edad) : null,
        genero: form.genero,
        estadoCivil: form.estadoCivil,
        direccion: form.direccion,
        departamento: form.departamento,
        provincia: form.provincia,
        distrito: form.distrito,
        referencia: form.referencia || null,
        notas: form.notas || null,
      };
      await API.post('/clientes', payload);
      onCreado();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  const departamentos = Object.keys(ubigeoPeru);
  const provincias = form.departamento ? Object.keys(ubigeoPeru[form.departamento]) : [];
  const distritos = form.departamento && form.provincia ? ubigeoPeru[form.departamento][form.provincia] : [];

  const inputClass = "w-full px-4 py-2.5 border border-gray-300 dark:border-[#404040] rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all bg-white dark:bg-[#2C2C2C] text-gray-900 dark:text-[#E0E0E0] text-sm";
  const inputDisabledClass = "w-full px-4 py-2.5 border border-gray-200 dark:border-[#333] rounded-lg bg-gray-100 dark:bg-[#1E1E1E] text-gray-500 dark:text-[#808080] text-sm cursor-not-allowed";
  const labelClass = "block text-sm font-medium text-gray-700 dark:text-[#C0C0C0] mb-1.5";
  const selectClass = "w-full px-4 py-2.5 border border-gray-300 dark:border-[#404040] rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all bg-white dark:bg-[#2C2C2C] text-gray-900 dark:text-[#E0E0E0] text-sm appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22%236b7280%22%3E%3Cpath%20fill-rule%3D%22evenodd%22%20d%3D%22M5.23%207.21a.75.75%200%20011.06.02L10%2011.168l3.71-3.938a.75.75%200%20111.08%201.04l-4.25%204.5a.75.75%200%2001-1.08%200l-4.25-4.5a.75.75%200%2001.02-1.06z%22%20clip-rule%3D%22evenodd%22%20%2F%3E%3C%2Fsvg%3E')] dark:bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22%23909090%22%3E%3Cpath%20fill-rule%3D%22evenodd%22%20d%3D%22M5.23%207.21a.75.75%200%20011.06.02L10%2011.168l3.71-3.938a.75.75%200%20111.08%201.04l-4.25%204.5a.75.75%200%2001-1.08%200l-4.25-4.5a.75.75%200%2001.02-1.06z%22%20clip-rule%3D%22evenodd%22%20%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem] bg-[right_0.5rem_center] bg-no-repeat pr-10";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto mx-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-8 py-6 border-b border-gray-200 dark:border-[#333]">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-[#E0E0E0]">Nuevo Cliente (Dueño)</h2>
            <p className="text-sm text-gray-500 dark:text-[#909090] mt-0.5">Completa la información del cliente</p>
          </div>
          <button type="button" onClick={onClose} className="text-gray-400 dark:text-[#808080] hover:text-gray-600 dark:hover:text-[#A0A0A0] text-2xl leading-none p-1 cursor-pointer">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {error && (
            <div className="flex items-center gap-2 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 text-sm">
              <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <section>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2 pb-2 border-b border-gray-100">
              <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
              </svg>
              Datos Personales
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className={labelClass}>Nombres <span className="text-red-500">*</span></label>
                <input type="text" name="nombres" value={form.nombres} onChange={handleChange} required className={inputClass} placeholder="Ej: Juan Carlos" />
              </div>
              <div>
                <label className={labelClass}>Apellidos <span className="text-red-500">*</span></label>
                <input type="text" name="apellidos" value={form.apellidos} onChange={handleChange} required className={inputClass} placeholder="Ej: Pérez García" />
              </div>
              <div>
                <label className={labelClass}>DNI <span className="text-red-500">*</span></label>
                <input type="text" name="dni" value={form.dni} onChange={handleChange} required maxLength={8} className={inputClass} placeholder="Ej: 12345678" />
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4 mt-4">
              <div>
                <MaterialDatePicker
                  value={form.fechaNacimiento}
                  onChange={function (val) { handleChange({ target: { name: 'fechaNacimiento', value: val } }); }}
                  label="Fecha de Nacimiento"
                />
              </div>
              <div>
                <label className={labelClass}>Edad</label>
                <input type="text" name="edad" value={form.edad} readOnly disabled className={inputDisabledClass} placeholder="--" />
              </div>
              <div>
                <label className={labelClass}>Género <span className="text-red-500">*</span></label>
                <select name="genero" value={form.genero} onChange={handleChange} required className={selectClass}>
                  <option value="">Seleccionar</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Femenino">Femenino</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Estado Civil <span className="text-red-500">*</span></label>
                <select name="estadoCivil" value={form.estadoCivil} onChange={handleChange} required className={selectClass}>
                  <option value="">Seleccionar</option>
                  <option value="Soltero/a">Soltero/a</option>
                  <option value="Casado/a">Casado/a</option>
                  <option value="Divorciado/a">Divorciado/a</option>
                  <option value="Viudo/a">Viudo/a</option>
                </select>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-[#E0E0E0] mb-4 flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-[#333]">
              <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
              </svg>
              Información de Contacto
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className={labelClass}>Teléfono <span className="text-red-500">*</span></label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                    </svg>
                  </span>
                  <input type="text" name="telefono" value={form.telefono} onChange={handleChange} required className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-[#404040] rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all bg-white dark:bg-[#2C2C2C] text-gray-900 dark:text-[#E0E0E0] text-sm" placeholder="Ej: 987654321" />
                </div>
              </div>
              <div>
                <label className={labelClass}>WhatsApp</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2">
                    <svg className="w-4 h-4 text-green-500 dark:text-green-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                  </span>
                  <input type="text" name="whatsapp" value={form.whatsapp} onChange={handleChange} className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-[#404040] rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all bg-white dark:bg-[#2C2C2C] text-gray-900 dark:text-[#E0E0E0] text-sm" placeholder="Ej: 987654321" />
                </div>
              </div>
              <div>
                <label className={labelClass}>Email</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                    </svg>
                  </span>
                  <input type="email" name="email" value={form.email} onChange={handleChange} className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-[#404040] rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all bg-white dark:bg-[#2C2C2C] text-gray-900 dark:text-[#E0E0E0] text-sm" placeholder="Ej: juan@email.com" />
                </div>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-[#E0E0E0] mb-4 flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-[#333]">
              <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
              </svg>
              Dirección
            </h3>
            <div>
              <label className={labelClass}>Dirección <span className="text-red-500">*</span></label>
              <input type="text" name="direccion" value={form.direccion} onChange={handleChange} required className={inputClass} placeholder="Ej: Av. Principal 123" />
            </div>
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div>
                <label className={labelClass}>Departamento <span className="text-red-500">*</span></label>
                <select name="departamento" value={form.departamento} onChange={handleChange} required className={selectClass}>
                  <option value="">Seleccionar departamento</option>
                  {departamentos.map((dep) => (
                    <option key={dep} value={dep}>{dep}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Provincia <span className="text-red-500">*</span></label>
                <select name="provincia" value={form.provincia} onChange={handleChange} required disabled={!form.departamento} className={form.departamento ? selectClass : inputDisabledClass}>
                  <option value="">Seleccionar provincia</option>
                  {provincias.map((prov) => (
                    <option key={prov} value={prov}>{prov}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Distrito <span className="text-red-500">*</span></label>
                <select name="distrito" value={form.distrito} onChange={handleChange} required disabled={!form.provincia} className={form.provincia ? selectClass : inputDisabledClass}>
                  <option value="">Seleccionar distrito</option>
                  {distritos.map((dist) => (
                    <option key={dist} value={dist}>{dist}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-4">
              <label className={labelClass}>Referencia</label>
              <input type="text" name="referencia" value={form.referencia} onChange={handleChange} className={inputClass} placeholder="Ej: Cerca al parque principal" />
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-[#E0E0E0] mb-4 flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-[#333]">
              <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
              </svg>
              Información Adicional
            </h3>
            <div>
              <label className={labelClass}>Notas / Observaciones</label>
              <textarea name="notas" value={form.notas} onChange={handleChange} rows={4} className="w-full px-4 py-2.5 border border-gray-300 dark:border-[#404040] rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all bg-white dark:bg-[#2C2C2C] text-gray-900 dark:text-[#E0E0E0] text-sm resize-none" placeholder="Escribe cualquier información adicional aquí..." />
            </div>
          </section>

          <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-[#333]">
            <button type="button" onClick={limpiarForm} className="flex items-center gap-2 px-6 py-2.5 border border-gray-300 dark:border-[#404040] rounded-lg text-gray-700 dark:text-[#C0C0C0] font-medium hover:bg-gray-50 dark:hover:bg-[#2C2C2C] transition-colors cursor-pointer text-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182" />
              </svg>
              Limpiar
            </button>
            <div className="flex items-center gap-3">
              <button type="button" onClick={onClose} className="px-6 py-2.5 border border-gray-300 dark:border-[#404040] rounded-lg text-gray-700 dark:text-[#C0C0C0] font-medium hover:bg-gray-50 dark:hover:bg-[#2C2C2C] transition-colors cursor-pointer text-sm">
                Cancelar
              </button>
              <button type="submit" disabled={saving} className="flex items-center gap-2 px-6 py-2.5 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 cursor-pointer text-sm" style={{ backgroundColor: '#0B5E4B' }}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
                {saving ? 'Guardando...' : 'Guardar Cliente'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NuevoClienteModal;