import { useState, useEffect } from "react";
import API from "../services/axiosConfig";

const ROL_ADMIN = 1;
const ROL_VETERINARIO = 2;

export default function SUNATConfigPage() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const idRol = user.idRol;

  const [config, setConfig] = useState({
    ruc: "",
    razonSocial: "",
    nombreComercial: "",
    direccion: "",
    telefono: "",
    email: "",
    certificadoPath: "",
    certificadoPassword: "",
  });

  const [comprobantes, setComprobantes] = useState([]);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    fetchConfig();
    fetchComprobantes();
  }, []);

  const fetchConfig = () => {
    API.get("/api/empresa")
      .then(function (r) {
        var d = r.data;
        setConfig({
          ruc: d.ruc || "",
          razonSocial: d.razonSocial || "",
          nombreComercial: d.nombreComercial || "",
          direccion: d.direccion || "",
          telefono: d.telefono || "",
          email: d.email || "",
          certificadoPath: d.certificadoPath || "",
          certificadoPassword: d.certificadoPassword || "",
        });
      })
      .catch(function () {
        setConfig({
          ruc: import.meta.env.VITE_SUNAT_RUC || "20600085510",
          razonSocial: import.meta.env.VITE_SUNAT_RAZON_SOCIAL || "MI EMPRESA SAC",
          nombreComercial: "",
          direccion: "",
          telefono: "",
          email: "",
          certificadoPath: import.meta.env.VITE_SUNAT_CERT_PATH || "",
          certificadoPassword: "",
        });
      });
  };

  const fetchComprobantes = async () => {
    try {
      const res = await API.get("/api/facturas/electronica/todos");
      setComprobantes(res.data || []);
    } catch {
      console.log("No se pudieron cargar comprobantes");
    }
  };

  const handleChange = (e) => {
    setConfig(function (prev) { return { ...prev, [e.target.name]: e.target.value }; });
  };

  const handleGuardar = function () {
    setGuardando(true);
    setMensaje("");
    API.put("/api/empresa", config)
      .then(function () {
        setMensaje("Configuración guardada correctamente");
        setTimeout(function () { setMensaje(""); }, 3000);
      })
      .catch(function (err) {
        setMensaje("Error al guardar: " + (err.response?.data?.error || err.message));
      })
      .finally(function () {
        setGuardando(false);
      });
  };

  const estadoBadge = (estado) => {
    const colors = {
      ACEPTADA: "bg-green-100 text-green-800",
      RECHAZADA: "bg-red-100 text-red-800",
      ENVIADO: "bg-blue-100 text-blue-800",
      ERROR: "bg-yellow-100 text-yellow-800",
      ERROR_SIN_CDR: "bg-gray-100 text-gray-800",
    };
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${
          colors[estado] || "bg-gray-100 text-gray-800"
        }`}
      >
        {estado}
      </span>
    );
  };

  if (idRol !== ROL_ADMIN && idRol !== ROL_VETERINARIO) {
    return (
      <div className="p-6 text-red-500 font-semibold">
        No tienes permisos para acceder a esta pagina.
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">
        Configuracion de Facturacion Electronica SUNAT
      </h1>

      {mensaje && (
        <div className={"p-3 rounded-lg text-sm mb-4 " + (mensaje.includes("Error") ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700")}>
          {mensaje}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-3">Modo</h2>
          <span
            className={`px-3 py-1 rounded-full text-sm font-bold ${
              import.meta.env.VITE_SUNAT_MODO !== "produccion"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-green-100 text-green-800"
            }`}
          >
            {import.meta.env.VITE_SUNAT_MODO !== "produccion" ? "DEMO (Pruebas)" : "PRODUCCION"}
          </span>
          <p className="text-sm text-gray-500 mt-2">
            {import.meta.env.VITE_SUNAT_MODO !== "produccion"
              ? "Usando endpoint de pruebas de SUNAT (e-beta). No se generan comprobantes reales."
              : "Enviando a SUNAT produccion."}
          </p>
          <p className="text-xs text-gray-400 mt-1">Configurado via variable de entorno en Render.</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-3">Emisor</h2>
          <div className="space-y-2">
            <div>
              <label className="block text-xs font-medium text-gray-600">RUC</label>
              <input name="ruc" value={config.ruc} onChange={handleChange} maxLength="11" className="w-full rounded border-gray-300 text-sm mt-0.5" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600">Razon Social</label>
              <input name="razonSocial" value={config.razonSocial} onChange={handleChange} className="w-full rounded border-gray-300 text-sm mt-0.5" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600">Nombre Comercial</label>
              <input name="nombreComercial" value={config.nombreComercial} onChange={handleChange} className="w-full rounded border-gray-300 text-sm mt-0.5" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600">Dirección</label>
              <input name="direccion" value={config.direccion} onChange={handleChange} className="w-full rounded border-gray-300 text-sm mt-0.5" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-3">Credenciales SOL</h2>
          <div className="space-y-2">
            <div>
              <label className="block text-xs font-medium text-gray-600">Usuario SOL</label>
              <input value={import.meta.env.VITE_SUNAT_USUARIO_SOL || "MODDATOS"} disabled className="w-full rounded border-gray-200 text-sm mt-0.5 bg-gray-50" />
              <p className="text-[10px] text-gray-400 mt-0.5">Solo configurable via variable de entorno.</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600">URL Envio SUNAT</label>
              <input value={import.meta.env.VITE_SUNAT_URL_ENVIO || "https://e-beta.sunat.gob.pe/ol-ti-itcpfegem-beta/billService"} disabled className="w-full rounded border-gray-200 text-sm mt-0.5 bg-gray-50" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-3">Certificado Digital</h2>
          <div className="space-y-2">
            <div>
              <label className="block text-xs font-medium text-gray-600">Ruta del Certificado</label>
              <input name="certificadoPath" value={config.certificadoPath} onChange={handleChange} placeholder="/app/certificates/cert.p12" className="w-full rounded border-gray-300 text-sm mt-0.5" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600">Contraseña del Certificado</label>
              <input name="certificadoPassword" type="password" value={config.certificadoPassword} onChange={handleChange} placeholder="********" className="w-full rounded border-gray-300 text-sm mt-0.5" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {import.meta.env.VITE_SUNAT_MODO !== "produccion"
              ? "No se requiere certificado en modo demo."
              : "Coloca un certificado .p12/.pfx valido emitido por SUNAT."}
          </p>
        </div>
      </div>

      <div className="flex justify-end mb-8">
        <button
          onClick={handleGuardar}
          disabled={guardando}
          className="px-8 py-2.5 bg-[#5F7B65] text-white rounded-lg hover:bg-[#4a634f] text-sm font-medium transition-colors disabled:opacity-50 cursor-pointer"
        >
          {guardando ? "Guardando..." : "Guardar Configuración"}
        </button>
      </div>

      <h2 className="text-xl font-bold mb-4">
        Comprobantes Electronicos Enviados
      </h2>
      {comprobantes.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow text-center text-gray-500">
          No hay comprobantes electronicos aun. Crea una factura y enviala a
          SUNAT desde la pagina de Facturacion.
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Comprobante</th>
                <th className="px-4 py-3 text-left font-medium">Cliente</th>
                <th className="px-4 py-3 text-left font-medium">Estado SUNAT</th>
                <th className="px-4 py-3 text-left font-medium">Codigo CDR</th>
                <th className="px-4 py-3 text-left font-medium">Fecha</th>
                <th className="px-4 py-3 text-left font-medium">Modo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {comprobantes.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono">
                    {c.serie}-{c.numero}
                  </td>
                  <td className="px-4 py-3">{c.clienteNombre}</td>
                  <td className="px-4 py-3">{estadoBadge(c.sunatEstado)}</td>
                  <td className="px-4 py-3">{c.cdrCodigo || "-"}</td>
                  <td className="px-4 py-3">
                    {c.fechaEnvio
                      ? new Date(c.fechaEnvio).toLocaleString("es-PE")
                      : "-"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs font-medium ${
                        c.modo === "demo"
                          ? "text-yellow-600"
                          : "text-green-600"
                      }`}
                    >
                      {c.modo === "demo" ? "DEMO" : "PROD"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
