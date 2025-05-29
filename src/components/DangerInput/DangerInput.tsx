import { useState } from "react";
import { Form } from "react-bootstrap";
import DangerBar from "../DangerBar.tsx/DangerBar";

export default function DangerInput() {
  //variable que va a guardar el valor elegido por el usuario
  const [value, setValue] = useState(0);
  //recibe un evento del dom y actualiza el componente con el valor numerico
  //capturo el evento y guardo
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(Number(event.target.value));
  };
  return (
    <div className="m-3 w-50">
      <h2>Ejemplo1</h2>
      {/*Componente padre */}
      <Form.Range value={value} onChange={handleChange}></Form.Range>
      {/*Componente hijo*/}
      <DangerBar value={value} />·
    </div>
  );
}
