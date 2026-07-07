import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { FiSun, FiMoon } from 'react-icons/fi';

var menuGroups = [
  {
    titulo: 'INICIO',
    items: [
      { to: '/dashboard', label: 'Dashboard', icono: 'M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25' },
    ],
  },
  {
    titulo: 'CLÍNICA',
    items: [
      { to: '/clientes', label: 'Clientes', icono: 'M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z' },
      { to: '/mascotas', label: 'Mascotas', icono: 'M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m7.725-9.25H5.904m7.725 0a2.25 2.25 0 0 0-2.25-2.25H5.904a2.25 2.25 0 0 0-2.25 2.25v8.25a2.25 2.25 0 0 0 2.25 2.25h2.25a2.25 2.25 0 0 0 2.25-2.25V9.75' },
      { to: '/historia-clinica', label: 'Historial', icono: 'M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z' },
      { to: '/vacunacion', label: 'Vacunas', icono: 'M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 0-6.23.693L5 14.5m14.8.8 1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0 1 12 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5' },
      { to: '/agenda', label: 'Citas', icono: 'M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5' },
    ],
  },
  {
    titulo: 'ADMINISTRACIÓN',
    items: [
      { to: '/inventario', label: 'Inventario', icono: 'M20.25 7.5l-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0-3-3m3 3 3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z' },
      { to: '/proveedores', label: 'Proveedores', icono: 'M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.15-.463 1.265-1.07l1.69-10.16A1.125 1.125 0 0 0 20.25 7.25H5.25L4.063 3.04A1.125 1.125 0 0 0 2.954 2.25H.75' },
      { to: '/personal', label: 'Personal', icono: 'M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0' },
      { to: '/facturacion', label: 'Finanzas', icono: 'M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 0 4.5 6h.75m13.5 0h.75a.75.75 0 0 0 .75-.75V4.5m-15 0v16.5a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5V4.5' },
    ],
  },
  {
    titulo: 'SISTEMA',
    items: [
      { to: '/reportes', label: 'Reportes', icono: 'M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z' },
      { to: '/auditoria', label: 'Auditoría', icono: 'M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z' },
      { to: '/configuracion', label: 'Configuración', icono: 'M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 0 1 0 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 0 1 0-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281Z' },
    ],
  },
];

function SidebarLink({ to, label, icono }) {
  return (
    <NavLink
      to={to}
      className={function ({ isActive }) {
        return 'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ' + (
          isActive
            ? 'bg-[#4A6250] text-white border-l-[3px] border-[#7FA889] pl-2.5 font-semibold'
            : 'text-emerald-100 hover:bg-[#4A6250]/50 hover:text-white'
        );
      }}
    >
      <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d={icono} />
      </svg>
      {label}
    </NavLink>
  );
}

function AppLayout() {
  var navigate = useNavigate();
  var { theme, toggleTheme } = useTheme();
  var userData = JSON.parse(localStorage.getItem('user') || '{}');
  var nombre = userData.nombreCompleto || localStorage.getItem('userName') || 'Invitado';
  var rol = userData.role || localStorage.getItem('userRole') || '';
  var iniciales = nombre.split(' ').map(function (p) { return p[0]; }).join('').substring(0, 2).toUpperCase();

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('nombreCompleto');
    localStorage.removeItem('idRol');
    localStorage.removeItem('userName');
    localStorage.removeItem('userRole');
    navigate('/login');
  }

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: 'var(--color-surface)' }}>
      <aside className="w-64 min-h-screen flex flex-col" style={{ backgroundColor: 'var(--color-sidebar)' }}>
        <div className="p-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <img src="/logo-login.png" alt="VetControl 360" className="w-10 h-10 rounded-lg object-cover" />
            <div>
              <h1 className="text-white text-lg font-bold leading-tight">VetControl</h1>
              <p className="text-emerald-300 text-[11px] font-medium">360</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-5">
          {menuGroups.map(function (group) {
            return (
              <div key={group.titulo}>
                <p className="text-[10px] font-bold text-emerald-300/60 uppercase tracking-widest mb-2 px-3">{group.titulo}</p>
                <div className="space-y-0.5">
                  {group.items.map(function (item) {
                    return <SidebarLink key={item.to} to={item.to} label={item.label} icono={item.icono} />;
                  })}
                </div>
              </div>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-9 w-9 flex items-center justify-center rounded-full bg-white/15 text-white text-xs font-bold shrink-0">{iniciales}</div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white truncate">{nombre}</p>
              {rol && <p className="text-[11px] text-emerald-300/80">{rol}</p>}
            </div>
          </div>
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 rounded-lg border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm font-medium text-red-300 transition-colors hover:bg-red-500/20 hover:text-red-200 cursor-pointer">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" /></svg>
            Cerrar Sesión
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-h-0 overflow-auto" style={{ backgroundColor: 'var(--color-surface)' }}>
        <div className="flex-none flex items-center justify-end gap-3 px-8 pt-4 pb-0">
          <button
            onClick={toggleTheme}
            className="flex items-center justify-center transition-colors cursor-pointer"
            style={{ 
              backgroundColor: 'transparent',
              border: 'none',
              padding: '4px'
            }}
            aria-label={theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
            title={theme === 'dark' ? 'Activar modo claro' : 'Activar modo oscuro'}
          >
            {theme === 'dark' ? (
              <FiMoon 
                size={23} 
                style={{ color: '#A0A0A0', transition: 'color 0.2s' }}
                className="hover:opacity-70"
              />
            ) : (
              <FiSun 
                size={23} 
                style={{ color: '#5F7B65', transition: 'color 0.2s' }}
                className="hover:opacity-70"
              />
            )}
          </button>
        </div>
        <div className="flex-1 flex flex-col min-h-0 p-8 pt-2">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default AppLayout;
