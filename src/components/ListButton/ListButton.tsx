import { ListUl } from "react-bootstrap-icons";

interface ListButtonProps {
  onClick: () => void;
}

export const ListButton = ({ onClick }: ListButtonProps) => {
  return (
    <div style={{ position: 'relative' }}>
      <ListUl
        color="#1976D2"
        size={24}
        onClick={onClick}
        onMouseEnter={() => {
          document.body.style.cursor = "pointer";
        }}
        onMouseLeave={() => {
          document.body.style.cursor = "default";
        }}
        title="Ver artículos del proveedor"
      />
    </div>
  );
}; 