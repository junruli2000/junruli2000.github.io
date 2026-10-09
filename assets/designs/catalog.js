(function () {
  'use strict';
  window.HomepageDesigns = [
    { id: '01', key: 'scholar', layout: 'papers', name: '论文优先', english: 'Papers First', category: 'academic', description: '论文从第一屏开始，搜索与年份筛选居中，右侧是一张紧凑的个人资料卡。', palette: ['#f8f9f6', '#203932', '#b7c8b5'], recommend: true },
    { id: '02', key: 'oxford', layout: 'dossier', name: '侧栏档案', english: 'The Academic Dossier', category: 'editorial', description: '固定酒红导航、左侧个人档案、右侧完整履历，采用三列档案式结构。', palette: ['#f4ede0', '#6d2331', '#a68c60'] },
    { id: '03', key: 'tsinghua', layout: 'portal', name: '清华研究门户', english: 'A Research Portal', category: 'academic', description: '研究主题横幅、最新论文重点展示和院校资料卡，像一个独立研究门户。', palette: ['#f6f3fa', '#6b348c', '#dbcae9'], recommend: true },
    { id: '04', key: 'nordic', layout: 'bento', name: '信息工作台', english: 'The Bento Desk', category: 'academic', description: '个人资料、研究主题、论文和教学组成不同尺寸的卡片，首屏即是完整信息总览。', palette: ['#e9eeec', '#30484b', '#d0ddd4'] },
    { id: '05', key: 'notebook', layout: 'notebook', name: '开放研究笔记', english: 'The Open Notebook', category: 'editorial', description: '带页签的方格研究笔记，可切换章节阅读，保留页边批注和手札式排版。', palette: ['#fbf6e9', '#365d8d', '#c7836d'] },
    { id: '06', key: 'terminal', layout: 'terminal', name: '交互终端', english: 'An Interactive Terminal', category: 'digital', description: '真正可输入命令的终端界面，用 papers、about、teaching 切换主页内容。', palette: ['#111815', '#90e7ab', '#2d4f3c'] },
    { id: '07', key: 'observatory', layout: 'constellation', name: '星图研究地图', english: 'A Research Constellation', category: 'digital', description: '用整屏轨道图连接研究、论文、教学与经历；点击星图节点跳到对应内容。', palette: ['#0e172b', '#9cccd6', '#8598cb'] },
    { id: '08', key: 'swiss', layout: 'poster', name: '排版宣言', english: 'A Typographic Statement', category: 'expressive', description: '超大文字、红色海报版面和三列论文卡片，弱化头像，突出个人表达与研究。', palette: ['#f5f3ed', '#e94330', '#191c1c'] },
    { id: '09', key: 'ink', layout: 'scroll', name: '国风长卷', english: 'An Academic Scroll', category: 'editorial', description: '竖排姓名与长卷章节导航，正文依次展开，论文保持横排英文以便阅读。', palette: ['#f6f4ed', '#242925', '#a44034'] },
    { id: '10', key: 'journal', layout: 'magazine', name: '杂志封面', english: 'The Research Magazine', category: 'academic', description: '采用杂志封面、研究导语、照片和分栏论文，整页像一本个人学术刊物。', palette: ['#fcfbf8', '#26384c', '#b4bec6'], recommend: true },
    { id: '11', key: 'brutalist', layout: 'board', name: '黑白面板', english: 'The Information Board', category: 'expressive', description: '将简介、论文与履历铺成可横向浏览的面板，用方向按钮浏览不同栏目。', palette: ['#fffef7', '#171717', '#f5ea66'] },
    { id: '12', key: 'bauhaus', layout: 'geometry', name: '几何目录', english: 'The Geometric Index', category: 'expressive', description: '六个不同形状与颜色的章节入口构成首页，点击几何模块进入对应章节。', palette: ['#f3eeda', '#c44938', '#265996'] },
    { id: '13', key: 'clay', layout: 'story', name: '个人叙事', english: 'A Personal Story', category: 'editorial', description: '大幅照片与个人介绍并置，教育和实习沿纵向时间线展开，再接入研究成果。', palette: ['#f6ede5', '#995b45', '#dbb89a'] },
    { id: '14', key: 'ocean', layout: 'timeline', name: '研究时间线', english: 'The Research Timeline', category: 'academic', description: '小型身份栏与纵向年份轴，论文按时间展开，教学和经历成为后续时间节点。', palette: ['#f4fbfd', '#227197', '#badfeb'] },
    { id: '15', key: 'forest', layout: 'folio', name: '双页书册', english: 'The Two-Page Folio', category: 'editorial', description: '左页是绿色个人封面与目录，右页是可翻页的正文，可逐章阅读整个主页。', palette: ['#f3f2e9', '#23483b', '#9fae8b'], recommend: true },
    { id: '16', key: 'index', layout: 'library', name: '搜索型论文库', english: 'The Paper Library', category: 'academic', description: '应用式论文目录：侧栏按年份筛选，搜索标题与作者，显示实际匹配数量。', palette: ['#ffffff', '#2757be', '#d9e2f8'] },
    { id: '17', key: 'studio', layout: 'wall', name: '创意作品墙', english: 'The Research Wall', category: 'expressive', description: '论文像作品一样铺满彩色网格，不同尺寸的卡片与醒目文字形成研究作品墙。', palette: ['#eae4f7', '#4f3688', '#d4ed7b'] },
    { id: '18', key: 'glass', layout: 'workspace', name: '现代应用', english: 'The Research Workspace', category: 'digital', description: '有侧栏、内容标签和真实数量统计的应用界面，可切换论文、简介和履历。', palette: ['#dcebf2', '#466b87', '#f6fbff'] },
    { id: '19', key: 'blueprint', layout: 'diagram', name: '研究结构图', english: 'The Research Diagram', category: 'digital', description: '主页从一张可点击的结构图开始，用标注线组织研究方向与各内容入口。', palette: ['#214778', '#e2efff', '#96bddc'] },
    { id: '20', key: 'gallery', layout: 'exhibition', name: '全屏展厅', english: 'The Personal Exhibition', category: 'expressive', description: '大幅照片与整屏封面，目录贴在封面下沿；进入后按展览章节浏览研究与经历。', palette: ['#eeece6', '#5c5349', '#c4baa6'] }
  ];
}());
