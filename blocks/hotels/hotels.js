/**
 * hotels — Hoteles & Resorts feature-plus-grid.
 *
 * Section head (eyebrow + headline + lede) → default content, reabsorbed.
 * One ROW per hotel card, fields as flat siblings in the cell (authored order):
 *   <img> media · region label <p> · <h3> title · CTA link(s)
 * The FIRST card renders as `.feature` (grid-row span 2) — a real per-instance
 * variation from the prototype (fingerprint #90). A trailing link-only row
 * (no image) → the "Ver todos" outline foot button.
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
    p.style.maxWidth = '66ch';
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
  grid.className = 'hotels-grid';
  let footRow = null;
  let cardIndex = 0;

  rows.forEach((row) => {
    const cell = row.querySelector(':scope > div') || row;
    const img = media(cell);
    if (!img) { if (cell.querySelector('a')) footRow = cell; return; }

    const card = document.createElement('article');
    card.className = cardIndex === 0 ? 'hotel-card feature' : 'hotel-card';
    card.append(img);

    const overlay = document.createElement('div');
    overlay.className = 'hotel-overlay';
    card.append(overlay);

    const body = document.createElement('div');
    body.className = 'hotel-body';
    const info = document.createElement('div');

    const region = [...cell.querySelectorAll('p')].find((p) => !p.querySelector('a'));
    if (region) {
      const r = document.createElement('span');
      r.className = 'label hotel-region';
      r.textContent = region.textContent.trim();
      info.append(r);
    }
    const heading = cell.querySelector('h3, h4');
    if (heading) {
      const h = document.createElement('h3');
      h.className = 'title';
      h.append(...heading.childNodes);
      info.append(h);
    }
    body.append(info);

    const links = [...cell.querySelectorAll('a')];
    if (links.length) {
      const actions = document.createElement('div');
      actions.className = 'hotel-actions';
      links.forEach((a) => {
        // primary "Reservar" carries .btn.btn-primary via <strong>; readmore is plain
        if (a.closest('strong') || a.dataset.role === 'primary') {
          a.className = 'btn btn-primary';
        } else {
          a.className = 'readmore';
        }
        actions.append(a);
      });
      body.append(actions);
    }

    card.append(body);
    grid.append(card);
    cardIndex += 1;
  });

  const container = document.createElement('div');
  container.className = 'container';
  if (head) container.append(head);
  container.append(grid);

  if (footRow) {
    const foot = document.createElement('div');
    foot.className = 'hotels-foot';
    const a = footRow.querySelector('a');
    a.className = 'btn btn-secondary';
    foot.append(a);
    container.append(foot);
  }

  block.replaceChildren(container);
}
