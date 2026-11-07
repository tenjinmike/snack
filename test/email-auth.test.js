import test from 'node:test';
import assert from 'node:assert/strict';
import {emailAuthError,passwordsMatch} from '../src/email-auth.js';
test('password confirmation rejects mismatches and length violations',()=>{
 assert.equal(passwordsMatch('short','short'),false);
 assert.equal(passwordsMatch('abcdefgh','abcdxxxx'),false);
 assert.equal(passwordsMatch('x'.repeat(129),'x'.repeat(129)),false);
 assert.equal(passwordsMatch('correct-password','correct-password'),true);
});
test('auth errors are useful without revealing raw backend messages',()=>{
 assert.match(emailAuthError({code:'email_address_not_authorized'}),/테스트 이메일/);
 assert.match(emailAuthError({code:'email_not_confirmed'}),/인증 메일/);
 assert.match(emailAuthError({code:'invalid_credentials'}),/이메일 또는 비밀번호/);
 assert.match(emailAuthError({status:429}),/잠시 후/);
 assert.ok(!emailAuthError({message:'private internal data'}).includes('private'));
});
