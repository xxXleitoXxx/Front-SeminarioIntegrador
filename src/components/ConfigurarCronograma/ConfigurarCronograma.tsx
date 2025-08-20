import React, { useEffect, useState } from "react";
import { Button, Table, Badge } from "react-bootstrap";
import { ExclamationTriangle } from "react-bootstrap-icons";
import { toast } from "react-toastify";
import type {
  ConfHorarioTipoClaseDTO,
  HorarioiDiaxTipoClaseDTO,
  TipoClaseDTO,
} from "../../types";
import { ConfHorarioTipoClaseService } from "../../services/ConfHorarioTipoClaseService";
import { HorarioiDiaxTipoClaseService } from "../../services/HorarioiDiaxTipoClaseService";
import { TipoClaseService } from "../../services/TipoClaseService";
import "./ConfigurarCronograma.css";
import NuevaConfiguracionModal from "./NuevaConfiguracionModal";
import VerHorariosModal from "./VerHorariosModal";

const ConfigurarCronograma: React.FC = () => {
  const [configuraciones, setConfiguraciones] = useState<
    ConfHorarioTipoClaseDTO[]
  >([]);
  const [horarios, setHorarios] = useState<{
    [confId: number]: HorarioiDiaxTipoClaseDTO[];
  }>({});
  const [tiposClase, setTiposClase] = useState<TipoClaseDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showHorariosModal, setShowHorariosModal] = useState(false);
  const [selectedConfig, setSelectedConfig] =
    useState<ConfHorarioTipoClaseDTO | null>(null);
  const [selectedHorarios, setSelectedHorarios] = useState<
    HorarioiDiaxTipoClaseDTO[]
  >([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);

      const [configsData, tiposClaseData] = await Promise.all([
        ConfHorarioTipoClaseService.getConfiguraciones(),
        TipoClaseService.getTipoClases(),
      ]);

      setConfiguraciones(configsData);
      setTiposClase(tiposClaseData);

      const horariosData: { [confId: number]: HorarioiDiaxTipoClaseDTO[] } = {};
      for (const config of configsData) {
        try {
          const horariosConfig =
            await HorarioiDiaxTipoClaseService.getHorariosPorConf(
              config.nroConfTC
            );
          horariosData[config.nroConfTC] = horariosConfig;
        } catch (error) {
          console.error(
            `Error cargando horarios para configuración ${config.nroConfTC}:`,
            error
          );
          horariosData[config.nroConfTC] = [];
        }
      }
      setHorarios(horariosData);
    } catch (error) {
      console.error("Error cargando datos:", error);
      toast.error("Error al cargar las configuraciones");
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "No definida";
    return new Date(date).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const handleVerHorarios = (config: ConfHorarioTipoClaseDTO) => {
    try {
      setSelectedConfig(config);
      const horariosConfig = horarios[config.nroConfTC] || [];
      setSelectedHorarios(horariosConfig);
      setShowHorariosModal(true);
    } catch (error) {
      console.error("Error al mostrar horarios:", error);
      toast.error("Error al cargar los horarios");
    }
  };

  const handleCreateConfiguracion = () => {
    // Mostrar advertencia antes de abrir el modal
    toast.warning(
      <div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "8px",
          }}
        >
          <ExclamationTriangle color="#ffc107" />
          <strong>¡Advertencia!</strong>
        </div>
        <div>
          Una vez que se cree la nueva configuración, la configuración anterior
          se dará de baja automáticamente.
        </div>
      </div>,
      {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        style: {
          background: "#fff3cd",
          color: "#856404",
          border: "1px solid #ffeaa7",
        },
      }
    );

    setTimeout(() => {
      setShowCreateModal(true);
    }, 1000);
  };

  const diasSemana = [
    { codDia: 1, nombreDia: "Lunes" },
    { codDia: 2, nombreDia: "Martes" },
    { codDia: 3, nombreDia: "Miércoles" },
    { codDia: 4, nombreDia: "Jueves" },
    { codDia: 5, nombreDia: "Viernes" },
    { codDia: 6, nombreDia: "Sábado" },
    { codDia: 7, nombreDia: "Domingo" },
  ];

  if (isLoading) {
    return (
      <div className="loader-container">
        <div>Cargando configuraciones...</div>
      </div>
    );
  }

  return (
    <div className="configuracion-table-container">
      <div className="page-header">
        <div className="page-title">
          <h1>📅 Configurar Cronograma</h1>
          <p className="page-subtitle">
            Administra las configuraciones de horarios del sistema
          </p>
        </div>
        <Button
          className="btn btn-primary btn-add"
          onClick={handleCreateConfiguracion}
        >
          <span className="btn-icon">+</span>
          Nueva Configuración
        </Button>
      </div>

      {configuraciones.length === 0 ? (
        <div style={{ textAlign: "center", padding: "50px" }}>
          <h3>No hay configuraciones</h3>
          <p>Aún no se han creado configuraciones de cronograma.</p>
        </div>
      ) : (
        <div className="table-container">
          <Table className="table-modern" striped bordered hover>
            <thead>
              <tr>
                <th>Configuración #</th>
                <th>Fecha de Vigencia</th>
                <th>Fecha Fin Vigencia</th>
                <th>Cantidad de Horarios</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {configuraciones.map((config) => (
                <tr key={config.nroConfTC} className="table-row-modern">
                  <td className="text-center">
                    <strong>{config.nroConfTC}</strong>
                  </td>
                  <td className="text-center">
                    {formatDate(config.fechaVigenciaConf)}
                  </td>
                  <td className="text-center">
                    {formatDate(config.fechaFinVigenciaConf)}
                  </td>
                  <td className="text-center">
                    <Badge bg="info" className="horarios-badge">
                      {horarios[config.nroConfTC]?.length || 0} horarios
                    </Badge>
                  </td>
                  <td className="text-center">
                    {config.fechaFinVigenciaConf ? (
                      <Badge bg="danger">Inactiva</Badge>
                    ) : (
                      <Badge bg="success">Activa</Badge>
                    )}
                  </td>
                  <td className="text-center">
                    <div className="action-buttons">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => handleVerHorarios(config)}
                        className="btn-action"
                        style={{ minWidth: "120px" }}
                      >
                        <span>👁️ Ver</span> Horarios
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}

      <NuevaConfiguracionModal
        show={showCreateModal}
        onHide={() => setShowCreateModal(false)}
        tiposClase={tiposClase}
        diasSemana={diasSemana}
        fetchData={fetchData}
      />

      <VerHorariosModal
        show={showHorariosModal}
        onHide={() => setShowHorariosModal(false)}
        selectedConfig={selectedConfig}
        selectedHorarios={selectedHorarios}
      />
    </div>
  );
};

export default ConfigurarCronograma;
