import { useState, useEffect } from 'react';
import API from '../services/axiosConfig';
import { useNavigate } from 'react-router-dom';

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

  useEffect(function () {
    API.get('/api/empresa').then(function (r) { setEmpresa(r.data); }).catch(function () {});
    API.get('/api/mascotas').then(function (r) { setMascotas(r.data || []); }).catch(function () {});
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

  function handleMascotaSelect(e) {
    var id = e.target.value;
    var m = mascotas.find(function (x) { return x.id === parseInt(id); });
    setMascotaSel(m || null);
    setForm(function (f) { return { ...f, mascotaId: id, mascotaNombre: m ? m.nombre + (m.raza ? ' (' + m.raza + ')' : '') : '' }; });
  }

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
        <h1 className="text-2xl font-bold text-gray-800">Nueva Venta</h1>
        {error && <div className="p-3 rounded-lg bg-red-50 text-red-700 text-sm">{error}</div>}

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Comprobante</label>
          <div className="flex gap-3">
            <button onClick={function () { setTipo('BOLETA'); }}
              className={'px-5 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer ' + (tipo === 'BOLETA' ? 'bg-[#5F7B65] text-white shadow-sm' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50')}>
              Boleta
            </button>
            <button onClick={function () { setTipo('FACTURA'); }}
              className={'px-5 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer ' + (tipo === 'FACTURA' ? 'bg-[#5F7B65] text-white shadow-sm' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50')}>
              Factura
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 space-y-4">
          <h2 className="text-lg font-semibold text-gray-800">Datos del Cliente</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Tipo Documento</label>
              <select name="clienteTipoDoc" value={tipo === 'FACTURA' ? '6' : '1'} className="w-full rounded-lg border-gray-300 shadow-sm focus:border-[#5F7B65] text-sm bg-gray-50" disabled>
                <option value="6">RUC</option>
                <option value="1">DNI</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">N° Documento</label>
              <input name="clienteDoc" value={form.clienteDoc} onChange={handleFormChange} maxLength={tipo === 'FACTURA' ? 11 : 8} className="w-full rounded-lg border-gray-300 shadow-sm focus:border-[#5F7B65] text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Nombre / Razón Social</label>
              <input name="clienteNombre" value={form.clienteNombre} onChange={handleFormChange} className="w-full rounded-lg border-gray-300 shadow-sm focus:border-[#5F7B65] text-sm" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Dirección</label>
            <input name="clienteDireccion" value={form.clienteDireccion} onChange={handleFormChange} className="w-full rounded-lg border-gray-300 shadow-sm focus:border-[#5F7B65] text-sm" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 space-y-4">
          <h2 className="text-lg font-semibold text-gray-800">Mascota (opcional)</h2>
          <select onChange={handleMascotaSelect} value={form.mascotaId} className="w-full rounded-lg border-gray-300 shadow-sm focus:border-[#5F7B65] text-sm">
            <option value="">-- Seleccionar mascota --</option>
            {mascotas.map(function (m) {
              return <option key={m.id} value={m.id}>{m.nombre}{m.raza ? ' (' + m.raza + ')' : ''} - {m.cliente || ''}</option>;
            })}
          </select>
          {mascotaSel ? (
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div className="w-12 h-12 rounded-full bg-[#5F7B65]/10 flex items-center justify-center text-[#5F7B65] shrink-0">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" /></svg>
              </div>
              <div>
                <p className="font-medium text-gray-800 text-sm">{mascotaSel.nombre}</p>
                <p className="text-xs text-gray-500">{mascotaSel.raza || 'Sin raza'}{mascotaSel.cliente ? ' - Dueño: ' + mascotaSel.cliente : ''}</p>
              </div>
            </div>
          ) : form.mascotaId && !mascotaSel ? null : (
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-dashed border-gray-300">
              <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 shrink-0">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" /></svg>
              </div>
              <p className="text-sm text-gray-400">Sin mascota seleccionada</p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">Detalle de Venta</h2>
            <button onClick={addItem} className="text-sm px-3 py-1.5 bg-[#5F7B65]/10 text-[#5F7B65] rounded-lg hover:bg-[#5F7B65]/20 transition-colors cursor-pointer font-medium">+ Agregar Item</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-gray-500 text-xs uppercase">
                  <th className="text-left py-2 pr-2">Descripción</th>
                  <th className="text-center py-2 px-2 w-20">Cant.</th>
                  <th className="text-right py-2 px-2 w-28">P. Unitario</th>
                  <th className="text-right py-2 px-2 w-28">Subtotal</th>
                  <th className="text-center py-2 pl-2 w-16"></th>
                </tr>
              </thead>
              <tbody>
                {items.map(function (item, i) {
                  var subtotal = parseFloat(item.cantidad || 0) * parseFloat(item.precioUnitario || 0);
                  return (
                    <tr key={i} className="border-b border-gray-100">
                      <td className="py-1.5 pr-2">
                        <input value={item.descripcion} onChange={function (e) { handleItemChange(i, 'descripcion', e.target.value); }} placeholder="Descripción del servicio/producto" className="w-full rounded border-gray-200 text-sm py-1.5" />
                      </td>
                      <td className="py-1.5 px-2">
                        <input type="number" min="1" value={item.cantidad} onChange={function (e) { handleItemChange(i, 'cantidad', parseInt(e.target.value) || 0); }} className="w-16 text-center rounded border-gray-200 text-sm py-1.5" />
                      </td>
                      <td className="py-1.5 px-2">
                        <input type="number" min="0" step="0.01" value={item.precioUnitario} onChange={function (e) { handleItemChange(i, 'precioUnitario', parseFloat(e.target.value) || 0); }} className="w-24 text-right rounded border-gray-200 text-sm py-1.5" />
                      </td>
                      <td className="py-1.5 px-2 text-right font-medium">S/ {subtotal.toFixed(2)}</td>
                      <td className="py-1.5 pl-2 text-center">
                        <button onClick={function () { removeItem(i); }} className="text-red-400 hover:text-red-600 transition-colors cursor-pointer text-lg leading-none">&times;</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex gap-3 justify-end pt-2">
          <button onClick={function () { navigate('/ventas/historial'); }} className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors cursor-pointer">Cancelar</button>
          <button onClick={handleEmitir} disabled={enviando} className="px-6 py-2.5 bg-[#5F7B65] text-white rounded-lg hover:bg-[#4a634f] text-sm font-medium transition-colors disabled:opacity-50 cursor-pointer">
            {enviando ? 'Emitiendo...' : 'Emitir Comprobante'}
          </button>
        </div>
      </div>

      <div className="w-80 shrink-0">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 sticky top-4">
          <h3 className="text-sm font-semibold text-gray-800 mb-3">Vista Previa</h3>
          <div className="border-2 border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-4 py-3 text-center border-b border-gray-200">
              <p className="font-bold text-sm text-gray-800">{empresa?.nombreComercial || empresa?.razonSocial || 'MI EMPRESA SAC'}</p>
              <p className="text-[10px] text-gray-500">{empresa?.ruc || '20600085510'}</p>
            </div>
            <div className="px-4 py-2 text-center border-b border-gray-200 bg-[#5F7B65]/5">
              <span className={'inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ' + (tipo === 'FACTURA' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700')}>
                {tipo === 'FACTURA' ? 'FACTURA ELECTRÓNICA' : 'BOLETA ELECTRÓNICA'}
              </span>
            </div>
            <div className="px-4 py-2 border-b border-gray-200 space-y-1 text-[11px]">
              <div className="flex justify-between"><span className="text-gray-500">Cliente:</span><span className="font-medium text-right">{form.clienteNombre || '—'}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Doc:</span><span className="font-medium text-right">{form.clienteDoc || '—'}</span></div>
              {form.clienteDireccion && <div className="flex justify-between"><span className="text-gray-500">Dir:</span><span className="text-right">{form.clienteDireccion}</span></div>}
              {form.mascotaNombre && <div className="flex justify-between"><span className="text-gray-500">Mascota:</span><span className="text-right">{form.mascotaNombre}</span></div>}
            </div>
            <div className="px-4 py-2 border-b border-gray-200">
              <table className="w-full text-[11px]">
                <thead>
                  <tr className="text-gray-500 border-b border-gray-100">
                    <th className="text-left py-1 pr-1">Item</th>
                    <th className="text-center py-1 px-1">Cant</th>
                    <th className="text-right py-1 pl-1">Importe</th>
                  </tr>
                </thead>
                <tbody>
                  {items.filter(function (it) { return it.descripcion; }).map(function (it, i) {
                    var sub = parseFloat(it.cantidad || 0) * parseFloat(it.precioUnitario || 0);
                    return (
                      <tr key={i} className="border-b border-gray-50">
                        <td className="py-1 pr-1 truncate max-w-[120px]">{it.descripcion}</td>
                        <td className="py-1 px-1 text-center">{it.cantidad}</td>
                        <td className="py-1 pl-1 text-right font-medium">S/ {sub.toFixed(2)}</td>
                      </tr>
                    );
                  })}
                  {items.filter(function (it) { return it.descripcion; }).length === 0 && (
                    <tr><td colSpan="3" className="py-2 text-center text-gray-400">Sin items</td></tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="px-4 py-2 space-y-1 text-[11px]">
              <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>S/ {total.toFixed(2)}</span></div>
              <div className="flex justify-between text-gray-600"><span>IGV (18%)</span><span>S/ {igv.toFixed(2)}</span></div>
              <div className="flex justify-between text-sm font-bold border-t border-gray-200 pt-1 text-gray-800"><span>TOTAL</span><span>S/ {totalConIgv.toFixed(2)}</span></div>
            </div>
            <div className="bg-gray-50 px-4 py-2 text-center border-t border-gray-200">
              <p className="text-[8px] text-gray-400">Representación impresa de la {tipo === 'FACTURA' ? 'Factura' : 'Boleta'} Electrónica</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
