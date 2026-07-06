import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import API from '../services/axiosConfig';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    var newErrors = {};
    if (!username.trim()) newErrors.username = 'El usuario es obligatorio';
    if (!password.trim()) newErrors.password = 'La contraseña es obligatoria';
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    setLoading(true);
    try {
      const { data } = await API.post('/auth/login', { username, password });
      localStorage.setItem('token', data.token);
      const roleMap = { 1: 'Administrador', 2: 'Administrador', 3: 'Veterinario', 4: 'Asistente', 5: 'Recepcionista' };
      const name = data.nombreCompleto || data.user?.nombre || username;
      const role = roleMap[data.idRol] || data.user?.rol || 'Veterinario';
      localStorage.setItem('userName', name);
      localStorage.setItem('userRole', role);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Credenciales inválidas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full">
      <div className="hidden lg:flex w-1/2 relative bg-cover bg-center contrast-125" style={{ backgroundImage: "url('https://i.pinimg.com/1200x/eb/41/b5/eb41b535f9551bbf6f73ddd90e742b2b.jpg')" }}>
        <div className="absolute inset-0 bg-gradient-to-b from-[#5F7B65]/40 via-[#5F7B65]/20 to-[#5F7B65]/50" />

        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 px-12">
          <h1 className="text-5xl font-bold text-white">VetControl 360</h1>
          <p className="text-base text-white/80 mt-3 text-center max-w-sm leading-relaxed">
            Sistema de Gestión Veterinaria
          </p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 bg-white dark:bg-[#121212] flex items-center justify-center p-8 relative">
        <div className="w-full max-w-sm">
          <div className="flex flex-col items-center mb-8">
            <div className="mb-6">
              <img src="/logo-login.png" alt="VetControl 360" className="w-44 h-auto" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-[#E0E0E0]">Iniciar Sesión</h1>
            <p className="text-sm text-gray-500 dark:text-[#909090] mt-1">Ingresa tus credenciales para continuar</p>
          </div>

          {error && (
            <p className="text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 mb-4 text-sm text-center">{error}</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-[#E0E0E0] mb-1.5">Usuario</label>
              <div className="relative">
                <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-[#808080]" />
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className={'w-full pl-11 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all bg-gray-50/50 dark:bg-[#2C2C2C] text-gray-900 dark:text-[#E0E0E0] placeholder-gray-400 dark:placeholder-[#808080] text-sm ' + (errors.username ? 'border-red-400 dark:border-red-500' : 'border-gray-300 dark:border-[#404040]')} placeholder="Usuario" />
              </div>
              {errors.username && <p className="text-red-500 dark:text-red-400 text-xs mt-1">{errors.username}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-[#E0E0E0] mb-1.5">Contraseña</label>
              <div className="relative">
                <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-[#808080]" />
                <input type={showPass ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} className={'w-full pl-11 pr-11 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all bg-gray-50/50 dark:bg-[#2C2C2C] text-gray-900 dark:text-[#E0E0E0] placeholder-gray-400 dark:placeholder-[#808080] text-sm ' + (errors.password ? 'border-red-400 dark:border-red-500' : 'border-gray-300 dark:border-[#404040]')} placeholder="Contraseña" />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-[#808080] hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer">
                  {showPass ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 dark:text-red-400 text-xs mt-1">{errors.password}</p>}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 dark:border-[#404040] accent-[#5F7B65] focus:ring-emerald-500 bg-white dark:bg-[#2C2C2C]" />
                <span className="text-sm text-gray-500 dark:text-[#909090]">Recordarme</span>
              </label>
              <button type="button" className="text-sm font-medium text-[#5F7B65] dark:text-[#7FA389] hover:text-[#5F7B65]/80 dark:hover:text-[#7FA389]/80 transition-colors cursor-pointer">¿Olvidaste tu contraseña?</button>
            </div>

            <button type="submit" disabled={loading} className="w-full bg-[#5F7B65] hover:bg-[#4D6B53] disabled:opacity-50 text-white font-semibold py-3 px-4 rounded-lg transition-colors cursor-pointer text-sm">
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>
          </form>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-gray-200 dark:bg-[#333]" />
            <span className="text-sm text-gray-500 dark:text-[#909090]">o</span>
            <div className="flex-1 h-px bg-gray-200 dark:bg-[#333]" />
          </div>

          <button type="button" onClick={function () { console.log('Redirigiendo a Google...'); }} className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 dark:border-[#404040] rounded-lg text-sm font-medium text-gray-900 dark:text-[#E0E0E0] hover:bg-gray-50 dark:hover:bg-[#2C2C2C] transition-colors cursor-pointer">
            <FcGoogle className="w-5 h-5" />
            Continuar con Google
          </button>

          <p className="text-center mt-6 text-sm">
            <span className="text-gray-500 dark:text-[#909090]">¿No tienes una cuenta? </span>
            <span className="text-[#5F7B65] dark:text-[#7FA389] font-medium cursor-pointer hover:text-[#5F7B65]/80 dark:hover:text-[#7FA389]/80">Contacta al administrador</span>
          </p>
        </div>

        <div className="absolute bottom-6 left-0 right-0 flex justify-center">
          <div className="flex items-center gap-1.5 text-[11px] text-gray-500 dark:text-[#909090]">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" /></svg>
            Sistema protegido con encriptación SSL
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
