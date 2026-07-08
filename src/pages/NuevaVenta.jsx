import { useState, useEffect, useRef } from 'react';
import API from '../services/axiosConfig';
import { useNavigate } from 'react-router-dom';
import NuevoClienteModal from '../components/NuevoClienteModal';

var inputClass = "w-full px-4 py-2.5 border border-gray-300 dark:border-[#404040] rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-white dark:bg-[#2C2C2C] text-gray-900 dark:text-[#E0E0E0] text-sm";
var selectClass = "w-full px-4 py-2.5 border border-gray-300 dark:border-[#404040] rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-white dark:bg-[#2C2C2C] text-gray-900 dark:text-[#E0E0E0] text-sm cursor-pointer";

function formatMoney(val) {
  return 'S/ ' + (val || 0).toFixed(2);
}

function formatDate(d) {
  var dd = String(d.getDate()).padStart(2, '0');
  var mm = String(d.getMonth() + 1).padStart(2, '0');
  var yyyy = d.getFullYear();
  return dd + '/' + mm + '/' + yyyy;
}

function generarNumero(tipo) {
  var serie = tipo === 'FACTURA' ? 'F001' : 'B001';
  var correlativo = String(Date.now()).slice(-6);
  return serie + '-' + correlativo;
}

export default function NuevaVenta() {
  var navigate = useNavigate();
  var [tipo, setTipo] = useState('BOLETA');
  var [form, setForm] = useState({ clienteDoc: '', clienteNombre: '', clienteDireccion: '', mascotaId: '', mascotaNombre: '' });
  var [items, setItems] = useState([{ tipo: 'servicio', descripcion: '', cantidad: 1, precioUnitario: 0, descuento: 0 }]);
  var [descuentoGlobal, setDescuentoGlobal] = useState(0);
  var [empresa, setEmpresa] = useState(null);
  var [enviando, setEnviando] = useState(false);
  var [error, setError] = useState('');
  var [mascotaSel, setMascotaSel] = useState(null);
  var [mascotaOpen, setMascotaOpen] = useState(false);
  var [mascotaSearch, setMascotaSearch] = useState('');
  var [mascotaResults, setMascotaResults] = useState([]);
  var [mascotaLoading, setMascotaLoading] = useState(false);
  var [clienteModal, setClienteModal] = useState(false);
  var [clientes, setClientes] = useState([]);
  var [numeroComprobante, setNumeroComprobante] = useState(generarNumero('BOLETA'));
  var previewRef = useRef(null);
  var searchTimer = useRef(null);

  useEffect(function () {
    API.get('/api/empresa').then(function (r) { setEmpresa(r.data); }).catch(function () {});
    API.get('/api/clientes').then(function (r) { setClientes(r.data || []); }).catch(function () {});
  }, []);

  useEffect(function () {
    setNumeroComprobante(generarNumero(tipo));
  }, [tipo]);

  function handleFormChange(e) {
    setForm(function (f) { return { ...f, [e.target.name]: e.target.value }; });
  }

  function handleItemChange(i, field, value) {
    setItems(function (prev) {
      return prev.map(function (item, idx) {
        if (idx !== i) return item;
        return { ...item, [field]: value };
      });
    });
  }

  function addItem(t) {
    setItems(function (prev) { return [...prev, { tipo: t, descripcion: '', cantidad: 1, precioUnitario: 0, descuento: 0 }]; });
  }

  function removeItem(i) {
    if (items.length <= 1) return;
    setItems(function (prev) { return prev.filter(function (_, idx) { return idx !== i; }); });
  }

  function getClienteIdFromForm() {
    if (!form.clienteDoc) return null;
    var found = clientes.find(function (c) { return c.dni === form.clienteDoc; });
    return found ? found.id : null;
  }

  function cargarMascotas(clienteId, query) {
    setMascotaLoading(true);
    var params = [];
    if (clienteId) params.push('clienteId=' + clienteId);
    if (query) params.push('nombre=' + encodeURIComponent(query));
    var url = '/api/mascotas/search' + (params.length ? '?' + params.join('&') : '');
    API.get(url).then(function (r) {
      setMascotaResults(r.data || []);
    }).catch(function () {
      setMascotaResults([]);
    }).finally(function () {
      setMascotaLoading(false);
    });
  }

  function openMascotaModal() {
    setMascotaOpen(true);
    setMascotaSearch('');
    var clienteId = getClienteIdFromForm();
    cargarMascotas(clienteId, '');
  }

  function handleMascotaSearchChange(e) {
    var q = e.target.value;
    setMascotaSearch(q);
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(function () {
      var clienteId = getClienteIdFromForm();
      cargarMascotas(clienteId, q);
    }, 300);
  }

  function selectMascota(m) {
    setMascotaSel(m);
    setMascotaOpen(false);
    setMascotaSearch('');
    setForm(function (f) { return { ...f, mascotaId: m ? String(m.id) : '', mascotaNombre: m ? m.nombre + (m.raza ? ' (' + m.raza + ')' : '') : '' }; });
  }

  function handleNuevoClienteCreado(cliente) {
    setClienteModal(false);
    if (cliente) {
      setForm(function (f) { return { ...f, clienteDoc: cliente.dni || '', clienteNombre: cliente.nombre || '', clienteDireccion: cliente.direccion || '' }; });
      setClientes(function (prev) {
        var exists = prev.some(function (c) { return c.id === cliente.id; });
        return exists ? prev : [cliente, ...prev];
      });
    }
  }

  var subtotal = items.reduce(function (sum, item) {
    return sum + (parseFloat(item.cantidad || 0) * parseFloat(item.precioUnitario || 0));
  }, 0);
  var descTotal = items.reduce(function (sum, item) {
    return sum + (parseFloat(item.descuento || 0) * parseFloat(item.cantidad || 0));
  }, 0) + parseFloat(descuentoGlobal || 0);
  var baseImponible = Math.max(0, subtotal - descTotal);
  var igv = baseImponible * 0.18;
  var total = baseImponible + igv;

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

    var numeroSerie = numeroComprobante;
    var payload = {
      numero: numeroSerie,
      fecha: new Date().toISOString().split('T')[0],
      cliente: form.clienteNombre,
      telefono: '',
      mascota: form.mascotaNombre || '',
      total: total,
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
          descuento: parseFloat(it.descuento || 0),
          precioTotal: (parseFloat(it.cantidad) * parseFloat(it.precioUnitario)) - (parseFloat(it.descuento || 0) * parseFloat(it.cantidad))
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

  function handlePrint() {
    var pw = window.open('', '', 'width=600,height=800');
    if (!pw) { alert('Permite ventanas emergentes para imprimir.'); return; }
    var previewEl = previewRef.current;
    if (!previewEl) return;
    var content = previewEl.innerHTML;
    var title = (tipo === 'FACTURA' ? 'FACTURA ELECTRÓNICA' : 'BOLETA ELECTRÓNICA');
    pw.document.write('<!DOCTYPE html><html><head><meta charset="UTF-8"><title>' + title + '</title>');
    pw.document.write('<script src="https://cdn.tailwindcss.com"></script>');
    pw.document.write('<style>@page { margin: 10mm; } body { padding: 0; margin: 0; font-family: Arial, sans-serif; } .only-print { max-width: 340px; margin: 0 auto; }</style>');
    pw.document.write('</head><body><div class="only-print">' + content + '</div></body></html>');
    pw.document.close();
    pw.focus();
    setTimeout(function () { pw.print(); }, 600);
  }

  return (
    <div className="flex gap-6">
      <div className="w-[70%] space-y-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-[#E0E0E0]">Nueva Venta</h1>

        {error && (
          <div className="text-red-600 bg-red-50 border border-red-200 rounded-xl px-5 py-3 text-sm">
            {error}
          </div>
        )}

        <div className="bg-white dark:bg-[#1E1E1E] rounded-xl shadow-sm border border-gray-100 dark:border-[#333] p-6">
          <div className="inline-flex rounded-lg border border-gray-200 dark:border-[#3A3A3A] p-1">
            <button onClick={function () { setTipo('BOLETA'); }}
              className={'px-6 py-2.5 text-sm font-medium rounded-md transition-all cursor-pointer ' + (tipo === 'BOLETA' ? 'bg-emerald-600 text-white shadow-sm' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50')}>
              Boleta
            </button>
            <button onClick={function () { setTipo('FACTURA'); }}
              className={'px-6 py-2.5 text-sm font-medium rounded-md transition-all cursor-pointer ' + (tipo === 'FACTURA' ? 'bg-emerald-600 text-white shadow-sm' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50')}>
              Factura
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1E1E1E] rounded-xl shadow-sm border border-gray-100 dark:border-[#333] p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-[#E0E0E0]">Cliente</h2>
            <button onClick={function () { setClienteModal(true); }} className="text-sm text-blue-600 hover:text-blue-700 font-medium cursor-pointer">+ Nuevo Cliente</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-[#D0D0D0] mb-1.5">Tipo de documento</label>
              <select value={tipo === 'FACTURA' ? '6' : '1'} className={selectClass + " bg-gray-50 dark:bg-[#2C2C2C]"}>
                <option value="6">RUC</option>
                <option value="1">DNI</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-[#D0D0D0] mb-1.5">Número de documento</label>
              <input name="clienteDoc" value={form.clienteDoc} onChange={handleFormChange} maxLength={tipo === 'FACTURA' ? 11 : 8} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-[#D0D0D0] mb-1.5">Razón Social</label>
              <input name="clienteNombre" value={form.clienteNombre} onChange={handleFormChange} className={inputClass} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-[#D0D0D0] mb-1.5">Dirección</label>
            <input name="clienteDireccion" value={form.clienteDireccion} onChange={handleFormChange} className={inputClass} />
          </div>
        </div>

        <div className="bg-white dark:bg-[#1E1E1E] rounded-xl shadow-sm border border-gray-100 dark:border-[#333] p-6">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-[#E0E0E0] mb-4">Mascota</h2>
          <div>
            {mascotaSel ? (
              <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-[#3A3A3A] rounded-lg">
                <div className="flex items-center gap-3">
                  {mascotaSel.fotoUrl ? (
                    <img src={mascotaSel.fotoUrl} alt="" className="w-12 h-12 rounded-full object-cover shrink-0" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-[#3A3A3A] flex items-center justify-center text-gray-500 dark:text-[#A0A0A0] text-lg font-bold shrink-0">
                      {mascotaSel.nombre.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-[#E0E0E0]">{mascotaSel.nombre}</p>
                    <p className="text-sm text-gray-500 dark:text-[#909090]">
                      {mascotaSel.especie || ''}{mascotaSel.especie && mascotaSel.raza ? ' - ' : ''}{mascotaSel.raza || ''}
                      {mascotaSel.cliente?.nombre ? ' | Dueño: ' + mascotaSel.cliente.nombre : ''}
                    </p>
                  </div>
                </div>
                <button type="button" onClick={openMascotaModal} className="px-4 py-2 border border-gray-300 dark:border-[#404040] rounded-lg text-sm text-gray-700 dark:text-[#D0D0D0] hover:bg-gray-50 dark:hover:bg-[#2C2C2C] transition-colors cursor-pointer">Cambiar Mascota</button>
              </div>
            ) : (
              <button type="button" onClick={openMascotaModal} className="w-full p-4 border border-gray-200 dark:border-[#3A3A3A] rounded-lg text-center text-gray-400 dark:text-[#808080] text-sm bg-white dark:bg-[#1E1E1E] hover:bg-gray-50 dark:hover:bg-[#2C2C2C] transition-colors cursor-pointer">
                Selecciona una mascota
              </button>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-[#1E1E1E] rounded-xl shadow-sm border border-gray-100 dark:border-[#333] p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-[#E0E0E0]">Detalle de la Venta</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-[#2C2C2C] text-left">
                  <th className="px-3 py-2.5 font-semibold text-gray-600 dark:text-[#A0A0A0] w-24">Tipo</th>
                  <th className="px-3 py-2.5 font-semibold text-gray-600 dark:text-[#A0A0A0]">Descripción</th>
                  <th className="px-3 py-2.5 font-semibold text-gray-600 dark:text-[#A0A0A0] text-center w-16">Cant.</th>
                  <th className="px-3 py-2.5 font-semibold text-gray-600 dark:text-[#A0A0A0] text-right w-28">Precio Unit.</th>
                  <th className="px-3 py-2.5 font-semibold text-gray-600 dark:text-[#A0A0A0] text-right w-24">Descuento</th>
                  <th className="px-3 py-2.5 font-semibold text-gray-600 dark:text-[#A0A0A0] text-right w-24">Total</th>
                  <th className="px-3 py-2.5 font-semibold text-gray-600 dark:text-[#A0A0A0] text-center w-12"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-[#333]">
                {items.map(function (item, i) {
                  var itemTotal = (parseFloat(item.cantidad || 0) * parseFloat(item.precioUnitario || 0)) - (parseFloat(item.descuento || 0) * parseFloat(item.cantidad || 0));
                  return (
                    <tr key={i} className="hover:bg-gray-50 dark:hover:bg-[#2C2C2C] transition-colors">
                      <td className="px-3 py-2">
                        <span className={"inline-block text-xs font-semibold px-2.5 py-1 rounded-full " + (item.tipo === 'servicio' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300')}>
                          {item.tipo === 'servicio' ? 'Servicio' : 'Producto'}
                        </span>
                      </td>
                      <td className="px-3 py-2">
                        <input value={item.descripcion} onChange={function (e) { handleItemChange(i, 'descripcion', e.target.value); }} placeholder="Descripción" className={inputClass} />
                      </td>
                      <td className="px-3 py-2">
                        <input type="number" min="1" value={item.cantidad} onChange={function (e) { handleItemChange(i, 'cantidad', parseInt(e.target.value) || 0); }} className={"w-14 text-center " + inputClass} />
                      </td>
                      <td className="px-3 py-2">
                        <input type="number" min="0" step="0.01" value={item.precioUnitario} onChange={function (e) { handleItemChange(i, 'precioUnitario', parseFloat(e.target.value) || 0); }} className={"w-24 text-right " + inputClass} />
                      </td>
                      <td className="px-3 py-2">
                        <input type="number" min="0" step="0.01" value={item.descuento} onChange={function (e) { handleItemChange(i, 'descuento', parseFloat(e.target.value) || 0); }} className={"w-20 text-right " + inputClass} />
                      </td>
                      <td className="px-3 py-2 text-right font-medium text-gray-900 dark:text-[#E0E0E0]">{formatMoney(itemTotal)}</td>
                      <td className="px-3 py-2 text-center">
                        <button onClick={function () { removeItem(i); }} className="p-1 rounded-lg hover:bg-red-50 text-red-500 hover:text-red-700 transition-colors cursor-pointer">&times;</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={function () { addItem('servicio'); }} className="flex items-center gap-1.5 px-4 py-2 border border-emerald-600 dark:border-emerald-400 text-emerald-600 dark:text-emerald-400 rounded-lg text-sm font-medium hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors cursor-pointer">
              + Agregar Servicio
            </button>
            <button onClick={function () { addItem('producto'); }} className="flex items-center gap-1.5 px-4 py-2 border border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 rounded-lg text-sm font-medium hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors cursor-pointer">
              + Agregar Producto
            </button>
          </div>
          <div className="border-t border-gray-100 dark:border-[#333] pt-4 space-y-2">
            <div className="flex justify-end items-center gap-4 text-sm">
              <span className="text-gray-500 dark:text-[#909090]">Subtotal:</span>
              <span className="w-28 text-right font-medium text-gray-900 dark:text-[#E0E0E0]">{formatMoney(subtotal)}</span>
            </div>
            <div className="flex justify-end items-center gap-4 text-sm">
              <span className="text-gray-500 dark:text-[#909090]">Descuento Global:</span>
              <div className="flex items-center">
                <input type="number" min="0" step="0.01" value={descuentoGlobal} onChange={function (e) { setDescuentoGlobal(parseFloat(e.target.value) || 0); }} className="w-20 text-right px-2 py-1 border border-gray-300 dark:border-[#404040] rounded text-sm focus:ring-2 focus:ring-emerald-500 outline-none bg-white dark:bg-[#2C2C2C] text-gray-900 dark:text-[#E0E0E0]" />
              </div>
            </div>
            <div className="flex justify-end items-center gap-4 text-sm">
              <span className="text-gray-500 dark:[#909090]">IGV (18%):</span>
              <span className="w-28 text-right font-medium text-gray-900 dark:text-[#E0E0E0]">{formatMoney(igv)}</span>
            </div>
            <div className="flex justify-end items-center gap-4 text-lg">
              <span className="text-gray-600 dark:text-[#A0A0A0] font-semibold">Total:</span>
              <span className="w-28 text-right font-bold text-emerald-600 dark:text-emerald-400">{formatMoney(total)}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-3 justify-end pt-2">
          <button onClick={function () { navigate('/ventas/historial'); }} className="px-6 py-2.5 rounded-xl border border-gray-300 dark:border-[#404040] text-sm font-medium text-gray-700 dark:text-[#D0D0D0] hover:bg-gray-50 dark:hover:bg-[#2C2C2C] transition-colors cursor-pointer">Cancelar</button>
          <button onClick={handleEmitir} disabled={enviando} className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 cursor-pointer">
            {enviando ? 'Emitiendo...' : 'Emitir ' + (tipo === 'FACTURA' ? 'Factura' : 'Boleta')}
          </button>
          <button onClick={handlePrint} className="px-6 py-2.5 border border-gray-300 dark:border-[#404040] rounded-lg text-sm font-medium text-gray-700 dark:text-[#D0D0D0] hover:bg-gray-50 dark:hover:bg-[#2C2C2C] transition-colors cursor-pointer flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0 1 10.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0 .229 2.523a1.125 1.125 0 0 1-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0 0 21 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 0 0-1.913-.247M6.34 18H5.25A2.25 2.25 0 0 1 3 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 0 1 1.913-.247m10.5 0a48.536 48.536 0 0 0-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5Zm-3 0h.008v.008H15V10.5Z" /></svg>
            Imprimir Comprobante
          </button>
        </div>
      </div>

      <div className="w-[30%] shrink-0">
        <div className="bg-white dark:bg-[#1E1E1E] rounded-xl shadow-sm border border-gray-100 dark:border-[#333] p-6 sticky top-4">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-[#E0E0E0] mb-4">Vista Previa</h3>
          <div ref={previewRef} className="border border-gray-200 dark:border-[#3A3A3A] rounded-lg overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-200 dark:border-[#3A3A3A]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img src={empresa?.logoUrl || '/logo-veterinaria.png'} alt="Logo" className="w-8 h-8 rounded object-contain" onError={function (e) { e.target.style.display = 'none'; }} />
                  <p className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">{empresa?.nombreComercial || empresa?.razonSocial || 'VetControl 360'}</p>
                </div>
                <p className="text-[10px] text-gray-500 dark:text-[#909090] text-right">RUC: {empresa?.ruc || '20600085510'}</p>
              </div>
            </div>
            <div className="px-4 py-2 border-b border-gray-200 dark:border-[#3A3A3A] space-y-1 text-[10px]">
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-[#909090]">N° {tipo === 'FACTURA' ? 'Factura' : 'Boleta'}:</span>
                <span className="font-medium text-gray-900 dark:text-[#E0E0E0]">{numeroComprobante}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-[#909090]">Fecha:</span>
                <span className="font-medium text-gray-900 dark:text-[#E0E0E0]">{formatDate(new Date())}</span>
              </div>
              {empresa?.direccion && (
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-[#909090]">Dirección:</span>
                  <span className="text-right text-gray-900 dark:text-[#E0E0E0] max-w-[140px] truncate">{empresa.direccion}</span>
                </div>
              )}
            </div>
            <div className="px-4 py-3 text-center border-b border-gray-200 dark:border-[#3A3A3A] bg-emerald-50/50 dark:bg-emerald-900/10">
              <p className="font-bold text-emerald-700 dark:text-emerald-300 text-xs uppercase tracking-wider">
                {tipo === 'FACTURA' ? 'FACTURA ELECTRÓNICA' : 'BOLETA ELECTRÓNICA'}
              </p>
            </div>
            <div className="px-4 py-3 border-b border-gray-200 dark:border-[#3A3A3A] space-y-1.5 text-[11px]">
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-[#909090]">Cliente:</span>
                <span className="font-medium text-right text-gray-900 dark:text-[#E0E0E0]">{form.clienteNombre || '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-[#909090]">Documento:</span>
                <span className="font-medium text-right text-gray-900 dark:text-[#E0E0E0]">{form.clienteDoc || '—'}</span>
              </div>
              {form.clienteDireccion && (
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-[#909090]">Dirección:</span>
                  <span className="text-right text-gray-900 dark:text-[#E0E0E0] max-w-[140px] truncate">{form.clienteDireccion}</span>
                </div>
              )}
              {(form.mascotaNombre || mascotaSel) && (
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-[#909090]">Mascota:</span>
                  <span className="text-right text-gray-900 dark:text-[#E0E0E0]">{mascotaSel?.nombre || form.mascotaNombre}</span>
                </div>
              )}
            </div>
            <div className="px-4 py-3 border-b border-gray-200 dark:border-[#3A3A3A]">
              <table className="w-full text-[10px]">
                <thead>
                  <tr className="text-gray-500 dark:text-[#909090] border-b border-gray-100 dark:border-[#333]">
                    <th className="text-left py-1 pr-1 font-semibold">Cant</th>
                    <th className="text-left py-1 px-1 font-semibold">Descripción</th>
                    <th className="text-right py-1 pl-1 font-semibold">Importe</th>
                  </tr>
                </thead>
                <tbody>
                  {items.filter(function (it) { return it.descripcion; }).map(function (it, i) {
                    var imp = (parseFloat(it.cantidad || 0) * parseFloat(it.precioUnitario || 0)) - (parseFloat(it.descuento || 0) * parseFloat(it.cantidad || 0));
                    return (
                      <tr key={i} className="border-b border-gray-50 dark:border-[#2A2A2A]">
                        <td className="py-1 pr-1 text-gray-700 dark:text-[#D0D0D0]">{it.cantidad}</td>
                        <td className="py-1 px-1 text-gray-900 dark:text-[#E0E0E0] truncate max-w-[100px]">{it.descripcion}</td>
                        <td className="py-1 pl-1 text-right font-medium text-gray-900 dark:text-[#E0E0E0]">{formatMoney(imp)}</td>
                      </tr>
                    );
                  })}
                  {items.filter(function (it) { return it.descripcion; }).length === 0 && (
                    <tr><td colSpan="3" className="py-2 text-center text-gray-400 dark:text-[#808080]">Sin items</td></tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="px-4 py-3 space-y-1.5 text-[11px]">
              <div className="flex justify-between text-gray-600 dark:text-[#A0A0A0]">
                <span>Subtotal</span><span>{formatMoney(subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-[#A0A0A0]">
                <span>Descuento</span><span>{formatMoney(descTotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-[#A0A0A0]">
                <span>IGV (18%)</span><span>{formatMoney(igv)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold border-t border-gray-200 dark:border-[#3A3A3A] pt-1.5 text-emerald-600 dark:text-emerald-400">
                <span>TOTAL</span><span>{formatMoney(total)}</span>
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-[#2C2C2C] px-4 py-2 text-center border-t border-gray-200 dark:border-[#3A3A3A]">
              <p className="text-[8px] text-gray-400 dark:text-[#808080]">Representación impresa de la {tipo === 'FACTURA' ? 'Factura' : 'Boleta'} Electrónica</p>
            </div>
          </div>
        </div>
      </div>

      {clienteModal && (
        <NuevoClienteModal onClose={function () { setClienteModal(false); }} onCreado={handleNuevoClienteCreado} />
      )}

      {mascotaOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={function () { setMascotaOpen(false); }}>
          <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] mx-4 flex flex-col" onClick={function (e) { e.stopPropagation(); }}>
            <div className="px-6 py-4 border-b border-gray-200 dark:border-[#333] shrink-0">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold text-gray-900 dark:text-[#E0E0E0]">Seleccionar Mascota</h3>
                <button onClick={function () { setMascotaOpen(false); }} className="text-gray-400 dark:text-[#808080] hover:text-gray-600 dark:hover:text-[#A0A0A0] text-2xl leading-none p-1 cursor-pointer">&times;</button>
              </div>
              <div className="relative">
                <input autoFocus value={mascotaSearch} onChange={handleMascotaSearchChange} placeholder="Buscar por nombre, raza o dueño..." className="w-full pl-9 pr-4 py-2.5 border border-gray-300 dark:border-[#404040] rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none bg-white dark:bg-[#2C2C2C] text-gray-900 dark:text-[#E0E0E0]" />
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-2">
              {mascotaLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
                  <span className="ml-2 text-sm text-gray-500 dark:text-[#909090]">Buscando...</span>
                </div>
              ) : mascotaResults.length === 0 ? (
                <div className="p-6 text-center">
                  <p className="text-sm text-gray-400 dark:text-[#808080] mb-3">
                    {form.clienteDoc ? 'No se encontraron mascotas para este cliente. ¿Quieres registrar una nueva?' : 'No se encontraron mascotas'}
                  </p>
                  <button onClick={function () { navigate('/mascotas/nueva'); }} className="text-sm text-blue-600 hover:text-blue-700 font-medium cursor-pointer">
                    + Registrar nueva mascota
                  </button>
                </div>
              ) : (
                mascotaResults.map(function (m) {
                  return (
                    <button key={m.id} type="button" onClick={function () { selectMascota(m); }}
                      className={"w-full flex items-center gap-3 px-3 py-3 text-sm text-left hover:bg-gray-50 dark:hover:bg-[#2C2C2C] rounded-lg transition-colors cursor-pointer " + (mascotaSel && mascotaSel.id === m.id ? 'bg-gray-50 dark:bg-[#2C2C2C]' : '')}>
                      {m.fotoUrl ? (
                        <img src={m.fotoUrl} alt="" className="w-10 h-10 rounded-full object-cover shrink-0" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-[#3A3A3A] flex items-center justify-center text-gray-500 dark:text-[#A0A0A0] text-sm font-bold shrink-0">
                          {m.nombre.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 dark:text-[#E0E0E0]">{m.nombre}</p>
                        <p className="text-xs text-gray-500 dark:text-[#909090] truncate">
                          {m.especie || '—'}{m.especie && m.raza ? ' - ' : ''}{m.raza || ''}
                          {m.cliente?.nombre ? ' | Dueño: ' + m.cliente.nombre : ''}
                        </p>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
            <div className="px-6 py-3 border-t border-gray-200 dark:border-[#333] text-center shrink-0">
              <button onClick={function () { setMascotaOpen(false); }} className="px-6 py-2 text-sm text-gray-600 dark:text-[#A0A0A0] hover:text-gray-800 dark:hover:text-[#E0E0E0] cursor-pointer">Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
