import { useNavigate } from 'react-router-dom';
import heroImg from '../assets/hero.png';

const navLinks = ['Inicio', 'Características', 'Precios', 'Noticias'];

function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="flex items-center justify-between px-8 py-4 max-w-7xl mx-auto w-full">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#5F7B65' }}>
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15a2.25 2.25 0 0 1 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
          </svg>
        </div>
        <span className="text-xl font-bold" style={{ color: '#1E293B' }}>VetControl 360</span>
      </div>

      <div className="hidden md:flex items-center gap-8">
        {navLinks.map((link) => (
          <a
            key={link}
            href={link === 'Inicio' ? '#' : `#${link.toLowerCase()}`}
            className="text-sm font-medium transition-colors hover:opacity-80"
            style={{ color: '#1E293B' }}
          >
            {link}
          </a>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/login')}
          className="px-5 py-2.5 rounded-xl text-sm font-semibold border transition-colors cursor-pointer"
          style={{ backgroundColor: '#FFFFFF', borderColor: '#D1D5DB', color: '#1E293B' }}
        >
          Iniciar sesión
        </button>
        <button
          onClick={() => navigate('/contacto')}
          className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors cursor-pointer"
          style={{ backgroundColor: '#5F7B65' }}
        >
          Agenda una demo
        </button>
      </div>
    </nav>
  );
}

function Hero() {
  const navigate = useNavigate();

  return (
    <section className="flex-1 flex items-center px-8 max-w-7xl mx-auto w-full">
      <div className="grid md:grid-cols-2 gap-12 items-center w-full">
        <div className="space-y-6">
          <span
            className="inline-block text-xs font-bold tracking-[0.15em] px-4 py-2 rounded-full"
            style={{ backgroundColor: '#F1F5F9', color: '#5F7B65' }}
          >
            EL SOFTWARE VETERINARIO QUE TU CLÍNICA NECESITA
          </span>

          <h1 className="text-4xl md:text-5xl font-bold leading-tight" style={{ color: '#1E293B' }}>
            Gestiona todas las áreas de tu veterinaria desde un solo lugar
          </h1>

          <p className="text-lg" style={{ color: '#64748B' }}>
            Automatiza tareas, organiza tu equipo y mejora la experiencia de tus pacientes.
          </p>

          <button
            onClick={() => navigate('/contacto')}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-lg font-semibold text-white shadow-lg transition-all hover:opacity-90 cursor-pointer"
            style={{ backgroundColor: '#5F7B65' }}
          >
            Agenda una demo
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </button>
        </div>

        <div className="flex justify-center">
          <div className="bg-white rounded-xl shadow-2xl p-3 max-w-lg">
            <img
              src={heroImg}
              alt="VetControl 360 Dashboard"
              className="w-full rounded-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F9FAFB' }}>
      <Navbar />
      <Hero />
      <footer className="flex-none px-8 py-8 text-center">
        <p className="text-sm font-medium" style={{ color: '#64748B' }}>
          Miles de clínicas y hospitales veterinarios ya confían en VetControl 360.
        </p>
      </footer>
    </div>
  );
}

export default LandingPage;
