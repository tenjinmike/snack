import test from 'node:test';import assert from 'node:assert/strict';
import {createDeleteHandler} from '../supabase/functions/delete-account/handler.js';
import {legalChecksAccepted} from '../src/legal.js';
import {translate} from '../src/i18n.js';
test('deletion requires verified identity and explicit confirmation, never a supplied user ID',async()=>{
 let deleted=[],revoked=[];const handler=createDeleteHandler({verifyUser:async token=>token==='valid'?{id:'verified-owner'}:null,revokeSessions:async token=>revoked.push(token),deleteUser:async id=>deleted.push(id)});
 const request=(body,token='valid',origin='https://onna.life')=>new Request('https://example.test/delete',{method:'POST',headers:{Authorization:'Bearer '+token,Origin:origin,'Content-Type':'application/json'},body:JSON.stringify(body)});
 assert.equal((await handler(request({confirmation:'DELETE_MY_ACCOUNT'},'bad'))).status,401);
 assert.equal((await handler(request({confirmation:'DELETE_MY_ACCOUNT'},'valid','https://evil.example'))).status,403);
 assert.equal((await handler(request({confirmation:'DELETE_MY_ACCOUNT',user_id:'someone-else'}))).status,400);
 assert.equal((await handler(request({confirmation:'no'}))).status,400);assert.deepEqual(deleted,[]);
 const result=await handler(request({confirmation:'DELETE_MY_ACCOUNT'}));assert.equal(result.status,200);assert.deepEqual(deleted,['verified-owner']);assert.deepEqual(revoked,['valid']);
});
test('legal confirmation must be explicit and supported locales have working labels',()=>{assert.equal(legalChecksAccepted(true,true),true);assert.equal(legalChecksAccepted('true',true),false);for(const locale of ['en','ja','zh','th'])assert.notEqual(translate('로그인',locale),'로그인');assert.equal(translate('User content','ja'),'User content');});
