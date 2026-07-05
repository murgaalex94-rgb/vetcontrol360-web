import { useState } from 'react';
import MaterialDatePicker from '../components/MaterialDatePicker';

function NuevaConsultaModal({ onClose }) {
  var now = new Date();
  var timeStr = String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');

  var [form, setForm] = useState({
    fecha: new Date().toISOString().split('T')[0],
    hora: timeStr,
    tipoConsulta: '',
    motivo: '',
    sintomas: '',
    diagnostico: '',
    tratamiento: '',
    notas: '',
  });

  function handleChange(field, value) {
    setForm(function (prev) {
      var next = Object.assign({}, prev);
      next[field] = value;
      return next;
    });
  }

  function handleSubmit() {
    console.log('Nueva Consulta:', JSON.stringify(form, null, 2));
    onClose();
  }

  var inputClass = 'w-full rounded-xl border border-gray-300 dark:border-[#404040] bg-white dark:bg-[#2C2C2C] px-4 py-2.5 text-sm text-gray-800 dark:text-[#E0E0E0] transition-colors focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20';
  var textareaClass = 'w-full rounded-xl border border-gray-300 dark:border-[#404040] bg-white dark:bg-[#2C2C2C] px-4 py-3 text-sm text-gray-800 dark:text-[#E0E0E0] transition-colors focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 resize-none';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl shadow-2xl w-full max-w-[700px] max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-[#333]">
          <h2 className="text-lg font-bold text-gray-800 dark:text-[#E0E0E0]">Nueva Consulta</h2>
          <button onClick={onClose} className="h-8 w-8 flex items-center justify-center rounded-lg text-gray-400 dark:text-[#808080] hover:bg-gray-100 dark:hover:bg-[#2C2C2C] hover:text-gray-600 dark:hover:text-[#A0A0A0] transition-colors cursor-pointer">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">
          <div>
            <p className="text-xs font-semibold text-gray-500 dark:text-[#909090] uppercase tracking-wider mb-3">Información Básica</p>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <MaterialDatePicker value={form.fecha} onChange={function (val) { handleChange('fecha', val); }} label="Fecha de Consulta *" placeholder="DD/MM/YYYY" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-[#B0B0B0] mb-1.5">Hora *</label>
                <input type="time" value={form.hora} onChange={function (e) { handleChange('hora', e.target.value); }} className={inputClass} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-[#B0B0B0] mb-1.5">Tipo de Consulta *</label>
                <select value={form.tipoConsulta} onChange={function (e) { handleChange('tipoConsulta', e.target.value); }} className={inputClass}>
                  <option value="">Seleccionar tipo...</option>
                  <option value="Consulta General">Consulta General</option>
                  <option value="Vacunación">Vacunación</option>
                  <option value="Examen de Laboratorio">Examen de Laboratorio</option>
                  <option value="Desparasitación">Desparasitación</option>
                  <option value="Cirugía">Cirugía</option>
                  <option value="Control / Revisión">Control / Revisión</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-gray-500 dark:text-[#909090] uppercase tracking-wider mb-3">Motivo y Síntomas</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-[#B0B0B0] mb-1.5">Motivo de Consulta *</label>
                <div className="relative">
                  <textarea value={form.motivo} onChange={function (e) { handleChange('motivo', e.target.value); }} maxLength={500} rows={3} placeholder="Describe el motivo de la consulta..." className={textareaClass} />
                  <span className="absolute bottom-2 right-3 text-[10px] text-gray-400 dark:text-[#808080]">{form.motivo.length}/500</span>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-[#B0B0B0] mb-1.5">Síntomas Observados</label>
                <div className="relative">
                  <textarea value={form.sintomas} onChange={function (e) { handleChange('sintomas', e.target.value); }} maxLength={500} rows={3} placeholder="Describe los síntomas observados..." className={textareaClass} />
                  <span className="absolute bottom-2 right-3 text-[10px] text-gray-400 dark:text-[#808080]">{form.sintomas.length}/500</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-gray-500 dark:text-[#909090] uppercase tracking-wider mb-3">Diagnóstico y Tratamiento</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-[#B0B0B0] mb-1.5">Diagnóstico</label>
                <div className="relative">
                  <textarea value={form.diagnostico} onChange={function (e) { handleChange('diagnostico', e.target.value); }} maxLength={500} rows={3} placeholder="Ingresa el diagnóstico..." className={textareaClass} />
                  <span className="absolute bottom-2 right-3 text-[10px] text-gray-400 dark:text-[#808080]">{form.diagnostico.length}/500</span>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-[#B0B0B0] mb-1.5">Tratamiento</label>
                <div className="relative">
                  <textarea value={form.tratamiento} onChange={function (e) { handleChange('tratamiento', e.target.value); }} maxLength={500} rows={3} placeholder="Ingresa el tratamiento indicado..." className={textareaClass} />
                  <span className="absolute bottom-2 right-3 text-[10px] text-gray-400 dark:text-[#808080]">{form.tratamiento.length}/500</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 dark:text-[#B0B0B0] mb-1.5">Notas Adicionales</label>
            <div className="relative">
              <textarea value={form.notas} onChange={function (e) { handleChange('notas', e.target.value); }} maxLength={500} rows={3} placeholder="Notas adicionales (opcional)..." className={textareaClass} />
                  <span className="absolute bottom-2 right-3 text-[10px] text-gray-400 dark:text-[#808080]">{form.notas.length}/500</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 dark:border-[#333]">
          <button onClick={onClose} className="rounded-lg border border-gray-300 dark:border-[#404040] bg-white dark:bg-[#2C2C2C] px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-[#C0C0C0] transition-colors hover:bg-gray-50 dark:hover:bg-[#333] cursor-pointer">
            Cancelar
          </button>
          <button onClick={handleSubmit} className="flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700 cursor-pointer">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
            Guardar Consulta
          </button>
        </div>
      </div>
    </div>
  );
}

export default NuevaConsultaModal;
