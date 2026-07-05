import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import API from '../services/axiosConfig';

function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

const ventasDiarias = [
  { dia: '17', ventas: 2100 }, { dia: '18', ventas: 1800 }, { dia: '19', ventas: 2600 },
  { dia: '20', ventas: 1450 }, { dia: '21', ventas: 3200 }, { dia: '22', ventas: 2850 },
];

const datosEstado = [
  { nombre: 'Pagadas', valor: 92, color: '#10B981' },
  { nombre: 'Pendientes', valor: 28, color: '#F59E0B' },
  { nombre: 'Anuladas', valor: 8, color: '#EF4444' },
];

const estadoStyles = { Pagada: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300', Pendiente: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300', Anulada: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' };
const pagoStyles = { Efectivo: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300', Tarjeta: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300', 'Yape / Plin': 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300' };
const ITEMS_PER_PAGE = 8;

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return <div className="bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-[#333] rounded-lg shadow-sm px-3 py-2 text-xs"><p className="font-semibold text-gray-700 dark:text-[#B0B0B0]">Día {label}</p><p className="text-emerald-600 font-bold">S/ {payload[0].value.toLocaleString()}</p></div>;
  }
  return null;
}

function FacturacionPage() {
  const navigate = useNavigate();
  const [facturas, setFacturas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('facturas');
  const [paginaActual, setPaginaActual] = useState(1);

  useEffect(() => {
    API.get('/facturas').then((res) => {
      const mapped = res.data.map((f) => ({ ...f, id: f.numero || ('F-' + String(f.id).padStart(6, '0')), fecha: formatDate(f.fecha), pago: f.metodoPago || '—', foto: f.foto || 'https://placehold.co/40x40/E6F7F6/0D9488?text=' + (f.mascota || 'V')[0] }));
      setFacturas(mapped);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const totalPaginas = Math.ceil(facturas.length / ITEMS_PER_PAGE);
  const facturasPagina = facturas.slice((paginaActual - 1) * ITEMS_PER_PAGE, paginaActual * ITEMS_PER_PAGE);

  const totalVentas = facturas.reduce((sum, f) => sum + (f.total || 0), 0);
  const pendientesMonto = facturas.filter((f) => f.estado === 'Pendiente').reduce((sum, f) => sum + (f.total || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 0 4.5 6h.75m13.5 0h.75a.75.75 0 0 0 .75-.75V4.5m-15 0v16.5a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5V4.5" /></svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-[#E0E0E0]">Facturación y Ventas</h1>
            <p className="text-sm text-gray-500 dark:text-[#909090]">Gestiona facturas, pagos y ventas de la clínica</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0 1 10.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0 .229 2.523a1.125 1.125 0 0 1-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0 0 21 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 0 0-1.913-.247M6.34 18H5.25A2.25 2.25 0 0 1 3 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 0 1 1.913-.247m10.5 0a48.536 48.536 0 0 0-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5Zm-3 0h.008v.008H15V10.5Z" /></svg>
            Imprimir
          </button>
          <button onClick={() => navigate('/facturacion/nueva')} className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors cursor-pointer">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
            Nueva Factura
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-[#333] shadow-sm p-5">
          <div className="flex items-start justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50">
              <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 0 4.5 6h.75m13.5 0h.75a.75.75 0 0 0 .75-.75V4.5m-15 0v16.5a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5V4.5" /></svg>
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-800 dark:text-[#E0E0E0] mt-3">S/ {totalVentas.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</p>
          <p className="text-sm text-gray-500 dark:text-[#909090]">Ventas del Mes</p>
          <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1 mt-0.5">↑ 12.5% vs. mes anterior</p>
        </div>
        <div className="rounded-xl bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-[#333] shadow-sm p-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50">
            <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
          </div>
          <p className="text-2xl font-bold text-gray-800 dark:text-[#E0E0E0] mt-3">{facturas.length}</p>
          <p className="text-sm text-gray-500 dark:text-[#909090]">Facturas Emitidas</p>
          <p className="text-xs text-gray-400 dark:text-[#808080] mt-0.5">Este mes</p>
        </div>
        <div className="rounded-xl bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-[#333] shadow-sm p-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50">
            <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
          </div>
          <p className="text-2xl font-bold text-gray-800 dark:text-[#E0E0E0] mt-3">S/ {pendientesMonto.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</p>
          <p className="text-sm text-gray-500 dark:text-[#909090]">Pendientes de Pago</p>
          <p className="text-xs text-orange-600 font-semibold mt-0.5">8 facturas pendientes</p>
        </div>
        <div className="rounded-xl bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-[#333] shadow-sm p-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50">
            <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" /></svg>
          </div>
          <p className="text-2xl font-bold text-gray-800 dark:text-[#E0E0E0] mt-3">S/ 1,250.00</p>
          <p className="text-sm text-gray-500 dark:text-[#909090]">Ventas del Día</p>
          <p className="text-xs text-gray-400 dark:text-[#808080] mt-0.5">6 facturas emitidas</p>
        </div>
      </div>

      <div className="flex items-center gap-6 border-b border-gray-200">
        {['facturas', 'ventas'].map((t) => (
          <button key={t} onClick={() => setTab(t)} className={'pb-3 text-sm font-semibold transition-colors cursor-pointer ' + (tab === t ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700')}>
            {t === 'facturas' ? 'Facturas' : 'Ventas'}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-8 space-y-4">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative flex-1 min-w-[200px]">
              <svg className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-[#808080]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>
              <input type="text" placeholder="Buscar por número, cliente o mascota..." className="w-full rounded-xl border border-gray-300 dark:border-[#404040] bg-white dark:bg-[#2C2C2C] pl-10 pr-4 py-2.5 text-sm text-gray-800 dark:text-[#E0E0E0] placeholder-gray-400 dark:placeholder-[#808080] focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
            </div>
            <select className="rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-700 appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22%236b7280%22%3E%3Cpath%20fill-rule%3D%22evenodd%22%20d%3D%22M5.23%207.21a.75.75%200%20011.06.02L10%2011.168l3.71-3.938a.75.75%200%20111.08%201.04l-4.25%204.5a.75.75%200%2001-1.08%200l-4.25-4.5a.75.75%200%2001.02-1.06z%22%20clip-rule%3D%22evenodd%22%20%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem] bg-[right_0.5rem_center] bg-no-repeat pr-10">
              <option>Todos los estados</option>
              <option>Pagada</option>
              <option>Pendiente</option>
              <option>Anulada</option>
            </select>
            <input type="date" className="rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-700 w-auto" />
            <input type="date" className="rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-700 w-auto" />
          <button className="flex items-center gap-2 rounded-xl border border-gray-300 dark:border-[#404040] bg-white dark:bg-[#2C2C2C] px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-[#D0D0D0] hover:bg-gray-50 dark:hover:bg-[#333] transition-colors cursor-pointer">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z" /></svg>
              Filtros
            </button>
          </div>

          <div className="rounded-2xl bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-[#333] shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-[#333] bg-gray-50 dark:bg-[#2C2C2C]">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-[#909090] uppercase tracking-wider">N° Factura</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-[#909090] uppercase tracking-wider">Fecha</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-[#909090] uppercase tracking-wider">Cliente</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-[#909090] uppercase tracking-wider">Mascota</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 dark:text-[#909090] uppercase tracking-wider">Total</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-[#909090] uppercase tracking-wider">Estado</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-[#909090] uppercase tracking-wider">Pago</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 dark:text-[#909090] uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-[#333]">
                  {facturasPagina.map((f) => (
                    <tr key={f.id} className="hover:bg-gray-50 dark:hover:bg-[#2C2C2C] transition-colors">
                      <td className="px-4 py-3 text-sm font-semibold text-gray-800 dark:text-[#E0E0E0]">{f.id}</td>
                      <td className="px-4 py-3 text-sm text-gray-500 dark:text-[#909090]">{f.fecha}</td>
                      <td className="px-4 py-3"><p className="text-sm font-medium text-gray-800 dark:text-[#E0E0E0]">{f.cliente}</p><p className="text-xs text-gray-400 dark:text-[#808080]">{f.telefono}</p></td>
                      <td className="px-4 py-3"><div className="flex items-center gap-2.5"><img src={f.foto} alt={f.mascota} className="w-8 h-8 rounded-full" /><div><p className="text-sm font-medium text-gray-800 dark:text-[#E0E0E0]">{f.mascota}</p><p className="text-xs text-gray-400 dark:text-[#808080]">{f.raza}</p></div></div></td>
                      <td className="px-4 py-3 text-sm font-bold text-gray-800 dark:text-[#E0E0E0] text-right">S/ {f.total.toFixed(2)}</td>
                      <td className="px-4 py-3"><span className={'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ' + estadoStyles[f.estado]}>{f.estado}</span></td>
                      <td className="px-4 py-3"><span className={'inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold ' + (pagoStyles[f.pago] || 'bg-gray-100 text-gray-500 dark:bg-[#2C2C2C] dark:text-[#D0D0D0]')}>{f.pago}</span></td>
                      <td className="px-4 py-3"><div className="flex items-center justify-center gap-1"><button className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 dark:text-[#808080] hover:bg-gray-100 dark:hover:bg-[#333] transition-colors cursor-pointer"><svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg></button><button className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 dark:text-[#808080] hover:bg-gray-100 dark:hover:bg-[#333] transition-colors cursor-pointer"><svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" /></svg></button></div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-between border-t border-gray-200 dark:border-[#333] px-4 py-3">
              <p className="text-sm text-gray-500 dark:text-[#909090]">Mostrando 1 a 8 de {facturas.length} facturas</p>
              <div className="flex items-center gap-1">
                <button disabled={paginaActual === 1} onClick={() => setPaginaActual((p) => Math.max(1, p - 1))} className="flex items-center gap-1 rounded-lg border border-gray-300 dark:border-[#404040] bg-white dark:bg-[#2C2C2C] px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-[#D0D0D0] hover:bg-gray-50 dark:hover:bg-[#333] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" /></svg>Anterior
                </button>
                {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((pag) => (
                  <button key={pag} onClick={() => setPaginaActual(pag)} className={'flex h-8 w-8 items-center justify-center rounded-lg text-sm font-semibold transition-colors cursor-pointer ' + (paginaActual === pag ? 'bg-blue-600 text-white' : 'border border-gray-300 dark:border-[#404040] bg-white dark:bg-[#2C2C2C] text-gray-700 dark:text-[#D0D0D0] hover:bg-gray-50 dark:hover:bg-[#333]')}>{pag}</button>
                ))}
                <button disabled={paginaActual === totalPaginas} onClick={() => setPaginaActual((p) => Math.min(totalPaginas, p + 1))} className="flex items-center gap-1 rounded-lg border border-gray-300 dark:border-[#404040] bg-white dark:bg-[#2C2C2C] px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-[#D0D0D0] hover:bg-gray-50 dark:hover:bg-[#333] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer">
                  Siguiente<svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" /></svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-4 space-y-4">
          <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl border border-gray-200 dark:border-[#333] shadow-sm p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-gray-800 dark:text-[#E0E0E0]">Resumen de Ventas</h3>
              <select className="text-xs border border-gray-200 dark:border-[#333] rounded-lg px-2 py-1 text-gray-600 dark:text-[#A0A0A0] bg-white dark:bg-[#2C2C2C]">
                <option>Este mes</option>
                <option>Mes anterior</option>
              </select>
            </div>
            <p className="text-3xl font-bold text-gray-800 dark:text-[#E0E0E0] mb-4">S/ 18,750.00</p>
            <div className="space-y-2">
              <div className="flex items-center justify-between py-1.5 border-b border-gray-50 dark:border-[#2C2C2C]"><span className="flex items-center gap-2 text-sm text-gray-600 dark:text-[#A0A0A0]"><span className="w-2 h-2 rounded-full bg-purple-500" />Tarjeta</span><span className="text-sm font-medium text-gray-800 dark:text-[#E0E0E0]">S/ 8,600.00</span></div>
              <div className="flex items-center justify-between py-1.5 border-b border-gray-50 dark:border-[#2C2C2C]"><span className="flex items-center gap-2 text-sm text-gray-600 dark:text-[#A0A0A0]"><span className="w-2 h-2 rounded-full bg-blue-500" />Efectivo</span><span className="text-sm font-medium text-gray-800 dark:text-[#E0E0E0]">S/ 7,250.00</span></div>
              <div className="flex items-center justify-between py-1.5"><span className="flex items-center gap-2 text-sm text-gray-600 dark:text-[#A0A0A0]"><span className="w-2 h-2 rounded-full bg-teal-500" />Yape / Plin</span><span className="text-sm font-medium text-gray-800 dark:text-[#E0E0E0]">S/ 2,900.00</span></div>
            </div>
          </div>

          <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl border border-gray-200 dark:border-[#333] shadow-sm p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-gray-800 dark:text-[#E0E0E0]">Ventas por Día</h3>
              <span className="text-[10px] text-gray-400 dark:text-[#808080]">Mayo 17 - 22</span>
            </div>
            <ResponsiveContainer width="100%" height={140}>
              <LineChart data={ventasDiarias} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
                <XAxis dataKey="dia" tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="ventas" stroke="#3B82F6" strokeWidth={2} dot={{ fill: '#3B82F6', r: 3 }} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl border border-gray-200 dark:border-[#333] shadow-sm p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-gray-800 dark:text-[#E0E0E0]">Facturas por Estado</h3>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative" style={{ width: 110, height: 110 }}>
                <PieChart width={110} height={110}>
                  <Pie data={datosEstado} cx={55} cy={55} innerRadius={35} outerRadius={50} paddingAngle={2} dataKey="valor">
                    {datosEstado.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                  </Pie>
                </PieChart>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <p className="text-lg font-bold text-gray-800 dark:text-[#E0E0E0] leading-none">128</p>
                  <p className="text-[9px] text-gray-400 dark:text-[#808080]">Total</p>
                </div>
              </div>
              <div className="space-y-1.5 flex-1">
                {datosEstado.map((d) => (
                  <div key={d.nombre} className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />{d.nombre}</span>
                    <span className="font-semibold text-gray-700 dark:text-[#B0B0B0]">{d.valor} ({d.nombre === 'Pagadas' ? '71.9' : d.nombre === 'Pendientes' ? '21.9' : '6.2'}%)</span>
                  </div>
                ))}
              </div>
            </div>
            <button className="w-full mt-3 text-center text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors cursor-pointer">Ver todas las facturas</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FacturacionPage;
