import { Routes, Route } from "react-router-dom";

import AbmAlumno from "../pages/AbmAlumno";
import PaginaPrincipal from "../pages/Main";
import AbmProfesor from "../pages/AbmProfesor";
import AbmDia from "../pages/AbmDia";
import AbmTipoClase from "../pages/AbmTipoClase";
// import AbmTipoClaseRango from "../pages/AbmTipoClaseRango";
import AbmLocalidad from "../pages/AbmLocalidad";
import AbmRangoEtario from "../pages/AbmRangoEtario";
import InscripcionClase from "../pages/InscripcionClase";
import InscripcionProfesor from "../pages/InscripcionProfesor";
import CronogramaPage from "../pages/CronogramaPage";
import ConfigurarCronograma from "../pages/ConfigurarCronograma";

function Aplicacion() {
  return (
    <div>
      <div className="Aplicacion">
        <Routes>
          <Route path="/" element={<PaginaPrincipal />} />
          <Route path="gestionalumno" element={<AbmAlumno />} />
          <Route path="gestionprofesor" element={<AbmProfesor />} />
          <Route path="gestiondia" element={<AbmDia />} />
          <Route path="gestiontipoclase" element={<AbmTipoClase />} />
          <Route path="gestionlocalidad" element={<AbmLocalidad />} />
          <Route path="gestionrangoetario" element={<AbmRangoEtario />} />
          <Route path="inscripcion-clase" element={<InscripcionClase />} />
          <Route path="inscripcion-profesor" element={<InscripcionProfesor />} />
          <Route path="cronograma" element={<CronogramaPage />} />
          <Route
            path="configurar-cronograma"
            element={<ConfigurarCronograma />}
          />
        </Routes>
      </div>
    </div>
  );
}

export default Aplicacion;
