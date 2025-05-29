type MensajeEnviadoProps = {
  textValue: String;
};

const MensajeRecibido = ({ textValue }: MensajeEnviadoProps) => {
  return (
    <div>
      <h3>MensajeRecibido</h3>
      <h4>{textValue}</h4>
    </div>
  );
};

export default MensajeRecibido;
