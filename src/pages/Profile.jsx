import React, { useEffect, useState } from 'react';
import { Container, Button, Col, Row, ListGroup, Card, Dropdown } from 'react-bootstrap';
import { ManuscriptCard, LoginCard } from '../components';
import { get_manuscripts_data_per_owner } from '../utils'
import { useParams } from 'react-router-dom'

export default function Profile() {
  const [dataChecked, setDataChecked] = useState(false);
  const [accountId, setAccountId] = useState(null);
  const [isUserProfile, setIsUserProfile] = useState(false)
  const [userManuscripts, setUserManuscripts] = useState([]);
  const [reviewerData, setReviewerData] = useState(null);


  const { id } = useParams()

  useEffect(() => {
    getProfile(id);
  }, [id])



  const getProfile = async (account_id) => {
    setAccountId(account_id)
    if (account_id == window.accountId) {
      setIsUserProfile(true);
    } else {
      setIsUserProfile(false);
    }
    const manuscripts = await get_manuscripts(account_id);
    const reviewer_data = await get_reviewer_data(account_id);

    setUserManuscripts(manuscripts);
    setReviewerData(reviewer_data);
    setDataChecked(true);
  }

  const get_manuscripts = async (account_id) => {
    if (window.walletConnection.isSignedIn()) {
      const manuscripts = await get_manuscripts_data_per_owner(account_id);
      return manuscripts 
    }
  }

  const get_reviewer_data = async (account_id) => {
    if (window.walletConnection.isSignedIn()) {
      let reviewer_data = await window.contract.get_reviewer_data({ account_id: account_id });
      if (!reviewer_data) {
        reviewer_data = null;
      }
      return reviewer_data 
    }
  }

  const handle_cancel_submission = async (submission_id) => {
    try {
      await window.contract.cancel_submission({
        manuscript_id: submission_id,
      })

    } catch (e) {
      console.log(
        'Something went wrong! ' +
        'Maybe you need to sign out and back in?'
      )
      throw e
    }

  }

  const author_stats = userManuscripts.length > 0 ? (
    <ListGroup as="ol">
    <ListGroup.Item style={{"backgroundColor": "#f0eded"}} className="d-flex justify-content-between align-items-start" as="li"><div>Papers submitted: </div><div>{userManuscripts.length}</div></ListGroup.Item>
    </ListGroup>
  ) : dataChecked && isUserProfile ? (
    <Container> 
      <Row>
        <Col>User is not an author</Col>
      </Row>
      <br></br>
      <Row>
        <Col>
        <Button variant="dark" href='/submit'>
          Become an author
        </Button>
        </Col>
      </Row>  

    </Container>

  ) : (
    <></>
  )

  const reviewer_stats = reviewerData ? (
    <ListGroup as="ol" style={{"backgroundColor": "#f0eded"}}>
    <ListGroup.Item style={{"backgroundColor": "#f0eded"}} className="d-flex justify-content-between align-items-start" as="li"><div>Papers reviewed: </div><div>{reviewerData.number_of_reviews}</div></ListGroup.Item>
    <ListGroup.Item style={{"backgroundColor": "#f0eded"}} className="d-flex justify-content-between align-items-start" as="li"><div>Upvotes: </div><div>{reviewerData.upvotes}</div></ListGroup.Item>
    </ListGroup>
  ) : dataChecked && isUserProfile ? (
    <Container> 
      <Row>
        <Col>User is not a reviewer</Col>
      </Row>
      <br></br>
      <Row>
        <Col>
        <Button variant="dark" href='/review'>
          Become a reviewer
        </Button>
        </Col>
      </Row>  

    </Container>
  ) : (
    <></>
  )

  const manuscripts = (
    <>
    {userManuscripts.map((shown_manuscript) => (
      <Container  key={shown_manuscript.id}>
      <Card bg={"light"} >
        <Card.Body>
          <ManuscriptCard key={shown_manuscript.id} manuscript={shown_manuscript}/>
          {((shown_manuscript.status == "Submitted" || shown_manuscript.status == "UnderReview") && isUserProfile) ? (
            <>
           
            <Dropdown>
            <Dropdown.Toggle variant="dark">
              Edit submission
            </Dropdown.Toggle>

            <Dropdown.Menu  variant="dark">
              <Dropdown.Item href="/add-coauthors" onClick={() => {alert("Not implemented yet")}}>Add coauthors</Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item  as="button" onClick={async () => { 
                await handle_cancel_submission(shown_manuscript.id);
                window.location.reload(false);
                }}><b style={{color:"red"}}>Cancel submission</b></Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          </>
          ):(
          <></>
          )}
        </Card.Body>
      </Card>
      <br />
      </Container>
    ))}
    </>
  )

  const profile = window.walletConnection.isSignedIn() ? (
    <Container>
      <Row>
        <Col>
          <h1 className='default-row-spacer'>{accountId}</h1>
        </Col>
      </Row>
      <Row>
        <Col xs={8}>
          <h2 className='default-row-spacer'>Manuscripts</h2>
          {manuscripts}
        </Col>

        <Col> 
          <Row>
          <Container  bg={'dark'}>
            <h2 className='default-row-spacer'>Author stats</h2>
            {author_stats}
          </Container>
          </Row>
          <Row>
          <Container>
            <h2 className='default-row-spacer'>Reviewer stats</h2>
            {reviewer_stats}
          </Container>
          </Row>

        </Col>
      </Row>
    </Container>
  ) : (
    <LoginCard loginMessage="You need to log in using a NEAR testnet wallet in order to see this."/>
  );

  return (
    <>
      {profile}
    </>
  )
  
}