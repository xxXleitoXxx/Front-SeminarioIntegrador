import React from 'react';
import { Button, Dropdown } from 'react-bootstrap';
import { FaUser, FaSignOutAlt, FaCog } from 'react-icons/fa';
import { useAuth } from './contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import "./AtlantisHeader.css";
import "bootstrap/dist/css/bootstrap.min.css";

export default function AtlantisHeader() {
  const { roles, username, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'ROLE_ADMIN':
        return 'Administrador';
      case 'ROLE_RECEPCIONISTA':
        return 'Recepcionista';
      default:
        return role;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ROLE_ADMIN':
        return '#dc3545'; // Rojo para admin
      case 'ROLE_RECEPCIONISTA':
        return '#28a745'; // Verde para recepcionista
      default:
        return '#6c757d'; // Gris por defecto
    }
  };

  return (
    <div className="atlantis-header">
      <div className="d-flex justify-content-between align-items-center">
        <div className="p-2" style={{ margin: "20px" }}>
          <h1>Atlantis System</h1>
        </div>

        <div className="p-2">
          <div className="d-flex flex-row align-items-center">
            <div className="p-2 d-flex flex-column">
              <div className="d-flex align-items-center">
                <span 
                  className="badge me-2" 
                  style={{ 
                    backgroundColor: getRoleColor(roles[0] || ''), 
                    fontSize: '0.8rem' 
                  }}
                >
                  {getRoleDisplayName(roles[0] || '')}
                </span>
              </div>
              <h6 className="p-1 m-0 text-muted">
                {username || 'Usuario'}
              </h6>
            </div>
            
            <Dropdown align="end">
              <Dropdown.Toggle 
                variant="link" 
                id="user-dropdown"
                className="d-flex align-items-center p-0 border-0 bg-transparent"
                style={{ textDecoration: 'none' }}
              >
                <img
                  className="p-2"
                  src="/src/assets/AtlantisMejorado_1.svg"
                  width="50"
                  height="50"
                  alt="Usuario"
                  style={{ borderRadius: '50%', backgroundColor: '#f8f9fa' }}
                />
              </Dropdown.Toggle>

              <Dropdown.Menu className="shadow">
                <Dropdown.Header>
                  <div className="d-flex align-items-center">
                    <FaUser className="me-2" />
                    <div>
                      <div className="fw-bold">{username || 'Usuario'}</div>
                      <small className="text-muted">
                        {getRoleDisplayName(roles[0] || '')}
                      </small>
                    </div>
                  </div>
                </Dropdown.Header>
                <Dropdown.Divider />
                <Dropdown.Item onClick={handleLogout} className="text-danger">
                  <FaSignOutAlt className="me-2" />
                  Cerrar Sesión
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
      </div>
      <div>{/*<Navegacion /> */}</div>
    </div>
  );
}
