import { Routes, Route } from "react-router-dom";
import AltaAlumno from "../components/AbmAlumno/AltaAlumno";

import AbmAlumno from "../pages/AbmAlumno";
import PaginaPrincipal from "../pages/Main";

function Aplicacion() {
  return (
    <div>
      <div className="Aplicacion">
        <Routes>
          <Route path="/" element={<PaginaPrincipal />} />
          <Route path="abmalumno" element={<AbmAlumno />} />
          <Route path="altaalumno" element={<AltaAlumno />} />
        </Routes>
      </div>
    </div>
  );
}

export default Aplicacion;
