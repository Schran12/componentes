import * as React from 'react'

const HL_CSS = `
.hl-root {
  --paper: #eceef2;
  --ink: #16141a;
  --mute: #6a6773;
  --line: rgba(22, 20, 26, 0.16);
  --cobalt: #2b3fd6;
  --marigold: #f0a21a;
  --orchid: #c2378a;
  --lagoon: #13807a;
  --f-display: "Bodoni Moda", "Didot", "Bodoni 72", Georgia, serif;
  --f-cond: "Archivo", "Helvetica Neue", Arial, sans-serif;
  --f-sans: Georgia, "Times New Roman", serif;
  --f-mono: "IBM Plex Mono", ui-monospace, monospace;
  --gutter: clamp(16px, 4vw, 56px);
  --ease: cubic-bezier(0.22, 1, 0.36, 1);
  --nav-h: 64px;
  color: var(--ink);
  font-family: var(--f-sans);
  font-size: 17px;
  line-height: 1.55;
  -webkit-font-smoothing: antialiased;
}
.hl-root *, .hl-root *::before, .hl-root *::after { box-sizing: border-box; }
.hl-root img, .hl-root video { display: block; max-width: 100%; }
.hl-root a { color: inherit; text-decoration: none; }
.hl-root button { cursor: pointer; border: none; background: none; font: inherit; color: inherit; }
.hl-root .t-display { font-family: var(--f-display); font-style: italic; }
.hl-root .t-cond {
  font-family: var(--f-cond);
  font-variation-settings: "wdth" 62;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  line-height: 0.95;
}
.hl-root .t-mono {
  font-family: var(--f-mono);
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}
.hl-root .t-price {
  font-family: var(--f-mono);
  font-size: 11px;
  letter-spacing: 0.08em;
}
.hl-root .hl-media-fallback {
  background: var(--fb, var(--cobalt));
  display: flex;
  align-items: flex-end;
  padding: 0.75rem;
  color: rgba(255, 255, 255, 0.85);
  font-family: var(--f-mono);
  font-size: 9px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  width: 100%;
  height: 100%;
  min-height: inherit;
}
.hl-root .hl-section { padding: clamp(3rem, 10vw, 7rem) var(--gutter); background: var(--paper); }
.hl-root .hl-section-head { max-width: 18ch; margin-bottom: clamp(2rem, 5vw, 3.5rem); }
.hl-root .hl-section-head h2 {
  font-family: var(--f-cond);
  font-variation-settings: "wdth" 70;
  font-size: clamp(1.75rem, 5vw, 3rem);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin: 0 0 0.75rem;
  font-weight: 600;
}
.hl-root .hl-section-head h2 em {
  font-family: var(--f-display);
  font-style: italic;
  text-transform: none;
  letter-spacing: 0;
}
.hl-root .hl-nav {
  position: relative;
  z-index: 900;
  height: var(--nav-h);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--gutter);
  transition: background 0.45s var(--ease), border-color 0.45s, color 0.45s;
  border-bottom: 1px solid transparent;
  background: transparent;
}
.hl-root .hl-nav.is-fixed {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
}
.hl-root .hl-nav.is-solid {
  background: var(--paper);
  border-bottom-color: var(--line);
}
.hl-root .hl-nav.is-over-dark { color: #fff; }
.hl-root .hl-nav.is-over-dark.is-solid { color: var(--ink); }
.hl-root .hl-wordmark {
  font-size: clamp(1.1rem, 2.5vw, 1.35rem);
  display: flex;
  align-items: baseline;
  gap: 0.05em;
}
.hl-root .hl-wordmark .hue {
  font-family: var(--f-cond);
  font-variation-settings: "wdth" 62;
  letter-spacing: 0.08em;
}
.hl-root .hl-wordmark .line { font-family: var(--f-display); font-style: italic; }
.hl-root .hl-nav-links { display: none; gap: 1.75rem; }
.hl-root .hl-nav-links a {
  font-family: var(--f-mono);
  font-size: 10px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}
.hl-root .hl-nav-actions { display: flex; align-items: center; gap: 0.75rem; }
.hl-root .hl-nav-btn {
  font-family: var(--f-mono);
  font-size: 10px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 0.35rem 0.5rem;
  position: relative;
}
.hl-root .hl-nav-btn .hl-badge {
  position: absolute;
  top: -2px;
  right: -2px;
  min-width: 16px;
  height: 16px;
  padding: 0 4px;
  border-radius: 999px;
  background: var(--orchid);
  color: #fff;
  font-size: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
}
@media (min-width: 900px) { .hl-root .hl-nav-links { display: flex; } }
.hl-root .hl-hero { position: relative; height: 100svh; overflow: hidden; background: var(--ink); }
.hl-root .hl-hero-pin { height: 100svh; position: relative; }
.hl-root .hl-hero-media {
  position: absolute;
  inset: 0;
  z-index: 1;
  overflow: hidden;
  clip-path: inset(18% 26% round 6px);
}
.hl-root .hl-hero-media video,
.hl-root .hl-hero-media img,
.hl-root .hl-hero-fallback {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.hl-root .hl-hero-fallback {
  position: absolute;
  inset: 0;
  background: linear-gradient(145deg, var(--cobalt), var(--orchid));
}
.hl-root .hl-hero-content {
  position: relative;
  z-index: 3;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: calc(var(--nav-h) + 24px) var(--gutter) var(--gutter);
  color: #fff;
  text-shadow: 0 1px 24px rgba(0, 0, 0, 0.35);
}
.hl-root .hl-hero-eyebrow { margin-bottom: 1.5rem; opacity: 0.9; }
.hl-root .hl-hero-title { font-size: clamp(2.4rem, 11vw, 7rem); margin: 0; }
.hl-root .hl-hero-title .colour {
  font-family: var(--f-display);
  font-style: italic;
  color: var(--marigold);
  text-transform: lowercase;
  font-size: 1.05em;
  display: block;
}
.hl-root .hl-hero-foot {
  margin-top: auto;
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 1.5rem;
  align-items: end;
}
.hl-root .hl-hero-copy { max-width: 28ch; font-size: 0.95rem; line-height: 1.5; margin: 0; }
.hl-root .hl-hero-actions {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 1.25rem;
}
.hl-root .hl-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.65rem 1.25rem;
  border-radius: 999px;
  background: #fff;
  color: var(--ink);
  font-family: var(--f-mono);
  font-size: 10px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}
.hl-root .hl-scroll-cue {
  writing-mode: vertical-rl;
  font-family: var(--f-mono);
  font-size: 9px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  opacity: 0.7;
}
.hl-root .hl-arches {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: clamp(8px, 1.5vw, 16px);
}
.hl-root .hl-arch {
  position: relative;
  aspect-ratio: 3/5;
  border-radius: 200px 200px 6px 6px;
  overflow: hidden;
}
.hl-root .hl-arch img,
.hl-root .hl-arch .hl-media-fallback {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.hl-root .hl-arch-cap {
  position: absolute;
  inset: auto 0 0;
  padding: 1rem;
  background: linear-gradient(transparent, rgba(22, 20, 26, 0.65));
  color: #fff;
}
@media (max-width: 1100px) { .hl-root .hl-arches { grid-template-columns: repeat(3, 1fr); } }
@media (max-width: 700px) { .hl-root .hl-arches { grid-template-columns: repeat(2, 1fr); } }
.hl-root .hl-rails { display: flex; flex-direction: column; gap: 2.5rem; }
.hl-root .hl-rail-head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 0.75rem;
}
.hl-root .hl-rail-track-wrap {
  overflow-x: auto;
  margin-inline: calc(var(--gutter) * -1);
  padding-inline: var(--gutter);
  scrollbar-width: thin;
}
.hl-root .hl-rail-track { display: flex; gap: 1rem; width: max-content; padding-bottom: 0.5rem; }
.hl-root .hl-card {
  flex: 0 0 clamp(200px, 22vw, 260px);
  border: 1px solid var(--line);
  border-radius: 12px;
  overflow: hidden;
  background: var(--paper);
  text-align: left;
}
.hl-root .hl-card-media { position: relative; aspect-ratio: 3/4; overflow: hidden; }
.hl-root .hl-card-media img,
.hl-root .hl-card-media .hl-media-fallback {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.hl-root .hl-card-body { padding: 0.85rem 1rem 1rem; }
.hl-root .hl-card-name {
  font-family: var(--f-cond);
  font-size: 0.85rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  margin: 0 0 0.25rem;
}
.hl-root .hl-card-fabric { font-size: 0.8rem; color: var(--mute); margin: 0 0 0.5rem; }
.hl-root .hl-card-meta { display: flex; justify-content: space-between; align-items: center; }
.hl-root .hl-dye-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--dot, var(--cobalt));
  border: 1px solid rgba(22, 20, 26, 0.12);
}
.hl-root .hl-lookbook-scroll {
  display: flex;
  gap: 0;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scrollbar-width: thin;
}
.hl-root .hl-look-panel {
  min-width: min(100%, 720px);
  flex: 0 0 100%;
  scroll-snap-align: start;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--gutter);
  padding: 2rem var(--gutter);
  align-items: center;
  background: var(--paper);
}
.hl-root .hl-look-num {
  font-family: var(--f-display);
  font-style: italic;
  font-size: clamp(4rem, 15vw, 9rem);
  line-height: 0.85;
  margin: 0;
  color: var(--mute);
}
.hl-root .hl-look-frame { border-radius: 12px; overflow: hidden; }
.hl-root .hl-look-frame img,
.hl-root .hl-look-frame .hl-media-fallback {
  width: 100%;
  aspect-ratio: 4/5;
  object-fit: cover;
}
@media (max-width: 700px) {
  .hl-root .hl-look-panel { grid-template-columns: 1fr; min-width: 100%; }
}
.hl-root .hl-colour-story {
  transition: background 0.6s var(--ease), color 0.6s var(--ease);
}
.hl-root .hl-colour-sticky { padding-block: 1rem 2rem; }
.hl-root .hl-colour-roll-inner {
  font-family: var(--f-display);
  font-style: italic;
  font-size: clamp(2.5rem, 10vw, 5rem);
  line-height: 1;
  margin: 0;
}
.hl-root .hl-colour-recipe {
  font-family: var(--f-mono);
  font-size: 10px;
  letter-spacing: 0.1em;
  margin-top: 0.5rem;
  opacity: 0.85;
}
.hl-root .hl-swatches {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1px;
  background: var(--line);
  border: 1px solid var(--line);
  border-radius: 12px;
  overflow: hidden;
}
.hl-root .hl-swatch {
  min-height: 320px;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  cursor: pointer;
  border: none;
  text-align: left;
  transition: outline 0.2s;
}
.hl-root .hl-swatch.is-active { outline: 2px solid var(--ink); outline-offset: -2px; }
.hl-root .hl-swatch-photo { flex: 1; border-radius: 8px; overflow: hidden; min-height: 120px; }
.hl-root .hl-swatch-photo img,
.hl-root .hl-swatch-photo .hl-media-fallback {
  width: 100%;
  height: 100%;
  object-fit: cover;
  min-height: 120px;
}
.hl-root .hl-swatch-notes { font-size: 0.75rem; opacity: 0.9; line-height: 1.45; margin: 0; }
@media (max-width: 900px) { .hl-root .hl-swatches { grid-template-columns: 1fr 1fr; } }
@media (max-width: 700px) { .hl-root .hl-swatches { grid-template-columns: 1fr; } }
.hl-root .hl-shop-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}
.hl-root .hl-shop-tabs { display: flex; flex-wrap: wrap; gap: 0.35rem; }
.hl-root .hl-shop-tab {
  font-family: var(--f-mono);
  font-size: 10px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 0.4rem 0.75rem;
  border: 1px solid var(--line);
  border-radius: 999px;
}
.hl-root .hl-shop-tab.is-active { background: var(--ink); color: var(--paper); }
.hl-root .hl-shop-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
  font-family: var(--f-mono);
  font-size: 10px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}
.hl-root .hl-shop-meta select {
  margin-left: 0.35rem;
  border: 1px solid var(--line);
  border-radius: 4px;
  padding: 0.25rem 0.5rem;
  background: var(--paper);
}
.hl-root .hl-shop-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
}
.hl-root .hl-shop-grid .hl-card { flex: none; width: 100%; }
@media (max-width: 1100px) { .hl-root .hl-shop-grid { grid-template-columns: repeat(3, 1fr); } }
@media (max-width: 700px) { .hl-root .hl-shop-grid { grid-template-columns: repeat(2, 1fr); } }
.hl-root .hl-atelier-grid {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: var(--gutter);
  align-items: end;
}
.hl-root .hl-atelier-photo { border-radius: 12px; overflow: hidden; }
.hl-root .hl-atelier-photo img,
.hl-root .hl-atelier-photo .hl-media-fallback {
  width: 100%;
  aspect-ratio: 4/5;
  object-fit: cover;
}
.hl-root .hl-stats { display: grid; gap: 1.5rem; }
.hl-root .hl-stat-num {
  font-family: var(--f-display);
  font-style: italic;
  font-size: clamp(2.5rem, 6vw, 4rem);
  line-height: 1;
  margin: 0;
}
.hl-root .hl-stat-label { font-size: 0.95rem; color: var(--mute); max-width: 28ch; margin: 0; }
@media (max-width: 800px) { .hl-root .hl-atelier-grid { grid-template-columns: 1fr; } }
.hl-root .hl-footer {
  border-top: 1px solid var(--line);
  padding: clamp(3rem, 8vw, 5rem) var(--gutter) 2rem;
  background: var(--paper);
}
.hl-root .hl-footer-top {
  display: grid;
  grid-template-columns: 1.2fr repeat(3, 1fr);
  gap: 2rem;
  margin-bottom: 3rem;
}
.hl-root .hl-footer-mark { font-size: clamp(2rem, 6vw, 3.5rem); }
.hl-root .hl-footer-col h3 {
  font-family: var(--f-mono);
  font-size: 10px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  margin: 0 0 1rem;
}
.hl-root .hl-footer-col ul {
  list-style: none;
  margin: 0;
  padding: 0;
  font-size: 0.9rem;
}
.hl-root .hl-footer-col li + li { margin-top: 0.45rem; }
.hl-root .hl-newsletter { display: flex; gap: 0.5rem; margin-top: 0.75rem; flex-wrap: wrap; }
.hl-root .hl-newsletter input {
  flex: 1;
  min-width: 140px;
  border: 1px solid var(--line);
  border-radius: 999px;
  padding: 0.55rem 1rem;
  background: transparent;
}
.hl-root .hl-newsletter button {
  font-family: var(--f-mono);
  font-size: 10px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 0.55rem 1rem;
  border-radius: 999px;
  background: var(--ink);
  color: var(--paper);
}
.hl-root .hl-footer-small {
  font-family: var(--f-mono);
  font-size: 9px;
  letter-spacing: 0.08em;
  color: var(--mute);
  border-top: 1px solid var(--line);
  padding-top: 1.5rem;
}
@media (max-width: 800px) { .hl-root .hl-footer-top { grid-template-columns: 1fr 1fr; } }
.hl-root .hl-page-demo-frame {
  width: 100%;
  height: min(100svh, 900px);
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--paper);
}
`

export function HuelineStyles() {
  const hoist = {
    href: 'hueline-styles',
    precedence: 'default',
  } as React.StyleHTMLAttributes<HTMLStyleElement>
  return (
    <>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,300..900&family=Bodoni+Moda:ital,opsz,wght@0,6..96,400..800;1,6..96,400..800&family=IBM+Plex+Mono:wght@400;500&display=swap"
      />
      <style {...hoist}>{HL_CSS}</style>
    </>
  )
}

export type HuelineRootProps = {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

export function HuelineRoot({ children, className, style }: HuelineRootProps) {
  return (
    <div className={['hl-root', className].filter(Boolean).join(' ')} style={style}>
      <HuelineStyles />
      {children}
    </div>
  )
}
