/**
 * planet — full-bleed Royal Planet sustainability band.
 *
 * Authored cell (flat siblings, query-driven):
 *   <img> background media (editorial) · eyebrow <p> · <h2> headline ·
 *   body <p> · CTA link
 * The image is rendered into a background LAYER; the scrim is a CSS gradient
 * over it. The CTA renders as .btn.btn-ghost-light (light-on-dark).
 */

function collectNodes(block) {
  const out = [];
  block.querySelectorAll(':scope > div > div').forEach((cell) => {
    const kids = [...cell.children];
    if (kids.length) out.push(...kids);
    else if (cell.textContent.trim()) {
      const p = document.createElement('p');
      p.textContent = cell.textContent.trim();
      out.push(p);
    }
  });
  return out.length ? out : [...block.children];
}

function media(el) {
  if (!el) return null;
  return el.matches('picture, img') ? el : el.querySelector('picture, img');
}

export default async function decorate(block) {
  const nodes = collectNodes(block);

  const mediaEl = nodes.find((n) => media(n));
  const img = mediaEl ? media(mediaEl) : null;
  const heading = nodes.find((n) => n.matches('h2, h3') || n.querySelector('h2, h3'));
  const texts = nodes.filter((n) => n.matches('p') && !n.querySelector('a') && n !== mediaEl);
  const eyebrow = texts[0];
  const body = texts.find((p) => p !== eyebrow);
  const link = nodes.map((n) => (n.matches('a') ? n : n.querySelector('a'))).find(Boolean);

  const mediaLayer = document.createElement('div');
  mediaLayer.className = 'planet-media';
  mediaLayer.setAttribute('aria-hidden', 'true');
  if (img) { img.setAttribute('alt', ''); mediaLayer.append(img); }

  const scrim = document.createElement('div');
  scrim.className = 'planet-scrim';
  scrim.setAttribute('aria-hidden', 'true');

  const inner = document.createElement('div');
  inner.className = 'planet-inner';
  if (eyebrow) {
    const l = document.createElement('span');
    l.className = 'label';
    l.textContent = eyebrow.textContent.trim();
    inner.append(l);
  }
  if (heading) {
    const h = document.createElement('h2');
    h.className = 'headline';
    const src = heading.querySelector('h2, h3') || heading;
    h.append(...src.childNodes);
    inner.append(h);
  }
  if (body) {
    const p = document.createElement('p');
    p.append(...body.childNodes);
    inner.append(p);
  }
  if (link) { link.className = 'btn btn-ghost-light'; inner.append(link); }

  const container = document.createElement('div');
  container.className = 'container';
  container.append(inner);

  block.replaceChildren(mediaLayer, scrim, container);
}
