import React, { Component } from 'react';
import { Card } from 'react-bootstrap';
import Placeholder from 'react-bootstrap/Placeholder';
import { ManuscriptCard } from '../components';


export default class ManuscriptCardSet extends Component {
  render() {
    const cards = this.props.ShownManuscripts.length > 0 ? (
      <>
      {this.props.ShownManuscripts.map((shown_manuscript) => (
        <div key={shown_manuscript.id}>
        <Card bg={"light"} >
          <Card.Body>
            <ManuscriptCard key={shown_manuscript.id} manuscript={shown_manuscript}/>
          </Card.Body>
        </Card>
        <br />
        </div>
      ))}
      </>
    ) : (
      <>
        <Card >
          <Card.Body>
            <Placeholder as={Card.Title} animation="glow">
              <Placeholder xs={6} />
            </Placeholder>
            <Placeholder as={Card.Text} animation="glow">
              <Placeholder xs={7} /> <Placeholder xs={4} /> <Placeholder xs={4} />{' '}
              <Placeholder xs={6} /> <Placeholder xs={8} />
            </Placeholder>
            <Placeholder.Button variant="primary" xs={6} />
          </Card.Body>
        </Card>
      </>
    )
    return (
      <>
      {cards}
      </>

    )
  
  }
}