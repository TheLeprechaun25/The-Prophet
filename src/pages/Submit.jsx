import React, { Component } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { SubmitForm, LoginCard } from '../components';


export default class Submit extends Component {

  render() {
    const submit = window.walletConnection.isSignedIn() ? (
      <Container >
        <Row  className='default-row-spacer'>
          <Col>
            <SubmitForm></SubmitForm>
          </Col>
        </Row>
      </Container>
    ) : (
      <LoginCard loginMessage="You need to log in using a NEAR testnet wallet in order to submit a scientific article"/>
    );
    return (
      <>
        {submit}
      </>
    )
  }
}