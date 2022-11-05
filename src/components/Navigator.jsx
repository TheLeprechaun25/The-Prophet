import React from 'react'
import { Container, Button, Nav, Navbar, NavDropdown} from 'react-bootstrap';
import { login, logout } from '../utils'
import { WhiteLogo } from '../assets';



function Navigator() {
  const logout_txt = (
    <Navbar.Text>
    {window.accountId}
    </Navbar.Text>
  );
  const sign_button = !window.walletConnection.isSignedIn() ? (
    <Button variant="outline-success" onClick={login}>Log in</Button>
  ) : (
    <>
      <NavDropdown title={logout_txt} id="basic-nav-dropdown">
      <NavDropdown.Item href={`/profile/${window.accountId}`}>Profile</NavDropdown.Item>

      <NavDropdown.Divider />
      <NavDropdown.Item href="#action/logout" onClick={logout}>Log out</NavDropdown.Item>
      </NavDropdown>
    </>
  );
  return (

    <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
      <Container>
        <Navbar.Brand href="/">
            <img
              alt=""
              src={WhiteLogo}
              width="30"
              height="32"
              className="d-inline-block align-top"
            />{' '}
            The Prophet
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/read">Read</Nav.Link>
            <Nav.Link href="/submit">Submit</Nav.Link>
            <Nav.Link href="/review">Review</Nav.Link>
            <Nav.Link href="/about">Guidelines</Nav.Link>
            
          </Nav>
        </Navbar.Collapse>

        {sign_button}

      </Container>
    </Navbar>
  );
}

export default Navigator;