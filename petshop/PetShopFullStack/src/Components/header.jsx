import { Navbar, Container, Nav } from "react-bootstrap";
import NavDropdown from "react-bootstrap/NavDropdown";

function Header() {
  return (
    <>
      <Navbar bg="light" expand="lg" fixed="top">
        <Container>
          <Navbar.Brand href="/">PetShop Mari</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse
            id="basic-navbar-nav"
            className="justify-content-end"
          >
            <Nav>
              <Nav.Link href="/home">Pagina Inicial</Nav.Link>
              <Nav.Link href="/vendas">Vendas</Nav.Link>

              <NavDropdown title="Cadastros" id="basic-nav-dropdown">
                <NavDropdown.Item href="/produtos">Produtos</NavDropdown.Item>
                <NavDropdown.Item href="/servicos">Servicos</NavDropdown.Item>
                <NavDropdown.Item href="/clientes">Clientes</NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}

export default Header;
