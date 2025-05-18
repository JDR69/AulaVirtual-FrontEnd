import React, { useEffect } from "react";
import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import { Link } from "react-router-dom";


const CustomNavbar = () => {
  // const { user } = useAuth();


  // useEffect(() => {
  //   console.log("Estado actual del usuario:", user);
  // }, [user]); 


  return (
    <Navbar bg="dark" variant="dark" expand="lg" sticky="top"  collapseOnSelect >
      <Container style={{ fontWeight: "bold"}}>
        {/* Logo / Marca */}
        <Navbar.Brand as={Link} to="/">
          Mi App
        </Navbar.Brand>

        {/* Botón para móviles */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        {/* Contenido colapsable */}
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <NavDropdown title="Usuarios" id="basic-nav-dropdown">
              <NavDropdown.Item as={Link} to="/dasboard/perfil-usuario">
                Perfil
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item as={Link} to="/dasboard/detalle-usuario">
                Gestion de usuarios
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item as={Link} to="/dasboard/permiso-usuario">
                Gestion de permisos
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item as={Link} to="/dasboard/bitacora">
                Detalle Bitacora
              </NavDropdown.Item>
            </NavDropdown>


            <NavDropdown title="Academico" id="basic-nav-dropdown">
              <NavDropdown.Item as={Link} to="/categorias/electronica">
                Electrónica
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/categorias/ropa">
                Ropa
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item as={Link} to="/categorias">
                Ver todas
              </NavDropdown.Item>
            </NavDropdown>


            <NavDropdown title="Evaluaciones" id="basic-nav-dropdown">
              <NavDropdown.Item as={Link} to="/categorias/electronica">
                Electrónica
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/categorias/ropa">
                Ropa
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item as={Link} to="/categorias">
                Ver todas
              </NavDropdown.Item>
            </NavDropdown>


            <NavDropdown title="Periodos" id="basic-nav-dropdown">
              <NavDropdown.Item as={Link} to="/categorias/electronica">
                Electrónica
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/categorias/ropa">
                Ropa
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
            <Nav.Link as={Link} to="/login">
              <i className="bi bi-bell-fill"></i>
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;