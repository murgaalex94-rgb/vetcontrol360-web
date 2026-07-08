import { useState, useEffect } from 'react';
import API from '../services/axiosConfig';

export default function HistorialComprobantes() {
  var [comprobantes, setComprobantes] = useState([]);
  var [loading, setLoading] = useState(true);

  function cargar() {
    setLoading(true);
    API.get('/facturas/electronica/todos')
      .then(function (r) { setComprobantes(r.data || []); })
      .catch(function () { setComprobantes([]); })
      .finally(function () { setLoading(false); });
  }

  useEffect(cargar, []);

  var badgeClass = function (estado) {
    var map = {
      ACEPTADA: 'bg-green-100 text-green-700',
      RECHAZADA: 'bg-red-100 text-red-700',
      ERROR_SIN_CDR: 'bg-yellow-100 text-yellow-700',
      ENVIADO: 'bg-blue-100 text-blue-700',
    };
    return map[estado] || 'bg-gray-100 text-gray-600';
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Historial de Comprobantes</h1>
        <button onClick={cargar} className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer font-medium">Actualizar</button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div></div>
      ) : comprobantes.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" strokeWidth={1} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2Z" /></svg>
          <p className="text-lg font-medium">No hay comprobantes emitidos</p>
          <p className="text-sm mt-1">Los comprobantes enviados a SUNAT aparecerán aquí.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase">
                  <th className="text-left py-3 px-4">Tipo</th>
                  <th className="text-left py-3 px-4">Comprobante</th>
                  <th className="text-left py-3 px-4">Cliente</th>
                  <th className="text-left py-3 px-4">Documento</th>
                  <th className="text-center py-3 px-4">Estado SUNAT</th>
                  <th className="text-center py-3 px-4">Código CDR</th>
                  <th className="text-center py-3 px-4">Fecha Envío</th>
                  <th className="text-center py-3 px-4">Modo</th>
                </tr>
              </thead>
              <tbody>
                {comprobantes.slice().reverse().map(function (c) {
                  var tipoLabel = c.tipoComprobante === '01' ? 'FACTURA' : (c.tipoComprobante === '03' ? 'BOLETA' : c.tipoComprobante);
                  return (
                    <tr key={c.id} className="border-t border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <span className={'inline-block px-2 py-0.5 rounded text-[11px] font-bold ' + (c.tipoComprobante === '01' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700')}>
                          {tipoLabel}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-medium">{c.serie}-{c.numero}</td>
                      <td className="py-3 px-4">{c.clienteNombre || '—'}</td>
                      <td className="py-3 px-4 text-gray-500">{c.clienteDoc || '—'}</td>
                      <td className="py-3 px-4 text-center">
                        <span className={'inline-block px-2 py-0.5 rounded text-[11px] font-medium ' + badgeClass(c.sunatEstado)}>
                          {c.sunatEstado || 'PENDIENTE'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center text-gray-500">{c.cdrCodigo || '—'}</td>
                      <td className="py-3 px-4 text-center text-gray-500">{c.fechaEnvio ? new Date(c.fechaEnvio).toLocaleString('es-PE') : '—'}</td>
                      <td className="py-3 px-4 text-center">
                        <span className={'text-[11px] font-medium ' + (c.modo === 'demo' ? 'text-yellow-600' : 'text-gray-600')}>
                          {c.modo || '—'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="text-xs text-gray-400 text-right px-4 py-2 border-t border-gray-100">
            Total: {comprobantes.length} comprobante(s)
          </div>
        </div>
      )}
    </div>
  );
}
