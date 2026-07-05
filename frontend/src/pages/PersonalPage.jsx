import { useState } from 'react';
import * as XLSX from 'xlsx';

function generarCodigoPersonal(index) {
  var year = new Date().getFullYear();
  var num = String(index + 1).padStart(4, '0');
  return 'PER-' + year + '-' + num;
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  var d = new Date(dateStr);
  return d.toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function getInitials(name) {
  var parts = name.trim().split(/\s+/);
  var first = parts[0] || '';
  var second = parts[1] || '';
  return (first.charAt(0) + second.charAt(0)).toUpperCase();
}

function ModalDetallesPersonal({ empleado, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl shadow-xl w-full max-w-lg mx-4" onClick={function (e) { e.stopPropagation(); }}>
        <div className="flex items-center justify-between p-6 pb-0">
          <h2 className="text-xl font-bold text-gray-900 dark:text-[#E0E0E0]">Detalles del Empleado</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#333] text-gray-400 dark:text-[#808080] hover:text-gray-600 transition-colors cursor-pointer">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div className="bg-gray-50 dark:bg-[#2C2C2C] rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 flex items-center justify-center rounded-full bg-[#5F7B65] text-white font-bold text-sm">{getInitials(empleado.nombre)}</div>
              <div>
                <p className="font-bold text-gray-900 dark:text-[#E0E0E0]">{empleado.nombre}</p>
                <p className="text-sm text-gray-500 dark:text-[#909090]">{empleado.codigo}</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><p className="text-xs text-gray-500 dark:text-[#909090] font-medium">Código</p><p className="text-sm font-semibold text-gray-900 dark:text-[#E0E0E0]">{empleado.codigo}</p></div>
            <div><p className="text-xs text-gray-500 dark:text-[#909090] font-medium">Estado</p><span className={'inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ' + (empleado.estado === 'Activo' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300')}>{empleado.estado}</span></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><p className="text-xs text-gray-500 dark:text-[#909090] font-medium">Nombre</p><p className="text-sm font-semibold text-gray-900 dark:text-[#E0E0E0]">{empleado.nombre}</p></div>
            <div><p className="text-xs text-gray-500 dark:text-[#909090] font-medium">Cargo</p><p className="text-sm font-semibold text-gray-900 dark:text-[#E0E0E0]">{empleado.cargo}</p></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><p className="text-xs text-gray-500 dark:text-[#909090] font-medium">Email</p><p className="text-sm font-semibold text-gray-900 dark:text-[#E0E0E0]">{empleado.email || '—'}</p></div>
            <div><p className="text-xs text-gray-500 dark:text-[#909090] font-medium">Teléfono</p><p className="text-sm font-semibold text-gray-900 dark:text-[#E0E0E0]">{empleado.telefono || '—'}</p></div>
          </div>
          <div><p className="text-xs text-gray-500 dark:text-[#909090] font-medium">Fecha de Ingreso</p><p className="text-sm font-semibold text-gray-900 dark:text-[#E0E0E0]">{formatDate(empleado.fechaIngreso)}</p></div>
        </div>
        <div className="p-6 pt-0">
          <button onClick={onClose} className="w-full py-2.5 border border-gray-300 dark:border-[#404040] rounded-xl text-sm font-medium text-gray-700 dark:text-[#D0D0D0] hover:bg-gray-50 dark:hover:bg-[#2C2C2C] transition-colors cursor-pointer">Cerrar</button>
        </div>
      </div>
    </div>
  );
}

function NuevoPersonalModal({ onClose }) {
  var [form, setForm] = useState({ nombres: '', apellidos: '', dni: '', telefono: '', email: '', password: '', rol: 'Veterinario', estado: 'Activo' });
  var [showPassword, setShowPassword] = useState(false);
  var [foto, setFoto] = useState(null);
  var [dragOver, setDragOver] = useState(false);

  function handleChange(e) {
    setForm(Object.assign({}, form, { [e.target.name]: e.target.value }));
  }

  function handleSubmit() {
    onClose();
  }

  function handleFotoDrop(e) {
    e.preventDefault();
    setDragOver(false);
    var file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      var reader = new FileReader();
      reader.onload = function (ev) { setFoto(ev.target.result); };
      reader.readAsDataURL(file);
    }
  }

  function handleFotoDragOver(e) {
    e.preventDefault();
    setDragOver(true);
  }

  function handleFotoDragLeave(e) {
    e.preventDefault();
    setDragOver(false);
  }

  var inputClass = 'w-full rounded-lg border border-gray-300 dark:border-[#404040] bg-white dark:bg-[#2C2C2C] px-4 py-2.5 text-sm text-gray-900 dark:text-[#E0E0E0] focus:outline-none focus:ring-2 focus:ring-[#5F7B65] focus:border-[#5F7B65]';
  var labelClass = 'block text-sm font-medium text-gray-700 dark:text-[#D0D0D0] mb-1';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl shadow-2xl w-full max-w-2xl mx-4">
        <div className="flex items-center justify-between p-6 pb-0">
          <h2 className="text-xl font-bold text-gray-900 dark:text-[#E0E0E0]">Nuevo Personal</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#333] text-gray-400 dark:text-[#808080] hover:text-gray-600 transition-colors cursor-pointer">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex gap-6">
            <div className="flex-shrink-0">
              <label className={labelClass}>Foto</label>
              <div
                onDrop={handleFotoDrop}
                onDragOver={handleFotoDragOver}
                onDragLeave={handleFotoDragLeave}
                onClick={function () { document.getElementById('foto-input-nuevo').click(); }}
                className={'relative flex flex-col items-center justify-center w-32 h-32 rounded-xl border-2 border-dashed cursor-pointer transition-colors ' + (dragOver ? 'border-[#5F7B65] bg-[#5F7B65]/5' : 'border-gray-300 dark:border-[#404040] hover:border-gray-400 dark:hover:border-[#606060]')}
              >
                {foto ? (
                  <img src={foto} alt="Preview" className="w-full h-full object-cover rounded-xl" />
                ) : (
                  <>
                    <svg className="w-8 h-8 text-gray-400 dark:text-[#808080] mb-1" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Z" /></svg>
                    <span className="text-xs text-gray-400 dark:text-[#808080] text-center leading-tight px-1">Subir Foto<br />(Opcional)</span>
                  </>
                )}
                <input id="foto-input-nuevo" type="file" accept="image/*" className="hidden" onChange={handleFotoDrop} />
              </div>
            </div>

            <div className="flex-1 space-y-4">
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
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Email *</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} className={inputClass} placeholder="Ej: correo@vetcontrol.com" />
            </div>
            <div>
              <label className={labelClass}>Contraseña *</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} name="password" value={form.password} onChange={handleChange} className={inputClass + ' pr-10'} placeholder="Ingresa una contraseña segura" />
                <button type="button" onClick={function () { setShowPassword(!showPassword); }} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-[#808080] hover:text-gray-600 dark:hover:text-[#A0A0A0] transition-colors cursor-pointer">
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>
                  )}
                </button>
              </div>
            </div>
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
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl border border-gray-300 dark:border-[#404040] text-sm font-medium text-gray-700 dark:text-[#D0D0D0] hover:bg-gray-50 dark:hover:bg-[#2C2C2C] transition-colors cursor-pointer">Cancelar</button>
          <button onClick={handleSubmit} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white shadow-sm transition-colors cursor-pointer" style={{ backgroundColor: '#5F7B65' }}>Guardar Personal</button>
        </div>
      </div>
    </div>
  );
}

function ModalFiltroAvanzado({ open, onClose, filtrosActuales, onAplicar }) {
  var [fechaIngresoDesde, setFechaIngresoDesde] = useState(filtrosActuales.fechaIngresoDesde || '');
  var [fechaIngresoHasta, setFechaIngresoHasta] = useState(filtrosActuales.fechaIngresoHasta || '');
  var [edadDesde, setEdadDesde] = useState(filtrosActuales.edadDesde || '');
  var [edadHasta, setEdadHasta] = useState(filtrosActuales.edadHasta || '');
  var [estado, setEstado] = useState(filtrosActuales.estado || 'Todos');

  if (!open) return null;

  function handleAplicar() {
    onAplicar({ fechaIngresoDesde: fechaIngresoDesde, fechaIngresoHasta: fechaIngresoHasta, edadDesde: edadDesde, edadHasta: edadHasta, estado: estado });
    onClose();
  }

  function handleLimpiar() {
    setFechaIngresoDesde(''); setFechaIngresoHasta(''); setEdadDesde(''); setEdadHasta(''); setEstado('Todos');
    onAplicar({ fechaIngresoDesde: '', fechaIngresoHasta: '', edadDesde: '', edadHasta: '', estado: 'Todos' });
    onClose();
  }

  var inputClass = "w-full px-4 py-2.5 border border-gray-300 dark:border-[#404040] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5F7B65] focus:border-[#5F7B65] bg-white dark:bg-[#2C2C2C] text-gray-900 dark:text-[#E0E0E0]";
  var labelClass = "block text-sm font-medium text-gray-700 dark:text-[#D0D0D0] mb-1.5";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl shadow-2xl w-full max-w-md mx-4" onClick={function (e) { e.stopPropagation(); }}>
        <div className="flex items-center justify-between p-6 pb-0">
          <h2 className="text-xl font-bold text-gray-900 dark:text-[#E0E0E0]">Filtro Avanzado</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#333] text-gray-400 dark:text-[#808080] hover:text-gray-600 transition-colors cursor-pointer">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="p-6 space-y-5">
          <div>
            <label className={labelClass}>Fecha de Ingreso</label>
            <div className="grid grid-cols-2 gap-3">
              <input type="date" value={fechaIngresoDesde} onChange={function (e) { setFechaIngresoDesde(e.target.value); }} className={inputClass} placeholder="Desde" />
              <input type="date" value={fechaIngresoHasta} onChange={function (e) { setFechaIngresoHasta(e.target.value); }} className={inputClass} placeholder="Hasta" />
            </div>
          </div>
          <div>
            <label className={labelClass}>Rango de Edad</label>
            <div className="grid grid-cols-2 gap-3">
              <input type="number" value={edadDesde} onChange={function (e) { setEdadDesde(e.target.value); }} className={inputClass} placeholder="Edad mín" min="0" />
              <input type="number" value={edadHasta} onChange={function (e) { setEdadHasta(e.target.value); }} className={inputClass} placeholder="Edad máx" min="0" />
            </div>
          </div>
          <div>
            <label className={labelClass}>Estado</label>
            <select value={estado} onChange={function (e) { setEstado(e.target.value); }} className={inputClass + " cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22%236b7280%22%3E%3Cpath%20fill-rule%3D%22evenodd%22%20d%3D%22M5.23%207.21a.75.75%200%20011.06.02L10%2011.168l3.71-3.938a.75.75%200%20111.08%201.04l-4.25%204.5a.75.75%200%2001-1.08%200l-4.25-4.5a.75.75%200%2001.02-1.06z%22%20clip-rule%3D%22evenodd%22%20%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem] bg-[right_0.5rem_center] bg-no-repeat pr-10"}>
              <option value="Todos">Todos</option>
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
            </select>
          </div>
        </div>
        <div className="flex items-center justify-between gap-3 p-6 pt-0">
          <button onClick={handleLimpiar} className="px-5 py-2.5 rounded-xl border border-gray-300 dark:border-[#404040] text-sm font-medium text-gray-700 dark:text-[#D0D0D0] hover:bg-gray-50 dark:hover:bg-[#2C2C2C] transition-colors cursor-pointer">Limpiar Filtros</button>
          <div className="flex gap-3">
            <button onClick={onClose} className="px-5 py-2.5 rounded-xl border border-gray-300 dark:border-[#404040] text-sm font-medium text-gray-700 dark:text-[#D0D0D0] hover:bg-gray-50 dark:hover:bg-[#2C2C2C] transition-colors cursor-pointer">Cancelar</button>
            <button onClick={handleAplicar} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white shadow-sm transition-colors cursor-pointer" style={{ backgroundColor: '#5F7B65' }}>Aplicar Filtros</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ModalEditarPersonal({ empleado, onClose, onGuardar }) {
  var [form, setForm] = useState({
    nombre: empleado.nombre || '',
    telefono: empleado.telefono || '',
    email: empleado.email || '',
    cargo: empleado.cargo || 'Veterinario',
    estado: empleado.estado || 'Activo',
  });
  var inputClass = 'w-full rounded-lg border border-gray-300 dark:border-[#404040] bg-white dark:bg-[#2C2C2C] px-4 py-2.5 text-sm text-gray-900 dark:text-[#E0E0E0] focus:outline-none focus:ring-2 focus:ring-[#5F7B65] focus:border-[#5F7B65]';
  var labelClass = 'block text-sm font-medium text-gray-700 dark:text-[#D0D0D0] mb-1';

  function handleChange(e) {
    setForm(Object.assign({}, form, { [e.target.name]: e.target.value }));
  }

  function handleSubmit() {
    onGuardar(empleado.id, form);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl shadow-2xl w-full max-w-2xl mx-4" onClick={function (e) { e.stopPropagation(); }}>
        <div className="flex items-center justify-between p-6 pb-0">
          <h2 className="text-xl font-bold text-gray-900 dark:text-[#E0E0E0]">Editar Empleado</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#333] text-gray-400 dark:text-[#808080] hover:text-gray-600 transition-colors cursor-pointer">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className={labelClass}>Nombre Completo</label>
            <input type="text" name="nombre" value={form.nombre} onChange={handleChange} className={inputClass} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Teléfono</label>
              <input type="text" name="telefono" value={form.telefono} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Email</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} className={inputClass} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Cargo / Rol</label>
              <select name="cargo" value={form.cargo} onChange={handleChange} className={inputClass}>
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
        <div className="flex items-center justify-end gap-3 p-6 pt-0">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl border border-gray-300 dark:border-[#404040] text-sm font-medium text-gray-700 dark:text-[#D0D0D0] hover:bg-gray-50 dark:hover:bg-[#2C2C2C] transition-colors cursor-pointer">Cancelar</button>
          <button onClick={handleSubmit} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white shadow-sm transition-colors cursor-pointer" style={{ backgroundColor: '#5F7B65' }}>Guardar Cambios</button>
        </div>
      </div>
    </div>
  );
}

function ModalEliminarPersonal({ empleado, onClose, onConfirmar }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl shadow-2xl w-full max-w-sm mx-4" onClick={function (e) { e.stopPropagation(); }}>
        <div className="p-6 text-center">
          <div className="mx-auto h-14 w-14 flex items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30 mb-4">
            <svg className="w-7 h-7 text-red-600" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-[#E0E0E0] mb-1">¿Eliminar empleado?</h3>
          <p className="text-sm text-gray-500 dark:text-[#909090]">¿Estás seguro de que deseas eliminar a <span className="font-semibold text-gray-900 dark:text-[#E0E0E0]">{empleado.nombre}</span>? Esta acción no se puede deshacer.</p>
        </div>
        <div className="flex gap-3 p-6 pt-0">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-300 dark:border-[#404040] text-sm font-medium text-gray-700 dark:text-[#D0D0D0] hover:bg-gray-50 dark:hover:bg-[#2C2C2C] transition-colors cursor-pointer">Cancelar</button>
          <button onClick={function () { onConfirmar(empleado.id); onClose(); }} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors cursor-pointer">Eliminar</button>
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
  var [showModalNuevo, setShowModalNuevo] = useState(false);
  var [showModalDetalles, setShowModalDetalles] = useState(null);
  var [showModalEditar, setShowModalEditar] = useState(null);
  var [showModalEliminar, setShowModalEliminar] = useState(null);
  var [showModalFiltro, setShowModalFiltro] = useState(false);
  var [filtrosAvanzados, setFiltrosAvanzados] = useState({ fechaIngresoDesde: '', fechaIngresoHasta: '', edadDesde: '', edadHasta: '', estado: 'Todos' });
  var [empleados, setEmpleados] = useState(function () {
    var raw = [
      { nombre: 'Dr. Juan Pérez', cargo: 'Veterinario', email: 'juan.perez@vetcontrol.com', telefono: '+51 999 123 456', estado: 'Activo', fechaIngreso: '2024-01-15' },
      { nombre: 'María López', cargo: 'Asistente', email: 'maria.lopez@vetcontrol.com', telefono: '+51 999 234 567', estado: 'Activo', fechaIngreso: '2024-03-10' },
      { nombre: 'Dr. Carlos García', cargo: 'Veterinario', email: 'carlos.garcia@vetcontrol.com', telefono: '+51 999 345 678', estado: 'Activo', fechaIngreso: '2023-11-20' },
      { nombre: 'Ana Martínez', cargo: 'Administrativo', email: 'ana.martinez@vetcontrol.com', telefono: '+51 999 456 789', estado: 'Inactivo', fechaIngreso: '2025-06-01' },
      { nombre: 'Luis Hernández', cargo: 'Asistente', email: 'luis.hernandez@vetcontrol.com', telefono: '+51 999 567 890', estado: 'Activo', fechaIngreso: '2024-08-12' },
      { nombre: 'Dra. Sofía Ramírez', cargo: 'Veterinario', email: 'sofia.ramirez@vetcontrol.com', telefono: '+51 999 678 901', estado: 'Inactivo', fechaIngreso: '2025-02-25' },
    ];
    return raw.map(function (emp, i) {
      return Object.assign({}, emp, { id: i + 1, codigo: generarCodigoPersonal(i) });
    });
  });
  var porPagina = 5;

  function aplicarFiltrosAvanzados(lista) {
    var f = filtrosAvanzados;
    return lista.filter(function (e) {
      if (f.fechaIngresoDesde && e.fechaIngreso && e.fechaIngreso < f.fechaIngresoDesde) return false;
      if (f.fechaIngresoHasta && e.fechaIngreso && e.fechaIngreso > f.fechaIngresoHasta) return false;
      if (f.estado !== 'Todos' && e.estado !== f.estado) return false;
      return true;
    });
  }

  var filtrados = aplicarFiltrosAvanzados(empleados).filter(function (e) {
    var coincideBusqueda = e.nombre.toLowerCase().includes(busqueda.toLowerCase()) || e.cargo.toLowerCase().includes(busqueda.toLowerCase());
    var coincideRol = filtroRol === 'Todos' || e.cargo === filtroRol;
    var coincideEstado = filtroEstado === 'Todos' || e.estado === filtroEstado;
    return coincideBusqueda && coincideRol && coincideEstado;
  });

  var totalPaginas = Math.ceil(filtrados.length / porPagina) || 1;
  var paginados = filtrados.slice((pagina - 1) * porPagina, pagina * porPagina);

  var totalVeterinarios = empleados.filter(function (e) { return e.cargo === 'Veterinario'; }).length;
  var totalAsistentes = empleados.filter(function (e) { return e.cargo === 'Asistente'; }).length;
  var totalAdmin = empleados.filter(function (e) { return e.cargo === 'Administrativo'; }).length;

  function handleGuardarEmpleado(id, datos) {
    setEmpleados(empleados.map(function (e) {
      return e.id === id ? Object.assign({}, e, datos) : e;
    }));
  }

  function handleEliminarEmpleado(id) {
    setEmpleados(empleados.filter(function (e) { return e.id !== id; }));
  }

  function exportarExcel() {
    var datos = filtrados.map(function (e) {
      return {
        Codigo: e.codigo,
        Nombre: e.nombre,
        Cargo: e.cargo,
        Email: e.email || '',
        Telefono: e.telefono || '',
        Estado: e.estado,
      };
    });
    var wb = XLSX.utils.book_new();
    var ws = XLSX.utils.json_to_sheet(datos);
    XLSX.utils.book_append_sheet(wb, ws, 'Personal');
    var fecha = new Date().toISOString().split('T')[0];
    XLSX.writeFile(wb, 'Personal_' + fecha + '.xlsx');
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-[#E0E0E0]">Gestión de Personal</h1>
          <p className="text-sm text-gray-500 dark:text-[#909090] mt-1">Administra el equipo de trabajo de la clínica</p>
        </div>
        <button onClick={function () { setShowModalNuevo(true); }} className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors cursor-pointer" style={{ backgroundColor: '#5F7B65' }}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
          Nuevo Personal
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-gray-200 dark:border-[#333] bg-white dark:bg-[#1E1E1E] p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-[#909090] font-medium">Total Empleados</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-[#E0E0E0] mt-1">{empleados.length}</p>
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
          <button onClick={function () { setShowModalFiltro(true); }} className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 dark:border-[#404040] rounded-lg text-sm font-medium text-gray-700 dark:text-[#D0D0D0] hover:bg-gray-50 dark:hover:bg-[#2C2C2C] transition-colors cursor-pointer">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.3 48.3 0 0 1 12 3Z" /></svg>
            Filtro Avanzado
          </button>
          <button onClick={exportarExcel} className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 dark:border-[#404040] rounded-lg text-sm font-medium text-gray-700 dark:text-[#D0D0D0] hover:bg-gray-50 dark:hover:bg-[#2C2C2C] transition-colors cursor-pointer">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
            Exportar
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 dark:bg-[#2C2C2C] text-left">
                <th className="px-4 py-3 font-semibold text-gray-600 dark:text-[#909090]">Código</th>
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
                      <td className="px-4 py-3 text-gray-500 dark:text-[#909090] font-mono text-xs">{emp.codigo}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 flex items-center justify-center rounded-full bg-[#5F7B65] text-white text-xs font-bold shrink-0">{emp.nombre.charAt(0)}</div>
                          <span className="font-medium text-gray-900 dark:text-[#E0E0E0]">{emp.nombre}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-700 dark:text-[#C0C0C0]">{emp.cargo}</td>
                      <td className="px-4 py-3 text-gray-600 dark:text-[#B0B0B0]">{emp.email}</td>
                      <td className="px-4 py-3 text-gray-600 dark:text-[#B0B0B0]">{emp.telefono}</td>
                      <td className="px-4 py-3">
                        <span className={'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ' + (esActivo ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' : 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300')}>
                          {emp.estado}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-1">
                          <button onClick={function () { setShowModalDetalles(emp); }} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-500 hover:text-blue-700 transition-colors cursor-pointer" title="Ver Detalles">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>
                          </button>
                          <button onClick={function () { setShowModalEditar(emp); }} className="p-1.5 rounded-lg hover:bg-amber-50 text-amber-500 hover:text-amber-700 transition-colors cursor-pointer" title="Editar">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" /></svg>
                          </button>
                          <button onClick={function () { setShowModalEliminar(emp); }} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 hover:text-red-700 transition-colors cursor-pointer" title="Eliminar">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>
                          </button>
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

      {showModalNuevo && <NuevoPersonalModal onClose={function () { setShowModalNuevo(false); }} />}
      {showModalDetalles && <ModalDetallesPersonal empleado={showModalDetalles} onClose={function () { setShowModalDetalles(null); }} />}
      {showModalEditar && <ModalEditarPersonal empleado={showModalEditar} onClose={function () { setShowModalEditar(null); }} onGuardar={handleGuardarEmpleado} />}
      {showModalEliminar && <ModalEliminarPersonal empleado={showModalEliminar} onClose={function () { setShowModalEliminar(null); }} onConfirmar={handleEliminarEmpleado} />}
      <ModalFiltroAvanzado open={showModalFiltro} onClose={function () { setShowModalFiltro(false); }} filtrosActuales={filtrosAvanzados} onAplicar={setFiltrosAvanzados} />
    </div>
  );
}

export default PersonalPage;
