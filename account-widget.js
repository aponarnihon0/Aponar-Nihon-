(()=>{
  function addUiStyles(){
    if(document.getElementById('anAccountWidgetStyles')) return;
    const style=document.createElement('style');
    style.id='anAccountWidgetStyles';
    style.textContent=`
      .an-account-pill,.an-account-inline{
        flex:0 0 auto!important;
        height:42px!important;
        min-width:42px!important;
        padding:0 13px!important;
        border-radius:14px!important;
        display:inline-flex!important;
        align-items:center!important;
        justify-content:center!important;
        gap:7px!important;
        text-decoration:none!important;
        box-sizing:border-box!important;
        border:1px solid rgba(24,105,165,.16)!important;
        background:linear-gradient(180deg,#ffffff 0%,#f7fbff 100%)!important;
        color:#176aa5!important;
        font-family:'Noto Sans Bengali','Inter',system-ui,sans-serif!important;
        font-size:11px!important;
        font-weight:900!important;
        line-height:1!important;
        white-space:nowrap!important;
        box-shadow:0 8px 22px rgba(24,78,122,.10)!important;
      }
      .an-account-pill i,.an-account-inline i{font-size:15px!important}
      .an-account-pill:hover,.an-account-inline:hover{transform:translateY(-1px);box-shadow:0 11px 26px rgba(24,78,122,.15)!important}
      @media(max-width:520px){
        .navbar .nav-container{gap:8px!important}
        .navbar .logo{min-width:0!important;flex:1 1 auto!important}
        .an-account-pill,.an-account-inline{width:42px!important;height:42px!important;padding:0!important;border-radius:14px!important}
        .an-account-label{display:none!important}
      }
      @media(max-width:370px){
        .an-account-pill,.an-account-inline{width:38px!important;height:38px!important;min-width:38px!important;border-radius:12px!important}
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

  async function renderAccount(){
    if(!window.AN) return;
    const s=await AN.session();
    let a=document.querySelector('.an-account-pill');
    if(!a){
      const menu=document.querySelector('.app-classic-menu-btn,#menuToggle');
      if(!menu||!menu.parentNode) return;
      a=document.createElement('a');
      a.className='an-account-inline';
      menu.parentNode.insertBefore(a,menu);
    }
    if(s){
      a.href='/profile.html';
      a.setAttribute('aria-label','Profile');
      const p=await AN.profile();
      const name=(p?.full_name||'Profile').trim().split(/\s+/)[0]||'Profile';
      a.innerHTML=`<i class="fa-solid fa-circle-user" aria-hidden="true"></i><span class="an-account-label">${name}</span>`;
    }else{
      a.href='/auth.html';
      a.setAttribute('aria-label','Login or Register');
      a.innerHTML='<i class="fa-solid fa-user" aria-hidden="true"></i><span class="an-account-label">Login / Register</span>';
    }
    const old=document.getElementById('anAccountWidget');
    if(old) old.remove();
  }

  function boot(){
    addUiStyles();
    updateBottomNav();
    setTimeout(()=>{ updateBottomNav(); renderAccount().catch(()=>{}); },220);
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();
})();