// ══════════════════════════════════════════════════════════
// FORCE ATLAS CORRESPONDENCE NETWORK (LANDING PAGE)
// ══════════════════════════════════════════════════════════
let fullNetworkSimulation = null;

function renderFullNetwork() {
  const svgEl = document.getElementById('full-network-svg');
  if (!svgEl) return;
  if (fullNetworkSimulation) { fullNetworkSimulation.stop(); fullNetworkSimulation = null; }
  svgEl.innerHTML = '';

  const W = svgEl.parentElement.clientWidth || 1000;
  const H = parseInt(svgEl.getAttribute('height') || svgEl.style.height) || 600;
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
  const infoEl = document.getElementById('network-node-count');
  if (infoEl) infoEl.textContent = `${nodes.length} people · ${links.length} connections`;
}
// ══════════════════════════════════════════════════════════
// DATA LOADING
// ══════════════════════════════════════════════════════════
Papa.parse('letters-raw.csv', {
  header: true,
  download: true,
  skipEmptyLines: true,
  complete: (results) => {
    processData(results.data);

    // Populate hero banner stats
    document.getElementById('hero-total').textContent  = APP.totalLetters.toLocaleString();
    document.getElementById('hero-people').textContent = APP.uniquePeople.size.toLocaleString();
    document.getElementById('hero-colls').textContent  = APP.uniqueCollections.size.toLocaleString();

    // Render full network graph on landing page
    renderFullNetwork();

    // Render first tab
    renderedTabs.add('tab1');
    renderTab1();

    // Hide loading overlay
    const overlay = document.getElementById('loading-overlay');
    overlay.style.transition = 'opacity 0.4s';
    overlay.style.opacity = '0';
    setTimeout(() => { overlay.style.display = 'none'; }, 400);
  },
  error: (err) => {
    document.getElementById('loading-overlay').innerHTML =
      `<div style="color:var(--red);text-align:center;padding:40px">
        <div style="font-size:2rem;margin-bottom:12px">⚠</div>
        <strong>Failed to load data</strong><br>
        <span style="color:var(--muted);font-size:0.85rem">${err.message || 'Check that letters-raw.csv is present'}</span>
      </div>`;
  }
});