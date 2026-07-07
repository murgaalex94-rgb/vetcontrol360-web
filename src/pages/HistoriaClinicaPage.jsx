import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import API from '../services/axiosConfig';
import NuevaConsultaModal from '../components/NuevaConsultaModal';

var ITEMS_PER_PAGE = 5;

function HistoriaClinicaPage() {
  var navigate = useNavigate();
  var [searchParams] = useSearchParams();
  var mascotaIdParam = searchParams.get('mascotaId');

  var [mascota, setMascota] = useState(null);
  var [consultas, setConsultas] = useState([]);
  var [detallesConsultas, setDetallesConsultas] = useState({});
  var [busqueda, setBusqueda] = useState('');
  var [filtroTipo, setFiltroTipo] = useState('Todas');
  var [paginaActual, setPaginaActual] = useState(1);
  var [selectedId, setSelectedId] = useState(Number(searchParams.get('consultaId')) || null);
  var [showModal, setShowModal] = useState(false);
  var [searchMascota, setSearchMascota] = useState('');
  var [mascotasEncontradas, setMascotasEncontradas] = useState([]);
  var [loading, setLoading] = useState(true);

  useEffect(function () {
    if (!mascotaIdParam) { setLoading(false); return; }
    setLoading(true);
    API.get('/mascotas/' + mascotaIdParam).then(function (res) { setMascota(res.data); });
    API.get('/consultas-medicas?mascotaId=' + mascotaIdParam).then(function (res) {
      var data = res.data;
      setConsultas(data);
      data.forEach(function (c) {
        API.get('/consultas-medicas/' + c.id).then(function (res2) {
          setDetallesConsultas(function (prev) { return Object.assign({}, prev, { [c.id]: res2.data }); });
        });
      });
      setLoading(false);
    });
  }, [mascotaIdParam]);

  function handleBuscarMascota() {
    if (!searchMascota.trim()) return;
    API.get('/mascotas/buscar?q=' + encodeURIComponent(searchMascota)).then(function (res) {
      setMascotasEncontradas(res.data);
    });
  }

  function seleccionarMascota(m) {
    navigate('/historia-clinica?mascotaId=' + m.id);
  }

  var consultasFiltradas = consultas.filter(function (c) {
    var q = busqueda.toLowerCase();
    var matchBusqueda = !q || (c.tipo && c.tipo.toLowerCase().includes(q)) || (c.veterinario && c.veterinario.toLowerCase().includes(q)) || (c.motivo && c.motivo.toLowerCase().includes(q));
    var matchTipo = filtroTipo === 'Todas' || c.tipo === filtroTipo;
    return matchBusqueda && matchTipo;
  });

  var totalPaginas = Math.ceil(consultasFiltradas.length / ITEMS_PER_PAGE);
  var consultasPagina = consultasFiltradas.slice((paginaActual - 1) * ITEMS_PER_PAGE, paginaActual * ITEMS_PER_PAGE);
  var inicio = consultasFiltradas.length > 0 ? (paginaActual - 1) * ITEMS_PER_PAGE + 1 : 0;
  var fin = Math.min(paginaActual * ITEMS_PER_PAGE, consultasFiltradas.length);

  var selectedConsulta = selectedId && detallesConsultas[selectedId] ? detallesConsultas[selectedId] : null;
  var selectedMeta = selectedId ? consultas.find(function (c) { return c.id === selectedId; }) : null;

  var inputClass = 'rounded-xl border border-gray-300 dark:border-[#404040] bg-white dark:bg-[#2C2C2C] px-4 py-2.5 text-sm text-gray-800 dark:text-[#E0E0E0] transition-colors focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20';

  if (!mascotaIdParam) {
    return (
      <div className="flex flex-col h-full gap-6 items-center justify-center">
        <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl border border-gray-200 dark:border-[#333] shadow-sm p-8 w-full max-w-lg">
          <h2 className="text-xl font-bold text-gray-800 dark:text-[#E0E0E0] mb-4 text-center">Historial Clínico</h2>
          <p className="text-sm text-gray-500 dark:text-[#909090] mb-6 text-center">Seleccione una mascota para ver su historial</p>
          <div className="flex gap-2">
            <input type="text" value={searchMascota} onChange={function (e) { setSearchMascota(e.target.value); }} onKeyDown={function (e) { if (e.key === 'Enter') handleBuscarMascota(); }} placeholder="Buscar mascota por nombre..." className={inputClass + ' flex-1'} />
            <button onClick={handleBuscarMascota} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white shadow-sm transition-colors cursor-pointer" style={{ backgroundColor: '#5F7B65' }}>Buscar</button>
          </div>
          {mascotasEncontradas.length > 0 && (
            <div className="mt-4 space-y-2">
              {mascotasEncontradas.map(function (m) {
                return (
                  <button key={m.id} onClick={function () { seleccionarMascota(m); }} className="w-full text-left flex items-center gap-3 p-3 rounded-xl border border-gray-200 dark:border-[#333] hover:bg-gray-50 dark:hover:bg-[#2C2C2C] transition-colors cursor-pointer">
                    <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 font-bold">{m.nombre ? m.nombre[0] : '?'}</div>
                    <div><p className="text-sm font-semibold text-gray-800 dark:text-[#E0E0E0]">{m.nombre}</p><p className="text-xs text-gray-500 dark:text-[#909090]">{m.raza || ''} · {m.especie || ''}</p></div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full gap-6">
      <div className="flex-none flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900/30">
            <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" /></svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-gray-800 dark:text-[#E0E0E0]">Historia Clínica</h1>
              {mascota && <span className="text-lg text-gray-400 dark:text-[#808080]">— {mascota.nombre}</span>}
            </div>
            <p className="text-sm text-gray-500 dark:text-[#909090]">Historial médico y consultas del paciente</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={function () { navigate('/historia-clinica'); }} className="flex items-center gap-2 rounded-xl border border-gray-300 dark:border-[#3A3A3A] bg-white dark:bg-[#1E1E1E] px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-[#E0E0E0] transition-colors hover:bg-gray-50 dark:hover:bg-[#2C2C2C] cursor-pointer">
            Cambiar Mascota
          </button>
          <button onClick={function () { window.print(); }} className="flex items-center gap-2 rounded-xl border border-gray-300 dark:border-[#3A3A3A] bg-white dark:bg-[#1E1E1E] px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-[#E0E0E0] transition-colors hover:bg-gray-50 dark:hover:bg-[#2C2C2C] cursor-pointer">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0 1 10.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0 .229 2.523a1.125 1.125 0 0 1-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0 0 21 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 0 0-1.913-.247M6.34 18H5.25A2.25 2.25 0 0 1 3 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 0 1 1.913-.247m10.5 0a48.536 48.536 0 0 0-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5Zm-3 0h.008v.008H15V10.5Z" /></svg>
            Imprimir
          </button>
          <button onClick={function () { setShowModal(true); }} className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors cursor-pointer" style={{ backgroundColor: '#5F7B65' }}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
            Nueva Consulta
          </button>
        </div>
      </div>

      {mascota && (
        <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl border border-gray-200 dark:border-[#333] shadow-sm p-6">
          <div className="flex items-start gap-8">
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 text-2xl font-bold ring-4 ring-emerald-100 dark:ring-emerald-900/50">
                {mascota.nombre ? mascota.nombre[0] : '?'}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-[#E0E0E0]">{mascota.nombre}</h2>
                  <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-xs font-semibold px-2.5 py-0.5 rounded-full">{mascota.estado || 'Activo'}</span>
                </div>
                <p className="text-sm text-gray-500 dark:text-[#909090]">{mascota.raza || ''} · {mascota.especie || ''}</p>
                <p className="text-sm text-gray-500 dark:text-[#909090]">{mascota.edad || ''}{mascota.edad && mascota.peso ? ' · ' : ''}{mascota.peso || ''}</p>
              </div>
            </div>
            <div className="flex-1 grid grid-cols-2 gap-x-8 gap-y-2">
              <div><p className="text-xs text-gray-400 dark:text-[#808080]">Microchip</p><p className="text-sm font-medium text-gray-800 dark:text-[#E0E0E0]">{mascota.microchip || '—'}</p></div>
              <div><p className="text-xs text-gray-400 dark:text-[#808080]">Dueño</p><p className="text-sm font-medium text-gray-800 dark:text-[#E0E0E0]">{mascota.cliente?.nombre || mascota.dueno || '—'}</p></div>
              <div><p className="text-xs text-gray-400 dark:text-[#808080]">Fecha de Nacimiento</p><p className="text-sm font-medium text-gray-800 dark:text-[#E0E0E0]">{mascota.fechaNacimiento ? new Date(mascota.fechaNacimiento).toLocaleDateString('es-PE') : '—'}</p></div>
            </div>
            <button onClick={function () { navigate('/historial/' + mascota.id); }} className="self-center flex items-center gap-2 rounded-xl border border-emerald-300 dark:border-emerald-700 bg-white dark:bg-[#1E1E1E] px-4 py-2.5 text-sm font-medium text-emerald-700 dark:text-emerald-300 transition-colors hover:bg-emerald-50 dark:hover:bg-emerald-900/20 cursor-pointer whitespace-nowrap">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" /></svg>
              Ver Ficha Completa
            </button>
          </div>
        </div>
      )}

      <div className="flex-1 min-h-0 overflow-auto grid grid-cols-12 gap-6">
        <div className={'space-y-4 ' + (selectedId && selectedConsulta ? 'col-span-8' : 'col-span-12')}>
          <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl border border-gray-200 dark:border-[#333] shadow-sm p-4">
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-[#808080]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>
                <input type="text" value={busqueda} onChange={function (e) { setBusqueda(e.target.value); setPaginaActual(1); }} placeholder="Buscar en consultas..." className="w-full rounded-xl border border-gray-300 dark:border-[#404040] bg-white dark:bg-[#2C2C2C] pl-10 pr-4 py-2.5 text-sm text-gray-800 dark:text-[#E0E0E0] placeholder-gray-400 dark:placeholder-[#808080] focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20" />
              </div>
              <select value={filtroTipo} onChange={function (e) { setFiltroTipo(e.target.value); setPaginaActual(1); }} className="rounded-xl border border-gray-300 dark:border-[#404040] bg-white dark:bg-[#2C2C2C] px-4 py-2.5 text-sm text-gray-700 dark:text-[#D0D0D0] focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20">
                <option value="Todas">Todas las consultas</option>
                <option value="Consulta General">Consulta General</option>
                <option value="Vacunación">Vacunación</option>
                <option value="Examen de Laboratorio">Examen de Laboratorio</option>
                <option value="Desparasitación">Desparasitación</option>
              </select>
            </div>
          </div>

          <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl border border-gray-200 dark:border-[#333] shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-[#333] bg-gray-50 dark:bg-[#2C2C2C]">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-[#909090] uppercase tracking-wider">Fecha</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-[#909090] uppercase tracking-wider">Tipo de Consulta</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-[#909090] uppercase tracking-wider">Veterinario</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-[#909090] uppercase tracking-wider">Motivo de Consulta</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-[#909090] uppercase tracking-wider">Estado</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 dark:text-[#909090] uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-[#333]">
                  {consultasPagina.map(function (c) {
                    var isSelected = selectedId === c.id;
                    return (
                      <tr key={c.id} onClick={function () { setSelectedId(c.id); }} className={'transition-colors cursor-pointer ' + (isSelected ? 'bg-emerald-50 dark:bg-emerald-900/20' : 'hover:bg-gray-50 dark:hover:bg-[#2C2C2C]')}>
                        <td className="px-4 py-3 text-sm text-gray-600 dark:text-[#B0B0B0] whitespace-nowrap">{c.fecha ? new Date(c.fecha).toLocaleDateString('es-PE') : '—'}</td>
                        <td className="px-4 py-3"><span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">{c.tipo || '—'}</span></td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-800 dark:text-[#E0E0E0]">{c.veterinario || '—'}</td>
                        <td className="px-4 py-3 text-sm text-gray-600 dark:text-[#B0B0B0] max-w-[250px] truncate">{c.motivo || '—'}</td>
                        <td className="px-4 py-3"><span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">{c.estado || 'Completada'}</span></td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button onClick={function (e) { e.stopPropagation(); setSelectedId(c.id); }} className="flex items-center gap-1 rounded-lg bg-[#5F7B65] px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-emerald-700 cursor-pointer">
                              Ver Detalle
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {loading && (
                    <tr><td colSpan={6} className="px-4 py-12 text-center text-sm text-gray-400">Cargando consultas...</td></tr>
                  )}
                  {!loading && consultasPagina.length === 0 && (
                    <tr><td colSpan={6} className="px-4 py-12 text-center text-sm text-gray-400">No se encontraron consultas</td></tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-between border-t border-gray-200 dark:border-[#333] px-4 py-3">
              <p className="text-sm text-gray-500 dark:text-[#909090]">Mostrando {inicio} a {fin} de {consultasFiltradas.length} consultas</p>
              <div className="flex items-center gap-1">
                <button onClick={function () { setPaginaActual(function (p) { return Math.max(1, p - 1); }); }} disabled={paginaActual === 1} className="flex items-center justify-center rounded-lg border border-gray-300 dark:border-[#404040] bg-white dark:bg-[#1E1E1E] px-2.5 py-1.5 text-sm font-medium text-gray-700 dark:text-[#C0C0C0] transition-colors hover:bg-gray-50 dark:hover:bg-[#2C2C2C] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" /></svg>
                </button>
                {Array.from({ length: totalPaginas }, function (_, i) { return i + 1; }).map(function (pag) {
                  return (
                    <button key={pag} onClick={function () { setPaginaActual(pag); }} className={'flex h-8 w-8 items-center justify-center rounded-lg text-sm font-semibold transition-colors cursor-pointer ' + (paginaActual === pag ? 'bg-[#5F7B65] text-white' : 'border border-gray-300 dark:border-[#404040] bg-white dark:bg-[#1E1E1E] text-gray-700 dark:text-[#C0C0C0] hover:bg-gray-50 dark:hover:bg-[#2C2C2C]')}>{pag}</button>
                  );
                })}
                <button onClick={function () { setPaginaActual(function (p) { return Math.min(totalPaginas, p + 1); }); }} disabled={paginaActual === totalPaginas} className="flex items-center justify-center rounded-lg border border-gray-300 bg-white px-2.5 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" /></svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {selectedId && selectedConsulta && selectedMeta && (
          <div className="col-span-4 space-y-4">
            <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl border border-gray-200 dark:border-[#333] shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">{selectedMeta.tipo}</span>
                <button onClick={function () { setSelectedId(null); }} className="text-gray-400 dark:text-[#808080] hover:text-gray-600 dark:hover:text-[#A0A0A0] cursor-pointer">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <p className="text-xs text-gray-400 dark:text-[#808080] mb-1">Veterinario</p>
              <p className="text-sm font-semibold text-gray-800 dark:text-[#E0E0E0] mb-4">{selectedMeta.veterinario || '—'}</p>

              <p className="text-xs text-gray-400 dark:text-[#808080] mb-1">Fecha</p>
              <p className="text-sm font-medium text-gray-800 dark:text-[#E0E0E0] mb-4">{selectedMeta.fecha ? new Date(selectedMeta.fecha).toLocaleDateString('es-PE') : '—'}</p>

              <div className="border-t border-gray-100 dark:border-[#333] pt-4 mb-4">
                <p className="text-xs font-semibold text-gray-500 dark:text-[#909090] uppercase tracking-wider mb-2">Motivo de la Consulta</p>
                <p className="text-sm text-gray-700 dark:text-[#C0C0C0] leading-relaxed">{selectedConsulta.motivo || '—'}</p>
              </div>

              <div className="border-t border-gray-100 dark:border-[#333] pt-4 mb-4">
                <p className="text-xs font-semibold text-gray-500 dark:text-[#909090] uppercase tracking-wider mb-2">Anamnesis</p>
                <p className="text-sm text-gray-700 dark:text-[#C0C0C0] leading-relaxed">{selectedConsulta.anamnesis || '—'}</p>
              </div>

              {selectedConsulta.examenFisico && (function () {
                try { return JSON.parse(selectedConsulta.examenFisico); } catch (e) { return null; }
              })() && (function () {
                var ef = JSON.parse(selectedConsulta.examenFisico);
                var labels = { temperatura: 'Temperatura', frecuenciaCardiaca: 'Frec. Cardíaca', frecuenciaRespiratoria: 'Frec. Respiratoria', presionArterial: 'Presión Arterial', peso: 'Peso', condicionCorporal: 'Condición Corporal', estadoMucosas: 'Mucosas', tiempoLlenadoCapilar: 'Llenado Capilar' };
                return (
                  <div className="border-t border-gray-100 dark:border-[#333] pt-4 mb-4">
                    <p className="text-xs font-semibold text-gray-500 dark:text-[#909090] uppercase tracking-wider mb-3">Examen Físico</p>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(ef).map(function (entry) {
                        return (
                          <div key={entry[0]} className="bg-gray-50 dark:bg-[#2C2C2C] rounded-lg p-2.5">
                            <p className="text-[10px] text-gray-400 dark:text-[#808080] uppercase">{labels[entry[0]] || entry[0]}</p>
                            <p className="text-xs font-semibold text-gray-800 dark:text-[#E0E0E0]">{entry[1]}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}

              {selectedConsulta.diagnostico && (function () {
                try {
                  var d = JSON.parse(selectedConsulta.diagnostico);
                  if (Array.isArray(d)) {
                    return (
                      <div className="border-t border-gray-100 dark:border-[#333] pt-4 mb-4">
                        <p className="text-xs font-semibold text-gray-500 dark:text-[#909090] uppercase tracking-wider mb-2">Diagnóstico</p>
                        <ul className="space-y-1">{d.map(function (diag, i) { return <li key={i} className="flex items-start gap-2 text-sm text-gray-700 dark:text-[#C0C0C0]"><span className="text-emerald-500 dark:text-emerald-400 mt-0.5 shrink-0">{'\u2022'}</span>{diag}</li>; })}</ul>
                      </div>
                    );
                  }
                  return <div className="border-t border-gray-100 dark:border-[#333] pt-4 mb-4"><p className="text-xs font-semibold text-gray-500 dark:text-[#909090] uppercase tracking-wider mb-2">Diagnóstico</p><p className="text-sm text-gray-700 dark:text-[#C0C0C0]">{d}</p></div>;
                } catch (e) { return null; }
              })()}

              {selectedConsulta.recomendaciones && (function () {
                try {
                  var r = JSON.parse(selectedConsulta.recomendaciones);
                  if (Array.isArray(r) && r.length > 0) {
                    return (
                      <div className="border-t border-gray-100 dark:border-[#333] pt-4 mb-4">
                        <p className="text-xs font-semibold text-gray-500 dark:text-[#909090] uppercase tracking-wider mb-2">Recomendaciones</p>
                        <ul className="space-y-1">{r.map(function (rec, i) { return <li key={i} className="flex items-start gap-2 text-sm text-gray-700 dark:text-[#C0C0C0]"><span className="text-blue-500 dark:text-blue-400 mt-0.5 shrink-0">{'\u25B8'}</span>{rec}</li>; })}</ul>
                      </div>
                    );
                  }
                } catch (e) { return null; }
              })()}

              {selectedConsulta.tratamiento && (function () {
                try {
                  var t = JSON.parse(selectedConsulta.tratamiento);
                  if (Array.isArray(t) && t.length > 0) {
                    return (
                      <div className="border-t border-gray-100 dark:border-[#333] pt-4 mb-4">
                        <p className="text-xs font-semibold text-gray-500 dark:text-[#909090] uppercase tracking-wider mb-2">Tratamiento</p>
                        <div className="space-y-2">{t.map(function (med, i) { return <div key={i} className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-2.5"><p className="text-xs font-semibold text-blue-800 dark:text-blue-300">{med.medicamento}</p><p className="text-[11px] text-blue-600 dark:text-blue-400">{med.dosis} · {med.frecuencia}</p></div>; })}</div>
                      </div>
                    );
                  }
                } catch (e) { return null; }
              })()}

              <div className="border-t border-gray-100 dark:border-[#333] pt-4">
                <p className="text-xs font-semibold text-gray-500 dark:text-[#909090] uppercase tracking-wider mb-2">Observaciones</p>
                <p className="text-sm text-gray-700 dark:text-[#C0C0C0] leading-relaxed">{selectedConsulta.observaciones || '—'}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {showModal && <NuevaConsultaModal onClose={function () { setShowModal(false); }} />}
    </div>
  );
}

export default HistoriaClinicaPage;
