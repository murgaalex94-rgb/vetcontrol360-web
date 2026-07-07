import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import * as XLSX from 'xlsx';
import API from '../services/axiosConfig';
import MaterialDatePicker from '../components/MaterialDatePicker';

function formatDate(dateStr) {
  if (!dateStr) return '—';
  var d = new Date(dateStr);
  return d.toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

var facturasMock = [
  { id: 1, numero: 'F-000001', fecha: '2026-06-15', cliente: 'María García', telefono: '999 111 222', mascota: 'Luna', raza: 'Golden Retriever', total: 250.00, estado: 'Pagada', metodoPago: 'Tarjeta' },
  { id: 2, numero: 'F-000002', fecha: '2026-06-16', cliente: 'Carlos López', telefono: '999 333 444', mascota: 'Max', raza: 'Bulldog Francés', total: 180.50, estado: 'Pagada', metodoPago: 'Efectivo' },
  { id: 3, numero: 'F-000003', fecha: '2026-06-17', cliente: 'Ana Torres', telefono: '999 555 666', mascota: 'Misha', raza: 'Gato Persa', total: 320.00, estado: 'Pendiente', metodoPago: 'Yape' },
  { id: 4, numero: 'F-000004', fecha: '2026-06-18', cliente: 'Pedro Sánchez', telefono: '999 777 888', mascota: 'Rocky', raza: 'Pastor Alemán', total: 95.00, estado: 'Pagada', metodoPago: 'Tarjeta' },
  { id: 5, numero: 'F-000005', fecha: '2026-06-19', cliente: 'Lucía Fernández', telefono: '999 999 000', mascota: 'Simba', raza: 'Gato Siames', total: 410.00, estado: 'Anulada', metodoPago: 'Efectivo' },
  { id: 6, numero: 'F-000006', fecha: '2026-06-20', cliente: 'Diego Ramírez', telefono: '998 111 333', mascota: 'Coco', raza: 'Caniche', total: 175.00, estado: 'Pagada', metodoPago: 'Yape' },
  { id: 7, numero: 'F-000007', fecha: '2026-06-21', cliente: 'Sofía Castillo', telefono: '998 555 777', mascota: 'Pelusa', raza: 'Conejo Angora', total: 290.00, estado: 'Pendiente', metodoPago: 'Tarjeta' },
  { id: 8, numero: 'F-000008', fecha: '2026-06-22', cliente: 'Jorge Mendoza', telefono: '998 222 444', mascota: 'Toby', raza: 'Beagle', total: 135.00, estado: 'Pagada', metodoPago: 'Efectivo' },
  { id: 9, numero: 'F-000009', fecha: '2026-06-23', cliente: 'Rosa Paredes', telefono: '998 666 888', mascota: 'Lola', raza: 'Husky', total: 520.00, estado: 'Pagada', metodoPago: 'Tarjeta' },
];

var estadoStyles = { Pagada: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300', Pendiente: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300', Anulada: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' };
var pagoStyles = { Efectivo: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300', Tarjeta: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300', Yape: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300' };
var ITEMS_PER_PAGE = 8;

var ventasDiarias = [
  { dia: '17', ventas: 2100 }, { dia: '18', ventas: 1800 }, { dia: '19', ventas: 2600 },
  { dia: '20', ventas: 1450 }, { dia: '21', ventas: 3200 }, { dia: '22', ventas: 2850 },
];

var datosEstado = [
  { nombre: 'Pagadas', valor: 92, color: '#10B981' },
  { nombre: 'Pendientes', valor: 28, color: '#F59E0B' },
  { nombre: 'Anuladas', valor: 8, color: '#EF4444' },
];

var selectClass = "rounded-xl border border-gray-300 dark:border-[#404040] bg-white dark:bg-[#2C2C2C] px-4 py-2.5 text-sm text-gray-800 dark:text-[#E0E0E0] transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22%236b7280%22%3E%3Cpath%20fill-rule%3D%22evenodd%22%20d%3D%22M5.23%207.21a.75.75%200%20011.06.02L10%2011.168l3.71-3.938a.75.75%200%20111.08%201.04l-4.25%204.5a.75.75%200%2001-1.08%200l-4.25-4.5a.75.75%200%2001.02-1.06z%22%20clip-rule%3D%22evenodd%22%20%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem] bg-[right_0.5rem_center] bg-no-repeat pr-10 dark:bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22%23909090%22%3E%3Cpath%20fill-rule%3D%22evenodd%22%20d%3D%22M5.23%207.21a.75.75%200%20011.06.02L10%2011.168l3.71-3.938a.75.75%200%20111.08%201.04l-4.25%204.5a.75.75%200%2001-1.08%200l-4.25-4.5a.75.75%200%2001.02-1.06z%22%20clip-rule%3D%22evenodd%22%20%2F%3E%3C%2Fsvg%3E')]";

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return <div className="bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-[#333] rounded-lg shadow-sm px-3 py-2 text-xs"><p className="font-semibold text-gray-700 dark:text-[#B0B0B0]">Día {label}</p><p className="text-emerald-600 font-bold">S/ {payload[0].value.toLocaleString()}</p></div>;
  }
  return null;
}

function FiltroAvanzadoModal({ abierto, onClose, filtros, setFiltros }) {
  if (!abierto) return null;

  function handleChange(e) {
    setFiltros(Object.assign({}, filtros, { [e.target.name]: e.target.value }));
  }

  function limpiar() {
    setFiltros({ precioMin: '', precioMax: '', estado: '', metodoPago: '' });
  }

  var inputClass = 'w-full rounded-lg border border-gray-300 dark:border-[#404040] bg-white dark:bg-[#2C2C2C] px-4 py-2.5 text-sm text-gray-900 dark:text-[#E0E0E0] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl shadow-2xl w-full max-w-lg mx-4">
        <div className="flex items-center justify-between p-6 pb-0">
          <h2 className="text-lg font-bold text-gray-900 dark:text-[#E0E0E0]">Filtro Avanzado</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#2C2C2C] text-gray-400 dark:text-[#808080] hover:text-gray-600 dark:hover:text-[#A0A0A0] transition-colors cursor-pointer">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-[#C0C0C0] mb-1">Monto Mínimo</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">S/</span>
                <input type="number" name="precioMin" value={filtros.precioMin} onChange={handleChange} min="0" step="0.01" className={inputClass + ' pl-8'} placeholder="0.00" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-[#C0C0C0] mb-1">Monto Máximo</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">S/</span>
                <input type="number" name="precioMax" value={filtros.precioMax} onChange={handleChange} min="0" step="0.01" className={inputClass + ' pl-8'} placeholder="0.00" />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-[#C0C0C0] mb-1">Estado</label>
              <select name="estado" value={filtros.estado} onChange={handleChange} className={inputClass}>
                <option value="">Todos</option>
                <option value="Pagada">Pagada</option>
                <option value="Pendiente">Pendiente</option>
                <option value="Anulada">Anulada</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-[#C0C0C0] mb-1">Método de Pago</label>
              <select name="metodoPago" value={filtros.metodoPago} onChange={handleChange} className={inputClass}>
                <option value="">Todos</option>
                <option value="Tarjeta">Tarjeta</option>
                <option value="Efectivo">Efectivo</option>
                <option value="Yape">Yape</option>
              </select>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between px-6 pb-6 pt-2">
          <button onClick={limpiar} className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors cursor-pointer">Limpiar filtros</button>
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="px-5 py-2.5 rounded-xl border border-gray-300 dark:border-[#404040] text-sm font-medium text-gray-700 dark:text-[#C0C0C0] hover:bg-gray-50 dark:hover:bg-[#2C2C2C] transition-colors cursor-pointer">Cancelar</button>
            <button onClick={onClose} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white shadow-sm transition-colors cursor-pointer" style={{ backgroundColor: '#5F7B65' }}>Aplicar Filtros</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function FacturacionPage() {
  var navigate = useNavigate();
  var [facturas, setFacturas] = useState([]);
  var [loading, setLoading] = useState(true);
  var [tab, setTab] = useState('facturas');
  var [paginaActual, setPaginaActual] = useState(1);
  var [busqueda, setBusqueda] = useState('');
  var [filtroEstado, setFiltroEstado] = useState('Todos');
  var [fechaDesde, setFechaDesde] = useState('');
  var [fechaHasta, setFechaHasta] = useState('');
  var [showModalFiltroAvanzado, setShowModalFiltroAvanzado] = useState(false);
  var [filtrosAvanzados, setFiltrosAvanzados] = useState({ precioMin: '', precioMax: '', estado: '', metodoPago: '' });
  var [accionFactura, setAccionFactura] = useState(null);

  function handleEliminarFactura(id) {
    if (!confirm('¿Anular esta factura?')) return;
    API.delete('/facturas/' + id).then(function () {
      setFacturas(facturas.filter(function (f) { return f.id !== id; }));
    }).catch(function (err) {
      console.error('Error al anular factura:', err);
      alert('Error al anular la factura.');
    });
  }

  function handleCambiarEstado(id, estado) {
    API.put('/facturas/' + id, { estado: estado }).then(function () {
      setFacturas(facturas.map(function (f) { return f.id === id ? Object.assign({}, f, { estado: estado }) : f; }));
    }).catch(function (err) {
      console.error('Error al actualizar factura:', err);
      alert('Error al actualizar la factura.');
    });
  }

  useEffect(function () {
    API.get('/facturas').then(function (res) {
      var mapped = res.data.map(function (f) {
        return {
          dbId: f.id,
          numero: f.numero || ('F-' + String(f.id).padStart(6, '0')),
          fecha: formatDate(f.fecha),
          cliente: f.cliente,
          telefono: f.telefono,
          mascota: f.mascota,
          raza: f.raza,
          total: f.total,
          estado: f.estado,
          pago: f.metodoPago || 'Tarjeta',
          foto: f.foto || 'https://placehold.co/40x40/E6F7F6/0D9488?text=' + ((f.mascota || 'V')[0]),
        };
      });
      setFacturas(mapped);
      setLoading(false);
    }).catch(function () {
      var mapped = facturasMock.map(function (f) {
        return Object.assign({}, f, {
          dbId: f.id,
          numero: f.numero,
          fecha: formatDate(f.fecha),
          pago: f.metodoPago,
          foto: 'https://placehold.co/40x40/E6F7F6/0D9488?text=' + f.mascota[0],
        });
      });
      setFacturas(mapped);
      setLoading(false);
    });
  }, []);

  var facturasFiltradas = facturas.filter(function (f) {
    var text = busqueda.toLowerCase();
    var coincideBusqueda = !text || (f.numero && f.numero.toLowerCase().includes(text)) || (f.cliente && f.cliente.toLowerCase().includes(text)) || (f.mascota && f.mascota.toLowerCase().includes(text));
    var coincideEstado = filtroEstado === 'Todos' || f.estado === filtroEstado;
    var fa = filtrosAvanzados;
    var coincideMonto = (!fa.precioMin || (f.total || 0) >= Number(fa.precioMin)) && (!fa.precioMax || (f.total || 0) <= Number(fa.precioMax));
    var coincideEstadoFA = !fa.estado || f.estado === fa.estado;
    var coincidePago = !fa.metodoPago || f.pago === fa.metodoPago;
    return coincideBusqueda && coincideEstado && coincideMonto && coincideEstadoFA && coincidePago;
  });

  var totalPaginas = Math.ceil(facturasFiltradas.length / ITEMS_PER_PAGE);
  var facturasPagina = facturasFiltradas.slice((paginaActual - 1) * ITEMS_PER_PAGE, paginaActual * ITEMS_PER_PAGE);
  var inicio = facturasFiltradas.length > 0 ? (paginaActual - 1) * ITEMS_PER_PAGE + 1 : 0;
  var fin = Math.min(paginaActual * ITEMS_PER_PAGE, facturasFiltradas.length);

  var totalVentas = facturas.reduce(function (sum, f) { return sum + (f.total || 0); }, 0);
  var pendientesMonto = facturas.filter(function (f) { return f.estado === 'Pendiente'; }).reduce(function (sum, f) { return sum + (f.total || 0); }, 0);

  function handleExportar() {
    var dataExport = facturasFiltradas.map(function (f) {
      return {
        'N° Factura': f.id || '—',
        Fecha: f.fecha || '—',
        Cliente: f.cliente || '—',
        Mascota: f.mascota || '—',
        Total: (f.total || 0),
        Estado: f.estado || '—',
        Pago: f.pago || '—',
      };
    });
    var ws = XLSX.utils.json_to_sheet(dataExport);
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Facturas');
    var fecha = new Date().toISOString().slice(0, 10);
    XLSX.writeFile(wb, 'Facturas_' + fecha + '.xlsx');
  }

  return (
    <div className="flex flex-col min-h-screen gap-6">
      <div className="flex-none flex items-center justify-between">
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
          <button onClick={function () { navigate('/facturacion/nueva'); }} className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors cursor-pointer" style={{ backgroundColor: '#5F7B65' }}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
            Nueva Factura
          </button>
          <button type="button" onClick={function () { console.log('Imprimiendo...'); window.print(); }} className="flex items-center gap-2 rounded-xl border border-gray-300 dark:border-[#404040] bg-white dark:bg-[#2C2C2C] px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-[#D0D0D0] transition-colors hover:bg-gray-50 dark:hover:bg-[#333] cursor-pointer">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0 1 10.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0 .229 2.523a1.125 1.125 0 0 1-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0 0 21 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 0 0-1.913-.247M6.34 18H5.25A2.25 2.25 0 0 1 3 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 0 1 1.913-.247m10.5 0a48.536 48.536 0 0 0-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5Zm-3 0h.008v.008H15V10.5Z" /></svg>
            Imprimir
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 flex-none">
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

      <div className="flex items-center gap-6 border-b border-gray-200 dark:border-[#333] flex-none">
        {['facturas', 'ventas'].map(function (t) {
          return <button key={t} onClick={function () { setTab(t); }} className={'pb-3 text-sm font-semibold transition-colors cursor-pointer ' + (tab === t ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 dark:text-[#909090] hover:text-gray-700 dark:hover:text-[#D0D0D0]')}>{t === 'facturas' ? 'Facturas' : 'Ventas'}</button>;
        })}
      </div>

      <div className="grid grid-cols-12 gap-6 flex-1 min-h-0">
        <div className="col-span-8 flex flex-col gap-4 min-h-0">
          <div className="flex items-center gap-2 flex-none">
            <div className="flex items-center gap-2 flex-1">
              <div className="relative max-w-xs">
                <svg className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-[#808080]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>
                <input type="text" value={busqueda} onChange={function (e) { setBusqueda(e.target.value); setPaginaActual(1); }} placeholder="Buscar por número, cliente o mascota..." className="w-full rounded-lg border border-gray-300 dark:border-[#3A3A3A] bg-white dark:bg-[#2C2C2C] pl-10 pr-4 py-2.5 text-sm text-gray-800 dark:text-[#E0E0E0] placeholder-gray-400 dark:placeholder-[#808080] transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
              </div>
              <select value={filtroEstado} onChange={function (e) { setFiltroEstado(e.target.value); setPaginaActual(1); }} className="rounded-lg border border-gray-300 dark:border-[#3A3A3A] bg-white dark:bg-[#2C2C2C] px-4 py-2.5 text-sm text-gray-800 dark:text-[#E0E0E0] transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22%236b7280%22%3E%3Cpath%20fill-rule%3D%22evenodd%22%20d%3D%22M5.23%207.21a.75.75%200%20011.06.02L10%2011.168l3.71-3.938a.75.75%200%20111.08%201.04l-4.25%204.5a.75.75%200%2001-1.08%200l-4.25-4.5a.75.75%200%2001.02-1.06z%22%20clip-rule%3D%22evenodd%22%20%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem] bg-[right_0.5rem_center] bg-no-repeat pr-10 dark:bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22%23909090%22%3E%3Cpath%20fill-rule%3D%22evenodd%22%20d%3D%22M5.23%207.21a.75.75%200%20011.06.02L10%2011.168l3.71-3.938a.75.75%200%20111.08%201.04l-4.25%204.5a.75.75%200%2001-1.08%200l-4.25-4.5a.75.75%200%2001.02-1.06z%22%20clip-rule%3D%22evenodd%22%20%2F%3E%3C%2Fsvg%3E')] w-36">
                <option value="Todos">Estado</option>
                <option value="Pagada">Pagada</option>
                <option value="Pendiente">Pendiente</option>
                <option value="Anulada">Anulada</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <MaterialDatePicker value={fechaDesde} onChange={function (v) { setFechaDesde(v); setPaginaActual(1); }} placeholder="Fecha Desde" />
              <MaterialDatePicker value={fechaHasta} onChange={function (v) { setFechaHasta(v); setPaginaActual(1); }} placeholder="Fecha Hasta" />
            </div>
            <div className="flex items-center gap-2">
              <button onClick={function () { setShowModalFiltroAvanzado(true); }} className="flex items-center gap-2 rounded-lg border border-gray-300 dark:border-[#3A3A3A] bg-white dark:bg-[#2C2C2C] px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-[#D0D0D0] transition-colors hover:bg-gray-50 dark:hover:bg-[#333] cursor-pointer">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z" /></svg>
                Filtro Avanzado
              </button>
              <button onClick={handleExportar} className="flex items-center gap-2 rounded-lg border border-gray-300 dark:border-[#3A3A3A] bg-white dark:bg-[#2C2C2C] px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-[#D0D0D0] transition-colors hover:bg-gray-50 dark:hover:bg-[#333] cursor-pointer">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
                Exportar
              </button>
            </div>
          </div>

          <div className="flex-1 flex flex-col min-h-0 rounded-2xl bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-[#333] shadow-sm overflow-hidden">
            <div className="flex-1 overflow-auto min-h-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-[#333] bg-gray-50 dark:bg-[#2C2C2C]">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-[#909090] uppercase tracking-wider w-28">N° Factura</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-[#909090] uppercase tracking-wider w-28">Fecha</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-[#909090] uppercase tracking-wider min-w-[150px]">Cliente</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-[#909090] uppercase tracking-wider min-w-[150px]">Mascota</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 dark:text-[#909090] uppercase tracking-wider w-24">Total</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-[#909090] uppercase tracking-wider w-24">Estado</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-[#909090] uppercase tracking-wider w-24">Pago</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 dark:text-[#909090] uppercase tracking-wider w-28">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-[#333]">
                  {facturasPagina.map(function (f) {
                    return (
                      <tr key={f.dbId || f.numero} className="hover:bg-gray-50 dark:hover:bg-[#2C2C2C] transition-colors">
                        <td className="px-4 py-3 text-sm font-semibold text-gray-800 dark:text-[#E0E0E0]">{f.numero}</td>
                        <td className="px-4 py-3 text-sm text-gray-500 dark:text-[#909090]">{f.fecha}</td>
                        <td className="px-4 py-3"><p className="text-sm font-medium text-gray-800 dark:text-[#E0E0E0]">{f.cliente}</p><p className="text-xs text-gray-400 dark:text-[#808080]">{f.telefono}</p></td>
                        <td className="px-4 py-3"><div className="flex items-center gap-2.5"><img src={f.foto} alt={f.mascota} className="w-8 h-8 rounded-full" /><div><p className="text-sm font-medium text-gray-800 dark:text-[#E0E0E0]">{f.mascota}</p><p className="text-xs text-gray-400 dark:text-[#808080]">{f.raza}</p></div></div></td>
                        <td className="px-4 py-3 text-sm font-bold text-gray-800 dark:text-[#E0E0E0] text-right">S/ {f.total.toFixed(2)}</td>
                        <td className="px-4 py-3"><span className={'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ' + estadoStyles[f.estado]}>{f.estado}</span></td>
                        <td className="px-4 py-3"><span className={'inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold ' + (pagoStyles[f.pago] || 'bg-gray-100 text-gray-500 dark:bg-[#2C2C2C] dark:text-[#D0D0D0]')}>{f.pago}</span></td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center gap-1">
                            <button onClick={function () { setAccionFactura(f); }} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-500 hover:text-blue-700 transition-colors cursor-pointer" title="Ver Detalles">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>
                            </button>
                            <button onClick={function () { handleCambiarEstado(f.dbId, f.estado === 'Pagada' ? 'Pendiente' : 'Pagada'); }} className="p-1.5 rounded-lg hover:bg-amber-50 text-amber-500 hover:text-amber-700 transition-colors cursor-pointer" title="Cambiar estado">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" /></svg>
                            </button>
                            <button onClick={function () { handleEliminarFactura(f.dbId); }} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 hover:text-red-700 transition-colors cursor-pointer" title="Anular">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {loading ? (
                    <tr><td colSpan={8} className="px-4 py-12 text-center text-sm text-gray-400 dark:text-[#808080]">Cargando facturas...</td></tr>
                  ) : facturasPagina.length === 0 && (
                    <tr>
                      <td colSpan={8} className="px-4 py-12 text-center text-sm text-gray-400 dark:text-[#808080]">No se encontraron facturas con los filtros aplicados.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="flex-none flex items-center justify-between border-t border-gray-200 dark:border-[#333] px-4 py-3">
              <p className="text-sm text-gray-500 dark:text-[#909090]">Mostrando {inicio} a {fin} de {facturasFiltradas.length} facturas</p>
              <div className="flex items-center gap-1">
                <button disabled={paginaActual === 1} onClick={function () { setPaginaActual(function (p) { return Math.max(1, p - 1); }); }} className="flex items-center justify-center rounded-lg border border-gray-300 dark:border-[#404040] bg-white dark:bg-[#2C2C2C] px-2.5 py-1.5 text-sm font-medium text-gray-700 dark:text-[#D0D0D0] transition-colors hover:bg-gray-50 dark:hover:bg-[#333] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" /></svg>
                </button>
                {Array.from({ length: totalPaginas }, function (_, i) { return i + 1; }).map(function (pag) {
                  return <button key={pag} onClick={function () { setPaginaActual(pag); }} className={'flex h-8 w-8 items-center justify-center rounded-lg text-sm font-semibold transition-colors cursor-pointer ' + (paginaActual === pag ? 'bg-[#5F7B65] text-white' : 'border border-gray-300 dark:border-[#404040] bg-white dark:bg-[#2C2C2C] text-gray-700 dark:text-[#D0D0D0] hover:bg-gray-50 dark:hover:bg-[#333]')}>{pag}</button>;
                })}
                <button disabled={paginaActual === totalPaginas} onClick={function () { setPaginaActual(function (p) { return Math.min(totalPaginas, p + 1); }); }} className="flex items-center justify-center rounded-lg border border-gray-300 dark:border-[#404040] bg-white dark:bg-[#2C2C2C] px-2.5 py-1.5 text-sm font-medium text-gray-700 dark:text-[#D0D0D0] transition-colors hover:bg-gray-50 dark:hover:bg-[#333] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" /></svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-4 flex flex-col gap-4 min-h-0">
          <div className="flex-none bg-white dark:bg-[#1E1E1E] rounded-2xl border border-gray-200 dark:border-[#333] shadow-sm p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-gray-800 dark:text-[#E0E0E0]">Resumen de Ventas</h3>
              <select className="text-xs border border-gray-200 dark:border-[#333] rounded-lg px-2 py-1 text-gray-600 dark:text-[#A0A0A0] bg-white dark:bg-[#2C2C2C]">
                <option>Este mes</option>
                <option>Mes anterior</option>
              </select>
            </div>
            <div className="grid grid-cols-4 gap-3">
              <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-gray-50 dark:bg-[#2C2C2C]">
                <p className="text-[10px] text-gray-400 dark:text-[#808080] font-medium uppercase tracking-wider">Total</p>
                <p className="text-lg font-bold text-gray-800 dark:text-[#E0E0E0] mt-0.5">S/ 18,750</p>
              </div>
              <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-purple-50 dark:bg-purple-900/20">
                <p className="text-[10px] text-gray-400 dark:text-[#808080] font-medium uppercase tracking-wider">Tarjeta</p>
                <span className="text-sm leading-none my-0.5">💳</span>
                <p className="text-lg font-bold text-gray-800 dark:text-[#E0E0E0]">S/ 8,600</p>
              </div>
              <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20">
                <p className="text-[10px] text-gray-400 dark:text-[#808080] font-medium uppercase tracking-wider">Efectivo</p>
                <span className="text-sm leading-none my-0.5">💵</span>
                <p className="text-lg font-bold text-gray-800 dark:text-[#E0E0E0]">S/ 7,250</p>
              </div>
              <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-teal-50 dark:bg-teal-900/20">
                <p className="text-[10px] text-gray-400 dark:text-[#808080] font-medium uppercase tracking-wider">Yape</p>
                <span className="text-sm leading-none my-0.5">📱</span>
                <p className="text-lg font-bold text-gray-800 dark:text-[#E0E0E0]">S/ 2,900</p>
              </div>
            </div>
          </div>

            <div className="flex-1 bg-white dark:bg-[#1E1E1E] rounded-2xl border border-gray-200 dark:border-[#333] shadow-sm p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-gray-800 dark:text-[#E0E0E0]">Ventas por Día</h3>
              <span className="text-[10px] text-gray-400 dark:text-[#808080]">Mayo 17 - 22</span>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={ventasDiarias} margin={{ top: 5, right: 5, bottom: 0, left: -15 }}>
                <XAxis dataKey="dia" tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} width={35} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="ventas" stroke="#3B82F6" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="flex-1 bg-white dark:bg-[#1E1E1E] rounded-2xl border border-gray-200 dark:border-[#333] shadow-sm p-5 flex flex-col min-h-0">
            <div className="flex items-center justify-between mb-3 flex-none">
              <h3 className="text-sm font-bold text-gray-800 dark:text-[#E0E0E0]">Facturas por Estado</h3>
            </div>
            <div className="flex-1 flex items-center gap-4 min-h-0">
              <div className="relative" style={{ width: 110, height: 110 }}>
                <PieChart width={110} height={110}>
                  <Pie data={datosEstado} cx={55} cy={55} innerRadius={35} outerRadius={50} paddingAngle={2} dataKey="valor">
                    {datosEstado.map(function (entry, index) { return <Cell key={index} fill={entry.color} />; })}
                  </Pie>
                </PieChart>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <p className="text-lg font-bold text-gray-800 dark:text-[#E0E0E0] leading-none">128</p>
                  <p className="text-[9px] text-gray-400 dark:text-[#808080]">Total</p>
                </div>
              </div>
              <div className="space-y-1.5 flex-1">
                {datosEstado.map(function (d) {
                  return (
                    <div key={d.nombre} className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />{d.nombre}</span>
                      <span className="font-semibold text-gray-700 dark:text-[#B0B0B0]">{d.valor} ({d.nombre === 'Pagadas' ? '71.9' : d.nombre === 'Pendientes' ? '21.9' : '6.2'}%)</span>
                    </div>
                  );
                })}
              </div>
            </div>
            <button className="w-full mt-3 text-center text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors cursor-pointer flex-none">Ver todas las facturas</button>
          </div>
        </div>
      </div>

      <FiltroAvanzadoModal
        abierto={showModalFiltroAvanzado}
        onClose={function () { setShowModalFiltroAvanzado(false); }}
        filtros={filtrosAvanzados}
        setFiltros={setFiltrosAvanzados}
      />

      {accionFactura && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={function () { setAccionFactura(null); }}>
          <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6" onClick={function (e) { e.stopPropagation(); }}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-gray-900 dark:text-[#E0E0E0]">Detalle de Factura</h2>
              <button onClick={function () { setAccionFactura(null); }} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#2C2C2C] cursor-pointer">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-gray-500 dark:text-[#909090]">N° Factura:</span><span className="font-semibold text-gray-800 dark:text-[#E0E0E0]">{accionFactura.numero}</span></div>
              <div className="flex justify-between"><span className="text-gray-500 dark:text-[#909090]">Fecha:</span><span className="text-gray-800 dark:text-[#E0E0E0]">{accionFactura.fecha}</span></div>
              <div className="flex justify-between"><span className="text-gray-500 dark:text-[#909090]">Cliente:</span><span className="font-semibold text-gray-800 dark:text-[#E0E0E0]">{accionFactura.cliente}</span></div>
              <div className="flex justify-between"><span className="text-gray-500 dark:text-[#909090]">Teléfono:</span><span className="text-gray-800 dark:text-[#E0E0E0]">{accionFactura.telefono || '—'}</span></div>
              <div className="flex justify-between"><span className="text-gray-500 dark:text-[#909090]">Mascota:</span><span className="font-semibold text-gray-800 dark:text-[#E0E0E0]">{accionFactura.mascota}</span></div>
              <div className="flex justify-between"><span className="text-gray-500 dark:text-[#909090]">Raza:</span><span className="text-gray-800 dark:text-[#E0E0E0]">{accionFactura.raza || '—'}</span></div>
              <div className="border-t border-gray-200 dark:border-[#333]" />
              <div className="flex justify-between"><span className="text-gray-500 dark:text-[#909090]">Total:</span><span className="text-lg font-bold text-gray-900 dark:text-[#E0E0E0]">S/ {Number(accionFactura.total).toFixed(2)}</span></div>
              <div className="flex justify-between"><span className="text-gray-500 dark:text-[#909090]">Estado:</span><span className={'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ' + (estadoStyles[accionFactura.estado] || '')}>{accionFactura.estado}</span></div>
              <div className="flex justify-between"><span className="text-gray-500 dark:text-[#909090]">Pago:</span><span className="text-gray-800 dark:text-[#E0E0E0]">{accionFactura.pago}</span></div>
            </div>
            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-[#333]">
              <button onClick={function () { setAccionFactura(null); }} className="px-5 py-2.5 rounded-xl border border-gray-300 dark:border-[#404040] text-sm font-medium text-gray-700 dark:text-[#C0C0C0] hover:bg-gray-50 dark:hover:bg-[#2C2C2C] transition-colors cursor-pointer">Cerrar</button>
              <button onClick={function () { handleEliminarFactura(accionFactura.dbId); setAccionFactura(null); }} className="px-5 py-2.5 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-colors cursor-pointer">Anular Factura</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FacturacionPage;
