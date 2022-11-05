import React, { Component } from 'react';
import { Container, Row, Col, Nav} from 'react-bootstrap';

import { SUBMISSION_COST, BECOME_REVIEWER_COST } from '../GlobalVar';

export default class About extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visual_nav_item: 1,
    }
  }

  render() {
    const cur_title = this.state.visual_nav_item == 0 ? (
      <h1 className='default-row-spacer'>Guidelines for Readers</h1>
    ) : this.state.visual_nav_item == 1 ? (
      <h1 className='default-row-spacer'>Guidelines for Authors</h1>
    ) : (
      <h1 className='default-row-spacer'>Guidelines for Reviewers</h1>
    )
    
    const cur_nav_item = this.state.visual_nav_item == 0 ? (
      <Row>
        <Col>readers</Col>
      </Row>
    ) : this.state.visual_nav_item == 1 ? (
      <Row>
        <Col>
          <ul style={{"color": "blue", "listStyle": "none"}}>
            <li><a href='#submission_guidelines'>Submission guidelines</a></li>
            <li><a href='#format-articles'>Format of articles</a></li>
            <li><a href='#abstract'>Abstract</a></li>
            <li><a href='#manuscript'>Manuscript</a></li>
            <li><a href='#writing'>Writing your manuscript</a></li>
            <li><a href='#methods'>Methods</a></li>
            <li><a href='#references'>References</a></li>
            <li><a href='#supplementary'>Supplementary data</a></li>
            <li><a href='#fee'>Submission fee</a></li>
          </ul>
          
          <h2 id='format-articles'> Format of Articles</h2>
          <p>If you are submitting LaTeX files, use the <a style={{"color": "blue"}} href='https://www.overleaf.com/latex/templates/template-for-submissions-to-scientific-reports/xyrztqvdccns#.VNzKqC7HTlM'>template provided by Overleaf</a></p>
          <ul>
            <li>Articles should ideally be no more than 12 pages</li>
            <li>The title should be no more than 20 words</li>
            <li>The abstract should be no more than 200 words</li>
          </ul>

          <h2 id='abstract'>Abstract</h2>
          <p>Please do not include any references in your Abstract. Make sure it serves both as a general introduction to the topic and as a brief, non-technical summary of the main results and their implications.</p>
          
          <h2 id='manuscript'>Manuscript</h2>
          <p>Your manuscript text file should start with a title page that shows author affiliations and contact information, identifying the corresponding author with an asterisk. We recommend that each section includes an introduction of referenced text that expands on the background of the work. Some overlap with the Abstract is acceptable.</p>
          <p>For the main body of the text, there are no specific requirements. You can organise it in a way that best suits your research. However, the following structure will be suitable in many cases:</p>
          <ul>
            <li>Introduction</li>
            <li>Methods</li>
            <li>Results</li>
            <li>Discussion</li>
          </ul>
          <p>You should then follow the main body of text with:</p>
          <ul>
            <li>References</li>
            <li>Acknowledgements (optional)</li>
            <li>Additional Information (tables, figures)</li>
          </ul>

          <h2 id='writing'>Writing your manuscript</h2>
          <p>Scientific Reports is read by a truly diverse range of scientists. Please therefore give careful thought to communicating your findings as clearly as possible.</p>  
          <p>Although you can assume a shared basic knowledge of science, please don’t expect that everyone will be familiar with the specialist language or concepts of your particular field. Therefore:</p>
          <ul>
            <li>Avoid technical jargon wherever possible, explaining it clearly when it is unavoidable.</li>
            <li>Keep abbreviations to a minimum, particularly when they are not standard.</li>
            <li>If you must use an abbreviation, make sure you spell it out fully in the text or legend the first time it appears.</li>
            <li>Clearly explain the background, rationale and main conclusions of your study.</li>
            <li>Write titles and abstracts in language that will be readily understood by any scientist.</li>
          </ul>

          <h2 id='methods'>Methods</h2>
          <p>We don't impose word limits on the description of methods. Make sure it includes adequate experimental and characterisation data for others to be able to reproduce your work. You should:</p>  
          <ul>
            <li>Include descriptions of standard protocols and experimental procedures.</li>
            <li>Describe the experimental protocol in detail.</li>
            <li>Use standard abbreviations.</li>
          </ul>

          <h2 id='references'>References</h2>
          <p>Make sure the references:</p>  
          <ul>
            <li>Run sequentially (and are always numerical).</li>
            <li>Sit within square brackets.</li>
            <li>Only have one publication linked to each number.</li>
            <li>Include all authors unless there are six or more, in which case only the first author should be given, followed by 'et al.'.</li>
            <li>List authors by last name first, followed by a comma and initials (followed by full stops) of given names.</li>
          </ul>
          <h5>Examples</h5>
          <p>Schott, D. H., Collins, R. N. & Bretscher, A. Secretory vesicle transport velocity in living cells depends on the myosin V lever arm length. J. Cell Biol. 156, 35-39 (2002).</p>
          <p>Bellin, D. L. et al. Electrochemical camera chip for simultaneous imaging of multiple metabolites in biofilms. Nat. Commun. 7, 10535; 10.1038/ncomms10535 (2016).</p>
          <p>Manaster, J. Sloth squeak. Scientific American Blog Network http://blogs.scientificamerican.com/psi-vid/2014/04/09/sloth-squeak (2014).</p>
          
          <h2 id='supplementary'>Supplementary data</h2>
          <p>You may submit any Supplementary Information together with the manuscript so that it is available to referees during peer-review. This will be available with accepted manuscripts.</p>  
          <p>If any data that is necessary to evaluate the claims of your paper is not available via a public depository, make sure you provide it as Supplementary Information.</p>
          <p>Keep file sizes as small as possible, so that they can be downloaded quickly.</p>
          
          <h2 id='fee'>Submission fee</h2>
          <p>All submission will be subject to a constant fee of {Math.round(SUBMISSION_COST/10**24)} NEAR token(s).</p>  

        </Col>
      </Row>
    ) : (
      <Row>
        <Col>
          <ul style={{"color": "blue", "listStyle": "none"}}>
            <li><a href='#review'>Review process</a></li>
            <li><a href='#decision'>Make a recomendation</a></li>
            <li><a href='#ethic'>Ethical guidelines</a></li>
            <li><a href='#become'>Become a reviewer</a></li>
            <li><a href='#incentives'>Incentives</a></li>
          </ul>

          <h2 id='review'>Review process</h2>
          <p>Peer review, also known as refereeing, is a collaborative process that allows independent experts in the same field of research to evaluate and comment on manuscript submissions.</p>  
          <p>As a reviewer of The Prophet you should:</p>
          <ul>
            <li>Provide detailed comments. Use these comments to make constructive suggestions, seek clarification on any unclear points, and ask for further elaboration.</li>
            <li>Make suggestions on how the author can improve clarity, succinctness, and the quality of presentation.</li>
            <li>Confirm whether you feel the subject of the paper is sufficiently interesting to justify its length. If you recommend shortening, show specific areas where you think it is required.</li>
            <li>A referee may disagree with the author's opinions, but should allow them to stand, provided their evidence supports it.</li>
          </ul>

          <h2 id='decision'>Make a recomendation</h2>
          <p>Once you have read the paper and have assessed its quality, you need to make a recommendation:</p> 
          <ul>
            <li><b>Accept</b>. The paper is suitable for publication in its current form. Please list the main points that made you take that decision.</li>
            <li><b>Minor revision</b>. The paper will be ready for publication after light revisions. Please list the revisions you would recommend the author to make.</li>
            <li><b>Major revision</b>. The paper needs substantial changes such as expanded data analysis, widening of the literature review, or rewriting sections of the text.</li>
            <li><b>Reject</b>. The paper is not suitable for publication with this journal, or the revisions are too fundamental for the submission to continue being considered in its current form.</li>
          </ul>

          <h2 id='ethic'>Ethical guidelines</h2>
          <p>All peer reviewers must follow these ethical guidelines:</p> 
          <ul>
            <li>Reviewers must give unbiased consideration to each manuscript submitted. They should judge each on its merits, without regard to race, religion, nationality, sex, seniority, or institutional affiliation of the author(s).</li>
            <li>Reviewers must declare any conflict of interest before agreeing to review a manuscript. This includes any relationship with the author that may bias their review.</li>     
            <li>Reviewers should provide a constructive, comprehensive, evidenced, and appropriately substantial peer review report.</li>
            <li>Reviewers must avoid making statements in their report which might be construed as impugning any person’s reputation.</li>     
          </ul>

          <h2 id='become'>Become a reviewer</h2>
          <p>To become a reviewer, the user need to deposit a unique fee of {Math.round(BECOME_REVIEWER_COST/10**24)} NEAR token(s).</p>  

          <h2 id='incentives'>Reviewer incentives</h2>
          <p>To motivate the reviewers, The Prophet offers incentives to those users with the highest <b>score</b>. The reviewing score is computed by the number of quality reviews and the total number of upvotes.</p>  
          <p>The proceeds of the journal (submission and review fees) are distributed to those reviewers that have contributed most.</p>
        
        </Col>
      </Row>
    )
    return (
      <Container>
        <Row>
          <Col>{cur_title}</Col>
        </Row>

        <Row className='default-row-spacer'>
          <Col >    
            <Nav variant="tabs" defaultActiveKey="/home">
              <Nav.Item>
                <Nav.Link onClick={() => { this.setState({visual_nav_item: 1}) }} eventKey="link-1">Authors</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link onClick={() => { this.setState({visual_nav_item: 2}) }} eventKey="link-2">Reviewers</Nav.Link>
              </Nav.Item>
            </Nav>
          </Col>
        </Row>

        <Row >
          <Col >
          {cur_nav_item}
          </Col>
        </Row>
      </Container>
    )
  }
}