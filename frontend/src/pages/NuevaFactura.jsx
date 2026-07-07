import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/axiosConfig';
import MaterialDatePicker from '../components/MaterialDatePicker';

const categorias = ['Servicios', 'Medicamentos', 'Accesorios', 'Alimentos', 'Vacunas', 'Higiene'];

let nextId = 4;

function NuevaFactura() {
  const navigate = useNavigate();
  const [clientes, setClientes] = useState([]);
  const [todosMascotas, setTodosMascotas] = useState([]);
  const [clienteId, setClienteId] = useState('');
  const [mascotaId, setMascotaId] = useState('');
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
  const [numFactura] = useState('F-000129');
  const [metodoPago, setMetodoPago] = useState('Efectivo');
  const [estadoPago, setEstadoPago] = useState('Pagada');
  const [observaciones, setObservaciones] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [items, setItems] = useState([
    { id: 1, descripcion: 'Consulta General', categoria: 'Servicios', cantidad: 1, precio: 80, descuento: 0 },
    { id: 2, descripcion: 'Vacuna Antirrábica', categoria: 'Medicamentos', cantidad: 1, precio: 60, descuento: 0 },
    { id: 3, descripcion: 'Desparasitación Interna', categoria: 'Medicamentos', cantidad: 1, precio: 35, descuento: 0 },
  ]);

  useEffect(function () {
    API.get('/clientes').then(function (res) { setClientes(res.data); }).catch(function () {});
    API.get('/mascotas').then(function (res) { setTodosMascotas(res.data); }).catch(function () {});
  }, []);

  var clienteSel = clientes.find(function (c) { return c.id === Number(clienteId); });
  var mascotasDisponibles = clienteId ? todosMascotas.filter(function (m) { return m.cliente && (m.cliente.id === Number(clienteId) || m.cliente.id === clienteId); }) : [];
  var mascotaSel = mascotasDisponibles.find(function (m) { return m.id === Number(mascotaId); });

  var subtotalBruto = items.reduce(function (sum, item) { return sum + item.cantidad * item.precio; }, 0);
  var descuentoTotal = items.reduce(function (sum, item) { return sum + item.cantidad * item.precio * item.descuento / 100; }, 0);
  var subtotalNeto = subtotalBruto - descuentoTotal;
  var igv = subtotalNeto * 0.18;
  var totalPagar = subtotalNeto + igv;

  function addItem() {
    setItems([].concat(items, [{ id: nextId++, descripcion: busqueda || 'Nuevo Producto', categoria: 'Servicios', cantidad: 1, precio: 0, descuento: 0 }]));
    setBusqueda('');
  }

  function removeItem(id) {
    setItems(items.filter(function (item) { return item.id !== id; }));
  }

  function updateItem(id, field, value) {
    setItems(items.map(function (item) { return item.id === id ? Object.assign({}, item, { [field]: value }) : item; }));
  }

  function incrementarCantidad(id) {
    setItems(items.map(function (item) { return item.id === id ? Object.assign({}, item, { cantidad: item.cantidad + 1 }) : item; }));
  }

  function disminuirCantidad(id) {
    setItems(items.map(function (item) { return item.id === id && item.cantidad > 1 ? Object.assign({}, item, { cantidad: item.cantidad - 1 }) : item; }));
  }

  function guardarFactura(estado) {
    var payload = {
      numero: numFactura,
      fecha: fecha,
      cliente: clienteSel ? (clienteSel.nombre + ' ' + (clienteSel.apellidos || '')).trim() : '',
      telefono: clienteSel ? clienteSel.telefono || '' : '',
      mascota: mascotaSel ? mascotaSel.nombre : '',
      raza: mascotaSel ? mascotaSel.raza || '' : '',
      total: totalPagar,
      estado: estado,
      metodoPago: metodoPago,
    };
    API.post('/facturas', payload).then(function () {
      navigate('/facturacion');
    }).catch(function () {
      alert('Error al guardar la factura');
    });
  }

  const inputClass = 'w-full rounded-xl border border-gray-300 dark:border-[#404040] bg-white dark:bg-[#2C2C2C] px-4 py-2.5 text-sm text-gray-800 dark:text-[#E0E0E0] transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20';

  return (
    <div className="flex flex-col min-h-screen gap-6">
      <div className="flex-none flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-[#909090] mb-1">
            <span>Ventas</span>
            <span>/</span>
            <span>Facturación</span>
            <span>/</span>
            <span className="text-gray-800 dark:text-[#E0E0E0] font-medium">Nueva Factura</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-[#E0E0E0]">Nueva Factura</h1>
        </div>
        <button onClick={() => navigate('/facturacion')} className="flex items-center gap-2 rounded-xl border border-gray-300 dark:border-[#404040] bg-white dark:bg-[#2C2C2C] px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-[#D0D0D0] transition-colors hover:bg-gray-50 dark:hover:bg-[#333] cursor-pointer">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" /></svg>
          Volver a Facturación
        </button>
      </div>

      <div className="grid grid-cols-12 gap-6 flex-1 min-h-0">
        <div className="col-span-9 flex flex-col gap-6 min-h-0 overflow-auto">
          <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl border border-gray-200 dark:border-[#333] shadow-sm p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 text-sm font-bold">1</div>
              <h3 className="text-sm font-bold text-gray-800 dark:text-[#E0E0E0]">Información General</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-[#A0A0A0] mb-1.5">Cliente (Dueño) *</label>
                <select value={clienteId} onChange={function (e) { setClienteId(e.target.value); setMascotaId(''); }} className={inputClass}>
                  <option value="">Seleccionar cliente...</option>
                  {clientes.map(function (c) { return <option key={c.id} value={c.id}>{c.nombre} {c.apellidos || ''} — {c.telefono || ''}</option>; })}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-[#A0A0A0] mb-1.5">Mascota *</label>
                <select value={mascotaId} onChange={function (e) { setMascotaId(e.target.value); }} className={inputClass} disabled={!clienteId}>
                  <option value="">Seleccionar mascota...</option>
                  {mascotasDisponibles.map(function (m) { return <option key={m.id} value={m.id}>{m.nombre} — {m.raza || ''}</option>; })}
                </select>
              </div>
              <div>
                <MaterialDatePicker value={fecha} onChange={setFecha} label="Fecha de Emisión *" placeholder="DD/MM/YYYY" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-[#A0A0A0] mb-1.5">N° de Factura *</label>
                <input type="text" value={numFactura} readOnly className={inputClass + ' bg-gray-50 dark:bg-[#2C2C2C] text-gray-500 dark:text-[#909090]'} />
                <p className="text-[11px] text-gray-400 dark:text-[#808080] mt-1">Generado automáticamente</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl border border-gray-200 dark:border-[#333] shadow-sm p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 text-sm font-bold">2</div>
              <h3 className="text-sm font-bold text-gray-800 dark:text-[#E0E0E0]">Detalles de la Factura</h3>
            </div>
            <div className="flex items-center gap-3 mb-4">
              <div className="relative flex-1">
                <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-[#808080]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>
                <input type="text" value={busqueda} onChange={function (e) { setBusqueda(e.target.value); }} placeholder="Buscar producto o servicio..." className={inputClass + ' pl-10'} />
              </div>
              <button onClick={addItem} className="rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors cursor-pointer whitespace-nowrap" style={{ backgroundColor: '#5F7B65' }}>
                + Agregar Item
              </button>
            </div>
            <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-[#333]">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-[#333] bg-gray-50 dark:bg-[#2C2C2C]">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-[#909090] uppercase tracking-wider">Descripción</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-[#909090] uppercase tracking-wider">Categoría</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 dark:text-[#909090] uppercase tracking-wider">Cantidad</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 dark:text-[#909090] uppercase tracking-wider">Precio Unit.</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 dark:text-[#909090] uppercase tracking-wider">Descuento</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 dark:text-[#909090] uppercase tracking-wider">Subtotal</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 dark:text-[#909090] uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-[#333]">
                  {items.map(function (item) {
                    var itemSubtotal = item.cantidad * item.precio * (1 - item.descuento / 100);
                    return (
                      <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-[#2C2C2C] transition-colors">
                        <td className="px-4 py-3">
                          <input type="text" value={item.descripcion} onChange={function (e) { updateItem(item.id, 'descripcion', e.target.value); }}
                            className="w-full rounded-lg border border-gray-200 dark:border-[#333] px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/20 bg-white dark:bg-[#2C2C2C] text-gray-900 dark:text-[#E0E0E0]" />
                        </td>
                        <td className="px-4 py-3">
                          <select value={item.categoria} onChange={function (e) { updateItem(item.id, 'categoria', e.target.value); }}
                            className="rounded-lg border border-gray-200 dark:border-[#333] px-3 py-1.5 text-sm bg-white dark:bg-[#2C2C2C] text-gray-700 dark:text-[#D0D0D0] focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/20">
                            {categorias.map(function (c) { return <option key={c} value={c}>{c}</option>; })}
                          </select>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center gap-1">
                            <button onClick={function () { disminuirCantidad(item.id); }} className="h-7 w-7 flex items-center justify-center rounded-lg border border-gray-300 dark:border-[#404040] text-gray-600 dark:text-[#A0A0A0] hover:bg-gray-100 dark:hover:bg-[#333] transition-colors cursor-pointer text-sm font-bold">-</button>
                            <span className="w-8 text-center text-sm font-semibold text-gray-800 dark:text-[#E0E0E0]">{item.cantidad}</span>
                            <button onClick={function () { incrementarCantidad(item.id); }} className="h-7 w-7 flex items-center justify-center rounded-lg border border-gray-300 dark:border-[#404040] text-gray-600 dark:text-[#A0A0A0] hover:bg-gray-100 dark:hover:bg-[#333] transition-colors cursor-pointer text-sm font-bold">+</button>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-1">
                            <span className="text-sm text-gray-500 dark:text-[#909090]">S/</span>
                            <input type="number" value={item.precio} onChange={function (e) { updateItem(item.id, 'precio', parseFloat(e.target.value) || 0); }}
                              className="w-20 rounded-lg border border-gray-200 dark:border-[#333] px-2 py-1.5 text-sm text-right focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/20 bg-white dark:bg-[#2C2C2C] text-gray-900 dark:text-[#E0E0E0]" />
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center gap-1">
                            <input type="number" value={item.descuento} onChange={function (e) { updateItem(item.id, 'descuento', parseFloat(e.target.value) || 0); }} min="0" max="100"
                              className="w-14 rounded-lg border border-gray-200 dark:border-[#333] px-2 py-1.5 text-sm text-center focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/20 bg-white dark:bg-[#2C2C2C] text-gray-900 dark:text-[#E0E0E0]" />
                            <span className="text-xs text-gray-400 dark:text-[#808080]">%</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <span className="text-sm font-semibold text-gray-800 dark:text-[#E0E0E0]">S/ {itemSubtotal.toFixed(2)}</span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button onClick={function () { removeItem(item.id); }} className="h-8 w-8 flex items-center justify-center rounded-lg text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 transition-colors cursor-pointer mx-auto">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                  {items.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-4 py-12 text-center text-sm text-gray-400 dark:text-[#808080]">No hay items. Haz clic en "+ Agregar Item" para comenzar.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl border border-gray-200 dark:border-[#333] shadow-sm p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 text-sm font-bold">3</div>
              <h3 className="text-sm font-bold text-gray-800 dark:text-[#E0E0E0]">Información Adicional</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-gray-600 dark:text-[#A0A0A0] mb-1.5">Observaciones</label>
                <textarea value={observaciones} onChange={function (e) { setObservaciones(e.target.value); }} maxLength={250} rows={3} placeholder="Notas adicionales sobre la factura..."
                  className={inputClass + ' resize-none'} />
                <p className="text-[11px] text-gray-400 dark:text-[#808080] mt-1">{observaciones.length}/250</p>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-[#A0A0A0] mb-1.5">Método de Pago</label>
                <select value={metodoPago} onChange={function (e) { setMetodoPago(e.target.value); }} className={inputClass}>
                  <option value="Efectivo">Efectivo</option>
                  <option value="Tarjeta">Tarjeta</option>
                  <option value="Yape">Yape</option>
                  <option value="Plin">Plin</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-[#A0A0A0] mb-1.5">Estado de Pago</label>
                <div className="flex gap-2">
                  {['Pagada', 'Pendiente', 'Pago Parcial'].map(function (estado) {
                    return (
                      <button key={estado} onClick={function () { setEstadoPago(estado); }}
                        className={'flex-1 rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors cursor-pointer ' + (estadoPago === estado ? 'border-cobalt bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' : 'border-gray-300 dark:border-[#404040] bg-white dark:bg-[#2C2C2C] text-gray-600 dark:text-[#A0A0A0] hover:bg-gray-50 dark:hover:bg-[#333]')}>
                        {estado}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2 pb-4">
            <button onClick={function () { navigate('/facturacion'); }} className="rounded-xl border border-gray-300 dark:border-[#404040] bg-white dark:bg-[#2C2C2C] px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-[#D0D0D0] transition-colors hover:bg-gray-50 dark:hover:bg-[#333] cursor-pointer">
              Cancelar
            </button>
            <button onClick={function () { guardarFactura('Borrador'); }} className="rounded-xl border border-emerald-300 dark:border-emerald-700 bg-white dark:bg-[#2C2C2C] px-5 py-2.5 text-sm font-semibold text-emerald-600 dark:text-emerald-400 transition-colors hover:bg-emerald-50 dark:hover:bg-emerald-900/20 cursor-pointer">
              Guardar Borrador
            </button>
            <button onClick={function () { guardarFactura('Pagada'); }} className="rounded-xl px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors cursor-pointer" style={{ backgroundColor: '#5F7B65' }}>
              Emitir Factura
            </button>
          </div>
        </div>

        <div className="col-span-3 space-y-4">
          <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl border border-gray-200 dark:border-[#333] shadow-sm p-5">
            <h4 className="text-sm font-bold text-gray-800 dark:text-[#E0E0E0] mb-4">Resumen de la Factura</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between"><span className="text-xs text-gray-500 dark:text-[#909090]">N° Factura</span><span className="text-sm font-semibold text-gray-800 dark:text-[#E0E0E0]">{numFactura}</span></div>
              <div className="flex items-center justify-between"><span className="text-xs text-gray-500 dark:text-[#909090]">Fecha</span><span className="text-sm font-medium text-gray-800 dark:text-[#E0E0E0]">{fecha}</span></div>
              <div className="flex items-center justify-between"><span className="text-xs text-gray-500 dark:text-[#909090]">Cliente</span><span className="text-sm font-medium text-gray-800 dark:text-[#E0E0E0]">{clienteSel ? clienteSel.nombre : '—'}</span></div>
              <div className="flex items-center justify-between"><span className="text-xs text-gray-500 dark:text-[#909090]">Mascota</span><span className="text-sm font-medium text-gray-800 dark:text-[#E0E0E0]">{mascotaSel ? mascotaSel.nombre : '—'}</span></div>
            </div>
          </div>

          <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl border border-gray-200 dark:border-[#333] shadow-sm p-5">
            <h4 className="text-sm font-bold text-gray-800 dark:text-[#E0E0E0] mb-4">Detalles Financieros</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between"><span className="text-sm text-gray-600 dark:text-[#A0A0A0]">Subtotal ({items.length} items)</span><span className="text-sm font-medium text-gray-800 dark:text-[#E0E0E0]">S/ {subtotalBruto.toFixed(2)}</span></div>
              <div className="flex items-center justify-between"><span className="text-sm text-gray-600 dark:text-[#A0A0A0]">Descuento</span><span className="text-sm font-medium text-red-500">- S/ {descuentoTotal.toFixed(2)}</span></div>
              <div className="flex items-center justify-between"><span className="text-sm text-gray-600 dark:text-[#A0A0A0]">Subtotal Neto</span><span className="text-sm font-medium text-gray-800 dark:text-[#E0E0E0]">S/ {subtotalNeto.toFixed(2)}</span></div>
              <div className="flex items-center justify-between"><span className="text-sm text-gray-600 dark:text-[#A0A0A0]">IGV (18%)</span><span className="text-sm font-medium text-gray-800 dark:text-[#E0E0E0]">S/ {igv.toFixed(2)}</span></div>
              <div className="border-t border-gray-200 dark:border-[#333] pt-3 flex items-center justify-between">
                <span className="text-sm font-bold text-gray-800 dark:text-[#E0E0E0]">Total a Pagar</span>
                <span className="text-xl font-bold text-gray-900 dark:text-[#E0E0E0]">S/ {totalPagar.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
              </svg>
              <p className="text-xs text-emerald-700 dark:text-emerald-300 leading-relaxed">Esta factura será registrada en el sistema y se podrá visualizar en el historial.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NuevaFactura;
