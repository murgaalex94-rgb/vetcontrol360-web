import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import API from '../services/axiosConfig';

function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

const PROXIMAS_VACUNAS = [
  { mascota: 'Max', vacuna: 'Rabia', fecha: '15/06/2025', foto: '' },
  { mascota: 'Luna', vacuna: 'Múltiple', fecha: '10/12/2024', foto: '' },
  { mascota: 'Bella', vacuna: 'Rabia', fecha: '01/06/2025', foto: '' },
  { mascota: 'Coco', vacuna: 'Rabia', fecha: '20/05/2025', foto: '' },
];

const DONUT_DATA = [
  { name: 'Completos', value: 56, color: '#10B981' },
  { name: 'En Proceso', value: 68, color: '#F59E0B' },
  { name: 'Pendientes', value: 67, color: '#EF4444' },
];

const tabs = ['Registro de Vacunas', 'Esquemas de Vacunación'];

const estadoClass = {
  'Aplicada': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  'Próxima a Vencer': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
  'Pendiente': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
};

function Vacunacion() {
  const navigate = useNavigate();
  const [vacunas, setVacunas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Registro de Vacunas');
  const [search, setSearch] = useState('');
  const [filterEstado, setFilterEstado] = useState('');

  useEffect(() => {
    API.get('/vacunas').then((res) => { setVacunas(res.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const filtered = vacunas.filter((v) => {
    const q = search.toLowerCase();
    const matchSearch = !q || (v.mascota?.nombre || '').toLowerCase().includes(q) || (v.vacuna || '').toLowerCase().includes(q) || (v.lote || '').toLowerCase().includes(q);
    const matchEstado = !filterEstado || v.estado === filterEstado;
    return matchSearch && matchEstado;
  });

  const kpis = [
    { label: 'Total Aplicadas', value: vacunas.length || 245, icon: <svg className="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>, bg: 'bg-emerald-50' },
    { label: 'Próximas a Vencer', value: vacunas.filter((v) => v.estado === 'Próxima a Vencer').length || 18, icon: <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>, bg: 'bg-blue-50' },
    { label: 'Pendientes', value: vacunas.filter((v) => v.estado === 'Pendiente').length || 32, icon: <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" /></svg>, bg: 'bg-orange-50' },
    { label: 'Esquemas Completos', value: vacunas.filter((v) => v.estado === 'Aplicada').length || 156, icon: <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" /></svg>, bg: 'bg-purple-50' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-[#E0E0E0]">Vacunación</h1>
          <p className="text-sm text-gray-500 dark:text-[#909090] mt-0.5">Control de vacunación de mascotas</p>
        </div>
        <div className="flex gap-3">
          <button className="px-5 py-2.5 border border-gray-300 dark:border-[#404040] text-gray-700 dark:text-[#D0D0D0] text-sm font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-[#2C2C2C] transition-colors flex items-center gap-2 cursor-pointer">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0 1 10.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0 .229 2.523a1.125 1.125 0 0 1-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0 0 21 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 0 0-1.913-.247M6.34 18H5.25A2.25 2.25 0 0 1 3 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 0 1 1.913-.247m10.5 0a48.536 48.536 0 0 0-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5Zm-3 0h.008v.008H15V10.5Z" /></svg>
            Imprimir
          </button>
          <button onClick={() => navigate('/vacunacion/nueva')} className="px-5 py-2.5 bg-[#5F7B65] hover:bg-[#4E6553] text-white text-sm font-semibold rounded-lg transition-colors flex items-center gap-2 cursor-pointer">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
            Nueva Vacuna
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-5">
        {kpis.map((k, i) => (
          <div key={i} className="bg-white dark:bg-[#1E1E1E] rounded-xl shadow-sm border border-gray-100 dark:border-[#333] p-5 flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-gray-800 dark:text-[#E0E0E0]">{k.value}</p>
              <p className="text-sm text-gray-500 dark:text-[#909090] mt-1">{k.label}</p>
            </div>
            <div className={`${k.bg} p-3 rounded-lg`}>{k.icon}</div>
          </div>
        ))}
      </div>

      <div className="border-b border-gray-200 dark:border-[#333]">
        <div className="flex gap-6">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-sm font-medium transition-colors border-b-2 cursor-pointer ${
                activeTab === tab
                  ? 'text-emerald-600 border-sage'
                  : 'text-gray-500 dark:text-[#909090] border-transparent hover:text-gray-700 dark:hover:text-[#D0D0D0] hover:border-gray-300 dark:hover:border-[#404040]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'Registro de Vacunas' && (
        <div className="flex gap-6">
          <div className="flex-1 space-y-4">
            <div className="bg-white dark:bg-[#1E1E1E] rounded-xl shadow-sm border border-gray-100 dark:border-[#333] p-4">
              <div className="flex items-center gap-3">
                <div className="relative flex-1">
                  <svg className="w-5 h-5 text-gray-400 dark:text-[#808080] absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                  </svg>
                  <input type="text" placeholder="Buscar por mascota, vacuna, lote..." value={search} onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-[#404040] rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all bg-white dark:bg-[#2C2C2C] text-gray-900 dark:text-[#E0E0E0]" />
                </div>
                <select className="px-4 py-2.5 border border-gray-300 dark:border-[#404040] rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-[#2C2C2C] text-gray-700 dark:text-[#D0D0D0]">
                  <option>Todos los dueños</option>
                </select>
                <select className="px-4 py-2.5 border border-gray-300 dark:border-[#404040] rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-[#2C2C2C] text-gray-700 dark:text-[#D0D0D0]">
                  <option>Todas las vacunas</option>
                </select>
                <select value={filterEstado} onChange={(e) => setFilterEstado(e.target.value)}
                  className="px-4 py-2.5 border border-gray-300 dark:border-[#404040] rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-[#2C2C2C] text-gray-700 dark:text-[#D0D0D0]">
                  <option value="">Estado: Todos</option>
                  <option value="Aplicada">Aplicada</option>
                  <option value="Próxima a Vencer">Próxima a Vencer</option>
                  <option value="Pendiente">Pendiente</option>
                </select>
                <button className="px-5 py-2.5 bg-[#5F7B65] hover:bg-[#4E6553] text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer">Filtros</button>
              </div>
            </div>

            <div className="bg-white dark:bg-[#1E1E1E] rounded-xl shadow-sm border border-gray-100 dark:border-[#333] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-gray-500 dark:text-[#909090] text-xs uppercase tracking-wider bg-gray-50 dark:bg-[#2C2C2C]">
                      <th className="text-left py-4 px-5 font-semibold">Fecha</th>
                      <th className="text-left py-4 px-5 font-semibold">Mascota</th>
                      <th className="text-left py-4 px-5 font-semibold">Vacuna</th>
                      <th className="text-left py-4 px-5 font-semibold">Lote</th>
                      <th className="text-left py-4 px-5 font-semibold">Próxima Dosis</th>
                      <th className="text-left py-4 px-5 font-semibold">Aplicada por</th>
                      <th className="text-center py-4 px-5 font-semibold">Estado</th>
                      <th className="text-center py-4 px-5 font-semibold">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-[#333]">
                    {filtered.map((v) => (
                      <tr key={v.id} className="hover:bg-emerald-600/40 dark:hover:bg-emerald-900/20 transition-colors">
                        <td className="py-4 px-5 text-sm text-gray-800 dark:text-[#E0E0E0]">{formatDate(v.fechaAplicacion)}</td>
                        <td className="py-4 px-5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 text-xs font-bold shrink-0">{(v.mascota?.nombre || '?')[0]}</div>
                            <span className="text-sm font-medium text-gray-900 dark:text-[#E0E0E0]">{v.mascota?.nombre || 'Sin mascota'}</span>
                          </div>
                        </td>
                        <td className="py-4 px-5 text-sm text-gray-600 dark:text-[#A0A0A0]">{v.vacuna}</td>
                        <td className="py-4 px-5 text-sm text-gray-600 dark:text-[#A0A0A0]">{v.lote}</td>
                        <td className="py-4 px-5 text-sm text-gray-600 dark:text-[#A0A0A0]">{formatDate(v.proximaDosis)}</td>
                        <td className="py-4 px-5 text-sm text-gray-600 dark:text-[#A0A0A0]">{v.aplicadaPor}</td>
                        <td className="py-4 px-5 text-center">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${estadoClass[v.estado] || 'bg-gray-100 text-gray-700 dark:bg-[#2C2C2C] dark:text-[#D0D0D0]'}`}>{v.estado}</span>
                        </td>
                        <td className="py-4 px-5 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button className="p-1.5 text-gray-400 hover:text-emerald-600 transition-colors cursor-pointer rounded-lg hover:bg-emerald-50" title="Ver">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>
                            </button>
                            <button className="p-1.5 text-gray-400 dark:text-[#808080] hover:text-gray-600 dark:hover:text-[#A0A0A0] transition-colors cursor-pointer rounded-lg hover:bg-gray-100 dark:hover:bg-[#333]" title="Menú">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 1 1 0 1.5.75.75 0 0 1 0-1.5ZM12 12.75a.75.75 0 1 1 0 1.5.75.75 0 0 1 0-1.5ZM12 18.75a.75.75 0 1 1 0 1.5.75.75 0 0 1 0-1.5Z" /></svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100 dark:border-[#333]">
                <p className="text-sm text-gray-500 dark:text-[#909090]">Mostrando {filtered.length} de {vacunas.length} registros</p>
                <div className="flex items-center gap-2">
                  <button className="px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-[#A0A0A0] hover:bg-gray-100 dark:hover:bg-[#333] rounded-lg transition-colors cursor-pointer">&lt; Anterior</button>
                  <button className="px-3 py-1.5 text-sm font-medium bg-[#5F7B65] text-white rounded-lg">1</button>
                  <button className="px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-[#A0A0A0] hover:bg-gray-100 dark:hover:bg-[#333] rounded-lg transition-colors cursor-pointer">2</button>
                  <button className="px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-[#A0A0A0] hover:bg-gray-100 dark:hover:bg-[#333] rounded-lg transition-colors cursor-pointer">3</button>
                  <button className="px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-[#A0A0A0] hover:bg-gray-100 dark:hover:bg-[#333] rounded-lg transition-colors cursor-pointer">Siguiente &gt;</button>
                </div>
              </div>
            </div>
          </div>

          <div className="w-80 shrink-0 space-y-4">
            <div className="bg-white dark:bg-[#1E1E1E] rounded-xl shadow-sm border border-gray-100 dark:border-[#333] p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-gray-800 dark:text-[#E0E0E0]">Próximas Vacunas por Vencer</h4>
                <button className="text-xs text-emerald-600 font-medium hover:text-emerald-700 cursor-pointer">Ver todas</button>
              </div>
              <div className="space-y-3">
                {PROXIMAS_VACUNAS.map((v, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 text-xs font-bold shrink-0">{v.mascota[0]}</div>
                    <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 dark:text-[#E0E0E0]">{v.mascota}</p>
                    <p className="text-xs text-gray-500 dark:text-[#909090]">{v.vacuna} · {v.fecha}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-[#1E1E1E] rounded-xl shadow-sm border border-gray-100 dark:border-[#333] p-5 space-y-4">
              <h4 className="text-sm font-bold text-gray-800 dark:text-[#E0E0E0]">Esquemas de Vacunación</h4>
              <div className="flex items-center justify-center">
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={DONUT_DATA} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value">
                      {DONUT_DATA.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2">
                {DONUT_DATA.map((d, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full inline-block" style={{ backgroundColor: d.color }} />
                      <span className="text-gray-600 dark:text-[#A0A0A0]">{d.name}</span>
                    </div>
                    <span className="font-semibold text-gray-800 dark:text-[#E0E0E0]">{d.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                </svg>
                <div>
                  <p className="text-sm font-semibold text-emerald-800 mb-1">Mantén las vacunas al día</p>
                  <p className="text-xs text-emerald-700 leading-relaxed">Revisa periódicamente el calendario de vacunación de tus pacientes para evitar retrasos en las dosis.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'Esquemas de Vacunación' && (
        <div className="bg-white dark:bg-[#1E1E1E] rounded-xl shadow-sm border border-gray-100 dark:border-[#333] p-12 text-center">
          <p className="text-gray-400 dark:text-[#808080]">Sección de Esquemas de Vacunación — Próximamente</p>
        </div>
      )}
    </div>
  );
}

export default Vacunacion;
