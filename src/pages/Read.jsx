import React, { Component } from 'react';
import { Container, Button, Col, Row, Form } from 'react-bootstrap';
import { ManuscriptCardSet, LoginCard, TopicSelect } from '../components';
import { get_manuscripts_data_per_owner, get_manuscripts_data_per_topic } from '../utils'


export default class Read extends Component {

  constructor(props) {
    super(props);
    this.state = {
      shown_manuscripts: [],
      searching: false, 
    }
  }

  async componentDidMount() { 
    const manuscripts = await this.get_manuscripts();
    this.setState({shown_manuscripts: manuscripts})
  }

  async get_manuscripts() {
    if (window.walletConnection.isSignedIn()) {
      const manuscripts = await window.contract.get_n_manuscripts({ account_id: window.accountId })
      return manuscripts 
    }
  }

  async handle_submit(event) {
    event.preventDefault();
    this.setState({searching: true, shown_manuscripts: []})
    const form = event.currentTarget;
    const title = form.elements.formTitleSearch.value;
    const author = form.elements.formAuthorSearch.value;
    const topic = form.elements.formTopicSearch.value

    if (title != "") {
      const manuscript = await window.contract.get_manuscripts_data_by_id({ manuscript_id: title });
      if (manuscript) {
        let cur_manuscripts = this.state.shown_manuscripts;
        cur_manuscripts.push(manuscript);
        this.setState({shown_manuscripts: cur_manuscripts});
      } else {
        this.setState({shown_manuscripts: []});
      }
    }

    if (author != "") {
      const manuscripts = await get_manuscripts_data_per_owner(author);
      if (manuscripts.length > 0) {
        this.setState({shown_manuscripts: manuscripts});
      } else {
        this.setState({shown_manuscripts: []});
      }
    }

    if (topic != "") {
      const manuscripts = await get_manuscripts_data_per_topic(topic);
      if (manuscripts.length > 0) {
        this.setState({shown_manuscripts: manuscripts});
      } else {
        this.setState({shown_manuscripts: []});
      }
    }

    if (title == "" && author == "" && topic == "") {
      const manuscripts = await this.get_manuscripts();
      this.setState({shown_manuscripts: manuscripts})
    }
    form.reset()
    this.setState({searching: false})
  }

  render() {
    const read = window.walletConnection.isSignedIn() ? (
      <Container>
        <Row className='default-row-spacer'>
          <Col>
          <Form onSubmit={ (event) => {this.handle_submit(event)}}>
              <Row>
                <Col xs={8}>
                <Form.Group className="mb-3" controlId="formTitleSearch">
                <Form.Label>Search manuscripts by TITLE</Form.Label>
                <Form.Control disabled={this.state.searching} placeholder="Title" />
                </Form.Group >
                </Col>
              </Row>
              <Row>
              <Col xs={8}>
                <Form.Group className="mb-3" controlId="formAuthorSearch">
                <Form.Label>Search manuscripts by AUTHOR</Form.Label>
                <Form.Control disabled={this.state.searching} placeholder="Author" />
                </Form.Group >
              </Col>
              </Row>
              <Row>
              <Col xs={4}>
              <Form.Group className="mb-3" controlId="formTopicSearch">
                <Form.Select aria-label="Default select example">
                  <TopicSelect/>
                </Form.Select>
              </Form.Group >
              
              </Col>
              <Col xs={2}>
                <Button disabled={this.state.searching} variant="primary" type="submit">
                    Search
                </Button>
                
              </Col>
              </Row>
          </Form>
          </Col>
        </Row>
        <Row>
          <ManuscriptCardSet ShownManuscripts={this.state.shown_manuscripts}/>
        </Row>
      </Container>
    ) : (
      <LoginCard loginMessage="You need to log in using a NEAR testnet wallet in order to read scientific articles"/>
    );
    return (
      <Container>
      {read}
      </Container>
    )
  }
}