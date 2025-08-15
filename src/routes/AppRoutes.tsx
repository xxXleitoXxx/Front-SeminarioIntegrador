import { Routes, Route } from "react-router-dom";
import AltaAlumno from "../components/AbmAlumno/AltaAlumno";

import AbmAlumno from "../pages/AbmAlumno";
import PaginaPrincipal from "../pages/Main";
import AbmProfesor from "../pages/AbmProfesor";
import InscripcionClase from "../pages/InscripcionClase";
import ConfigurarCronograma from "../pages/ConfigurarCronograma";

function Aplicacion() {
  return (
    <div>
      <div className="Aplicacion">
        <Routes>
          <Route path="/" element={<PaginaPrincipal />} />
          <Route path="abmalumno" element={<AbmAlumno />} />
          <Route path="altaalumno" element={<AltaAlumno />} />
          <Route path="abmprofesor" element={<AbmProfesor />} />
          <Route path="inscripcion-clase" element={<InscripcionClase />} />
          <Route path="configurar-cronograma" element={<ConfigurarCronograma />} />
        </Routes>
      </div>
    </div>
  );
}

export default Aplicacion;
