import { Check2Circle } from "react-bootstrap-icons";

interface DeleteButtonProps {
  onClick: () => void;
}
export const ButtonAlta = ({ onClick }: DeleteButtonProps) => {
  return (
    <Check2Circle
      color="#xF26A"
      size={24}
      onClick={onClick}
      onMouseEnter={() => {
        document.body.style.cursor = "pointer";
      }}
      onMouseLeave={() => {
        document.body.style.cursor = "default";
      }}
    />
  );
};
