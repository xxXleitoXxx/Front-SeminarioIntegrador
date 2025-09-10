import React, { useEffect, useMemo, useState } from "react";
import { reporteGralHistService } from "../services/ReporteGralHistService";
import { ReporteGralHistDTO } from "../types/ReporteGralHistDTO";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = ["#0088FE", "#FF8042"];

const Reportes: React.FC = () => {
  const [data, setData] = useState<ReporteGralHistDTO | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLocalidad, setSelectedLocalidad] = useState<string | null>(
    null
  );
  const [SelectedTipoClase, setSelectedTipoClase] = useState<string | null>(
    null
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const resp = await reporteGralHistService.getReporteGralHist();
        setData(resp);
        // preseleccionar la primera localidad si existe
        if (resp.reporteXLocalidad && resp.reporteXLocalidad.length > 0) {
          setSelectedLocalidad(resp.reporteXLocalidad[0].nombreLocalidad);
        }
        if (resp.reporteXTipoClase && resp.reporteXTipoClase.length > 0) {
          setSelectedTipoClase(resp.reporteXTipoClase[0].nombreTipoClase);
        }
      } catch (e: any) {
        setError(e?.message ?? "Error al cargar los reportes");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const barData = useMemo(() => {
    if (!data) return [];
    return data.reporteXLocalidad.map((r) => ({
      nombreLocalidad: r.nombreLocalidad,
      alumnos: r.alumnosXLocalidadDTO,
    }));
  }, [data]);

  // En ausencia de presentes/ausentes por localidad en el DTO de ejemplo,
  // derivamos un ejemplo simple: presentes = 0, ausentes = alumnos
  // Si backend añade métricas por localidad, se reemplaza aquí.
  const pieData = useMemo(() => {
    if (!data || !SelectedTipoClase) return [];
    const loc = data.reporteXTipoClase.find(
      (l) => l.nombreTipoClase === SelectedTipoClase
    );
    if (!loc) return [];
    const presentes =
      (loc as any).presenteTotalClases ?? loc.presenteTotalClases;
    const ausentes = (loc as any).ausenteTotalClases ?? loc.ausenteTotalClases;
    return [
      { name: "Presentes", value: presentes },
      { name: "Ausentes", value: ausentes },
    ];
  }, [data, selectedLocalidad]);

  if (loading) return <div>Cargando reportes...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!data) return <div>No hay datos de reportes.</div>;

  return (
    <div className="container-fluid">
      <h2 className="mb-4">Reportes Generales</h2>
      <div className="row g-4">
        <div className="col-12 col-lg-7">
          <div className="card">
            <div className="card-header">Alumnos por Localidad</div>
            <div className="card-body" style={{ height: 380 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={barData}
                  margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="nombreLocalidad" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="alumnos" name="Alumnos" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-5">
          <div className="card h-100">
            <div className="card-header d-flex align-items-center justify-content-between">
              <span>Presentes vs Ausentes por TipoClase</span>
              <select
                className="form-select form-select-sm w-auto"
                value={SelectedTipoClase ?? ""}
                onChange={(e) => setSelectedTipoClase(e.target.value)}
              >
                {data.reporteXTipoClase.map((l) => (
                  <option key={l.nombreTipoClase} value={l.nombreTipoClase}>
                    {l.nombreTipoClase}
                  </option>
                ))}
              </select>
            </div>
            <div className="card-body" style={{ height: 380 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={110}
                    label
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
              {pieData.length === 0 && (
                <div className="text-muted small mt-2">
                  Sin datos para la localidad seleccionada.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4 mt-1">
        <div className="col-12">
          <div className="card">
            <div className="card-header">Totales</div>
            <div className="card-body">
              <div className="d-flex flex-wrap gap-3">
                <span className="badge bg-primary">
                  Inscriptos: {data.alumnoTotalesInscriptos}
                </span>
                <span className="badge bg-secondary">
                  No Inscriptos: {data.alumnoTotalesNoInscriptos}
                </span>
                <span className="badge bg-success">
                  Activos: {data.alumnoTotalesActivos}
                </span>
                <span className="badge bg-danger">
                  Inactivos: {data.alumnoTotalesInactivos}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reportes;
