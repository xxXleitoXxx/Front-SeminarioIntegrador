import { Button } from "react-bootstrap";
import ContactoAbmAlumno from "./ContactoAbmAlumno";
import Formulario from "./FormularioAbmAlumno";
import { useState } from "react";

export default function AltaAlumno() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  return (
    <div className="d-flex flex-column">
      <div className="d-flex flex-row justify-content-between">
        <div className="m-0 p-2">
          <h3>Datos del alumno</h3>
          <Formulario />
        </div>

        <div className="m-0 p-2">
          <h3>Contactos de emergencia</h3>
          <ContactoAbmAlumno />
        </div>

        <div className="m-0 p-2">
          <h3>Ficha Médica</h3>
          <div>
            <label htmlFor="pdf-upload" className="form-label">
              Subir PDF de Ficha Médica
            </label>
            <input
              type="file"
              id="pdf-upload"
              accept=".pdf"
              onChange={handleFileChange}
              className="form-control"
            />
            {selectedFile && (
              <p className="mt-2">Archivo seleccionado: {selectedFile.name}</p>
            )}
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-end  flex-row">
        <div className="p-1">
          <Button variant="secondary">cancelar Registro</Button>
        </div>

        <div className="p-1">
          <Button variant="success">Registrar alumno</Button>
        </div>
      </div>
    </div>
  );
}
