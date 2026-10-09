(function () {
  'use strict';
  const system = document.querySelector('[data-chapter-system]');
  const languageLink = document.querySelector('[data-language-switch]');
  const translation = languageLink && languageLink.getAttribute('href');
  const header = document.querySelector('.site-header');
  const menu = document.querySelector('.menu-toggle');
  const blog = document.querySelector('[data-blog-index]');

  function preserveSection() {
    if (languageLink) languageLink.href = translation + (blog ? location.search : '') + location.hash;
  }
  function closeMenu() {
    menu.setAttribute('aria-expanded', 'false');
    header.classList.remove('menu-open');
  }
  menu.addEventListener('click', () => {
    const open = menu.getAttribute('aria-expanded') !== 'true';
    menu.setAttribute('aria-expanded', String(open));
    header.classList.toggle('menu-open', open);
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeMenu();
  });

  document.querySelectorAll('.section-publications .section-body > p').forEach(paragraph => {
    const heading = paragraph.querySelector('strong');
    if (heading && paragraph.textContent.trim() === heading.textContent.trim()) paragraph.classList.add('paper-year-heading');
  });
  document.querySelectorAll('.section-publications li').forEach(item => item.classList.add('paper-item'));

  if (system) {
    const tabs = [...system.querySelectorAll('[data-chapter]')];
    const panes = [...system.querySelectorAll('[data-chapter-pane]')];
    const keys = panes.map(pane => pane.dataset.chapterPane);
    const defaultKey = system.dataset.defaultChapter;
    function activate(key, updateUrl) {
      if (!keys.includes(key)) return;
      if (updateUrl && location.hash !== '#' + key) history.pushState(null, '', '#' + key);
      system.dataset.currentChapter = key;
      panes.forEach(pane => { pane.hidden = pane.dataset.chapterPane !== key; });
      tabs.forEach(tab => {
        const active = tab.dataset.chapter === key;
        tab.setAttribute('aria-selected', String(active));
        tab.tabIndex = active ? 0 : -1;
      });
      header.querySelectorAll('[data-home-section]').forEach(anchor => {
        if (anchor.hash === '#' + key) anchor.setAttribute('aria-current', 'location');
        else anchor.removeAttribute('aria-current');
      });
      preserveSection();
    }
    tabs.forEach(tab => {
      tab.addEventListener('click', () => activate(tab.dataset.chapter, true));
      tab.addEventListener('keydown', event => {
        let index = keys.indexOf(tab.dataset.chapter);
        if (['ArrowLeft', 'ArrowUp'].includes(event.key)) index = (index - 1 + keys.length) % keys.length;
        else if (['ArrowRight', 'ArrowDown'].includes(event.key)) index = (index + 1) % keys.length;
        else if (event.key === 'Home') index = 0;
        else if (event.key === 'End') index = keys.length - 1;
        else return;
        event.preventDefault();
        activate(keys[index], true);
        tabs[index].focus();
      });
    });
    document.addEventListener('click', event => {
      const anchor = event.target.closest('a');
      if (!anchor || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      if (anchor.pathname === location.pathname && keys.includes(anchor.hash.slice(1))) {
        event.preventDefault();
        activate(anchor.hash.slice(1), true);
        closeMenu();
        if (header.contains(anchor)) document.getElementById('main-content').scrollIntoView({ block: 'start' });
      }
    });
    function restoreChapter() {
      activate(keys.includes(location.hash.slice(1)) ? location.hash.slice(1) : defaultKey, false);
    }
    window.addEventListener('hashchange', restoreChapter);
    window.addEventListener('popstate', restoreChapter);
    restoreChapter();
    const mobile = matchMedia('(max-width: 780px)');
    const tablist = system.querySelector('[role="tablist"]');
    function setOrientation() { tablist.setAttribute('aria-orientation', mobile.matches ? 'horizontal' : 'vertical'); }
    mobile.addEventListener('change', setOrientation);
    setOrientation();
  }
  window.addEventListener('hashchange', preserveSection);
  if (blog) {
    const entries = [...blog.querySelectorAll('[data-blog-entry]')].map(element => ({
      element,
      tags: JSON.parse(element.dataset.blogTags || '[]')
    }));
    const groups = [...blog.querySelectorAll('[data-blog-category]')];
    const links = [...blog.querySelectorAll('[data-blog-tag]')];
    const status = blog.querySelector('.blog-filter-status');
    const selectedLabel = blog.querySelector('[data-blog-selected-tag]');
    const emptyResults = blog.querySelector('.blog-empty-results');

    function filterTag(tag, updateUrl) {
      if (updateUrl) {
        const url = new URL(location.href);
        if (tag) url.searchParams.set('tag', tag);
        else url.searchParams.delete('tag');
        url.hash = '';
        if (url.href !== location.href) history.pushState(null, '', url.href);
      }
      entries.forEach(entry => { entry.element.hidden = Boolean(tag) && !entry.tags.includes(tag); });
      groups.forEach(group => { group.hidden = Boolean(tag) && !group.querySelector('[data-blog-entry]:not([hidden])'); });
      links.forEach(link => {
        if (link.dataset.blogTag === tag) link.setAttribute('aria-current', 'true');
        else link.removeAttribute('aria-current');
      });
      status.hidden = !tag;
      selectedLabel.textContent = '#' + tag;
      emptyResults.hidden = !tag || entries.some(entry => !entry.element.hidden);
      blog.dataset.selectedTag = tag;
      preserveSection();
    }
    blog.addEventListener('click', event => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = event.target.closest('a');
      if (!link) return;
      if (link.hasAttribute('data-blog-tag')) {
        event.preventDefault();
        filterTag(link.dataset.blogTag, true);
      } else if (link.hasAttribute('data-blog-directory-link') && blog.dataset.selectedTag) {
        filterTag('', true);
      }
    });
    function restoreTag() { filterTag(new URL(location.href).searchParams.get('tag') || '', false); }
    window.addEventListener('popstate', restoreTag);
    restoreTag();
  }
  preserveSection();
  document.documentElement.classList.add('js');
  document.body.dataset.ready = 'true';
}());
