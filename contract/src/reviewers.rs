use crate::*;


#[derive(BorshDeserialize, BorshSerialize, Serialize, Deserialize)]
#[serde(crate = "near_sdk::serde")]
pub struct ReviewerData {  
  pub id: AccountId,
  pub number_of_reviews: u64, 
  pub upvotes: u64,     
  pub downvotes: u64,    
  pub reviewing_manuscripts: HashMap<ManuscriptId, ManuscriptStatus>,          
}

#[near_bindgen]
impl Journal {

  #[payable]
  pub fn add_reviewer(&mut self,) {
    // Function to become a reviewer
    let account_id = env::signer_account_id();

    let reviewer_data = ReviewerData {
      id: account_id.clone(),
      number_of_reviews: 0,
      upvotes: 0,
      downvotes: 0,
      reviewing_manuscripts: Default::default(),
    };

    //get the attached deposit
    let attached_deposit = env::attached_deposit();

    //make sure that the attached deposit is greater than or equal to the required cost
    assert!(
      BECOME_REVIEWER_COST <= attached_deposit,
      "Must attach {} yoctoNEAR",
      BECOME_REVIEWER_COST,
    );

    assert!(
        self.reviewer_list.insert(&account_id, &reviewer_data).is_none(),
        "You are already a reviewer"
    );
    
    // Use env::log to record logs permanently to the blockchain!
    env::log(format!("'{}' became a reviewer.", account_id).as_bytes());

  }

  pub fn get_reviewer_data(&self, account_id: AccountId,) -> Option<ReviewerData> {
 
    let reviewer_data = self.reviewer_list.get(&account_id);

    if let Some(reviewer_data) = reviewer_data {
        return Some(reviewer_data)
    } else {
        //if there is no set, we'll simply return an empty vector. 
        return None;
    };
  }

  pub fn add_reviewer_to_submission(&mut self, manuscript_id: ManuscriptId) {
    let account_id = env::signer_account_id();

    let mut reviewer_data = self.get_reviewer_data(account_id.clone()).unwrap_or_else(|| {
      panic!("User is not a reviewer.")
    });

    let mut metadata = self.get_manuscripts_data_by_id(manuscript_id.clone()).unwrap_or_else(|| {
      panic!("Manuscript not found.")
    });

    assert!(
      self.pending_review_manuscripts.contains(&manuscript_id),
      "Manuscript is not under review."
    );

    assert!(
      metadata.owner_account != account_id,
      "Reviewer is the owner of this manuscript."
    );

    assert!(
      !metadata.reviewers.contains_key(&account_id),
      "User is already a reviewer of this manuscript."
    );

    // Change status to under review if the status is submitted (no reviewers yet)
    if metadata.status == ManuscriptStatus::Submitted {
      metadata.status = ManuscriptStatus::UnderReview;
    }

    // Insert manuscript to the set of reviewing manuscripts of the user
    reviewer_data.reviewing_manuscripts.insert(manuscript_id.clone(), ManuscriptStatus::UnderReview);

    reviewer_data.number_of_reviews += 1;
    
    self.reviewer_list.insert(&account_id, &reviewer_data);

    metadata.reviewers.insert(account_id.clone(), ManuscriptStatus::UnderReview);

    self.manuscripts_metadata_by_id.insert(&manuscript_id, &metadata);

  }

  pub fn submit_review(&mut self, manuscript_id: ManuscriptId, review_decision: ManuscriptStatus) {
    let account_id = env::signer_account_id();

    let mut reviewer_data = self.get_reviewer_data(account_id.clone()).unwrap_or_else(|| {
      panic!("User is not a reviewer.")
    });

    let mut metadata = self.get_manuscripts_data_by_id(manuscript_id.clone()).unwrap_or_else(|| {
      panic!("Manuscript not found.");
    });

    assert!(
      self.pending_review_manuscripts.contains(&manuscript_id),
      "Manuscript is not under review."
    );

    assert!(
      metadata.reviewers.contains_key(&account_id),
      "User is not a reviewer of this manuscript."
    );

    metadata.reviewers.insert(account_id.clone(), review_decision.clone());
    self.manuscripts_metadata_by_id.insert(&manuscript_id, &metadata);

    reviewer_data.reviewing_manuscripts.insert(manuscript_id.clone(), review_decision.clone());
    self.reviewer_list.insert(&account_id, &reviewer_data);

    // If the manuscript has more than MIN_REVIEW_TO_DECISION, take a decision
    if metadata.reviewers.len() >= MIN_REVIEW_TO_DECISION {
      // check the number of each status
      let mut n_accept = 0;
      let mut n_change = 0;
      let mut n_reject = 0;
      for (_, decision) in metadata.reviewers.iter() {
        match decision {
          ManuscriptStatus::Accepted => n_accept += 1,
          ManuscriptStatus::MinorRevision => n_change += 1,
          ManuscriptStatus::MajorRevision => n_change += 1,
          ManuscriptStatus::Rejected => n_reject += 1,
          _ => (),
        }
      }

      let accept_condition = (2 * n_accept)  > (n_change + n_reject) ;
      let reject_condition = (2 * n_reject)  > (n_change + n_accept) ;
      if accept_condition || reject_condition {
        self.pending_review_manuscripts.remove(&manuscript_id);
        for (reviewer, _) in metadata.reviewers.iter() {
          let mut reviewer_data = self.get_reviewer_data(account_id.clone()).unwrap_or_else(|| {
            panic!("User is not a reviewer.")
          });

          reviewer_data.reviewing_manuscripts.remove(&manuscript_id);
          self.reviewer_list.insert(&account_id, &reviewer_data);
        }
      }

      if accept_condition {
        metadata.status = ManuscriptStatus::Accepted;
        env::log(format!("Performing Reviewing decision: '{}' accepts, '{}' major/minor changes '{}' rejects, final decision: Accepted", n_accept, n_change, n_reject).as_bytes());
      } else if reject_condition {
        metadata.status = ManuscriptStatus::Rejected;
        env::log(format!("Performing Reviewing decision: '{}' accepts, '{}' major/minor changes '{}' rejects, final decision: Rejected", n_accept, n_change, n_reject).as_bytes());
      }


      self.manuscripts_metadata_by_id.insert(&manuscript_id, &metadata);

    }
    
  }


  pub fn get_review_manuscripts_per_reviewer(&self, account_id: AccountId ) -> Vec<ManuscriptMetadata> {
    //let account_id = env::signer_account_id();

    let reviewer_data = self.get_reviewer_data(account_id).unwrap_or_else(|| {
      panic!("User is not a reviewer.")
    });

    //iterate through each manuscript using an iterator
    let reviewing_manuscripts = reviewer_data.reviewing_manuscripts;
    reviewing_manuscripts.iter() 
        //we'll map the token IDs which are strings into metadata
        .map(|(manuscript_id, _)| self.get_manuscripts_data_by_id(manuscript_id.clone()).unwrap())
        //since we turned the keys into an iterator, we need to turn it back into a vector to return
        .collect()
  }

}