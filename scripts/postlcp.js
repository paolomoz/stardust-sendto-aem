/*
 * postlcp.js — AuthorKit static-chrome loader (park-royalhotels-com).
 *
 * Injects the static header/footer fragments after LCP. All content for this
 * project lives under the /park-royalhotels-com/ prefix, so the fragments are
 * fetched from /park-royalhotels-com/fragments/{header,footer}.html rather than
 * the root /fragments/ path the stock runtime assumes.
 *
 * Mandatory edit (#21): set el.className = name BEFORE injecting innerHTML so the
 * fragment's own root selector (header.header / footer.footer) matches and any
 * background/padding on the fragment ROOT applies.
 */

const FRAGMENT_BASE = '/park-royalhotels-com/fragments';

async function loadStaticFragment(el, name) {
  if (!el) return;
  try {
    const resp = await fetch(`${FRAGMENT_BASE}/${name}.html`);
    if (!resp.ok) return;
    const html = await resp.text();
    el.className = name; // so header.header / footer.footer match (#21)
    el.innerHTML = html;
  } catch (e) {
    // fail quiet — chrome is progressive enhancement over server-rendered content
  }
}

export default async function postlcp() {
  await Promise.all([
    loadStaticFragment(document.querySelector('header'), 'header'),
    loadStaticFragment(document.querySelector('footer'), 'footer'),
  ]);
}
