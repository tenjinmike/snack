import {createClient} from 'npm:@supabase/supabase-js@2.119.0';
import {createDeleteHandler} from './handler.js';
const admin=createClient(Deno.env.get('SUPABASE_URL')!,Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,{auth:{persistSession:false,autoRefreshToken:false}});
Deno.serve(createDeleteHandler({
 verifyUser:async token=>{const {data,error}=await admin.auth.getUser(token);return error?null:data.user;},
 revokeSessions:async token=>{const {error}=await admin.auth.admin.signOut(token,'global');if(error)throw error;},
 deleteUser:async id=>{const {error}=await admin.auth.admin.deleteUser(id);if(error)throw error;}
}));
