import { useState } from 'react';
import MaterialDatePicker from '../components/MaterialDatePicker';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

var reportesIniciales = [
  { id: 1, tipo: 'Ventas', fecha: '2026-07-03', titulo: 'Reporte de Ventas - Julio 2026', formato: 'PDF' },
  { id: 2, tipo: 'Clientes', fecha: '2026-07-02', titulo: 'Reporte de Clientes Activos', formato: 'Excel' },
  { id: 3, tipo: 'Mascotas', fecha: '2026-07-01', titulo: 'Reporte de Pacientes Atendidos', formato: 'PDF' },
  { id: 4, tipo: 'Citas', fecha: '2026-06-30', titulo: 'Reporte de Citas Mensual', formato: 'PDF' },
  { id: 5, tipo: 'Inventario', fecha: '2026-06-29', titulo: 'Reporte de Stock Bajo', formato: 'Excel' },
];

var ventasData = [
  { mes: 'Ene', ventas: 4200 }, { mes: 'Feb', ventas: 5800 }, { mes: 'Mar', ventas: 4900 },
  { mes: 'Abr', ventas: 7200 }, { mes: 'May', ventas: 6100 }, { mes: 'Jun', ventas: 8400 }, { mes: 'Jul', ventas: 7800 },
];

var inventarioData = [
  { nombre: 'Medicamentos', value: 45 }, { nombre: 'Alimentos', value: 30 }, { nombre: 'Accesorios', value: 15 }, { nombre: 'Otros', value: 10 },
];

var coloresPie = ['#5F7B65', '#10B981', '#6366F1', '#F59E0B'];
var tipoIcono = { Ventas: '💰', Clientes: '👥', Mascotas: '🐾', Citas: '📅', Inventario: '📦' };

function datosSimulados(tipo) {
  switch (tipo) {
    case 'Ventas':
      return [
        { Fecha: '2026-07-01', Monto: 1250.00, Cliente: 'Juan Pérez', 'Método': 'Tarjeta' },
        { Fecha: '2026-07-02', Monto: 890.50, Cliente: 'María López', 'Método': 'Efectivo' },
        { Fecha: '2026-07-03', Monto: 2100.00, Cliente: 'Carlos Ruiz', 'Método': 'Yape' },
        { Fecha: '2026-07-04', Monto: 670.00, Cliente: 'Ana Torres', 'Método': 'Tarjeta' },
        { Fecha: '2026-07-05', Monto: 1450.00, Cliente: 'Pedro Sánchez', 'Método': 'Efectivo' },
      ];
    case 'Clientes':
      return [
        { Nombre: 'Juan Pérez', Mascota: 'Max', Teléfono: '999-111-222', 'Última Visita': '2026-06-28' },
        { Nombre: 'María López', Mascota: 'Luna', Teléfono: '999-333-444', 'Última Visita': '2026-07-01' },
        { Nombre: 'Carlos Ruiz', Mascota: 'Rocky', Teléfono: '999-555-666', 'Última Visita': '2026-07-02' },
        { Nombre: 'Ana Torres', Mascota: 'Mimi', Teléfono: '999-777-888', 'Última Visita': '2026-06-30' },
      ];
    case 'Mascotas':
      return [
        { Nombre: 'Max', Especie: 'Canino', Raza: 'Labrador', Edad: 3, Dueño: 'Juan Pérez' },
        { Nombre: 'Luna', Especie: 'Felino', Raza: 'Siames', Edad: 2, Dueño: 'María López' },
        { Nombre: 'Rocky', Especie: 'Canino', Raza: 'Pastor Alemán', Edad: 5, Dueño: 'Carlos Ruiz' },
        { Nombre: 'Mimi', Especie: 'Felino', Raza: 'Persa', Edad: 4, Dueño: 'Ana Torres' },
        { Nombre: 'Toby', Especie: 'Canino', Raza: 'Beagle', Edad: 1, Dueño: 'Pedro Sánchez' },
      ];
    case 'Citas':
      return [
        { Fecha: '2026-07-05', Hora: '09:00', Mascota: 'Max', Veterinario: 'Dr. García', Estado: 'Confirmada' },
        { Fecha: '2026-07-05', Hora: '10:30', Mascota: 'Luna', Veterinario: 'Dr. García', Estado: 'Confirmada' },
        { Fecha: '2026-07-06', Hora: '11:00', Mascota: 'Rocky', Veterinario: 'Dra. Torres', Estado: 'Pendiente' },
        { Fecha: '2026-07-06', Hora: '15:00', Mascota: 'Mimi', Veterinario: 'Dr. García', Estado: 'Confirmada' },
        { Fecha: '2026-07-07', Hora: '08:30', Mascota: 'Toby', Veterinario: 'Dra. Torres', Estado: 'Pendiente' },
      ];
    case 'Inventario':
      return [
        { Producto: 'Amoxicilina', Stock: 45, 'Stock Mínimo': 20, Precio: 35.00, Proveedor: 'Vet Pharma' },
        { Producto: 'Royal Canin 15kg', Stock: 12, 'Stock Mínimo': 10, Precio: 180.00, Proveedor: 'Royal Canin' },
        { Producto: 'Vacuna Triple', Stock: 8, 'Stock Mínimo': 15, Precio: 65.00, Proveedor: 'Zoetis' },
        { Producto: 'Collar Ajustable', Stock: 30, 'Stock Mínimo': 5, Precio: 25.00, Proveedor: 'Kong' },
        { Producto: 'Shampoo Medicado', Stock: 3, 'Stock Mínimo': 10, Precio: 42.00, Proveedor: 'Bayer' },
      ];
    default:
      return [];
  }
}

function descargarPDF(reporte) {
  var doc = new jsPDF();
  doc.setFontSize(16);
  doc.text(reporte.titulo, 14, 20);
  doc.setFontSize(10);
  doc.text('Generado: ' + reporte.fecha + ' | Tipo: ' + reporte.tipo, 14, 28);

  var data = datosSimulados(reporte.tipo);
  if (data.length > 0) {
    var headers = Object.keys(data[0]);
    var rows = data.map(function (r) { return headers.map(function (h) { return r[h]; }); });
    doc.autoTable({ head: [headers], body: rows, startY: 34, theme: 'grid', styles: { fontSize: 8 } });
  }

  doc.save(reporte.titulo.replace(/\s+/g, '_') + '.pdf');
}

function descargarExcel(reporte) {
  var wb = XLSX.utils.book_new();
  var data = datosSimulados(reporte.tipo);
  var ws = XLSX.utils.json_to_sheet(data);
  XLSX.utils.book_append_sheet(wb, ws, 'Reporte');
  XLSX.writeFile(wb, reporte.titulo.replace(/\s+/g, '_') + '.xlsx');
}

function NuevoReporteModal({ onClose, onGenerar }) {
  var [form, setForm] = useState({ tipo: 'Ventas', fechaDesde: '', fechaHasta: '' });

  var hoy = new Date().toISOString().split('T')[0];

  function handleChange(e) {
    setForm(Object.assign({}, form, { [e.target.name]: e.target.value }));
  }

  function handleSubmit() {
    if (!form.fechaDesde || !form.fechaHasta) return;
    onGenerar(form);
    onClose();
  }

  var inputClass = 'w-full rounded-lg border border-gray-300 dark:border-[#404040] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#5F7B65] focus:border-[#5F7B65] bg-white dark:bg-[#2C2C2C] text-gray-900 dark:text-[#E0E0E0]';
  var labelClass = 'block text-sm font-medium text-gray-700 dark:text-[#B0B0B0] mb-1';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl shadow-2xl w-full max-w-lg mx-4">
        <div className="flex items-center justify-between p-6 pb-0">
          <h2 className="text-xl font-bold text-gray-900 dark:text-[#E0E0E0]">Generar Nuevo Reporte</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#333] text-gray-400 dark:text-[#808080] hover:text-gray-600 dark:hover:text-[#A0A0A0] transition-colors cursor-pointer">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className={labelClass}>Tipo de Reporte *</label>
            <select name="tipo" value={form.tipo} onChange={handleChange} className={inputClass}>
              <option value="Ventas">Ventas</option>
              <option value="Clientes">Clientes</option>
              <option value="Mascotas">Mascotas</option>
              <option value="Citas">Citas</option>
              <option value="Inventario">Inventario</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <MaterialDatePicker value={form.fechaDesde} onChange={function (val) { handleChange({ target: { name: 'fechaDesde', value: val } }); }} label="Fecha Desde *" placeholder="DD/MM/YYYY" />
            </div>
            <div>
              <MaterialDatePicker value={form.fechaHasta} onChange={function (val) { handleChange({ target: { name: 'fechaHasta', value: val } }); }} label="Fecha Hasta *" placeholder="DD/MM/YYYY" />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 p-6 pt-2">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl border border-gray-300 dark:border-[#404040] text-sm font-medium text-gray-700 dark:text-[#D0D0D0] hover:bg-gray-50 dark:hover:bg-[#333] transition-colors cursor-pointer">Cancelar</button>
          <button onClick={handleSubmit} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white shadow-sm transition-colors cursor-pointer" style={{ backgroundColor: '#5F7B65' }}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182" /></svg>
            Generar Reporte
          </button>
        </div>
      </div>
    </div>
  );
}

function ReportesPage() {
  var [reportes, setReportes] = useState(reportesIniciales);
  var [fechaDesde, setFechaDesde] = useState('');
  var [fechaHasta, setFechaHasta] = useState('');
  var [tipoReporte, setTipoReporte] = useState('Ventas');
  var [reporteSeleccionado, setReporteSeleccionado] = useState(null);
  var [showModal, setShowModal] = useState(false);

  function agregarReporte(datos) {
    var nuevo = {
      id: reportes.length + 1,
      tipo: datos.tipo,
      fecha: new Date().toISOString().split('T')[0],
      titulo: 'Reporte de ' + datos.tipo + ' (' + datos.fechaDesde + ' a ' + datos.fechaHasta + ')',
      formato: 'PDF',
    };
    setReportes([nuevo].concat(reportes));
    setReporteSeleccionado(nuevo);
  }

  function generarReporteFiltro() {
    var nuevo = {
      id: reportes.length + 1,
      tipo: tipoReporte,
      fecha: new Date().toISOString().split('T')[0],
      titulo: 'Reporte de ' + tipoReporte + ' - ' + new Date().toLocaleDateString('es-PE'),
      formato: 'PDF',
    };
    setReportes([nuevo].concat(reportes));
    setReporteSeleccionado(nuevo);
  }

  function exportarTodo() {
    var wb = XLSX.utils.book_new();

    var kpiData = [
      { Indicador: 'Reportes Generados', Valor: reportes.length },
      { Indicador: 'Ventas Totales', Valor: 'S/. 44,400' },
      { Indicador: 'Pacientes Atendidos', Valor: 284 },
      { Indicador: 'Citas Programadas', Valor: 56 },
    ];
    var wsKPI = XLSX.utils.json_to_sheet(kpiData);
    XLSX.utils.book_append_sheet(wb, wsKPI, 'Resumen KPIs');

    var reportesData = reportes.map(function (r) {
      return { Título: r.titulo, Tipo: r.tipo, Fecha: r.fecha, Formato: r.formato };
    });
    var wsReportes = XLSX.utils.json_to_sheet(reportesData);
    XLSX.utils.book_append_sheet(wb, wsReportes, 'Reportes Generados');

    var filename = 'Reportes_' + new Date().toISOString().split('T')[0] + '.xlsx';
    XLSX.writeFile(wb, filename);
  }

  var dataPreview = reporteSeleccionado ? datosSimulados(reporteSeleccionado.tipo) : [];

  return (
    <div className="flex flex-col h-full gap-6">
      <div className="flex flex-none items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-[#E0E0E0]">Reportes y Estadísticas</h1>
          <p className="text-sm text-gray-500 dark:text-[#909090] mt-1">Genera informes detallados y visualiza el rendimiento de la clínica</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={exportarTodo} className="flex items-center gap-2 rounded-xl border border-gray-300 dark:border-[#404040] bg-white dark:bg-[#2C2C2C] px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-[#D0D0D0] hover:bg-gray-50 dark:hover:bg-[#333] transition-colors cursor-pointer">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
            Exportar Todo
          </button>
          <button onClick={function () { setShowModal(true); }} className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors cursor-pointer" style={{ backgroundColor: '#5F7B65' }}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
            Nuevo Reporte
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-gray-200 dark:border-[#333] bg-white dark:bg-[#1E1E1E] p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-[#909090] font-medium">Reportes Generados</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-[#E0E0E0] mt-1">{reportes.length}</p>
            </div>
            <div className="h-11 w-11 flex items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" /></svg>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 dark:border-[#333] bg-white dark:bg-[#1E1E1E] p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-[#909090] font-medium">Ventas Totales</p>
              <p className="text-2xl font-bold text-emerald-600 mt-1">S/. 44,400</p>
            </div>
            <div className="h-11 w-11 flex items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 dark:border-[#333] bg-white dark:bg-[#1E1E1E] p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-[#909090] font-medium">Pacientes Atendidos</p>
              <p className="text-2xl font-bold text-purple-600 mt-1">284</p>
            </div>
            <div className="h-11 w-11 flex items-center justify-center rounded-xl bg-purple-50 text-purple-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m7.725-9.25H5.904m7.725 0a2.25 2.25 0 0 0-2.25-2.25H5.904a2.25 2.25 0 0 0-2.25 2.25v8.25a2.25 2.25 0 0 0 2.25 2.25h2.25a2.25 2.25 0 0 0 2.25-2.25V9.75" /></svg>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 dark:border-[#333] bg-white dark:bg-[#1E1E1E] p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-[#909090] font-medium">Citas Programadas</p>
              <p className="text-2xl font-bold text-orange-600 mt-1">56</p>
            </div>
            <div className="h-11 w-11 flex items-center justify-center rounded-xl bg-orange-50 text-orange-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" /></svg>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 dark:border-[#333] bg-white dark:bg-[#1E1E1E] p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row items-end gap-4">
          <div className="flex-1">
            <MaterialDatePicker value={fechaDesde} onChange={setFechaDesde} label="Desde" placeholder="DD/MM/YYYY" />
          </div>
          <div className="flex-1">
            <MaterialDatePicker value={fechaHasta} onChange={setFechaHasta} label="Hasta" placeholder="DD/MM/YYYY" />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-[#B0B0B0] mb-1">Tipo de Reporte</label>
            <select value={tipoReporte} onChange={function (e) { setTipoReporte(e.target.value); }} className="w-full rounded-lg border border-gray-300 dark:border-[#404040] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#5F7B65] cursor-pointer bg-white dark:bg-[#2C2C2C] text-gray-900 dark:text-[#E0E0E0]">
              <option value="Ventas">Ventas</option>
              <option value="Clientes">Clientes</option>
              <option value="Mascotas">Mascotas</option>
              <option value="Citas">Citas</option>
              <option value="Inventario">Inventario</option>
            </select>
          </div>
          <button onClick={generarReporteFiltro} className="flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors cursor-pointer whitespace-nowrap" style={{ backgroundColor: '#5F7B65' }}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182" /></svg>
            Generar Reporte
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-0">
        <div className="flex flex-col rounded-xl border border-gray-200 dark:border-[#333] bg-white dark:bg-[#1E1E1E] shadow-sm">
          <div className="flex-none p-5 border-b border-gray-100 dark:border-[#333]">
            <h2 className="text-lg font-bold text-gray-900 dark:text-[#E0E0E0]">Últimos Reportes Generados</h2>
          </div>
          <div className="flex-1 p-4 space-y-3 overflow-y-auto">
            {reportes.map(function (rep) {
              var activo = reporteSeleccionado && reporteSeleccionado.id === rep.id;
              return (
                <div key={rep.id} onClick={function () { setReporteSeleccionado(rep); }} className={'p-4 rounded-xl border cursor-pointer transition-all ' + (activo ? 'border-[#5F7B65] bg-[#5F7B65]/5 shadow-sm' : 'border-gray-200 dark:border-[#333] hover:border-gray-300 dark:hover:border-[#404040] hover:bg-gray-50 dark:hover:bg-[#2C2C2C]')}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{tipoIcono[rep.tipo] || '📄'}</span>
                      <div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-[#E0E0E0]">{rep.titulo}</p>
                        <p className="text-xs text-gray-500 dark:text-[#909090] mt-0.5">Generado: {rep.fecha} · {rep.formato}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <button onClick={function (e) { e.stopPropagation(); descargarPDF(rep); }} className="flex items-center gap-1 rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 px-3 py-1.5 text-xs font-medium text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors cursor-pointer">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m.75 12 3 3m0 0 3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" /></svg>
                      PDF
                    </button>
                    <button onClick={function (e) { e.stopPropagation(); descargarExcel(rep); }} className="flex items-center gap-1 rounded-lg border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 px-3 py-1.5 text-xs font-medium text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors cursor-pointer">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
                      Excel
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col rounded-xl border border-gray-200 dark:border-[#333] bg-white dark:bg-[#1E1E1E] shadow-sm">
          <div className="flex-none p-5 border-b border-gray-100 dark:border-[#333]">
            <h2 className="text-lg font-bold text-gray-900 dark:text-[#E0E0E0]">Vista Previa del Reporte</h2>
          </div>
          <div className="flex-1 p-5 overflow-auto">
            {!reporteSeleccionado ? (
              <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-center">
                <svg className="w-16 h-16 text-gray-300 dark:text-[#606060] mb-4" fill="none" stroke="currentColor" strokeWidth={1} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m5.815 6.455-3.72 3.72a2.25 2.25 0 0 1-3.182 0l-.364-.364a2.25 2.25 0 0 1 0-3.182l3.72-3.72m5.815 6.455H12m0 0V9.75m0 3.75h3.75" /></svg>
                <p className="text-gray-400 dark:text-[#808080] text-sm">Selecciona un reporte para ver la vista previa</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{tipoIcono[reporteSeleccionado.tipo] || '📄'}</span>
                  <div>
                    <h3 className="text-base font-bold text-gray-900 dark:text-[#E0E0E0]">{reporteSeleccionado.titulo}</h3>
                    <p className="text-xs text-gray-500 dark:text-[#909090]">Generado: {reporteSeleccionado.fecha} · {reporteSeleccionado.formato}</p>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-[#333]">
                        {dataPreview.length > 0 && Object.keys(dataPreview[0]).map(function (col) {
                          return <th key={col} className="text-left py-2.5 px-3 text-xs font-semibold text-gray-500 dark:text-[#909090] uppercase tracking-wider">{col}</th>;
                        })}
                      </tr>
                    </thead>
                    <tbody>
                      {dataPreview.map(function (row, i) {
                        return (
                          <tr key={i} className="border-b border-gray-100 dark:border-[#2C2C2C] hover:bg-gray-50 dark:hover:bg-[#2C2C2C] transition-colors">
                            {Object.values(row).map(function (val, j) {
                              return <td key={j} className="py-2.5 px-3 text-gray-700 dark:text-[#C0C0C0]">{typeof val === 'number' && val % 1 !== 0 ? 'S/. ' + val.toFixed(2) : val}</td>;
                            })}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button onClick={function () { descargarPDF(reporteSeleccionado); }} className="flex items-center gap-1.5 rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 px-4 py-2 text-xs font-medium text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors cursor-pointer">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m.75 12 3 3m0 0 3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" /></svg>
                    Descargar PDF
                  </button>
                  <button onClick={function () { descargarExcel(reporteSeleccionado); }} className="flex items-center gap-1.5 rounded-lg border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 px-4 py-2 text-xs font-medium text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors cursor-pointer">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
                    Descargar Excel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {showModal && <NuevoReporteModal onClose={function () { setShowModal(false); }} onGenerar={agregarReporte} />}
    </div>
  );
}

export default ReportesPage;
