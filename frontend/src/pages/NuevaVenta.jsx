import { useState, useEffect } from 'react';
import axios from 'axios';
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

  useEffect(function () {
    axios.get('/api/empresa').then(function (r) { setEmpresa(r.data); }).catch(function () {});
    axios.get('/api/mascotas').then(function (r) { setMascotas(r.data || []); }).catch(function () {});
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

    axios.post('/api/facturas', payload).then(function (res) {
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
      return axios.post('/api/facturas/' + factura.id + '/enviar-sunat', envio);
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
              className={'px-5 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer ' + (tipo === 'BOLETA' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200')}>
              Boleta
            </button>
            <button onClick={function () { setTipo('FACTURA'); }}
              className={'px-5 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer ' + (tipo === 'FACTURA' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200')}>
              Factura
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 space-y-4">
          <h2 className="text-lg font-semibold text-gray-800">Datos del Cliente</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Tipo Documento</label>
              <select name="clienteTipoDoc" value={tipo === 'FACTURA' ? '6' : '1'} className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 text-sm bg-gray-50" disabled>
                <option value="6">RUC</option>
                <option value="1">DNI</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">N° Documento</label>
              <input name="clienteDoc" value={form.clienteDoc} onChange={handleFormChange} maxLength={tipo === 'FACTURA' ? 11 : 8} className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Nombre / Razón Social</label>
              <input name="clienteNombre" value={form.clienteNombre} onChange={handleFormChange} className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 text-sm" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Dirección</label>
            <input name="clienteDireccion" value={form.clienteDireccion} onChange={handleFormChange} className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 text-sm" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 space-y-4">
          <h2 className="text-lg font-semibold text-gray-800">Mascota (opcional)</h2>
          <select onChange={handleMascotaSelect} value={form.mascotaId} className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 text-sm">
            <option value="">-- Seleccionar mascota --</option>
            {mascotas.map(function (m) {
              return <option key={m.id} value={m.id}>{m.nombre}{m.raza ? ' (' + m.raza + ')' : ''} - {m.cliente || ''}</option>;
            })}
          </select>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">Detalle de Venta</h2>
            <button onClick={addItem} className="text-sm px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-colors cursor-pointer font-medium">+ Agregar Item</button>
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
          <button onClick={handleEmitir} disabled={enviando} className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium transition-colors disabled:opacity-50 cursor-pointer">
            {enviando ? 'Emitiendo...' : 'Emitir Comprobante'}
          </button>
        </div>
      </div>

      <div className="w-80 shrink-0">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 sticky top-4">
          <h3 className="text-sm font-semibold text-gray-800 mb-3">Vista Previa</h3>
          {empresa && (
            <div className="border border-gray-200 rounded-lg p-4 text-xs space-y-2">
              <div className="text-center border-b border-gray-100 pb-2">
                <p className="font-bold text-sm">{empresa.nombreComercial || empresa.razonSocial}</p>
                <p className="text-gray-500">{empresa.ruc}</p>
              </div>
              <div className="text-center">
                <span className={'inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ' + (tipo === 'FACTURA' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700')}>
                  {tipo === 'FACTURA' ? 'FACTURA ELECTRÓNICA' : 'BOLETA ELECTRÓNICA'}
                </span>
              </div>
              <div className="border-t border-gray-100 pt-2 space-y-1">
                <p><span className="text-gray-500">Cliente:</span> {form.clienteNombre || '—'}</p>
                <p><span className="text-gray-500">Doc:</span> {form.clienteDoc || '—'}</p>
                {form.mascotaNombre && <p><span className="text-gray-500">Mascota:</span> {form.mascotaNombre}</p>}
              </div>
              <div className="border-t border-gray-100 pt-2 space-y-1">
                {items.filter(function (it) { return it.descripcion; }).map(function (it, i) {
                  var sub = parseFloat(it.cantidad || 0) * parseFloat(it.precioUnitario || 0);
                  return (
                    <div key={i} className="flex justify-between">
                      <span className="truncate mr-2">{it.cantidad}x {it.descripcion}</span>
                      <span className="font-medium shrink-0">S/ {sub.toFixed(2)}</span>
                    </div>
                  );
                })}
              </div>
              <div className="border-t border-gray-100 pt-2 space-y-1 font-medium">
                <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>S/ {total.toFixed(2)}</span></div>
                <div className="flex justify-between text-gray-600"><span>IGV (18%)</span><span>S/ {igv.toFixed(2)}</span></div>
                <div className="flex justify-between text-sm font-bold border-t border-gray-200 pt-1"><span>TOTAL</span><span>S/ {totalConIgv.toFixed(2)}</span></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
