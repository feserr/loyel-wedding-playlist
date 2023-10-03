import { useState } from "react";
import { Button, Container, Nav, Navbar } from "react-bootstrap";

interface HeaderProps {
  userName: string;
  login: () => void;
}

export default function Header({ userName, login }: HeaderProps) {
  return (
    <Navbar expand="lg" className="bg-body-tertiary" fixed="top">
      <Container>
        <Navbar.Brand href="/">Lista reproducción</Navbar.Brand>
        {userName === "" ?
          <Button type="submit" onClick={login}>Login</Button> :
          <Navbar.Text>
            <a href="/">{userName}</a>
          </Navbar.Text>
        }
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/">Inicio</Nav.Link>
            <Nav.Link href="/playlist">Lista</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
