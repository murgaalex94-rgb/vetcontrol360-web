import { useState } from 'react';

var proveedoresMock = [
  { id: 1, nombre: 'Vet Pharma', ruc: '20123456789', rubro: 'Medicamentos', telefono: '+51 999 111 222', email: 'ventas@vetpharma.com', estado: 'Activo', direccion: 'Av. Salud 123, Lima' },
  { id: 2, nombre: 'Agrovet', ruc: '20987654321', rubro: 'Alimentos', telefono: '+51 999 333 444', email: 'pedidos@agrovet.com', estado: 'Activo', direccion: 'Jr. Veterinary 456, Arequipa' },
  { id: 3, nombre: 'Pet Care', ruc: '20567891234', rubro: 'Accesorios', telefono: '+51 999 555 666', email: 'info@petcare.com', estado: 'Activo', direccion: 'Calle Mascotas 789, Cusco' },
  { id: 4, nombre: 'AnimalHealth', ruc: '20432167890', rubro: 'Medicamentos', telefono: '+51 999 777 888', email: 'ventas@animalhealth.com', estado: 'Inactivo', direccion: 'Av. Veterinaria 321, Trujillo' },
  { id: 5, nombre: 'NutriPet', ruc: '20678912345', rubro: 'Alimentos', telefono: '+51 999 999 000', email: 'contacto@nutripet.com', estado: 'Activo', direccion: 'Calle Nutrición 654, Lima' },
];

var coloresRubro = { Medicamentos: 'bg-blue-50 text-blue-700', Alimentos: 'bg-amber-50 text-amber-700', Accesorios: 'bg-purple-50 text-purple-700', Servicios: 'bg-gray-50 text-gray-700' };

function NuevoProveedorModal({ onClose }) {
  var [form, setForm] = useState({ nombre: '', ruc: '', rubro: 'Medicamentos', telefono: '', email: '', direccion: '', estado: 'Activo' });

  function handleChange(e) {
    setForm(Object.assign({}, form, { [e.target.name]: e.target.value }));
  }

  function handleSubmit() {
    console.log('Nuevo Proveedor:', form);
    onClose();
  }

  var inputClass = 'w-full rounded-lg border border-gray-300 dark:border-[#404040] bg-white dark:bg-[#2C2C2C] px-4 py-2.5 text-sm text-gray-900 dark:text-[#E0E0E0] focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500';
  var labelClass = 'block text-sm font-medium text-gray-700 dark:text-[#C0C0C0] mb-1';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl shadow-2xl w-full max-w-2xl mx-4">
        <div className="flex items-center justify-between p-6 pb-0">
          <h2 className="text-xl font-bold text-gray-900 dark:text-[#E0E0E0]">Nuevo Proveedor</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#2C2C2C] text-gray-400 dark:text-[#808080] hover:text-gray-600 dark:hover:text-[#A0A0A0] transition-colors cursor-pointer">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Nombre Proveedor *</label>
              <input type="text" name="nombre" value={form.nombre} onChange={handleChange} className={inputClass} placeholder="Ej: Vet Pharma" />
            </div>
            <div>
              <label className={labelClass}>RUC *</label>
              <input type="text" name="ruc" value={form.ruc} onChange={handleChange} className={inputClass} placeholder="Ej: 20123456789" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Rubro *</label>
              <select name="rubro" value={form.rubro} onChange={handleChange} className={inputClass}>
                <option value="Medicamentos">Medicamentos</option>
                <option value="Alimentos">Alimentos</option>
                <option value="Accesorios">Accesorios</option>
                <option value="Servicios">Servicios</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Teléfono *</label>
              <input type="text" name="telefono" value={form.telefono} onChange={handleChange} className={inputClass} placeholder="Ej: +51 999 123 456" />
            </div>
          </div>

          <div>
            <label className={labelClass}>Email *</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} className={inputClass} placeholder="Ej: ventas@empresa.com" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Dirección</label>
              <input type="text" name="direccion" value={form.direccion} onChange={handleChange} className={inputClass} placeholder="Ej: Av. Salud 123, Lima" />
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
          <button onClick={handleSubmit} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white shadow-sm transition-colors cursor-pointer" style={{ backgroundColor: '#5F7B65' }}>Guardar Proveedor</button>
        </div>
      </div>
    </div>
  );
}

function ProveedoresPage() {
  var [busqueda, setBusqueda] = useState('');
  var [filtroEstado, setFiltroEstado] = useState('Todos');
  var [filtroRubro, setFiltroRubro] = useState('Todos');
  var [pagina, setPagina] = useState(1);
  var [showModal, setShowModal] = useState(false);
  var porPagina = 5;

  var filtrados = proveedoresMock.filter(function (p) {
    var coincideBusqueda = p.nombre.toLowerCase().includes(busqueda.toLowerCase()) || p.ruc.includes(busqueda) || p.rubro.toLowerCase().includes(busqueda.toLowerCase());
    var coincideEstado = filtroEstado === 'Todos' || p.estado === filtroEstado;
    var coincideRubro = filtroRubro === 'Todos' || p.rubro === filtroRubro;
    return coincideBusqueda && coincideEstado && coincideRubro;
  });

  var totalPaginas = Math.ceil(filtrados.length / porPagina) || 1;
  var paginados = filtrados.slice((pagina - 1) * porPagina, pagina * porPagina);

  var totalActivos = proveedoresMock.filter(function (p) { return p.estado === 'Activo'; }).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-[#E0E0E0]">Gestión de Proveedores</h1>
          <p className="text-sm text-gray-500 dark:text-[#909090] mt-1">Administra los proveedores de insumos y medicamentos</p>
        </div>
        <button onClick={function () { setShowModal(true); }} className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors cursor-pointer" style={{ backgroundColor: '#5F7B65' }}>
          <span className="text-lg">+</span> Nuevo Proveedor
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-gray-200 dark:border-[#333] bg-white dark:bg-[#1E1E1E] p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-[#909090] font-medium">Total Proveedores</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-[#E0E0E0] mt-1">{proveedoresMock.length}</p>
            </div>
            <div className="h-11 w-11 flex items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.15-.463 1.265-1.07l1.69-10.16A1.125 1.125 0 0 0 20.25 7.25H5.25L4.063 3.04A1.125 1.125 0 0 0 2.954 2.25H.75" /></svg>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 dark:border-[#333] bg-white dark:bg-[#1E1E1E] p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-[#909090] font-medium">Proveedores Activos</p>
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{totalActivos}</p>
            </div>
            <div className="h-11 w-11 flex items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 dark:border-[#333] bg-white dark:bg-[#1E1E1E] p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-[#909090] font-medium">Último Pedido</p>
              <p className="text-lg font-bold text-gray-900 dark:text-[#E0E0E0] mt-1">Hoy</p>
            </div>
            <div className="h-11 w-11 flex items-center justify-center rounded-xl bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 dark:border-[#333] bg-white dark:bg-[#1E1E1E] p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-[#909090] font-medium">Productos Suministrados</p>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-1">142</p>
            </div>
            <div className="h-11 w-11 flex items-center justify-center rounded-xl bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0-3-3m3 3 3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" /></svg>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 dark:border-[#333] bg-white dark:bg-[#1E1E1E] shadow-sm">
        <div className="p-4 border-b border-gray-100 dark:border-[#333] flex flex-col sm:flex-row gap-3">
          <input type="text" placeholder="Buscar por nombre, RUC o rubro..." value={busqueda} onChange={function (e) { setBusqueda(e.target.value); setPagina(1); }} className="flex-1 rounded-lg border border-gray-300 dark:border-[#404040] bg-white dark:bg-[#2C2C2C] px-4 py-2.5 text-sm text-gray-900 dark:text-[#E0E0E0] placeholder-gray-400 dark:placeholder-[#808080] focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" />
          <select value={filtroEstado} onChange={function (e) { setFiltroEstado(e.target.value); setPagina(1); }} className="rounded-lg border border-gray-300 dark:border-[#404040] bg-white dark:bg-[#2C2C2C] px-3 py-2.5 text-sm text-gray-700 dark:text-[#D0D0D0] focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer">
            <option value="Todos">Todos los estados</option>
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
          </select>
          <select value={filtroRubro} onChange={function (e) { setFiltroRubro(e.target.value); setPagina(1); }} className="rounded-lg border border-gray-300 dark:border-[#404040] bg-white dark:bg-[#2C2C2C] px-3 py-2.5 text-sm text-gray-700 dark:text-[#D0D0D0] focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer">
            <option value="Todos">Todos los rubros</option>
            <option value="Medicamentos">Medicamentos</option>
            <option value="Alimentos">Alimentos</option>
            <option value="Accesorios">Accesorios</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 dark:bg-[#2C2C2C] text-left">
                <th className="px-4 py-3 font-semibold text-gray-600 dark:text-[#909090]">ID</th>
                <th className="px-4 py-3 font-semibold text-gray-600 dark:text-[#909090]">Proveedor</th>
                <th className="px-4 py-3 font-semibold text-gray-600 dark:text-[#909090]">RUC</th>
                <th className="px-4 py-3 font-semibold text-gray-600 dark:text-[#909090]">Rubro</th>
                <th className="px-4 py-3 font-semibold text-gray-600 dark:text-[#909090]">Teléfono</th>
                <th className="px-4 py-3 font-semibold text-gray-600 dark:text-[#909090]">Email</th>
                <th className="px-4 py-3 font-semibold text-gray-600 dark:text-[#909090]">Estado</th>
                <th className="px-4 py-3 font-semibold text-gray-600 dark:text-[#909090]">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-[#333]">
              {paginados.length === 0 ? (
                <tr><td colSpan={8} className="px-4 py-12 text-center text-gray-400 dark:text-[#808080]">No se encontraron proveedores</td></tr>
              ) : (
                paginados.map(function (prov) {
                  var esActivo = prov.estado === 'Activo';
                  var iniciales = prov.nombre.split(' ').map(function (w) { return w[0]; }).join('').substring(0, 2).toUpperCase();
                  return (
                    <tr key={prov.id} className="hover:bg-gray-50 dark:hover:bg-[#2C2C2C] transition-colors">
                      <td className="px-4 py-3 text-gray-500 dark:text-[#909090] font-mono">{prov.id}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 flex items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-xs font-bold shrink-0">{iniciales}</div>
                          <span className="font-medium text-gray-900 dark:text-[#E0E0E0]">{prov.nombre}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600 dark:text-[#B0B0B0] font-mono text-xs">{prov.ruc}</td>
                      <td className="px-4 py-3">
                        <span className={'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ' + (coloresRubro[prov.rubro] || 'bg-gray-50 text-gray-700')}>{prov.rubro}</span>
                      </td>
                      <td className="px-4 py-3 text-gray-600 dark:text-[#B0B0B0]">{prov.telefono}</td>
                      <td className="px-4 py-3 text-gray-600 dark:text-[#B0B0B0]">{prov.email}</td>
                      <td className="px-4 py-3">
                        <span className={'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ' + (esActivo ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700')}>
                          {prov.estado}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors cursor-pointer" title="Editar">✏️</button>
                          <button className="p-1.5 rounded-lg hover:bg-red-50 text-red-600 transition-colors cursor-pointer" title="Eliminar">🗑️</button>
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

      {showModal && <NuevoProveedorModal onClose={function () { setShowModal(false); }} />}
    </div>
  );
}

export default ProveedoresPage;
