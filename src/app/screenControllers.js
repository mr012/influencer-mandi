import { fill_discover } from "../features/discovery/deckController.js";
import { fill_chats, fill_convo, fill_matches } from "../features/chats/chatController.js";
import { fill_liked } from "../features/saved/savedController.js";
import { fill_campaign, fill_campaigns, fill_cardpreview, fill_likedby } from "../features/campaigns/campaignController.js";
import { fill_profile } from "../features/profile/profileController.js";
import { fill_a_verify } from "../features/admin/adminController.js";

export const FILL = {
  discover: fill_discover,
  chats: fill_chats,
  convo: fill_convo,
  liked: fill_liked,
  matches: fill_matches,
  likedby: fill_likedby,
  campaigns: fill_campaigns,
  campaign: fill_campaign,
  cardpreview: fill_cardpreview,
  profile: fill_profile,
  a_verify: fill_a_verify
};
