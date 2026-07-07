/**
 * offers — three-up offer card grid with a time-limited flag badge.
 *
 * Section head (eyebrow + headline + lede) → default content, reabsorbed.
 * One ROW per offer, fields as flat siblings in the cell:
 *   <strong> flag (e.g. "Verano") · <img> media · <em>|<p> loc label ·
 *   <h3> offer title · CTA link(s)
 * The flag rides a <strong> (survives DA); the loc rides an <em>.
 * CTAs: "Reservar" wrapped in <strong> → .btn.btn-primary; "Ver más" → readmore.
 */

function buildSectionHead(block) {
  const wrap = block.closest('.block-content')?.previousElementSibling;
  if (!wrap || !(wrap.matches('.default-content, .default-content-wrapper'))) return null;
  const head = document.createElement('div');
  head.className = 'section-head';
  const ps = [...wrap.querySelectorAll('p')].filter((p) => !p.querySelector('a'));
  const heading = wrap.querySelector('h1, h2, h3');
  const eyebrow = ps[0];
  const lede = ps.find((p) => p !== eyebrow);
  if (eyebrow) {
    const l = document.createElement('span');
    l.className = 'label';
    l.textContent = eyebrow.textContent.trim();
    head.append(l);
  }
  if (heading) {
    const h = document.createElement('h2');
    h.className = 'headline';
    h.append(...heading.childNodes);
    head.append(h);
  }
  if (lede) {
    const p = document.createElement('p');
    p.className = 'lede';
    p.style.maxWidth = '72ch';
    p.style.color = 'var(--ink-muted)';
    p.append(...lede.childNodes);
    head.append(p);
  }
  wrap.remove();
  return head;
}

function media(el) {
  if (!el) return null;
  return el.matches('picture, img') ? el : el.querySelector('picture, img');
}

export default async function decorate(block) {
  const rows = [...block.children];
  const head = buildSectionHead(block);

  const grid = document.createElement('div');
  grid.className = 'offers-grid';
  let footRow = null;

  rows.forEach((row) => {
    const cell = row.querySelector(':scope > div') || row;
    const img = media(cell);
    if (!img) { if (cell.querySelector('a')) footRow = cell; return; }

    const card = document.createElement('article');
    card.className = 'offer-card';

    const mediaWrap = document.createElement('div');
    mediaWrap.className = 'offer-media';
    const flag = cell.querySelector('strong');
    if (flag && !flag.querySelector('a')) {
      const f = document.createElement('span');
      f.className = 'offer-flag';
      f.textContent = flag.textContent.trim();
      mediaWrap.append(f);
    }
    mediaWrap.append(img);
    card.append(mediaWrap);

    const body = document.createElement('div');
    body.className = 'offer-body';

    const loc = cell.querySelector('em') || [...cell.querySelectorAll('p')].find((p) => !p.querySelector('a') && p.textContent.trim());
    if (loc) {
      const l = document.createElement('span');
      l.className = 'offer-loc';
      l.textContent = loc.textContent.trim();
      body.append(l);
    }
    const heading = cell.querySelector('h3, h4');
    if (heading) {
      const h = document.createElement('h3');
      h.className = 'offer-title';
      h.append(...heading.childNodes);
      body.append(h);
    }
    const links = [...cell.querySelectorAll('a')];
    if (links.length) {
      const actions = document.createElement('div');
      actions.className = 'offer-actions';
      links.forEach((a) => {
        if (a.closest('strong')) a.className = 'btn btn-primary';
        else a.className = 'readmore';
        actions.append(a);
      });
      body.append(actions);
    }

    card.append(body);
    grid.append(card);
  });

  const container = document.createElement('div');
  container.className = 'container';
  if (head) container.append(head);
  container.append(grid);

  if (footRow) {
    const foot = document.createElement('div');
    foot.className = 'offers-foot';
    const a = footRow.querySelector('a');
    a.className = 'btn btn-secondary';
    foot.append(a);
    container.append(foot);
  }

  block.replaceChildren(container);
}
