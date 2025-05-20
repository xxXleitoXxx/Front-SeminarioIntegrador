//import AltaAlumno from "../assets/AbmAlumno/AltaAlumno";
//import Formulario from "../assets/AbmAlumno/FormularioAbmAlumno";
import AtlantisHeader from "../AtlantisHeader";
import AbmAlumno from "./AbmAlumno";
import Navegacion from "./Navegacion";

function PrincipalPage() {
  return (
    <div>
      <AtlantisHeader />
      <div>
        <Navegacion />
      </div>
      <div className="p-1">
        <AbmAlumno />
      </div>
    </div>
  );
}
export default PrincipalPage;
