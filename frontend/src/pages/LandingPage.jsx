import { useNavigate } from 'react-router-dom';

var PRIMARY = '#5F7B65';
var PRIMARY_DARK = '#4A6250';
var DARK = '#1E293B';
var GRAY = '#64748B';
var BG = '#F9FAFB';

var navLinks = [
  { label: 'Inicio', href: '#inicio' },
  { label: 'Características', href: '#caracteristicas' },
  { label: 'Precios', href: '#precios' },
  { label: 'Noticias', href: '#' },
];

var features = [
  { icon: '📅', title: '40% menos citas perdidas', desc: 'Reservas online y recordatorios automáticos.' },
  { icon: '🏥', title: 'Hasta 3 horas menos en tareas administrativas', desc: 'La IA completa historias clínicas.' },
  { icon: '📦', title: 'Inventario actualizado automáticamente', desc: 'Menos errores de stock.' },
  { icon: '📊', title: 'Decisiones más rápidas con datos en tiempo real', desc: 'Reportes claros para todo el equipo.' },
];

function Navbar() {
  var navigate = useNavigate();

  return (
    <nav className="flex items-center justify-between px-8 py-4 max-w-7xl mx-auto w-full">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: PRIMARY }}>
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15a2.25 2.25 0 0 1 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
          </svg>
        </div>
        <span className="text-xl font-bold" style={{ color: DARK }}>VetControl 360</span>
      </div>

      <div className="hidden md:flex items-center gap-8">
        {navLinks.map(function (link) {
          return (
            <a key={link.label} href={link.href} className="text-sm font-medium transition-colors hover:opacity-80" style={{ color: DARK }}>
              {link.label}
            </a>
          );
        })}
      </div>

      <div className="flex items-center gap-3">
        <button onClick={function () { navigate('/login'); }} className="px-5 py-2.5 rounded-xl text-sm font-semibold border transition-colors cursor-pointer" style={{ backgroundColor: '#FFFFFF', borderColor: '#D1D5DB', color: DARK }}>
          Iniciar sesión
        </button>
        <button onClick={function () { navigate('/contacto'); }} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors cursor-pointer" style={{ backgroundColor: PRIMARY }}>
          Agenda una demo
        </button>
      </div>
    </nav>
  );
}

function HeroVisual() {
  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="bg-white rounded-xl shadow-2xl p-3 max-w-lg mx-auto border border-gray-100">
        <img src="/logo-login.png" alt="VetControl 360 Dashboard" className="w-full rounded-lg" />
      </div>
    </div>
  );
}

function Hero() {
  var navigate = useNavigate();

  return (
    <section id="inicio" className="flex-1 flex items-center px-8 max-w-7xl mx-auto w-full">
      <div className="grid md:grid-cols-2 gap-12 items-center w-full">
        <div className="space-y-6">
          <span className="inline-block text-xs font-bold tracking-[0.15em] px-4 py-2 rounded-full" style={{ backgroundColor: '#F1F5F9', color: PRIMARY }}>
            EL SOFTWARE VETERINARIO QUE TU CLÍNICA NECESITA
          </span>

          <h1 className="text-4xl md:text-5xl font-bold leading-tight" style={{ color: DARK }}>
            Gestiona todas las áreas de tu veterinaria desde un solo lugar
          </h1>

          <p className="text-lg" style={{ color: GRAY }}>
            Automatiza tareas, organiza tu equipo y mejora la experiencia de tus pacientes.
          </p>

          <button onClick={function () { navigate('/contacto'); }} className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-lg font-semibold text-white shadow-lg transition-all hover:opacity-90 cursor-pointer" style={{ backgroundColor: PRIMARY }}>
            Agenda una demo
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </button>
        </div>

        <div className="flex justify-center">
          <HeroVisual />
        </div>
      </div>
    </section>
  );
}

function Features() {
  return (
    <section id="caracteristicas" className="px-8 py-20 max-w-7xl mx-auto w-full">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-12" style={{ color: DARK }}>
        Una veterinaria más organizada — y un equipo que ama lo que hace.
      </h2>
      <div className="grid md:grid-cols-4 gap-6">
        {features.map(function (f, i) {
          return (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="text-3xl mb-4">{f.icon}</div>
              <h3 className="text-base font-bold mb-2" style={{ color: DARK }}>{f.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: GRAY }}>{f.desc}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function Pricing() {
  return (
    <section id="precios" className="px-8 py-20 max-w-7xl mx-auto w-full">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-4" style={{ color: DARK }}>
        Planes para cada clínica
      </h2>
      <p className="text-lg text-center mb-12" style={{ color: GRAY }}>
        Desde clínicas pequeñas hasta grandes hospitales.
      </p>
      <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {[
          { name: 'Básico', price: 'Gratis', desc: 'Para empezar', features: ['Hasta 50 pacientes', '1 veterinario', 'Agenda básica'] },
          { name: 'Profesional', price: 'S/ 89', desc: '/mes', features: ['Pacientes ilimitados', 'Hasta 5 veterinarios', 'Historial clínico IA', 'Reportes'] },
          { name: 'Enterprise', price: 'S/ 199', desc: '/mes', features: ['Todo lo de Profesional', 'Personal ilimitado', 'API, inventario, facturación', 'Soporte prioritario'] },
        ].map(function (plan, i) {
          return (
            <div key={i} className={'rounded-2xl p-6 border transition-shadow ' + (i === 1 ? 'shadow-xl border-[#5F7B65] scale-105' : 'shadow-sm border-gray-100 hover:shadow-md')} style={{ backgroundColor: '#FFFFFF' }}>
              <h3 className="text-lg font-bold mb-1" style={{ color: DARK }}>{plan.name}</h3>
              <p className="text-sm mb-4" style={{ color: GRAY }}>{plan.desc}</p>
              <p className="text-3xl font-bold mb-6" style={{ color: DARK }}>
                {plan.price}
                <span className="text-sm font-normal" style={{ color: GRAY }}> {plan.desc}</span>
              </p>
              <ul className="space-y-2 mb-6">
                {plan.features.map(function (f, j) {
                  return <li key={j} className="flex items-center gap-2 text-sm" style={{ color: GRAY }}><span className="text-emerald-500">✓</span>{f}</li>;
                })}
              </ul>
              <button className="w-full py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer" style={{ backgroundColor: i === 1 ? '#5F7B65' : '#F1F5F9', color: i === 1 ? '#FFFFFF' : DARK }}>
                {i === 0 ? 'Comenzar' : 'Contratar'}
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: BG }}>
      <Navbar />
      <Hero />
      <Features />
      <Pricing />
      <footer className="flex-none px-8 py-8 text-center">
        <p className="text-sm font-medium" style={{ color: GRAY }}>
          Miles de clínicas y hospitales veterinarios ya confían en VetControl 360.
        </p>
      </footer>
    </div>
  );
}

export default LandingPage;
