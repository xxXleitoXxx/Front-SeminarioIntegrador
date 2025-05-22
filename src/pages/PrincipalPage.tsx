import AtlantisHeader from "../Header";
import AbmAlumno from "./AbmAlumno";
import Navegacion from "../principalPage/Navegacion";

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
