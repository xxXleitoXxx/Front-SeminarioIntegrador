import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { LoginService } from '../services/LoginService';
import type { User } from '../types/User';
import './LoginPage.css';

const LoginPage: React.FC = () => {
  const [user, setUser] = useState<User>({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const tokenData = await LoginService.loginUser(user);
      login(tokenData, user.username);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="login-container">
      <Container>
        <Row className="justify-content-center align-items-center min-vh-100">
          <Col xs={12} sm={8} md={6} lg={4}>
            <Card className="login-card">
              <Card.Body className="p-4">
                <div className="text-center mb-4">
                  <img
                    src="/src/assets/AtlantisMejorado_1.svg"
                    alt="Atlantis System"
                    className="login-logo"
                  />
                  <h3 className="mt-3 mb-1">Atlantis System</h3>
                  <p className="text-muted">Iniciar Sesión</p>
                </div>

                {error && (
                  <Alert variant="danger" className="mb-3">
                    {error}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Usuario</Form.Label>
                    <Form.Control
                      type="text"
                      name="username"
                      value={user.username}
                      onChange={handleChange}
                      placeholder="Ingrese su usuario"
                      required
                      disabled={loading}
                    />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label>Contraseña</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      value={user.password}
                      onChange={handleChange}
                      placeholder="Ingrese su contraseña"
                      required
                      disabled={loading}
                    />
                  </Form.Group>

                  <Button
                    type="submit"
                    variant="primary"
                    className="w-100"
                    disabled={loading}
                  >
                    {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default LoginPage;
