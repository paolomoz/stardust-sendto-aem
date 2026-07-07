/**
 * hero — brand-arrival full-bleed media hero + docked booking widget.
 *
 * Authoring (default-content-tolerant, query-driven — never hard row index):
 *   - one <img>/<picture>  → full-bleed background media (poster still)
 *   - eyebrow  <p>         → short label above the headline (order: 1st text)
 *   - headline <h1>        → the page's single <h1>
 *   - lede     <p>         → sentence below the headline
 *   - a link-bearing <p>   → not used for the hero copy (booking CTA is built)
 *
 * The booking widget is a fixed brand affordance (tabs + fields + guarantee);
 * it is presentation, reconstructed here — the destination/dates are read-only
 * display values in the prototype. Rendered visible; no lifted opacity:0 reveal.
 */

const ns = 'http://www.w3.org/2000/svg';
function svg(markup) {
  const t = document.createElement('template');
  t.innerHTML = markup.trim();
  return t.content.firstElementChild;
}

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

export default async function decorate(block) {
  const nodes = collectNodes(block);

  const mediaEl = nodes.find((n) => n.matches('picture, img') || n.querySelector('picture, img'));
  const media = mediaEl
    ? (mediaEl.matches('picture, img') ? mediaEl : mediaEl.querySelector('picture, img'))
    : null;

  const headingEl = nodes.find((n) => n.matches('h1, h2, h3') || n.querySelector('h1, h2, h3'));
  const heading = headingEl
    ? (headingEl.matches('h1, h2, h3') ? headingEl : headingEl.querySelector('h1, h2, h3'))
    : null;

  // link-free <p>s, in authored order: eyebrow first, lede after the heading
  const texts = nodes.filter((n) => n.matches('p') && !n.querySelector('a')
    && (!heading || !heading.contains(n)) && n !== headingEl);
  const eyebrow = texts[0] || null;
  const lede = texts[1] || texts[0] === eyebrow ? texts[1] : texts[0];

  // ── media layer ──
  const mediaLayer = document.createElement('div');
  mediaLayer.className = 'hero-media';
  mediaLayer.setAttribute('aria-hidden', 'true');
  if (media) mediaLayer.append(media);

  const scrim = document.createElement('div');
  scrim.className = 'hero-scrim';
  scrim.setAttribute('aria-hidden', 'true');

  const arc = document.createElement('div');
  arc.className = 'hero-arc';
  arc.setAttribute('aria-hidden', 'true');
  arc.append(svg(`
    <svg viewBox="0 0 1440 220" preserveAspectRatio="none" xmlns="${ns}">
      <defs><linearGradient id="heroArc" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="#5C1669"/><stop offset="0.55" stop-color="#971F6E"/><stop offset="1" stop-color="#AC3964"/>
      </linearGradient></defs>
      <path d="M0,220 L0,120 Q720,-40 1440,120 L1440,220 Z" fill="url(#heroArc)" opacity="0.14"/>
      <path d="M0,120 Q720,-40 1440,120" fill="none" stroke="url(#heroArc)" stroke-width="3" opacity="0.55"/>
    </svg>`));

  // ── copy ──
  const copy = document.createElement('div');
  copy.className = 'hero-copy';
  if (eyebrow) {
    const l = document.createElement('span');
    l.className = 'label';
    l.textContent = eyebrow.textContent.trim();
    copy.append(l);
  }
  if (heading) {
    const inner = heading.querySelector('h1, h2, h3') || heading;
    const h1 = document.createElement('h1');
    h1.className = 'display';
    h1.append(...inner.childNodes);
    copy.append(h1);
  }
  if (lede && lede !== eyebrow) {
    const p = document.createElement('p');
    p.className = 'lede';
    p.append(...lede.childNodes);
    copy.append(p);
  }

  // ── booking widget (fixed brand affordance) ──
  const booking = svg(`
    <div class="booking" id="booking" role="region" aria-label="Reserva">
      <div class="booking-tabs" role="tablist" aria-label="Tipo de reserva">
        <button class="booking-tab" role="tab" id="tab-hotel" aria-selected="true" aria-controls="panel-hotel">Reservar Hotel</button>
        <button class="booking-tab" role="tab" id="tab-flight" aria-selected="false" aria-controls="panel-flight">Reservar Vuelo más Hotel</button>
      </div>
      <div class="booking-body" role="tabpanel" id="panel-hotel" aria-labelledby="tab-hotel">
        <div class="booking-fields">
          <div class="field field-full">
            <span class="field-label">Destino</span>
            <span class="value">Hoteles &amp; Resorts</span>
          </div>
          <div class="field">
            <span class="field-label">Entrada</span>
            <span class="value">Selecciona fecha</span>
          </div>
          <div class="field">
            <span class="field-label">Salida</span>
            <span class="value">Selecciona fecha</span>
          </div>
          <div class="field field-full">
            <span class="field-label">Huéspedes</span>
            <span class="value">2 adultos</span>
          </div>
        </div>
        <a class="btn btn-primary" href="#booking">RESERVAR — Mejor precio garantizado</a>
        <p class="booking-guarantee">
          <span class="guarantee-icon"></span>
          Reserva en la web oficial y consigue los mejores precios.
        </p>
      </div>
    </div>`);
  booking.querySelector('.guarantee-icon').append(svg(
    `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5C1669" stroke-width="2" xmlns="${ns}"><path d="M12 2l7 3v6c0 5-3.5 8-7 9-3.5-1-7-4-7-9V5l7-3z"/><path d="M9 12l2 2 4-4"/></svg>`,
  ));

  // interactive tab state
  const tabs = [...booking.querySelectorAll('.booking-tab')];
  tabs.forEach((tab) => tab.addEventListener('click', () => {
    tabs.forEach((t) => t.setAttribute('aria-selected', 'false'));
    tab.setAttribute('aria-selected', 'true');
  }));

  const inner = document.createElement('div');
  inner.className = 'hero-inner';
  const container = document.createElement('div');
  container.className = 'container';
  container.append(copy, booking);
  inner.append(container);

  block.replaceChildren(mediaLayer, scrim, arc, inner);
}
