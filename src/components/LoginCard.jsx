import React from 'react';
import { Container, Row, Col , Button, Alert} from 'react-bootstrap';
import { login } from '../utils'


export default function Profile(props) {

  return (
  <Container style={{"textAlign": "center"}}>
    <Row >
      <Col>
      <Alert style = {{"marginTop": "50px", "marginBottom": "60px"}} key={"dark"} variant={"dark"}>
        {props.loginMessage}
      </Alert>
        
      </Col>
    </Row>
    <Row>
      <Col>
        <Button variant="outline-dark" onClick={login}>Log in</Button>
      </Col>
    </Row>
  </Container>
  )

}
