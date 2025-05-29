import { ProgressBar } from "react-bootstrap";
//definimos los tipos de datos que puede recibir
type DangerBarProps = {
  value: number;
};
//El componente hijo tiene "Argumentos" del tipo "DangerBarProps"
const DangerBar = ({ value }: DangerBarProps) => {
  //Logica segun el valor recibido
  const getVariant = (value: number) => {
    if (value < 30) {
      return "sucess";
    } else if (value < 60) {
      return "Warning";
    } else {
      return "danger";
    }
  };

  return <ProgressBar animated now={value} variant={getVariant(value)} />;
};

export default DangerBar;
