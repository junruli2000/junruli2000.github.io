(function () {
  'use strict';
  function connect({ zh }) {
    document.querySelectorAll('[data-chapter-system]').forEach(system => {
      const tabs = [...system.querySelectorAll('[data-chapter]')];
      const panes = [...system.querySelectorAll('[data-chapter-pane]')];
      const keys = panes.map(pane => pane.dataset.chapterPane);
      function activate(key, updateHash) {
        if (!keys.includes(key)) return;
        system.dataset.currentChapter = key;
        panes.forEach(pane => { pane.hidden = pane.dataset.chapterPane !== key; });
        tabs.forEach(tab => {
          const active = tab.dataset.chapter === key;
          tab.setAttribute('aria-selected', String(active));
          tab.tabIndex = active ? 0 : -1;
        });
        const counter = system.querySelector('[data-chapter-count]');
        if (counter) counter.textContent = String(keys.indexOf(key) + 1).padStart(2, '0') + ' / ' + keys.length;
        if (updateHash) {
          history.replaceState(null, '', '#' + key);
          window.dispatchEvent(new Event('hashchange'));
        }
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
      system.querySelectorAll('[data-chapter-step]').forEach(button => button.addEventListener('click', () => {
        const index = keys.indexOf(system.dataset.currentChapter);
        activate(keys[(index + Number(button.dataset.chapterStep) + keys.length) % keys.length], true);
      }));
      const form = system.querySelector('.terminal-command');
      if (form) form.addEventListener('submit', event => {
        event.preventDefault();
        const input = form.querySelector('input');
        const command = input.value.trim().toLowerCase().replace(/^\.\//, '').replace(/^\//, '');
        const aliases = { papers: 'publications', bio: 'about', cv: 'education' };
        const key = aliases[command] || command;
        const message = system.querySelector('.terminal-message');
        if (keys.includes(key)) {
          activate(key, true);
          message.textContent = '$ ' + command + ' → ' + (zh ? '已载入对应章节。' : 'Section loaded.');
          input.value = '';
        } else message.textContent = zh ? '可用命令：papers、about、education、teaching、experience、awards。' : 'Available commands: papers, about, education, teaching, experience, awards.';
      });
      activate(keys.includes(location.hash.slice(1)) ? location.hash.slice(1) : 'publications', false);
      window.addEventListener('hashchange', () => activate(location.hash.slice(1), false));
    });
    document.querySelectorAll('[data-paper-tools]').forEach(tools => {
      const publications = tools.querySelector('#publications');
      const content = publications.querySelector('.section-body');
      let year = 'manuscript';
      const groups = [];
      let yearHeading;
      [...content.children].forEach(element => {
        if (element.matches('p') && element.querySelector('strong') && /^\d{4}:?$/.test(element.textContent.trim())) {
          year = element.textContent.trim().slice(0, 4);
          yearHeading = element;
        } else if (element.matches('p.paper-year-heading') && !/^\d{4}/.test(element.textContent.trim())) {
          year = 'manuscript';
          yearHeading = element;
        }
        if (element.matches('ul')) {
          const items = [...element.querySelectorAll('li')];
          items.forEach(item => { item.dataset.paperYear = year; });
          groups.push({ list: element, heading: yearHeading, items });
          yearHeading = undefined;
        }
      });
      const items = [...publications.querySelectorAll('li')];
      const input = tools.querySelector('[data-paper-search]');
      const buttons = [...tools.querySelectorAll('[data-paper-year]')];
      let activeYear = 'all';
      function filter() {
        const query = input.value.trim().toLowerCase();
        let count = 0;
        items.forEach(item => {
          const match = (activeYear === 'all' || item.dataset.paperYear === activeYear) && item.textContent.toLowerCase().includes(query);
          item.hidden = !match;
          if (match) count += 1;
        });
        groups.forEach(group => {
          const visible = group.items.some(item => !item.hidden);
          group.list.hidden = !visible;
          if (group.heading) group.heading.hidden = !visible;
        });
        tools.querySelector('[data-paper-count]').textContent = zh ? count + ' / ' + items.length + ' 篇' : count + ' / ' + items.length + ' papers';
        tools.querySelector('[data-paper-empty]').hidden = count !== 0;
        buttons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.paperYear === activeYear)));
      }
      input.addEventListener('input', filter);
      buttons.forEach(button => button.addEventListener('click', () => { activeYear = button.dataset.paperYear; filter(); }));
      tools.querySelector('[data-paper-reset]').addEventListener('click', () => { input.value = ''; activeYear = 'all'; filter(); });
      filter();
    });
    document.querySelectorAll('[data-board-step]').forEach(button => button.addEventListener('click', () => {
      const board = document.querySelector('[data-board]');
      board.scrollBy({ left: Number(button.dataset.boardStep) * board.clientWidth * .75, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    }));
    document.querySelectorAll('.latest-paper em').forEach(title => title.classList.add('paper-title'));
  }
  window.HomepageInteractions = { connect };
}());
