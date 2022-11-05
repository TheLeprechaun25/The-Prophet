import { Web3Storage } from 'web3.storage/dist/bundle.esm.min.js'


function getAccessToken () {
  // If you're just testing, you can paste in a token
  // and uncomment the following line:
  return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweEVGZTdjYjA1QjI5MzZFQzA4M2MyMzU1MWYwMEFEZjdEQTY3NzlhODMiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NjY2NDM3NTAwODIsIm5hbWUiOiJ0aGVwcm9waGV0In0.tdwS3OFAWhLbW5mMUMtftAPCodGfvwEQOZS_F5pjV4Y'

  // In a real app, it's better to read an access token from an
  // environement variable or other configuration that's kept outside of
  // your code base. For this to work, you need to set the
  // WEB3STORAGE_TOKEN environment variable before you run your code.
  // return process.env.WEB3STORAGE_TOKEN
}

function makeStorageClient () {
  return new Web3Storage({ token: getAccessToken() })
}

export function getFiles () {
  const fileInput = document.querySelector('input[type="file"]')
  return fileInput.files
}

export async function storeFiles (files) {
  const client = makeStorageClient()
  const cid = await client.put(files)
  console.log('stored files with cid:', cid)
  return cid
}