import { brand } from "../context/session.js";

export const AUTH = ["pick", "signup", "login", "code", "forgot", "reset", "onboard"];
export const ADMIN_NAV = {
  users: "a_users",
  verification: "a_verify",
  moderation: "a_mod",
  subscriptions: "a_subs",
  reports: "a_reports"
};
export const TABS_C = ["discover", "chats", "liked", "profile"];
export const TABS_B = ["discover", "campaigns", "chats", "liked", "profile"];
export const TAB_OF = {
  discover: "discover",
  chats: "chats",
  convo: "chats",
  matches: "chats",
  liked: "liked",
  publicprofile: "discover",
  profile: "profile",
  editprofile: "profile",
  billing: "profile",
  subscribe: "profile",
  account: "profile",
  help: "profile",
  contact: "profile",
  terms: "profile",
  privacy: "profile",
  refunds: "profile",
  campaigns: "campaigns",
  campaign: "campaigns",
  newcampaign: "campaigns",
  editcampaign: "campaigns",
  likedby: "campaigns",
  cardpreview: "campaigns"
};
export const LABEL = {
  discover: "Discover",
  campaigns: "Campaigns",
  chats: "Chats",
  liked: "Liked",
  profile: "Profile"
};
export const TAB_ORDER = r => (brand() ? TABS_B : TABS_C).indexOf(TAB_OF[r]);
