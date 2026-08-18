(() => {
  'use strict';

  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const $ = (s, r = document) => r.querySelector(s);

  const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, ch => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[ch]));

  const kana = (value) => String(value ?? '')
    .replace(/（([^）]+)）/g, '$1')
    .replace(/\(([^)]+)\)/g, '$1')
    .replace(/[／/].*$/, '')
    .trim();

  const normaliseTarget = (word, reading) => {
    let w = kana(word), r = kana(reading || word);
    if (w.startsWith('～')) {
      w = '３' + w.slice(1);
      r = 'さん' + r.replace(/^～/, '');
    }
    return { word: w, reading: r };
  };

  const targetRuby = (word, reading) =>
    `<ruby>${escapeHtml(word)}<rt>${escapeHtml(reading)}</rt></ruby>`;

  function textWithoutRt(ruby) {
    if (!ruby) return '';
    const copy = ruby.cloneNode(true);
    copy.querySelectorAll('rt').forEach(rt => rt.remove());
    return copy.textContent.trim();
  }

  function getLessonNo(row) {
    const lesson = row.closest('.lesson-card');
    const m = lesson?.id?.match(/lesson-(\d+)/);
    return m ? Number(m[1]) : 0;
  }

  function getWord(row) {
    const ruby = $('.word-jp ruby', row);
    const word = textWithoutRt(ruby) || $('.word-jp', row)?.textContent.trim() || '';
    const reading = $('rt', ruby)?.textContent.trim() || word;
    const bn = $('.word-bn', row)?.textContent.trim() || '';
    const posEl = $('.pos', row);
    const pos = (posEl?.getAttribute('title') || '').trim();
    const search = (row.dataset.search || '').toLowerCase();
    const lessonNo = getLessonNo(row);
    return { ...normaliseTarget(word, reading), bn, pos, search, lessonNo };
  }

  function classify({ word, pos, search, lessonNo }) {
    if (pos === 'suf' || /^～/.test(word)) return 'counter';
    if (pos === 'adv') return 'adverb';
    if (pos === 'a-na') return 'naAdj';
    if (pos === 'a-i') return 'iAdj';
    if (pos === 'v') return 'verb';

    const predicateEnd = /(?:ている|でいる|てある|である|になる|となる|がある|がいる|がいい|がよい|が悪い|がわるい|が濃い|が薄い|が多い|が少ない|が高い|が低い|が強い|が弱い|が乾く|がぬれている|が湿っている|が冷えている|が効いている|がつく|がかかる|が終わる|が始まる|が決まる|が変わる|が違う|が足りる|が足りない|が間に合う|が遅れる|が壊れる|が汚れる|が伸びる|が縮む|が落ちる|が止まる|が動く|が開く|が閉まる|が混む|が空く|が込む|がすく|だ)$/;
    if (predicateEnd.test(word)) return 'clause';

    const verbEnd = /(?:する|くる|来る|いく|行く|[うくぐすつぬぶむる])$/;
    if (verbEnd.test(word) && !/(ビール|ボール|タオル|ホテル|ルール|メール|シール|オイル|タイトル|スタイル|レベル|トラブル|スケジュール)$/.test(word)) return 'verb';

    if (/[をにへでとがは].+/.test(word) && /(い|ない|だ)$/.test(word)) return 'clause';
    if (pos === 'adj' || (/[ぁ-ん一-龯]い$/.test(word) && !/(場合|具合|祝い|出会い|付き合い|違い|支払い|お見舞い|向かい|周り|終わり|始まり|集まり)$/.test(word))) return 'iAdj';

    if (lessonNo === 7 || /(昨日|今日|明日|一昨日|あさって|しあさって|元日|元旦|曜日|週間|今週|来週|先週|今月|来月|先月|今年|来年|去年|午前|午後|時|分|日|月|年)$/.test(word)) return 'time';

    if (search.includes('adverb')) return 'adverb';
    return 'noun';
  }

  function placeContext(lessonNo) {
    if (lessonNo <= 6) return { jp: 'いえで', bn: 'বাসায়' };
    if (lessonNo <= 12) return { jp: 'えきやまちで', bn: 'স্টেশন বা শহরে' };
    if (lessonNo <= 18) return { jp: 'おみせやでかけたときに', bn: 'দোকান বা বাইরে গেলে' };
    if (lessonNo <= 21) return { jp: 'がっこうで', bn: 'স্কুলে' };
    if (lessonNo <= 24) return { jp: 'しごとやがっこうで', bn: 'কাজ বা স্কুলে' };
    if (lessonNo <= 30) return { jp: 'にちじょうかいわで', bn: 'দৈনন্দিন কথোপকথনে' };
    return { jp: 'にほんでのせいかつで', bn: 'জাপানের দৈনন্দিন জীবনে' };
  }

  function buildExamples(info) {
    const { word, reading, bn, lessonNo } = info;
    const type = classify(info);
    const ruby = targetRuby(word, reading);
    const ctx = placeContext(lessonNo);
    const qbn = bn || word;

    const wrap = (jp, yomi, bangla, tag) => ({ jp, yomi, bangla, tag });

    if (type === 'verb') {
      return [
        wrap(`きょう、${ruby}ことにしました。`, `きょう、${reading}ことにしました。`, `আজ “${qbn}” করার সিদ্ধান্ত নিয়েছি।`, 'আজ'),
        wrap(`${ctx.jp}${ruby}ことがあります。`, `${ctx.jp}${reading}ことがあります。`, `${ctx.bn} কখনও “${qbn}” করতে হয়।`, 'বাস্তব ব্যবহার'),
        wrap(`${ruby}まえに、もういちどかくにんします。`, `${reading}まえに、もういちどかくにんします。`, `“${qbn}” করার আগে আরেকবার যাচাই করি।`, 'সতর্কতা'),
        wrap(`わからないときは、${ruby}まえにスタッフにききます。`, `わからないときは、${reading}まえにすたっふにききます。`, `না বুঝলে “${qbn}” করার আগে স্টাফকে জিজ্ঞেস করি।`, 'Japan life')
      ];
    }

    if (type === 'clause') {
      return [
        wrap(`いま、${ruby}。`, `いま、${reading}。`, `এখন পরিস্থিতি হলো—${qbn}।`, 'কথ্য'),
        wrap(`${ruby}ので、きをつけてください。`, `${reading}ので、きをつけてください。`, `${qbn}—তাই একটু খেয়াল রাখুন।`, 'সতর্কতা'),
        wrap(`${ruby}かどうか、かくにんしました。`, `${reading}かどうか、かくにんしました。`, `${qbn} কি না, তা যাচাই করেছি।`, 'যাচাই'),
        wrap(`${ruby}ときは、スタッフにそうだんします。`, `${reading}ときは、すたっふにそうだんします。`, `${qbn} হলে স্টাফের সঙ্গে পরামর্শ করি।`, 'Japan life')
      ];
    }

    if (type === 'iAdj') {
      return [
        wrap(`これは${ruby}です。`, `これは${reading}です。`, `এটি ${qbn}।`, 'বর্ণনা'),
        wrap(`きょうは、いつもより${ruby}です。`, `きょうは、いつもより${reading}です。`, `আজ স্বাভাবিকের চেয়ে বেশি ${qbn}।`, 'দৈনন্দিন'),
        wrap(`${ruby}ので、きをつけてください。`, `${reading}ので、きをつけてください。`, `${qbn}, তাই খেয়াল রাখুন।`, 'সতর্কতা'),
        wrap(`おもったより${ruby}です。`, `おもったより${reading}です。`, `ভাবার চেয়ে ${qbn}।`, 'কথ্য')
      ];
    }

    if (type === 'naAdj') {
      return [
        wrap(`ここは${ruby}です。`, `ここは${reading}です。`, `এই জায়গাটি ${qbn}।`, 'বর্ণনা'),
        wrap(`${ruby}なところをさがしています。`, `${reading}なところをさがしています。`, `${qbn} এমন জায়গা খুঁজছি।`, 'দৈনন্দিন'),
        wrap(`${ruby}なので、あんしんです。`, `${reading}なので、あんしんです。`, `${qbn} হওয়ায় নিশ্চিন্ত লাগছে।`, 'কথ্য'),
        wrap(`おもったより${ruby}です。`, `おもったより${reading}です。`, `ভাবার চেয়ে ${qbn}।`, 'বাস্তব ব্যবহার')
      ];
    }

    if (type === 'adverb') {
      return [
        wrap(`${ruby}、しごとをすすめました。`, `${reading}、しごとをすすめました。`, `${qbn}ভাবে কাজ এগিয়েছি।`, 'কাজ'),
        wrap(`きょうは${ruby}はなしました。`, `きょうは${reading}はなしました。`, `আজ ${qbn}ভাবে কথা বলেছি।`, 'কথ্য'),
        wrap(`${ruby}、かくにんしてください。`, `${reading}、かくにんしてください。`, `${qbn}ভাবে যাচাই করুন।`, 'নির্দেশনা'),
        wrap(`スタッフが${ruby}せつめいしてくれました。`, `すたっふが${reading}せつめいしてくれました。`, `স্টাফ ${qbn}ভাবে বুঝিয়ে দিয়েছেন।`, 'Japan life')
      ];
    }

    if (type === 'counter') {
      return [
        wrap(`これを${ruby}ください。`, `これを${reading}ください。`, `এটা ${qbn} দিন।`, 'দোকান'),
        wrap(`${ruby}ひつようです。`, `${reading}ひつようです。`, `${qbn} প্রয়োজন।`, 'পরিমাণ'),
        wrap(`${ruby}でたりるとおもいます。`, `${reading}でたりるとおもいます。`, `মনে হয় ${qbn}-ই যথেষ্ট হবে।`, 'কথ্য'),
        wrap(`おみせで「${ruby}」といいました。`, `おみせで「${reading}」といいました。`, `দোকানে পরিমাণ বোঝাতে “${qbn}” বলেছি।`, 'বাস্তব ব্যবহার')
      ];
    }

    if (type === 'time') {
      return [
        wrap(`${ruby}、ともだちにあいました。`, `${reading}、ともだちにあいました。`, `${qbn}-এ/সময় বন্ধুর সঙ্গে দেখা হয়েছে।`, 'সময়'),
        wrap(`${ruby}はよていがあります。`, `${reading}はよていがあります。`, `${qbn}-এ আমার পরিকল্পনা আছে।`, 'পরিকল্পনা'),
        wrap(`${ruby}のよていをカレンダーでかくにんしました。`, `${reading}のよていをかれんだーでかくにんしました。`, `${qbn}-এর পরিকল্পনা ক্যালেন্ডারে যাচাই করেছি।`, 'ক্যালেন্ডার'),
        wrap(`${ruby}について、かぞくにれんらくしました。`, `${reading}について、かぞくにれんらくしました。`, `${qbn} সম্পর্কে পরিবারকে জানিয়েছি।`, 'যোগাযোগ')
      ];
    }

    return [
      wrap(`${ctx.jp}${ruby}をつかいました。`, `${ctx.jp}${reading}をつかいました。`, `${ctx.bn} ${qbn} ব্যবহার করেছি।`, 'বাস্তব ব্যবহার'),
      wrap(`${ruby}について、スタッフにききました。`, `${reading}について、すたっふにききました。`, `${qbn} সম্পর্কে স্টাফকে জিজ্ঞেস করেছি।`, 'জিজ্ঞেস'),
      wrap(`${ruby}をもういちどかくにんしました。`, `${reading}をもういちどかくにんしました。`, `${qbn} আরেকবার যাচাই করেছি।`, 'যাচাই'),
      wrap(`にほんでは${ruby}がたいせつです。`, `にほんでは${reading}がたいせつです。`, `জাপানে ${qbn} গুরুত্বপূর্ণ।`, 'Japan life')
    ];
  }

  function renderExamples(row, examples) {
    const box = document.createElement('div');
    box.className = 'n3-vocab-examples';
    box.hidden = true;
    box.innerHTML = examples.map((ex, i) => `
      <div class="n3-vocab-example">
        <div class="n3-ex-head">
          <span class="n3-ex-no">${i + 1}</span>
          <span class="n3-ex-tag">${escapeHtml(ex.tag)}</span>
          <button class="n3-ex-speak" type="button" data-speak="${escapeHtml(ex.jp.replace(/<[^>]+>/g, ''))}" aria-label="উচ্চারণ শুনুন">🔊</button>
        </div>
        <div class="n3-ex-jp">${ex.jp}</div>
        <div class="n3-ex-yomi"><b>よみ：</b>${escapeHtml(ex.yomi)}</div>
        <div class="n3-ex-bn">${escapeHtml(ex.bangla)}</div>
      </div>`).join('');
    row.appendChild(box);
    return box;
  }

  function enhanceVocabularyRows() {
    const rows = $$('[data-vocab-row]');
    rows.forEach((row) => {
      if (row.dataset.examplesReady === '1') return;
      row.dataset.examplesReady = '1';
      row.classList.add('n3-vocab-expanded-row');

      const info = getWord(row);
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'n3-example-toggle';
      button.innerHTML = '<span>৪টি উদাহরণ</span><span class="n3-example-arrow">⌄</span>';
      button.setAttribute('aria-expanded', 'false');

      const pos = $('.pos', row);
      if (pos) pos.insertAdjacentElement('afterend', button);
      else row.appendChild(button);

      let box = null;
      button.addEventListener('click', (event) => {
        event.stopPropagation();
        if (!box) box = renderExamples(row, buildExamples(info));
        const open = box.hidden;
        box.hidden = !open;
        button.setAttribute('aria-expanded', String(open));
        row.classList.toggle('examples-open', open);
        button.querySelector('.n3-example-arrow').textContent = open ? '⌃' : '⌄';
      });
    });

    const stats = $('.hero-stats');
    if (stats && !$('#n3ExampleStat', stats)) {
      const span = document.createElement('span');
      span.id = 'n3ExampleStat';
      span.innerHTML = `<b>${rows.length * 4}</b> বাস্তব উদাহরণ`;
      stats.appendChild(span);
    }
    return rows.length;
  }

  function verticalPartPicker() {
    const nav = $('.part-nav');
    if (!nav) return;
    nav.classList.add('n3-vertical-parts');

    const all = $('.part-btn[data-week="all"]', nav);
    if (all) all.hidden = true;

    if (!$('.n3-part-label', nav.parentElement)) {
      const label = document.createElement('div');
      label.className = 'n3-part-label';
      label.innerHTML = '<b>Part বেছে নিন</b><small>Part 1 → Part 6 • tap করলে শুধু ওই Part খুলবে</small>';
      nav.before(label);
    }

    const buttons = $$('.part-btn:not([data-week="all"])', nav);
    buttons.forEach((btn) => {
      btn.classList.remove('active');
      btn.setAttribute('aria-expanded', 'false');
      if (!btn.querySelector('.n3-part-chevron')) btn.insertAdjacentHTML('beforeend', '<span class="n3-part-chevron">›</span>');
      btn.addEventListener('click', () => {
        buttons.forEach(b => {
          b.classList.toggle('active', b === btn);
          b.setAttribute('aria-expanded', String(b === btn));
        });
      });
    });

    if (buttons[0]) setTimeout(() => buttons[0].click(), 0);
  }

  function speech() {
    document.addEventListener('click', event => {
      const btn = event.target.closest('.n3-ex-speak');
      if (!btn || !('speechSynthesis' in window)) return;
      event.preventDefault();
      event.stopPropagation();
      speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(btn.dataset.speak || '');
      utterance.lang = 'ja-JP';
      utterance.rate = 0.86;
      speechSynthesis.speak(utterance);
    });
  }

  function updateCopy(total) {
    const heroCopy = $('.hero-copy');
    if (heroCopy) {
      heroCopy.textContent = `Nihongo Sou Matome N3-এর বইয়ের ক্রমে Lesson 1–36। মোট ${total.toLocaleString('en-US')} vocabulary—প্রতিটি শব্দে furigana, বাংলা অর্থ এবং ৪টি করে Japan-use example।`;
    }
    const note = $('.note-main p');
    if (note) note.textContent = 'Part খুলুন → শব্দ + furigana দেখুন → “৪টি উদাহরণ” tap করুন → বাংলা অর্থসহ sentence জোরে পড়ুন → শেষে “শেষ” টিক দিন।';
  }

  function init() {
    const total = enhanceVocabularyRows();
    verticalPartPicker();
    speech();
    updateCopy(total);
    document.documentElement.classList.add('n3-all-vocab-ready');
    console.info(`[Aponar Nihon] N3 vocabulary ready: ${total} words / ${total * 4} examples`);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();