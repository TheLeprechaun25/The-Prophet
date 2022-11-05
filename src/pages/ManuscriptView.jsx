import React, { useEffect, useState } from 'react';
import { Container, Row, Col, ListGroup, Badge, Button } from 'react-bootstrap';
import { PageNotFound } from '../pages';
import { LoginCard, PDFview } from '../components';
import { cap_to_str } from '../utils'
import { useParams } from 'react-router-dom'

export default function ManuscriptView() {

  const [manuscriptChecked, setManuscriptChecked] = useState(false);
  const [manuscriptId, setManuscriptId] = useState(null);
  const [manuscriptData, setManuscriptData] = useState(null);
  const [manuscriptUpvotes, setManuscriptUpvotes] = useState(null);

  const [upvoting, setUpvoting] = useState(false);

  const { m_id } = useParams()

  useEffect(() => {
    getManuscriptData(m_id);
  }, [m_id]); 

  const getManuscriptData = async (manuscript_id) => {
    setManuscriptId(manuscript_id);
    if (window.walletConnection.isSignedIn()) {
      const manuscript = await window.contract.get_manuscripts_data_by_id({ manuscript_id: manuscript_id });
      setManuscriptData(manuscript);

      
      const manuscript_upvotes = await window.contract.get_n_upvotes_per_manuscript({ manuscript_id: manuscript_id });
      setManuscriptUpvotes(manuscript_upvotes);
    }
    setManuscriptChecked(true);
  }

  const upvote_manuscript = async (manuscript_id, account_id) => {
    if (window.walletConnection.isSignedIn()) {
      setUpvoting(true)
      try {
        await window.contract.upvote_manuscript({
          manuscript_id: manuscript_id,
          account_id: account_id,
        })
        window.location.reload(false);
      } catch (e) {
        setUpvoting(false)
        alert(e)
        throw e
      }
      setUpvoting(false)
    }
  }

  const manuscript_view = (manuscriptId && manuscriptData) ? (
    
    window.walletConnection.isSignedIn() ? (
      <Container>

        <Row>
          <Col xs={9}>
          <h1 className='default-row-spacer'>{manuscriptData.title}</h1>
          <br/><Row><Col><b>Topic: </b> {cap_to_str(manuscriptData.topic)}</Col></Row>
          <br/><Row><Col><b>Author: </b><small><a href={`/profile/${manuscriptData.owner_account}`}><Badge bg="dark">{manuscriptData.owner_account}</Badge></a></small></Col></Row>
          {Object.keys(manuscriptData.reviewers).length > 0 ? (
           <><br /><Row><Col><b>Reviewers: </b> {Object.keys(manuscriptData.reviewers).map((k, i) => <small key={i}> <a href={`/profile/${k}`}><Badge bg="dark">{k}</Badge></a> ({manuscriptData.reviewers[k]}) </small>)}</Col></Row></>            
          ) : (<></>)}
          <br/><Row><Col><b>Abstract: </b> {manuscriptData.m_abstract}</Col></Row>
          <br/><Row><Col><PDFview manuscriptCID={manuscriptData.media_cid}/></Col></Row>
          
          </Col>
          <Col xs={3}>
            <Row>
              <h3 className='default-row-spacer'>Stats</h3>
              <ListGroup as="ol">
              <ListGroup.Item style={{"backgroundColor": "#f0eded"}} className="d-flex justify-content-between align-items-start" as="li"><div>Status: </div><div>{cap_to_str(manuscriptData.status)}</div></ListGroup.Item>
              <ListGroup.Item style={{"backgroundColor": "#f0eded"}} className="d-flex justify-content-between align-items-start" as="li"><div>Upvotes: </div><div>{manuscriptUpvotes}</div></ListGroup.Item>
              </ListGroup>
            </Row>
            <Row className='default-row-spacer'>
              <Button
                variant="dark"
                disabled={upvoting}
                onClick={async () => { 
                  await upvote_manuscript(manuscriptData.id, window.accountId);
                }}
              >
                {upvoting ? 'Upvoting…' : 'Upvote'}
              </Button>
            </Row>

          </Col>
        </Row>
      </Container>
      
    ) : (
      <LoginCard loginMessage="You need to log in using a NEAR testnet wallet in order to see this."/>
    )
  ) : manuscriptChecked ? (
    <PageNotFound/>
  ) : (
    <></>
  );


  return (
    <Container>
      {manuscript_view}
    </Container>
  )
  
}