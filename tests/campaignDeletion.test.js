import test from 'node:test';
import assert from 'node:assert/strict';
import { runtime } from '../src/context/runtime.js';
import { setCampaignStatus } from '../src/features/campaigns/campaignState.js';
test('existing campaign chats block deletion in every status, even without an active match',()=>{
 const previous=runtime.S;
 try{runtime.S={campaignChats:{test:['creator']},threads:{creator:[]},matches:{brand:[]}};
 for(const status of ['Live','Paused','Closed','Removed by admin'])assert.equal(setCampaignStatus({id:'test',title:'Test',status},'Deleted'),false);
 }finally{runtime.S=previous;}
});
