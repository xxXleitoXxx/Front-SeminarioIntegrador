import { useState } from "react";
import { Form } from "react-bootstrap";
import MensajeRecibido from "../MensajeRecibido/MensajeRecibido";

const MensajeEnviado = () => {
  //definimos la variable que va a cambiar
  const [textValue, setTextValue] = useState("");
  //captura el cambio
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTextValue(event.target.value);
  };
  return (
    <div>
      <h2>Ejemplo 2</h2>
      {/*Clase Padre */}
      <Form.Control
        value={textValue}
        onChange={handleChange}
        size="lg"
        type="text"
        placeholder="Large text"
      />
      {/*Clase Hijo */}
      <MensajeRecibido textValue={textValue} />
    </div>
  );
};

export default MensajeEnviado;
