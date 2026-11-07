import test from 'node:test';
import assert from 'node:assert/strict';
import {providerEnabled,providerIds,providers} from '../src/social-auth.js';
test('only configured supported social providers can start authentication',()=>{
 assert.equal(providerEnabled({google:true,kakao:false},'google'),true);
 assert.equal(providerEnabled({google:true,kakao:false},'kakao'),false);
 assert.equal(providerEnabled({facebook:true},'facebook'),false);
 assert.equal(providerEnabled({'custom:naver':true},'naver'),false);
 assert.equal(providerIds.naver,'custom:naver');
 assert.equal(providerIds.kakao,'kakao');
 assert.equal(providers.includes('facebook'),false);
});
