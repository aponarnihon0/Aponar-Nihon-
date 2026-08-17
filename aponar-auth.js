(()=>{
const SUPABASE_URL='https://xgudgxnkolpqfovfmijl.supabase.co';
const SUPABASE_KEY='sb_publishable_b9WQvx81-1YVhMFiI7T5XA_KE1mAbhd';
const wait=()=>new Promise((resolve,reject)=>{if(window.supabase)return resolve();let n=0;const t=setInterval(()=>{if(window.supabase){clearInterval(t);resolve()}else if(++n>100){clearInterval(t);reject(new Error('Supabase library load failed'))}},50)});
let client;
async function db(){await wait();if(!client)client=window.supabase.createClient(SUPABASE_URL,SUPABASE_KEY,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});return client}
async function session(){const s=await db();const {data}=await s.auth.getSession();return data.session||null}
async function user(){return (await session())?.user||null}
async function profile(){const u=await user();if(!u)return null;const s=await db();const {data}=await s.from('profiles').select('*').eq('id',u.id).single();return data||null}
async function track(section,event_type='page_view',metadata={}){try{const u=await user();if(!u)return;const s=await db();await Promise.all([s.from('activity_events').insert({user_id:u.id,section,event_type,metadata}),s.from('profiles').update({last_active_at:new Date().toISOString()}).eq('id',u.id)]);}catch(e){console.debug('activity',e)}}
async function requireUser(next='login.html'){const u=await user();if(!u){location.href=`/${next}?next=${encodeURIComponent(location.pathname+location.search+location.hash)}`;return null}return u}
async function requireAdmin(){const u=await requireUser();if(!u)return null;const p=await profile();if(!p||p.role!=='admin'){location.href='/dashboard.html';return null}return {user:u,profile:p}}
async function signOut(){const s=await db();await s.auth.signOut();location.href='/'}
window.ANAuth={db,session,user,profile,track,requireUser,requireAdmin,signOut,SUPABASE_URL};
})();