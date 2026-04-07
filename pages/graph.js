// ══════════════════════════════════════════════════════════
// CONSTANTS & UTILITIES
// ══════════════════════════════════════════════════════════

const NAME_ALIASES = {
  'Carwhin': 'Colin Campbell of Carwhin',
  'Balcarres': 'Colin Lindsay, Earl of Balcarres',
  'Barcaldine': 'Alexander Campbell of Barcaldine',
  'Alexander Campbell of Barcardine': 'Alexander Campbell of Barcaldine',
  'Breadalbane ': 'Breadalbane',
  'Melville ': 'Melville',
  'Melville  ': 'Melville',
  'Crawford ': 'Crawford',
  'Cardross ': 'Cardross',
  'Atholl ': 'Atholl',
  'Cassillis ': 'Cassillis',
  'Church of Scotland ': 'Church of Scotland',
  'Anstruther ': 'Anstruther',
  'King James ': 'King James',
  'King William ': 'King William',
  'Group ': 'Group',
  'Person ': 'Person',
};

function normalizeName(name) {
  if (!name) return '';
  const trimmed = name.trim();
  return NAME_ALIASES[trimmed] ?? trimmed;
}

function escHtml(str) {
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function parseDate(str) {
  if (!str || str.trim() === '' || str === 'undated' || str === 'n.d.') return { year: null, month: null };
  str = str.trim().replace(/^c\.?\s*/i, '');

  // "1689, Jan 20" or "1689, Jan"
  let m = str.match(/^(\d{4}),\s*([A-Za-z]+)/);
  if (m) {
    return { year: +m[1], month: MONTH_NUMS[m[2].toLowerCase().slice(0,3)] || null };
  }

  // "June-July 1689" or "June 1689"
  m = str.match(/([A-Za-z]+).*?(\d{4})/);
  if (m) {
    return { year: +m[2], month: MONTH_NUMS[m[1].toLowerCase().slice(0,3)] || null };
  }

  // "1/20/1689"
  m = str.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (m) return { year: +m[3], month: +m[1] };

  // "09.08.1690"
  m = str.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
  if (m) return { year: +m[3], month: +m[1] };

  // year only
  m = str.match(/^(\d{4})$/);
  if (m) return { year: +m[1], month: null };

  return { year: null, month: null };
}

const COLLECTION_ABBR = {
  'Correspondence of the Dukes of Hamilton and Brandon': 'Hamilton & Brandon',
  'Leven & Melville Papers': 'Melville Papers',
  'Leven and Melville NRS': 'Melville NRS',
  'Breadalbane Correspondence': 'Breadalbane',
  'Hamilton Manuscripts Printed': 'Hamilton Printed',
  'Jacobite Papers': 'Jacobite Papers',
};
function abbrevColl(name) { return COLLECTION_ABBR[name] || name; }

const MONTH_NUMS = {jan:1,feb:2,mar:3,apr:4,may:5,jun:6,jul:7,aug:8,sep:9,oct:10,nov:11,dec:12};
const YEARS = [1688, 1689, 1690, 1691, 1692];
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const COLL_COLORS = ['#e8c468','#58a6ff','#3fb950','#bc8cff','#ffa657','#6e7681'];

// ══════════════════════════════════════════════════════════
// APP GLOBAL STATE
// ══════════════════════════════════════════════════════════
const APP = {
  rows: [],
  totalLetters: 0,
  uniquePeople: new Set(),
  uniqueCollections: new Set(),
  // per-year counts
  yearCounts: {},        // { 1688: N, ... }
  topSenders: [],        // [{name, count}]
  topReceivers: [],
  // tab2
  stackedData: [],       // [{year, colls: {abbrev: N}}]
  topColls: [],          // top 5 collection names (original)
  monthCounts1689: {},   // {1: N, ...}
  spanData: [],          // [{name, first, last, total}]
  // tab3
  personSent: {},        // name -> count
  personRecv: {},
  pairCounts: {},        // 'A|||B' -> count (normalized, directed A->B)
  personYears: {},       // name -> Set of years
  personColls: {},       // name -> Set of colls
  allPeople: [],         // [{name, total}] sorted
  // tab4
  fromPlaceCounts: {},
  toPlaceCounts: {},
  routeCounts: {},       // 'A→B' -> count
};

const renderedTabs = new Set();

// ══════════════════════════════════════════════════════════
// PROCESS DATA
// ══════════════════════════════════════════════════════════
function processData(rows) {
  APP.rows = rows;
  APP.totalLetters = rows.length;

  // Year counts
  YEARS.forEach(y => { APP.yearCounts[y] = 0; });

  // Collection stacked data init
  const collYearMap = {}; // year -> {coll: count}
  YEARS.forEach(y => { collYearMap[y] = {}; });

  const collTotals = {};

  rows.forEach(row => {
    const from = normalizeName(row['From Name']);
    const to   = normalizeName(row['To Name']);
    const coll = (row['Identifier'] || '').trim();
    const fp   = (row['From Place'] || '').trim();
    const tp   = (row['To Place']   || '').trim();
    const { year, month } = parseDate(row['Date']);

    if (from) APP.uniquePeople.add(from);
    if (to)   APP.uniquePeople.add(to);
    if (coll) APP.uniqueCollections.add(coll);

    // Year counts
    if (year && APP.yearCounts[year] !== undefined) {
      APP.yearCounts[year]++;
    }

    // Stacked by collection
    if (year && YEARS.includes(year) && coll) {
      if (!collYearMap[year][coll]) collYearMap[year][coll] = 0;
      collYearMap[year][coll]++;
      collTotals[coll] = (collTotals[coll] || 0) + 1;
    }

    // Monthly 1689
    if (year === 1689 && month) {
      APP.monthCounts1689[month] = (APP.monthCounts1689[month] || 0) + 1;
    }

    // Sender / receiver
    if (from) APP.personSent[from] = (APP.personSent[from] || 0) + 1;
    if (to)   APP.personRecv[to]   = (APP.personRecv[to]   || 0) + 1;

    // Pair
    if (from && to) {
      const key = from + '|||' + to;
      APP.pairCounts[key] = (APP.pairCounts[key] || 0) + 1;
    }

    // Person years
    if (year) {
      if (from) { if (!APP.personYears[from]) APP.personYears[from] = new Set(); APP.personYears[from].add(year); }
      if (to)   { if (!APP.personYears[to])   APP.personYears[to]   = new Set(); APP.personYears[to].add(year); }
    }

    // Person collections
    if (coll) {
      if (from) { if (!APP.personColls[from]) APP.personColls[from] = new Set(); APP.personColls[from].add(coll); }
      if (to)   { if (!APP.personColls[to])   APP.personColls[to]   = new Set(); APP.personColls[to].add(coll); }
    }

    // Places
    if (fp) APP.fromPlaceCounts[fp] = (APP.fromPlaceCounts[fp] || 0) + 1;
    if (tp) APP.toPlaceCounts[tp]   = (APP.toPlaceCounts[tp]   || 0) + 1;

    // Routes
    if (fp && tp) {
      const rk = fp + '→' + tp;
      APP.routeCounts[rk] = (APP.routeCounts[rk] || 0) + 1;
    }
  });

  // Top collections
  APP.topColls = Object.entries(collTotals)
    .sort((a,b) => b[1]-a[1])
    .slice(0,5)
    .map(d => d[0]);

  // Build stacked data
  APP.stackedData = YEARS.map(y => {
    const entry = { year: y };
    let otherCount = 0;
    const yearData = collYearMap[y];
    APP.topColls.forEach(c => { entry[abbrevColl(c)] = yearData[c] || 0; });
    Object.keys(yearData).forEach(c => {
      if (!APP.topColls.includes(c)) otherCount += yearData[c];
    });
    entry['Other'] = otherCount;
    return entry;
  });

  // Span data
  const allPeopleSet = new Set([...Object.keys(APP.personSent), ...Object.keys(APP.personRecv)]);
  const spanArr = [];
  allPeopleSet.forEach(name => {
    const total = (APP.personSent[name] || 0) + (APP.personRecv[name] || 0);
    const yrs = APP.personYears[name] ? [...APP.personYears[name]] : [];
    if (yrs.length > 0) {
      spanArr.push({ name, total, first: Math.min(...yrs), last: Math.max(...yrs) });
    }
  });
  APP.spanData = spanArr.sort((a,b) => b.total - a.total).slice(0, 20);

  // All people sorted
  APP.allPeople = [];
  allPeopleSet.forEach(name => {
    const total = (APP.personSent[name] || 0) + (APP.personRecv[name] || 0);
    APP.allPeople.push({ name, total, sent: APP.personSent[name] || 0, recv: APP.personRecv[name] || 0 });
  });
  APP.allPeople.sort((a,b) => b.total - a.total);

  // Top senders / receivers
  APP.topSenders   = Object.entries(APP.personSent).sort((a,b)=>b[1]-a[1]).slice(0,10).map(([name,count])=>({name,count}));
  APP.topReceivers = Object.entries(APP.personRecv).sort((a,b)=>b[1]-a[1]).slice(0,10).map(([name,count])=>({name,count}));
}

// ══════════════════════════════════════════════════════════
// TOOLTIP
// ══════════════════════════════════════════════════════════
const tooltip = document.getElementById('tooltip');
function showTooltip(evt, html) {
  tooltip.innerHTML = html;
  tooltip.style.display = 'block';
  positionTooltip(evt);
}
function positionTooltip(evt) {
  const x = evt.clientX, y = evt.clientY;
  const tw = tooltip.offsetWidth, th = tooltip.offsetHeight;
  const vw = window.innerWidth, vh = window.innerHeight;
  let left = x + 14, top = y - 10;
  if (left + tw > vw - 10) left = x - tw - 14;
  if (top + th > vh - 10) top = vh - th - 10;
  tooltip.style.left = left + 'px';
  tooltip.style.top  = top  + 'px';
}
function hideTooltip() { tooltip.style.display = 'none'; }

function setNetworkStatus(message) {
  const infoEl = document.getElementById('network-node-count') || document.getElementById('stats');
  if (infoEl) infoEl.textContent = message;
}

function renderNetworkMessage(svgEl, message) {
  const W = svgEl.getAttribute('width') || svgEl.parentElement?.clientWidth || 900;
  const H = svgEl.getAttribute('height') || svgEl.parentElement?.clientHeight || 560;
  d3.select(svgEl)
    .append('text')
    .attr('x', Number(W) / 2)
    .attr('y', Number(H) / 2)
    .attr('text-anchor', 'middle')
    .attr('fill', 'var(--muted)')
    .attr('font-size', '14px')
    .text(message);
}
// ══════════════════════════════════════════════════════════
// FORCE ATLAS CORRESPONDENCE NETWORK (LANDING PAGE)
// ══════════════════════════════════════════════════════════
let fullNetworkSimulation = null;

function renderFullNetwork() {
  const svgEl = document.getElementById('full-network-svg') || document.getElementById('graph-svg');
  if (!svgEl) return;
  if (fullNetworkSimulation) { fullNetworkSimulation.stop(); fullNetworkSimulation = null; }
  svgEl.innerHTML = '';

  const W = svgEl.parentElement.clientWidth || 1000;
  const H = svgEl.parentElement.clientHeight || parseInt(svgEl.getAttribute('height') || svgEl.style.height, 10) || 600;
  svgEl.setAttribute('width', W);
  svgEl.setAttribute('height', H);

  // Use all people sorted by total, capped at 160 for smooth performance
  const nodeLimit = 160;
  const visiblePeople = APP.allPeople.slice(0, nodeLimit);
  const nameSet = new Set(visiblePeople.map(d => d.name));

  // Build node map with degree tracking
  const nodeMap = {};
  visiblePeople.forEach(d => {
    nodeMap[d.name] = { id: d.name, total: d.total, sent: d.sent, recv: d.recv, degree: 0 };
  });

  // Build links from pairCounts — merge directed pairs into undirected edges
  const links = [];
  const edgeMap = {};
  Object.entries(APP.pairCounts).forEach(([key, cnt]) => {
    const [a, b] = key.split('|||');
    if (!nameSet.has(a) || !nameSet.has(b) || a === b) return;
    const pk = [a, b].sort().join('|||');
    if (edgeMap[pk] === undefined) {
      edgeMap[pk] = links.length;
      links.push({ source: a, target: b, weight: cnt });
    } else {
      links[edgeMap[pk]].weight += cnt;
    }
  });

  // Count degree from actual links
  links.forEach(l => {
    const sa = l.source, sb = l.target;
    if (nodeMap[sa]) nodeMap[sa].degree++;
    if (nodeMap[sb]) nodeMap[sb].degree++;
  });

  const nodes = visiblePeople.map(d => ({ ...nodeMap[d.name] }));

  if (!nodes.length) {
    setNetworkStatus('No network data available');
    renderNetworkMessage(svgEl, 'No data available for this view');
    return;
  }

  const totalMax = d3.max(nodes, d => d.total) || 1;
  const weightMax = d3.max(links, d => d.weight) || 1;
  const sizeScale = d3.scaleSqrt().domain([1, totalMax]).range([3, 19]);
  const linkWidthScale = d3.scaleLinear().domain([1, weightMax]).range([0.3, 4.5]);
  // ForceAtlas2-style colour: dark blue (few) → gold (many)
  const colorScale = d3.scaleSequential()
    .domain([0, totalMax])
    .interpolator(d3.interpolateRgb('#1a3a5c', '#e8c468'));

  const svg = d3.select(svgEl);
  const g = svg.append('g');

  svg.call(
    d3.zoom()
      .scaleExtent([0.08, 8])
      .on('zoom', evt => g.attr('transform', evt.transform))
  );

  // Draw links
  const linkEls = g.selectAll('.fn-link').data(links).join('line')
    .attr('class', 'fn-link')
    .attr('stroke', '#d0d7de')
    .attr('stroke-width', d => linkWidthScale(d.weight))
    .attr('stroke-opacity', 0.4)
    .on('mousemove', (evt, d) => {
      const a = d.source.id || d.source, b = d.target.id || d.target;
      showTooltip(evt, `<strong>${escHtml(String(a))} ↔ ${escHtml(String(b))}</strong><br>${d.weight} letter${d.weight !== 1 ? 's' : ''}`);
    })
    .on('mouseleave', hideTooltip);

  // Draw nodes
  const node = g.selectAll('.fn-node').data(nodes).join('g')
    .attr('class', 'fn-node')
    .call(
      d3.drag()
        .on('start', (evt, d) => { if (!evt.active) sim.alphaTarget(0.3).restart(); d.fx = d.x; d.fy = d.y; })
        .on('drag',  (evt, d) => { d.fx = evt.x; d.fy = evt.y; })
        .on('end',   (evt, d) => { if (!evt.active) sim.alphaTarget(0); d.fx = null; d.fy = null; })
    );

  node.append('circle')
    .attr('r', d => sizeScale(Math.max(1, d.total)))
    .attr('fill', d => colorScale(d.total))
    .attr('stroke', d => d.total > totalMax * 0.25 ? 'rgba(154,111,0,0.6)' : 'rgba(208,215,222,0.7)')
    .attr('stroke-width', d => d.total > totalMax * 0.25 ? 1.5 : 0.5)
    .style('cursor', 'pointer')
    .on('mousemove', (evt, d) => {
      showTooltip(evt,
        `<strong>${escHtml(d.id)}</strong><br>Sent: ${d.sent} · Received: ${d.recv}<br>Total: ${d.total} letters`
      );
    })
    .on('mouseleave', hideTooltip);

  // Labels only for the most connected nodes to avoid clutter
  const labelThreshold = d3.quantile(nodes.map(d => d.total).sort(d3.ascending), 0.82) || 10;
  node.filter(d => d.total >= labelThreshold)
    .append('text')
    .attr('dy', d => sizeScale(Math.max(1, d.total)) + 10)
    .attr('text-anchor', 'middle')
    .attr('fill', 'var(--muted)')
    .attr('font-size', '8.5px')
    .attr('pointer-events', 'none')
    .text(d => d.id.length > 22 ? d.id.slice(0, 20) + '…' : d.id);

  // ForceAtlas2-inspired simulation:
  //  - Hub-scaled repulsion: hubs push neighbours away more strongly
  //  - Weak global gravity keeps the graph centred
  //  - Link attraction with distance scaled by edge weight
  //  - Collision avoidance prevents overlapping nodes
  const sim = d3.forceSimulation(nodes)
    .force('link', d3.forceLink(links).id(d => d.id)
      .distance(d => 38 + linkWidthScale(d.weight) * 18)
      .strength(0.35))
    .force('charge', d3.forceManyBody()
      .strength(d => -Math.max(55, (d.degree + 1) * 28)))
    .force('center', d3.forceCenter(W / 2, H / 2).strength(0.04))
    .force('collide', d3.forceCollide(d => sizeScale(Math.max(1, d.total)) + 4).strength(0.75))
    .velocityDecay(0.38)
    .alphaDecay(0.014)
    .on('tick', () => {
      linkEls
        .attr('x1', d => d.source.x).attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x).attr('y2', d => d.target.y);
      node.attr('transform', d => `translate(${d.x},${d.y})`);
    });

  fullNetworkSimulation = sim;

  // Update info label
  const infoEl = document.getElementById('network-node-count') || document.getElementById('stats');
  if (infoEl) infoEl.textContent = `${nodes.length} people · ${links.length} connections`;
}
// ══════════════════════════════════════════════════════════
// DATA LOADING
// ══════════════════════════════════════════════════════════
const CSV_PATHS = [
  '/_data/letters-raw.csv',
  '_data/letters-raw.csv',
  '/data/letters-raw.csv',
  './data/letters-raw.csv',
  'data/letters-raw.csv',
  'letters-raw.csv',
];

function hideLoadingOverlay() {
  const overlay = document.getElementById('loading-overlay');
  if (!overlay) return;
  overlay.style.transition = 'opacity 0.4s';
  overlay.style.opacity = '0';
  setTimeout(() => { overlay.style.display = 'none'; }, 400);
}

function showLoadError(message) {
  const overlay = document.getElementById('loading-overlay');
  if (!overlay) return;
  overlay.innerHTML =
    `<div style="color:var(--red);text-align:center;padding:40px">
      <div style="font-size:2rem;margin-bottom:12px">⚠</div>
      <strong>Failed to load data</strong><br>
      <span style="color:var(--muted);font-size:0.85rem">${message}</span>
    </div>`;
}

function parseCsvWithFallback(paths, index = 0) {
  if (index >= paths.length) {
    setNetworkStatus('Unable to load letter data');
    showLoadError('Check that letters-raw.csv exists in _data/ or data/.');
    const svgEl = document.getElementById('full-network-svg') || document.getElementById('graph-svg');
    if (svgEl) {
      svgEl.innerHTML = '';
      svgEl.setAttribute('width', svgEl.parentElement?.clientWidth || 1000);
      svgEl.setAttribute('height', svgEl.parentElement?.clientHeight || 600);
      renderNetworkMessage(svgEl, 'Unable to load data file');
    }
    return;
  }

  Papa.parse(paths[index], {
    header: true,
    download: true,
    skipEmptyLines: true,
    complete: (results) => {
      const rows = (results.data || []).filter(r => {
        if (!r || typeof r !== 'object') return false;
        return Object.values(r).some(v => String(v || '').trim() !== '');
      });

      // PapaParse can report recoverable row-level warnings while still returning valid data.
      if ((!rows.length) && results.errors && results.errors.length) {
        parseCsvWithFallback(paths, index + 1);
        return;
      }

      processData(rows);

      // Populate hero banner stats when those targets exist.
      const heroTotal = document.getElementById('hero-total');
      const heroPeople = document.getElementById('hero-people');
      const heroColls = document.getElementById('hero-colls');
      if (heroTotal) heroTotal.textContent = APP.totalLetters.toLocaleString();
      if (heroPeople) heroPeople.textContent = APP.uniquePeople.size.toLocaleString();
      if (heroColls) heroColls.textContent = APP.uniqueCollections.size.toLocaleString();

      renderFullNetwork();

      if (typeof renderTab1 === 'function') {
        renderedTabs.add('tab1');
        renderTab1();
      }

      hideLoadingOverlay();
    },
    error: () => {
      parseCsvWithFallback(paths, index + 1);
    }
  });
}

parseCsvWithFallback(CSV_PATHS);