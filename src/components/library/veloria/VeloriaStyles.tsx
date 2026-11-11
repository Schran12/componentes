import * as React from 'react'

const VL_CSS = `
.vl-root {
  --vl-accent: #c9a96e;
  --vl-ink: #0b1622;
  --vl-ivory: #f4efe6;
  --vl-muted: rgba(244, 239, 230, 0.72);
  --vl-panel: #0b121a;
  --vl-gutter: clamp(20px, 5.5vw, 80px);
  --vl-edge: clamp(20px, 10.4vw, 150px);
  position: relative;
  color: var(--vl-ivory);
  font-family: 'Manrope', system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
  font-size: 16px;
  line-height: 1.55;
}
.vl-root *, .vl-root *::before, .vl-root *::after { box-sizing: border-box; }
.vl-root img { display: block; max-width: 100%; }
.vl-root a { color: var(--vl-ivory); text-decoration: none; }
.vl-root a:hover { color: #e6cfa0; }
.vl-root button, .vl-root input, .vl-root select { font: inherit; }
.vl-root .vl-serif { font-family: 'Cormorant Garamond', Georgia, serif; }
.vl-root .vl-serif em { font-weight: 400; font-style: italic; }
.vl-root .vl-glass {
  background: rgba(8, 15, 22, 0.42);
  backdrop-filter: blur(18px) saturate(120%);
  -webkit-backdrop-filter: blur(18px) saturate(120%);
  border: 1px solid rgba(244, 239, 230, 0.16);
}
.vl-root .vl-tshadow { text-shadow: 0 2px 24px rgba(0, 0, 0, 0.35); }
.vl-root .vl-btn:hover { filter: brightness(1.08); }
.vl-root .vl-eyebrow {
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: var(--vl-accent);
}
.vl-root .vl-pill-btn {
  height: 54px;
  padding: 0 30px;
  display: inline-flex;
  align-items: center;
  gap: 14px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}
.vl-root .vl-pill-btn.vl-solid { background: var(--vl-accent); color: var(--vl-ink); }

.vl-root .vl-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
}
.vl-root .vl-bg video,
.vl-root .vl-bg img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.vl-root .vl-bg-scrim {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(90deg, rgba(3, 8, 13, 0.78) 0%, rgba(3, 8, 13, 0.35) 32%, rgba(3, 8, 13, 0) 55%),
    linear-gradient(0deg, rgba(3, 8, 13, 0.8) 0%, rgba(3, 8, 13, 0) 38%),
    linear-gradient(180deg, rgba(3, 8, 13, 0.55) 0%, rgba(3, 8, 13, 0) 18%);
}
.vl-root .vl-inner { position: relative; z-index: 1; }

/* header */
.vl-root .vl-header {
  position: relative;
  z-index: 30;
  height: 96px;
  padding: 0 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}
.vl-root .vl-header.is-fixed {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
}
.vl-root .vl-logo {
  height: 48px;
  padding: 0 26px;
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  font-size: 21px;
  font-weight: 500;
  letter-spacing: 0.34em;
}
.vl-root .vl-header nav {
  display: flex;
  gap: clamp(24px, 4vw, 52px);
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}
.vl-root .vl-cta {
  height: 48px;
  padding: 0 26px;
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  background: var(--vl-accent);
  color: var(--vl-ink);
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  flex-shrink: 0;
}

/* section index */
.vl-root .vl-index {
  position: absolute;
  right: 40px;
  top: 170px;
  z-index: 30;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 22px;
}
.vl-root .vl-index a {
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 24px;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.12em;
  color: rgba(244, 239, 230, 0.55);
  transition: color 0.3s;
}
.vl-root .vl-index a .vl-lbl {
  font-size: 11px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  opacity: 0;
  transform: translateX(8px);
  transition: opacity 0.3s, transform 0.3s;
}
.vl-root .vl-index a.vl-on { color: var(--vl-accent); }
.vl-root .vl-index a.vl-on .vl-lbl { opacity: 1; transform: none; }

/* screens */
.vl-root .vl-screen {
  position: relative;
  min-height: min(760px, 100svh);
}
.vl-root .vl-screen--hero { min-height: min(760px, 100svh); }

/* hero */
.vl-root .vl-hero-copy {
  position: absolute;
  left: var(--vl-gutter);
  top: clamp(140px, 22vh, 200px);
  width: min(540px, 80vw);
}
.vl-root .vl-hero-copy .vl-eyebrow { display: flex; align-items: center; gap: 14px; }
.vl-root .vl-hero-copy .vl-eyebrow i {
  width: 40px;
  height: 1px;
  background: var(--vl-accent);
  font-style: normal;
}
.vl-root .vl-hero-copy h1 {
  margin: 24px 0 0;
  font-size: clamp(56px, 6.7vw, 96px);
  font-weight: 500;
  line-height: 0.92;
  letter-spacing: -0.01em;
}
.vl-root .vl-hero-copy p {
  margin: 30px 0 0;
  max-width: 400px;
  font-size: 16px;
  line-height: 1.7;
  color: rgba(244, 239, 230, 0.88);
}
.vl-root .vl-hero-ctas { margin-top: 40px; display: flex; gap: 14px; flex-wrap: wrap; }
.vl-root .vl-hero-ctas .vl-ghost { padding: 0 12px 0 26px; font-weight: 600; }
.vl-root .vl-hero-ctas .vl-ghost b {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(244, 239, 230, 0.16);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 400;
}
.vl-root .vl-feature {
  position: absolute;
  right: var(--vl-gutter);
  bottom: 56px;
  width: min(380px, calc(100% - 2 * var(--vl-gutter)));
  padding: 28px 30px;
  border-radius: 24px;
}
.vl-root .vl-feature .vl-row { display: flex; justify-content: space-between; align-items: flex-start; }
.vl-root .vl-feature .vl-k {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgba(244, 239, 230, 0.66);
}
.vl-root .vl-feature .vl-bar {
  margin-top: 18px;
  height: 3px;
  border-radius: 3px;
  background: rgba(244, 239, 230, 0.14);
}
.vl-root .vl-feature .vl-bar i {
  display: block;
  width: 72%;
  height: 100%;
  border-radius: 3px;
  background: var(--vl-accent);
  font-style: normal;
}
.vl-root .vl-feature .vl-stats {
  margin-top: 20px;
  padding-top: 18px;
  border-top: 1px solid rgba(244, 239, 230, 0.12);
  display: flex;
  justify-content: space-between;
  gap: 8px;
}
.vl-root .vl-feature .vl-stats b { display: block; font-size: 22px; font-weight: 600; }
.vl-root .vl-feature .vl-stats small {
  font-size: 10px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: rgba(244, 239, 230, 0.6);
}
.vl-root .vl-scroll-cue {
  position: absolute;
  left: var(--vl-gutter);
  bottom: 56px;
  display: flex;
  align-items: center;
  gap: 14px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: rgba(244, 239, 230, 0.7);
}
.vl-root .vl-scroll-cue i {
  width: 1px;
  height: 40px;
  background: rgba(244, 239, 230, 0.5);
  font-style: normal;
}

/* onboard */
.vl-root .vl-fcard {
  position: absolute;
  width: clamp(220px, 20vw, 290px);
  aspect-ratio: 29 / 22;
  border-radius: 28px;
  overflow: hidden;
  border: 1px solid rgba(244, 239, 230, 0.2);
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.35);
}
.vl-root .vl-fcard img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;
}
.vl-root .vl-fcard:hover img { transform: scale(1.06); }
.vl-root .vl-fcard .vl-shade {
  position: absolute;
  inset: 0;
  background: linear-gradient(160deg, rgba(3, 8, 13, 0.55) 0%, rgba(3, 8, 13, 0) 55%);
}
.vl-root .vl-fcard .vl-t {
  position: absolute;
  left: 22px;
  top: 18px;
  font-size: 28px;
  font-weight: 500;
  line-height: 1;
  white-space: pre-line;
}
.vl-root .vl-fcard .vl-go {
  position: absolute;
  right: 16px;
  top: 16px;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.vl-root .vl-fcard-c1 { left: var(--vl-gutter); top: 14.5%; }
.vl-root .vl-fcard-c2 { left: calc(var(--vl-gutter) + 8.5vw); top: 44.5%; }
.vl-root .vl-fcard-c3 { right: var(--vl-edge); top: 14.5%; }
.vl-root .vl-fcard-c4 { right: calc(var(--vl-edge) + 8.5vw); top: 44.5%; }
.vl-root .vl-glide {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 9%;
  text-align: center;
  padding: 0 20px;
}
.vl-root .vl-glide h2 {
  margin: 0;
  font-size: clamp(64px, 7.2vw, 104px);
  font-weight: 500;
  line-height: 0.95;
}
.vl-root .vl-glide p {
  margin: 18px auto 0;
  max-width: 560px;
  font-size: 17px;
  line-height: 1.6;
  color: rgba(244, 239, 230, 0.86);
}

/* voyage */
.vl-root .vl-voyage-h {
  position: absolute;
  left: var(--vl-gutter);
  bottom: 96px;
  width: min(760px, 56vw);
}
.vl-root .vl-voyage-h .vl-line {
  width: 64px;
  height: 2px;
  background: var(--vl-accent);
  margin-bottom: 30px;
}
.vl-root .vl-voyage-h h2 {
  margin: 0;
  font-size: clamp(52px, 5.7vw, 82px);
  font-weight: 500;
  line-height: 0.98;
}
.vl-root .vl-voyage-p {
  position: absolute;
  right: var(--vl-edge);
  bottom: 104px;
  width: min(400px, 30vw);
}
.vl-root .vl-voyage-p p {
  margin: 0;
  font-size: 16px;
  line-height: 1.75;
  color: rgba(244, 239, 230, 0.88);
}
.vl-root .vl-voyage-p a {
  margin-top: 24px;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  min-height: 44px;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--vl-accent);
}

/* destinations */
.vl-root .vl-dest-h {
  position: absolute;
  left: var(--vl-gutter);
  top: 150px;
  width: min(560px, 80vw);
}
.vl-root .vl-dest-h h2 {
  margin: 18px 0 0;
  font-size: clamp(50px, 5.3vw, 76px);
  font-weight: 500;
  line-height: 0.98;
}
.vl-root .vl-tiles {
  position: absolute;
  left: var(--vl-gutter);
  right: var(--vl-edge);
  bottom: 64px;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
}
.vl-root .vl-tile {
  padding: 26px 24px;
  border-radius: 22px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  min-height: 170px;
  transition: background 0.3s;
}
.vl-root .vl-tile:hover { background: rgba(8, 15, 22, 0.62); }
.vl-root .vl-tile .vl-top {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.14em;
}
.vl-root .vl-tile .vl-top span:first-child { color: var(--vl-accent); }
.vl-root .vl-tile .vl-top span:last-child {
  color: rgba(244, 239, 230, 0.66);
  text-transform: uppercase;
}
.vl-root .vl-tile .vl-n { font-size: 32px; font-weight: 500; line-height: 1; }
.vl-root .vl-tile .vl-d { font-size: 14px; line-height: 1.55; color: rgba(244, 239, 230, 0.8); }

/* reserve */
.vl-root .vl-reserve {
  position: relative;
  margin: 0 24px;
  padding: 80px clamp(24px, 7.2vw, 104px) 40px;
  background: var(--vl-panel);
  border-radius: 32px 32px 0 0;
  border: 1px solid rgba(244, 239, 230, 0.08);
  border-bottom: 0;
  box-shadow: 0 -40px 80px rgba(0, 0, 0, 0.4);
}
.vl-root .vl-reserve-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(0, 1fr);
  gap: 72px;
  align-items: start;
}
.vl-root .vl-badge {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  height: 36px;
  padding: 0 16px;
  border-radius: 999px;
  border: 1px solid rgba(244, 239, 230, 0.14);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}
.vl-root .vl-badge i {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--vl-accent);
  font-style: normal;
}
.vl-root .vl-reserve-copy blockquote {
  margin: 28px 0 0;
  font-size: clamp(44px, 4.4vw, 64px);
  font-weight: 500;
  line-height: 1;
}
.vl-root .vl-reserve-copy p {
  margin: 28px 0 0;
  max-width: 440px;
  font-size: 16px;
  line-height: 1.7;
  color: var(--vl-muted);
}
.vl-root .vl-qf { display: flex; flex-direction: column; gap: 16px; padding-top: 8px; }
.vl-root .vl-qf .vl-ttl {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  margin-bottom: 4px;
}
.vl-root .vl-qf .vl-g2 {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}
.vl-root .vl-qf label {
  display: block;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: rgba(244, 239, 230, 0.6);
  margin-bottom: 8px;
}
.vl-root .vl-qf input,
.vl-root .vl-qf select {
  width: 100%;
  height: 52px;
  padding: 0 16px;
  background: #121b25;
  border: 1px solid rgba(244, 239, 230, 0.14);
  border-radius: 12px;
  color: var(--vl-ivory);
  font: 500 15px 'Manrope', sans-serif;
  outline: none;
}
.vl-root .vl-qf input::placeholder { color: rgba(244, 239, 230, 0.45); }
.vl-root .vl-qf input:focus,
.vl-root .vl-qf select:focus { border-color: rgba(244, 239, 230, 0.5); }
.vl-root .vl-qf .vl-send { display: flex; gap: 12px; align-items: flex-end; }
.vl-root .vl-qf .vl-send > div { flex-grow: 1; }
.vl-root .vl-qf button {
  height: 52px;
  padding: 0 28px;
  border: 0;
  border-radius: 12px;
  background: var(--vl-accent);
  color: var(--vl-ink);
  font: 700 14px 'Manrope', sans-serif;
  letter-spacing: 0.04em;
  cursor: pointer;
}
.vl-root .vl-qf .vl-legal { font-size: 12px; color: rgba(244, 239, 230, 0.55); }
.vl-root .vl-qf .vl-legal a { text-decoration: underline; color: rgba(244, 239, 230, 0.8); }
.vl-root .vl-qf .vl-ok { display: none; font-size: 14px; color: var(--vl-accent); }
.vl-root .vl-qf.vl-sent .vl-ok { display: block; }
.vl-root .vl-footer {
  margin-top: 88px;
  padding-top: 56px;
  border-top: 1px solid rgba(244, 239, 230, 0.1);
  display: grid;
  grid-template-columns: minmax(0, 2fr) repeat(3, minmax(0, 1fr));
  gap: 40px;
}
.vl-root .vl-footer .vl-brand { display: flex; align-items: center; gap: 12px; }
.vl-root .vl-footer .vl-brand span { font-size: 24px; font-weight: 500; letter-spacing: 0.3em; }
.vl-root .vl-footer .vl-about {
  margin: 16px 0 0;
  max-width: 320px;
  font-size: 14px;
  line-height: 1.7;
  color: rgba(244, 239, 230, 0.6);
}
.vl-root .vl-footer h4 {
  margin: 0 0 18px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgba(244, 239, 230, 0.5);
}
.vl-root .vl-footer .vl-col {
  display: flex;
  flex-direction: column;
  gap: 12px;
  font-size: 15px;
  color: rgba(244, 239, 230, 0.85);
}
.vl-root .vl-wordmark {
  margin-top: 40px;
  font-size: clamp(90px, 17vw, 250px);
  font-weight: 500;
  line-height: 0.8;
  letter-spacing: 0.06em;
  text-align: center;
  color: rgba(244, 239, 230, 0.05);
  white-space: nowrap;
  overflow: hidden;
}
.vl-root .vl-legalbar {
  margin-top: 24px;
  display: flex;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  font-size: 13px;
  color: rgba(244, 239, 230, 0.5);
}
.vl-root .vl-legalbar span:last-child { display: flex; gap: 28px; }
.vl-root .vl-legalbar a { color: rgba(244, 239, 230, 0.6); }

.vl-root .vl-page-demo-frame {
  width: 100%;
  height: min(100svh, 900px);
  border: 1px solid rgba(244, 239, 230, 0.12);
  border-radius: 8px;
  background: #05090e;
}

@media (max-width: 900px) {
  .vl-root .vl-header { height: 76px; padding: 0 20px; }
  .vl-root .vl-header nav,
  .vl-root .vl-index { display: none; }
  .vl-root .vl-logo { height: 42px; padding: 0 18px; font-size: 17px; }
  .vl-root .vl-cta { height: 42px; padding: 0 18px; font-size: 11px; }
  .vl-root .vl-screen {
    height: auto;
    min-height: 100vh;
    padding: 120px 20px 56px;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    gap: 24px;
  }
  .vl-root .vl-hero-copy,
  .vl-root .vl-feature,
  .vl-root .vl-scroll-cue,
  .vl-root .vl-fcard,
  .vl-root .vl-glide,
  .vl-root .vl-voyage-h,
  .vl-root .vl-voyage-p,
  .vl-root .vl-dest-h,
  .vl-root .vl-tiles {
    position: relative;
    inset: auto;
    left: auto;
    right: auto;
    top: auto;
    bottom: auto;
    width: 100%;
  }
  .vl-root .vl-scroll-cue { display: none; }
  .vl-root .vl-onboard-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    align-content: end;
    gap: 12px;
  }
  .vl-root .vl-onboard-grid .vl-fcard { position: relative; width: 100%; }
  .vl-root .vl-onboard-grid .vl-glide {
    grid-column: 1 / -1;
    order: -1;
    text-align: left;
    padding: 0;
  }
  .vl-root .vl-fcard .vl-t { font-size: 20px; }
  .vl-root .vl-tiles { grid-template-columns: minmax(0, 1fr); }
  .vl-root .vl-reserve { margin: 0; padding: 56px 20px 32px; }
  .vl-root .vl-reserve-grid,
  .vl-root .vl-footer { grid-template-columns: minmax(0, 1fr); gap: 40px; }
  .vl-root .vl-qf .vl-g2 { grid-template-columns: minmax(0, 1fr); }
  .vl-root .vl-qf .vl-send { flex-direction: column; align-items: stretch; }
}
`

export function VeloriaStyles() {
  const hoist = {
    href: 'veloria-styles',
    precedence: 'default',
  } as React.StyleHTMLAttributes<HTMLStyleElement>
  return (
    <>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400;1,500&family=Manrope:wght@400;500;600;700&display=swap"
      />
      <style {...hoist}>{VL_CSS}</style>
    </>
  )
}

export type VeloriaRootProps = {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
  /** Poster + scrim behind content (sections over the yacht). */
  scene?: boolean
  /** Looping background video (hero / full demo). */
  video?: boolean
  videoPoster?: string
}

export function VeloriaRoot({
  children,
  className,
  style,
  scene = false,
  video = false,
  videoPoster,
}: VeloriaRootProps) {
  const poster =
    videoPoster ?? 'https://thinkingods.com/demos/veloria-yacht/assets/yacht-poster.jpg'
  const showBg = scene || video

  return (
    <div
      className={['vl-root', className].filter(Boolean).join(' ')}
      style={{ background: showBg ? '#05090e' : undefined, ...style }}
    >
      <VeloriaStyles />
      {showBg ? (
        <div className="vl-bg" aria-hidden="true">
          {video ? (
            <video
              src="https://thinkingods.com/demos/veloria-yacht/assets/yacht.mp4"
              poster={poster}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
            />
          ) : (
            <img src={poster} alt="" />
          )}
          <div className="vl-bg-scrim" />
        </div>
      ) : null}
      <div className="vl-inner">{children}</div>
    </div>
  )
}
