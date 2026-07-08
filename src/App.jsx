import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import AppLayout from './components/AppLayout';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Clientes from './pages/Clientes';
import Mascotas from './pages/Mascotas';
import NuevaMascota from './pages/NuevaMascota';
import Historial from './pages/Historial';
import Vacunacion from './pages/Vacunacion';
import NuevaVacuna from './pages/NuevaVacuna';
import GestionUsuarios from './pages/GestionUsuarios';
import GestionInventario from './pages/GestionInventario';
import NuevoProducto from './pages/NuevoProducto';
import AgendaCitas from './pages/AgendaCitas';
import NuevaCita from './pages/NuevaCita';
import FacturacionPage from './pages/FacturacionPage';
import NuevaFactura from './pages/NuevaFactura';
import AuditoriaPage from './pages/AuditoriaPage';
import HistoriaClinicaPage from './pages/HistoriaClinicaPage';
import PersonalPage from './pages/PersonalPage';
import ProveedoresPage from './pages/ProveedoresPage';
import ReportesPage from './pages/ReportesPage';
import SUNATConfigPage from './pages/SUNATConfigPage';

function PlaceholderPage({ titulo }) {
  return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="text-center">
        <p className="text-6xl mb-4">🚧</p>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{titulo}</h2>
        <p className="text-gray-500">Módulo en desarrollo</p>
      </div>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/clientes" element={<Clientes />} />
          <Route path="/mascotas" element={<Mascotas />} />
          <Route path="/mascotas/nueva" element={<NuevaMascota />} />
          <Route path="/historial/:mascotaId" element={<Historial />} />
          <Route path="/historia-clinica" element={<HistoriaClinicaPage />} />
          <Route path="/vacunacion" element={<Vacunacion />} />
          <Route path="/vacunacion/nueva" element={<NuevaVacuna />} />
          <Route path="/usuarios" element={<GestionUsuarios />} />
          <Route path="/inventario" element={<GestionInventario />} />
          <Route path="/inventario/nuevo" element={<NuevoProducto />} />
          <Route path="/agenda" element={<AgendaCitas />} />
          <Route path="/agenda/nueva" element={<NuevaCita />} />
          <Route path="/facturacion" element={<FacturacionPage />} />
          <Route path="/facturacion/nueva" element={<NuevaFactura />} />
          <Route path="/auditoria" element={<AuditoriaPage />} />
          <Route path="/proveedores" element={<ProveedoresPage />} />
          <Route path="/personal" element={<PersonalPage />} />
          <Route path="/reportes" element={<ReportesPage />} />
          <Route path="/sunat" element={<SUNATConfigPage />} />
        </Route>
      </Routes>
    </Router>
    </ThemeProvider>
  );
}

export default App;
