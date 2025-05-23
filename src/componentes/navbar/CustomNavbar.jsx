import React, { useEffect } from "react";
import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";


const CustomNavbar = () => {
  const { materiaProfesor , directorOk } = useAuth();


  // useEffect(() => {
  //   console.log("Estado actual del usuario:", user);
  // }, [user]); 


  return (
    <Navbar bg="dark" variant="dark" expand="lg" sticky="top" collapseOnSelect >
      <Container style={{ fontWeight: "bold" }}>
        {/* Logo / Marca */}
        <Navbar.Brand as={Link} to="/">
          Mi App
        </Navbar.Brand>

        {/* Botón para móviles */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        {/* Contenido colapsable */}

        {
          materiaProfesor || directorOk ? (
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
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
                  <NavDropdown.Item as={Link} to="/dasboard/calificaciones">
                    Calificaciones
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item as={Link} to="/categorias">
                    Ver todas
                  </NavDropdown.Item>
                </NavDropdown>
              </Nav>
              <Nav>

                <Nav.Link as={Link} to="/dasboard/homeda">
                  Home
                </Nav.Link>
                <Nav.Link as={Link} to="/dasboard/notificacion">
                  <i className="bi bi-bell-fill"></i>
                </Nav.Link>
              </Nav>
            </Navbar.Collapse>
          ) : (
            <Nav>

              <Nav.Link as={Link} to="/dasboard/homeda">
                Cerrar Sesion
              </Nav.Link>
              <Nav.Link as={Link} to="/dasboard/notificacion">
                <i className="bi bi-bell-fill"></i>
              </Nav.Link>
            </Nav>
          )
        }



      </Container >
    </Navbar >
  );
};

export default CustomNavbar;