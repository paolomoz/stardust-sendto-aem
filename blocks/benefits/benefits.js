/**
 * benefits — purple-ladder value-prop band (icon + label + copy perks).
 *
 * Section head (eyebrow + headline) is authored as DEFAULT CONTENT before the
 * block and reabsorbed here (zero pixel change). Block rows:
 *   - one row per perk: cell holds <h3> title + <p> description
 *   - a trailing row whose cell has a link → the "Descubre Más" readmore foot
 * Icons are fixed per-index brand glyphs injected here (decorative, inline SVG).
 */

const ns = 'http://www.w3.org/2000/svg';
const ICONS = [
  `<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" xmlns="${ns}"><path d="M4 20L20 4"/><circle cx="7" cy="7" r="2.4"/><circle cx="17" cy="17" r="2.4"/></svg>`,
  `<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" xmlns="${ns}"><rect x="3" y="6" width="18" height="12" rx="2"/><path d="M3 10h18"/></svg>`,
  `<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" xmlns="${ns}"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>`,
  `<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" xmlns="${ns}"><path d="M3 16l3-8h10l3 4h2v4"/><circle cx="7.5" cy="17" r="1.8"/><circle cx="17" cy="17" r="1.8"/></svg>`,
];

function svg(markup) {
  const t = document.createElement('template');
  t.innerHTML = markup.trim();
  return t.content.firstElementChild;
}

function buildSectionHead(block) {
  const wrap = block.closest('.block-content')?.previousElementSibling;
  if (!wrap || !(wrap.matches('.default-content, .default-content-wrapper'))) return null;
  const head = document.createElement('div');
  head.className = 'section-head';
  const eyebrow = wrap.querySelector('p:not(:has(a))') || wrap.querySelector('p');
  const heading = wrap.querySelector('h1, h2, h3');
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
  wrap.remove();
  return head;
}

export default async function decorate(block) {
  const rows = [...block.children];
  const head = buildSectionHead(block);

  const grid = document.createElement('div');
  grid.className = 'benefits-grid';
  let footRow = null;
  let i = 0;

  rows.forEach((row) => {
    const cell = row.querySelector(':scope > div') || row;
    if (cell.querySelector('a')) { footRow = cell; return; }
    if (!cell.textContent.trim()) return;

    const perk = document.createElement('div');
    perk.className = 'perk';
    const icon = document.createElement('div');
    icon.className = 'perk-icon';
    icon.append(svg(ICONS[i % ICONS.length]));
    perk.append(icon);

    const srcTitle = cell.querySelector('h3, h4, strong');
    const title = document.createElement('h3');
    title.append(...(srcTitle ? srcTitle.childNodes : [document.createTextNode(cell.textContent.trim())]));
    perk.append(title);
    const descEl = [...cell.querySelectorAll('p')]
      .find((p) => p.textContent.trim() && !p.contains(srcTitle) && p !== srcTitle);
    if (descEl) {
      const p = document.createElement('p');
      p.append(...descEl.childNodes);
      perk.append(p);
    }
    grid.append(perk);
    i += 1;
  });

  const container = document.createElement('div');
  container.className = 'container';
  if (head) container.append(head);
  container.append(grid);

  if (footRow) {
    const foot = document.createElement('div');
    foot.className = 'benefits-foot';
    const a = footRow.querySelector('a');
    a.className = 'readmore';
    foot.append(a);
    container.append(foot);
  }

  block.replaceChildren(container);
}
