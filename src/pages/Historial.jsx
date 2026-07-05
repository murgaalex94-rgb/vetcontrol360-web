import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

const MOCK_MASCOTA = {
  id: 1, nombre: 'Max', especie: 'Canino', raza: 'Golden Retriever',
  sexo: 'Macho', edad: '3 años', peso: '28.5 kg', microchip: '985112345678901',
  dueno: 'Juan Pérez', telefono: '555-0101', foto: null,
  grupoSanguineo: 'DEA 1.1+', alergias: 'Ninguna conocida',
  fechaNacimiento: '2021-05-12',
};

const MOCK_CONSULTAS = [
  { id: 1, fecha: '15/06/2024', hora: '10:30 AM', tipo: 'Consulta General', veterinario: 'Dra. María García', icono: 'consulta', activo: true },
  { id: 2, fecha: '02/04/2024', hora: '11:15 AM', tipo: 'Control de Vacunación', veterinario: 'Dr. Carlos López', icono: 'vacuna', activo: false },
  { id: 3, fecha: '20/02/2024', hora: '09:00 AM', tipo: 'Consulta General', veterinario: 'Dra. María García', icono: 'consulta', activo: false },
  { id: 4, fecha: '10/12/2023', hora: '04:45 PM', tipo: 'Desparasitación', veterinario: 'Dr. Roberto Sánchez', icono: 'jeringa', activo: false },
  { id: 5, fecha: '05/08/2023', hora: '08:30 AM', tipo: 'Emergencia', veterinario: 'Dr. Carlos López', icono: 'emergencia', activo: false },
];

const MOCK_DETALLE_CONSULTA = {
  motivo: 'El paciente presenta vómitos esporádicos desde hace 3 días y ha perdido el apetito. El dueño reporta que ha estado más decaído de lo normal.',
  anamnesis: 'Paciente canino de 3 años, macho, raza Golden Retriever. Vacunación al día. Desparasitación externa e interna al día. Alimentación con Royal Canin Large Adult. Sin antecedentes quirúrgicos. Convive con otro perro en casa. Acceso a jardín.',
  signosVitales: [
    { label: 'Temperatura', value: '38.5 °C' },
    { label: 'Frec. Cardíaca', value: '95 lpm' },
    { label: 'Frec. Respiratoria', value: '22 rpm' },
    { label: 'Mucosas', value: 'Rosadas, húmedas' },
    { label: 'LLC', value: '2 seg' },
    { label: 'Hidratación', value: '6-7%' },
    { label: 'Pulso', value: 'Fuerte, rítmico' },
    { label: 'Linfonodos', value: 'Sin alteraciones' },
  ],
  diagnostico: 'Gastroenteritis leve probablemente asociada a cambio en la alimentación.',
  recomendaciones: [
    'Dieta blanda por 48 horas (arroz + pollo sin piel)',
    'Ofrecer agua en pequeñas cantidades frecuentemente',
    'Suspender premios y golosinas durante una semana',
    'Regresar a consulta si los síntomas persisten después de 72 horas',
  ],
  tratamiento: [
    { medicamento: 'Metoclopramida', dosis: '0.3 mg/kg', frecuencia: 'Cada 8 horas por 5 días', via: 'Oral' },
    { medicamento: 'Omeprazol', dosis: '1 mg/kg', frecuencia: 'Cada 24 horas por 7 días', via: 'Oral' },
    { medicamento: 'Probiótico oral', dosis: '1 sobre', frecuencia: 'Cada 24 horas por 10 días', via: 'Oral' },
  ],
  observaciones: 'El paciente toleró bien la exploración física. Se recomienda control en 7 días. El dueño será contactado telefónicamente para seguimiento.',
};

const MOCK_ARCHIVOS = [
  { nombre: 'Resultados_Hematologia.pdf', tamano: '2.4 MB', tipo: 'pdf' },
  { nombre: 'Radiografia_Torax.jpg', tamano: '1.8 MB', tipo: 'img' },
  { nombre: 'Receta_Medica_Jun2024.pdf', tamano: '0.5 MB', tipo: 'pdf' },
];

const MOCK_PROXIMA_CITA = {
  fecha: 'Lunes, 22 de Julio de 2024',
  hora: '10:30 AM',
  tipo: 'Control General',
};

const tabs = ['Consultas', 'Historial Clínico', 'Vacunas', 'Desparasitaciones', 'Archivos', 'Laboratorio'];

const iconosConsulta = {
  consulta: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" /></svg>,
  vacuna: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 9V3.75M9 3.75h-3M9 3.75h3m-3 0V9m3-5.25h3M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>,
  jeringa: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0 0h4.5m-4.5 0L9 13.5m-5.25-5.25L9 3.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-6-4.5a9 9 0 0 1 0 9" /></svg>,
  emergencia: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" /></svg>,
};

const iconosArchivo = {
  pdf: <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" /></svg>,
  img: <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Zm16.5-16.5h.008v.008h-.008V4.5Z" /></svg>,
};

function Historial() {
  const { mascotaId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Consultas');
  const [selectedId, setSelectedId] = useState(1);
  const consulta = MOCK_CONSULTAS.find((c) => c.id === selectedId);

  return (
    <div className="space-y-5">
      <nav className="text-sm text-gray-500">
        <Link to="/" className="hover:text-emerald-600">Inicio</Link>
        <span className="mx-2">/</span>
        <Link to="/mascotas" className="hover:text-emerald-600">Mascotas</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800 font-medium">{MOCK_MASCOTA.nombre}</span>
      </nav>

      <div className="bg-white dark:bg-[#1E1E1E] rounded-xl shadow-sm border border-gray-100 dark:border-[#333] p-5">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 text-2xl font-bold shrink-0">
            {MOCK_MASCOTA.nombre[0]}
          </div>
          <div className="flex-1 grid grid-cols-4 gap-x-8 gap-y-1 text-sm">
            <p className="text-gray-900 dark:text-[#E0E0E0] font-semibold text-base col-span-2">{MOCK_MASCOTA.nombre}</p>
            <p className="text-gray-400 dark:text-[#808080] text-xs col-span-2">Microchip: {MOCK_MASCOTA.microchip}</p>
            <p className="text-gray-600 dark:text-[#A0A0A0]"><span className="text-gray-400 dark:text-[#808080]">Raza:</span> {MOCK_MASCOTA.raza}</p>
            <p className="text-gray-600 dark:text-[#A0A0A0]"><span className="text-gray-400 dark:text-[#808080]">Edad:</span> {MOCK_MASCOTA.edad}</p>
            <p className="text-gray-600 dark:text-[#A0A0A0]"><span className="text-gray-400 dark:text-[#808080]">Peso:</span> {MOCK_MASCOTA.peso}</p>
            <p className="text-gray-600 dark:text-[#A0A0A0]"><span className="text-gray-400 dark:text-[#808080]">Dueño:</span> {MOCK_MASCOTA.dueno}</p>
            <p className="text-gray-600 dark:text-[#A0A0A0]"><span className="text-gray-400 dark:text-[#808080]">Teléfono:</span> {MOCK_MASCOTA.telefono}</p>
            <p className="text-gray-600 dark:text-[#A0A0A0] col-span-2"><span className="text-gray-400 dark:text-[#808080]">Especie:</span> {MOCK_MASCOTA.especie} | <span className="text-gray-400 dark:text-[#808080]">Sexo:</span> {MOCK_MASCOTA.sexo}</p>
          </div>
          <button className="px-4 py-2 border border-emerald-600 text-emerald-600 rounded-lg text-sm font-medium hover:bg-emerald-50 transition-colors shrink-0 cursor-pointer">
            Ver Ficha de Mascota
          </button>
        </div>
      </div>

      <div className="border-b border-gray-200 dark:border-[#333]">
        <div className="flex gap-6">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-sm font-medium transition-colors border-b-2 cursor-pointer ${
                activeTab === tab
                  ? 'text-emerald-600 border-emerald-600'
                  : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-6">
        <div className="w-80 shrink-0 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-gray-800 dark:text-[#E0E0E0]">Historial de Consultas</h3>
            <button className="text-xs text-emerald-600 hover:text-emerald-700 font-medium cursor-pointer">Ver todas</button>
          </div>
          <div className="space-y-3">
            {MOCK_CONSULTAS.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedId(c.id)}
                className={`w-full text-left bg-white dark:bg-[#1E1E1E] rounded-xl border p-4 transition-all cursor-pointer ${
                  selectedId === c.id
                    ? 'border-emerald-600 shadow-sm ring-1 ring-emerald-600/20'
                    : 'border-gray-100 dark:border-[#333] hover:border-gray-200 dark:hover:border-[#404040] shadow-sm'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                    selectedId === c.id ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-400'
                  }`}>
                    {iconosConsulta[c.icono]}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-gray-400 dark:text-[#808080]">{c.fecha} - {c.hora}</p>
                    <p className="text-sm font-semibold text-gray-800 dark:text-[#E0E0E0] mt-0.5">{c.tipo}</p>
                    <p className="text-xs text-gray-500 dark:text-[#909090] mt-0.5">{c.veterinario}</p>
                  </div>
                </div>
                {selectedId === c.id && <div className="w-1 h-full bg-emerald-600 rounded-r absolute left-0 top-0" />}
              </button>
            ))}
          </div>
        </div>

        {consulta && MOCK_DETALLE_CONSULTA ? (
          <div className="flex-1 space-y-5">
            <div className="bg-white dark:bg-[#1E1E1E] rounded-xl shadow-sm border border-gray-100 dark:border-[#333] p-6 space-y-6">
              <div className="flex items-center justify-between">
                <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 rounded-full text-xs font-semibold">{consulta.tipo}</span>
                <p className="text-sm text-gray-500 dark:text-[#909090]">{consulta.veterinario} - {consulta.fecha}</p>
              </div>

              <Section title="Motivo de la consulta">{MOCK_DETALLE_CONSULTA.motivo}</Section>

              <Section title="Anamnesis">{MOCK_DETALLE_CONSULTA.anamnesis}</Section>

              <Section title="Examen Físico" icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 0-6.23.693L5 14.5m14.8.8 1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0 1 12 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5Z" /></svg>
              }>
                <div className="grid grid-cols-4 gap-3">
                  {MOCK_DETALLE_CONSULTA.signosVitales.map((s, i) => (
                    <div key={i} className="bg-gray-50 dark:bg-[#2C2C2C] rounded-lg p-3 text-center">
                      <p className="text-xs text-gray-500 dark:text-[#909090]">{s.label}</p>
                      <p className="text-sm font-semibold text-gray-800 dark:text-[#E0E0E0] mt-1">{s.value}</p>
                    </div>
                  ))}
                </div>
              </Section>

              <Section title="Diagnóstico">{MOCK_DETALLE_CONSULTA.diagnostico}</Section>

              {MOCK_DETALLE_CONSULTA.recomendaciones.length > 0 && (
                <Section title="Recomendaciones">
                  <ul className="space-y-1.5">
                    {MOCK_DETALLE_CONSULTA.recomendaciones.map((r, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-[#A0A0A0]">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-2 shrink-0" />
                        {r}
                      </li>
                    ))}
                  </ul>
                </Section>
              )}

              <Section title="Tratamiento" icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 9V3.75M9 3.75h-3M9 3.75h3m-3 0V9m3-5.25h3M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
              }>
              <div className="overflow-hidden border border-gray-200 dark:border-[#333] rounded-xl">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-[#2C2C2C] text-gray-500 dark:text-[#909090] text-xs uppercase tracking-wider">
                        <th className="text-left px-4 py-3 font-semibold">Medicamento</th>
                        <th className="text-left px-4 py-3 font-semibold">Dosis</th>
                        <th className="text-left px-4 py-3 font-semibold">Frecuencia</th>
                        <th className="text-left px-4 py-3 font-semibold">Vía</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-[#333]">
                      {MOCK_DETALLE_CONSULTA.tratamiento.map((t, i) => (
                        <tr key={i}>
                          <td className="px-4 py-3 font-medium text-gray-800 dark:text-[#E0E0E0]">{t.medicamento}</td>
                          <td className="px-4 py-3 text-gray-600 dark:text-[#A0A0A0]">{t.dosis}</td>
                          <td className="px-4 py-3 text-gray-600 dark:text-[#A0A0A0]">{t.frecuencia}</td>
                          <td className="px-4 py-3 text-gray-600 dark:text-[#A0A0A0]">{t.via}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Section>

              <Section title="Observaciones">{MOCK_DETALLE_CONSULTA.observaciones}</Section>
            </div>
          </div>
        ) : (
          <div className="flex-1 bg-white dark:bg-[#1E1E1E] rounded-xl shadow-sm border border-gray-100 dark:border-[#333] p-12 text-center">
            <p className="text-gray-400 dark:text-[#808080]">Seleccione una consulta para ver los detalles</p>
          </div>
        )}

        <div className="w-72 shrink-0 space-y-4">
          <div className="bg-white dark:bg-[#1E1E1E] rounded-xl shadow-sm border border-gray-100 dark:border-[#333] p-5 space-y-3">
            <h4 className="text-sm font-bold text-gray-800 dark:text-[#E0E0E0]">Información Rápida</h4>
            <div className="space-y-2 text-sm">
              {[{ l: 'Especie', v: MOCK_MASCOTA.especie }, { l: 'Raza', v: MOCK_MASCOTA.raza }, { l: 'Edad', v: MOCK_MASCOTA.edad }, { l: 'Peso', v: MOCK_MASCOTA.peso }, { l: 'Grupo Sanguíneo', v: MOCK_MASCOTA.grupoSanguineo }, { l: 'Alergias', v: MOCK_MASCOTA.alergias }].map((item, i) => (
                <div key={i} className="flex justify-between">
                  <span className="text-gray-500 dark:text-[#909090]">{item.l}</span>
                  <span className="text-gray-800 dark:text-[#E0E0E0] font-medium">{item.v}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-[#1E1E1E] rounded-xl shadow-sm border border-gray-100 dark:border-[#333] p-5 space-y-3">
            <h4 className="text-sm font-bold text-gray-800 dark:text-[#E0E0E0]">Archivos Adjuntos</h4>
            <div className="space-y-2">
              {MOCK_ARCHIVOS.map((a, i) => (
                <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-[#2C2C2C] transition-colors cursor-pointer">
                  {iconosArchivo[a.tipo]}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-700 dark:text-[#D0D0D0] truncate">{a.nombre}</p>
                    <p className="text-xs text-gray-400 dark:text-[#808080]">{a.tamano}</p>
                  </div>
                  <svg className="w-4 h-4 text-gray-400 dark:text-[#808080] shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                  </svg>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-[#1E1E1E] rounded-xl shadow-sm border border-gray-100 dark:border-[#333] p-5 space-y-3">
            <h4 className="text-sm font-bold text-gray-800 dark:text-[#E0E0E0]">Acciones Rápidas</h4>
            <div className="space-y-2">
              <button className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer">Nueva Consulta</button>
              <button className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer">Nueva Receta</button>
              <button className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer">Solicitar Examen</button>
              <button className="w-full py-2.5 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer">Subir Archivo</button>
            </div>
          </div>

          <div className="bg-white dark:bg-[#1E1E1E] rounded-xl shadow-sm border border-gray-100 dark:border-[#333] p-5 space-y-3">
            <h4 className="text-sm font-bold text-gray-800 dark:text-[#E0E0E0]">Próxima Cita</h4>
            <div className="bg-emerald-50 rounded-lg p-4 text-center space-y-2">
              <p className="text-sm font-semibold text-emerald-800">{MOCK_PROXIMA_CITA.fecha}</p>
              <p className="text-xs text-emerald-600">{MOCK_PROXIMA_CITA.hora} - {MOCK_PROXIMA_CITA.tipo}</p>
            </div>
            <button className="w-full py-2.5 bg-[#5F7B65] hover:bg-[#4E6553] text-white text-sm font-medium rounded-lg transition-colors cursor-pointer">
              Programar Cita
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ title, icon, children }) {
  return (
    <div>
      <h4 className="text-sm font-bold text-gray-800 dark:text-[#E0E0E0] mb-3 flex items-center gap-2">
        {icon && <span className="text-emerald-600">{icon}</span>}
        {title}
      </h4>
      <p className="text-sm text-gray-600 dark:text-[#A0A0A0] leading-relaxed">{children}</p>
    </div>
  );
}

export default Historial;
