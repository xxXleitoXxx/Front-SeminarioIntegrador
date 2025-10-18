import { useState, useEffect } from "react";
import { Card, Badge, Spinner } from "react-bootstrap";
import type { ConfHorarioTipoClaseDTO, HorarioiDiaxTipoClaseDTO, TipoClaseDTO } from "../../types";
import { ConfHorarioTipoClaseService } from "../../services/ConfHorarioTipoClaseService";
import { HorarioiDiaxTipoClaseService } from "../../services/HorarioiDiaxTipoClaseService";
import { toast } from "react-toastify";
import "./Cronograma.css";
import EmptyState from "../EmptyState/EmptyState";

const Cronograma = () => {
  const [configuracionVigente, setConfiguracionVigente] = useState<ConfHorarioTipoClaseDTO | null>(null);
  const [horarios, setHorarios] = useState<HorarioiDiaxTipoClaseDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [tiposClase, setTiposClase] = useState<TipoClaseDTO[]>([]);

  // Generar horarios dinámicamente basados en la configuración vigente
  const [horariosDisponibles, setHorariosDisponibles] = useState<string[]>([]);

  // Días de la semana
  const dias = [
    { codDia: 1, nombre: "LUNES" },
    { codDia: 2, nombre: "MARTES" },
    { codDia: 3, nombre: "MIÉRCOLES" },
    { codDia: 4, nombre: "JUEVES" },
    { codDia: 5, nombre: "VIERNES" },
    { codDia: 6, nombre: "SÁBADOS" }
  ];

  useEffect(() => {
    const fetchConfiguracionVigente = async () => {
      try {
        setLoading(true);
        const configuraciones = await ConfHorarioTipoClaseService.getConfiguraciones();

        // Buscar la configuración vigente (sin fecha de fin de vigencia o con fecha futura)
        const hoy = new Date();
        const configVigente = configuraciones.find(config => {
          if (config.fechaHoraBaja) return false; // Configuración dada de baja
          if (!config.fechaVigenciaConf) return false; // Sin fecha de vigencia

          const fechaVigencia = new Date(config.fechaVigenciaConf);
          if (fechaVigencia > hoy) return false; // Aún no vigente

          if (config.fechaFinVigenciaConf) {
            const fechaFinVigencia = new Date(config.fechaFinVigenciaConf);
            if (fechaFinVigencia < hoy) return false; // Ya no vigente
          }

          return true;
        });

        if (configVigente) {
          setConfiguracionVigente(configVigente);

          // Obtener horarios usando el nuevo endpoint
          const horariosConfig = await HorarioiDiaxTipoClaseService.getHorariosPorConf(configVigente.nroConfTC);
          setHorarios(horariosConfig);

          // Debug: Verificar datos de tipos de clase
          console.log("Configuración vigente cargada:", configVigente);
          console.log("Horarios obtenidos del endpoint:", horariosConfig);

          // Extraer tipos de clase únicos para la leyenda
          const tiposUnicos = horariosConfig
            .map(horario => horario.tipoClase)
            .filter((tipo, index, self) =>
              index === self.findIndex(t => t.codTipoClase === tipo.codTipoClase)
            );

          console.log("Tipos de clase únicos:", tiposUnicos);
          setTiposClase(tiposUnicos);

          // Generar horarios únicos basados en la configuración
          const horariosUnicos = generarHorariosUnicos(horariosConfig);
          setHorariosDisponibles(horariosUnicos);
        } else {
          toast.warning("No hay configuración vigente para mostrar");
        }
      } catch (error) {
        console.error("Error al cargar la configuración:", error);
        toast.error("Error al cargar el cronograma");
      } finally {
        setLoading(false);
      }
    };

    fetchConfiguracionVigente();
  }, []);

  const formatTime = (timeString: string): string => {
    if (!timeString) return "";
    try {
      // Convertir formato HH:MM:SS a HH:MM
      const [hours, minutes] = timeString.split(':');
      return `${hours}:${minutes}`;
    } catch {
      return "";
    }
  };

  const generarHorariosUnicos = (horariosConfig: HorarioiDiaxTipoClaseDTO[]): string[] => {
    const horariosSet = new Set<string>();

    horariosConfig.forEach(horario => {
      if (!horario.fechaBajaHFxTC) { // Solo horarios activos
        const horaDesde = formatTime(horario.horaDesde);
        const horaHasta = formatTime(horario.horaHasta);
        const horarioString = `${horaDesde}hs a ${horaHasta}hs`;
        horariosSet.add(horarioString);
      }
    });

    // Ordenar horarios por hora de inicio
    return Array.from(horariosSet).sort((a, b) => {
      const horaA = parseInt(a.split('hs')[0]);
      const horaB = parseInt(b.split('hs')[0]);
      return horaA - horaB;
    });
  };

  const getHorarioForTimeSlot = (diaCod: number, horarioDisponible: string): HorarioiDiaxTipoClaseDTO | null => {
    // Extraer las horas del string de horario disponible
    const [horaInicioStr] = horarioDisponible.split("hs a");
    const horaInicio = horaInicioStr.trim();

    return horarios.find(horario => {
      if (horario.diaDTO?.codDia !== diaCod) return false;
      if (horario.fechaBajaHFxTC) return false; // Horario dado de baja

      const horarioHoraDesde = formatTime(horario.horaDesde);

      return horarioHoraDesde === horaInicio;
    }) || null;
  };

  const getColorForTipoClase = (tipoClase: string): string => {
    const colores: { [key: string]: string } = {
      "NATACIÓN ADULTO": "#FFD700", // Amarillo
      "AQUA ZUMBA": "#90EE90", // Verde claro
      "NATACIÓN INFANTIL 1": "#87CEEB", // Azul claro
      "NATACIÓN INFANTIL 2": "#DDA0DD", // Púrpura
      "PILETA LIBRE": "#FFFFFF", // Blanco
      "NATACIÓN JUVENIL": "#FFD700", // Amarillo
    };

    return colores[tipoClase] || "#E0E0E0"; // Gris por defecto
  };

  const getRangoEtario = (tipoClase: any): string => {
    if (!tipoClase) return "";

    // Verificar si existe rangoEtarioDTO
    if (!tipoClase.rangoEtarioDTO) {
      console.log("No hay rangoEtarioDTO para:", tipoClase.nombreTipoClase);
      // Mostrar información alternativa si no hay rango etario
      return tipoClase.cupoMaxTipoClase ? `(Cupo: ${tipoClase.cupoMaxTipoClase})` : "";
    }

    const { edadDesde, edadHasta } = tipoClase.rangoEtarioDTO;

    // Verificar que las edades existan y sean números válidos
    if (edadDesde === undefined || edadHasta === undefined ||
      edadDesde === null || edadHasta === null) {
      console.log("Edades no válidas para:", tipoClase.nombreTipoClase, { edadDesde, edadHasta });
      // Mostrar información alternativa si las edades no son válidas
      return tipoClase.cupoMaxTipoClase ? `(Cupo: ${tipoClase.cupoMaxTipoClase})` : "";
    }

    if (edadDesde === edadHasta) {
      return `(${edadDesde} años)`;
    }
    return `(de ${edadDesde} a ${edadHasta} años)`;
  };

  if (loading) {
    return (
      <div className="cronograma-loading">
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Cargando...</span>
        </Spinner>
        <p className="mt-3">Cargando cronograma...</p>
      </div>
    );
  }

  if (!configuracionVigente) {
    return (

      <div className="cronograma-container">
        <div className="cronograma-header">
          <h1 className="cronograma-title">
            <span className="title-icon">📅</span>
            Cronograma de Clases
          </h1>
          <EmptyState
            title="No hay configuración vigente para mostrar"
            message="Cree un cronograma para ver los horarios semanales"
            icon="📅"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="cronograma-container">
      <div className="cronograma-header">
        <h1 className="cronograma-title">
          <span className="title-icon">📅</span>
          Cronograma de Clases
        </h1>
        <p className="cronograma-subtitle">
          Configuración Vigente #{configuracionVigente.nroConfTC} - Horarios obtenidos del endpoint específico
        </p>
      </div>

      <div className="cronograma-table-container">
        <div className="cronograma-table">
          {/* Header con días */}
          <div className="cronograma-row header-row">
            <div className="cronograma-cell header-cell">HORARIOS</div>
            {dias.map(dia => (
              <div key={dia.codDia} className="cronograma-cell header-cell">
                {dia.nombre}
              </div>
            ))}
          </div>

          {/* Filas de horarios */}
          {horariosDisponibles.length > 0 ? (
            horariosDisponibles.map((horarioDisponible, index) => (
              <div key={index} className="cronograma-row">
                <div className="cronograma-cell time-cell">
                  {horarioDisponible}
                </div>
                {dias.map(dia => {
                  const horario = getHorarioForTimeSlot(dia.codDia, horarioDisponible);

                  // Debug: Verificar datos del horario
                  if (horario) {
                    console.log("Horario encontrado para", dia.nombre, horarioDisponible, ":", horario);
                    console.log("Tipo de clase:", horario.tipoClase);
                    console.log("Rango etario:", horario.tipoClase?.rangoEtarioDTO);
                  }

                  return (
                    <div key={dia.codDia} className="cronograma-cell">
                      {horario ? (
                        <Card
                          className="clase-card"
                          style={{
                            backgroundColor: getColorForTipoClase(horario.tipoClase?.nombreTipoClase || ""),
                            border: horario.tipoClase?.nombreTipoClase === "PILETA LIBRE" ? "1px solid #ccc" : "none"
                          }}
                        >
                          <Card.Body className="clase-card-body">
                            <Card.Title className="clase-title">
                              {horario.tipoClase?.nombreTipoClase || "Sin nombre"}
                            </Card.Title>
                            <Card.Text className="clase-rango">
                              {getRangoEtario(horario.tipoClase)}
                            </Card.Text>
                            <Card.Text className="clase-horario">
                              <small>
                                {formatTime(horario.horaDesde)} - {formatTime(horario.horaHasta)}
                              </small>
                            </Card.Text>
                          </Card.Body>
                        </Card>
                      ) : (
                        <div className="empty-slot">
                          <span className="empty-text">-</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))
          ) : (
            <div className="cronograma-row">
              <div className="cronograma-cell time-cell">
                Sin horarios
              </div>
              {dias.map(dia => (
                <div key={dia.codDia} className="cronograma-cell">
                  <div className="empty-slot">
                    <span className="empty-text">-</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Leyenda dinámica basada en tipos de clase vigentes */}
      {tiposClase.length > 0 && (
        <div className="cronograma-leyenda">
          <h4>Tipos de Clase Vigentes:</h4>
          <div className="leyenda-items">
            {tiposClase.map((tipoClase) => (
              <div key={tipoClase.codTipoClase} className="leyenda-item">
                <div
                  className="leyenda-color"
                  style={{
                    backgroundColor: getColorForTipoClase(tipoClase.nombreTipoClase || ""),
                    border: tipoClase.nombreTipoClase === "PILETA LIBRE" ? "1px solid #ccc" : "none"
                  }}
                ></div>
                <span>{tipoClase.nombreTipoClase}</span>
                {tipoClase.rangoEtarioDTO && (
                  <small className="leyenda-rango">
                    ({tipoClase.rangoEtarioDTO.edadDesde}-{tipoClase.rangoEtarioDTO.edadHasta} años)
                  </small>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Cronograma;
