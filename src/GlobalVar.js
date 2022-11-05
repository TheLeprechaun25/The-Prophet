import * as nearAPI from "near-api-js";
const { utils } = nearAPI;

export const SUBMISSION_COST = utils.format.parseNearAmount("1"); // In NEARs

export const MAX_NUMBER_TITLE_CHARS = 200;

export const MAX_NUMBER_ABSTRACT_CHARS = 3500;

export const BECOME_REVIEWER_COST = utils.format.parseNearAmount("10"); // In NEARs