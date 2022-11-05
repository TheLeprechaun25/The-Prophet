import { connect, Contract, keyStores, WalletConnection } from 'near-api-js'
import getConfig from './config'
//import { Web3Storage } from 'web3.storage'
import { Web3Storage } from 'web3.storage/dist/bundle.esm.min.js'


const nearConfig = getConfig('development')

// Initialize contract & set global variables
export async function initContract() {
  // Initialize connection to the NEAR testnet
  const near = await connect(Object.assign({ deps: { keyStore: new keyStores.BrowserLocalStorageKeyStore() } }, nearConfig))

  // Initializing Wallet based Account. It can work with NEAR testnet wallet that
  // is hosted at https://wallet.testnet.near.org
  window.walletConnection = new WalletConnection(near)

  // Getting the Account ID. If still unauthorized, it's just empty string
  window.accountId = window.walletConnection.getAccountId()

  // Initializing our contract APIs by contract name and configuration
  window.contract = await new Contract(window.walletConnection.account(), nearConfig.contractName, {
    // View methods are read only. They don't modify the state, but usually return some value.
    viewMethods: ['get_manuscripts_per_owner', 'get_manuscripts_per_topic', 'get_manuscripts_data_by_id', 'get_n_manuscripts', 'get_reviewer_data', 'get_pending_review_manuscripts', 'get_review_manuscripts_per_reviewer', 'get_n_upvotes_per_manuscript'],
    // Change methods can modify the state. But you don't receive the returned value when called.
    changeMethods: ['submit_manuscript', 'cancel_submission', 'add_reviewer', 'add_reviewer_to_submission', 'submit_review', 'upvote_manuscript'],
  })
}

export function logout() {
  window.walletConnection.signOut()
  // reload page
  window.location.replace(window.location.origin + window.location.pathname)
}

export function login() {
  // Allow the current app to make calls to the specified contract on the
  // user's behalf.
  // This works by creating a new access key for the user's account and storing
  // the private key in localStorage.
  window.walletConnection.requestSignIn(nearConfig.contractName)
}

export async function get_manuscripts_data_per_owner(owner) {
  const manuscript_ids = await window.contract.get_manuscripts_per_owner({ account_id: owner })
  const manuscripts = await Promise.all( 
    manuscript_ids.map(async (manuscript_id) => {
      const manuscript = await window.contract.get_manuscripts_data_by_id({ manuscript_id: manuscript_id });
      return manuscript
    })
  );
  return manuscripts
}

export async function get_manuscripts_data_per_topic(topic) {
  const manuscript_ids = await window.contract.get_manuscripts_per_topic({ topic: topic })
  const manuscripts = await Promise.all( 
    manuscript_ids.map(async (manuscript_id) => {
      const manuscript = await window.contract.get_manuscripts_data_by_id({ manuscript_id: manuscript_id });
      return manuscript
    })
  );
  return manuscripts
}

export function cap_to_str(cap_str) {
  const new_str = cap_str.split(/(?=[A-Z])/).join(" ");
  return new_str
}


const getAccessToken = () => {
  return process.env.WEB3STORAGE_TOKEN
}

export function makeStorageClient () {
  return new Web3Storage({ token: getAccessToken() })
}