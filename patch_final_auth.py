from pathlib import Path
import re

sw = Path('sw.js')
s = sw.read_text(encoding='utf-8')

s = re.sub(r'aponar-nihon-static-v\d+', 'aponar-nihon-static-v21', s)
s = re.sub(r'aponar-nihon-dynamic-v\d+', 'aponar-nihon-dynamic-v21', s)

marker = 'function injectHomeEnhancements(html){'
feature = '  if(!html.includes(\'data-tool="ebook-library"\')'
if marker in s and feature in s:
    start = s.index(marker)
    next_feature = s.index(feature, start)
    s = s[:start] + marker + '\n' + s[next_feature:]

js_start = "  if(isSameOrigin && (url.pathname.endsWith('.css') || url.pathname.endsWith('.js'))){"
image_start = "  if(isSameOrigin && (request.destination === 'image'"
if js_start in s and image_start in s:
    a = s.index(js_start)
    b = s.index(image_start, a)
    fresh = """  if(isSameOrigin && (url.pathname.endsWith('.css') || url.pathname.endsWith('.js'))){
    event.respondWith(
      fetch(request).then(response=>{
        if(response && response.ok){
          const copy=response.clone();
          caches.open(DYNAMIC_CACHE).then(cache=>{
            cache.put(request,copy);
            trimCache(DYNAMIC_CACHE,MAX_DYNAMIC_CACHE_ITEMS);
          });
        }
        return response;
      }).catch(()=>caches.match(request))
    );
    return;
  }

"""
    s = s[:a] + fresh + s[b:]

sw.write_text(s, encoding='utf-8')

version = '20260817-5'
for name in ['index.html','student-tools.html','cv-builder.html','ebook-library.html']:
    p = Path(name)
    if not p.exists():
        continue
    text = p.read_text(encoding='utf-8')
    text = re.sub(r'/account\.js(?:\?v=[^"\']*)?', f'/account.js?v={version}', text)
    text = re.sub(r'/account-widget\.js(?:\?v=[^"\']*)?', f'/account-widget.js?v={version}', text)
    p.write_text(text, encoding='utf-8')

old = Path('.github/workflows/final-auth-cache-repair.yml')
if old.exists():
    old.unlink()
