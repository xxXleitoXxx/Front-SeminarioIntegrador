import { useState } from "react";
import AlertGenerator from "../AlertGenerator/AlertGenerator";
const AlertMessage = () => {
  //Guarda El valor del campo de texto
  const [inputValue, setInputValue] = useState("");
  //guarda el mensaje
  const [message, SetMessage] = useState("");
  //Muestra el componente hijo segun el estado
  const [showAlert, setShowAlert] = useState(false);
  //si el campo no esta vacio se guarda el texto que escribio el usuario en message y se muestra el componente hijo
  const handleClick = () => {
    if (inputValue.trim() !== "") {
      setShowAlert(true);
      SetMessage(inputValue);
    }
  };

  return (
    <div>
      <h2>Ejemplo 4</h2>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <button onClick={handleClick}>Enviar</button>
      {/*Componente hijo */}
      {showAlert && <AlertGenerator message={message} />}
    </div>
  );
};

export default AlertMessage;
