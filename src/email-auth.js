export function emailAuthError(error){
 if(error?.status===429||error?.code==='over_email_send_rate_limit')return '요청이 많습니다. 잠시 후 다시 시도해 주세요.';
 if(error?.code==='email_address_not_authorized'||error?.message?.includes('Email address not authorized'))return '이메일 발송 서비스 연결 전이라 현재는 테스트 이메일만 가입할 수 있습니다. 일반 가입이 열리면 다시 이용해 주세요.';
 if(error?.code==='email_not_confirmed'||error?.message?.includes('Email not confirmed'))return '인증 메일의 링크를 눌러 이메일을 확인한 뒤 로그인해 주세요.';
 if(error?.code==='invalid_credentials'||error?.message?.includes('Invalid login credentials'))return '이메일 또는 비밀번호를 확인해 주세요.';
 if(error?.code==='weak_password')return '더 안전한 비밀번호를 사용해 주세요. 8자 이상으로 입력해 주세요.';
 return '요청을 완료하지 못했습니다. 연결 상태를 확인하고 다시 시도해 주세요.';
}
export function passwordsMatch(password,confirmation){return password.length>=8&&password.length<=128&&password===confirmation;}
export function setupEmailAuth({beforeSignup=()=>true,client,dialog,getDraft,draftKey,onSignedIn}){
 const $=id=>document.getElementById(id),form=$('emailAuthForm'),email=$('emailAddress'),password=$('emailPassword'),confirmation=$('emailConfirm'),status=$('emailAuthStatus');
 const modeButtons=[...dialog.querySelectorAll('[data-email-mode]')];let mode='login',busy=false,recoveryAllowed=false,sendAfter=0;
 function setMode(next){if(busy)return;if(next==='update'&&!recoveryAllowed)return;mode=next;status.textContent='';password.value='';confirmation.value='';confirmation.setCustomValidity('');
  $('emailAddressRow').hidden=next==='update';email.disabled=next==='update';$('emailPasswordRow').hidden=next==='reset';password.disabled=next==='reset';password.autocomplete=next==='login'?'current-password':'new-password';
  const confirm=next==='signup'||next==='update';$('emailConfirmRow').hidden=!confirm;confirmation.disabled=!confirm;confirmation.required=confirm;$('passwordHelp').hidden=next==='login'||next==='reset';
  $('emailSubmit').textContent={login:'이메일로 로그인',signup:'이메일로 회원가입',reset:'재설정 메일 보내기',update:'새 비밀번호 저장'}[next];$('emailAuthTitle').textContent={login:'이메일 로그인',signup:'이메일 회원가입',reset:'비밀번호 재설정',update:'새 비밀번호 설정'}[next];
  $('forgotPassword').hidden=next!=='login';$('backToLogin').hidden=next==='login'||next==='update';$('resendConfirmation').hidden=true;modeButtons.forEach(b=>{b.setAttribute('aria-pressed',String(b.dataset.emailMode===next));b.hidden=next==='update';});
 }
 function setBusy(value){busy=value;form.querySelectorAll('button').forEach(b=>b.disabled=value);modeButtons.forEach(b=>b.disabled=value);}
 modeButtons.forEach(b=>b.addEventListener('click',()=>setMode(b.dataset.emailMode)));$('forgotPassword').addEventListener('click',()=>setMode('reset'));$('backToLogin').addEventListener('click',()=>setMode('login'));
 confirmation.addEventListener('input',()=>confirmation.setCustomValidity(''));password.addEventListener('input',()=>confirmation.setCustomValidity(''));
 dialog.addEventListener('close',()=>{password.value='';confirmation.value='';});
 form.addEventListener('submit',async event=>{event.preventDefault();if(busy||!form.reportValidity())return;if((mode==='signup'||mode==='update')&&!passwordsMatch(password.value,confirmation.value)){confirmation.setCustomValidity('비밀번호가 일치하지 않습니다.');confirmation.reportValidity();return;}
  if(mode==='signup'&&!beforeSignup())return;const submittedMode=mode;setBusy(true);status.textContent='처리 중…';
  try{try{localStorage.setItem(draftKey,JSON.stringify(getDraft()));}catch{/* Authentication can continue without saving an editor draft. */}
   let result;const credentials={email:email.value.trim(),password:password.value};
   if(mode==='signup')result=await client.auth.signUp({...credentials,options:{emailRedirectTo:location.origin+'/#studio'}});
   else if(mode==='reset')result=await client.auth.resetPasswordForEmail(credentials.email,{redirectTo:location.origin+'/#reset-password'});
   else if(mode==='update'){if(!recoveryAllowed)throw Error('no recovery session');result=await client.auth.updateUser({password:password.value});}
   else result=await client.auth.signInWithPassword(credentials);
   password.value='';confirmation.value='';if(result.error)throw result.error;
   if(submittedMode==='reset'){status.textContent='가입된 이메일이라면 비밀번호 재설정 메일을 보냈습니다. 메일의 링크를 같은 브라우저에서 열어 주세요.';}
   else if(submittedMode==='signup'&&!result.data.session){status.textContent='인증 메일을 확인해 주세요. 같은 브라우저에서 메일의 링크를 열면 가입을 마칠 수 있습니다.';$('resendConfirmation').hidden=false;sendAfter=Date.now()+60000;}
   else{if(submittedMode==='update'){recoveryAllowed=false;status.textContent='비밀번호를 변경했습니다.';}if(result.data?.user)await onSignedIn(result.data.user);dialog.close();}
  }catch(error){status.textContent=emailAuthError(error);password.value='';confirmation.value='';if(error?.code==='email_not_confirmed')$('resendConfirmation').hidden=false;}
  finally{setBusy(false);}
 });
 $('resendConfirmation').addEventListener('click',async()=>{if(busy||!email.reportValidity())return;if(Date.now()<sendAfter){status.textContent='인증 메일은 1분 뒤 다시 요청할 수 있습니다.';return;}setBusy(true);try{const {error}=await client.auth.resend({type:'signup',email:email.value.trim(),options:{emailRedirectTo:location.origin+'/#studio'}});if(error)throw error;sendAfter=Date.now()+60000;status.textContent='가입 확인이 필요한 이메일이라면 인증 메일을 다시 보냈습니다.';}catch(error){status.textContent=emailAuthError(error);}finally{setBusy(false);}});
 client.auth.onAuthStateChange((event)=>{if(event==='SIGNED_OUT'){recoveryAllowed=false;setMode('login');}if(event==='PASSWORD_RECOVERY'){recoveryAllowed=true;setMode('update');if(!dialog.open)dialog.showModal();status.textContent='새 비밀번호를 입력해 주세요.';}});
 setMode('login');
}
