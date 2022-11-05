import React, { Component } from 'react';
import { Container, Row, Col } from 'react-bootstrap';

export default class PageNotFound extends Component {
  render() {
    return (
        <Container>
        <Row>
          <Col><h1 className='default-row-spacer'>404 Page not found</h1></Col>
        </Row>
        </Container>
    )
  }
}