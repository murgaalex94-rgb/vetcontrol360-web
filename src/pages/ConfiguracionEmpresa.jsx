import { useState, useEffect } from 'react';
import axios from 'axios';

export default function ConfiguracionEmpresa() {
  const [form, setForm] = useState({});
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/empresa')
      .then(res => setForm(res.data))
      .catch(() => setForm({ ruc: '', razonSocial: '', nombreComercial: '', direccion: '', email: '', telefono: '', departamento: '', provincia: '', distrito: '', ubigeo: '', logoUrl: '', estado: 'Activo' }))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = e => {
    e.preventDefault();
    setMsg('');
    axios.put('/api/empresa', form)
      .then(res => { setForm(res.data); setMsg('Datos guardados correctamente'); })
      .catch(err => setMsg('Error al guardar: ' + (err.response?.data?.error || err.message)));
  };

  if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div></div>;

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Configuración de la Empresa</h1>
      {msg && <div className={`p-3 rounded-lg mb-4 text-sm ${msg.startsWith('Error') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>{msg}</div>}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">RUC</label>
            <input name="ruc" value={form.ruc || ''} onChange={handleChange} maxLength={11} className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Razón Social</label>
            <input name="razonSocial" value={form.razonSocial || ''} onChange={handleChange} className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Comercial</label>
            <input name="nombreComercial" value={form.nombreComercial || ''} onChange={handleChange} className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
            <select name="estado" value={form.estado || 'Activo'} onChange={handleChange} className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm">
              <option>Activo</option>
              <option>Inactivo</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
            <input name="direccion" value={form.direccion || ''} onChange={handleChange} className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input name="email" type="email" value={form.email || ''} onChange={handleChange} className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
            <input name="telefono" value={form.telefono || ''} onChange={handleChange} className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Departamento</label>
            <input name="departamento" value={form.departamento || ''} onChange={handleChange} className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Provincia</label>
            <input name="provincia" value={form.provincia || ''} onChange={handleChange} className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Distrito</label>
            <input name="distrito" value={form.distrito || ''} onChange={handleChange} className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ubigeo</label>
            <input name="ubigeo" value={form.ubigeo || ''} onChange={handleChange} className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm" />
          </div>
        </div>
        <div className="border-t border-gray-100 pt-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Certificado SUNAT</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ruta del Certificado (.p12)</label>
              <input name="certificadoPath" value={form.certificadoPath || ''} onChange={handleChange} placeholder="C:/certificados/certificado.p12" className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña del Certificado</label>
              <input name="certificadoPassword" type="password" value={form.certificadoPassword || ''} onChange={handleChange} className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Logo URL</label>
              <input name="logoUrl" value={form.logoUrl || ''} onChange={handleChange} className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm" />
            </div>
          </div>
        </div>
        <div className="flex justify-end pt-4 border-t border-gray-100">
          <button type="submit" className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium transition-colors">Guardar Datos</button>
        </div>
      </form>
    </div>
  );
}
