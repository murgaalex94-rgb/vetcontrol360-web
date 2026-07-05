import { useState } from 'react';

var empleadosMock = [
  { id: 1, nombre: 'Dr. Juan Pérez', cargo: 'Veterinario', email: 'juan.perez@vetcontrol.com', telefono: '+51 999 123 456', estado: 'Activo' },
  { id: 2, nombre: 'María López', cargo: 'Asistente', email: 'maria.lopez@vetcontrol.com', telefono: '+51 999 234 567', estado: 'Activo' },
  { id: 3, nombre: 'Dr. Carlos García', cargo: 'Veterinario', email: 'carlos.garcia@vetcontrol.com', telefono: '+51 999 345 678', estado: 'Activo' },
  { id: 4, nombre: 'Ana Martínez', cargo: 'Administrativo', email: 'ana.martinez@vetcontrol.com', telefono: '+51 999 456 789', estado: 'Inactivo' },
  { id: 5, nombre: 'Luis Hernández', cargo: 'Asistente', email: 'luis.hernandez@vetcontrol.com', telefono: '+51 999 567 890', estado: 'Activo' },
  { id: 6, nombre: 'Dra. Sofía Ramírez', cargo: 'Veterinario', email: 'sofia.ramirez@vetcontrol.com', telefono: '+51 999 678 901', estado: 'Inactivo' },
];

function NuevoPersonalModal({ onClose }) {
  var [form, setForm] = useState({ nombres: '', apellidos: '', dni: '', telefono: '', email: '', rol: 'Veterinario', estado: 'Activo' });

  function handleChange(e) {
    setForm(Object.assign({}, form, { [e.target.name]: e.target.value }));
  }

  function handleSubmit() {
    console.log('Nuevo Personal:', form);
    onClose();
  }

  var inputClass = 'w-full rounded-lg border border-gray-300 dark:border-[#404040] bg-white dark:bg-[#2C2C2C] px-4 py-2.5 text-sm text-gray-900 dark:text-[#E0E0E0] focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500';
  var labelClass = 'block text-sm font-medium text-gray-700 dark:text-[#C0C0C0] mb-1';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl shadow-2xl w-full max-w-2xl mx-4">
        <div className="flex items-center justify-between p-6 pb-0">
          <h2 className="text-xl font-bold text-gray-900 dark:text-[#E0E0E0]">Nuevo Personal</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#2C2C2C] text-gray-400 dark:text-[#808080] hover:text-gray-600 dark:hover:text-[#A0A0A0] transition-colors cursor-pointer">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Nombres *</label>
              <input type="text" name="nombres" value={form.nombres} onChange={handleChange} className={inputClass} placeholder="Ej: Juan Carlos" />
            </div>
            <div>
              <label className={labelClass}>Apellidos *</label>
              <input type="text" name="apellidos" value={form.apellidos} onChange={handleChange} className={inputClass} placeholder="Ej: Pérez López" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>DNI *</label>
              <input type="text" name="dni" value={form.dni} onChange={handleChange} className={inputClass} placeholder="Ej: 12345678" />
            </div>
            <div>
              <label className={labelClass}>Teléfono</label>
              <input type="text" name="telefono" value={form.telefono} onChange={handleChange} className={inputClass} placeholder="Ej: +51 999 123 456" />
            </div>
          </div>

          <div>
            <label className={labelClass}>Email *</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} className={inputClass} placeholder="Ej: correo@vetcontrol.com" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Rol *</label>
              <select name="rol" value={form.rol} onChange={handleChange} className={inputClass}>
                <option value="Veterinario">Veterinario</option>
                <option value="Asistente">Asistente</option>
                <option value="Administrativo">Administrativo</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Estado</label>
              <select name="estado" value={form.estado} onChange={handleChange} className={inputClass}>
                <option value="Activo">Activo</option>
                <option value="Inactivo">Inactivo</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 p-6 pt-2">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl border border-gray-300 dark:border-[#404040] text-sm font-medium text-gray-700 dark:text-[#C0C0C0] hover:bg-gray-50 dark:hover:bg-[#2C2C2C] transition-colors cursor-pointer">Cancelar</button>
          <button onClick={handleSubmit} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white shadow-sm transition-colors cursor-pointer" style={{ backgroundColor: '#5F7B65' }}>Guardar Personal</button>
        </div>
      </div>
    </div>
  );
}

function PersonalPage() {
  var [busqueda, setBusqueda] = useState('');
  var [filtroRol, setFiltroRol] = useState('Todos');
  var [filtroEstado, setFiltroEstado] = useState('Todos');
  var [pagina, setPagina] = useState(1);
  var [showModal, setShowModal] = useState(false);
  var porPagina = 5;

  var filtrados = empleadosMock.filter(function (e) {
    var coincideBusqueda = e.nombre.toLowerCase().includes(busqueda.toLowerCase()) || e.cargo.toLowerCase().includes(busqueda.toLowerCase());
    var coincideRol = filtroRol === 'Todos' || e.cargo === filtroRol;
    var coincideEstado = filtroEstado === 'Todos' || e.estado === filtroEstado;
    return coincideBusqueda && coincideRol && coincideEstado;
  });

  var totalPaginas = Math.ceil(filtrados.length / porPagina) || 1;
  var paginados = filtrados.slice((pagina - 1) * porPagina, pagina * porPagina);

  var totalVeterinarios = empleadosMock.filter(function (e) { return e.cargo === 'Veterinario'; }).length;
  var totalAsistentes = empleadosMock.filter(function (e) { return e.cargo === 'Asistente'; }).length;
  var totalAdmin = empleadosMock.filter(function (e) { return e.cargo === 'Administrativo'; }).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-[#E0E0E0]">Gestión de Personal</h1>
          <p className="text-sm text-gray-500 dark:text-[#909090] mt-1">Administra el equipo de trabajo de la clínica</p>
        </div>
        <button onClick={function () { setShowModal(true); }} className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors cursor-pointer" style={{ backgroundColor: '#5F7B65' }}>
          <span className="text-lg">+</span> Nuevo Personal
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-gray-200 dark:border-[#333] bg-white dark:bg-[#1E1E1E] p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-[#909090] font-medium">Total Empleados</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-[#E0E0E0] mt-1">{empleadosMock.length}</p>
            </div>
            <div className="h-11 w-11 flex items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" /></svg>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 dark:border-[#333] bg-white dark:bg-[#1E1E1E] p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-[#909090] font-medium">Veterinarios</p>
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{totalVeterinarios}</p>
            </div>
            <div className="h-11 w-11 flex items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085" /></svg>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 dark:border-[#333] bg-white dark:bg-[#1E1E1E] p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-[#909090] font-medium">Asistentes</p>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-1">{totalAsistentes}</p>
            </div>
            <div className="h-11 w-11 flex items-center justify-center rounded-xl bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" /></svg>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 dark:border-[#333] bg-white dark:bg-[#1E1E1E] p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-[#909090] font-medium">Administrativos</p>
              <p className="text-2xl font-bold text-orange-600 dark:text-orange-400 mt-1">{totalAdmin}</p>
            </div>
            <div className="h-11 w-11 flex items-center justify-center rounded-xl bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 dark:border-[#333] bg-white dark:bg-[#1E1E1E] shadow-sm">
        <div className="p-4 border-b border-gray-100 dark:border-[#333] flex flex-col sm:flex-row gap-3">
          <input type="text" placeholder="Buscar por nombre o cargo..." value={busqueda} onChange={function (e) { setBusqueda(e.target.value); setPagina(1); }} className="flex-1 rounded-lg border border-gray-300 dark:border-[#404040] bg-white dark:bg-[#2C2C2C] px-4 py-2.5 text-sm text-gray-900 dark:text-[#E0E0E0] placeholder-gray-400 dark:placeholder-[#808080] focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" />
          <select value={filtroRol} onChange={function (e) { setFiltroRol(e.target.value); setPagina(1); }} className="rounded-lg border border-gray-300 dark:border-[#404040] bg-white dark:bg-[#2C2C2C] px-3 py-2.5 text-sm text-gray-700 dark:text-[#D0D0D0] focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer">
            <option value="Todos">Todos los roles</option>
            <option value="Veterinario">Veterinario</option>
            <option value="Asistente">Asistente</option>
            <option value="Administrativo">Administrativo</option>
          </select>
          <select value={filtroEstado} onChange={function (e) { setFiltroEstado(e.target.value); setPagina(1); }} className="rounded-lg border border-gray-300 dark:border-[#404040] bg-white dark:bg-[#2C2C2C] px-3 py-2.5 text-sm text-gray-700 dark:text-[#D0D0D0] focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer">
            <option value="Todos">Todos los estados</option>
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 dark:bg-[#2C2C2C] text-left">
                <th className="px-4 py-3 font-semibold text-gray-600 dark:text-[#909090]">ID</th>
                <th className="px-4 py-3 font-semibold text-gray-600 dark:text-[#909090]">Nombre Completo</th>
                <th className="px-4 py-3 font-semibold text-gray-600 dark:text-[#909090]">Cargo / Rol</th>
                <th className="px-4 py-3 font-semibold text-gray-600 dark:text-[#909090]">Email</th>
                <th className="px-4 py-3 font-semibold text-gray-600 dark:text-[#909090]">Teléfono</th>
                <th className="px-4 py-3 font-semibold text-gray-600 dark:text-[#909090]">Estado</th>
                <th className="px-4 py-3 font-semibold text-gray-600 dark:text-[#909090]">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-[#333]">
              {paginados.length === 0 ? (
                <tr><td colSpan={7} className="px-4 py-12 text-center text-gray-400 dark:text-[#808080]">No se encontraron empleados</td></tr>
              ) : (
                paginados.map(function (emp) {
                  var esActivo = emp.estado === 'Activo';
                  return (
                    <tr key={emp.id} className="hover:bg-gray-50 dark:hover:bg-[#2C2C2C] transition-colors">
                      <td className="px-4 py-3 text-gray-500 dark:text-[#909090] font-mono">{emp.id}</td>
                      <td className="px-4 py-3 font-medium text-gray-900 dark:text-[#E0E0E0]">{emp.nombre}</td>
                      <td className="px-4 py-3 text-gray-700 dark:text-[#C0C0C0]">{emp.cargo}</td>
                      <td className="px-4 py-3 text-gray-600 dark:text-[#B0B0B0]">{emp.email}</td>
                      <td className="px-4 py-3 text-gray-600 dark:text-[#B0B0B0]">{emp.telefono}</td>
                      <td className="px-4 py-3">
                        <span className={'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ' + (esActivo ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700')}>
                          {emp.estado}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button className="p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 dark:text-blue-400 transition-colors cursor-pointer" title="Editar">✏️</button>
                          <button className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors cursor-pointer" title="Eliminar">🗑️</button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-end gap-2 p-4 border-t border-gray-100 dark:border-[#333]">
          <button onClick={function () { if (pagina > 1) setPagina(pagina - 1); }} disabled={pagina === 1} className={'px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors cursor-pointer ' + (pagina === 1 ? 'border-gray-200 dark:border-[#333] text-gray-300 dark:text-[#606060] cursor-not-allowed' : 'border-gray-300 dark:border-[#404040] text-gray-700 dark:text-[#C0C0C0] hover:bg-gray-50 dark:hover:bg-[#2C2C2C]')}>{'< Anterior'}</button>
          {Array.from({ length: totalPaginas }, function (_, i) { return i + 1; }).map(function (n) {
            return (
              <button key={n} onClick={function () { setPagina(n); }} className={'h-8 w-8 rounded-lg text-sm font-medium transition-colors cursor-pointer ' + (n === pagina ? 'bg-[#5F7B65] text-white' : 'border border-gray-300 dark:border-[#404040] text-gray-700 dark:text-[#C0C0C0] hover:bg-gray-50 dark:hover:bg-[#2C2C2C]')}>{n}</button>
            );
          })}
          <button onClick={function () { if (pagina < totalPaginas) setPagina(pagina + 1); }} disabled={pagina === totalPaginas} className={'px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors cursor-pointer ' + (pagina === totalPaginas ? 'border-gray-200 dark:border-[#333] text-gray-300 dark:text-[#606060] cursor-not-allowed' : 'border-gray-300 dark:border-[#404040] text-gray-700 dark:text-[#C0C0C0] hover:bg-gray-50 dark:hover:bg-[#2C2C2C]')}>{'Siguiente >'}</button>
        </div>
      </div>

      {showModal && <NuevoPersonalModal onClose={function () { setShowModal(false); }} />}
    </div>
  );
}

export default PersonalPage;
