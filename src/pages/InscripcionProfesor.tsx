import React, { useState } from "react";
import InscripcionProfesorTable from "../components/InscripcionProfesor/InscripcionProfesorTable";
import "../components/InscripcionProfesor/InscripcionProfesor.css";

const InscripcionProfesor = () => {
  const [refreshData, setRefreshData] = useState<boolean>(false);

  return (
    <div className="inscripcion-profesor-page">
      <div className="page-header">
        <div className="container">
          <div className="row align-items-center">
            <div className="col">
              <h1 className="page-title">
                <span className="title-icon">👨‍🏫</span>
                Gestión de Inscripciones de Profesores
              </h1>
              <p className="page-subtitle">
                Administra las inscripciones de profesores a los diferentes tipos de clases
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="page-content">
        <InscripcionProfesorTable
          refreshData={refreshData}
          setRefreshData={setRefreshData}
        />
      </div>
    </div>
  );
};

export default InscripcionProfesor;
