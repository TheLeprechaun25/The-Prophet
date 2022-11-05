use crate::*;

pub(crate) fn topic_str_to_enum(topic_str: &str) -> Option<Topic>{
  match topic_str {
    "cybersecurity" => Some(Topic::Cybersecurity),
    "artificialIntelligence" => Some(Topic::ArtificialIntelligence),
    "blockchain" => Some(Topic::Blockchain),
    _ => None,
  }
}