import { useState, useEffect, useMemo, useRef } from 'react';
import API from '../services/axiosConfig';

const rolStyles = {
  Veterinario: 'bg-blue-100 text-blue-700',
  Asistente: 'bg-purple-100 text-purple-700',
  Recepcionista: 'bg-yellow-100 text-yellow-700',
  Administrador: 'bg-green-100 text-green-700',
};

var rolNameMap = { 1: 'Administrador', 2: 'Administrador', 3: 'Veterinario', 4: 'Asistente', 5: 'Recepcionista' };

var ITEMS_PER_PAGE = 6;

function NuevoUsuarioModal({ open, onClose, onCreado }) {
  const [form, setForm] = useState({
    nombre: '', usuario: '', email: '', rol: '', telefono: '', estado: '',
    contrasena: '', confirmarContrasena: '',
  });
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [fotoPreview, setFotoPreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef(null);

  if (!open) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFoto = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFotoPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const rolMap = { Veterinario: 3, Asistente: 4, Recepcionista: 5, Administrador: 2 };

  const handleSubmit = async () => {
    setError('');
    if (!form.nombre || !form.usuario || !form.contrasena || !form.rol) {
      setError('Completa todos los campos obligatorios');
      return;
    }
    if (form.contrasena !== form.confirmarContrasena) {
      setError('Las contraseñas no coinciden');
      return;
    }
    setSaving(true);
    try {
      await API.post('/usuarios', {
        usuario: form.usuario,
        password: form.contrasena,
        nombreCompleto: form.nombre,
        idRol: rolMap[form.rol] || 4,
      });
      onCreado();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al crear usuario');
    } finally {
      setSaving(false);
    }
  };

  const inputClass = "w-full px-4 py-2.5 border border-gray-300 dark:border-[#404040] rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all bg-white dark:bg-[#2C2C2C] text-gray-900 dark:text-[#E0E0E0] text-sm";
  const labelClass = "block text-sm font-medium text-gray-700 dark:text-[#C0C0C0] mb-1.5";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white dark:bg-[#1E1E1E] rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-[#333]">
          <h2 className="text-lg font-bold text-gray-800 dark:text-[#E0E0E0]">Nuevo Usuario</h2>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-[#2C2C2C] transition-colors cursor-pointer">
            <svg className="w-5 h-5 text-gray-500 dark:text-[#909090]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {error && (
          <div className="mx-6 mt-4 px-4 py-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        <div className="p-6">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-4">
              <label className={labelClass}>Foto de perfil</label>
              <div
                onClick={() => fileRef.current?.click()}
                className="border-2 border-dashed border-gray-200 dark:border-[#404040] rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors min-h-[160px]"
              >
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFoto} />
                {fotoPreview ? (
                  <img src={fotoPreview} alt="Preview" className="w-20 h-20 rounded-full object-cover mb-2" />
                ) : (
                  <>
                    <svg className="w-10 h-10 text-gray-300 dark:text-[#606060] mb-2" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Z" />
                    </svg>
                    <p className="text-sm font-medium text-gray-600 dark:text-[#B0B0B0]">Subir foto</p>
                    <p className="text-xs text-gray-400 dark:text-[#808080] mt-1">JPG, PNG o GIF. Máx. 2MB</p>
                  </>
                )}
              </div>
            </div>

            <div className="col-span-8 space-y-4">
              <div>
                <label className={labelClass}>Nombre Completo *</label>
                <input type="text" name="nombre" value={form.nombre} onChange={handleChange} placeholder="Ingrese el nombre completo" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Usuario *</label>
                <input type="text" name="usuario" value={form.usuario} onChange={handleChange} placeholder="Ingrese el nombre de usuario" className={inputClass} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Email *</label>
                  <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="usuario@vetcare.com" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Rol *</label>
                  <select name="rol" value={form.rol} onChange={handleChange} className={`${inputClass} appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22%236b7280%22%3E%3Cpath%20fill-rule%3D%22evenodd%22%20d%3D%22M5.23%207.21a.75.75%200%20011.06.02L10%2011.168l3.71-3.938a.75.75%200%20111.08%201.04l-4.25%204.5a.75.75%200%2001-1.08%200l-4.25-4.5a.75.75%200%2001.02-1.06z%22%20clip-rule%3D%22evenodd%22%20%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem] bg-[right_0.5rem_center] bg-no-repeat pr-10`}>
                    <option value="">Seleccione un rol</option>
                    <option value="Veterinario">Veterinario</option>
                    <option value="Asistente">Asistente</option>
                    <option value="Recepcionista">Recepcionista</option>
                    <option value="Administrador">Administrador</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Teléfono *</label>
                  <input type="tel" name="telefono" value={form.telefono} onChange={handleChange} placeholder="Ingrese el número de teléfono" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Estado *</label>
                  <select name="estado" value={form.estado} onChange={handleChange} className={`${inputClass} appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22%236b7280%22%3E%3Cpath%20fill-rule%3D%22evenodd%22%20d%3D%22M5.23%207.21a.75.75%200%20011.06.02L10%2011.168l3.71-3.938a.75.75%200%20111.08%201.04l-4.25%204.5a.75.75%200%2001-1.08%200l-4.25-4.5a.75.75%200%2001.02-1.06z%22%20clip-rule%3D%22evenodd%22%20%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem] bg-[right_0.5rem_center] bg-no-repeat pr-10`}>
                    <option value="">Seleccione un estado</option>
                    <option value="Activo">Activo</option>
                    <option value="Inactivo">Inactivo</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Contraseña *</label>
                  <div className="relative">
                    <input type={showPass ? 'text' : 'password'} name="contrasena" value={form.contrasena} onChange={handleChange} placeholder="Ingrese la contraseña" className={inputClass} />
                    <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-[#808080] hover:text-gray-600 dark:hover:text-[#A0A0A0] cursor-pointer">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        {showPass ? (
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                        ) : (
                          <>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                          </>
                        )}
                      </svg>
                    </button>
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Confirmar Contraseña *</label>
                  <div className="relative">
                    <input type={showConfirmPass ? 'text' : 'password'} name="confirmarContrasena" value={form.confirmarContrasena} onChange={handleChange} placeholder="Confirme la contraseña" className={inputClass} />
                    <button type="button" onClick={() => setShowConfirmPass(!showConfirmPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        {showConfirmPass ? (
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                        ) : (
                          <>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                          </>
                        )}
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 dark:border-[#333]">
          <button onClick={onClose} className="px-5 py-2.5 border border-gray-300 dark:border-[#404040] rounded-xl text-gray-700 dark:text-[#C0C0C0] text-sm font-medium hover:bg-gray-50 dark:hover:bg-[#2C2C2C] transition-colors cursor-pointer">
            Cancelar
          </button>
          <button onClick={handleSubmit} disabled={saving} className="flex items-center gap-2 px-5 py-2.5 bg-[#5F7B65] hover:bg-[#4E6553] text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-50 cursor-pointer">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM4 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 10.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
            </svg>
            {saving ? 'Guardando...' : 'Guardar Usuario'}
          </button>
        </div>
      </div>
    </div>
  );
}

var ROL_ADMIN = 1;
var userData = JSON.parse(localStorage.getItem('user') || '{}');
var idRol = userData.idRol;

function GestionUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [filtroRol, setFiltroRol] = useState('Todos');
  const [paginaActual, setPaginaActual] = useState(1);
  const [showModalNuevo, setShowModalNuevo] = useState(false);
  const [showModalEditar, setShowModalEditar] = useState(null);
  const [showModalEliminar, setShowModalEliminar] = useState(null);

  useEffect(() => {
    API.get('/usuarios').then(({ data }) => setUsuarios(data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  function cargarUsuarios() {
    API.get('/usuarios').then(({ data }) => setUsuarios(data)).catch(console.error);
  }

  var usuariosFiltrados = useMemo(() => {
    return usuarios.filter((u) => {
      var nombre = (u.nombreCompleto || u.nombre || '').toLowerCase();
      var usuario = (u.usuario || '').toLowerCase();
      var q = busqueda.toLowerCase();
      var coincideBusqueda = !q || nombre.includes(q) || usuario.includes(q);
      var rolName = rolNameMap[u.idRol] || 'Desconocido';
      var coincideRol = filtroRol === 'Todos' || rolName === filtroRol;
      return coincideBusqueda && coincideRol;
    });
  }, [usuarios, busqueda, filtroRol]);

  var totalPaginas = Math.ceil(usuariosFiltrados.length / ITEMS_PER_PAGE) || 1;
  var usuariosPagina = usuariosFiltrados.slice((paginaActual - 1) * ITEMS_PER_PAGE, paginaActual * ITEMS_PER_PAGE);
  var inicio = usuariosFiltrados.length > 0 ? (paginaActual - 1) * ITEMS_PER_PAGE + 1 : 0;
  var fin = Math.min(paginaActual * ITEMS_PER_PAGE, usuariosFiltrados.length);

  useEffect(function () { setPaginaActual(1); }, [busqueda, filtroRol]);

  var totalVeterinarios = usuarios.filter(function (u) { return u.idRol === 3; }).length;
  var totalAsistentes = usuarios.filter(function (u) { return u.idRol === 4; }).length;
  var totalAdministrativos = usuarios.filter(function (u) { return u.idRol === 1 || u.idRol === 2; }).length;

  async function handleEliminar(id) {
    try {
      await API.delete('/usuarios/' + id);
      cargarUsuarios();
    } catch (err) {
      console.error('Error al eliminar usuario:', err);
    }
    setShowModalEliminar(null);
  }

  var rolStyles = {
    Veterinario: 'bg-blue-100 text-blue-700',
    Asistente: 'bg-purple-100 text-purple-700',
    Recepcionista: 'bg-yellow-100 text-yellow-700',
    Administrador: 'bg-green-100 text-green-700',
  };

  return (
    <>
    <div className="flex flex-col h-full gap-6">
      <div className="flex flex-none items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-900/30">
            <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-[#E0E0E0]">Gesti&oacute;n de Usuarios</h1>
            <p className="text-sm text-gray-500 dark:text-[#909090]">Administra el personal que tiene acceso al sistema</p>
          </div>
        </div>
        <button onClick={function () { setShowModalNuevo(true); }} className="flex items-center gap-2 rounded-xl bg-[#5F7B65] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#4E6553] cursor-pointer">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
          Nuevo Usuario
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl bg-white border border-gray-200 shadow-sm p-5">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50">
              <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800 dark:text-[#E0E0E0]">{loading ? '...' : usuarios.length}</p>
              <p className="text-sm text-gray-500 dark:text-[#909090]">Usuarios Totales</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl bg-white border border-gray-200 shadow-sm p-5">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-900/30">
              <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
              </svg>
            </div>
            <div>
            <p className="text-2xl font-bold text-gray-800 dark:text-[#E0E0E0]">{loading ? '...' : totalVeterinarios}</p>
            <p className="text-sm text-gray-500 dark:text-[#909090]">Veterinarios</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-[#333] shadow-sm p-5">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-900/30">
              <svg className="w-6 h-6 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
              </svg>
            </div>
            <div>
            <p className="text-2xl font-bold text-gray-800 dark:text-[#E0E0E0]">{loading ? '...' : totalAsistentes}</p>
            <p className="text-sm text-gray-500 dark:text-[#909090]">Asistentes</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-[#333] shadow-sm p-5">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 dark:bg-teal-900/30">
              <svg className="w-6 h-6 text-teal-500 dark:text-teal-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
              </svg>
            </div>
            <div>
            <p className="text-2xl font-bold text-gray-800 dark:text-[#E0E0E0]">{loading ? '...' : totalAdministrativos}</p>
            <p className="text-sm text-gray-500 dark:text-[#909090]">Administrativos</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="relative flex-1 w-full">
          <svg className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
          <input type="text" value={busqueda} onChange={function (e) { setBusqueda(e.target.value); setPaginaActual(1); }} placeholder="Buscar por nombre o usuario..." className="w-full rounded-xl border border-gray-300 dark:border-[#404040] bg-white dark:bg-[#2C2C2C] pl-10 pr-4 py-2.5 text-sm text-gray-800 dark:text-[#E0E0E0] placeholder-gray-400 dark:placeholder-[#808080] transition-colors focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20" />
        </div>
        <select value={filtroRol} onChange={function (e) { setFiltroRol(e.target.value); setPaginaActual(1); }} className="rounded-xl border border-gray-300 dark:border-[#404040] bg-white dark:bg-[#2C2C2C] px-4 py-2.5 text-sm text-gray-800 dark:text-[#E0E0E0] transition-colors focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 w-full sm:w-auto">
          <option value="Todos">Todos los roles</option>
          <option value="Veterinario">Veterinario</option>
          <option value="Asistente">Asistente</option>
          <option value="Recepcionista">Recepcionista</option>
          <option value="Administrador">Administrador</option>
        </select>
      </div>

      <div className="flex-1 flex flex-col min-h-0 rounded-2xl bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-[#333] shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400 dark:text-[#808080]">Cargando usuarios...</div>
        ) : (
        <>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-[#333] bg-gray-50 dark:bg-[#2C2C2C]">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-[#909090] uppercase tracking-wider">ID</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-[#909090] uppercase tracking-wider">Nombre Completo</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-[#909090] uppercase tracking-wider">Usuario</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-[#909090] uppercase tracking-wider">Rol</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-[#909090] uppercase tracking-wider">Estado</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 dark:text-[#909090] uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-[#333]">
              {usuariosPagina.map(function (u) {
                var rolName = rolNameMap[u.idRol] || 'Desconocido';
                return (
                <tr key={u.id} className="transition-colors hover:bg-gray-50 dark:hover:bg-[#2C2C2C]">
                  <td className="px-4 py-3 text-sm text-gray-500 dark:text-[#909090] font-medium">{u.id}</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-800 dark:text-[#E0E0E0]">{u.nombreCompleto}</td>
                  <td className="px-4 py-3 text-sm text-gray-500 dark:text-[#909090]">{u.usuario}</td>
                  <td className="px-4 py-3">
                    <span className={'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ' + (rolStyles[rolName] || 'bg-gray-100 text-gray-700')}>
                      {rolName}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ' + (u.activo ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600')}>
                      {u.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-1">
                      <button onClick={function () { setShowModalEditar(u); }} className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 dark:text-[#909090] transition-colors hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer" title="Editar">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                        </svg>
                      </button>
                      {idRol === ROL_ADMIN && (
                      <button onClick={function () { setShowModalEliminar(u); }} className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 dark:text-[#909090] transition-colors hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 cursor-pointer" title="Eliminar">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                        </svg>
                      </button>
                      )}
                    </div>
                  </td>
                </tr>
                );
              })}
              {usuariosPagina.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-sm text-gray-400 dark:text-[#808080]">
                    No se encontraron usuarios.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-gray-200 dark:border-[#333] px-4 py-3">
          <p className="text-sm text-gray-500 dark:text-[#909090]">Mostrando {inicio} a {fin} de {usuariosFiltrados.length} usuarios</p>
          <div className="flex items-center gap-1">
            <button onClick={function () { setPaginaActual(Math.max(1, paginaActual - 1)); }} disabled={paginaActual === 1} className={'flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer'}>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" /></svg>
              Anterior
            </button>
            {Array.from({ length: totalPaginas }, function (_, i) { return i + 1; }).map(function (pag) {
              return (
                <button key={pag} onClick={function () { setPaginaActual(pag); }} className={'flex h-8 w-8 items-center justify-center rounded-lg text-sm font-semibold transition-colors cursor-pointer ' + (paginaActual === pag ? 'bg-[#5F7B65] text-white' : 'border border-gray-300 dark:border-[#404040] bg-white dark:bg-[#1E1E1E] text-gray-700 dark:text-[#C0C0C0] hover:bg-gray-50 dark:hover:bg-[#2C2C2C]')}>
                  {pag}
                </button>
              );
            })}
            <button onClick={function () { setPaginaActual(Math.min(totalPaginas, paginaActual + 1)); }} disabled={paginaActual === totalPaginas} className={'flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer'}>
              Siguiente
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" /></svg>
            </button>
          </div>
        </div>
        </>
        )}
      </div>
    </div>

    <NuevoUsuarioModal open={showModalNuevo} onClose={function () { setShowModalNuevo(false); }} onCreado={cargarUsuarios} />

    {showModalEliminar && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={function () { setShowModalEliminar(null); }}>
        <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl shadow-2xl w-full max-w-sm mx-4" onClick={function (e) { e.stopPropagation(); }}>
          <div className="p-6 text-center">
            <div className="mx-auto h-14 w-14 flex items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30 mb-4">
              <svg className="w-7 h-7 text-red-600" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-[#E0E0E0] mb-1">¿Eliminar usuario?</h3>
            <p className="text-sm text-gray-500 dark:text-[#909090]">¿Estás seguro de eliminar a <span className="font-semibold text-gray-900 dark:text-[#E0E0E0]">{showModalEliminar.nombreCompleto}</span>?</p>
          </div>
          <div className="flex gap-3 p-6 pt-0">
            <button onClick={function () { setShowModalEliminar(null); }} className="flex-1 py-2.5 rounded-xl border border-gray-300 dark:border-[#404040] text-sm font-medium text-gray-700 dark:text-[#D0D0D0] hover:bg-gray-50 dark:hover:bg-[#2C2C2C] transition-colors cursor-pointer">Cancelar</button>
            <button onClick={function () { handleEliminar(showModalEliminar.id); }} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors cursor-pointer">Eliminar</button>
          </div>
        </div>
      </div>
    )}
    </>
  );
}

export default GestionUsuarios;
