import { useState, useEffect } from 'react';
import API from '../services/axiosConfig';

function formatearFecha(fechaHora) {
  if (!fechaHora) return '';
  var d = new Date(fechaHora);
  if (isNaN(d.getTime())) return fechaHora;
  var dia = String(d.getDate()).padStart(2, '0');
  var mes = String(d.getMonth() + 1).padStart(2, '0');
  var anio = d.getFullYear();
  var horas = String(d.getHours()).padStart(2, '0');
  var minutos = String(d.getMinutes()).padStart(2, '0');
  return dia + '/' + mes + '/' + anio + ' ' + horas + ':' + minutos;
}

function tiempoRelativo(fechaHora) {
  if (!fechaHora) return '';
  var ahora = Date.now();
  var d = new Date(fechaHora).getTime();
  if (isNaN(d)) return '';
  var diffMs = ahora - d;
  var segundos = Math.floor(diffMs / 1000);
  if (segundos < 60) return 'Hace ' + segundos + 's';
  var minutos = Math.floor(segundos / 60);
  if (minutos < 60) return 'Hace ' + minutos + 'min';
  var horas = Math.floor(minutos / 60);
  if (horas < 24) return 'Hace ' + horas + 'h ' + (minutos % 60) + 'min';
  var dias = Math.floor(horas / 24);
  return 'Hace ' + dias + ' d\u00edas';
}

function obtenerIniciales(usuario) {
  if (!usuario) return '??';
  var partes = usuario.split(' ');
  if (partes.length >= 2) return (partes[0][0] + partes[1][0]).toUpperCase();
  return usuario.substring(0, 2).toUpperCase();
}

function avatarColor(usuario) {
  if (!usuario || usuario === 'Desconocido' || usuario === 'Sistema') return 'bg-gray-400';
  var colores = ['bg-blue-100', 'bg-green-500', 'bg-purple-500', 'bg-amber-500', 'bg-rose-500', 'bg-cyan-500', 'bg-indigo-500'];
  var hash = 0;
  for (var i = 0; i < usuario.length; i++) { hash = usuario.charCodeAt(i) + ((hash << 5) - hash); }
  return colores[Math.abs(hash) % colores.length];
}

function accionColor(accion) {
  if (accion === 'Creó') return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
  if (accion === 'Actualizó') return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
  if (accion === 'Eliminó') return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300';
  if (accion === 'Login') return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
  if (accion === 'Login Fallido') return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300';
  return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
}

function severidadColor(severidad) {
  if (severidad === 'Info') return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
  if (severidad === 'Éxito') return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
  if (severidad === 'Advertencia') return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300';
  if (severidad === 'Crítico') return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300';
  if (severidad === 'Fallido') return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300';
  return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
}

var modulos = ['Todos', 'Sistema', 'Clientes', 'Mascotas'];
var acciones = ['Todas', 'Actualizó', 'Creó', 'Eliminó', 'Login', 'Login Fallido'];
var severidades = ['Todas', 'Info', 'Éxito', 'Advertencia', 'Crítico', 'Fallido'];
var estadosFiltro = ['Todos', 'Exitoso', 'Fallido'];

var ITEMS_PER_PAGE = 8;

function AuditoriaPage() {
  var [registros, setRegistros] = useState([]);
  var [busqueda, setBusqueda] = useState('');
  var [filtroUsuario, setFiltroUsuario] = useState('Todos');
  var [filtroModulo, setFiltroModulo] = useState('Todos');
  var [filtroAccion, setFiltroAccion] = useState('Todas');
  var [filtroSeveridad, setFiltroSeveridad] = useState('Todas');
  var [filtroEstado, setFiltroEstado] = useState('Todos');
  var [paginaActual, setPaginaActual] = useState(1);

  function cargarRegistros() {
    API.get('/auditoria')
      .then(function (res) { setRegistros(res.data); })
      .catch(function () {});
  }

  useEffect(function () {
    cargarRegistros();
    var intervalo = setInterval(cargarRegistros, 10000);
    return function () { clearInterval(intervalo); };
  }, []);

  var usuariosUnicos = ['Todos'].concat(
    registros.map(function (r) { return r.usuario; })
      .filter(function (u, i, arr) { return arr.indexOf(u) === i; })
      .sort()
  );

  var registrosFiltrados = registros.filter(function (r) {
    var q = busqueda.toLowerCase();
    var matchBusqueda = !q || (r.usuario && r.usuario.toLowerCase().includes(q)) || (r.descripcion && r.descripcion.toLowerCase().includes(q)) || (r.modulo && r.modulo.toLowerCase().includes(q));
    var matchUsuario = filtroUsuario === 'Todos' || r.usuario === filtroUsuario;
    var matchModulo = filtroModulo === 'Todos' || r.modulo === filtroModulo;
    var matchAccion = filtroAccion === 'Todas' || r.accion === filtroAccion;
    var matchSeveridad = filtroSeveridad === 'Todas' || r.severidad === filtroSeveridad;
    var matchEstado = filtroEstado === 'Todos' || r.estado === filtroEstado;
    return matchBusqueda && matchUsuario && matchModulo && matchAccion && matchSeveridad && matchEstado;
  });

  var totalPaginas = Math.max(1, Math.ceil(registrosFiltrados.length / ITEMS_PER_PAGE));
  var registrosPagina = registrosFiltrados.slice((paginaActual - 1) * ITEMS_PER_PAGE, paginaActual * ITEMS_PER_PAGE);
  var inicio = registrosFiltrados.length > 0 ? (paginaActual - 1) * ITEMS_PER_PAGE + 1 : 0;
  var fin = Math.min(paginaActual * ITEMS_PER_PAGE, registrosFiltrados.length);

  function limpiarFiltros() {
    setBusqueda('');
    setFiltroUsuario('Todos');
    setFiltroModulo('Todos');
    setFiltroAccion('Todas');
    setFiltroSeveridad('Todas');
    setFiltroEstado('Todos');
    setPaginaActual(1);
  }

  var usuariosHoy = registros.filter(function (r) {
    var hoy = new Date();
    var fechaReg = new Date(r.fechaHora);
    return !isNaN(fechaReg.getTime()) &&
      fechaReg.getDate() === hoy.getDate() &&
      fechaReg.getMonth() === hoy.getMonth() &&
      fechaReg.getFullYear() === hoy.getFullYear();
  });
  var usuariosActivos = usuariosHoy.map(function (r) { return r.usuario; })
    .filter(function (u, i, arr) { return arr.indexOf(u) === i; }).length;

  var loginExitosos = registros.filter(function (r) { return r.accion === 'Login' && r.estado === 'Exitoso'; }).length;
  var loginFallidos = registros.filter(function (r) { return r.accion === 'Login Fallido'; }).length;

  var accionesCriticas = registros.filter(function (r) {
    return r.severidad === 'Crítico' || r.severidad === 'Advertencia';
  }).length;

  var ultimoRegistro = registros.length > 0 ? registros[0] : null;
  var ultimaActividad = ultimoRegistro ? tiempoRelativo(ultimoRegistro.fechaHora) : '—';
  var ultimaFecha = ultimoRegistro ? formatearFecha(ultimoRegistro.fechaHora) : '—';

  var actividadReciente = registros.slice(0, 5).map(function (r) {
    return {
      id: r.id,
      tipo: r.accion,
      color: r.accion === 'Creó' ? 'bg-green-500' :
             r.accion === 'Eliminó' ? 'bg-red-500' :
             r.accion === 'Login Fallido' ? 'bg-red-500' :
             r.accion === 'Login' ? 'bg-purple-500' : 'bg-blue-500',
      texto: r.usuario + ' ' + (r.accion ? r.accion.toLowerCase() : '') + (r.descripcion ? ': ' + r.descripcion.substring(0, 40) : ''),
      tiempo: tiempoRelativo(r.fechaHora),
    };
  });

  var eliminatorias = registros.filter(function (r) { return r.accion === 'Eliminó'; }).length;
  var actualizaciones = registros.filter(function (r) { return r.accion === 'Actualizó'; }).length;
  var creaciones = registros.filter(function (r) { return r.accion === 'Creó'; }).length;

  var selectClass = 'rounded-xl border border-gray-300 dark:border-[#404040] bg-white dark:bg-[#2C2C2C] px-3 py-2 text-sm text-gray-700 dark:text-[#D0D0D0] transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 appearance-none bg-[url(\'data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22%236b7280%22%3E%3Cpath%20fill-rule%3D%22evenodd%22%20d%3D%22M5.23%207.21a.75.75%200%20011.06.02L10%2011.168l3.71-3.938a.75.75%200%20111.08%201.04l-4.25%204.5a.75.75%200%2001-1.08%200l-4.25-4.5a.75.75%200%2001.02-1.06z%22%20clip-rule%3D%22evenodd%22%20%2F%3E%3C%2Fsvg%3E\')] dark:bg-[url(\'data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22%23909090%22%3E%3Cpath%20fill-rule%3D%22evenodd%22%20d%3D%22M5.23%207.21a.75.75%200%20011.06.02L10%2011.168l3.71-3.938a.75.75%200%20111.08%201.04l-4.25%204.5a.75.75%200%2001-1.08%200l-4.25-4.5a.75.75%200%2001.02-1.06z%22%20clip-rule%3D%22evenodd%22%20%2F%3E%3C%2Fsvg%3E\')] bg-[length:1.25rem] bg-[right_0.5rem_center] bg-no-repeat pr-8';

  return (
    <div className="flex flex-col h-full gap-6">
      <div className="flex flex-none items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 dark:bg-red-900/30">
            <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" /></svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-[#E0E0E0]">Auditoría</h1>
            <p className="text-sm text-gray-500 dark:text-[#909090]">Registro de actividad y cambios en el sistema</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#1E1E1E] rounded-xl shadow-sm border border-gray-100 dark:border-[#333] p-5">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 flex items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-900/30"><svg className="w-6 h-6 text-blue-500 dark:text-blue-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" /></svg></div>
            <div>
              <p className="text-2xl font-bold text-gray-800 dark:text-[#E0E0E0]">{usuariosActivos}</p>
              <p className="text-sm text-gray-500 dark:text-[#909090]">Usuarios activos hoy</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-[#1E1E1E] rounded-xl shadow-sm border border-gray-100 dark:border-[#333] p-5">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 flex items-center justify-center rounded-xl bg-green-50 dark:bg-green-900/30"><svg className="w-6 h-6 text-green-500 dark:text-green-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg></div>
            <div>
              <p className="text-2xl font-bold text-gray-800 dark:text-[#E0E0E0]">{loginExitosos + loginFallidos}</p>
              <p className="text-sm text-gray-500 dark:text-[#909090]">Intentos de login</p>
              <p className="text-xs text-gray-500 dark:text-[#909090]">{loginExitosos} exitosos / {loginFallidos} fallidos</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-[#1E1E1E] rounded-xl shadow-sm border border-gray-100 dark:border-[#333] p-5">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 flex items-center justify-center rounded-xl bg-orange-50 dark:bg-orange-900/30"><svg className="w-6 h-6 text-orange-500 dark:text-orange-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" /></svg></div>
            <div>
              <p className="text-2xl font-bold text-gray-800 dark:text-[#E0E0E0]">{accionesCriticas}</p>
              <p className="text-sm text-gray-500 dark:text-[#909090]">Acciones críticas</p>
              <p className="text-xs text-gray-500 dark:text-[#909090]">En el sistema</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-[#1E1E1E] rounded-xl shadow-sm border border-gray-100 dark:border-[#333] p-5">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 flex items-center justify-center rounded-xl bg-purple-50 dark:bg-purple-900/30"><svg className="w-6 h-6 text-purple-500 dark:text-purple-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg></div>
            <div>
              <p className="text-2xl font-bold text-gray-800 dark:text-[#E0E0E0]">{ultimaActividad}</p>
              <p className="text-sm text-gray-500 dark:text-[#909090]">Última actividad</p>
              <p className="text-xs text-gray-500 dark:text-[#909090]">{ultimaFecha}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl border border-gray-200 dark:border-[#333] shadow-sm p-4">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-[#808080]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>
            <input type="text" value={busqueda} onChange={function (e) { setBusqueda(e.target.value); setPaginaActual(1); }} placeholder="Buscar en auditoría..." className="w-full rounded-xl border border-gray-300 dark:border-[#404040] bg-white dark:bg-[#2C2C2C] pl-10 pr-4 py-2.5 text-sm text-gray-800 dark:text-[#E0E0E0] placeholder-gray-400 dark:placeholder-[#808080] transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
          </div>
          <select value={filtroUsuario} onChange={function (e) { setFiltroUsuario(e.target.value); setPaginaActual(1); }} className={selectClass}>
            {usuariosUnicos.map(function (u) { return <option key={u} value={u}>{u === 'Todos' ? 'Usuarios: Todos' : u}</option>; })}
          </select>
          <select value={filtroModulo} onChange={function (e) { setFiltroModulo(e.target.value); setPaginaActual(1); }} className={selectClass}>
            {modulos.map(function (m) { return <option key={m} value={m}>{m === 'Todos' ? 'Módulo: Todos' : m}</option>; })}
          </select>
          <select value={filtroAccion} onChange={function (e) { setFiltroAccion(e.target.value); setPaginaActual(1); }} className={selectClass}>
            {acciones.map(function (a) { return <option key={a} value={a}>{a === 'Todas' ? 'Acción: Todas' : a}</option>; })}
          </select>
          <select value={filtroSeveridad} onChange={function (e) { setFiltroSeveridad(e.target.value); setPaginaActual(1); }} className={selectClass}>
            {severidades.map(function (s) { return <option key={s} value={s}>{s === 'Todas' ? 'Severidad: Todas' : s}</option>; })}
          </select>
          <select value={filtroEstado} onChange={function (e) { setFiltroEstado(e.target.value); setPaginaActual(1); }} className={selectClass}>
            {estadosFiltro.map(function (e) { return <option key={e} value={e}>{e === 'Todos' ? 'Estado: Todos' : e}</option>; })}
          </select>
          <button onClick={limpiarFiltros} className="flex items-center gap-2 rounded-xl border border-gray-300 dark:border-[#404040] bg-white dark:bg-[#1E1E1E] px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-[#C0C0C0] transition-colors hover:bg-gray-50 dark:hover:bg-[#2C2C2C] cursor-pointer whitespace-nowrap">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
            Limpiar filtros
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6 flex-1 min-h-0">
        <div className="col-span-9 flex flex-col min-h-0">
          <div className="flex-1 flex flex-col min-h-0 bg-white dark:bg-[#1E1E1E] rounded-2xl border border-gray-200 dark:border-[#333] shadow-sm overflow-hidden">
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-[#333] bg-gray-50 dark:bg-[#2C2C2C]">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-[#909090] uppercase tracking-wider">Fecha y Hora</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-[#909090] uppercase tracking-wider">Usuario</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-[#909090] uppercase tracking-wider">Acción</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-[#909090] uppercase tracking-wider">Módulo</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-[#909090] uppercase tracking-wider">Descripción</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-[#909090] uppercase tracking-wider">IP / Dispositivo</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-[#909090] uppercase tracking-wider">Severidad</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 dark:text-[#909090] uppercase tracking-wider">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-[#333]">
                  {registrosPagina.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-4 py-10 text-center text-sm text-gray-400 dark:text-[#808080]">
                        {registros.length === 0 ? 'Cargando registros de auditoría...' : 'No se encontraron registros con los filtros actuales.'}
                      </td>
                    </tr>
                  ) : (
                    registrosPagina.map(function (r) {
                      return (
                        <tr key={r.id} className="hover:bg-gray-50 dark:hover:bg-[#2C2C2C] transition-colors">
                          <td className="px-4 py-3 text-sm text-gray-600 dark:text-[#B0B0B0] whitespace-nowrap">{formatearFecha(r.fechaHora)}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className={'h-7 w-7 flex items-center justify-center rounded-full text-white text-[10px] font-bold ' + avatarColor(r.usuario)}>{obtenerIniciales(r.usuario)}</div>
                              <span className="text-sm font-medium text-gray-800 dark:text-[#E0E0E0]">{r.usuario}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3"><span className={'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ' + accionColor(r.accion)}>{r.accion}</span></td>
                          <td className="px-4 py-3 text-sm text-gray-600 dark:text-[#B0B0B0]">{r.modulo}</td>
                          <td className="px-4 py-3 text-sm text-gray-600 dark:text-[#B0B0B0] max-w-[200px] truncate">{r.descripcion}</td>
                          <td className="px-4 py-3">
                            <p className="text-xs text-gray-600 dark:text-[#B0B0B0]">{r.ipDispositivo || '—'}</p>
                            <p className="text-[11px] text-gray-400 dark:text-[#808080]">{r.navegador || '—'}</p>
                          </td>
                          <td className="px-4 py-3"><span className={'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ' + severidadColor(r.severidad)}>{r.severidad}</span></td>
                          <td className="px-4 py-3 text-center">
                            {r.estado === 'Exitoso' ? (
                              <div className="flex items-center justify-center"><div className="h-6 w-6 flex items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30"><svg className="w-3.5 h-3.5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg></div></div>
                            ) : (
                              <div className="flex items-center justify-center"><div className="h-6 w-6 flex items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30"><svg className="w-3.5 h-3.5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg></div></div>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
            {registrosFiltrados.length > 0 && (
              <div className="flex-none flex items-center justify-between border-t border-gray-200 dark:border-[#333] px-4 py-3">
                <p className="text-sm text-gray-500 dark:text-[#909090]">Mostrando {inicio} a {fin} de {registrosFiltrados.length} registros</p>
                <div className="flex items-center gap-1">
                  <button onClick={function () { setPaginaActual(function (p) { return Math.max(1, p - 1); }); }} disabled={paginaActual === 1} className="flex items-center justify-center rounded-lg border border-gray-300 dark:border-[#404040] bg-white dark:bg-[#1E1E1E] px-2.5 py-1.5 text-sm font-medium text-gray-700 dark:text-[#C0C0C0] transition-colors hover:bg-gray-50 dark:hover:bg-[#2C2C2C] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" /></svg>
                  </button>
                  {Array.from({ length: totalPaginas }, function (_, i) { return i + 1; }).map(function (pag) {
                    return (
                      <button key={pag} onClick={function () { setPaginaActual(pag); }} className={'flex h-8 w-8 items-center justify-center rounded-lg text-sm font-semibold transition-colors cursor-pointer ' + (paginaActual === pag ? 'bg-blue-600 text-white' : 'border border-gray-300 dark:border-[#404040] bg-white dark:bg-[#1E1E1E] text-gray-700 dark:text-[#C0C0C0] hover:bg-gray-50 dark:hover:bg-[#2C2C2C]')}>{pag}</button>
                    );
                  })}
                  <button onClick={function () { setPaginaActual(function (p) { return Math.min(totalPaginas, p + 1); }); }} disabled={paginaActual === totalPaginas} className="flex items-center justify-center rounded-lg border border-gray-300 bg-white px-2.5 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" /></svg>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="col-span-3 space-y-4 overflow-y-auto">
          <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl border border-gray-200 dark:border-[#333] shadow-sm p-5">
            <h4 className="text-sm font-bold text-gray-800 dark:text-[#E0E0E0] mb-4">Actividad en Tiempo Real</h4>
            <div className="space-y-3">
              {actividadReciente.length === 0 ? (
                <p className="text-sm text-gray-400 dark:text-[#808080] text-center py-4">No hay actividad reciente</p>
              ) : (
                actividadReciente.map(function (a) {
                  return (
                    <div key={a.id} className="flex items-start gap-3">
                      <div className={'h-2.5 w-2.5 rounded-full mt-1.5 shrink-0 ' + a.color} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-700 dark:text-[#C0C0C0] truncate">{a.texto}</p>
                        <p className="text-[11px] text-gray-400 dark:text-[#808080]">{a.tiempo}</p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl border border-gray-200 dark:border-[#333] shadow-sm p-5">
            <h4 className="text-sm font-bold text-gray-800 dark:text-[#E0E0E0] mb-4">Resumen de Acciones</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-gray-50 dark:border-[#333]">
                <span className="text-sm text-gray-600 dark:text-[#B0B0B0]">Eliminaciones</span>
                <span className="text-lg font-bold text-red-600">{eliminatorias}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-50 dark:border-[#333]">
                <span className="text-sm text-gray-600 dark:text-[#B0B0B0]">Actualizaciones</span>
                <span className="text-lg font-bold text-orange-600">{actualizaciones}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-50 dark:border-[#333]">
                <span className="text-sm text-gray-600 dark:text-[#B0B0B0]">Creaciones</span>
                <span className="text-lg font-bold text-green-600">{creaciones}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-600 dark:text-[#B0B0B0]">Total registros</span>
                <span className="text-lg font-bold text-gray-800 dark:text-[#E0E0E0]">{registros.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuditoriaPage;
