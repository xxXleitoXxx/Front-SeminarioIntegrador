import { Spinner } from "react-bootstrap";
import "./Loader.css";

interface LoaderProps {
  text?: string;
  size?: "small" | "medium" | "large";
  variant?: "fullscreen" | "container";
}

const Loader = ({
  text = "Cargando...",
  size = "medium",
  variant = "container",
}: LoaderProps) => {
  const sizeClass =
    size === "small"
      ? "loader-small"
      : size === "large"
      ? "loader-spinner-large"
      : "loader-spinner";

  const containerClass =
    variant === "container" ? "loader-container" : "loader";

  return (
    <>
      {variant === "fullscreen" && <div className="loader-backdrop" />}
      <div className={containerClass}>
        <div className={sizeClass}></div>
        {text && <div className="loader-text">{text}</div>}
      </div>
    </>
  );
};

export default Loader;
