import test from 'node:test';
import assert from 'node:assert/strict';
import {readAuthReturn,restoreDraft} from '../src/social-auth.js';
test('recognizes successful and denied OAuth returns without exposing error descriptions',()=>{
 assert.deepEqual(readAuthReturn({search:'?code=temporary',hash:'#studio'}),{hasCallback:true,error:false});
 assert.deepEqual(readAuthReturn({search:'?error=access_denied',hash:''}),{hasCallback:true,error:true});
 assert.deepEqual(readAuthReturn({search:'',hash:'#error=access_denied&error_description=private'}),{hasCallback:true,error:true});
 assert.deepEqual(readAuthReturn({search:'',hash:'#templates'}),{hasCallback:false,error:false});
});
test('unfinished drafts survive OAuth while malformed fields cannot enter selectors',()=>{
 const draft=restoreDraft({display_name:'작업 중',theme:'"]invalid',links:[{label:'아직 입력 중',url:''},null,{url:12}],is_published:'true'});
 assert.equal(draft.theme,'violet');assert.equal(draft.links.length,1);assert.equal(draft.links[0].url,'');assert.equal(draft.is_published,false);
 assert.equal(restoreDraft(null),null);
});
