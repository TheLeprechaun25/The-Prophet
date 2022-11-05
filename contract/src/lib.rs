use std::collections::HashMap;
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::serde::{Deserialize, Serialize};
use near_sdk::{env, near_bindgen, setup_alloc, AccountId, Balance, CryptoHash};//, Balance, Promise};
use near_sdk::collections::{LookupMap, UnorderedMap, UnorderedSet};

use crate::internal::*;
pub use crate::manuscript::*;
pub use crate::submission::*;
pub use crate::reviewers::*;
pub use crate::upvotes::*;
pub use crate::utils::*;

mod internal;
mod manuscript;
mod submission;
mod reviewers;
mod upvotes;
mod utils;

setup_alloc!();

pub const SUBMISSION_COST: Balance = 1_000_000_000_000_000_000_000_000;
pub const BECOME_REVIEWER_COST: Balance = 10_000_000_000_000_000_000_000_000;

pub const MIN_REVIEW_TO_DECISION: usize = 1;

#[derive(BorshSerialize)]
pub enum StorageKey {
    ManuscriptsPerOwner,
    ManuscriptsPerOwnerInner { account_id_hash: CryptoHash },
    ManuscriptsPerTopic,
    ManuscriptsPerTopicInner { topic_hash: CryptoHash },
    UpVotesPerManuscript,
    UpVotesPerManuscriptInner { manuscript_id_hash: CryptoHash },
    ManuscriptsMetadataById,
    ReviewerList,
    PendingReviewManuscripts,
    
}

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize)]
pub struct Journal {
    pub manuscripts_per_owner: LookupMap<AccountId, UnorderedSet<ManuscriptId>>,
    pub manuscripts_per_topic: LookupMap<Topic, UnorderedSet<ManuscriptId>>,
    pub upvotes_per_manuscript: LookupMap<ManuscriptId, UnorderedSet<AccountId>>,
    pub manuscripts_metadata_by_id: UnorderedMap<ManuscriptId, ManuscriptMetadata>,
    pub reviewer_list: UnorderedMap<AccountId, ReviewerData>,
    pub pending_review_manuscripts: UnorderedSet<ManuscriptId>,
}

impl Default for Journal {
    fn default() -> Self {
      Self {
        manuscripts_per_owner: LookupMap::new(StorageKey::ManuscriptsPerOwner.try_to_vec().unwrap()),
        manuscripts_per_topic: LookupMap::new(StorageKey::ManuscriptsPerTopic.try_to_vec().unwrap()),
        manuscripts_metadata_by_id: UnorderedMap::new(StorageKey::ManuscriptsMetadataById.try_to_vec().unwrap(),),
        reviewer_list: UnorderedMap::new(StorageKey::ReviewerList.try_to_vec().unwrap(),),
        pending_review_manuscripts: UnorderedSet::new(StorageKey::PendingReviewManuscripts.try_to_vec().unwrap(),),
        upvotes_per_manuscript: LookupMap::new(StorageKey::UpVotesPerManuscript.try_to_vec().unwrap()),
      }
    }
}

#[near_bindgen]
impl Journal {



}
