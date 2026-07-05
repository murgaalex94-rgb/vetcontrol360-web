import { useState, useEffect } from 'react';
import API from '../services/axiosConfig';
import MaterialDatePicker from './MaterialDatePicker';

const INITIAL_FORM = {
  nombre: '',
  especie: '',
  raza: '',
  fechaNacimiento: '',
  sexo: '',
  peso: '',
  microchip: '',
  clienteId: '',
  estado: 'Activo',
  notas: '',
};

function NuevaMascotaModal({ onClose, onCreado }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [clientes, setClientes] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    API.get('/clientes').then(({ data }) => setClientes(data)).catch(console.error);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const cliente = clientes.find((c) => c.id === Number(form.clienteId));
      await API.post('/mascotas', {
        nombre: form.nombre,
        especie: form.especie,
        raza: form.raza,
        fechaNacimiento: form.fechaNacimiento,
        sexo: form.sexo,
        peso: form.peso ? Number(form.peso) : null,
        microchip: form.microchip,
        cliente: cliente ? { id: cliente.id } : null,
        estado: form.estado,
        notas: form.notas,
      });
      onCreado();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  const inputClass = "w-full px-4 py-2.5 border border-gray-300 dark:border-[#404040] rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all bg-white dark:bg-[#2C2C2C] text-gray-900 dark:text-[#E0E0E0]";
  const labelClass = "block text-sm font-medium text-gray-700 dark:text-[#C0C0C0] mb-1";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto mx-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-8 py-6 border-b border-gray-200 dark:border-[#333]">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-[#E0E0E0]">Nueva Mascota</h2>
            <p className="text-sm text-gray-500 dark:text-[#909090] mt-0.5">Registra una nueva mascota en el sistema</p>
          </div>
          <button onClick={onClose} className="text-gray-400 dark:text-[#808080] hover:text-gray-600 dark:hover:text-[#A0A0A0] text-2xl leading-none p-1 cursor-pointer">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {error && <p className="text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 text-sm">{error}</p>}

          <section>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-[#E0E0E0] mb-4 flex items-center gap-2">
              <span>🐾</span> Información Básica
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className={labelClass}>Nombre *</label>
                <input type="text" name="nombre" value={form.nombre} onChange={handleChange} required className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Especie *</label>
                <select name="especie" value={form.especie} onChange={handleChange} required className={inputClass}>
                  <option value="">Seleccionar</option>
                  <option value="Canino">Canino</option>
                  <option value="Felino">Felino</option>
                  <option value="Ave">Ave</option>
                  <option value="Roedor">Roedor</option>
                  <option value="Reptil">Reptil</option>
                  <option value="Equino">Equino</option>
                  <option value="Otra">Otra</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Raza</label>
                <input type="text" name="raza" value={form.raza} onChange={handleChange} className={inputClass} />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div>
                <MaterialDatePicker value={form.fechaNacimiento} onChange={function (val) { handleChange({ target: { name: 'fechaNacimiento', value: val } }); }} label="Fecha de Nacimiento" />
              </div>
              <div>
                <label className={labelClass}>Sexo</label>
                <select name="sexo" value={form.sexo} onChange={handleChange} className={inputClass}>
                  <option value="">Seleccionar</option>
                  <option value="Macho">Macho</option>
                  <option value="Hembra">Hembra</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Peso (kg)</label>
                <input type="number" step="0.1" min="0" name="peso" value={form.peso} onChange={handleChange} className={inputClass} />
              </div>
            </div>
            <div className="mt-4">
              <label className={labelClass}>Microchip</label>
              <input type="text" name="microchip" value={form.microchip} onChange={handleChange} className={inputClass} />
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-[#E0E0E0] mb-4 flex items-center gap-2">
              <span>👤</span> Dueño
            </h3>
            <div>
              <label className={labelClass}>Dueño *</label>
              <select name="clienteId" value={form.clienteId} onChange={handleChange} required className={inputClass}>
                <option value="">Seleccionar dueño</option>
                {clientes.map((c) => (
                  <option key={c.id} value={c.id}>{c.nombre}</option>
                ))}
              </select>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-[#E0E0E0] mb-4 flex items-center gap-2">
              <span>🩺</span> Información Clínica
            </h3>
            <div>
              <label className={labelClass}>Estado *</label>
              <select name="estado" value={form.estado} onChange={handleChange} required className={inputClass}>
                <option value="Activo">Activo</option>
                <option value="Inactivo">Inactivo</option>
                <option value="En tratamiento">En tratamiento</option>
              </select>
            </div>
            <div className="mt-4">
              <label className={labelClass}>Notas / Observaciones</label>
              <textarea name="notas" value={form.notas} onChange={handleChange} rows={4} className={`${inputClass} resize-none`} />
            </div>
          </section>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-[#333]">
            <button type="button" onClick={onClose} className="px-6 py-2.5 border border-gray-300 dark:border-[#404040] rounded-lg text-gray-700 dark:text-[#C0C0C0] font-medium hover:bg-gray-50 dark:hover:bg-[#2C2C2C] transition-colors cursor-pointer">
              Cancelar
            </button>
            <button type="submit" disabled={saving} className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2 cursor-pointer">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
              {saving ? 'Guardando...' : 'Guardar Mascota'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NuevaMascotaModal;
