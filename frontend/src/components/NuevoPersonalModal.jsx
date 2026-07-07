import { useState } from 'react';
import API from '../services/axiosConfig';

var MAPA_ROL_ID = { Administrativo: 1, Veterinario: 2, Asistente: 3 };

function NuevoPersonalModal({ onClose, onCreado, modoEdicion, data, onGuardar }) {
  var init = modoEdicion
    ? {
        nombres: (data.nombre || '').split(' ')[0] || '',
        apellidos: (data.nombre || '').split(' ').slice(1).join(' ') || '',
        dni: data.dni || '',
        telefono: data.telefono || '',
        email: data.email || '',
        password: '',
        confirmPassword: '',
        rol: data.cargo || 'Veterinario',
        estado: data.estado || 'Activo',
      }
    : { nombres: '', apellidos: '', dni: '', telefono: '', email: '', password: '', confirmPassword: '', rol: 'Veterinario', estado: 'Activo' };

  var [form, setForm] = useState(init);
  var [showPassword, setShowPassword] = useState(false);
  var [showConfirmPassword, setShowConfirmPassword] = useState(false);

  var passwordsMatch = form.password === form.confirmPassword;
  var hasRequired = form.nombres.trim() && form.apellidos.trim() && form.email.trim();
  if (!modoEdicion) hasRequired = hasRequired && form.password.trim() && form.confirmPassword.trim();
  var canSubmit = hasRequired && (modoEdicion || passwordsMatch);

  function handleChange(e) {
    setForm(Object.assign({}, form, { [e.target.name]: e.target.value }));
  }

  function handleSubmit() {
    if (!canSubmit) return;
    if (modoEdicion) {
      var payload = {
        nombreCompleto: (form.nombres + ' ' + form.apellidos).trim(),
        idRol: MAPA_ROL_ID[form.rol] || 2,
        activo: form.estado === 'Activo',
      };
      if (form.password.trim()) payload.password = form.password;
      if (onGuardar) onGuardar(data.id, payload);
      onClose();
    } else {
      API.post('/usuarios', {
        usuario: form.email,
        password: form.password,
        nombreCompleto: (form.nombres + ' ' + form.apellidos).trim(),
        idRol: MAPA_ROL_ID[form.rol] || 2,
      }).then(function () {
        if (onCreado) onCreado();
        onClose();
      }).catch(function () {
        alert('Error al crear el usuario');
      });
    }
  }

  var inputClass = 'w-full rounded-lg border border-gray-300 dark:border-[#404040] bg-white dark:bg-[#2C2C2C] px-4 py-2.5 text-sm text-gray-900 dark:text-[#E0E0E0] focus:outline-none focus:ring-2 focus:ring-[#5F7B65] focus:border-[#5F7B65]';
  var labelClass = 'block text-sm font-medium text-gray-700 dark:text-[#D0D0D0] mb-1';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl shadow-2xl w-full max-w-lg mx-4">
        <div className="flex items-center justify-between p-6 pb-0">
          <h2 className="text-xl font-bold text-gray-900 dark:text-[#E0E0E0]">{modoEdicion ? 'Editar Personal' : 'Nuevo Personal'}</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#333] text-gray-400 dark:text-[#808080] hover:text-gray-600 transition-colors cursor-pointer">
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
              <label className={labelClass}>DNI</label>
              <input type="text" name="dni" value={form.dni} onChange={handleChange} className={inputClass} placeholder="Ej: 12345678" />
            </div>
            <div>
              <label className={labelClass}>Teléfono</label>
              <input type="text" name="telefono" value={form.telefono} onChange={handleChange} className={inputClass} placeholder="Ej: +51 999 123 456" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Email *</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} className={inputClass} placeholder="correo@vetcontrol.com" />
            </div>
            <div>
              <label className={labelClass}>{modoEdicion ? 'Contraseña (opcional)' : 'Contraseña *'}</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} name="password" value={form.password} onChange={handleChange} className={inputClass + ' pr-10'} placeholder={modoEdicion ? 'Nueva contraseña' : 'Ingresa una contraseña'} />
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
              <label className={labelClass}>Confirmar Contraseña {modoEdicion ? '(opcional)' : '*'}</label>
              <div className="relative">
                <input type={showConfirmPassword ? 'text' : 'password'} name="confirmPassword" value={form.confirmPassword} onChange={handleChange} className={inputClass + ' pr-10'} placeholder="Vuelve a ingresar" />
                <button type="button" onClick={function () { setShowConfirmPassword(!showConfirmPassword); }} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-[#808080] hover:text-gray-600 dark:hover:text-[#A0A0A0] transition-colors cursor-pointer">
                  {showConfirmPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>
                  )}
                </button>
              </div>
              {form.confirmPassword && !passwordsMatch && (
                <p className="mt-1 text-xs text-red-500">Las contraseñas no coinciden</p>
              )}
            </div>
            <div>
              <label className={labelClass}>Rol *</label>
              <select name="rol" value={form.rol} onChange={handleChange} className={inputClass}>
                <option value="Veterinario">Veterinario</option>
                <option value="Asistente">Asistente</option>
                <option value="Administrativo">Administrativo</option>
              </select>
            </div>
          </div>
          <div>
            <label className={labelClass}>Estado</label>
            <select name="estado" value={form.estado} onChange={handleChange} className={inputClass}>
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
            </select>
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 p-6 pt-2">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl border border-gray-300 dark:border-[#404040] text-sm font-medium text-gray-700 dark:text-[#D0D0D0] hover:bg-gray-50 dark:hover:bg-[#2C2C2C] transition-colors cursor-pointer">Cancelar</button>
          <button onClick={handleSubmit} disabled={!canSubmit} className={'px-5 py-2.5 rounded-xl text-sm font-semibold text-white shadow-sm transition-colors cursor-pointer ' + (!canSubmit ? 'opacity-50 cursor-not-allowed' : '')} style={{ backgroundColor: '#5F7B65' }}>{modoEdicion ? 'Guardar Cambios' : 'Guardar Personal'}</button>
        </div>
      </div>
    </div>
  );
}

export default NuevoPersonalModal;
