export function createDeleteHandler({verifyUser,revokeSessions,deleteUser}){
 return async req=>{
  const origin=req.headers.get('origin');
  const headers={'Content-Type':'application/json','Cache-Control':'no-store','Vary':'Origin',...(origin==='https://onna.life'?{'Access-Control-Allow-Origin':origin,'Access-Control-Allow-Headers':'authorization, apikey, content-type, x-client-info','Access-Control-Allow-Methods':'POST, OPTIONS'}:{})};
  const response=(status,error)=>new Response(JSON.stringify(error?{error}:{deleted:true}),{status,headers});
  if(origin&&origin!=='https://onna.life')return response(403,'origin_not_allowed');
  if(req.method==='OPTIONS')return new Response(null,{status:204,headers});
  if(req.method!=='POST')return response(405,'method_not_allowed');
  const match=req.headers.get('authorization')?.match(/^Bearer (\S+)$/i);
  if(!match)return response(401,'authentication_required');
  try{
   const user=await verifyUser(match[1]);if(!user?.id)return response(401,'authentication_required');
   let body;try{body=await req.json();}catch{return response(400,'confirmation_required');}
   if(body?.confirmation!=='DELETE_MY_ACCOUNT'||Object.keys(body).some(key=>key!=='confirmation'))return response(400,'confirmation_required');
   await revokeSessions(match[1]);
   await deleteUser(user.id);
   return response(200);
  }catch{return response(500,'deletion_failed');}
 };
}
