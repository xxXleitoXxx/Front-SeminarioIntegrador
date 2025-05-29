import AlertGenerator from "../components/AlertGenerator/AlertGenerator";
import AlertMessage from "../components/AlertMessage/AlertMessage";
import DangerInput from "../components/DangerInput/DangerInput";
import MensajeEnviado from "../components/MensajeEnviado/MensajeEnviado";

const PaginaProps = () => {
  return (
    <div>
      <div>PaginaProps</div>
      <div>
        <DangerInput />
        <MensajeEnviado />
        <AlertMessage />
      </div>
    </div>
  );
};

export default PaginaProps;
