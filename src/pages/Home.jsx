import React, { Component } from 'react';
import { Container, Row, CardGroup, Figure, Button, Card } from 'react-bootstrap';
import { GrMail, GrGithub } from 'react-icons/gr';


import { Banner, NearBlackLogo, Flowchart } from '../assets';



export default class Home extends Component {

  render() {
    return (

      <div >
      <div id='home' className='home-background' >
        <Container>
        <Row>

          <Figure style={{"textAlign": "center"}}>
            <Figure.Image width={1000} height={1000} alt="" src={Banner}/>
          </Figure>

        </Row>
        <Row>
        <h2 style={{"color": "black", "fontFamily": "garamond", "textAlign": "center"}}><b>A Decentralized and Automated Scientific Journal</b></h2>
        <h4 style={{"color": "black", "fontFamily": "garamond", "textAlign": "center"}}><b>Powered by NEAR Protocol</b>
        <Figure style={{"textAlign": "center"}}>
            <Figure.Image width={50} height={50} alt="" src={NearBlackLogo}/>
          </Figure>
          </h4>
        </Row>
        <Row>
        <h5><b>Description</b></h5>
        <p >The Prophet is a decentralized and automated digital journal. As opposed to conventional journals, The Prophet uses blockchain technology to manage and store scientific papers, incentivize reviewers and reward top authors. Moreover, it uses artificial intelligent systems to automate and lighten the paper revision process.</p>
        </Row>

        <Row>
        <h5><b>Solved Problems</b></h5>
        <p>Conventional journals work in an unfair manner: once an author submits a paper, multiple reviewers are asked to review it (for free). Most of them deny the offer, while the ones accepting it, perform a fast and most of the times poor review. </p>

        <p>Secondly, most of the conventional journals do not make use of a version control. Since the paper is firstly submitted, until it gets accepted and published in the journal, many versions of the paper have been completed considering the recommendations of the reviewers. A version control gives an amplified idea of the trajectory of the paper and the quality of the reviews. </p>

        <p>Thirdly, many resources are allocated in managing the initial revision process before it is sent to reviewers. Tasks such as plagiarism detection and “out of scope” paper detection could be automated by modern Artificial Intelligence (AI) systems. </p>

        <p>Lastly, scientist feel that the reviewing process may be sometimes obscure, the accepting decision is sometimes influenced by internal factors not related to the submitted manuscript’s quality. </p>
        </Row>
        <Row>
        <h5><b>Benefits</b></h5>
        <p>As an article <b>author</b>, I prefer using The Prophet, since the quality of reviews is higher than those on conventional and centralized journals.</p>
        <p>As a <b>reviewer</b>, I want to take part in The Prophet because it has an incentive program for reviewers and a system of valorations (Levels/Perks/Rewards).</p>
        <p>As a <b>reader</b>, I want to read articles I find at The Prophet, because I have the transparency and control over the reviews.</p>
        </Row>
        <Row>
        <h5><b>Peer Reviewing Process</b></h5>
        <p>The following flowchart describes the primary process of peer-reviewing from the author's perspective:</p>
        <Figure style={{"textAlign": "center"}}>
            <Figure.Image width={1000} alt="" src={Flowchart}/>
        </Figure>
        </Row>
        </Container>
      </div>
      <div className='default-row-spacer'>
        <Container style={{"textAlign": "center"}}>
          <Row>
            <CardGroup>
              <Card border="light" style={{ width: '18rem' }}>
                <Card.Body>
                  <Card.Title>Contact Us</Card.Title>
                  <Card.Text>
                    Contact us by mail by clicking the button below.
                  </Card.Text>
                  <Button>
                  <a href="/"><Container><GrMail/></Container></a>
                  </Button>
                </Card.Body>
              </Card>
              <Card border="light" style={{ width: '18rem' }}>
                <Card.Body>
                  <Card.Title>Source Code</Card.Title>
                  <Card.Text>
                    The prophet is an open source project. Find the source code here.
                  </Card.Text>
                  <Button>
                  <a href="https://github.com/TheLeprechaun25/The-Prophet"><Container><GrGithub/></Container></a>
                  </Button>
                </Card.Body>
              </Card>
            </CardGroup>
          </Row>
        </Container>
      </div>
      </div>
    )
  }
}