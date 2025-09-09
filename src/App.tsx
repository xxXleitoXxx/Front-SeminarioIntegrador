import { BrowserRouter } from "react-router-dom";
import Aplicacion from "./routes/AppRoutes";
import { Container } from "react-bootstrap";
import { ToastContainer } from "react-toastify";
import { Suspense } from "react";
import Loader from "./components/Loader/Loader";
import { AuthProvider } from "./contexts/AuthContext";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ToastContainer />
        <Container
          style={{ minHeight: "100vh", minWidth: "100%", padding: "0" }}
        >
          <Suspense fallback={<Loader variant="container" />}>
            <Aplicacion />
          </Suspense>
        </Container>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
