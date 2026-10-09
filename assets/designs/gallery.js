(function () {
  'use strict';
  const root = document.body.dataset.root || '';
  const designs = window.HomepageDesigns;
  const grid = document.getElementById('design-grid');
  const dialog = document.getElementById('preview-dialog');
  const stage = document.getElementById('preview-stage');
  const languageSelect = document.getElementById('gallery-language');
  const modalLanguage = document.getElementById('preview-language');
  let language = 'zh';
  let currentIds = [];
  let compareIds = [];
  let device = 'desktop';
  let favorite = '';
  try { favorite = localStorage.getItem('junru-homepage-design') || ''; } catch (error) { /* Storage is optional. */ }
  const byId = id => designs.find(design => design.id === id);
  const url = (id, mini) => root + '/designs/preview/?' + new URLSearchParams({ style: id, lang: language, ...(mini ? { mini: '1' } : {}) }).toString();

  grid.innerHTML = designs.map(design => '<article class="design-card" data-id="' + design.id + '" data-category="' + design.category + '">' +
    '<a class="thumbnail-link" href="' + url(design.id, false) + '" data-preview="' + design.id + '" aria-label="预览 ' + design.id + ' ' + design.name + '"><div class="thumbnail-screen"><iframe title="' + design.name + '缩略预览" data-thumbnail="' + design.id + '" src="' + url(design.id, true) + '" loading="lazy" tabindex="-1" aria-hidden="true"></iframe></div><span class="thumbnail-overlay">查看完整前端 ↗</span></a>' +
    '<div class="card-details"><div class="card-heading"><span class="card-id">' + design.id + '</span><div><h2>' + design.name + '</h2><span class="card-english">' + design.english + '</span></div>' + (design.recommend ? '<span class="recommended">适合学术</span>' : '') + '</div><p class="card-description">' + design.description + '</p>' +
    '<div class="card-bottom"><div class="palette" aria-label="方案配色">' + design.palette.map(color => '<span style="background:' + color + '"></span>').join('') + '</div><button type="button" class="compare-button" data-compare="' + design.id + '" aria-pressed="false" aria-label="将 ' + design.id + ' ' + design.name + ' 加入对比">＋ 对比</button><a class="preview-button" data-preview="' + design.id + '" href="' + url(design.id, false) + '">预览 ↗</a></div></div></article>').join('');

  const resize = new ResizeObserver(entries => {
    entries.forEach(entry => entry.target.style.setProperty('--preview-scale', String(entry.contentRect.width / 1280)));
  });
  document.querySelectorAll('.thumbnail-screen').forEach(screen => resize.observe(screen));
  const comparisonResize = new ResizeObserver(entries => {
    entries.forEach(entry => entry.target.style.setProperty('--comparison-scale', String(entry.contentRect.width / 1280)));
  });

  function updateFavorite() {
    document.querySelectorAll('.design-card').forEach(card => card.classList.toggle('is-favorite', card.dataset.id === favorite));
    const note = document.getElementById('selection-note');
    const selected = byId(favorite);
    note.hidden = !selected;
    note.textContent = selected ? '你喜欢：' + selected.id + ' · ' + selected.name + '。把编号告诉我，就可以继续细化。' : '';
    const favoriteButton = document.getElementById('favorite-design');
    favoriteButton.textContent = currentIds[0] === favorite ? '已选为喜欢 ✓' : '喜欢这款';
    favoriteButton.title = currentIds[0] === favorite ? '再次点击取消选择' : '记录喜欢的方案';
    document.querySelectorAll('[data-pick]').forEach(button => { button.textContent = button.dataset.pick === favorite ? '已选为喜欢 ✓' : '喜欢这款'; });
  }
  function selectFavorite(id) {
    favorite = favorite === id ? '' : id;
    try { localStorage.setItem('junru-homepage-design', favorite); } catch (error) { /* Storage is optional. */ }
    updateFavorite();
  }
  function updateCompare() {
    document.querySelectorAll('[data-compare]').forEach(button => {
      const active = compareIds.includes(button.dataset.compare);
      button.setAttribute('aria-pressed', String(active));
      button.textContent = active ? '✓ 已加入' : '＋ 对比';
    });
    document.getElementById('compare-dock').hidden = compareIds.length === 0;
    document.getElementById('compare-names').textContent = compareIds.map(id => id + ' ' + byId(id).name).join('  /  ');
    document.getElementById('open-compare').disabled = compareIds.length !== 2;
    document.getElementById('open-compare').textContent = compareIds.length === 2 ? '并排比较 ↗' : '选择第二款';
    document.body.classList.toggle('has-comparison', compareIds.length > 0);
  }
  function refreshPreview() {
    const comparison = currentIds.length === 2;
    stage.classList.toggle('comparison', comparison);
    stage.classList.toggle('mobile-device', device === 'mobile');
    document.getElementById('preview-title').textContent = currentIds.map(id => id + ' · ' + byId(id).name).join(' / ');
    document.getElementById('preview-description').textContent = comparison ? '点击各方案上方的“喜欢这款”记录选择。' : byId(currentIds[0]).description;
    document.getElementById('favorite-design').hidden = comparison;
    document.getElementById('previous-design').hidden = comparison;
    document.getElementById('next-design').hidden = comparison;
    stage.innerHTML = currentIds.map(id => '<div class="preview-panel">' + (comparison ? '<div class="panel-caption"><span>' + id + ' · ' + byId(id).name + '</span><button type="button" data-pick="' + id + '">喜欢这款</button></div>' : '') +
      '<div class="frame-shell"><iframe title="' + byId(id).name + '完整预览" src="' + url(id, false) + '&embed=1"></iframe></div></div>').join('');
    comparisonResize.disconnect();
    if (comparison) stage.querySelectorAll('.frame-shell').forEach(shell => comparisonResize.observe(shell));
    modalLanguage.value = language;
    updateFavorite();
  }
  function showPreview(ids) {
    currentIds = ids;
    refreshPreview();
    if (!dialog.open) dialog.showModal();
  }
  document.addEventListener('click', event => {
    const preview = event.target.closest('[data-preview]');
    if (preview && !event.metaKey && !event.ctrlKey && !event.shiftKey && event.button === 0) {
      event.preventDefault();
      showPreview([preview.dataset.preview]);
      return;
    }
    const compare = event.target.closest('[data-compare]');
    if (compare) {
      const id = compare.dataset.compare;
      if (compareIds.includes(id)) compareIds = compareIds.filter(item => item !== id);
      else compareIds = compareIds.length < 2 ? [...compareIds, id] : [compareIds[1], id];
      updateCompare();
      return;
    }
    const pick = event.target.closest('[data-pick]');
    if (pick) {
      selectFavorite(pick.dataset.pick);
    }
  });
  document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
    document.querySelectorAll('[data-filter]').forEach(tab => {
      const active = tab === button;
      tab.classList.toggle('active', active);
      tab.setAttribute('aria-pressed', String(active));
    });
    document.querySelectorAll('.design-card').forEach(card => { card.hidden = button.dataset.filter !== 'all' && card.dataset.category !== button.dataset.filter; });
  }));
  function setLanguage(value, thumbnails) {
    language = value;
    languageSelect.value = value;
    modalLanguage.value = value;
    if (thumbnails) {
      document.querySelectorAll('[data-thumbnail]').forEach(frame => { frame.src = url(frame.dataset.thumbnail, true); });
      document.querySelectorAll('[data-preview]').forEach(link => { link.href = url(link.dataset.preview, false); });
    }
    if (dialog.open) refreshPreview();
  }
  languageSelect.addEventListener('change', () => setLanguage(languageSelect.value, true));
  modalLanguage.addEventListener('change', () => setLanguage(modalLanguage.value, true));
  document.getElementById('close-preview').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => { comparisonResize.disconnect(); stage.innerHTML = ''; });
  document.getElementById('favorite-design').addEventListener('click', () => selectFavorite(currentIds[0]));
  document.getElementById('clear-compare').addEventListener('click', () => { compareIds = []; updateCompare(); });
  document.getElementById('open-compare').addEventListener('click', () => showPreview([...compareIds]));
  function step(direction) {
    const index = designs.findIndex(design => design.id === currentIds[0]);
    showPreview([designs[(index + direction + designs.length) % designs.length].id]);
  }
  document.getElementById('previous-design').addEventListener('click', () => step(-1));
  document.getElementById('next-design').addEventListener('click', () => step(1));
  document.querySelectorAll('[data-device]').forEach(button => button.addEventListener('click', () => {
    device = button.dataset.device;
    document.querySelectorAll('[data-device]').forEach(option => option.setAttribute('aria-pressed', String(option === button)));
    stage.classList.toggle('mobile-device', device === 'mobile');
  }));
  dialog.addEventListener('keydown', event => {
    if (currentIds.length === 1 && !['SELECT', 'INPUT'].includes(event.target.tagName)) {
      if (event.key === 'ArrowLeft') step(-1);
      if (event.key === 'ArrowRight') step(1);
    }
  });
  updateFavorite();
}());
