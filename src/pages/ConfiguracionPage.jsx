import { useState } from 'react';

var secciones = [
  {
    id: 'general',
    titulo: 'General',
    icono: 'M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14.82.067 1.575.415 2.143 1.082.452.53.648 1.216.537 1.9a2.542 2.542 0 0 1-.69 1.385l-.813.842',
    campos: [
      { id: 'nombreClinica', label: 'Nombre de la Clínica', tipo: 'text', placeholder: 'VetControl 360' },
      { id: 'direccion', label: 'Dirección', tipo: 'text', placeholder: 'Av. Principal 123' },
      { id: 'telefono', label: 'Teléfono', tipo: 'text', placeholder: '999-999-999' },
    ],
  },
  {
    id: 'facturacion',
    titulo: 'Facturación',
    icono: 'M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z',
    campos: [
      { id: 'igv', label: 'IGV (%)', tipo: 'number', placeholder: '18' },
      { id: 'formatoFactura', label: 'Formato de Factura', tipo: 'select', opciones: ['F-000001', 'INV-0001'] },
    ],
  },
  {
    id: 'vacunacion',
    titulo: 'Vacunación',
    icono: 'M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z',
    campos: [
      { id: 'diasRecordatorio', label: 'Días de Recordatorio', tipo: 'number', placeholder: '7' },
    ],
  },
  {
    id: 'citas',
    titulo: 'Citas',
    icono: 'M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5',
    campos: [
      { id: 'duracionMinima', label: 'Duración Mínima (min)', tipo: 'number', placeholder: '30' },
    ],
  },
];

function ConfiguracionPage() {
  var [form, setForm] = useState({
    nombreClinica: 'VetControl 360',
    direccion: 'Av. Principal 123',
    telefono: '999-999-999',
    igv: '18',
    formatoFactura: 'F-000001',
    diasRecordatorio: '7',
    duracionMinima: '30',
  });

  function handleChange(id, valor) {
    setForm(Object.assign({}, form, { [id]: valor }));
  }

  function handleGuardar(seccionId) {
    var datosSeccion = {};
    var seccion = secciones.find(function (s) { return s.id === seccionId; });
    if (seccion) {
      seccion.campos.forEach(function (c) { datosSeccion[c.id] = form[c.id]; });
    }
    console.log('Guardando configuración - ' + seccion.titulo + ':', JSON.stringify(datosSeccion, null, 2));
  }

  var inputClass = 'w-full md:w-80 rounded-lg border border-gray-300 dark:border-[#404040] bg-white dark:bg-[#2C2C2C] px-4 py-2.5 text-sm text-gray-900 dark:text-[#E0E0E0] placeholder-gray-400 dark:placeholder-[#808080] focus:outline-none focus:ring-2 focus:ring-[#5F7B65] focus:border-[#5F7B65] transition-colors';
  var selectClass = inputClass + ' appearance-none cursor-pointer bg-[url(\'data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22%236b7280%22%3E%3Cpath%20fill-rule%3D%22evenodd%22%20d%3D%22M5.23%207.21a.75.75%200%20011.06.02L10%2011.168l3.71-3.938a.75.75%200%20111.08%201.04l-4.25%204.5a.75.75%200%2001-1.08%200l-4.25-4.5a.75.75%200%2001.02-1.06z%22%20clip-rule%3D%22evenodd%22%20%2F%3E%3C%2Fsvg%3E\')] dark:bg-[url(\'data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22%23909090%22%3E%3Cpath%20fill-rule%3D%22evenodd%22%20d%3D%22M5.23%207.21a.75.75%200%20011.06.02L10%2011.168l3.71-3.938a.75.75%200%20111.08%201.04l-4.25%204.5a.75.75%200%2001-1.08%200l-4.25-4.5a.75.75%200%2001.02-1.06z%22%20clip-rule%3D%22evenodd%22%20%2F%3E%3C%2Fsvg%3E\')] bg-[length:1.25rem] bg-[right_0.5rem_center] bg-no-repeat pr-10';

  return (
    <div className="flex flex-col h-full gap-6">
      <div className="flex-none">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-[#E0E0E0]">Configuración</h1>
        <p className="text-sm text-gray-500 dark:text-[#909090] mt-1">Ajusta los parámetros generales del sistema</p>
      </div>

      <div className="flex-1 space-y-5 max-w-3xl">
        {secciones.map(function (seccion) {
          return (
            <div key={seccion.id} className="bg-white dark:bg-[#1E1E1E] rounded-2xl border border-gray-200 dark:border-[#333] shadow-sm">
              <div className="flex items-center gap-3 px-6 pt-5 pb-3 border-b border-gray-100 dark:border-[#2C2C2C]">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#5F7B65]/10 dark:bg-[#5F7B65]/20">
                  <svg className="w-5 h-5 text-[#5F7B65]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d={seccion.icono} />
                  </svg>
                </div>
                <h2 className="text-base font-bold text-gray-900 dark:text-[#E0E0E0]">{seccion.titulo}</h2>
              </div>

              <div className="px-6 py-4 space-y-4">
                {seccion.campos.map(function (campo) {
                  return (
                    <div key={campo.id} className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                      <label className="text-sm font-medium text-gray-700 dark:text-[#B0B0B0] md:w-52 shrink-0">
                        {campo.label}
                      </label>
                      {campo.tipo === 'select' ? (
                        <select
                          value={form[campo.id]}
                          onChange={function (e) { handleChange(campo.id, e.target.value); }}
                          className={selectClass}
                        >
                          {campo.opciones.map(function (opt) {
                            return <option key={opt} value={opt}>{opt}</option>;
                          })}
                        </select>
                      ) : (
                        <input
                          type={campo.tipo}
                          value={form[campo.id]}
                          onChange={function (e) { handleChange(campo.id, e.target.value); }}
                          placeholder={campo.placeholder}
                          className={inputClass}
                        />
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-end px-6 pb-5">
                <button
                  onClick={function () { handleGuardar(seccion.id); }}
                  className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors cursor-pointer hover:opacity-90"
                  style={{ backgroundColor: '#5F7B65' }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                  Guardar Cambios
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ConfiguracionPage;
