(()=>{
  const ACCOUNT_ID='anHeaderAccount';

  function addStyles(){
    if(document.getElementById('anAccountWidgetStyles'))return;
    const style=document.createElement('style');style.id='anAccountWidgetStyles';style.textContent=`
      #${ACCOUNT_ID}{flex:0 0 auto!important;height:42px!important;min-width:42px!important;padding:0 12px!important;border-radius:14px!important;display:inline-flex!important;align-items:center!important;justify-content:center!important;gap:7px!important;text-decoration:none!important;box-sizing:border-box!important;border:1px solid rgba(24,105,165,.16)!important;background:linear-gradient(180deg,#fff 0%,#f6fbff 100%)!important;color:#176aa5!important;font-family:'Noto Sans Bengali','Inter',system-ui,sans-serif!important;font-size:11px!important;font-weight:900!important;line-height:1!important;white-space:nowrap!important;box-shadow:0 8px 22px rgba(24,78,122,.10)!important;overflow:hidden!important}
      #${ACCOUNT_ID} .an-header-avatar{width:26px!important;height:26px!important;border-radius:9px!important;object-fit:cover!important;background:#eaf5fc!important}
      #${ACCOUNT_ID} .an-header-avatar-fallback{width:26px!important;height:26px!important;border-radius:9px!important;display:grid!important;place-items:center!important;background:#eaf5fc!important;color:#176aa5!important;font-size:14px!important}
      #${ACCOUNT_ID}:active{transform:scale(.97)!important}
      @media(max-width:520px){.navbar .nav-container{gap:8px!important}.navbar .logo{min-width:0!important;flex:1 1 auto!important}#${ACCOUNT_ID}{width:42px!important;height:42px!important;min-width:42px!important;padding:0!important}.an-account-label{display:none!important}}
      @media(max-width:370px){#${ACCOUNT_ID}{width:38px!important;height:38px!important;min-width:38px!important;border-radius:12px!important}#${ACCOUNT_ID} .an-header-avatar,#${ACCOUNT_ID} .an-header-avatar-fallback{width:24px!important;height:24px!important;border-radius:8px!important}}
    `;document.head.appendChild(style);
  }

  function updateBottomNav(){
    const cv=document.querySelector('.app-bottom-nav [data-nav="jlpt"]');if(cv){cv.href='/cv-builder.html';cv.setAttribute('aria-label','CV Builder');const i=cv.querySelector('i');if(i)i.className='fa-solid fa-file-signature';const l=cv.querySelector('.app-nav-label');if(l)l.textContent='CV BUILDER'}
    const mock=document.querySelector('.app-bottom-nav [data-nav="quiz"]');if(mock){mock.href='/mock-test.html';mock.setAttribute('aria-label','Mock Test');const i=mock.querySelector('i');if(i)i.className='fa-solid fa-clipboard-check';const l=mock.querySelector('.app-nav-label');if(l)l.textContent='Mock Test'}
    const profile=document.querySelector('.app-bottom-nav [data-nav="japan"]');if(profile){profile.href='/profile.html';profile.setAttribute('aria-label','Profile');const i=profile.querySelector('i');if(i)i.className='fa-solid fa-circle-user';const l=profile.querySelector('.app-nav-label');if(l)l.textContent='Profile'}
  }

  function cleanupLegacy(){
    document.getElementById('anAccountWidget')?.remove();
    document.querySelectorAll('.an-account-pill,.an-account-inline').forEach(el=>{if(el.id!==ACCOUNT_ID)el.remove()});
  }

  function toggleMenuAccount(loggedIn){
    document.querySelectorAll('.nav-menu a,.mobile-menu a').forEach(a=>{
      const href=(a.getAttribute('href')||'').split('?')[0];
      if(/(^|\/)auth\.html(?:#.*)?$/.test(href))a.closest('li')?.style.setProperty('display',loggedIn?'none':'block','important');
      if(/(^|\/)profile\.html$/.test(href))a.closest('li')?.style.setProperty('display',loggedIn?'block':'none','important');
    });
  }

  async function renderAccount(){
    if(!window.AN)return;
    cleanupLegacy();updateBottomNav();
    const menu=document.querySelector('.app-classic-menu-btn,#menuToggle');if(!menu||!menu.parentNode)return;
    let a=document.getElementById(ACCOUNT_ID);if(!a){a=document.createElement('a');a.id=ACCOUNT_ID;menu.parentNode.insertBefore(a,menu)}
    const s=await AN.session();toggleMenuAccount(!!s);
    if(!s){a.href='/auth.html';a.setAttribute('aria-label','Login');a.innerHTML='<span class="an-header-avatar-fallback"><i class="fa-solid fa-user" aria-hidden="true"></i></span><span class="an-account-label">Login</span>';return}
    let p=null;try{p=await AN.ensureProfile()}catch(e){try{p=await AN.profile()}catch(_){}}
    const meta=s.user.user_metadata||{};const full=(p?.full_name||meta.full_name||meta.name||'Profile').trim();const first=full.split(/\s+/)[0]||'Profile';const avatar=p?.avatar_url||meta.avatar_url||meta.picture||'';
    a.href='/profile.html';a.setAttribute('aria-label','Profile');
    a.innerHTML=avatar?`<img class="an-header-avatar" src="${String(avatar).replace(/"/g,'&quot;')}" alt=""><span class="an-account-label">${first.replace(/[<>&]/g,'')}</span>`:`<span class="an-header-avatar-fallback"><i class="fa-solid fa-circle-user" aria-hidden="true"></i></span><span class="an-account-label">${first.replace(/[<>&]/g,'')}</span>`;
  }

  function boot(){addStyles();updateBottomNav();setTimeout(()=>renderAccount().catch(()=>{}),80);setTimeout(()=>renderAccount().catch(()=>{}),600)}
  window.addEventListener('an-auth-changed',()=>renderAccount().catch(()=>{}));window.addEventListener('an-profile-updated',()=>renderAccount().catch(()=>{}));
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();