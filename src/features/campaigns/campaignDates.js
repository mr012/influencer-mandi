export function campaignTimeline(campaign) {
 const format=value=>{const match=/^(\d{4})-(\d{2})-(\d{2})$/.exec(value||'');if(!match)return value||'';const date=new Date(Number(match[1]),Number(match[2])-1,Number(match[3]));return match[3]+' '+date.toLocaleString('en-GB',{month:'long'})+', '+match[1].slice(-2);};
 if(campaign.start&&campaign.end)return format(campaign.start)+' — '+format(campaign.end);
 return (campaign.window||campaign.time||'Not specified').replace(/\d{4}-\d{2}-\d{2}/g,format);
}
