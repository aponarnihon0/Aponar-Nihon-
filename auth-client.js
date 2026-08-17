const SUPABASE_URL='https://xgudgxnkolpqfovfmijl.supabase.co';
const SUPABASE_KEY='sb_publishable_b9WQvx81-1YVhMFiI7T5XA_KE1mAbhd';
const supabaseClient=window.supabase.createClient(SUPABASE_URL,SUPABASE_KEY);
window.ANAuth={
  client:supabaseClient,
  async session(){return (await supabaseClient.auth.getSession()).data.session;},
  async profile(){const s=await this.session();if(!s)return null;const {data}=await supabaseClient.from('profiles').select('*').eq('id',s.user.id).single();return data;},
  async requireUser(){const s=await this.session();if(!s){location.href='/auth.html?next='+encodeURIComponent(location.pathname+location.hash);return null;}return s;},
  async requireAdmin(){const s=await this.requireUser();if(!s)return null;const p=await this.profile();if(!p||p.role!=='admin'){location.href='/profile.html';return null;}return {session:s,profile:p};},
  async activity(event_type,module='',item_key='',extra={}){const s=await this.session();if(!s)return;await supabaseClient.from('activity_events').insert({user_id:s.user.id,event_type,module,item_key,duration_seconds:extra.duration_seconds??null,score:extra.score??null,metadata:extra.metadata??{}});await supabaseClient.rpc('touch_profile_activity');},
  async progress(module,item_key,progress=0,score=null,metadata={}){const s=await this.session();if(!s)return;await supabaseClient.from('student_progress').upsert({user_id:s.user.id,module,item_key,progress,score,metadata,updated_at:new Date().toISOString()},{onConflict:'user_id,module,item_key'});}
};