const STATIC_CACHE = "aponar-nihon-static-v8";
const DYNAMIC_CACHE = "aponar-nihon-dynamic-v8";

const STATIC_ASSETS = [
  "/",
  "/index.html",
  "/manifest.json",
  "/logo.png",
  "/aponar-nihon(1).png",
  "/ebook-library.html",
  "/student-tools.html",
  "/speak-japanese-today-bangla-ebook.html",
  "/japanese-conversation-bangla-ebook.html",
  "/ebook-data/sjt-pack-1.txt",
  "/ebook-data/sjt-pack-2.txt",
  "/ebook-data/sjt-pack-3.txt",
  "/ebook-data/jc-01.txt",
  "/ebook-data/jc-02.txt",
  "/ebook-data/jc-03.txt",
  "/ebook-data/jc-04.txt",
  "/ebook-data/jc-05.txt",
  "/ebook-data/jc-06.txt",
  "/ebook-data/jc-07.txt",
  "/ebook-data/jc-08.txt",
  "/ebook-data/jc-09.txt",
  "/ebook-data/jc-10.txt",
  "/ebook-data/jc-tail-1.txt",
  "/ebook-data/jc-tail-2.txt",
  "/ebook-data/jc-tail-3.txt"
];

const MAX_DYNAMIC_CACHE_ITEMS = 120;

const EBOOK_TOOL_MARKER = `        <a class="app-tool-item gray" href="#guide">
          <span class="app-tool-icon"><i class="fa-solid fa-compass"></i></span>
          <strong>স্টাডি গাইড</strong><small>শেখার রোডম্যাপ</small>
        </a>`;

const EBOOK_TOOL_CARD = `        <a class="app-tool-item cyan" href="ebook-library.html" aria-label="E-Book Library">
          <span class="app-tool-icon"><i class="fa-solid fa-book-open-reader"></i></span>
          <strong>E-Book</strong><small>স্টাডি লাইব্রেরি</small>
        </a>\n`;

const COMPACT_HOME_STYLE = `
<style id="important-section-compact-v2">
@media (max-width:767px){
.app-home-screen{padding-left:10px!important;padding-right:10px!important;padding-bottom:24px!important}.app-tools-card{margin-top:14px!important;padding:16px 8px 13px!important;border-radius:22px!important}.app-card-heading{padding:0 5px 10px!important}.app-card-heading span{font-size:9px!important}.app-card-heading h2{margin-top:1px!important;font-size:17px!important;line-height:1.16!important}.app-card-heading>a{width:34px!important;height:34px!important;border-radius:11px!important}.app-tools-grid{grid-template-columns:repeat(4,minmax(0,1fr))!important;column-gap:3px!important;row-gap:10px!important;align-items:start!important}.app-tool-item{min-width:0!important;gap:0!important}.app-tool-icon{width:47px!important;height:47px!important;border-radius:14px!important;margin-bottom:5px!important;font-size:18px!important;box-shadow:inset 0 1px 0 rgba(255,255,255,.25),0 6px 13px rgba(38,62,89,.14)!important}.app-tool-icon b{font-size:15px!important;letter-spacing:-.35px!important}.app-tool-item strong{width:100%!important;min-height:22px!important;margin:0!important;font-size:9.6px!important;line-height:1.1!important;font-weight:800!important;white-space:normal!important;overflow:visible!important;text-overflow:clip!important;display:flex!important;align-items:flex-start!important;justify-content:center!important}.app-tool-item small{width:100%!important;min-height:15px!important;margin-top:1px!important;font-size:7.1px!important;line-height:1.08!important;white-space:normal!important;overflow:visible!important;text-overflow:clip!important}}
@media(max-width:380px){.app-tools-card{padding-left:6px!important;padding-right:6px!important}.app-tools-grid{grid-template-columns:repeat(4,minmax(0,1fr))!important;column-gap:2px!important;row-gap:9px!important}.app-tool-icon{width:44px!important;height:44px!important;border-radius:13px!important;font-size:17px!important}.app-tool-icon b{font-size:14px!important}.app-tool-item strong{font-size:9px!important;min-height:21px!important}.app-tool-item small{font-size:6.8px!important;min-height:14px!important}}
</style>`;

const STUDENT_HOME_SECTION = `
<style id="student-power-home-style">
.an-student-power{margin:22px auto;padding:0 12px;max-width:1180px}.an-sp-card{background:linear-gradient(135deg,#173b5e,#176fa8 62%,#21958b);color:#fff;border-radius:24px;padding:22px 18px;box-shadow:0 18px 42px rgba(23,59,94,.18)}.an-sp-head{display:flex;justify-content:space-between;gap:12px;align-items:center;margin-bottom:14px}.an-sp-head small{display:block;font-size:9px;letter-spacing:.12em;color:#cdeee9;font-weight:800}.an-sp-head h2{margin:2px 0 0;font-size:21px;line-height:1.15}.an-sp-all{color:#173b5e;background:#fff;text-decoration:none;border-radius:11px;padding:9px 11px;font-size:10px;font-weight:900;white-space:nowrap}.an-sp-grid{display:grid;grid-template-columns:repeat(6,1fr);gap:8px}.an-sp-item{display:block;text-decoration:none;color:#fff;background:rgba(255,255,255,.10);border:1px solid rgba(255,255,255,.14);border-radius:14px;padding:12px 8px;text-align:center}.an-sp-item b{display:block;font-size:23px;line-height:1.1}.an-sp-item strong{display:block;font-size:10px;margin-top:5px}.an-sp-item small{display:block;font-size:7px;color:rgba(255,255,255,.72);margin-top:2px}@media(max-width:767px){.an-student-power{padding:0 10px;margin:16px auto}.an-sp-card{border-radius:21px;padding:17px 12px}.an-sp-head h2{font-size:17px}.an-sp-grid{grid-template-columns:repeat(3,1fr);gap:7px}.an-sp-item{padding:10px 5px}.an-sp-item b{font-size:20px}.an-sp-item strong{font-size:9px}.an-sp-item small{font-size:6.7px}}
</style>
<section class="an-student-power" id="student-power-tools" aria-label="Student Power Tools"><div class="an-sp-card"><div class="an-sp-head"><div><small>STUDENT POWER TOOLS</small><h2>পড়া + জাপান জীবন সহজ করুন</h2></div><a class="an-sp-all" href="student-tools.html">সব টুল →</a></div><div class="an-sp-grid"><a class="an-sp-item" href="student-tools.html#listening"><b>🎧</b><strong>Listening</strong><small>Shadowing Lab</small></a><a class="an-sp-item" href="student-tools.html#flashcards"><b>🧠</b><strong>Flashcards</strong><small>Smart SRS</small></a><a class="an-sp-item" href="student-tools.html#survival"><b>🇯🇵</b><strong>Survival</strong><small>Real-life practice</small></a><a class="an-sp-item" href="student-tools.html#planner"><b>📅</b><strong>JLPT Planner</strong><small>Daily roadmap</small></a><a class="an-sp-item" href="student-tools.html#mistakes"><b>📝</b><strong>ভুল খাতা</strong><small>Auto review</small></a><a class="an-sp-item" href="student-tools.html#toolkit"><b>🧰</b><strong>Student Toolkit</strong><small>28h + budget</small></a></div></div></section>`;

async function enhanceHomeHtml(response,requestUrl){
  if(!response||!response.ok)return response;const url=new URL(requestUrl);const isHome=url.origin===self.location.origin&&(url.pathname==="/"||url.pathname==="/index.html");if(!isHome)return response;const contentType=response.headers.get("content-type")||"";if(!contentType.includes("text/html"))return response;
  try{let html=await response.text();if(!html.includes('href="ebook-library.html"')&&html.includes(EBOOK_TOOL_MARKER))html=html.replace(EBOOK_TOOL_MARKER,EBOOK_TOOL_CARD+EBOOK_TOOL_MARKER);if(!html.includes('id="important-section-compact-v2"')&&html.includes("</head>"))html=html.replace("</head>",COMPACT_HOME_STYLE+"\n</head>");if(!html.includes('id="student-power-tools"')&&html.includes("</main>"))html=html.replace("</main>",STUDENT_HOME_SECTION+"\n</main>");const headers=new Headers(response.headers);headers.delete("content-length");headers.delete("content-encoding");headers.delete("etag");return new Response(html,{status:response.status,statusText:response.statusText,headers})}catch(error){console.warn("Homepage enhancement skipped:",error);return response}}

async function trimCache(cacheName,maxItems){const cache=await caches.open(cacheName),keys=await cache.keys();if(keys.length>maxItems){await cache.delete(keys[0]);await trimCache(cacheName,maxItems)}}

self.addEventListener("install",event=>{self.skipWaiting();event.waitUntil(caches.open(STATIC_CACHE).then(cache=>Promise.allSettled(STATIC_ASSETS.map(asset=>cache.add(asset)))))});
self.addEventListener("activate",event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.map(key=>(key!==STATIC_CACHE&&key!==DYNAMIC_CACHE)?caches.delete(key):null))).then(()=>self.clients.claim()))});
self.addEventListener("message",event=>{if(event.data&&event.data.type==="SKIP_WAITING")self.skipWaiting()});

self.addEventListener("fetch",event=>{
  const request=event.request;if(request.method!=="GET")return;const url=new URL(request.url),isSameOrigin=url.origin===self.location.origin;

  if(isSameOrigin&&url.pathname.startsWith("/ebook-data/")){
    const cleanRequest=new Request(url.origin+url.pathname,{method:"GET",credentials:"same-origin"});
    event.respondWith(caches.match(cleanRequest).then(cached=>cached||fetch(request).then(r=>{if(r&&r.ok){const c=r.clone();caches.open(STATIC_CACHE).then(cache=>cache.put(cleanRequest,c))}return r}).catch(()=>caches.match(request,{ignoreSearch:true}))));
    return;
  }

  if(request.mode==="navigate"||(request.headers.get("accept")||"").includes("text/html")){
    event.respondWith(fetch(request).then(async networkResponse=>{const finalResponse=await enhanceHomeHtml(networkResponse,request.url);if(isSameOrigin&&finalResponse&&finalResponse.ok){const copy=finalResponse.clone();caches.open(DYNAMIC_CACHE).then(cache=>{cache.put(request,copy);trimCache(DYNAMIC_CACHE,MAX_DYNAMIC_CACHE_ITEMS)})}return finalResponse}).catch(()=>caches.match(request,{ignoreSearch:true}).then(async cached=>{const fallback=cached||await caches.match("/index.html")||await caches.match("/");return fallback?enhanceHomeHtml(fallback,request.url):fallback})));
    return;
  }

  if(isSameOrigin&&(url.pathname.endsWith(".css")||url.pathname.endsWith(".js"))){event.respondWith(caches.match(request).then(cached=>{const fp=fetch(request).then(r=>{if(r&&r.ok){const c=r.clone();caches.open(DYNAMIC_CACHE).then(cache=>{cache.put(request,c);trimCache(DYNAMIC_CACHE,MAX_DYNAMIC_CACHE_ITEMS)})}return r}).catch(()=>cached);return cached||fp}));return}

  if(isSameOrigin&&(request.destination==="image"||/\.(png|jpg|jpeg|webp|svg)$/i.test(url.pathname))){event.respondWith(caches.match(request).then(cached=>cached||fetch(request).then(r=>{if(r&&r.ok){const c=r.clone();caches.open(DYNAMIC_CACHE).then(cache=>{cache.put(request,c);trimCache(DYNAMIC_CACHE,MAX_DYNAMIC_CACHE_ITEMS)})}return r}).catch(()=>caches.match("/logo.png"))));return}

  event.respondWith(fetch(request).then(r=>{if(isSameOrigin&&r&&r.ok){const c=r.clone();caches.open(DYNAMIC_CACHE).then(cache=>{cache.put(request,c);trimCache(DYNAMIC_CACHE,MAX_DYNAMIC_CACHE_ITEMS)})}return r}).catch(()=>caches.match(request,{ignoreSearch:true})));
});