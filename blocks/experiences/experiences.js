/**
 * experiences — three-up experience card grid.
 *
 * Section head (eyebrow + headline + lede) → default content, reabsorbed.
 * One ROW per card, fields as flat siblings in the cell:
 *   <img> media · <h3> title · <p> body · readmore link
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
    p.style.maxWidth = '70ch';
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
  grid.className = 'exp-grid';

  rows.forEach((row) => {
    const cell = row.querySelector(':scope > div') || row;
    const img = media(cell);
    const heading = cell.querySelector('h3, h4');
    if (!img && !heading) return;

    const card = document.createElement('article');
    card.className = 'exp-card';

    if (img) {
      const m = document.createElement('div');
      m.className = 'exp-media';
      m.append(img);
      card.append(m);
    }
    const body = document.createElement('div');
    body.className = 'exp-body';
    if (heading) {
      const h = document.createElement('h3');
      h.className = 'title';
      h.append(...heading.childNodes);
      body.append(h);
    }
    const p = [...cell.querySelectorAll('p')].find((x) => x.textContent.trim() && !x.querySelector('a'));
    if (p) {
      const para = document.createElement('p');
      para.append(...p.childNodes);
      body.append(para);
    }
    const link = cell.querySelector('a');
    if (link) { link.className = 'readmore'; body.append(link); }

    card.append(body);
    grid.append(card);
  });

  const container = document.createElement('div');
  container.className = 'container';
  if (head) container.append(head);
  container.append(grid);
  block.replaceChildren(container);
}
