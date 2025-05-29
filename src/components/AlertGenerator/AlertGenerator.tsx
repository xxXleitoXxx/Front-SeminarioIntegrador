import { Alert } from "react-bootstrap";
type AlertGeneratorProps = {
  message: string;
};

const AlertGenerator = ({ message }: AlertGeneratorProps) => {
  return (
    <div>
      <Alert variant="success" className="mt-2 w-25">
        <Alert.Heading>Mensaje Recibido</Alert.Heading>
        <p>{message}</p>
      </Alert>
    </div>
  );
};

export default AlertGenerator;
