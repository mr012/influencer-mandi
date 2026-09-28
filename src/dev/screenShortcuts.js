import { MAP } from '../config/routes.js';
export const adminScreens = [
  ['a_login','Login'], ['a_overview','Overview'], ['a_regions','Regions'], ['a_revenue','Revenue'],
  ['a_users','People'], ['a_verify','Verification'], ['a_mod','Campaigns'], ['a_matches','Matches & chats'],
  ['a_reports','Reports & safety'], ['a_subs','Plans & pricing'], ['a_content','Content'], ['a_platform','Platform'],
  ['a_settings','Settings'], ['a_team','Team & roles'], ['a_plug','Integrations'], ['a_audit','Audit log'], ['a_notifications','Notifications']
];
export const adminModules = { a_overview:'overview', a_regions:'regions', a_revenue:'revenue', a_users:'people', a_verify:'verify', a_mod:'campaigns', a_matches:'matches', a_reports:'safety', a_subs:'pricing', a_content:'content', a_platform:'platform', a_settings:'settings', a_team:'team', a_plug:'plug', a_audit:'audit', a_notifications:'notifications' };
export function screenShortcuts(mode) {
  if (mode === 'admin') return adminScreens;
  const brandOnly = ['likedby','campaigns','newcampaign','editcampaign','campaign','cardpreview'];
  return Object.entries(MAP).filter(([route]) => !route.startsWith('a_') && (mode === 'brand' || !brandOnly.includes(route)))
    .map(([route,label]) => [route, typeof label === 'string' ? label : label[mode === 'brand' ? 'b' : 'c']]);
}
