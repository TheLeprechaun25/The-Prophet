import React, { useState, useEffect, useRef } from "react";
import {Button, Col, Form, Row} from 'react-bootstrap';
import { TopicSelect } from '../components';
import { SUBMISSION_COST, MAX_NUMBER_TITLE_CHARS, MAX_NUMBER_ABSTRACT_CHARS} from '../GlobalVar'
import { makeStorageClient } from '../utils'

export default function SubmitForm() {

  const [validated, setValidated] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [correctSubmission, setCorrectSubmission] = useState(false);
  
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedSuplFile, setSelectedSuplFile] = useState(null);



  const storeFiles = async () => {
    const client = makeStorageClient()
    let files = []
    if (selectedFile != null) {
      if (selectedSuplFile != null) {
        files = [selectedFile, selectedSuplFile]
      } else {
        files = [selectedFile]      
      }
    } else {
      throw 'No files uploaded!';
    }
    const cid = await client.put(files)
    console.log('stored files with cid:', cid)
    return cid
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    const form = event.currentTarget;
    let cid = ""
    if (form.checkValidity() === false) {
      
      event.stopPropagation();
      console.log("Not valid")
      setValidated(true);
    } else {
      try {
        cid = await storeFiles()
      } catch (e) {
        alert(e)
        setCorrectSubmission(false)
        setSubmitting(false);
        throw e
      }

      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth() + 1;
      const currentDay = new Date().getDate();
      const currentDate = [currentYear, currentMonth, currentDay].join('-');
      try {
        await window.contract.submit_manuscript({
          owner_account: window.accountId,
          submission_date: currentDate,
          manuscript_id: form.elements.formTitle.value,
          title: form.elements.formTitle.value,
          m_abstract: form.elements.formAbstract.value,
          keywords: form.elements.formKeywords.value,
          topic: form.elements.formTopic.value,
          authors: window.accountId, //form.elements.formAuthors.value,
          media_cid: cid,
        },
        "300000000000000",
        SUBMISSION_COST)

        setCorrectSubmission(true)
      } catch (e) {
        alert(e)
        setCorrectSubmission(false)
        setSubmitting(false);
        throw e
      }
      form.reset()
      setValidated(false);
    }
    setSubmitting(false);
  };
  
  const correct_message = correctSubmission ? (
    <h3 style={{color:"green", padingBottom: "2em"}}>Correctly submitted</h3>
  ) : (
    <></>
  );

  return (
    <>
    {correct_message}
    <Form noValidate validated={validated} onSubmit={handleSubmit}>
    <Row className="mb-3">
      <Col xs={3}>
        <Form.Group as={Col} controlId="formArticleType">
          <Form.Label>Article type</Form.Label>
          <Form.Select  disabled={submitting} readOnly={submitting} defaultValue="Choose...">
            <option>Regular Paper</option>
            <option>Survey</option>
            <option>Letter</option>
          </Form.Select>
        </Form.Group>
      </Col>
      <Col>
        <Form.Group as={Col} controlId="formTitle">
          <Form.Label>Title (Max. {MAX_NUMBER_TITLE_CHARS} characters)</Form.Label>
          <Form.Control disabled={submitting} readOnly={submitting} maxLength={MAX_NUMBER_TITLE_CHARS} required type="text" placeholder="Title" />
        </Form.Group>
      </Col>
    </Row>

    <Form.Group className="mb-3" controlId="formAbstract">
      <Form.Label>Abstract (Max. {MAX_NUMBER_ABSTRACT_CHARS} characters)</Form.Label>
      <Form.Control disabled={submitting} readOnly={submitting} as="textarea" maxLength={MAX_NUMBER_ABSTRACT_CHARS} required type="text" placeholder="Abstract" />
    </Form.Group>
    {/*
    <Row className="mb-3">
      <Form.Group as={Col} controlId="formAuthors">
        <Form.Label>Authors</Form.Label>
        <Form.Control disabled={submitting} readOnly={submitting} maxLength={MAX_NUMBER_TITLE_CHARS} required type="text" placeholder="Authors" />
      </Form.Group>
    </Row>
    */} 
    <Row className="mb-3">
      <Form.Group as={Col} controlId="formTopic">
      <Form.Label>Topic</Form.Label>
        <Form.Control required as="select" type="select">
          <TopicSelect/>
        </Form.Control>
      </Form.Group >
      <Form.Group as={Col} controlId="formKeywords">
        <Form.Label>Keywords</Form.Label>
        <Form.Control disabled={submitting} readOnly={submitting} maxLength={MAX_NUMBER_TITLE_CHARS} required type="text" placeholder="Keywords" />
      </Form.Group>
    </Row>

    <Row className="mb-3">
    <Form.Group as={Col} controlId="formFile" className="mb-3">
      <Form.Label>Manuscript File (.pdf)</Form.Label>
      <Form.Control required accept=".pdf" onChange={(e) => {
        if (e.target.files[0].type == "application/pdf") {
          setSelectedFile(e.target.files[0])
        } else {
          alert("File must be a pdf.")
          setSelectedFile(null)
        }
        
      }} disabled={submitting} readOnly={submitting} type="file" />
    </Form.Group>

    <Form.Group as={Col} controlId="formSupplementary" className="mb-3">
      <Form.Label>Supplementary Material (optional)</Form.Label>
      <Form.Control onChange={(e) => {

        if (e.target.files[0].type == "application/pdf") {
          setSelectedSuplFile(e.target.files[0])
        } else {
          alert("File must be a pdf.")
          setSelectedSuplFile(null)
        }
        
      }} disabled={submitting} readOnly={submitting} type="file" />
    </Form.Group>
    </Row>
    <Row>
      <Col>
        <Button disabled={submitting} variant="dark" type="submit">
          Submit
        </Button>
      </Col>
      <Col>
        <a style={{"color": "var(--bs-link-color)", "textDecoration": "underline"}} href={`/profile/${window.accountId}`}>Your Submissions</a>
      </Col>
    </Row>

  </Form>
  </>
  )
  
}