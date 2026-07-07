/**
 * editorial — blog rail + newsletter signup, side by side (split layout).
 *
 * Authoring rows (positional-ish, classified by content):
 *   Row 1  blog head: eyebrow <p> "Blog" + <h2> headline
 *   Row 2  blog card: <img> + <h3> title + readmore link          (repeats)
 *   Row 3  blog card: <img> + <h3> title + readmore link
 *   Row 4  blog foot: a single link → "Visita nuestro blog" button
 *   Row 5  newsletter head: <h2> headline + body <p>
 * The newsletter form (name/email/consent/submit) is a fixed brand affordance
 * reconstructed here. Blog head/foot detected structurally, not by index:
 *   - a row with a heading + NO image and NO trailing form → blog head
 *   - a row with an image → a blog card
 *   - a link-only row → blog foot
 *   - the LAST heading-bearing no-image row → newsletter head
 */

function media(el) {
  if (!el) return null;
  return el.matches('picture, img') ? el : el.querySelector('picture, img');
}

export default async function decorate(block) {
  const rows = [...block.children].map((r) => r.querySelector(':scope > div') || r);

  const cards = [];
  let blogHead = null;
  let blogFootLink = null;
  let nlHead = null;

  const headRows = [];
  rows.forEach((cell) => {
    const img = media(cell);
    const heading = cell.querySelector('h2, h3, h4');
    const link = cell.querySelector('a');
    if (img) { cards.push(cell); return; }
    if (heading) { headRows.push(cell); return; }
    if (link) { blogFootLink = link; return; }
  });
  // first heading-row = blog head (eyebrow + h2); last = newsletter head
  if (headRows.length) [blogHead] = headRows;
  if (headRows.length > 1) nlHead = headRows[headRows.length - 1];

  // ── blog column ──
  const blogCol = document.createElement('div');
  blogCol.className = 'blog-col';
  if (blogHead) {
    const eyebrow = [...blogHead.querySelectorAll('p')].find((p) => !p.querySelector('a'));
    const h = blogHead.querySelector('h2, h3');
    if (eyebrow) {
      const l = document.createElement('span');
      l.className = 'label';
      l.style.color = 'var(--secondary)';
      l.textContent = eyebrow.textContent.trim();
      blogCol.append(l);
    }
    if (h) {
      const hd = document.createElement('h2');
      hd.className = 'headline';
      hd.style.marginTop = '8px';
      hd.append(...h.childNodes);
      blogCol.append(hd);
    }
  }
  const blogGrid = document.createElement('div');
  blogGrid.className = 'blog-grid';
  cards.forEach((cell) => {
    const img = media(cell);
    const heading = cell.querySelector('h3, h4, h2');
    const link = cell.querySelector('a');
    const card = document.createElement('article');
    card.className = 'blog-card';
    if (img) {
      const m = document.createElement('div');
      m.className = 'blog-media';
      m.append(img);
      card.append(m);
    }
    const body = document.createElement('div');
    body.className = 'blog-body';
    if (heading) {
      const h = document.createElement('h3');
      h.className = 'title';
      h.append(...heading.childNodes);
      body.append(h);
    }
    if (link) { link.className = 'readmore'; body.append(link); }
    card.append(body);
    blogGrid.append(card);
  });
  blogCol.append(blogGrid);
  if (blogFootLink) {
    const foot = document.createElement('div');
    foot.style.marginTop = '26px';
    blogFootLink.className = 'btn btn-secondary';
    foot.append(blogFootLink);
    blogCol.append(foot);
  }

  // ── newsletter aside (fixed brand affordance) ──
  const aside = document.createElement('aside');
  aside.className = 'newsletter';
  if (nlHead) {
    const h = nlHead.querySelector('h2, h3');
    const p = [...nlHead.querySelectorAll('p')].find((x) => !x.querySelector('a'));
    if (h) {
      const hd = document.createElement('h2');
      hd.className = 'headline';
      hd.append(...h.childNodes);
      aside.append(hd);
    }
    if (p) {
      const para = document.createElement('p');
      para.append(...p.childNodes);
      aside.append(para);
    }
  }
  const form = document.createElement('form');
  form.addEventListener('submit', (e) => e.preventDefault());
  form.innerHTML = `
    <div class="nl-field">
      <label for="nl-name" class="label nl-label">Nombre</label>
      <input id="nl-name" type="text" autocomplete="name" placeholder="Tu nombre">
    </div>
    <div class="nl-field">
      <label for="nl-email" class="label nl-label">Email</label>
      <input id="nl-email" type="email" autocomplete="email" placeholder="tu@email.com">
    </div>
    <label class="nl-check"><input type="checkbox"> <span>He leído y acepto la <a href="/politicas-de-privacidad-park-royal.html">política de privacidad</a>.</span></label>
    <button type="submit" class="btn btn-primary">Suscribirme</button>`;
  aside.append(form);

  const container = document.createElement('div');
  container.className = 'container editorial-split';
  container.append(blogCol, aside);
  block.replaceChildren(container);
}
