import React from 'react'
import { Container, Row, Col } from 'react-bootstrap';
import { AiFillHome } from 'react-icons/ai'
import { GrMail, GrGithub } from 'react-icons/gr';

export default function Footer() {

  const year = new Date().getFullYear();

  return (
    <Container className='footer' style={{"marginTop": "70px", "marginBottom": "20px"}}>
      <Row className='text-center'>

      <Col >
      <a href="/"><Container><AiFillHome/></Container></a>
      </Col>

      <Col >
      <a href="https://github.com/TheLeprechaun25/The-Prophet"><Container><GrGithub/></Container></a>
      </Col>

      <Col >
      <a href="mailto:theprophetapp@protonmail.com"><Container><GrMail /></Container></a>
      </Col>

      </Row>
    </Container>
  );
}
