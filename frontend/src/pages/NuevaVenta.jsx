import { useState, useEffect, useRef } from 'react';
import API from '../services/axiosConfig';
import { useNavigate } from 'react-router-dom';

var inputClass = "w-full px-4 py-2.5 border border-gray-300 dark:border-[#404040] rounded-lg focus:ring-2 focus:ring-[#5F7B65] focus:border-[#5F7B65] outline-none bg-white dark:bg-[#2C2C2C] text-gray-900 dark:text-[#E0E0E0] text-sm";
var selectClass = "w-full px-4 py-2.5 border border-gray-300 dark:border-[#404040] rounded-lg focus:ring-2 focus:ring-[#5F7B65] focus:border-[#5F7B65] outline-none bg-white dark:bg-[#2C2C2C] text-gray-900 dark:text-[#E0E0E0] text-sm cursor-pointer";

function formatMoney(val) {
  return val > 0 ? 'S/ ' + val.toFixed(2) : '—';
}

export default function NuevaVenta() {
  var navigate = useNavigate();
  var [tipo, setTipo] = useState('BOLETA');
  var [form, setForm] = useState({ clienteDoc: '', clienteNombre: '', clienteDireccion: '', mascotaId: '', mascotaNombre: '' });
  var [items, setItems] = useState([{ descripcion: '', cantidad: 1, precioUnitario: 0 }]);
  var [mascotas, setMascotas] = useState([]);
  var [empresa, setEmpresa] = useState(null);
  var [enviando, setEnviando] = useState(false);
  var [error, setError] = useState('');
  var [mascotaSel, setMascotaSel] = useState(null);
  var [mascotaOpen, setMascotaOpen] = useState(false);
  var [mascotaSearch, setMascotaSearch] = useState('');
  var mascotaRef = useRef(null);

  useEffect(function () {
    API.get('/api/empresa').then(function (r) { setEmpresa(r.data); }).catch(function () {});
    API.get('/api/mascotas').then(function (r) { setMascotas(r.data || []); }).catch(function () {});
  }, []);

  useEffect(function () {
    function handleClickOut(e) {
      if (mascotaRef.current && !mascotaRef.current.contains(e.target)) {
        setMascotaOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOut);
    return function () { document.removeEventListener('mousedown', handleClickOut); };
  }, []);

  function handleFormChange(e) {
    setForm(function (f) { return { ...f, [e.target.name]: e.target.value }; });
  }

  function handleItemChange(i, field, value) {
    var newItems = items.map(function (item, idx) {
      if (idx !== i) return item;
      var updated = { ...item, [field]: value };
      if (field === 'cantidad' || field === 'precioUnitario') {
        updated.precioTotal = (parseFloat(updated.cantidad || 0) * parseFloat(updated.precioUnitario || 0));
      }
      return updated;
    });
    setItems(newItems);
  }

  function addItem() {
    setItems(function (prev) { return [...prev, { descripcion: '', cantidad: 1, precioUnitario: 0 }]; });
  }

  function removeItem(i) {
    if (items.length <= 1) return;
    setItems(function (prev) { return prev.filter(function (_, idx) { return idx !== i; }); });
  }

  function selectMascota(m) {
    setMascotaSel(m);
    setMascotaOpen(false);
    setMascotaSearch('');
    setForm(function (f) { return { ...f, mascotaId: m ? String(m.id) : '', mascotaNombre: m ? m.nombre + (m.raza ? ' (' + m.raza + ')' : '') : '' }; });
  }

  var mascotasFiltradas = mascotas.filter(function (m) {
    if (!mascotaSearch) return true;
    var q = mascotaSearch.toLowerCase();
    return m.nombre.toLowerCase().includes(q) || (m.raza && m.raza.toLowerCase().includes(q)) || (m.cliente && m.cliente.toLowerCase().includes(q));
  });

  var total = items.reduce(function (sum, item) {
    return sum + (parseFloat(item.cantidad || 0) * parseFloat(item.precioUnitario || 0));
  }, 0);
  var igv = total * 0.18;
  var totalConIgv = total + igv;

  function handleEmitir() {
    if (!form.clienteDoc || !form.clienteNombre) {
      setError('Debe ingresar documento y nombre del cliente');
      return;
    }
    if (items.length === 0 || !items[0].descripcion) {
      setError('Debe agregar al menos un item con descripcion');
      return;
    }
    setError('');
    setEnviando(true);

    var numeroSerie = tipo === 'FACTURA' ? 'F001-' + Date.now() : 'B001-' + Date.now();
    var payload = {
      numero: numeroSerie,
      fecha: new Date().toISOString().split('T')[0],
      cliente: form.clienteNombre,
      telefono: '',
      mascota: form.mascotaNombre || '',
      total: totalConIgv,
      estado: 'PENDIENTE',
      metodoPago: 'EFECTIVO',
      tipoComprobante: tipo,
      clienteDoc: form.clienteDoc,
      clienteDireccion: form.clienteDireccion
    };

    API.post('/api/facturas', payload).then(function (res) {
      var factura = res.data;
      var envio = {
        facturaId: factura.id,
        tipoComprobante: tipo,
        serie: tipo === 'FACTURA' ? 'F001' : 'B001',
        numero: numeroSerie,
        clienteDoc: form.clienteDoc,
        clienteTipoDoc: tipo === 'FACTURA' ? '6' : '1',
        clienteNombre: form.clienteNombre,
        clienteDireccion: form.clienteDireccion,
        moneda: 'PEN',
        items: items.map(function (it) { return {
          descripcion: it.descripcion,
          cantidad: parseInt(it.cantidad),
          precioUnitario: parseFloat(it.precioUnitario),
          precioTotal: parseFloat(it.cantidad) * parseFloat(it.precioUnitario)
        }; })
      };
      return API.post('/api/facturas/' + factura.id + '/enviar-sunat', envio);
    }).then(function () {
      navigate('/ventas/historial');
    }).catch(function (err) {
      setError('Error al emitir: ' + (err.response?.data?.error || err.message));
      setEnviando(false);
    });
  }

  return (
    <div className="flex gap-6">
      <div className="flex-1 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-[#E0E0E0]">Nueva Venta</h1>
        </div>

        {error && (
          <div className="text-red-600 bg-red-50 border border-red-200 rounded-xl px-5 py-3 text-sm">
            {error}
          </div>
        )}

        <div className="bg-white dark:bg-[#1E1E1E] rounded-xl shadow-sm border border-gray-100 dark:border-[#333] p-6 space-y-6">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-[#E0E0E0]">Tipo de Comprobante</h2>
          <div className="inline-flex rounded-lg border border-gray-200 dark:border-[#3A3A3A] p-1">
            <button onClick={function () { setTipo('BOLETA'); }}
              className={'px-4 py-2 text-sm font-medium rounded-md transition-all cursor-pointer ' + (tipo === 'BOLETA' ? 'bg-[#5F7B65] text-white shadow-sm' : 'bg-transparent text-gray-600 dark:text-gray-400')}>
              Boleta
            </button>
            <button onClick={function () { setTipo('FACTURA'); }}
              className={'px-4 py-2 text-sm font-medium rounded-md transition-all cursor-pointer ' + (tipo === 'FACTURA' ? 'bg-[#5F7B65] text-white shadow-sm' : 'bg-transparent text-gray-600 dark:text-gray-400')}>
              Factura
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1E1E1E] rounded-xl shadow-sm border border-gray-100 dark:border-[#333] p-6 space-y-6">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-[#E0E0E0]">Datos del Cliente</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-[#D0D0D0] mb-1.5">Tipo Documento</label>
              <select value={tipo === 'FACTURA' ? '6' : '1'} className={selectClass + " bg-gray-50 dark:bg-[#2C2C2C]"}>
                <option value="6">RUC</option>
                <option value="1">DNI</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-[#D0D0D0] mb-1.5">N° Documento</label>
              <input name="clienteDoc" value={form.clienteDoc} onChange={handleFormChange} maxLength={tipo === 'FACTURA' ? 11 : 8} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-[#D0D0D0] mb-1.5">Nombre / Razón Social</label>
              <input name="clienteNombre" value={form.clienteNombre} onChange={handleFormChange} className={inputClass} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-[#D0D0D0] mb-1.5">Dirección</label>
            <input name="clienteDireccion" value={form.clienteDireccion} onChange={handleFormChange} className={inputClass} />
          </div>
        </div>

        <div className="bg-white dark:bg-[#1E1E1E] rounded-xl shadow-sm border border-gray-100 dark:border-[#333] p-6 space-y-6">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-[#E0E0E0]">Mascota (opcional)</h2>
          <div className="relative" ref={mascotaRef}>
            <button type="button" onClick={function () { setMascotaOpen(!mascotaOpen); setMascotaSearch(''); }}
              className={"w-full flex items-center gap-3 px-4 py-2.5 border border-gray-300 dark:border-[#404040] rounded-lg focus:ring-2 focus:ring-[#5F7B65] focus:border-[#5F7B65] outline-none bg-white dark:bg-[#2C2C2C] text-sm text-left cursor-pointer " + (mascotaOpen ? 'ring-2 ring-[#5F7B65] border-[#5F7B65]' : '')}>
              {mascotaSel ? (
                <>
                  <div className="w-8 h-8 rounded-full bg-[#5F7B65] flex items-center justify-center text-white text-xs font-bold shrink-0">
                    {mascotaSel.nombre.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 dark:text-[#E0E0E0] text-sm truncate">{mascotaSel.nombre}</p>
                    <p className="text-xs text-gray-500 dark:text-[#909090] truncate">{mascotaSel.raza || 'Sin raza'}{mascotaSel.cliente ? ' - ' + mascotaSel.cliente : ''}</p>
                  </div>
                </>
              ) : (
                <span className="text-gray-400 dark:text-[#808080]">-- Seleccionar mascota --</span>
              )}
              <svg className={"w-4 h-4 text-gray-400 shrink-0 transition-transform " + (mascotaOpen ? 'rotate-180' : '')} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
            {mascotaOpen && (
              <div className="absolute z-50 mt-1 w-full bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-[#3A3A3A] rounded-lg shadow-lg overflow-hidden">
                <div className="p-2 border-b border-gray-100 dark:border-[#333]">
                  <input autoFocus value={mascotaSearch} onChange={function (e) { setMascotaSearch(e.target.value); }} placeholder="Buscar mascota..." className="w-full px-3 py-1.5 border border-gray-200 dark:border-[#404040] rounded-md text-sm focus:ring-2 focus:ring-[#5F7B65] outline-none bg-white dark:bg-[#2C2C2C] text-gray-900 dark:text-[#E0E0E0]" />
                </div>
                <div className="max-h-60 overflow-y-auto">
                  {mascotasFiltradas.length === 0 ? (
                    <p className="p-3 text-sm text-gray-400 dark:text-[#808080] text-center">No se encontraron mascotas</p>
                  ) : (
                    mascotasFiltradas.map(function (m) {
                      return (
                        <button key={m.id} type="button" onClick={function () { selectMascota(m); }}
                          className={"w-full flex items-center gap-3 px-3 py-2.5 text-sm text-left hover:bg-gray-50 dark:hover:bg-[#2C2C2C] transition-colors cursor-pointer " + (mascotaSel && mascotaSel.id === m.id ? 'bg-gray-50 dark:bg-[#2C2C2C]' : '')}>
                          <div className="w-8 h-8 rounded-full bg-[#5F7B65]/20 dark:bg-[#5F7B65]/30 flex items-center justify-center text-[#5F7B65] text-xs font-bold shrink-0">
                            {m.nombre.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 dark:text-[#E0E0E0] truncate">{m.nombre}</p>
                            <p className="text-xs text-gray-500 dark:text-[#909090] truncate">{m.raza || 'Sin raza'}{m.cliente ? ' - Dueño: ' + m.cliente : ''}</p>
                          </div>
                        </button>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-[#1E1E1E] rounded-xl shadow-sm border border-gray-100 dark:border-[#333] p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-[#E0E0E0]">Detalle de Venta</h2>
            <button onClick={addItem} className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 dark:border-[#404040] rounded-lg text-sm font-medium text-gray-700 dark:text-[#D0D0D0] hover:bg-gray-50 dark:hover:bg-[#2C2C2C] transition-colors cursor-pointer">
              + Agregar Item
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-[#2C2C2C] text-left">
                  <th className="px-4 py-3 font-semibold text-gray-600 dark:text-[#A0A0A0]">Descripción</th>
                  <th className="px-4 py-3 font-semibold text-gray-600 dark:text-[#A0A0A0] text-center w-20">Cant.</th>
                  <th className="px-4 py-3 font-semibold text-gray-600 dark:text-[#A0A0A0] text-right w-28">P. Unitario</th>
                  <th className="px-4 py-3 font-semibold text-gray-600 dark:text-[#A0A0A0] text-right w-28">Subtotal</th>
                  <th className="px-4 py-3 font-semibold text-gray-600 dark:text-[#A0A0A0] text-center w-16"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-[#333]">
                {items.map(function (item, i) {
                  var subtotal = parseFloat(item.cantidad || 0) * parseFloat(item.precioUnitario || 0);
                  return (
                    <tr key={i} className="hover:bg-gray-50 dark:hover:bg-[#2C2C2C] transition-colors">
                      <td className="px-4 py-3">
                        <input value={item.descripcion} onChange={function (e) { handleItemChange(i, 'descripcion', e.target.value); }} placeholder="Descripción del servicio/producto" className={inputClass} />
                      </td>
                      <td className="px-4 py-3">
                        <input type="number" min="1" value={item.cantidad} onChange={function (e) { handleItemChange(i, 'cantidad', parseInt(e.target.value) || 0); }} className={"w-16 text-center " + inputClass} />
                      </td>
                      <td className="px-4 py-3">
                        <input type="number" min="0" step="0.01" value={item.precioUnitario} onChange={function (e) { handleItemChange(i, 'precioUnitario', parseFloat(e.target.value) || 0); }} className={"w-24 text-right " + inputClass} />
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-gray-900 dark:text-[#E0E0E0]">{formatMoney(subtotal)}</td>
                      <td className="px-4 py-3 text-center">
                        <button onClick={function () { removeItem(i); }} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 hover:text-red-700 transition-colors cursor-pointer">&times;</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex gap-3 justify-end pt-2">
          <button onClick={function () { navigate('/ventas/historial'); }} className="px-5 py-2.5 rounded-xl border border-gray-300 dark:border-[#404040] text-sm font-medium text-gray-700 dark:text-[#D0D0D0] hover:bg-gray-50 dark:hover:bg-[#2C2C2C] transition-colors cursor-pointer">Cancelar</button>
          <button onClick={handleEmitir} disabled={enviando} className="px-6 py-2.5 bg-[#5F7B65] hover:bg-[#4E6553] text-white font-semibold rounded-lg transition-colors disabled:opacity-50 cursor-pointer">
            {enviando ? 'Emitiendo...' : 'Emitir Comprobante'}
          </button>
        </div>
      </div>

      <div className="w-80 shrink-0">
        <div className="bg-white dark:bg-[#1E1E1E] rounded-xl shadow-sm border border-gray-100 dark:border-[#333] p-6 sticky top-4">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-[#E0E0E0] mb-3">Vista Previa</h3>
          <div className="border-2 border-gray-200 dark:border-[#3A3A3A] rounded-lg overflow-hidden">
            <div className="bg-gray-50 dark:bg-[#2C2C2C] px-4 py-3 text-center border-b border-gray-200 dark:border-[#3A3A3A]">
              <p className="font-bold text-sm text-gray-900 dark:text-[#E0E0E0]">{empresa?.nombreComercial || empresa?.razonSocial || 'MI EMPRESA SAC'}</p>
              <p className="text-[10px] text-gray-500 dark:text-[#909090]">{empresa?.ruc || '20600085510'}</p>
            </div>
            <div className="px-4 py-2 text-center border-b border-gray-200 dark:border-[#3A3A3A] bg-[#5F7B65]/5 dark:bg-[#5F7B65]/10">
              <span className={'inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ' + (tipo === 'FACTURA' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300')}>
                {tipo === 'FACTURA' ? 'FACTURA ELECTRÓNICA' : 'BOLETA ELECTRÓNICA'}
              </span>
            </div>
            <div className="px-4 py-2 border-b border-gray-200 dark:border-[#3A3A3A] space-y-1 text-[11px]">
              <div className="flex justify-between"><span className="text-gray-500 dark:text-[#909090]">Cliente:</span><span className="font-medium text-right text-gray-900 dark:text-[#E0E0E0]">{form.clienteNombre || '—'}</span></div>
              <div className="flex justify-between"><span className="text-gray-500 dark:text-[#909090]">Doc:</span><span className="font-medium text-right text-gray-900 dark:text-[#E0E0E0]">{form.clienteDoc || '—'}</span></div>
              {form.clienteDireccion && <div className="flex justify-between"><span className="text-gray-500 dark:text-[#909090]">Dir:</span><span className="text-right text-gray-900 dark:text-[#E0E0E0]">{form.clienteDireccion}</span></div>}
              {form.mascotaNombre && <div className="flex justify-between"><span className="text-gray-500 dark:text-[#909090]">Mascota:</span><span className="text-right text-gray-900 dark:text-[#E0E0E0]">{form.mascotaNombre}</span></div>}
            </div>
            <div className="px-4 py-2 border-b border-gray-200 dark:border-[#3A3A3A]">
              <table className="w-full text-[11px]">
                <thead>
                  <tr className="text-gray-500 dark:text-[#909090] border-b border-gray-100 dark:border-[#333]">
                    <th className="text-left py-1 pr-1 font-medium">Item</th>
                    <th className="text-center py-1 px-1 font-medium">Cant</th>
                    <th className="text-right py-1 pl-1 font-medium">Importe</th>
                  </tr>
                </thead>
                <tbody>
                  {items.filter(function (it) { return it.descripcion; }).map(function (it, i) {
                    var sub = parseFloat(it.cantidad || 0) * parseFloat(it.precioUnitario || 0);
                    return (
                      <tr key={i} className="border-b border-gray-50 dark:border-[#2A2A2A]">
                        <td className="py-1 pr-1 truncate max-w-[120px] text-gray-900 dark:text-[#E0E0E0]">{it.descripcion}</td>
                        <td className="py-1 px-1 text-center text-gray-700 dark:text-[#D0D0D0]">{it.cantidad}</td>
                        <td className="py-1 pl-1 text-right font-medium text-gray-900 dark:text-[#E0E0E0]">{formatMoney(sub)}</td>
                      </tr>
                    );
                  })}
                  {items.filter(function (it) { return it.descripcion; }).length === 0 && (
                    <tr><td colSpan="3" className="py-2 text-center text-gray-400 dark:text-[#808080]">Sin items</td></tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="px-4 py-2 space-y-1 text-[11px]">
              <div className="flex justify-between text-gray-600 dark:text-[#A0A0A0]"><span>Subtotal</span><span>{formatMoney(total)}</span></div>
              <div className="flex justify-between text-gray-600 dark:text-[#A0A0A0]"><span>IGV (18%)</span><span>{formatMoney(igv)}</span></div>
              <div className="flex justify-between text-sm font-bold border-t border-gray-200 dark:border-[#3A3A3A] pt-1 text-gray-900 dark:text-[#E0E0E0]"><span>TOTAL</span><span>{formatMoney(totalConIgv)}</span></div>
            </div>
            <div className="bg-gray-50 dark:bg-[#2C2C2C] px-4 py-2 text-center border-t border-gray-200 dark:border-[#3A3A3A]">
              <p className="text-[8px] text-gray-400 dark:text-[#808080]">Representación impresa de la {tipo === 'FACTURA' ? 'Factura' : 'Boleta'} Electrónica</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
