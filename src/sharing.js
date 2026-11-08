import QRCode from 'qrcode';

// QR generation stays on the device; the page URL is never sent to a QR service.
export function setupSharing({container,getUrl,getTitle=()=> 'ONNA'}){
 const actions=document.createElement('div');actions.className='sharing-actions';
 const share=document.createElement('button');share.type='button';share.className='outline';share.textContent='공유하기';
 const qr=document.createElement('button');qr.type='button';qr.className='outline';qr.textContent='QR 코드';
 const status=document.createElement('p');status.className='sharing-status';status.setAttribute('role','status');
 const dialog=document.createElement('dialog');dialog.className='qr-dialog';
 const heading=document.createElement('h2');heading.textContent='내 페이지 QR 코드';
 const image=document.createElement('img');image.alt='공개 페이지 QR 코드';image.width=256;image.height=256;
 const address=document.createElement('p');address.className='qr-address';
 const save=document.createElement('button');save.type='button';save.className='primary';save.textContent='QR 이미지 저장';
 const close=document.createElement('button');close.type='button';close.className='outline';close.textContent='닫기';
 const buttons=document.createElement('div');buttons.className='sharing-actions';buttons.append(save,close);
 dialog.append(heading,image,address,buttons);document.body.append(dialog);actions.append(share,qr);container.append(actions,status);
 function url(){const value=getUrl();if(!value)return null;try{const result=new URL(value,location.origin);if(result.origin!==location.origin||!/^\/u\/[a-z0-9][a-z0-9_-]{2,29}$/.test(result.pathname))return null;return result.href;}catch{return null;}}
 share.addEventListener('click',async()=>{const value=url();if(!value)return;try{if(navigator.share){await navigator.share({title:getTitle(),url:value});status.textContent='공유 창을 열었습니다.';}else{await navigator.clipboard.writeText(value);status.textContent='공개 링크를 복사했습니다.';}}catch(error){if(error?.name!=='AbortError')status.textContent='공유하지 못했습니다. 주소를 복사해 주세요.';}});
 qr.addEventListener('click',async()=>{const value=url();if(!value)return;qr.disabled=true;try{image.src=await QRCode.toDataURL(value,{width:768,margin:4,errorCorrectionLevel:'M',color:{dark:'#191a18',light:'#ffffff'}});address.textContent=value;dialog.showModal();close.focus();}catch{status.textContent='QR 코드를 만들지 못했습니다. 다시 시도해 주세요.';}finally{qr.disabled=false;}});
 save.addEventListener('click',()=>{const a=document.createElement('a');a.href=image.src;a.download='onna-qr.png';a.click();});
 close.addEventListener('click',()=>dialog.close());dialog.addEventListener('close',()=>qr.focus());
}
