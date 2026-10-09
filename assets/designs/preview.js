(function () {
  'use strict';
  const root = document.body.dataset.root || '';
  const params = new URLSearchParams(window.location.search);
  const design = window.HomepageDesigns.find(item => item.id === params.get('style')) || window.HomepageDesigns[0];
  const language = params.get('lang') === 'en' ? 'en' : 'zh';
  const blogView = params.get('view') === 'blog';
  const mini = params.get('mini') === '1';
  const embedded = params.get('embed') === '1';
  const zh = language === 'zh';
  const app = document.getElementById('preview-app');
  const labels = zh ? {
    name: '李君儒', role: '清华大学 · 交叉信息研究院', research: '理论密码学与安全多方计算',
    kicker: '研究，连接理论与可能。', intern: '蚂蚁 CPLab · 后量子研究实习',
    about: '关于我', education: '教育经历', publications: '发表论文', teaching: '教学经历',
    experience: '个人经历', awards: '获奖荣誉', blog: '博客', email: '联系我', scholar: '谷歌学术',
    cv: '简历', menu: '菜单', back: '全部设计', topics: '研究兴趣', blogTitle: 'Blog',
    blogSubtitle: '关于研究、学习与思考的记录。', empty: '暂无博客文章。',
    institute: '清华大学 / IIIS', affiliation: '博士研究生', portrait: '李君儒的照片'
  } : {
    name: 'Junru Li', role: 'IIIS · Tsinghua University', research: 'Theoretical cryptography & secure computation',
    kicker: 'Exploring theory. Building trust.', intern: 'Ant CPLab · Post-quantum research intern',
    about: 'About', education: 'Education', publications: 'Publications', teaching: 'Teaching',
    experience: 'Experience', awards: 'Selected awards', blog: 'Blog', email: 'Get in touch', scholar: 'Scholar',
    cv: 'CV', menu: 'Menu', back: 'All designs', topics: 'Research interests', blogTitle: 'Blog',
    blogSubtitle: 'Notes on research, learning, and ideas.', empty: 'No blog posts yet.',
    institute: 'Tsinghua University / IIIS', affiliation: 'Ph.D. student', portrait: 'Portrait of Junru Li'
  };
  document.documentElement.lang = zh ? 'zh-CN' : 'en';
  document.body.classList.add('theme-' + design.key);
  if (mini) document.body.classList.add('mini-preview');
  document.title = labels.name + ' · ' + (zh ? design.name : design.english);

  function escape(value) {
    return String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));
  }
  function previewUrl(options) {
    const query = new URLSearchParams({ style: design.id, lang: options.lang || language });
    if (options.blog) query.set('view', 'blog');
    if (mini) query.set('mini', '1');
    if (embedded) query.set('embed', '1');
    return root + '/designs/preview/?' + query.toString() + (options.hash || '');
  }
  function parseHome(html) {
    const parsed = new DOMParser().parseFromString(html, 'text/html');
    const workspaceSections = parsed.querySelectorAll('.research-workspace .content-section');
    if (workspaceSections.length) {
      const sections = {};
      workspaceSections.forEach(item => {
        sections[item.id] = { title: item.querySelector('h2').textContent.trim(), html: item.querySelector('.section-body').innerHTML };
      });
      return sections;
    }
    const content = parsed.querySelector('.page__content');
    if (!content) throw new Error('Homepage content missing');
    const sections = { about: { html: '' } };
    let current = 'about';
    for (const element of content.children) {
      if (element.matches('h2[id]')) {
        current = element.id;
        sections[current] = { title: element.textContent.trim(), html: '' };
      } else {
        sections[current].html += element.outerHTML;
      }
    }
    return sections;
  }
  function section(key, data, index) {
    if (!data) return '';
    return '<section class="content-section section-' + key + '" id="' + key + '">' +
      '<div class="section-heading"><span class="section-number">' + index + '</span><h2>' + escape(data.title || labels[key]) + '</h2><span class="section-rule"></span></div>' +
      '<div class="section-body">' + data.html + '</div></section>';
  }
  function header() {
    const navKeys = ['education', 'publications', 'blog', 'teaching', 'experience', 'awards'];
    const nav = navKeys.map(key => '<a href="' + (key === 'blog' ? previewUrl({ blog: true }) : previewUrl({ hash: '#' + key })) + '">' + labels[key] + '</a>').join('');
    const alternate = zh ? 'en' : 'zh';
    return '<header class="site-header"><a class="brand" href="' + previewUrl({}) + '"><span class="brand-name">' + labels.name + '<small>' + labels.affiliation + '</small></span></a>' +
      '<button type="button" class="menu-toggle" aria-expanded="false" aria-controls="site-navigation">' + labels.menu + ' <span aria-hidden="true">☰</span></button>' +
      '<nav id="site-navigation" class="site-nav" aria-label="' + (zh ? '主导航' : 'Main navigation') + '">' + nav + '</nav>' +
      '<a class="language-toggle" href="' + previewUrl({ lang: alternate, blog: blogView, hash: window.location.hash }) + '" lang="' + (zh ? 'en' : 'zh-CN') + '" aria-label="' + (zh ? '切换至英文' : 'Switch to Chinese') + '">' + (zh ? 'EN' : '中文') + '</a></header>';
  }
  function footer() {
    return '<footer class="site-footer"><div><p><a href="mailto:jr-li24@mails.tsinghua.edu.cn">jr-li24@mails.tsinghua.edu.cn</a></p></div>' +
      '<div class="footer-links"><a href="' + escape(document.body.dataset.github) + '">GitHub ↗</a><a href="' + escape(document.body.dataset.scholar) + '">' + labels.scholar + ' ↗</a><span>© ' + new Date().getFullYear() + ' ' + labels.name + '</span></div></footer>';
  }
  function polishPublications() {
    document.querySelectorAll('.section-publications .section-body > p').forEach(paragraph => {
      const heading = paragraph.querySelector('strong');
      if (heading && paragraph.textContent.trim() === heading.textContent.trim()) paragraph.classList.add('paper-year-heading');
    });
    document.querySelectorAll('.section-publications li').forEach((item, index) => {
      item.classList.add('paper-item');
      item.dataset.number = String(index + 1).padStart(2, '0');
      const title = item.querySelector('em');
      if (title) {
        title.classList.add('paper-title');
        title.innerHTML = title.innerHTML
          .replace('$\\Omega(|C|\\kappa)$', '<span class="formula">Ω(|C|κ)</span>')
          .replace('$\\tilde{\\mathcal{O}}(ε^{-4/(3p+1)})$', '<span class="formula">Õ(ε<sup>−4/(3p+1)</sup>)</span>')
          .replace('$p$th', '<i>p</i>th');
      }
    });
  }
  async function render() {
    try {
      const source = root + (zh ? '/zh/' : '/') + (blogView ? 'blog/' : '');
      const response = await fetch(source);
      if (!response.ok) throw new Error('Content could not be loaded');
      const html = await response.text();
      let main;
      let sections;
      if (blogView) {
        const parsed = new DOMParser().parseFromString(html, 'text/html');
        const archive = parsed.querySelector('.archive');
        if (!archive) throw new Error('Blog content missing');
        archive.querySelectorAll('.page__title').forEach(title => title.remove());
        main = '<main class="blog-main" id="main-content"><p class="hero-kicker">BLOG / ' + labels.name + '</p><h1>' + labels.blogTitle + '</h1><p class="blog-subtitle">' + labels.blogSubtitle + '</p><div class="blog-entries">' + archive.innerHTML + '</div></main>';
      } else {
        sections = parseHome(html);
        main = '<main id="main-content" class="layout-' + design.layout + '">' + window.HomepageLayouts.render({ design, root, labels, zh, sections, section, escape, previewUrl }) + '</main>';
      }
      app.innerHTML = header() + '<div class="site-wrap">' + main + footer() + '</div>' +
        (mini || embedded ? '' : '<a class="design-return" href="' + root + '/designs/"><span>' + design.id + '</span> ' + (zh ? design.name : design.english) + ' · ' + labels.back + ' ↗</a>');
      app.setAttribute('aria-busy', 'false');
      polishPublications();
      if (!blogView) window.HomepageLayouts.connect({ zh });
      const menu = document.querySelector('.menu-toggle');
      menu.addEventListener('click', () => {
        const open = menu.getAttribute('aria-expanded') !== 'true';
        menu.setAttribute('aria-expanded', String(open));
        document.querySelector('.site-header').classList.toggle('menu-open', open);
      });
      window.addEventListener('hashchange', () => {
        document.querySelector('.language-toggle').href = previewUrl({ lang: zh ? 'en' : 'zh', blog: blogView, hash: window.location.hash });
        menu.setAttribute('aria-expanded', 'false');
        document.querySelector('.site-header').classList.remove('menu-open');
      });
      if (window.location.hash) {
        const target = document.getElementById(window.location.hash.slice(1));
        if (target) target.scrollIntoView();
      }
      document.body.dataset.ready = 'true';
    } catch (error) {
      app.setAttribute('aria-busy', 'false');
      app.innerHTML = '<div class="load-error"><h1>' + (zh ? '预览暂时无法载入' : 'Preview unavailable') + '</h1><p>' + (zh ? '请刷新页面，或返回当前主页。' : 'Please reload or return to the current homepage.') + '</p><a href="' + root + (zh ? '/zh/' : '/') + '">' + (zh ? '当前主页' : 'Current homepage') + '</a></div>';
      document.body.dataset.ready = 'error';
    }
  }
  render();
}());
