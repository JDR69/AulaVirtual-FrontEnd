import React, { useEffect, useState } from "react";
import { Navbar, Nav, Container, NavDropdown, Badge } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { obtenerNotificacionesRequest } from "../../api/auth";

const CustomNavbar = () => {
  const { materiaProfesor, directorOk, user, logout, setMateriaProfesor } = useAuth();
  const [isLoaded, setIsLoaded] = useState(false);
  const [notificacionesPendientes, setNotificacionesPendientes] = useState(0);
  const navigate = useNavigate();

  // Verificación del rol de profesor (con múltiples posibilidades)
  const isProfesor = user && (user.rol_id === 2 || user.rol === 2 || (user.rol_nombre && user.rol_nombre === "Profesor"));
  
  // Verificar si el profesor ya seleccionó un curso
  const profesorConCursoSeleccionado = isProfesor && materiaProfesor;

  useEffect(() => {
    if (user) {
      setIsLoaded(true);
      // console.log("Usuario cargado en navbar:", user);
      // console.log("Materia del profesor en localStorage:", localStorage.getItem('materiaProfesor'));
    }
  }, [user]);

  // Efecto para cargar notificaciones pendientes
 useEffect(() => {
  const cargarNotificacionesPendientes = async () => {
    if (user && user.id) {
      try {
        const response = await obtenerNotificacionesRequest(user.id);
        
        // Filtrar notificaciones con estado true (no leídas)
        let pendientes = 0;
        if (response && response.data) {
          // Comprobar si es un array o un solo objeto
          if (Array.isArray(response.data)) {
            pendientes = response.data.filter(notif => notif.estado === true).length;
          } else if (response.data.estado === true) {
            // Si es un solo objeto con estado true
            pendientes = 1;
          }
        }
        
        console.log("Notificaciones pendientes:", pendientes);
        setNotificacionesPendientes(pendientes);
      } catch (error) {
        console.error("Error al cargar notificaciones:", error);
      }
    }
  };

  if (user) {
    cargarNotificacionesPendientes();
    // Verificar nuevas notificaciones cada minuto
    const intervalo = setInterval(cargarNotificacionesPendientes, 60000);
    return () => clearInterval(intervalo);
  }
}, [user]);

  // Función para cambiar de curso (volver a la selección)
  const handleChangeCourse = () => {
    setMateriaProfesor(null);
    navigate('/dasboard/seleccionar-curso');
  };
  
  // Función para cerrar sesión
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Para depuración
  // console.log("Usuario actual:", user);
  // console.log("¿Es profesor?:", isProfesor);
  // console.log("materiaProfesor:", materiaProfesor);
  // console.log("¿Profesor con curso seleccionado?:", profesorConCursoSeleccionado);

  return (
    <Navbar bg="dark" variant="dark" expand="lg" sticky="top" collapseOnSelect>
      <Container style={{ fontWeight: "bold" }}>
        {/* Logo / Marca */}
        <Navbar.Brand as={Link} to="/dasboard/homeda">
          Aula Virtual
        </Navbar.Brand>

        {/* Botón para móviles */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {!isLoaded ? (
              <Nav.Link disabled>Cargando...</Nav.Link>
            ) : isProfesor && !materiaProfesor ? (
              // Si es profesor pero NO ha seleccionado curso, mostrar mensaje
              <Nav.Link disabled>Seleccione un curso para continuar</Nav.Link>
            ) : isProfesor && materiaProfesor ? (
              // Si es profesor Y ha seleccionado curso, mostrar menú de profesor
              <>
                <Nav.Link as={Link} to="/dasboard/perfil-usuario">
                  Perfil
                </Nav.Link>

                <Nav.Link as={Link} to="/profesor/asistencia">
                  Asistencia
                </Nav.Link>

                <Nav.Link as={Link} to="/profesor/actividades">
                  Actividades
                </Nav.Link>

                <Nav.Link as={Link} to="/profesor/calificaciones">
                  Calificaciones
                </Nav.Link>

                <Nav.Link as={Link} to="/profesor/participacion">
                  Participación
                </Nav.Link>
              </>
            ) : (
              // Si no es profesor, mostrar menú normal
              <>
                <NavDropdown title="Usuarios" id="basic-nav-dropdown">
                  <NavDropdown.Item as={Link} to="/dasboard/perfil-usuario">
                    Perfil
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item as={Link} to="/dasboard/detalle-usuario">
                    Detalle de usuarios
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item as={Link} to="/dasboard/permiso-usuario">
                    Gestion de permisos
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item as={Link} to="/dasboard/bitacora">
                    Detalle Bitacora
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item as={Link} to="/dasboard/gestion-usuario">
                    Gestion de Usuarios
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                </NavDropdown>

                <NavDropdown title="Academico" id="basic-nav-dropdown">
                  <NavDropdown.Item as={Link} to="/dasboard/detalle-academica">
                    Gestion Academica
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item as={Link} to="/dasboard/detalle-curso">
                    Detalle del Curso
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item as={Link} to="/dasboard/detalle-materia">
                    Detalle de la Materia
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item as={Link} to="/dasboard/detalle-alumnos-gestion">
                    Gestion Del Alumno
                  </NavDropdown.Item>
                </NavDropdown>

                <NavDropdown title="Evaluaciones" id="basic-nav-dropdown">
                  <NavDropdown.Item as={Link} to="/dasboard/actividades">
                    Actividades
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item as={Link} to="/dasboard/calificaciones">
                    Calificaciones
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item as={Link} to="/categorias">
                    Ver todas
                  </NavDropdown.Item>
                </NavDropdown>

                <NavDropdown title="Periodos" id="basic-nav-dropdown">
                  <NavDropdown.Item as={Link} to="/dasboard/participacion">
                    Participacion
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item as={Link} to="/dasboard/libreta">
                    Libreta Alumnos
                  </NavDropdown.Item>
                    <NavDropdown.Divider />
                  <NavDropdown.Item as={Link} to="/dasboard/gestiones">
                   Gestiones
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item as={Link} to="/dasboard/crear-notificacion">
                    Mandar Notificacion
                  </NavDropdown.Item>
                </NavDropdown>
              </>
            )}
          </Nav>
          <Nav>
            {isProfesor && materiaProfesor && (
              <Nav.Link onClick={handleChangeCourse}>
                Cambiar Curso
              </Nav.Link>
            )}
            <Nav.Link as={Link} to="/dasboard/homeda">
              Home
            </Nav.Link>
          <Nav.Link as={Link} to="/dasboard/notificacion" className="position-relative">
  {notificacionesPendientes > 0 ? (
    <>
      <i 
        className="bi bi-bell-fill" 
        style={{ 
          color: "#ff0000", // Cambiado a un rojo puro y brillante
          animation: "bell-ring 2s infinite ease-in-out"
        }}
      ></i>
      <Badge 
        bg="danger" 
        pill 
        className="position-absolute"
        style={{
          top: "0", 
          right: "0",
          transform: "translate(50%, -50%)", 
          fontSize: "0.65rem"
        }}
      >
        {notificacionesPendientes}
      </Badge>
      <style>
        {`
          @keyframes bell-ring {
            0% { transform: rotate(0); }
            5% { transform: rotate(15deg); }
            10% { transform: rotate(-15deg); }
            15% { transform: rotate(0); }
            100% { transform: rotate(0); }
          }
        `}
      </style>
    </>
  ) : (
    <i className="bi bi-bell-fill"></i>
  )}
</Nav.Link>
            <Nav.Link onClick={handleLogout}>
              <i className="bi bi-box-arrow-right"></i>
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;