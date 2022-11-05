import React, { Component } from 'react';
import { Container, Button, Col, Row, ListGroup, Card, Dropdown, Alert, Spinner, Nav } from 'react-bootstrap';
import { ManuscriptCard, LoginCard } from '../components';
import { BECOME_REVIEWER_COST } from '../GlobalVar'

export default class Review extends Component {

  constructor(props) {
    super(props);
    this.state = {
      reviewer_checked: false,
      is_reviewer: false,
      reviewer_data: {}, 
      becoming_reviewer: false,
      loading: false,
      visual_nav_item: 0,
      ongoing_reviews: [],
      new_reviews: [],
      review_history: [],
    }
  }

  async componentDidMount() {
    if (window.walletConnection.isSignedIn()) {
      const reviewer_data = await window.contract.get_reviewer_data({ account_id: window.accountId });
      this.setState({reviewer_data: reviewer_data, reviewer_checked: true,})
      if (reviewer_data) {
        const new_reviews = await window.contract.get_pending_review_manuscripts({});
        const ongoing_reviews = await window.contract.get_review_manuscripts_per_reviewer({account_id: window.accountId});
        this.setState({ new_reviews: new_reviews, ongoing_reviews: ongoing_reviews})
      }
    }
  }

  handleBecomeReviewer = async () => {
    this.setState({becoming_reviewer: true});
    try {
      await window.contract.add_reviewer({},
      "300000000000000",
      BECOME_REVIEWER_COST)
    } catch (e) {
        alert(e)
        throw e
    }
    this.setState({becoming_reviewer: false});
  }

  handle_add_reviewer_to_manuscript = async (manuscript_id) => {
    this.setState({ loading: true })
    try {
      await window.contract.add_reviewer_to_submission({
        manuscript_id: manuscript_id,
      })
      window.location.reload(false);
    } catch (e) {
      this.setState({ loading: false })
      alert(e)
      throw e
    }
    this.setState({ loading: false })
  }

  handle_submit_review = async (manuscript_id, review_decision) => {
    this.setState({ loading: true })
    try {
      await window.contract.submit_review({
        manuscript_id: manuscript_id,
        review_decision: review_decision,
      })
      window.location.reload(false);
    } catch (e) {
      this.setState({ loading: false })
      alert(e)
      throw e
    }
    this.setState({ loading: false })
  }

  review_dropdown = (new_review) => {( 
    Object.keys(new_review.reviewers).includes(window.accountId) ? (
      <Dropdown>
        <Dropdown.Toggle variant="dark">Review manuscript</Dropdown.Toggle>
        <Dropdown.Divider />
        <Dropdown.Menu  variant="dark">
          <Dropdown.Item  as="button" onClick={async () => { 
          await this.handle_add_reviewer_to_manuscript(new_reviews.id);
          }}><b style={{color:"white"}}>Review manuscript</b></Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    ) : (
      <Dropdown>
        <Dropdown.Toggle variant="dark">Review manuscript</Dropdown.Toggle>
        <Dropdown.Divider />
        <Dropdown.Menu  variant="dark">
          <Dropdown.Item  as="button" onClick={async () => { 
          await this.handle_add_reviewer_to_manuscript(new_reviews.id);
          }}><b style={{color:"white"}}>Review manuscript</b></Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>

    )
  )};

  render() {
    const cur_title = this.state.visual_nav_item == 0 ? (
      <h2 className='default-row-spacer'>Ongoing reviews</h2>
    ) : this.state.visual_nav_item == 1 ? (
      <h2 className='default-row-spacer'>Review a new manuscript</h2>
    ) : (
      <h2 className='default-row-spacer'>Reviews history</h2>
    );
    
    

    const page_content = this.state.loading ? (
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    ) : (
      this.state.visual_nav_item == 0 ? (
        <>
          {this.state.ongoing_reviews.map((ongoing_reviews) => ( // ONGOING REVIEWS
            <div key={ongoing_reviews.id}>
              <Card bg={"light"}  >
                <Card.Body>
                  <ManuscriptCard key={ongoing_reviews.id} manuscript={ongoing_reviews}/>
                  <Dropdown>
                    <Dropdown.Toggle variant="dark">
                      Submit review
                    </Dropdown.Toggle>
  
                    <Dropdown.Menu  variant="dark">
                      <Dropdown.Item  as="button" onClick={async () => { 
                        await this.handle_submit_review(ongoing_reviews.id, 'Accepted');
                        }}><b style={{color:"green"}}>Accept</b></Dropdown.Item>
                      <Dropdown.Item  as="button" onClick={async () => { 
                        await this.handle_submit_review(ongoing_reviews.id, 'MajorRevision');
                        }}><b style={{color:"white"}}>Major revision</b></Dropdown.Item>
                      <Dropdown.Item  as="button" onClick={async () => { 
                        await this.handle_submit_review(ongoing_reviews.id, 'MinorRevision');
                        }}><b style={{color:"white"}}>Minor revision</b></Dropdown.Item>
                      <Dropdown.Item  as="button" onClick={async () => { 
                        await this.handle_submit_review(ongoing_reviews.id, 'Rejected');
                        }}><b style={{color:"red"}}>Reject</b></Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                
                </Card.Body>
              </Card>
              <br />
            </div>
          ))}
        </>
      ) : this.state.visual_nav_item == 1 ? ( // NEW REVIEWS
        <>
          {this.state.new_reviews.map((new_review) => (
            <div key={new_review.id}>
              <Card bg={"light"}  >
                <Card.Body>
                  <ManuscriptCard key={new_review.id} manuscript={new_review}/>
                  {(Object.keys(new_review.reviewers).includes(window.accountId) || new_review.owner_account == window.accountId) ? (
                    <Button  variant="dark" disabled={true}>
                      <b style={{color:"white"}}>Review manuscript</b>
                    </Button>
 
                  ) : (
                    <Button  variant="dark" onClick={async () => { 
                      await this.handle_add_reviewer_to_manuscript(new_review.id);
                    }}>
                      <b style={{color:"white"}}>Review manuscript</b>
                    </Button>
                  )}

  

  
                </Card.Body>
              </Card>
              <br />
            </div>
          ))}
        </>
      ) : ( // REVIEWS HISTORY
        <> 
          Coming soon.
          {this.state.review_history.map((old_review) => (
            <div key={old_review.id}>
              <Card bg={"light"}  >
                <Card.Body>
                <ManuscriptCard key={old_review.id} manuscript={old_review}/>
                </Card.Body>
              </Card>
              <br />
            </div>
          ))}
        </>
      )
    );


    const review = window.walletConnection.isSignedIn() ? (
      this.state.reviewer_data === null ? (
        this.state.reviewer_checked ? (
          <Container>
            <Row>
              <Col><h1 className='default-row-spacer'>Become a Reviewer</h1></Col>
            </Row>
            <Row>
              <Col>
              <br></br>
              <Alert key={'success'} variant={'success'}>
                Once you read the <Alert.Link href="/about"> guidelines </Alert.Link>, click the button below to become a reviewer.
              </Alert>
              <br></br>
              </Col>
            </Row>
            <Row>
            <Col className='text-center ' >
            <Button className='default-row-spacer' variant="dark" onClick={this.handleBecomeReviewer} disabled={this.state.becoming_reviewer}>
              Become a Reviewer
            </Button>
            </Col>

            </Row>
          </Container>
        ) : (
          <></>
        )
      ) : (
        <Container>
        <Row>
          <Col xs={8}>
            <Row>
              <Col>
                {cur_title}
              </Col>
            </Row>
            
            <Row className='default-row-spacer'>
              <Col >    
                <Nav variant="tabs" defaultActiveKey="/home">
                  <Nav.Item>
                    <Nav.Link onClick={() => { this.setState({visual_nav_item: 0}) }} eventKey="link-0">Ongoing reviews</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link onClick={() => { this.setState({visual_nav_item: 1}) }} eventKey="link-1">Review a new manuscript</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link onClick={() => { this.setState({visual_nav_item: 2}) }} eventKey="link-2">Reviews history</Nav.Link>
                  </Nav.Item>
                </Nav>
              </Col>
            </Row>
            <Row>
              {page_content}
            </Row>
          </Col>
          <Col xs={4} className='border-left'>
            <Container bg={'light'}>
              <h2 className='default-row-spacer'>Your Stats</h2>
              <hr/>
              <ListGroup as="ol">
                <ListGroup.Item className="d-flex justify-content-between align-items-start" as="li">
                  <div>Papers reviewed: </div><div>{this.state.reviewer_data.number_of_reviews}</div></ListGroup.Item>
                <ListGroup.Item className="d-flex justify-content-between align-items-start" as="li">
                  <div>Upvotes: </div><div>{this.state.reviewer_data.upvotes}</div></ListGroup.Item>
                <ListGroup.Item className="d-flex justify-content-between align-items-start" as="li">
                  <div>Downvotes: </div><div>{this.state.reviewer_data.downvotes}</div></ListGroup.Item>
              </ListGroup>
            </Container>
          </Col>
        </Row>
        <Row>
          
        </Row>
      </Container>
      )

    ) : (
      <LoginCard loginMessage="You need to log in using a NEAR testnet wallet in order to become a reviewer"/>
    );
    return (
      <>
      {review}
      </>
      
    )
  }
}