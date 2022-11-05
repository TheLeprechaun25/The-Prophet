import React, { Component } from 'react';
import { Card, Button, ButtonGroup, Badge} from 'react-bootstrap';
import { cap_to_str } from '../utils'


export default class ManuscriptCard extends Component {

  constructor(props) {
    super(props);
    this.state = {
      n_upvotes: "-",
      upvoting: false,
    }
  }

  async componentDidMount() { 
    const n_upvotes = await this.get_n_upvotes();
    this.setState({n_upvotes: n_upvotes})
  }

  async get_n_upvotes() {
    if (window.walletConnection.isSignedIn()) {
      const n_upvotes = await window.contract.get_n_upvotes_per_manuscript({ manuscript_id: this.props.manuscript.id })
      return n_upvotes 
    }
  }

  async upvote_manuscript(manuscript_id, account_id) {
    if (window.walletConnection.isSignedIn()) {
      this.setState({ upvoting: true })
      try {
        await window.contract.upvote_manuscript({
          manuscript_id: manuscript_id,
          account_id: account_id,
        })
        window.location.reload(false);
      } catch (e) {
        this.setState({ upvoting: false })
        alert(e)
        throw e
      }
      this.setState({ upvoting: false })
    }
  }

  render() {
    
    return (
      
      <div key={this.props.manuscript.id}>

        <Card.Title>
          <a href={`/manuscript/${this.props.manuscript.id}`}>
            <h2>
              {this.props.manuscript.title}
            </h2>
          </a>
        </Card.Title>
 

        <Card.Subtitle className="mb-2 text-muted">
          {cap_to_str(this.props.manuscript.topic)} 
        </Card.Subtitle>
        {this.props.manuscript.status == "Accepted" ? (
          <Card.Text>Status: <span style={{color:"green"}}>{this.props.manuscript.status}</span></Card.Text>  
        ) : this.props.manuscript.status == "Rejected" ? (
          <Card.Text>Status: <span style={{color:"red"}}>{this.props.manuscript.status9}</span></Card.Text>  
        ) : (
          <Card.Text>Status: <span>{cap_to_str(this.props.manuscript.status)}</span></Card.Text> 
        )}

        <Card.Text>Author: <small> <a href={`/profile/${this.props.manuscript.owner_account}`}><Badge bg="dark">{this.props.manuscript.owner_account}</Badge></a></small></Card.Text>            
        <Card.Text>Abstract:<small> {this.props.manuscript.m_abstract.substring(0, 250)}</small></Card.Text>
        {Object.keys(this.props.manuscript.reviewers).length > 0 ? (
        <Card.Text>Reviewers: {Object.keys(this.props.manuscript.reviewers).map((k, i) => <small key={i}> <a href={`/profile/${k}`}><Badge bg="dark">{k}</Badge></a> ({this.props.manuscript.reviewers[k]}) </small>)}</Card.Text>            
        ) : (<></>)}

        <div>
        <ButtonGroup style={{"float": "right"}} className="mb-2">
          <Button
            variant="dark"
            disabled={true}
          >
            {this.state.n_upvotes}
          </Button>
          <Button
            variant="dark"
            disabled={this.state.upvoting}
            onClick={async () => { 
              await this.upvote_manuscript(this.props.manuscript.id, window.accountId);
            }}
          >
            {this.state.upvoting ? 'Upvoting…' : 'Upvote'}
          </Button>
        </ButtonGroup>
        </div>
      </div>
     
    )
  }
}