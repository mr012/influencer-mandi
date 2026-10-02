import { campaignStatus } from './campaignState.js';
import { runtime } from "../../context/runtime.js";
import { CREATORS } from "../../mocks/creators.js";
import { ARCHIVED_CAMPAIGNS, CAMPAIGNS } from "../../mocks/campaigns.js";
import { campCard } from "../../components/cards/cardMarkup.js";
import { go } from '../../app/routes.js';

const campaignPreviewIds = ["c1", "c2", "c3", "c7"];
const campaignPreviews = [...CAMPAIGNS, ...ARCHIVED_CAMPAIGNS];

export function fill_likedby() {
  runtime.root.querySelectorAll(".row").forEach((r, k) => {
    const u = CREATORS[k % CREATORS.length];
    r.dataset.act = "detail:" + u.id;
  });
}
export function fill_campaigns() {
  const ids=[...campaignPreviewIds];
  const extra=CAMPAIGNS.filter(c=>!campaignPreviewIds.includes(c.id));
  const template=runtime.root.querySelector('tbody tr') || runtime.root.querySelector('.body .row');
  for(const c of extra) {
    if(!template)break;
    const row=template.cloneNode(true);template.parentElement.append(row);
    ids.push(c.id);if(!campaignPreviews.some(item=>item.id===c.id))campaignPreviews.push(c);
  }
  runtime.root.querySelectorAll(".row, tbody tr").forEach((row, index) => {
    delete row.dataset.act;
    const id = ids[index];
    if (!id) return;
    row.classList.add("campaign-list-row");
    row.onclick=event=>{if(event.target.closest("button,[data-act]"))return;runtime.S.previewCampaignId=id;go("campaign",id);};
    const status=campaignStatus(campaignPreviews.find(c=>c.id===id));
    const statusElement=row.matches("tr")?row.querySelector("td:nth-child(2)"):row.querySelector(".badge,.tag,.meta");
    if(statusElement){statusElement.replaceChildren();const badge=document.createElement('span');badge.className='campaign-list-status '+(status==='Live'?'live':status==='Paused'?'paused':'removed');const dot=document.createElement('i');dot.setAttribute('aria-hidden','true');badge.append(dot,document.createTextNode(status));statusElement.append(badge);}
    const title = campaignPreviews.find(campaign => campaign.id === id)?.title || "campaign";
    const titleElement = row.matches("tr") ? row.querySelector("td:first-child") : row.querySelector(".tx b");
    if(titleElement){const textNode=[...titleElement.childNodes].find(node=>node.nodeType===3 && node.textContent.trim());if(textNode)textNode.textContent=title;}
    const campaign=campaignPreviews.find(item=>item.id===id);
    row.dataset.search=[campaign.title,campaign.cat,campaign.loc,status].filter(Boolean).join(' ').toLowerCase();
    const categoryHost=row.matches('tr')?row.querySelector('td:first-child'):row.querySelector('.tx');
    if(categoryHost){const sub=categoryHost.querySelector('small,.sub');if(sub)sub.textContent=[campaign.cat,campaign.loc].filter(Boolean).join(' · ');else{const category=document.createElement('small');category.className='campaign-category';category.textContent=campaign.cat||'Uncategorized';categoryHost.append(category);}}
    const actions = document.createElement("div");
    actions.className = "campaign-row-actions";
    const detailsAction = document.createElement("span");
    detailsAction.className = "campaign-row-link";
    detailsAction.textContent = "View details";
    detailsAction.onclick=event=>{event.stopPropagation();runtime.S.previewCampaignId=id;go("campaign",id);};
    detailsAction.setAttribute("aria-label", `View ${title} details`);
    const cardAction = document.createElement("span");
    cardAction.className = "campaign-row-link campaign-card-link";
    cardAction.textContent = "View card";
    cardAction.dataset.act = `campaignpreview:${id}`;
    cardAction.setAttribute("aria-label", `View ${title} card`);
    actions.append(detailsAction);
    const edit = document.createElement('button'); edit.type = 'button'; edit.className = 'campaign-row-link'; edit.textContent = 'Edit';
    edit.onclick = event => { event.stopPropagation(); runtime.S.previewCampaignId = id; go('editcampaign', id); };

    if (row.matches("tr")) row.lastElementChild.replaceChildren(actions);
    else {row.appendChild(actions);const badge=row.querySelector('.campaign-list-status');if(badge){row.querySelector('.tx b')?.append(badge);row.querySelector('.meta')?.remove();}}
  });
  const rows=[...runtime.root.querySelectorAll('.campaign-list-row')];
  const searchWrap=document.createElement('div');searchWrap.className='campaign-list-search';
  searchWrap.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 4 4"/></svg><input type="search" aria-label="Search campaigns" placeholder="Search campaigns, category or location">';
  const list=runtime.root.querySelector('.table-wrap')||rows[0];
  if(list)list.before(searchWrap);else (runtime.root.querySelector('.workspace,.body')||runtime.root).append(searchWrap);
  const emptySearch=document.createElement('p');emptySearch.className='campaign-search-empty';emptySearch.setAttribute('role','status');emptySearch.hidden=true;emptySearch.textContent='No campaigns match your search.';searchWrap.after(emptySearch);
  searchWrap.querySelector('input').oninput=event=>{const query=event.target.value.trim().toLowerCase();let count=0;for(const row of rows){row.hidden=!row.dataset.search.includes(query);if(!row.hidden)count++;}emptySearch.hidden=!query||count>0;};
  const hasCampaigns=!!runtime.root.querySelector('.campaign-list-row');
  runtime.root.querySelectorAll('.ph-empty').forEach(el=>el.hidden=hasCampaigns);
  if(!hasCampaigns&&!runtime.root.querySelector('.ph-empty')){const empty=document.createElement('div');empty.className='ph-empty';empty.textContent='Post your first campaign so creators can find you.';(runtime.root.querySelector('.workspace,.body')||runtime.root).append(empty);}
}
export function fill_campaign() {
  runtime.root.querySelectorAll(".chips .chip").forEach(c => {
    if (["Live", "Pause", "Close"].includes(c.textContent.trim())) c.dataset.act = "status";
  });
}

export function fill_cardpreview() {
  const campaign = campaignPreviews.find(item => item.id === runtime.S.previewCampaignId) || CAMPAIGNS[0];
  const cardHost = runtime.root.querySelector(".solo-card,.body > .deck");
  if (cardHost) cardHost.innerHTML = campCard(campaign, "front");

  const backButton = [...runtime.root.querySelectorAll(".btn")].find(button => button.textContent.trim().toLowerCase() === "back to campaign");
  if (backButton && !runtime.root.querySelector(".campaign-more-details")) {
    const moreButton = document.createElement("span");
    moreButton.className = "btn ghost campaign-more-details";
    moreButton.textContent = "More details";
    if (backButton.parentElement.classList.contains("action-row")) {
      backButton.before(moreButton);
    } else {
      const actions = document.createElement("div");
      actions.className = "g2";
      backButton.before(actions);
      actions.append(moreButton, backButton);
    }
  }

  runtime.root.querySelectorAll(".kv").forEach(row => {
    const label = row.querySelector("span")?.textContent.trim();
    const value = row.querySelector("b");
    if (!value) return;
    const details = {
      Budget: campaign.budget,
      "Shoot window": campaign.window,
      "Apply by": campaign.apply,
      Deliverables: campaign.del.join(", "),
      Location: campaign.loc,
      "Minimum audience": campaign.min
    };
    if (details[label]) value.textContent = details[label];
  });

  runtime.root.querySelectorAll(".campaign-more-details").forEach(button => {
    button.dataset.act = `detail:${campaign.id}`;
  });
}
