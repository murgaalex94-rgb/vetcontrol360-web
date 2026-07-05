import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/axiosConfig';
import MaterialDatePicker from '../components/MaterialDatePicker';

const razasPorEspecie = {
  Perro: ['Labrador Retriever', 'Pastor Alemán', 'Golden Retriever', 'Bulldog', 'Beagle', 'Chihuahua', 'Poodle', 'Dálmata', 'Otro'],
  Gato: ['Siamés', 'Persa', 'Maine Coon', 'Bengalí', 'Angora', 'Sphynx', 'Otro'],
  Ave: ['Perico', 'Canario', 'Guacamayo', 'Cacatúa', 'Otro'],
  Roedor: ['Conejo', 'Hámster', 'Cobaya', 'Chinchilla', 'Otro'],
  Reptil: ['Tortuga', 'Iguana', 'Serpiente', 'Otro'],
  Otro: ['Otro'],
};

function calcularEdad(fechaNac) {
  if (!fechaNac) return '';
  const nac = new Date(fechaNac);
  const hoy = new Date();
  let años = hoy.getFullYear() - nac.getFullYear();
  const meses = hoy.getMonth() - nac.getMonth();
  if (meses < 0 || (meses === 0 && hoy.getDate() < nac.getDate())) años--;
  if (años > 0) return `${años} año${años !== 1 ? 's' : ''}`;
  const m = meses < 0 ? meses + 12 : meses;
  if (m > 0) return `${m} mes${m !== 1 ? 'es' : ''}`;
  return 'Recién nacido';
}

function NuevaMascota() {
  const navigate = useNavigate();
  const [clientes, setClientes] = useState([]);
  const [busquedaDueno, setBusquedaDueno] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [exito, setExito] = useState(false);

  const [form, setForm] = useState({
    nombre: '',
    especie: '',
    raza: '',
    sexo: '',
    fechaNacimiento: '',
    color: '',
    microchip: '',
    peso: '',
    tipoPelaje: '',
    tamano: '',
    esterilizado: '',
    notas: '',
    clienteId: '',
  });

  useEffect(() => {
    API.get('/clientes').then(({ data }) => setClientes(data)).catch(console.error);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const especiesDisponibles = Object.keys(razasPorEspecie);
  const razasDisponibles = form.especie ? razasPorEspecie[form.especie] : [];
  const edad = calcularEdad(form.fechaNacimiento);

  const clientesFiltrados = clientes.filter((c) =>
    c.nombre?.toLowerCase().includes(busquedaDueno.toLowerCase())
  );

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
        sexo: form.sexo,
        fechaNacimiento: form.fechaNacimiento,
        color: form.color,
        microchip: form.microchip,
        peso: form.peso ? Number(form.peso) : null,
        tipoPelaje: form.tipoPelaje,
        tamano: form.tamano,
        esterilizado: form.esterilizado === 'si',
        notas: form.notas,
        cliente: cliente ? { id: cliente.id } : null,
        estado: 'Activo',
      });
      setExito(true);
      setTimeout(() => navigate('/mascotas'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  const inputClass = "w-full px-4 py-2.5 border border-gray-300 dark:border-[#404040] rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all bg-white dark:bg-[#2C2C2C] text-gray-900 dark:text-[#E0E0E0] text-sm";
  const labelClass = "block text-sm font-medium text-gray-700 dark:text-[#D0D0D0] mb-1.5";
  const radioClass = "appearance-none w-4 h-4 border-2 border-gray-300 dark:border-[#404040] rounded-full checked:border-emerald-600 checked:bg-emerald-600 transition-all cursor-pointer";

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/mascotas')} className="p-2 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer">
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
        </button>
        <div>
          <nav className="text-sm text-gray-500 mb-1">
            <span className="hover:text-emerald-600 cursor-pointer" onClick={() => navigate('/')}>Inicio</span>
            <span className="mx-2">/</span>
            <span className="hover:text-emerald-600 cursor-pointer" onClick={() => navigate('/mascotas')}>Mascotas</span>
            <span className="mx-2">/</span>
            <span className="text-gray-800 font-medium">Nueva Mascota</span>
          </nav>
          <h1 className="text-2xl font-bold text-gray-800">Nueva Mascota</h1>
        </div>
      </div>

      {exito && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl px-6 py-4 flex items-center gap-3">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
          Mascota registrada correctamente. Redirigiendo...
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 space-y-6">
            {error && (
              <p className="text-red-600 bg-red-50 border border-red-200 rounded-xl px-5 py-3 text-sm">{error}</p>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 pb-3 border-b border-gray-100">
                <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z" />
                </svg>
                Información Básica
              </h3>
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className={labelClass}>Nombre *</label>
                  <input type="text" name="nombre" value={form.nombre} onChange={handleChange} required className={inputClass} placeholder="Nombre de la mascota" />
                </div>
                <div>
                  <label className={labelClass}>Especie *</label>
                  <select name="especie" value={form.especie} onChange={handleChange} required className={inputClass}>
                    <option value="">Seleccionar especie</option>
                    {especiesDisponibles.map((e) => <option key={e} value={e}>{e}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className={labelClass}>Raza *</label>
                  <select name="raza" value={form.raza} onChange={handleChange} required className={inputClass} disabled={!form.especie}>
                    <option value="">Seleccionar raza</option>
                    {razasDisponibles.map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Sexo *</label>
                  <div className="flex items-center gap-6 h-[42px]">
                    <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                      <input type="radio" name="sexo" value="Macho" checked={form.sexo === 'Macho'} onChange={handleChange} className={radioClass} required />
                      Macho
                    </label>
                    <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                      <input type="radio" name="sexo" value="Hembra" checked={form.sexo === 'Hembra'} onChange={handleChange} className={radioClass} />
                      Hembra
                    </label>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-5">
                <div>
                  <MaterialDatePicker value={form.fechaNacimiento} onChange={function (val) { handleChange({ target: { name: 'fechaNacimiento', value: val } }); }} label="Fecha de Nacimiento" />
                </div>
                <div>
                  <label className={labelClass}>Edad</label>
                  <input type="text" value={edad} readOnly className={`${inputClass} bg-gray-50 text-gray-500 cursor-default`} placeholder="Se calcula automáticamente" />
                </div>
                <div>
                  <label className={labelClass}>Color</label>
                  <input type="text" name="color" value={form.color} onChange={handleChange} className={inputClass} placeholder="Ej: Marrón" />
                </div>
              </div>
              <div>
                <label className={labelClass}>Microchip</label>
                <input type="text" name="microchip" value={form.microchip} onChange={handleChange} className={inputClass} placeholder="Número de microchip" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 pb-3 border-b border-gray-100">
                <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6Z" />
                </svg>
                Información Adicional
              </h3>
              <div className="grid grid-cols-3 gap-5">
                <div>
                  <label className={labelClass}>Peso (kg)</label>
                  <input type="number" step="0.1" min="0" name="peso" value={form.peso} onChange={handleChange} className={inputClass} placeholder="0.0" />
                </div>
                <div>
                  <label className={labelClass}>Tipo de Pelaje</label>
                  <select name="tipoPelaje" value={form.tipoPelaje} onChange={handleChange} className={inputClass}>
                    <option value="">Seleccionar</option>
                    <option value="Corto">Corto</option>
                    <option value="Mediano">Mediano</option>
                    <option value="Largo">Largo</option>
                    <option value="Sin pelo">Sin pelo</option>
                    <option value="Rizado">Rizado</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Tamaño</label>
                  <select name="tamano" value={form.tamano} onChange={handleChange} className={inputClass}>
                    <option value="">Seleccionar</option>
                    <option value="Pequeño">Pequeño</option>
                    <option value="Mediano">Mediano</option>
                    <option value="Grande">Grande</option>
                  </select>
                </div>
              </div>
              <div>
                <label className={labelClass}>Esterilizado</label>
                <div className="flex items-center gap-6 h-[42px]">
                  <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                    <input type="radio" name="esterilizado" value="si" checked={form.esterilizado === 'si'} onChange={handleChange} className={radioClass} />
                    Sí
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                    <input type="radio" name="esterilizado" value="no" checked={form.esterilizado === 'no'} onChange={handleChange} className={radioClass} />
                    No
                  </label>
                </div>
              </div>
              <div>
                <label className={labelClass}>Características / Notas</label>
                <textarea name="notas" value={form.notas} onChange={handleChange} rows={4} className={`${inputClass} resize-none`} placeholder="Observaciones, alergias, comportamiento..." />
              </div>
            </div>

            <div className="bg-white dark:bg-[#1E1E1E] rounded-xl shadow-sm border border-gray-100 dark:border-[#333] p-6 space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 pb-3 border-b border-gray-100">
                <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                </svg>
                Asignar Dueño
              </h3>
              <div className="flex items-end gap-3">
                <div className="flex-1">
                  <label className={labelClass}>Dueño *</label>
                  <input
                    type="text"
                    placeholder="Buscar cliente..."
                    value={busquedaDueno}
                    onChange={(e) => setBusquedaDueno(e.target.value)}
                    className={inputClass}
                  />
                </div>
                <button type="button" onClick={() => navigate('/clientes?nuevo=true')} className="px-4 py-2.5 border border-emerald-600 text-emerald-600 rounded-lg text-sm font-medium hover:bg-emerald-50 transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                  + Nuevo Dueño
                </button>
              </div>
              {busquedaDueno && (
                <div className="border border-gray-200 dark:border-[#333] rounded-lg max-h-48 overflow-y-auto">
                  {clientesFiltrados.length === 0 ? (
                    <p className="p-3 text-sm text-gray-500 text-center">No se encontraron clientes</p>
                  ) : (
                    clientesFiltrados.map((c) => (
                      <label
                        key={c.id}
                className={`flex items-center gap-3 px-4 py-3 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 cursor-pointer transition-colors border-b border-gray-100 dark:border-[#333] last:border-0 ${
                  Number(form.clienteId) === c.id ? 'bg-emerald-50 dark:bg-emerald-900/20' : ''
                }`}
                      >
                        <input
                          type="radio"
                          name="clienteId"
                          value={c.id}
                          checked={Number(form.clienteId) === c.id}
                          onChange={handleChange}
                          className={radioClass}
                          required
                        />
                        <div>
                          <p className="text-sm font-medium text-gray-800 dark:text-[#E0E0E0]">{c.nombre}</p>
                          <p className="text-xs text-gray-500 dark:text-[#909090]">{c.telefono} {c.email ? `| ${c.email}` : ''}</p>
                        </div>
                      </label>
                    ))
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-2">
              <button type="button" onClick={() => navigate('/mascotas')} className="px-6 py-2.5 border border-gray-300 dark:border-[#404040] rounded-lg text-gray-700 dark:text-[#D0D0D0] font-medium hover:bg-gray-50 dark:hover:bg-[#2C2C2C] transition-colors cursor-pointer">
                Cancelar
              </button>
              <button type="submit" disabled={saving} className="px-6 py-2.5 bg-[#5F7B65] hover:bg-[#4E6553] text-white font-semibold rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2 cursor-pointer">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
                {saving ? 'Guardando...' : 'Guardar Mascota'}
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white dark:bg-[#1E1E1E] rounded-xl shadow-sm border border-gray-100 dark:border-[#333] p-6">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-[#D0D0D0] mb-4">Foto de la Mascota</h3>
              <div className="border-2 border-dashed border-gray-300 dark:border-[#404040] rounded-xl p-8 text-center hover:border-emerald-400 transition-colors cursor-pointer">
                <svg className="w-12 h-12 mx-auto text-gray-300 dark:text-[#808080] mb-3" fill="none" stroke="currentColor" strokeWidth={1} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Z" />
                </svg>
                <p className="text-sm text-gray-500 mb-1">Arrastra y suelta o</p>
                <p className="text-sm text-emerald-600 font-medium">Seleccionar archivo</p>
                <p className="text-xs text-gray-400 mt-2">JPG, PNG o WEBP (máx. 5MB)</p>
              </div>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                </svg>
                <div>
                  <p className="text-sm font-semibold text-emerald-700 mb-1">Información importante</p>
                  <p className="text-xs text-emerald-700 leading-relaxed">
                    Todos los campos marcados con * son obligatorios. Asegúrate de seleccionar el dueño correcto antes de guardar.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default NuevaMascota;
