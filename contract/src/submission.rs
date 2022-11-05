use crate::*;

#[near_bindgen]
impl Journal {

  #[payable]
  pub fn submit_manuscript(
      &mut self, 
      owner_account: AccountId,
      manuscript_id: String, 
      submission_date: String,
      title: String, 
      m_abstract: String,
      keywords: String, 
      topic: String,
      authors: String,
      media_cid: String
  ) {

      let initial_storage_usage = env::storage_usage();
      
      //get the attached deposit
      let attached_deposit = env::attached_deposit();

      //make sure that the attached deposit is greater than or equal to the required cost
      assert!(
        SUBMISSION_COST <= attached_deposit,
        "Must attach {} yoctoNEAR",
        SUBMISSION_COST,
      );

      let account_id = env::signer_account_id();

      let topic_enum = topic_str_to_enum(&topic).unwrap_or_else(|| {
        panic!("Topic not found.")
      });

      let metadata = ManuscriptMetadata {
        id: manuscript_id.clone(),
        owner_account: owner_account.clone(),
        submission_date: submission_date.clone(),
        title: title.clone(),
        status: ManuscriptStatus::Submitted,
        m_abstract: m_abstract.clone(),
        keywords: keywords.clone(),
        topic: topic_enum.clone(),
        authors: authors.clone(),
        media_cid: media_cid.clone(),
        reviewers: Default::default(),
      };

      assert!(
          self.manuscripts_metadata_by_id.insert(&manuscript_id, &metadata).is_none(),
          "Manuscript already exists"
      );

      // MANUSCRIPTS PER OWNER
      self.internal_add_manuscript_to_owner(&owner_account, &manuscript_id);

      // MANUSCRIPTS PER TOPIC
      self.internal_add_manuscript_to_topic(&topic, &manuscript_id);

      // UPVOTES PER MANUSCRIPT
      self.internal_add_upvotes_per_manuscript(&manuscript_id);

      // PENDING REVIEWS
      self.pending_review_manuscripts.insert(&manuscript_id);

      let required_storage_in_bytes = env::storage_usage() - initial_storage_usage;
      env::log(format!("Submitting manuscript entitled: '{}', with authors: '{}', for account '{}', required cost '{}'", title.clone(), authors.clone(), account_id, required_storage_in_bytes).as_bytes());
  }

  pub fn cancel_submission(
    &mut self,
    manuscript_id: &ManuscriptId,
  ) {
    let account_id = env::signer_account_id();

    let mut owner_manuscript_set = self.manuscripts_per_owner.get(&account_id).expect("Manuscript should be owned by the sender");

    //make sure that the manuscript is owned by the owner
    assert!(
      owner_manuscript_set.contains(&manuscript_id),
      "Manuscript should be owned by the sender",
    );
    
    let mut metadata = self.get_manuscripts_data_by_id(manuscript_id.clone()).unwrap_or_else(|| {
      panic!("Manuscript not found.")
    });
    // check if the manuscript is in submitted or under review status
    assert!(
      metadata.status == ManuscriptStatus::Submitted || metadata.status == ManuscriptStatus::UnderReview,
      "Manuscript is not in -Submitted- or -Under Review- status",
    );

    // Remove manuscript from manuscript_per_owner 
    self.internal_remove_manuscript_from_owner(&account_id, &manuscript_id);

    // Remove manuscript from manuscript_per_topic
    let manuscript_metadata_by_id = self.manuscripts_metadata_by_id.get(&manuscript_id);
    let topic_enum = manuscript_metadata_by_id.unwrap_or_else(|| {
      panic!("Topic not found.")
    }).topic;
    self.internal_remove_manuscript_from_topic(&topic_enum, &manuscript_id);

    // Remove from upvotes map
    self.upvotes_per_manuscript.remove(&manuscript_id);

    // Remove manuscript from manuscripts_metadata_by_id
    self.manuscripts_metadata_by_id.remove(&manuscript_id); 

    // Remove manuscript from pending_review_manuscripts
    self.pending_review_manuscripts.remove(&manuscript_id);




  }

  pub fn get_pending_review_manuscripts(&self, n: Option<u64>) -> Vec<ManuscriptMetadata> {
      //iterate through each manuscript using an iterator
      self.pending_review_manuscripts.iter()
          //take "n" elements in the vector. If we didn't specify n, use 10
          .take(n.unwrap_or(10) as usize) 
          //we'll map the token IDs which are strings into metadata
          .map(|manuscript_id| self.get_manuscripts_data_by_id(manuscript_id.clone()).unwrap())
          //since we turned the keys into an iterator, we need to turn it back into a vector to return
          .collect()
  }

}