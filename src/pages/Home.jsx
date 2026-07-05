import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 dark:from-[#1a2e1a] dark:to-[#0d2818] flex flex-col items-center justify-center">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-gray-800 dark:text-[#E0E0E0] mb-4">VetControl 360</h1>
        <p className="text-xl text-gray-600 dark:text-[#A0A0A0] mb-8">Sistema de Gestión Veterinaria</p>
        <Link
          to="/login"
          className="inline-block bg-[#5F7B65] hover:bg-[#4E6553] text-white font-semibold py-3 px-8 rounded-lg shadow-lg transition-colors duration-200"
        >
          Iniciar Sesión
        </Link>
      </div>
    </div>
  );
}

export default Home;
