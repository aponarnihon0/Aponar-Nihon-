(()=>{
  const safe=(v='')=>String(v).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
  const career=document.getElementById('careerDoc');
  if(!career||document.getElementById('ptRireki1')) return;

  const pages=`<div class="page parttime-rireki print-rireki-parttime" id="ptRireki1" style="display:none">
    <div class="pt-header"><div class="pt-title">履　歴　書</div><div class="pt-date" id="ptDate1"></div></div>
    <table class="pt-table">
      <tr><td class="pt-label">フリガナ</td><td colspan="2" class="pt-kana" id="ptFuri"></td><td rowspan="3" class="pt-photo" id="ptPhoto"><div class="photo-placeholder">写　真</div></td></tr>
      <tr><td class="pt-label">氏 名</td><td colspan="2" class="pt-name" id="ptName"></td></tr>
      <tr><td class="pt-label">生年月日</td><td class="pt-dob" id="ptDob"></td><td class="pt-gender" id="ptGender">男・女</td></tr>
      <tr><td class="pt-label">フリガナ</td><td colspan="3" class="pt-addr-kana" id="ptAddressKana"></td></tr>
      <tr><td class="pt-label">現住所</td><td colspan="3" class="pt-addr" id="ptAddress"></td></tr>
      <tr><td class="pt-label">携 帯</td><td style="width:140px" id="ptPhone"></td><td class="pt-label" style="width:50px">国籍</td><td id="ptNationality"></td></tr>
      <tr><td class="pt-label">Email</td><td colspan="2" id="ptEmail"></td><td><span style="font-size:8pt">在留資格</span><br><span id="ptVisa"></span></td></tr>
    </table>
    <table class="pt-table pt-history"><tr><th class="pt-year">年</th><th class="pt-month">月</th><th>学　歴・職　歴（各別にまとめて書く）</th></tr><tbody id="ptHistory1"></tbody></table>
  </div>
  <div class="page parttime-rireki print-rireki-parttime" id="ptRireki2" style="display:none">
    <div class="pt-header"><div class="pt-title">履　歴　書</div><div class="pt-date" id="ptDate2"></div></div>
    <table class="pt-table pt-history"><tr><th class="pt-year">年</th><th class="pt-month">月</th><th>学　歴・職　歴（各別にまとめて書く）　（続き）</th></tr><tbody id="ptHistory2"></tbody></table>
    <table class="pt-table pt-qual"><tr><th class="pt-year">年</th><th class="pt-month">月</th><th>免　許・資　格</th></tr><tbody id="ptQual"></tbody></table>
    <div class="pt-motive"><div class="pt-box-title">志望動機、特技、アピールポイントなど</div><div class="pt-motive-body" id="ptMotive"></div></div>
    <div class="pt-bottom"><div class="pt-bottom-left"><div class="pt-bottom-head">希望勤務日・時間帯</div><div class="pt-bottom-body" id="ptAvailability"></div></div><div class="pt-bottom-right"><div class="pt-bottom-head">本人希望記入欄（職種、店舗、その他）</div><div class="pt-bottom-body" id="ptRequest"></div></div></div>
  </div>`;
  career.insertAdjacentHTML('beforebegin',pages);

  const E=id=>document.getElementById(id);
  const row=(y='',m='',txt='',kind='')=>`<tr class="${kind==='empty'?'pt-empty':''}"><td class="pt-year">${safe(y)}</td><td class="pt-month">${safe(m)}</td><td class="${kind==='section'?'pt-section':kind==='right'?'pt-right':'pt-history-content'}">${safe(txt)}</td></tr>`;
  const currentPreview=()=>document.querySelector('.preview-tools button.active')?.dataset.preview||'rireki';

  function renderParttime(){
    if(!E('ptRireki1')) return;
    E('ptDate1').textContent=jpDate(state.created);
    E('ptDate2').textContent=jpDate(state.created);
    E('ptFuri').textContent=state.furigana||'';
    E('ptName').textContent=state.name||'';
    E('ptAddressKana').textContent=state.addressKana||'';
    E('ptAddress').textContent=state.address||'';
    E('ptPhone').textContent=state.phone||'';
    E('ptNationality').textContent=state.nationality||'';
    E('ptEmail').textContent=state.email||'';
    E('ptVisa').textContent=state.visa||'';
    E('ptDob').textContent=state.dob?`${state.dob.slice(0,4)}年${+state.dob.slice(5,7)}月${+state.dob.slice(8,10)}日生（満${age(state.dob)}歳）`:'';
    if(state.gender==='男') E('ptGender').innerHTML='<span class="pt-circle">男</span>・女';
    else if(state.gender==='女') E('ptGender').innerHTML='男・<span class="pt-circle">女</span>';
    else E('ptGender').textContent=state.gender||'男・女';
    E('ptPhoto').innerHTML=state.photo?`<img src="${state.photo}" alt="証明写真">`:'<div class="photo-placeholder">写　真</div>';

    const edu=(state.edu||[]).filter(x=>x.year||x.month||x.text);
    const work=(state.work||[]).filter(x=>x.year||x.month||x.text);
    let rows=[row('','','学歴','section')];
    edu.forEach(x=>rows.push(row(x.year,x.month,x.text)));
    rows.push(row('','','職歴','section'));
    work.forEach(x=>rows.push(row(x.year,x.month,x.text)));
    if(work.length&&!/(退職|退社|契約終了)/.test(work[work.length-1].text||'')) rows.push(row('','','現在に至る','right'));
    rows.push(row('','','以上','right'));

    const firstCap=15;
    const first=rows.slice(0,firstCap);
    const second=rows.slice(firstCap);
    while(first.length<firstCap) first.push(row('','','','empty'));
    while(second.length<14) second.push(row('','','','empty'));
    E('ptHistory1').innerHTML=first.join('');
    E('ptHistory2').innerHTML=second.join('');

    const quals=(state.qual||[]).filter(x=>x.year||x.month||x.text).map(x=>row(x.year,x.month,x.text));
    while(quals.length<8) quals.push(row('','','','empty'));
    E('ptQual').innerHTML=quals.join('');
    E('ptMotive').textContent=state.motive||'';
    const availability=[];
    if(state.schoolTime) availability.push(`学校授業時間：${state.schoolTime}`);
    if(state.availability) availability.push(state.availability);
    E('ptAvailability').textContent=availability.join('\n');
    E('ptRequest').textContent=state.request||'';
  }

  function syncParttimeVisibility(kind=currentPreview()){
    const part=state.template==='parttime';
    if(E('parttimePreview')) E('parttimePreview').style.display='none';
    if(E('rirekiDoc')) E('rirekiDoc').style.display=kind==='rireki'&&!part?'block':'none';
    document.querySelectorAll('.parttime-rireki').forEach(p=>p.style.display=kind==='rireki'&&part?'block':'none');
    if(E('careerDoc')) E('careerDoc').style.display=kind==='career'?'block':'none';
  }

  const baseRender=render;
  render=function(){baseRender();renderParttime();syncParttimeVisibility();};
  const baseSync=syncTemplate;
  syncTemplate=function(){baseSync();syncParttimeVisibility();};
  preview=function(kind){
    document.querySelectorAll('.preview-tools button').forEach(b=>b.classList.toggle('active',b.dataset.preview===kind));
    syncParttimeVisibility(kind);
    fit();
  };
  printDoc=function(kind){
    state.created=tokyoToday();save();render();
    document.querySelectorAll('.page').forEach(p=>p.classList.remove('print-me'));
    if(kind==='career') document.querySelectorAll('.print-career').forEach(p=>p.classList.add('print-me'));
    else if(state.template==='parttime') document.querySelectorAll('.print-rireki-parttime').forEach(p=>p.classList.add('print-me'));
    else document.querySelectorAll('.print-rireki').forEach(p=>p.classList.add('print-me'));
    setTimeout(()=>window.print(),60);
  };

  document.querySelectorAll('[data-preview]').forEach(b=>b.onclick=()=>preview(b.dataset.preview));
  if(E('printRireki')) E('printRireki').onclick=()=>printDoc('rireki');
  if(E('printCareer')) E('printCareer').onclick=()=>printDoc('career');
  if(E('mobilePrint')) E('mobilePrint').onclick=()=>printDoc('rireki');

  renderParttime();
  syncParttimeVisibility('rireki');
  fit();
})();
