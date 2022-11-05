use crate::*;

#[near_bindgen]
impl Journal {

  pub fn upvote_manuscript(&mut self, manuscript_id: ManuscriptId, account_id: AccountId)  {
    let mut upvotes_per_manuscript_set = self.upvotes_per_manuscript.get(&manuscript_id).unwrap_or_else(|| {
      panic!("Manuscript not found.")
    });

    assert!(
      !upvotes_per_manuscript_set.contains(&account_id),
      "Already upvoted."
    );

    upvotes_per_manuscript_set.insert(&account_id);

    self.upvotes_per_manuscript.insert(&manuscript_id, &upvotes_per_manuscript_set);
  }

  pub fn get_n_upvotes_per_manuscript(&self, manuscript_id: ManuscriptId) -> u64 {
    let upvotes_per_manuscript_set = self.upvotes_per_manuscript.get(&manuscript_id).unwrap_or_else(|| {
      panic!("Manuscript not found.")
    });  
    
    return upvotes_per_manuscript_set.len()
  }
      

}