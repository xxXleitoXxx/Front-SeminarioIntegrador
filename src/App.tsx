import { BrowserRouter } from "react-router-dom";
import Header from "./Header";
import Aplicacion from "./routes/AppRoutes";
import { Container } from "react-bootstrap";
import { ToastContainer } from "react-toastify";
import { Suspense } from "react";
import Loader from "./components/Loader/Loader";
import "react-toastify/dist/ReactToastify.css";
function App() {
  return (
    <>
      <BrowserRouter>
        <ToastContainer />
        <Header />
        <Container
          style={{ minHeight: "100vh", minWidth: "100%", padding: "0" }}
        >
          <Suspense fallback={<Loader />}>
            <Aplicacion />
          </Suspense>
        </Container>
      </BrowserRouter>
    </>
  );
}

export default App;
