import TipoClaseTable from "../components/TipoClaseTable/TipoClaseTable";
import RangoEtarioTable from "../components/RangoEtarioTable/RangoEtarioTable";

export default function AbmTipoClaseRango() {
  return (
    <div className="container">
      <div className="row">
        <div className="col-12 col-lg-7 mb-4">
          <TipoClaseTable />
        </div>
        <div className="col-12 col-lg-5 mb-4">
          <RangoEtarioTable />
        </div>
      </div>
    </div>
  );
}


