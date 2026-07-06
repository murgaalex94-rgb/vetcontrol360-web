import { useState } from 'react';

var _nextProveedorId = 6;

function generarCodigoProveedor(id) {
  var anio = new Date().getFullYear();
  var num = String(id).padStart(4, '0');
  return 'PRO-' + anio + '-' + num;
}

function NuevoProveedorModal({ onClose, onProveedorCreado }) {
  var [form, setForm] = useState({ nombre: '', ruc: '', rubro: 'Medicamentos', telefono: '', email: '', direccion: '', estado: 'Activo' });

  function handleChange(e) {
    setForm(Object.assign({}, form, { [e.target.name]: e.target.value }));
  }

  function handleSubmit() {
    var id = _nextProveedorId++;
    var nuevo = {
      id: id,
      codigo: generarCodigoProveedor(id),
      nombre: form.nombre,
      ruc: form.ruc,
      rubro: form.rubro,
      telefono: form.telefono,
      email: form.email,
      direccion: form.direccion,
      estado: form.estado,
    };
    if (onProveedorCreado) onProveedorCreado(nuevo);
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

export default NuevoProveedorModal;
