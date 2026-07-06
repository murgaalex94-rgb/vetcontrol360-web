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
      <div className="hidden lg:flex w-1/2 relative bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=1000')" }}>
        <div className="absolute inset-0 bg-gradient-to-b from-[#5F7B65]/60 via-[#5F7B65]/30 to-[#5F7B65]/70" />

        <div className="absolute top-8 left-8 flex items-center gap-3 z-10">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Z" /></svg>
          </div>
          <div>
            <p className="text-lg font-bold text-white tracking-tight">VetCare</p>
            <p className="text-[10px] text-white/70 -mt-0.5">Sistema de Gestión Veterinaria</p>
          </div>
        </div>

        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 px-12">
          <p className="text-sm font-medium text-white/80 tracking-wide uppercase">Bienvenido a</p>
          <h1 className="text-5xl font-bold text-white mt-2">VetCare</h1>
          <p className="text-base text-white/80 mt-3 text-center max-w-sm leading-relaxed">
            El sistema completo para la gestión de tu clínica veterinaria
          </p>
        </div>

        <div className="absolute bottom-8 left-6 right-6 z-10">
          <div className="bg-[#5F7B65]/80 backdrop-blur-sm rounded-2xl px-6 py-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-white/80" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" /></svg>
                <div>
                  <p className="text-xs font-semibold text-white">Seguro</p>
                  <p className="text-[10px] text-white/70">Tus datos protegidos</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-white/80" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6h16.5M3.75 12h16.5M3.75 18h16.5" /></svg>
                <div>
                  <p className="text-xs font-semibold text-white">Eficiente</p>
                  <p className="text-[10px] text-white/70">Todo en un solo lugar</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-white/80" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" /></svg>
                <div>
                  <p className="text-xs font-semibold text-white">Confiable</p>
                  <p className="text-[10px] text-white/70">Soporte profesional</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 bg-white dark:bg-[#121212] flex items-center justify-center p-8 relative">
        <div className="w-full max-w-sm">
          <div className="flex flex-col items-center mb-8">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#5F7B65]/10 mb-4">
              <svg className="w-8 h-8 text-[#5F7B65]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Z" />
              </svg>
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
