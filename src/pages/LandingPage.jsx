import { useNavigate } from 'react-router-dom';

var PRIMARY = '#5F7B65';
var PRIMARY_DARK = '#4A6250';
var DARK = '#1E293B';
var GRAY = '#64748B';
var BG = '#F9FAFB';

var navLinks = ['Inicio', 'Caracter\u00EDsticas', 'Precios', 'Noticias'];

var features = [
  { icon: '\uD83D\uDCC5', title: '40% menos citas perdidas', desc: 'Reservas online y recordatorios autom\u00E1ticos.' },
  { icon: '\uD83C\uDFE5', title: 'Hasta 3 horas menos en tareas administrativas', desc: 'La IA completa historias cl\u00EDnicas.' },
  { icon: '\uD83D\uDCE6', title: 'Inventario actualizado autom\u00E1ticamente', desc: 'Menos errores de stock.' },
  { icon: '\uD83D\uDCA8', title: 'Decisiones m\u00E1s r\u00E1pidas con datos en tiempo real', desc: 'Reportes claros para todo el equipo.' },
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
            <a key={link} href="#" className="text-sm font-medium transition-colors hover:opacity-80" style={{ color: DARK }}>
              {link}
            </a>
          );
        })}
      </div>

      <div className="flex items-center gap-3">
        <button onClick={function () { navigate('/login'); }} className="px-5 py-2.5 rounded-xl text-sm font-semibold border transition-colors cursor-pointer" style={{ backgroundColor: '#FFFFFF', borderColor: '#D1D5DB', color: DARK }}>
          Iniciar sesi\u00F3n
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
    <div className="relative w-full max-w-xl mx-auto">
      <div className="rounded-2xl shadow-2xl overflow-hidden bg-white border border-gray-200">
        <div className="bg-slate-800 text-white px-4 py-2 flex items-center justify-between text-xs">
          <span>[1] Clinica Veterinaria DogMan</span>
          <div className="flex gap-2">
            <span className="w-2 h-2 rounded-full bg-red-400"></span>
            <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
            <span className="w-2 h-2 rounded-full bg-green-400"></span>
          </div>
        </div>
        <div className="flex h-[360px] w-full">
          <div className="w-14 shrink-0 flex flex-col items-center py-4 gap-3" style={{ backgroundColor: PRIMARY_DARK }}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: PRIMARY }}>
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </div>
            <div className="w-6 h-6 bg-white/20 rounded-lg"></div>
            <div className="w-6 h-6 bg-white/20 rounded-lg"></div>
            <div className="w-6 h-6 bg-white/20 rounded-lg"></div>
            <div className="mt-auto w-6 h-6 bg-white/20 rounded-lg"></div>
          </div>
          <div className="flex-1 flex flex-col p-3 bg-gray-50">
            <div className="grid grid-cols-3 gap-2 mb-3">
              <div className="bg-white rounded-lg p-2 flex flex-col">
                <span className="text-[9px] font-semibold text-gray-400 uppercase">Ventas</span>
                <span className="text-sm font-bold text-gray-800">60929.18</span>
                <div className="flex items-end gap-0.5 h-8 mt-1">
                  {[0.3,0.5,0.2,0.7,0.4,0.6,0.8,0.35,0.55,0.25,0.45,0.65].map(function (h, i) {
                    return <div key={i} className="flex-1 bg-emerald-400 rounded-t" style={{ height: Math.round(h * 100) + '%' }} />;
                  })}
                </div>
              </div>
              <div className="bg-white rounded-lg p-2">
                <span className="text-[9px] font-semibold text-gray-400 uppercase">Sala espera</span>
                <span className="text-lg font-bold text-gray-800 block mt-1">0</span>
              </div>
              <div className="bg-white rounded-lg p-2">
                <span className="text-[9px] font-semibold text-gray-400 uppercase">Citas hoy</span>
                <span className="text-lg font-bold text-gray-800 block mt-1">0</span>
              </div>
            </div>
            <div className="flex-1 bg-white rounded-lg p-3">
              <span className="text-[9px] font-semibold text-gray-400 uppercase block mb-2">Citas por dia</span>
              <div className="flex items-end gap-1 h-24">
                {[0.2,0.4,0.15,0.6,0.3,0.5,0.7,0.25,0.45,0.35,0.55,0.65].map(function (h, i) {
                  return <div key={i} className="flex-1 bg-indigo-300 rounded-t" style={{ height: Math.round(h * 100) + '%' }} />;
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute top-12 -left-6 bg-white rounded-xl shadow-lg border border-gray-100 p-3 flex items-center gap-2 z-10 animate-bounce" style={{ animationDuration: '4s', animationDelay: '0s' }}>
        <div className="w-7 h-7 bg-blue-50 rounded-full flex items-center justify-center text-xs">&#x2705;</div>
        <div>
          <p className="text-xs font-bold text-gray-800">Cita confirmada</p>
          <p className="text-[10px] text-gray-400">Luna &bull; 10:30 a.m.</p>
        </div>
      </div>
      <div className="absolute top-48 -left-8 bg-white rounded-xl shadow-lg border border-gray-100 p-3 flex items-center gap-2 z-10 animate-bounce" style={{ animationDuration: '4s', animationDelay: '1.5s' }}>
        <div className="w-7 h-7 bg-blue-50 rounded-full flex items-center justify-center text-xs">&#x1F916;</div>
        <div>
          <p className="text-xs font-bold text-gray-800">IA mejor&oacute; la historia cl&iacute;nica</p>
          <p className="text-[10px] text-gray-400">en 4 segundos</p>
        </div>
      </div>
      <div className="absolute top-32 right-0 bg-white rounded-xl shadow-lg border border-gray-100 p-3 flex items-center gap-2 z-10 animate-bounce" style={{ animationDuration: '4s', animationDelay: '2.5s' }}>
        <div className="w-7 h-7 bg-blue-50 rounded-full flex items-center justify-center text-xs">&#x1F514;</div>
        <div>
          <p className="text-xs font-bold text-gray-800">Recordatorio enviado</p>
          <p className="text-[10px] text-gray-400">3 tutores</p>
        </div>
      </div>
    </div>
  );
}

function Hero() {
  var navigate = useNavigate();

  return (
    <section className="flex-1 flex items-center px-8 max-w-7xl mx-auto w-full">
      <div className="grid md:grid-cols-2 gap-12 items-center w-full">
        <div className="space-y-6">
          <span className="inline-block text-xs font-bold tracking-[0.15em] px-4 py-2 rounded-full" style={{ backgroundColor: '#F1F5F9', color: PRIMARY }}>
            EL SOFTWARE VETERINARIO QUE TU CL\u00CDNICA NECESITA
          </span>

          <h1 className="text-4xl md:text-5xl font-bold leading-tixt" style={{ color: DARK }}>
            Gestiona todas las \u00E1reas de tu veterinaria desde un solo lugar
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
    <section className="px-8 py-20 max-w-7xl mx-auto w-full">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-12" style={{ color: DARK }}>
        Una veterinaria m\u00E1s organizada \u2014 y un equipo que ama lo que hace.
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

function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: BG }}>
      <Navbar />
      <Hero />
      <Features />
      <footer className="flex-none px-8 py-8 text-center">
        <p className="text-sm font-medium" style={{ color: GRAY }}>
          Miles de cl\u00EDnicas y hospitales veterinarios ya conf\u00EDan en VetControl 360.
        </p>
      </footer>
    </div>
  );
}

export default LandingPage;
