import { runtime } from '../../context/runtime.js';
export const CAMPAIGN_STATE_KEY = 'mandi:campaign-status:v1';
// One-time recovery of the owner's latest prototype deletion test.
function restoreDeletionTest(){
 const key='mandi:restore-deletion-test:2026-10-02';
 try{if(localStorage.getItem(key))return;
 const records=JSON.parse(localStorage.getItem(CAMPAIGN_STATE_KEY)||'{}');
 const latest=Object.entries(records).filter(([,record])=>record.status==='Deleted'&&record.source==='owner'&&record.updatedAt<='2026-10-02T17:54:00.551Z').sort((a,b)=>b[1].updatedAt.localeCompare(a[1].updatedAt))[0];
 if(latest){delete records[latest[0]];localStorage.setItem(CAMPAIGN_STATE_KEY,JSON.stringify(records));}
 localStorage.setItem(key,'done');
 }catch{}
}
export function campaignStatus(campaign) {
  restoreDeletionTest();
  let stored;
  try { stored = JSON.parse(localStorage.getItem(CAMPAIGN_STATE_KEY) || '{}')[campaign.title]; } catch {}
  const state = stored?.status || campaign.status || (campaign.id === 'c7' ? 'Closed' : campaign.id === 'c3' ? 'Paused' : 'Live');
  return state === 'Removed' || state === 'Removed by admin' ? 'Removed by admin' : state;
}
export function campaignHasChats(campaign) {
  const state=runtime.S;if(!state)return false;
  const linked=state.campaignChats?.[campaign.id]||[];
  const seeded=campaign.id==='c1'?['u1']:campaign.id==='c2'?['u3']:[];
  return [...linked,...seeded].some(id=>state.threads?.[id]!=null);
}
export function setCampaignStatus(campaign, status) {
  if(status==='Deleted'&&campaignHasChats(campaign))return false;
  let records = {};
  try { records = JSON.parse(localStorage.getItem(CAMPAIGN_STATE_KEY) || '{}'); } catch {}
  // Owner actions cannot restore campaigns removed by moderation.
  if (campaignStatus(campaign) === 'Removed by admin' && status !== 'Deleted') return false;
  records[campaign.title] = {status, source:'owner', updatedAt:new Date().toISOString()};
  localStorage.setItem(CAMPAIGN_STATE_KEY, JSON.stringify(records));
  return true;
}
