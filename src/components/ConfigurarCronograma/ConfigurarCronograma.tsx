import React, { useEffect, useState } from 'react';
import { Button, Table, Badge, Modal, Form, Alert } from 'react-bootstrap';
import { PlusCircle, Clock, ExclamationTriangle } from 'react-bootstrap-icons';
import { toast } from 'react-toastify';
import type { 
  ConfHorarioTipoClaseDTO, 
  HorarioiDiaxTipoClaseDTO,
  TipoClaseDTO,
  DiaDTO
} from '../../types';
import { ConfHorarioTipoClaseService } from '../../services/ConfHorarioTipoClaseService';
import { HorarioiDiaxTipoClaseService } from '../../services/HorarioiDiaxTipoClaseService';
import { TipoClaseService } from '../../services/TipoClaseService';
import './ConfigurarCronograma.css';

const ConfigurarCronograma: React.FC = () => {
  const [configuraciones, setConfiguraciones] = useState<ConfHorarioTipoClaseDTO[]>([]);
  const [horarios, setHorarios] = useState<{ [confId: number]: HorarioiDiaxTipoClaseDTO[] }>({});
  const [tiposClase, setTiposClase] = useState<TipoClaseDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showHorariosModal, setShowHorariosModal] = useState(false);
  const [selectedConfig, setSelectedConfig] = useState<ConfHorarioTipoClaseDTO | null>(null);
  const [selectedHorarios, setSelectedHorarios] = useState<HorarioiDiaxTipoClaseDTO[]>([]);

  // Estado para nueva configuración
  const [nuevaConfiguracion, setNuevaConfiguracion] = useState<ConfHorarioTipoClaseDTO>({
    nroConfTC: 0,
    fechaVigenciaConf: new Date(),
    fechaFinVigenciaConf: null,
    horarioiDiaxTipoClaseList: []
  });

  // Estados para nuevo horario
  const [nuevoHorario, setNuevoHorario] = useState<HorarioiDiaxTipoClaseDTO>({
    nroHFxTC: 0,
    fechaBajaHFxTC: null,
    horaDesde: '08:00:00',
    horaHasta: '09:00:00',
    diaDTO: {
      codDia: 1,
      fechaBajaDia: null,
      nombreDia: 'Lunes'
    },
    tipoClase: {
      codTipoClase: 1,
      fechaBajaTipoClase: null,
      nombreTipoClase: '',
      descripcionTipoClase: ''
    }
  });

  const diasSemana = [
    { codDia: 1, nombreDia: 'Lunes' },
    { codDia: 2, nombreDia: 'Martes' },
    { codDia: 3, nombreDia: 'Miércoles' },
    { codDia: 4, nombreDia: 'Jueves' },
    { codDia: 5, nombreDia: 'Viernes' },
    { codDia: 6, nombreDia: 'Sábado' },
    { codDia: 7, nombreDia: 'Domingo' }
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      
      const [configsData, tiposClaseData] = await Promise.all([
        ConfHorarioTipoClaseService.getConfiguraciones(),
        TipoClaseService.getTipoClases()
      ]);
      
      setConfiguraciones(configsData);
      setTiposClase(tiposClaseData);
      
      // Cargar horarios para cada configuración
      const horariosData: { [confId: number]: HorarioiDiaxTipoClaseDTO[] } = {};
      for (const config of configsData) {
        try {
          const horariosConfig = await HorarioiDiaxTipoClaseService.getHorariosPorConf(config.nroConfTC);
          horariosData[config.nroConfTC] = horariosConfig;
        } catch (error) {
          console.error(`Error cargando horarios para configuración ${config.nroConfTC}:`, error);
          horariosData[config.nroConfTC] = [];
        }
      }
      setHorarios(horariosData);
    } catch (error) {
      console.error('Error cargando datos:', error);
      toast.error('Error al cargar las configuraciones');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return 'No definida';
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const formatTime = (timeString: string | null) => {
    if (!timeString) return '--:--';
    return timeString.substring(0, 5);
  };

  const createTimeString = (timeString: string): string => {
    return timeString + ':00';
  };

  const validateHorarios = (horarios: HorarioiDiaxTipoClaseDTO[]): string | null => {
    // Verificar que cada horario tenga horaHasta > horaDesde
    for (const horario of horarios) {
      if (horario.horaHasta <= horario.horaDesde) {
        const diaNombre = horario.diaDTO.nombreDia;
        return `❌ En ${diaNombre}: La hora de fin debe ser posterior a la hora de inicio (${formatTime(horario.horaDesde)}-${formatTime(horario.horaHasta)})`;
      }
    }
    
    // Agrupar horarios por día
    const horariosPorDia: { [dia: number]: HorarioiDiaxTipoClaseDTO[] } = {};
    
    horarios.forEach(horario => {
      const dia = horario.diaDTO.codDia;
      if (!horariosPorDia[dia]) {
        horariosPorDia[dia] = [];
      }
      horariosPorDia[dia].push(horario);
    });

    // Verificar solapamientos por día
    for (const [dia, horariosDia] of Object.entries(horariosPorDia)) {
      for (let i = 0; i < horariosDia.length; i++) {
        for (let j = i + 1; j < horariosDia.length; j++) {
          const horario1 = horariosDia[i];
          const horario2 = horariosDia[j];
          
          // Verificar si hay solapamiento usando strings TIME
          if (horario1.horaDesde < horario2.horaHasta && horario1.horaHasta > horario2.horaDesde) {
            const diaNombre = horario1.diaDTO.nombreDia;
            return `❌ Los horarios se solapan en ${diaNombre}: ${formatTime(horario1.horaDesde)}-${formatTime(horario1.horaHasta)} y ${formatTime(horario2.horaDesde)}-${formatTime(horario2.horaHasta)}`;
          }
        }
      }
    }
    
    return null;
  };

  const handleVerHorarios = (config: ConfHorarioTipoClaseDTO) => {
    try {
      setSelectedConfig(config);
      const horariosConfig = horarios[config.nroConfTC] || [];
      setSelectedHorarios(horariosConfig);
      setShowHorariosModal(true);
    } catch (error) {
      console.error('Error al mostrar horarios:', error);
      toast.error('Error al cargar los horarios');
    }
  };

  const handleCreateConfiguracion = () => {
    // Mostrar advertencia antes de abrir el modal
    toast.warning(
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <ExclamationTriangle color="#ffc107" />
          <strong>¡Advertencia!</strong>
        </div>
        <div>
          Una vez que se cree la nueva configuración, la configuración anterior se dará de baja automáticamente.
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
          background: '#fff3cd',
          color: '#856404',
          border: '1px solid #ffeaa7'
        }
      }
    );
    
    setTimeout(() => {
      setShowCreateModal(true);
    }, 1000);
  };

  const handleAddHorario = () => {
    setNuevaConfiguracion(prev => ({
      ...prev,
      horarioiDiaxTipoClaseList: [...prev.horarioiDiaxTipoClaseList, { ...nuevoHorario }]
    }));
    setNuevoHorario({
      nroHFxTC: 0,
      fechaBajaHFxTC: null,
      horaDesde: '08:00:00',
      horaHasta: '09:00:00',
      diaDTO: {
        codDia: 1,
        fechaBajaDia: null,
        nombreDia: 'Lunes'
      },
      tipoClase: {
        codTipoClase: 1,
        fechaBajaTipoClase: null,
        nombreTipoClase: '',
        descripcionTipoClase: ''
      }
    });
  };

  const handleRemoveHorario = (index: number) => {
    setNuevaConfiguracion(prev => ({
      ...prev,
      horarioiDiaxTipoClaseList: prev.horarioiDiaxTipoClaseList.filter((_, i) => i !== index)
    }));
  };

  const handleSubmitConfiguracion = async () => {
    try {
      if (nuevaConfiguracion.horarioiDiaxTipoClaseList.length === 0) {
        toast.error('Debe agregar al menos un horario');
        return;
      }

      const validationError = validateHorarios(nuevaConfiguracion.horarioiDiaxTipoClaseList);
      if (validationError) {
        toast.error(validationError);
        return;
      }

      const result = await ConfHorarioTipoClaseService.crearConfiguracion(nuevaConfiguracion);
      
      if (typeof result === 'string') {
        toast.success(result);
      } else {
        toast.success('Configuración creada exitosamente');
      }
      
      setShowCreateModal(false);
      setShowConfirmModal(false);
      setNuevaConfiguracion({
        nroConfTC: 0,
        fechaVigenciaConf: new Date(),
        fechaFinVigenciaConf: null,
        horarioiDiaxTipoClaseList: []
      });
      fetchData();
    } catch (error) {
      console.error('Error creando configuración:', error);
      
      let errorMessage = 'Error al crear la configuración';
      if (error instanceof Error) {
        errorMessage = error.message;
        if (errorMessage.includes('se solapa') || errorMessage.includes('solapa')) {
          toast.error(`❌ ${errorMessage}`, {
            position: "top-center",
            autoClose: 8000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            style: {
              background: '#f8d7da',
              color: '#721c24',
              border: '1px solid #f5c6cb'
            }
          });
          return;
        }
      }
      
      toast.error(`Error al crear la configuración: ${errorMessage}`, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        style: {
          background: '#f8d7da',
          color: '#721c24',
          border: '1px solid #f5c6cb'
        }
      });
    }
  };

  const handleConfirmCreate = () => {
    setShowConfirmModal(true);
  };

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
          <p className="page-subtitle">Administra las configuraciones de horarios del sistema</p>
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
        <div style={{ textAlign: 'center', padding: '50px' }}>
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
                    <Badge bg="success">Activa</Badge>
                  </td>
                  <td className="text-center">
                    <div className="action-buttons">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => handleVerHorarios(config)}
                        className="btn-action"
                        style={{ minWidth: '120px' }}
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

      {/* Modal para mostrar horarios */}
      <Modal 
        show={showHorariosModal} 
        onHide={() => setShowHorariosModal(false)} 
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            📅 Horarios de Configuración #{selectedConfig?.nroConfTC}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedConfig && (
            <div>
              <div className="mb-3">
                <h6>Información de la Configuración:</h6>
                <div className="row">
                  <div className="col-md-6">
                    <strong>Fecha de Vigencia:</strong> {formatDate(selectedConfig.fechaVigenciaConf)}
                  </div>
                  <div className="col-md-6">
                    <strong>Fecha Fin Vigencia:</strong> {formatDate(selectedConfig.fechaFinVigenciaConf)}
                  </div>
                </div>
              </div>
              
              <hr />
              
              {selectedHorarios.length > 0 ? (
                <div>
                  <h6>Horarios Configurados:</h6>
                  <Table className="table-modern" striped bordered hover>
                    <thead>
                      <tr>
                        <th>Día</th>
                        <th>Hora Desde</th>
                        <th>Hora Hasta</th>
                        <th>Tipo de Clase</th>
                        <th>Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedHorarios.map((horario, index) => (
                        <tr key={index} className="table-row-modern">
                          <td className="text-center">
                            <Badge bg="secondary">
                              {horario.diaDTO.nombreDia}
                            </Badge>
                          </td>
                          <td className="text-center">
                            <Clock className="me-1" />
                            {formatTime(horario.horaDesde)}
                          </td>
                          <td className="text-center">
                            <Clock className="me-1" />
                            {formatTime(horario.horaHasta)}
                          </td>
                          <td className="text-center">
                            <Badge bg="primary">
                              {horario.tipoClase.nombreTipoClase}
                            </Badge>
                          </td>
                          <td className="text-center">
                            {horario.fechaBajaHFxTC ? (
                              <Badge bg="danger">Inactivo</Badge>
                            ) : (
                              <Badge bg="success">Activo</Badge>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                  <p>No hay horarios configurados para esta configuración</p>
                </div>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowHorariosModal(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal para crear nueva configuración */}
      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Nueva Configuración de Cronograma</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Fecha de Vigencia</Form.Label>
              <Form.Control
                type="date"
                value={nuevaConfiguracion.fechaVigenciaConf ? new Date(nuevaConfiguracion.fechaVigenciaConf).toISOString().split('T')[0] : ''}
                onChange={(e) => setNuevaConfiguracion(prev => ({
                  ...prev,
                  fechaVigenciaConf: e.target.value ? new Date(e.target.value) : null
                }))}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Fecha de Fin de Vigencia (Opcional)</Form.Label>
              <Form.Control
                type="date"
                value={nuevaConfiguracion.fechaFinVigenciaConf ? new Date(nuevaConfiguracion.fechaFinVigenciaConf).toISOString().split('T')[0] : ''}
                onChange={(e) => setNuevaConfiguracion(prev => ({
                  ...prev,
                  fechaFinVigenciaConf: e.target.value ? new Date(e.target.value) : null
                }))}
              />
            </Form.Group>

            <hr />
            <h5>Agregar Horarios</h5>
            
            <div className="row">
              <div className="col-md-3">
                <Form.Group className="mb-3">
                  <Form.Label>Día</Form.Label>
                  <Form.Select
                    value={nuevoHorario.diaDTO.codDia}
                    onChange={(e) => {
                      const dia = diasSemana.find(d => d.codDia === parseInt(e.target.value));
                      setNuevoHorario(prev => ({
                        ...prev,
                        diaDTO: {
                          ...prev.diaDTO,
                          codDia: parseInt(e.target.value),
                          nombreDia: dia?.nombreDia || 'Lunes'
                        }
                      }));
                    }}
                  >
                    {diasSemana.map(dia => (
                      <option key={dia.codDia} value={dia.codDia}>
                        {dia.nombreDia}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </div>
              
              <div className="col-md-2">
                <Form.Group className="mb-3">
                  <Form.Label>Hora Desde</Form.Label>
                  <Form.Control
                    type="time"
                    value={formatTime(nuevoHorario.horaDesde)}
                    onChange={(e) => setNuevoHorario(prev => ({
                      ...prev,
                      horaDesde: createTimeString(e.target.value)
                    }))}
                  />
                </Form.Group>
              </div>
              
              <div className="col-md-2">
                <Form.Group className="mb-3">
                  <Form.Label>Hora Hasta</Form.Label>
                  <Form.Control
                    type="time"
                    value={formatTime(nuevoHorario.horaHasta)}
                    onChange={(e) => setNuevoHorario(prev => ({
                      ...prev,
                      horaHasta: createTimeString(e.target.value)
                    }))}
                  />
                </Form.Group>
              </div>
              
              <div className="col-md-3">
                <Form.Group className="mb-3">
                  <Form.Label>Tipo de Clase</Form.Label>
                  <Form.Select
                    value={nuevoHorario.tipoClase.codTipoClase}
                    onChange={(e) => {
                      const tipoClase = tiposClase.find(t => t.codTipoClase === parseInt(e.target.value));
                      setNuevoHorario(prev => ({
                        ...prev,
                        tipoClase: tipoClase || prev.tipoClase
                      }));
                    }}
                  >
                    <option value="">Seleccionar tipo de clase</option>
                    {tiposClase.map(tipo => (
                      <option key={tipo.codTipoClase} value={tipo.codTipoClase}>
                        {tipo.nombreTipoClase}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </div>
              
              <div className="col-md-2 d-flex align-items-end">
                <Button 
                  variant="outline-primary" 
                  onClick={handleAddHorario}
                  disabled={!nuevoHorario.horaDesde || !nuevoHorario.horaHasta || !nuevoHorario.tipoClase.codTipoClase}
                >
                  Agregar
                </Button>
              </div>
            </div>

            {nuevaConfiguracion.horarioiDiaxTipoClaseList.length > 0 && (
              <div className="mt-3">
                <h6>Horarios Agregados:</h6>
                <div className="horarios-list">
                  {nuevaConfiguracion.horarioiDiaxTipoClaseList.map((horario, index) => (
                    <Badge 
                      key={index} 
                      bg="primary" 
                      className="me-2 mb-2 p-2"
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleRemoveHorario(index)}
                    >
                      {horario.diaDTO.nombreDia} {formatTime(horario.horaDesde)}-{formatTime(horario.horaHasta)} 
                      ({horario.tipoClase.nombreTipoClase})
                      <span className="ms-2">×</span>
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
            Cancelar
          </Button>
          <Button 
            variant="primary" 
            onClick={handleConfirmCreate}
            disabled={nuevaConfiguracion.horarioiDiaxTipoClaseList.length === 0}
          >
            Crear Configuración
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal de confirmación */}
      <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Creación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>¿Está seguro que desea crear la nueva configuración de cronograma?</p>
          <p><strong>Vigencia:</strong> {formatDate(nuevaConfiguracion.fechaVigenciaConf)} - {formatDate(nuevaConfiguracion.fechaFinVigenciaConf)}</p>
          <p><strong>Horarios:</strong> {nuevaConfiguracion.horarioiDiaxTipoClaseList.length}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSubmitConfiguracion}>
            Confirmar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ConfigurarCronograma;
