import React, { useState, useEffect } from 'react';

import { makeStorageClient } from '../utils'

import { Spinner } from 'react-bootstrap';

export default function PDFview(props) {

  const [manuscriptFile, setmanuscriptFile] = useState(null);
  const [fileChecked, setFileChecked] = useState(false);
  
  useEffect(() => {
    getManuscriptFile(props.manuscriptCID);
  }, []); 

  const getManuscriptFile = async (cid) => {
    try {
      const client = makeStorageClient()
      const res = await client.get(cid)
      //console.log(`Got a response! [${res.status}] ${res.statusText}`)
      if (!res.ok) {
        throw new Error(`failed to get ${cid} - [${res.status}] ${res.statusText}`)
      }
    
      // unpack File objects from the response
      const files = await res.files()
      //for (const file of files) {
        //console.log(`${file.cid} -- ${file.path} -- ${file.size}`)
      //}
      const file = files[0]
      setmanuscriptFile(file)
      setFileChecked(true)
    } catch (e) {
      console.log(e)
    }
  }

  const pdf_view = manuscriptFile ? (
    <iframe src={`https://${manuscriptFile.cid}.ipfs.w3s.link`} width="100%" height="500px"/>
  ) : fileChecked ? (
    <p>Manuscript not found</p>
  ) : (
    <Spinner animation="border" role="status">
    </Spinner>
  )

  return(
    <>
      {pdf_view}
    </>  
  )
}
