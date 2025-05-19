import "./AtlantisHeader.css";
import "bootstrap/dist/css/bootstrap.min.css";
export default function AtlantisHeader() {
  return (
    <div className="d-flex justify-content-between">
      <div className="p-2">
        <h1>Atlantis System</h1>
      </div>

      <div className="p-2">
        <div className="d-flex flex-row">
          <div className="p-2 d-flex flex-column">
            <h5 className="p-1 m-0">Administrador</h5>
            <h5 className="p-1 m-0">Hernan</h5>
          </div>
          <img
            className="p-2"
            src="public/User-Basic.png"
            width="60"
            height="60"
          />
        </div>
      </div>
    </div>
  );
}
