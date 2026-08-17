(()=>{
  function addUiStyles(){
    if(document.getElementById('anAccountWidgetStyles')) return;
    const style=document.createElement('style');
    style.id='anAccountWidgetStyles';
    style.textContent=`
      #anAccountWidget{position:fixed;z-index:9998;right:82px;top:14px;display:flex;gap:9px;align-items:center;font-family:'Noto Sans Bengali','Inter',system-ui,sans-serif}
      #anAccountWidget .an-auth-btn{height:42px;padding:0 16px;border-radius:15px;display:inline-flex;align-items:center;justify-content:center;gap:8px;text-decoration:none;font-size:12px;font-weight:900;letter-spacing:.01em;transition:transform .2s ease,box-shadow .2s ease,border-color .2s ease;background:#fff;box-sizing:border-box;white-space:nowrap}
      #anAccountWidget .an-auth-btn i{font-size:14px}
      #anAccountWidget .an-auth-login{color:#1d5f98;border:1px solid rgba(29,95,152,.18);box-shadow:0 8px 24px rgba(30,72,113,.10)}
      #anAccountWidget .an-auth-register{color:#fff;border:1px solid rgba(255,255,255,.18);background:linear-gradient(135deg,#1b79b4 0%,#1766a0 100%);box-shadow:0 10px 26px rgba(23,102,160,.25)}
      #anAccountWidget .an-auth-btn:hover{transform:translateY(-1px);box-shadow:0 12px 28px rgba(30,72,113,.16)}
      #anAccountWidget .an-profile-pill{width:42px;height:42px;border-radius:15px;display:grid;place-items:center;text-decoration:none;background:linear-gradient(135deg,#1b79b4,#175d95);color:#fff;font-weight:900;box-shadow:0 10px 26px rgba(23,102,160,.25);border:1px solid rgba(255,255,255,.22)}
      @media(max-width:520px){
        #anAccountWidget{top:82px;right:16px;gap:8px}
        #anAccountWidget .an-auth-btn{height:44px;padding:0 14px;border-radius:15px;font-size:12px}
        #anAccountWidget .an-auth-login{min-width:82px}
        #anAccountWidget .an-auth-register{min-width:98px}
      }
      @media(max-width:360px){
        #anAccountWidget{right:10px;gap:6px}
        #anAccountWidget .an-auth-btn{height:40px;padding:0 11px;font-size:11px}
        #anAccountWidget .an-auth-login{min-width:72px}
        #anAccountWidget .an-auth-register{min-width:88px}
      }
    `;
    document.head.appendChild(style);
  }

  function updateBottomNav(){
    const cv=document.querySelector('.app-bottom-nav [data-nav="jlpt"]');
    if(cv){
      cv.href='/cv-builder.html';
      cv.setAttribute('aria-label','CV Builder');
      const icon=cv.querySelector('i'); if(icon) icon.className='fa-solid fa-file-signature';
      const label=cv.querySelector('.app-nav-label'); if(label) label.textContent='CV BUILDER';
    }

    const mock=document.querySelector('.app-bottom-nav [data-nav="quiz"]');
    if(mock){
      mock.href='/mock-test.html';
      mock.setAttribute('aria-label','Mock Test');
      const icon=mock.querySelector('i'); if(icon) icon.className='fa-solid fa-clipboard-check';
      const label=mock.querySelector('.app-nav-label'); if(label) label.textContent='Mock Test';
    }

    const profile=document.querySelector('.app-bottom-nav [data-nav="japan"]');
    if(profile){
      profile.href='/profile.html';
      profile.setAttribute('aria-label','Profile');
      const icon=profile.querySelector('i'); if(icon) icon.className='fa-solid fa-circle-user';
      const label=profile.querySelector('.app-nav-label'); if(label) label.textContent='Profile';
    }
  }

  async function boot(){
    addUiStyles();
    updateBottomNav();
    if(!window.AN||document.getElementById('anAccountWidget')) return;
    const s=await AN.session();
    const box=document.createElement('div');
    box.id='anAccountWidget';
    if(!s){
      box.innerHTML='<a class="an-auth-btn an-auth-login" href="/auth.html" aria-label="Login"><i class="fa-solid fa-right-to-bracket" aria-hidden="true"></i><span>Login</span></a><a class="an-auth-btn an-auth-register" href="/auth.html#register" aria-label="Register"><i class="fa-solid fa-user-plus" aria-hidden="true"></i><span>Register</span></a>';
    }else{
      const p=await AN.profile();
      const initial=(p?.full_name||s.user.email||'S').trim().charAt(0).toUpperCase();
      box.innerHTML=`<a class="an-profile-pill" href="/profile.html" title="Student Profile" aria-label="Profile">${initial}</a>`;
    }
    document.body.appendChild(box);
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot);
  else boot();
})();