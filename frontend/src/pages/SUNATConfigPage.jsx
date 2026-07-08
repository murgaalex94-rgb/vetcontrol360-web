import { useState, useEffect } from "react";

const ROL_ADMIN = 1;
const ROL_VETERINARIO = 2;

export default function SUNATConfigPage() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const idRol = user.idRol;

  const [config, setConfig] = useState({
    modo: "demo",
    ruc: "",
    razonSocial: "",
    usuarioSol: "MODDATOS",
    claveSol: "MODDATOS",
    urlEnvio: "https://e-beta.sunat.gob.pe/ol-ti-itcpfegem-beta/billService",
    certificadoPath: "",
  });

  const [comprobantes, setComprobantes] = useState([]);

  useEffect(() => {
    fetchConfig();
    fetchComprobantes();
  }, []);

  const fetchConfig = () => {
    setConfig({
      modo: import.meta.env.VITE_SUNAT_MODO || "demo",
      ruc: import.meta.env.VITE_SUNAT_RUC || "20600085510",
      razonSocial: import.meta.env.VITE_SUNAT_RAZON_SOCIAL || "MI EMPRESA SAC",
      usuarioSol: import.meta.env.VITE_SUNAT_USUARIO_SOL || "MODDATOS",
      claveSol: import.meta.env.VITE_SUNAT_CLAVE_SOL || "MODDATOS",
      urlEnvio:
        import.meta.env.VITE_SUNAT_URL_ENVIO ||
        "https://e-beta.sunat.gob.pe/ol-ti-itcpfegem-beta/billService",
      certificadoPath: import.meta.env.VITE_SUNAT_CERT_PATH || "",
    });
  };

  const fetchComprobantes = async () => {
    try {
      const res = await fetch("/api/facturas/electronica/todos");
      if (res.ok) setComprobantes(await res.json());
    } catch {
      console.log("No se pudieron cargar comprobantes");
    }
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-3">Modo</h2>
          <span
            className={`px-3 py-1 rounded-full text-sm font-bold ${
              config.modo === "demo"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-green-100 text-green-800"
            }`}
          >
            {config.modo === "demo" ? "DEMO (Pruebas)" : "PRODUCCION"}
          </span>
          <p className="text-sm text-gray-500 mt-2">
            {config.modo === "demo"
              ? "Usando endpoint de pruebas de SUNAT (e-beta). No se generan comprobantes reales."
              : "Enviando a SUNAT produccion."}
          </p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-3">Emisor</h2>
          <p className="text-sm">
            <span className="font-medium">RUC:</span> {config.ruc}
          </p>
          <p className="text-sm">
            <span className="font-medium">Razon Social:</span>{" "}
            {config.razonSocial}
          </p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-3">Credenciales SOL</h2>
          <p className="text-sm">
            <span className="font-medium">Usuario:</span> {config.usuarioSol}
          </p>
          <p className="text-sm">
            <span className="font-medium">URL Envio:</span>
          </p>
          <p className="text-xs text-gray-500 break-all">{config.urlEnvio}</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-3">Certificado Digital</h2>
          <p className="text-sm">
            {config.certificadoPath
              ? `Ruta: ${config.certificadoPath}`
              : "No configurado. En modo demo se usa firma mock."}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {config.modo === "demo"
              ? "No se requiere certificado en modo demo."
              : "Coloca un certificado .p12/.pfx valido emitido por SUNAT."}
          </p>
        </div>
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
