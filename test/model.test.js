import test from 'node:test';
import assert from 'node:assert/strict';
import {safeUrl,validateProfile} from '../src/model.js';
const profile=()=>({slug:'my-page',display_name:'크리에이터',bio:'소개',theme:'violet',links:[{label:'채널',url:'https://example.com'}],is_published:false});
test('links reject script, non-HTTPS and embedded credentials',()=>{for(const url of ['javascript:alert(1)','data:text/html,x','http://example.com','https://user:pass@example.com'])assert.equal(safeUrl(url),null);assert.equal(safeUrl('https://example.com'),'https://example.com/');});
test('reserved and invalid handles cannot be saved',()=>{for(const slug of ['admin','ab','MYNAME','<script>','../u'])assert.throws(()=>validateProfile({...profile(),slug}));});
test('invalid labels and excessive link collections rejected',()=>{assert.throws(()=>validateProfile({...profile(),links:[{label:'',url:'https://example.com'}]}));assert.throws(()=>validateProfile({...profile(),links:Array(31).fill({label:'link',url:'https://example.com'})}));});
test('valid Korean profile produces normalized links',()=>{const value=validateProfile(profile());assert.equal(value.links[0].url,'https://example.com/');assert.equal(value.display_name,'크리에이터');});
