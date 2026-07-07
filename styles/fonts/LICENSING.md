# Font licensing — park-royalhotels-com

| file | family | license | status |
|---|---|---|---|
| open-sans-variable.woff2 | Open Sans | SIL OFL 1.1 | ✅ self-host OK (redistribution permitted) |
| montserrat-variable.woff2 | Montserrat | SIL OFL 1.1 | ✅ self-host OK (redistribution permitted) |

Both faces are SIL Open Font License 1.1 — embedding/redistribution on the served
domain is permitted, so **no pre-go-live licensing action is required**.

Latin-subset variable woff2 fetched from jsDelivr's `@fontsource-variable/*`
packages. Open Sans is the body face and carries a metric-matched `"Arial"`
fallback (`size-adjust`/`ascent`/`descent` computed from the shipped woff2) so
the first-paint → brand-font swap is zero-shift. Montserrat is used only for
small labels/buttons; its CLS impact is negligible so it falls back to plain
Arial (documented, not metric-matched).
