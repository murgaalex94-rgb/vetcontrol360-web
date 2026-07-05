import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NuevaConsultaModal from '../components/NuevaConsultaModal';

var mascota = {
  nombre: 'Max',
  genero: 'M',
  estado: 'Activo',
  raza: 'Golden Retriever',
  especie: 'Perro',
  edad: '3 años',
  peso: '28.5 kg',
  microchip: 'CHIP-001456',
  dueno: 'Juan Pérez',
  fechaNacimiento: '15/03/2021',
  foto: 'https://placehold.co/80x80/E6F7F6/0D9488?text=M',
};

var consultas = [
  { id: 1, fecha: '24/05/2024, 10:30 AM', tipo: 'Consulta General', tipoColor: 'bg-green-100 text-green-700', veterinario: 'Dr. Carlos Ramírez', motivo: 'Revisión anual de rutina - control de peso y estado general', estado: 'Completada' },
  { id: 2, fecha: '20/05/2024, 09:00 AM', tipo: 'Vacunación', tipoColor: 'bg-purple-100 text-purple-700', veterinario: 'Dra. María García', motivo: 'Aplicación de vacuna antirrábica - refuerzo anual', estado: 'Completada' },
  { id: 3, fecha: '15/05/2024, 11:15 AM', tipo: 'Examen de Laboratorio', tipoColor: 'bg-blue-100 text-blue-700', veterinario: 'Dr. Carlos Ramírez', motivo: 'Análisis de sangre completo - chequeo prequirúrgico', estado: 'Completada' },
  { id: 4, fecha: '10/05/2024, 08:45 AM', tipo: 'Consulta General', tipoColor: 'bg-green-100 text-green-700', veterinario: 'Dra. Ana Martínez', motivo: 'Presenta vómitos y diarrea desde hace 2 días', estado: 'Completada' },
  { id: 5, fecha: '05/05/2024, 14:00 PM', tipo: 'Desparasitación', tipoColor: 'bg-orange-100 text-orange-700', veterinario: 'Dra. María García', motivo: 'Desparasitación interna programada cada 3 meses', estado: 'Completada' },
];

var detallesConsultas = {
  1: {
    motivo: 'Revisión anual de rutina para evaluar el estado general de salud de Max, incluyendo control de peso, vacunas pendientes y análisis de sangre de control.',
    anamnesis: 'El propietario refiere que Max se encuentra activo y con buen apetito. No presenta cambios significativos de comportamiento. En los últimos meses ha aumentado ligeramente de peso. No ha presentado vómitos, diarrea ni tos. Última vacuna aplicada hace 11 meses.',
    examenFisico: {
      temperatura: '38.5 °C',
      frecuenciaCardiaca: '120 lpm',
      frecuenciaRespiratoria: '24 rpm',
      presionArterial: '130/85 mmHg',
      peso: '28.5 kg',
      condicionCorporal: '6/9 (Sobrepeso leve)',
      estadoMucosas: 'Rosadas, húmedas',
      tiempoLlenadoCapilar: '2 seg',
    },
    diagnostico: [
      'Sobrepeso leve - IMC por encima del rango ideal para la raza y edad',
      'Estado de salud general bueno',
      'Sin signos de enfermedad sistémica',
    ],
    recomendaciones: [
      'Reducir la ración diaria en un 15%',
      'Aumentar el ejercicio físico a 45 minutos diarios',
      'Programar control de peso en 2 meses',
      'Evitar premios y snacks entre comidas',
    ],
    tratamiento: [
      { medicamento: 'Suplemento vitamínico', dosis: '1 tableta', frecuencia: 'Diaria por 30 días' },
      { medicamento: 'Ninguno adicional', dosis: '-', frecuencia: '-' },
    ],
    observaciones: 'Se recomienda traer una muestra de orina en el próximo control para descartar problemas renales. El propietario fue informado sobre la importancia de mantener el peso ideal para prevenir problemas articulares comunes en la raza.',
  },
  2: {
    motivo: 'Aplicación de vacuna antirrábica de refuerzo anual según calendario de vacunación obligatorio.',
    anamnesis: 'Max se encuentra al día con su esquema de vacunación. La última vacuna antirrábica fue aplicada hace 11 meses. No presenta reacciones adversas a vacunas previas. Sin alergias conocidas.',
    examenFisico: {
      temperatura: '38.3 °C',
      frecuenciaCardiaca: '115 lpm',
      frecuenciaRespiratoria: '22 rpm',
      presionArterial: '125/80 mmHg',
      peso: '28.2 kg',
      condicionCorporal: '5/9',
      estadoMucosas: 'Rosadas, húmedas',
      tiempoLlenadoCapilar: '2 seg',
    },
    diagnostico: [
      'Paciente sano, apto para vacunación',
      'Sin contraindicaciones para la aplicación de la vacuna',
    ],
    recomendaciones: [
      'Observar al paciente por 30 minutos en la clínica post-vacunación',
      'En caso de reacción adversa, contactar inmediatamente',
      'Próxima vacuna programada en 12 meses',
    ],
    tratamiento: [
      { medicamento: 'Vacuna antirrábica (Rabisin)', dosis: '1 dosis (1 ml)', frecuencia: 'Subcutánea - dosis única' },
    ],
    observaciones: 'Se entregó el certificado de vacunación antirrábica vigente. El paciente respondió favorablemente sin signos de reacción adversa durante la observación post-vacunal.',
  },
  3: {
    motivo: 'Análisis de sangre completo solicitado como parte del chequeo prequirúrgico antes de la esterilización programada.',
    anamnesis: 'El propietario desea programar la esterilización de Max. Se solicitan exámenes prequirúrgicos para evaluar la función hepática, renal y hemograma completo. No toma medicamentos actualmente.',
    examenFisico: {
      temperatura: '38.4 °C',
      frecuenciaCardiaca: '118 lpm',
      frecuenciaRespiratoria: '20 rpm',
      presionArterial: '128/82 mmHg',
      peso: '28.3 kg',
      condicionCorporal: '5/9',
      estadoMucosas: 'Rosadas, húmedas',
      tiempoLlenadoCapilar: '2 seg',
    },
    diagnostico: [
      'Hemograma completo dentro de valores normales',
      'Función hepática y renal en rangos aceptables',
      'Apto para procedimiento quirúrgico de esterilización',
    ],
    recomendaciones: [
      'Programar esterilización para las próximas 2 semanas',
      'Ayuno de 12 horas previas al procedimiento',
      'Retirar agua 4 horas antes de la cirugía',
    ],
    tratamiento: [
      { medicamento: 'Ninguno', dosis: '-', frecuencia: '-' },
    ],
    observaciones: 'Los resultados del hemograma muestran valores normales: Glóbulos rojos 7.2 M/µL, Glóbulos blancos 12.5 K/µL, Plaquetas 350 K/µL. Bioquímica: Creatinina 1.1 mg/dL, BUN 25 mg/dL, ALT 45 U/L. Todo dentro de rangos normales para la raza y edad.',
  },
  4: {
    motivo: 'Presentación de cuadro gastrointestinal agudo con vómitos y diarrea no hemática desde hace 48 horas.',
    anamnesis: 'El propietario refiere que Max comenzó con vómitos hace 2 días, de contenido alimentario y bilis amarilla. La diarrea es semilíquida, sin sangre ni moco. Ha disminuido el apetito pero mantiene la ingesta de agua. No ha presentado fiebre. No ha cambiado de alimento recientemente. Posible ingesta de alimento de la calle.',
    examenFisico: {
      temperatura: '38.8 °C',
      frecuenciaCardiaca: '110 lpm',
      frecuenciaRespiratoria: '22 rpm',
      presionArterial: '122/78 mmHg',
      peso: '27.8 kg',
      condicionCorporal: '5/9',
      estadoMucosas: 'Pálidas, semi-secas',
      tiempoLlenadoCapilar: '3 seg',
    },
    diagnostico: [
      'Gastroenteritis aguda de origen probablemente alimentario',
      'Deshidratación leve (5%)',
      'Sin signos de obstrucción intestinal',
    ],
    recomendaciones: [
      'Dieta blanda por 5-7 días (arroz hervido con pollo)',
      'Administrar los medicamentos indicados',
      'Asegurar hidratación constante',
      'Volver a consulta si no mejora en 48 horas',
    ],
    tratamiento: [
      { medicamento: 'Metronidazol', dosis: '250 mg', frecuencia: 'Cada 12 horas por 5 días' },
      { medicamento: 'Omeprazol', dosis: '20 mg', frecuencia: 'Cada 24 horas por 7 días' },
      { medicamento: 'Suero oral', dosis: '50 ml', frecuencia: 'Cada 6 horas por 3 días' },
    ],
    observaciones: 'Se descarta parvovirus por la edad del paciente y la ausencia de hemorragia en heces. Se recomienda suspender cualquier alimento de origen desconocido. El propietario fue informado sobre los signos de alarma que requieren atención inmediata.',
  },
  5: {
    motivo: 'Desparasitación interna programada trimestral según protocolo preventivo de salud.',
    anamnesis: 'Última desparasitación realizada hace 3 meses con excelente tolerancia. No presenta signos de parasitismo intestinal (sin prurito anal, sin proglottis en heces, sin pérdida de peso). Manteniendo el esquema de desparasitación cada 3 meses.',
    examenFisico: {
      temperatura: '38.2 °C',
      frecuenciaCardiaca: '116 lpm',
      frecuenciaRespiratoria: '20 rpm',
      presionArterial: '126/80 mmHg',
      peso: '28.0 kg',
      condicionCorporal: '5/9',
      estadoMucosas: 'Rosadas, húmedas',
      tiempoLlenadoCapilar: '2 seg',
    },
    diagnostico: [
      'Paciente sano - desparasitación preventiva de rutina',
      'Sin evidencia de parasitismo intestinal',
    ],
    recomendaciones: [
      'Próxima desparasitación en 3 meses (agosto 2024)',
      'Mantener el hábito de no ingerir heces en el paseo',
      'Lavar bien las patas después del paseo',
    ],
    tratamiento: [
      { medicamento: 'Drontal Plus (Piperazina + Pirantel)', dosis: '1 tableta (para 26-30 kg)', frecuencia: 'Dosis única oral' },
    ],
    observaciones: 'El paciente toleró el medicamento sin dificultad. Se recomienda administrar la tableta mezclada con alimento o directamente en la garganta. No se observaron efectos adversos durante la consulta. Próxima dosis programada para agosto 2024.',
  },
};

var ITEMS_PER_PAGE = 5;

function HistoriaClinicaPage() {
  var navigate = useNavigate();
  var [busqueda, setBusqueda] = useState('');
  var [filtroTipo, setFiltroTipo] = useState('Todas');
  var [paginaActual, setPaginaActual] = useState(1);
  var [selectedId, setSelectedId] = useState(null);
  var [showModal, setShowModal] = useState(false);

  var consultasFiltradas = consultas.filter(function (c) {
    var q = busqueda.toLowerCase();
    var matchBusqueda = !q || c.tipo.toLowerCase().includes(q) || c.veterinario.toLowerCase().includes(q) || c.motivo.toLowerCase().includes(q);
    var matchTipo = filtroTipo === 'Todas' || c.tipo === filtroTipo;
    return matchBusqueda && matchTipo;
  });

  var totalPaginas = Math.ceil(consultasFiltradas.length / ITEMS_PER_PAGE);
  var consultasPagina = consultasFiltradas.slice((paginaActual - 1) * ITEMS_PER_PAGE, paginaActual * ITEMS_PER_PAGE);
  var inicio = consultasFiltradas.length > 0 ? (paginaActual - 1) * ITEMS_PER_PAGE + 1 : 0;
  var fin = Math.min(paginaActual * ITEMS_PER_PAGE, consultasFiltradas.length);

  var selectedConsulta = selectedId ? detallesConsultas[selectedId] : null;
  var selectedMeta = selectedId ? consultas.find(function (c) { return c.id === selectedId; }) : null;

  var inputClass = 'rounded-xl border border-gray-300 dark:border-[#404040] bg-white dark:bg-[#2C2C2C] px-4 py-2.5 text-sm text-gray-800 dark:text-[#E0E0E0] transition-colors focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900/30">
            <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" /></svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-[#E0E0E0]">Historia Clínica</h1>
            <p className="text-sm text-gray-500 dark:text-[#909090]">Historial médico y consultas del paciente</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={function () { window.print(); }} className="flex items-center gap-2 rounded-xl border border-gray-300 dark:border-[#3A3A3A] bg-white dark:bg-[#1E1E1E] px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-[#E0E0E0] transition-colors hover:bg-gray-50 dark:hover:bg-[#2C2C2C] cursor-pointer">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0 1 10.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0 .229 2.523a1.125 1.125 0 0 1-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0 0 21 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 0 0-1.913-.247M6.34 18H5.25A2.25 2.25 0 0 1 3 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 0 1 1.913-.247m10.5 0a48.536 48.536 0 0 0-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5Zm-3 0h.008v.008H15V10.5Z" /></svg>
            Imprimir
          </button>
          <button onClick={function () { setShowModal(true); }} className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors cursor-pointer" style={{ backgroundColor: '#5F7B65' }}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
            Nueva Consulta
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl border border-gray-200 dark:border-[#333] shadow-sm p-6">
        <div className="flex items-start gap-8">
          <div className="flex items-center gap-5">
            <img src={mascota.foto} alt={mascota.nombre} className="w-20 h-20 rounded-full ring-4 ring-emerald-100 dark:ring-emerald-900/50" />
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-[#E0E0E0]">{mascota.nombre}</h2>
                <svg className="w-5 h-5 text-blue-500 dark:text-blue-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" /></svg>
                <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-xs font-semibold px-2.5 py-0.5 rounded-full">{mascota.estado}</span>
              </div>
              <p className="text-sm text-gray-500 dark:text-[#909090]">{mascota.raza} · {mascota.especie}</p>
              <p className="text-sm text-gray-500 dark:text-[#909090]">{mascota.edad} · {mascota.peso}</p>
            </div>
          </div>

          <div className="flex-1 grid grid-cols-2 gap-x-8 gap-y-2">
            <div><p className="text-xs text-gray-400 dark:text-[#808080]">Microchip</p><p className="text-sm font-medium text-gray-800 dark:text-[#E0E0E0]">{mascota.microchip}</p></div>
            <div><p className="text-xs text-gray-400 dark:text-[#808080]">Dueño</p><p className="text-sm font-medium text-gray-800 dark:text-[#E0E0E0]">{mascota.dueno}</p></div>
            <div><p className="text-xs text-gray-400 dark:text-[#808080]">Fecha de Nacimiento</p><p className="text-sm font-medium text-gray-800 dark:text-[#E0E0E0]">{mascota.fechaNacimiento}</p></div>
          </div>

          <button className="self-center flex items-center gap-2 rounded-xl border border-emerald-300 dark:border-emerald-700 bg-white dark:bg-[#1E1E1E] px-4 py-2.5 text-sm font-medium text-emerald-700 dark:text-emerald-300 transition-colors hover:bg-emerald-50 dark:hover:bg-emerald-900/20 cursor-pointer whitespace-nowrap">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" /></svg>
            Ver Ficha de Mascota
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className={'space-y-4 ' + (selectedId ? 'col-span-8' : 'col-span-12')}>
          <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl border border-gray-200 dark:border-[#333] shadow-sm p-4">
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-[#808080]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>
                <input type="text" value={busqueda} onChange={function (e) { setBusqueda(e.target.value); setPaginaActual(1); }} placeholder="Buscar en consultas..." className="w-full rounded-xl border border-gray-300 dark:border-[#404040] bg-white dark:bg-[#2C2C2C] pl-10 pr-4 py-2.5 text-sm text-gray-800 dark:text-[#E0E0E0] placeholder-gray-400 dark:placeholder-[#808080] focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20" />
              </div>
              <select value={filtroTipo} onChange={function (e) { setFiltroTipo(e.target.value); setPaginaActual(1); }} className="rounded-xl border border-gray-300 dark:border-[#404040] bg-white dark:bg-[#2C2C2C] px-4 py-2.5 text-sm text-gray-700 dark:text-[#D0D0D0] focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20">
                <option value="Todas">Todas las consultas</option>
                <option value="Consulta General">Consulta General</option>
                <option value="Vacunación">Vacunación</option>
                <option value="Examen de Laboratorio">Examen de Laboratorio</option>
                <option value="Desparasitación">Desparasitación</option>
              </select>
              <input type="text" defaultValue="Fecha desde" className="rounded-xl border border-gray-300 dark:border-[#404040] bg-white dark:bg-[#2C2C2C] px-4 py-2.5 text-sm text-gray-400 dark:text-[#808080] w-auto" readOnly />
              <input type="text" defaultValue="Fecha hasta" className="rounded-xl border border-gray-300 dark:border-[#404040] bg-white dark:bg-[#2C2C2C] px-4 py-2.5 text-sm text-gray-400 dark:text-[#808080] w-auto" readOnly />
              <button className="flex items-center gap-2 rounded-xl bg-[#5F7B65] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 cursor-pointer whitespace-nowrap">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z" /></svg>
                Filtros
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl border border-gray-200 dark:border-[#333] shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-[#333] bg-gray-50 dark:bg-[#2C2C2C]">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-[#909090] uppercase tracking-wider">Fecha</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-[#909090] uppercase tracking-wider">Tipo de Consulta</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-[#909090] uppercase tracking-wider">Veterinario</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-[#909090] uppercase tracking-wider">Motivo de Consulta</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-[#909090] uppercase tracking-wider">Estado</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 dark:text-[#909090] uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-[#333]">
                  {consultasPagina.map(function (c) {
                    var isSelected = selectedId === c.id;
                    return (
                      <tr key={c.id} onClick={function () { setSelectedId(c.id); }} className={'transition-colors cursor-pointer ' + (isSelected ? 'bg-emerald-50 dark:bg-emerald-900/20' : 'hover:bg-gray-50 dark:hover:bg-[#2C2C2C]')}>
                        <td className="px-4 py-3 text-sm text-gray-600 dark:text-[#B0B0B0] whitespace-nowrap">{c.fecha}</td>
                        <td className="px-4 py-3"><span className={'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ' + c.tipoColor}>{c.tipo}</span></td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-800 dark:text-[#E0E0E0]">{c.veterinario}</td>
                        <td className="px-4 py-3 text-sm text-gray-600 dark:text-[#B0B0B0] max-w-[250px] truncate">{c.motivo}</td>
                        <td className="px-4 py-3"><span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">{c.estado}</span></td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button onClick={function (e) { e.stopPropagation(); setSelectedId(c.id); }} className="flex items-center gap-1 rounded-lg bg-[#5F7B65] px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-emerald-700 cursor-pointer">
                              Ver Detalle
                            </button>
                            <button onClick={function (e) { e.stopPropagation(); }} className="h-8 w-8 flex items-center justify-center rounded-lg text-gray-400 dark:text-[#808080] hover:bg-gray-100 dark:hover:bg-[#2C2C2C] transition-colors cursor-pointer">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 1 1 0 1.5.75.75 0 0 1 0-1.5ZM12 12.75a.75.75 0 1 1 0 1.5.75.75 0 0 1 0-1.5ZM12 18.75a.75.75 0 1 1 0 1.5.75.75 0 0 1 0-1.5Z" /></svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-between border-t border-gray-200 dark:border-[#333] px-4 py-3">
              <p className="text-sm text-gray-500 dark:text-[#909090]">Mostrando {inicio} a {fin} de {consultasFiltradas.length} consultas</p>
              <div className="flex items-center gap-1">
                <button onClick={function () { setPaginaActual(function (p) { return Math.max(1, p - 1); }); }} disabled={paginaActual === 1} className="flex items-center justify-center rounded-lg border border-gray-300 dark:border-[#404040] bg-white dark:bg-[#1E1E1E] px-2.5 py-1.5 text-sm font-medium text-gray-700 dark:text-[#C0C0C0] transition-colors hover:bg-gray-50 dark:hover:bg-[#2C2C2C] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" /></svg>
                </button>
                {Array.from({ length: totalPaginas }, function (_, i) { return i + 1; }).map(function (pag) {
                  return (
                    <button key={pag} onClick={function () { setPaginaActual(pag); }} className={'flex h-8 w-8 items-center justify-center rounded-lg text-sm font-semibold transition-colors cursor-pointer ' + (paginaActual === pag ? 'bg-[#5F7B65] text-white' : 'border border-gray-300 dark:border-[#404040] bg-white dark:bg-[#1E1E1E] text-gray-700 dark:text-[#C0C0C0] hover:bg-gray-50 dark:hover:bg-[#2C2C2C]')}>{pag}</button>
                  );
                })}
                <button onClick={function () { setPaginaActual(function (p) { return Math.min(totalPaginas, p + 1); }); }} disabled={paginaActual === totalPaginas} className="flex items-center justify-center rounded-lg border border-gray-300 bg-white px-2.5 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" /></svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {selectedId && selectedConsulta && selectedMeta && (
          <div className="col-span-4 space-y-4">
            <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl border border-gray-200 dark:border-[#333] shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <span className={'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ' + selectedMeta.tipoColor}>{selectedMeta.tipo}</span>
                <button onClick={function () { setSelectedId(null); }} className="text-gray-400 dark:text-[#808080] hover:text-gray-600 dark:hover:text-[#A0A0A0] cursor-pointer">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <p className="text-xs text-gray-400 dark:text-[#808080] mb-1">Veterinario</p>
              <p className="text-sm font-semibold text-gray-800 dark:text-[#E0E0E0] mb-4">{selectedMeta.veterinario}</p>

              <p className="text-xs text-gray-400 dark:text-[#808080] mb-1">Fecha</p>
              <p className="text-sm font-medium text-gray-800 dark:text-[#E0E0E0] mb-4">{selectedMeta.fecha}</p>

              <div className="border-t border-gray-100 dark:border-[#333] pt-4 mb-4">
                <p className="text-xs font-semibold text-gray-500 dark:text-[#909090] uppercase tracking-wider mb-2">Motivo de la Consulta</p>
                <p className="text-sm text-gray-700 dark:text-[#C0C0C0] leading-relaxed">{selectedConsulta.motivo}</p>
              </div>

              <div className="border-t border-gray-100 dark:border-[#333] pt-4 mb-4">
                <p className="text-xs font-semibold text-gray-500 dark:text-[#909090] uppercase tracking-wider mb-2">Anamnesis</p>
                <p className="text-sm text-gray-700 dark:text-[#C0C0C0] leading-relaxed">{selectedConsulta.anamnesis}</p>
              </div>

              <div className="border-t border-gray-100 dark:border-[#333] pt-4 mb-4">
                <p className="text-xs font-semibold text-gray-500 dark:text-[#909090] uppercase tracking-wider mb-3">Examen Físico</p>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(selectedConsulta.examenFisico).map(function (entry) {
                    var key = entry[0];
                    var val = entry[1];
                    var labels = {
                      temperatura: 'Temperatura', frecuenciaCardiaca: 'Frec. Cardíaca',
                      frecuenciaRespiratoria: 'Frec. Respiratoria', presionArterial: 'Presión Arterial',
                      peso: 'Peso', condicionCorporal: 'Condición Corporal',
                      estadoMucosas: 'Mucosas', tiempoLlenadoCapilar: 'Llenado Capilar',
                    };
                    return (
                      <div key={key} className="bg-gray-50 dark:bg-[#2C2C2C] rounded-lg p-2.5">
                        <p className="text-[10px] text-gray-400 dark:text-[#808080] uppercase">{labels[key] || key}</p>
                        <p className="text-xs font-semibold text-gray-800 dark:text-[#E0E0E0]">{val}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="border-t border-gray-100 dark:border-[#333] pt-4 mb-4">
                <p className="text-xs font-semibold text-gray-500 dark:text-[#909090] uppercase tracking-wider mb-2">Diagnóstico</p>
                <ul className="space-y-1">
                  {selectedConsulta.diagnostico.map(function (d, i) {
                    return <li key={i} className="flex items-start gap-2 text-sm text-gray-700 dark:text-[#C0C0C0]"><span className="text-emerald-500 dark:text-emerald-400 mt-0.5 shrink-0">{'\u2022'}</span>{d}</li>;
                  })}
                </ul>
              </div>

              <div className="border-t border-gray-100 dark:border-[#333] pt-4 mb-4">
                <p className="text-xs font-semibold text-gray-500 dark:text-[#909090] uppercase tracking-wider mb-2">Recomendaciones</p>
                <ul className="space-y-1">
                  {selectedConsulta.recomendaciones.map(function (r, i) {
                    return <li key={i} className="flex items-start gap-2 text-sm text-gray-700 dark:text-[#C0C0C0]"><span className="text-blue-500 dark:text-blue-400 mt-0.5 shrink-0">{'\u25B8'}</span>{r}</li>;
                  })}
                </ul>
              </div>

              <div className="border-t border-gray-100 dark:border-[#333] pt-4 mb-4">
                <p className="text-xs font-semibold text-gray-500 dark:text-[#909090] uppercase tracking-wider mb-2">Tratamiento</p>
                <div className="space-y-2">
                  {selectedConsulta.tratamiento.map(function (t, i) {
                    return (
                      <div key={i} className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-2.5">
                        <p className="text-xs font-semibold text-blue-800 dark:text-blue-300">{t.medicamento}</p>
                        <p className="text-[11px] text-blue-600 dark:text-blue-400">{t.dosis} · {t.frecuencia}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="border-t border-gray-100 dark:border-[#333] pt-4">
                <p className="text-xs font-semibold text-gray-500 dark:text-[#909090] uppercase tracking-wider mb-2">Observaciones</p>
                <p className="text-sm text-gray-700 dark:text-[#C0C0C0] leading-relaxed">{selectedConsulta.observaciones}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {showModal && <NuevaConsultaModal onClose={function () { setShowModal(false); }} />}
    </div>
  );
}

export default HistoriaClinicaPage;
