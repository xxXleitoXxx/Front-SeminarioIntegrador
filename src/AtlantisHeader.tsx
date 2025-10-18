import { Dropdown } from 'react-bootstrap';
import { FaUser, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from './contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import "./AtlantisHeader.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Navegacion from './principalPage/Navegacion';
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
      {/* Añadimos las clases de Bootstrap para controlar la visibilidad.
        d-none: oculta el elemento en todos los tamaños de pantalla.
        d-md-flex: lo hace visible y con display flex a partir del punto de interrupción 'md' (768px).
      */}
      <div className="d-none d-md-flex justify-content-between align-items-center">
        <div className="p-2" style={{ margin: "20px" }}>
          <h1>Atlantis System</h1>
        </div>

        <div className="p-2">
          <div className="d-flex flex-row align-items-center">
            {/* Div que agrupa el nombre de usuario y el rol para que se muestren juntos.
              Utilizamos las clases de flexbox para organizarlos en una columna.
            */}
            <div className="p-2 d-flex flex-column align-items-end">
              {/* Cambiado el orden: el badge va primero */}
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
              {/* Y el nombre de usuario va después */}
              <h6 className="p-1 m-0 text-white">
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
                      <div className="fw-bold text-white">{username || 'Usuario'}</div>
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
      <div>{<Navegacion />}</div>
    </div>
  );
}