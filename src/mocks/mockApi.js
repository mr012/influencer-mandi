import { ARCHIVED_CAMPAIGNS, CAMPAIGNS } from "./campaigns.js";
import { CREATORS } from "./creators.js";

export const byId = id => CAMPAIGNS.find(x => x.id === id) || ARCHIVED_CAMPAIGNS.find(x => x.id === id) || CREATORS.find(x => x.id === id);
