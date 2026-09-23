import { CREATORS } from "../mocks/creators.js";
import { CAMPAIGNS } from "../mocks/campaigns.js";
import { brand } from "../context/session.js";

export const CREATOR_TAGS = [...new Set(CREATORS.flatMap(x => x.tags))];
export const BRAND_CATEGORIES = [...new Set(CAMPAIGNS.map(x => x.cat.replace(/ campaign$/, '')))];
export const categoryOptions = () => brand() ? CREATOR_TAGS : BRAND_CATEGORIES;
