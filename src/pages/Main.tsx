
import CronogramaPage from "./CronogramaPage";
import CumpleanosProximos from "../components/CumpleanosProximos";
import FichasMedicasProximas from "../components/FichasMedicasProximas";

export default function Main() {
  return (
    <div className="d-flex flex-column justify-content-between">
      <div className="d-flex flex-row">
      </div>
      <div className="p-1">
        <CronogramaPage />
      </div>

     
      <div>
        <CumpleanosProximos />
      </div>
      <div className="p-1">
        <FichasMedicasProximas />
      </div>
    </div>
  );
}
