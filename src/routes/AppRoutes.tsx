import { Routes, Route } from "react-router-dom";
import { SideBar } from "../principalPage/SideBar";
import Header from "../Header";
import AbmAlumno from "../pages/AbmAlumno";
import PaginaPrincipal from "../pages/Main";
import AbmProfesor from "../pages/AbmProfesor";
import AbmDia from "../pages/AbmDia";
import AbmTipoClase from "../pages/AbmTipoClase";
import AbmLocalidad from "../pages/AbmLocalidad";
import AbmRangoEtario from "../pages/AbmRangoEtario";
import InscripcionClase from "../pages/InscripcionClase";
import ConfigurarCronograma from "../pages/ConfigurarCronograma";
import InscripcionProfesor from "../pages/InscripcionProfesor";

function Aplicacion() {
  return (
    <div className="d-flex">
      <SideBar isModalOpen={false} />
      <div className="flex-grow-1 d-flex flex-column">
        <div className="p-0 m-0">
          <Header />
        </div>
        <div
          className="flex-grow-1 overflow-auto p-3"
          style={{ height: "calc(100vh - 80px)" }}
        >
          <Routes>
            <Route path="/" element={<PaginaPrincipal />} />
            <Route path="gestionalumno" element={<AbmAlumno />} />
            <Route path="gestionprofesor" element={<AbmProfesor />} />
            <Route path="gestiondia" element={<AbmDia />} />
            <Route path="gestiontipoclase" element={<AbmTipoClase />} />
            <Route path="gestionlocalidad" element={<AbmLocalidad />} />
            <Route path="gestionrangoetario" element={<AbmRangoEtario />} />
            <Route path="inscripcion-clase" element={<InscripcionClase />} />
            <Route
              path="inscripcion-profesor"
              element={<InscripcionProfesor />}
            />
            <Route
              path="configurar-cronograma"
              element={<ConfigurarCronograma />}
            />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default Aplicacion;
