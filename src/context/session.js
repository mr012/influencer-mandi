import { BRAND_CAMPS } from "../mocks/campaigns.js";
import { seedThreads } from "../mocks/conversations.js";
import { runtime } from "./runtime.js";

export const fresh = () => ({
  mode: "creator",
  side: "creator",
  pickSide: "creator",
  authed: false,
  subscribed: false,
  route: "pick",
  stack: [],
  ctx: null,
  openChat: null,
  camp: BRAND_CAMPS[0],
  previewCampaignId: "c1",
  idx: {
    creator: 0,
    brand: 0
  },
  likesSince: {
    creator: 0,
    brand: 0
  },
  liked: {
    creator: ["c1", "c2", "c4"],
    brand: ["u1", "u3", "u5"]
  },
  matches: {
    creator: ["c1", "c4"],
    brand: ["u1", "u3"]
  },
  threads: seedThreads(),
  adminAuthed: false,
  forms: {},
  filters: {
    creator: {},
    brand: {}
  },
  chatFilter: {
    creator: "All",
    brand: "All"
  },
  readChats: []
});
export const admin = () => runtime.S.mode === "admin";
export const side = () => admin() ? "creator" : runtime.S.authed ? runtime.S.side : runtime.S.pickSide;
export const brand = () => side() === "brand";
