from pathlib import Path
p=Path('sw.js')
s=p.read_text()
s=s.replace('const STATIC_CACHE = "aponar-nihon-static-v16";','const STATIC_CACHE = "aponar-nihon-static-v17";')
s=s.replace('const DYNAMIC_CACHE = "aponar-nihon-dynamic-v16";','const DYNAMIC_CACHE = "aponar-nihon-dynamic-v17";')
if '"/auth.html"' not in s:
    s=s.replace('  "/cv-builder.html",','  "/cv-builder.html",\n  "/auth.html",\n  "/profile.html",\n  "/admin.html",\n  "/supabase-config.js",\n  "/account.js",')
if 'const HOME_ACCOUNT_UI = `' not in s:
    ui='''const HOME_ACCOUNT_UI = `\n<style id="an-account-ui-style">\n.an-account-pill{display:inline-flex!important;align-items:center!important;justify-content:center!important;gap:6px!important;min-height:42px!important;padding:0 12px!important;border:1px solid #d7e4ef!important;border-radius:13px!important;background:#fff!important;color:#17436f!important;text-decoration:none!important;font:800 11px/1 'Inter','Noto Sans Bengali',sans-serif!important;box-shadow:0 5px 15px rgba(23,59,94,.08)!important;white-space:nowrap!important}\n@media(max-width:620px){.an-account-pill{min-height:38px!important;padding:0 9px!important;font-size:9px!important}}\n</style>\n<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>\n<script src="/supabase-config.js"></script>\n<script src="/account.js"></script>\n<script>window.addEventListener('DOMContentLoaded',async()=>{try{const btn=document.querySelector('.app-classic-menu-btn');if(!btn||document.querySelector('.an-account-pill'))return;const a=document.createElement('a');a.className='an-account-pill';const ss=await AN.session();if(!ss){a.href='/auth.html';a.textContent='Login / Register'}else{const p=await AN.profile();a.href='/profile.html';a.textContent=p?.full_name?('👤 '+p.full_name.split(' ')[0]):'👤 Profile'}btn.parentNode.insertBefore(a,btn);await AN.log('home_view',{module:'home'})}catch(e){}})</script>`;\n\n'''
    s=s.replace('const COMPACT_HOME_STYLE = `',ui+'const COMPACT_HOME_STYLE = `')
needle="function injectHomeEnhancements(html){\n"
if "html.includes('id=\"an-account-ui-style\"')" not in s:
    add="  if(!html.includes('id=\"an-account-ui-style\"') && html.includes('</head>')){\n    html = html.replace('</head>',HOME_ACCOUNT_UI + '\\n</head>');\n  }\n"
    s=s.replace(needle,needle+add)
if 'href="profile.html" class="nav-item-link"' not in s:
    target='      <li class="an-menu-extra"><a href="cv-builder.html" class="nav-item-link"><i class="fas fa-file-signature"></i><span>Japan CV Builder</span></a></li>\\n'
    replacement=target+'      <li class="an-menu-extra"><a href="profile.html" class="nav-item-link"><i class="fas fa-user-circle"></i><span>Student Profile</span></a></li>\\n      <li class="an-menu-extra"><a href="auth.html" class="nav-item-link"><i class="fas fa-right-to-bracket"></i><span>Login / Register</span></a></li>\\n'
    s=s.replace(target,replacement)
p.write_text(s)
