import { CAMPAIGNS } from "../mocks/campaigns.js";
import { CREATORS } from "../mocks/creators.js";

export const PLACES = [...new Set([...CAMPAIGNS, ...CREATORS].map(x => x.loc.replace('Delhi NCR', 'Delhi')))];
