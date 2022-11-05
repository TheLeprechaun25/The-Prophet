use crate::*;
use near_sdk::{CryptoHash};


//used to generate a unique prefix in our storage collections (this is to avoid data collisions)
pub(crate) fn hash_account_id(account_id: &AccountId) -> CryptoHash {
  //get the default hash
  let mut hash = CryptoHash::default();
  //we hash the account ID and return it
  hash.copy_from_slice(&env::sha256(account_id.as_bytes()));
  hash
}

//used to generate a unique prefix in our storage collections (this is to avoid data collisions)
pub(crate) fn hash_topic(topic: &String) -> CryptoHash {
  //get the default hash
  let mut hash = CryptoHash::default();
  //we hash the topic and return it
  hash.copy_from_slice(&env::sha256(topic.as_bytes()));
  hash
}

//used to generate a unique prefix in our storage collections (this is to avoid data collisions)
pub(crate) fn hash_manuscript_id(manuscript_id: &ManuscriptId) -> CryptoHash {
  //get the default hash
  let mut hash = CryptoHash::default();
  //we hash the topic and return it
  hash.copy_from_slice(&env::sha256(manuscript_id.as_bytes()));
  hash
}

impl Journal {
  //add a token to the set of tokens an owner has
  pub(crate) fn internal_add_manuscript_to_owner(
      &mut self,
      account_id: &AccountId,
      manuscript_id: &ManuscriptId,
  ) {
      //get the set of manuscripts for the given account
      let mut manuscripts_set = self.manuscripts_per_owner.get(account_id).unwrap_or_else(|| {
          //if the account doesn't have any manuscript, we create a new unordered set
          UnorderedSet::new(
              StorageKey::ManuscriptsPerOwnerInner {
                  //we get a new unique prefix for the collection
                  account_id_hash: hash_account_id(&account_id),
              }
              .try_to_vec()
              .unwrap(),
          )
      });

      //we insert the token ID into the set
      manuscripts_set.insert(manuscript_id);

      //we insert that set for the given account ID. 
      self.manuscripts_per_owner.insert(account_id, &manuscripts_set);
  }

  //remove a manuscript from an owner (internal method and can't be called directly via CLI).
  pub(crate) fn internal_remove_manuscript_from_owner(
      &mut self,
      account_id: &AccountId,
      manuscript_id: &ManuscriptId,
  ) {
      //we get the set of tokens that the owner has
      let mut manuscripts_set = self
          .manuscripts_per_owner
          .get(account_id)
          //if there is no set of tokens for the owner, we panic with the following message:
          .expect("Token should be owned by the sender");

      //we remove the the manuscript_id from the set of manuscripts
      manuscripts_set.remove(manuscript_id);

      //if the manuscript set is now empty, we remove the owner from the manuscripts_per_owner collection
      if manuscripts_set.is_empty() {
          self.manuscripts_per_owner.remove(account_id);
      } else {
      //if the token set is not empty, we simply insert it back for the account ID. 
          self.manuscripts_per_owner.insert(account_id, &manuscripts_set);
      }
  }

  pub(crate) fn internal_add_manuscript_to_topic(
    &mut self,
    topic: &String,
    manuscript_id: &ManuscriptId,
  ) {
    let topic_enum = topic_str_to_enum(&topic).unwrap_or_else(|| {
      panic!("Topic not found.")
    });
    //get the set of manuscripts for the given account
    let mut manuscripts_set = self.manuscripts_per_topic.get(&topic_enum).unwrap_or_else(|| {
        //if the account doesn't have any manuscript, we create a new unordered set
        UnorderedSet::new(
            StorageKey::ManuscriptsPerTopicInner {
                //we get a new unique prefix for the collection
                topic_hash: hash_topic(&topic),
            }
            .try_to_vec()
            .unwrap(),
        )
    });

    //we insert the token ID into the set
    manuscripts_set.insert(manuscript_id);

    //we insert that set for the given account ID. 
    self.manuscripts_per_topic.insert(&topic_enum, &manuscripts_set);
  }

  //remove a manuscript from a topic (internal method and can't be called directly via CLI).
  pub(crate) fn internal_remove_manuscript_from_topic(
    &mut self,
    topic_enum: &Topic,
    manuscript_id: &ManuscriptId,
  ) {

    //we get the set of tokens that the owner has
    let mut manuscripts_set = self
        .manuscripts_per_topic
        .get(&topic_enum)
        .expect("Manuscript not found on topic");

    //we remove the the manuscript_id from the set of manuscripts
    manuscripts_set.remove(manuscript_id);

    //if the manuscript set is now empty, we remove the owner from the manuscripts_per_owner collection
    if manuscripts_set.is_empty() {
        self.manuscripts_per_topic.remove(&topic_enum);
    } else {
    //if the token set is not empty, we simply insert it back for the account ID. 
        self.manuscripts_per_topic.insert(&topic_enum, &manuscripts_set);
    }
  }

  pub(crate) fn internal_add_upvotes_per_manuscript(
    &mut self,
    manuscript_id: &ManuscriptId,
  ) {

    //get the set of manuscripts for the given account
    let mut upvotes_set = self.upvotes_per_manuscript.get(&manuscript_id).unwrap_or_else(|| {
        //if the account doesn't have any manuscript, we create a new unordered set
        UnorderedSet::new(
            StorageKey::UpVotesPerManuscriptInner {
                //we get a new unique prefix for the collection
                manuscript_id_hash: hash_manuscript_id(&manuscript_id),
            }
            .try_to_vec()
            .unwrap(),
        )
    });

    //we insert that set for the given account ID. 
    self.upvotes_per_manuscript.insert(&manuscript_id, &upvotes_set);
  }

 
}