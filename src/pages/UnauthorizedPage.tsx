import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaLock, FaArrowLeft } from 'react-icons/fa';
import './UnauthorizedPage.css';

const UnauthorizedPage: React.FC = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="unauthorized-container">
      <Container>
        <Row className="justify-content-center align-items-center min-vh-100">
          <Col xs={12} sm={8} md={6} lg={4}>
            <Card className="unauthorized-card">
              <Card.Body className="text-center p-5">
                <FaLock className="unauthorized-icon" />
                <h2 className="mt-4 mb-3">Acceso Denegado</h2>
                <p className="text-muted mb-4">
                  No tienes permisos para acceder a esta página.
                  Contacta al administrador si crees que esto es un error.
                </p>
                
                <div className="d-grid gap-2">
                  <Button 
                    variant="primary" 
                    onClick={handleGoBack}
                    className="mb-2"
                  >
                    <FaArrowLeft className="me-2" />
                    Volver Atrás
                  </Button>
                  
                  <Button 
                    variant="outline-primary" 
                    onClick={handleGoHome}
                  >
                    Ir al Inicio
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default UnauthorizedPage;
