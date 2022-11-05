use crate::*;

pub type ManuscriptId = String;

#[derive(BorshDeserialize, BorshSerialize, Deserialize, Serialize, PartialEq, Clone)]
#[serde(crate = "near_sdk::serde")]
pub enum ManuscriptStatus {
  Submitted,
  UnderReview,
  MajorRevision,
  MinorRevision,
  Accepted,
  Rejected,
}

#[derive(BorshDeserialize, BorshSerialize, Deserialize, Serialize, PartialEq, Clone)]
#[serde(crate = "near_sdk::serde")]
pub enum Topic {
  Cybersecurity,
  ArtificialIntelligence,
  Blockchain,
}

#[derive(BorshDeserialize, BorshSerialize, Serialize, Deserialize)]
#[serde(crate = "near_sdk::serde")]
pub struct ManuscriptMetadata {  
  pub id: String,
  pub owner_account: AccountId, // Owner of the manuscript
  pub submission_date: String,     
  pub title: String,             
  pub status: ManuscriptStatus,          
  pub m_abstract: String,      
  pub keywords: String, 
  pub topic: Topic,
  pub authors: String, // coauthors: Vec<AccountId> 
  pub media_cid: String, // CID to associated media
  pub reviewers: HashMap<AccountId, ManuscriptStatus>,
}


#[near_bindgen]
impl Journal {
  
  pub fn get_manuscripts_data_by_id(&self, manuscript_id: ManuscriptId) -> Option<ManuscriptMetadata> {
      
    let manuscript_metadata_by_id = self.manuscripts_metadata_by_id.get(&manuscript_id);

    if let Some(manuscript_metadata_by_id) = manuscript_metadata_by_id {
      return Some(manuscript_metadata_by_id)
    } else {
      //if there is no set, we'll simply return an empty vector. 
      return None;
    };
      
  }

  pub fn get_manuscripts_per_owner(&self, account_id: AccountId) -> Vec<ManuscriptId> {
    let manuscripts_for_owner_set = self.manuscripts_per_owner.get(&account_id);

    let manuscripts = if let Some(manuscripts_for_owner_set) = manuscripts_for_owner_set {
      manuscripts_for_owner_set
    } else {
      //if there is no set, we'll simply return an empty vector. 
      return vec![];
    };
    manuscripts.iter().map(|manuscript_id| manuscript_id).collect()
  }

  pub fn get_manuscripts_per_topic(&self, topic: String) -> Vec<ManuscriptId> {

    let topic_enum = topic_str_to_enum(&topic).unwrap_or_else(|| {
     panic!("Topic not found.")
    });

    let manuscripts_for_topic_set = self.manuscripts_per_topic.get(&topic_enum);

    let manuscripts = if let Some(manuscripts_for_topic_set) = manuscripts_for_topic_set {
      manuscripts_for_topic_set
    } else {
      //if there is no set, we'll simply return an empty vector. 
      return vec![];
    };
    manuscripts.iter().map(|manuscript_id| manuscript_id).collect()
  }

  pub fn get_n_manuscripts(&self, n: Option<u64>,) -> Vec<ManuscriptMetadata> {

    //iterate through each manuscript using an iterator
    self.manuscripts_metadata_by_id.keys()
      //take "n" elements in the vector. If we didn't specify n, use 10
      .take(n.unwrap_or(10) as usize) 
      //we'll map the token IDs which are strings into metadata
      .map(|manuscript_id| self.get_manuscripts_data_by_id(manuscript_id.clone()).unwrap())
      //since we turned the keys into an iterator, we need to turn it back into a vector to return
      .collect()
  }

}
