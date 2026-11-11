import * as React from 'react'

const NM_CSS = `
/* ============================================================
   Nimbus AI — design tokens & base
   ============================================================ */
.nm-root {
  --nm-bg: #05060f;
  --nm-surface: rgba(14, 16, 32, 0.72);
  --nm-surface-solid: #0c0e1c;
  --nm-border: rgba(232, 234, 240, 0.12);
  --nm-border-bright: rgba(124, 58, 237, 0.55);
  --nm-text: #e8eaf0;
  --nm-muted: #c8cad8;
  --nm-dim: rgba(200, 202, 216, 0.62);
  --nm-violet: #7c3aed;
  --nm-cyan: #06b6d4;
  --nm-glow-v: rgba(124, 58, 237, 0.35);
  --nm-glow-c: rgba(6, 182, 212, 0.28);
  --nm-gutter: clamp(20px, 5vw, 72px);
  --nm-max: 1120px;
  --nm-radius: 16px;
  --nm-font: 'Inter', system-ui, -apple-system, sans-serif;
  --nm-mono: 'JetBrains Mono', ui-monospace, monospace;
  --nm-ease: cubic-bezier(0.22, 1, 0.36, 1);
  position: relative;
  color: var(--nm-text);
  background: var(--nm-bg);
  font-family: var(--nm-font);
  font-size: 16px;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}
.nm-root *, .nm-root *::before, .nm-root *::after { box-sizing: border-box; }
.nm-root img { display: block; max-width: 100%; }
.nm-root a { color: inherit; text-decoration: none; }
.nm-root button, .nm-root input { font: inherit; color: inherit; }
.nm-root :focus-visible {
  outline: 2px solid var(--nm-cyan);
  outline-offset: 3px;
}
.nm-root .nm-mono { font-family: var(--nm-mono); }

/* ============================================================
   Shared utilities
   ============================================================ */
.nm-root .nm-glass {
  background: var(--nm-surface);
  backdrop-filter: blur(18px) saturate(130%);
  -webkit-backdrop-filter: blur(18px) saturate(130%);
  border: 1px solid var(--nm-border);
}
.nm-root .nm-container {
  width: min(100%, var(--nm-max));
  margin-inline: auto;
  padding-inline: var(--nm-gutter);
}
.nm-root .nm-section {
  position: relative;
  padding: clamp(64px, 10vw, 112px) 0;
}
.nm-root .nm-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--nm-muted);
}
.nm-root .nm-h2 {
  margin: 12px 0 0;
  font-size: clamp(28px, 4vw, 40px);
  font-weight: 650;
  letter-spacing: -0.03em;
  line-height: 1.15;
  color: var(--nm-text);
}
.nm-root .nm-lead {
  margin: 14px 0 0;
  max-width: 52ch;
  color: var(--nm-muted);
  font-size: 17px;
}
.nm-root .nm-gradient-text {
  background: linear-gradient(115deg, var(--nm-violet), var(--nm-cyan));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
.nm-root .nm-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 46px;
  padding: 0 22px;
  border-radius: 999px;
  font-size: 14px;
  font-weight: 600;
  border: 1px solid transparent;
  cursor: pointer;
  transition: transform 0.25s var(--nm-ease), box-shadow 0.25s var(--nm-ease), background 0.25s, border-color 0.25s;
}
.nm-root .nm-btn-primary {
  background: linear-gradient(120deg, #6d28d9, #0e7490);
  color: #fff;
  box-shadow: 0 0 0 1px rgba(124, 58, 237, 0.35), 0 12px 40px var(--nm-glow-v);
}
.nm-root .nm-btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 0 0 1px rgba(6, 182, 212, 0.4), 0 16px 48px var(--nm-glow-c);
}
.nm-root .nm-btn-ghost {
  background: transparent;
  border-color: var(--nm-border);
  color: var(--nm-text);
}
.nm-root .nm-btn-ghost:hover {
  border-color: rgba(232, 234, 240, 0.28);
  background: rgba(255, 255, 255, 0.04);
}
.nm-root .nm-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 30px;
  padding: 0 12px;
  border-radius: 999px;
  border: 1px solid rgba(124, 58, 237, 0.4);
  background: rgba(124, 58, 237, 0.12);
  font-size: 12px;
  font-weight: 600;
  color: #d8c6ff;
}
.nm-root .nm-pill i {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--nm-cyan);
  box-shadow: 0 0 10px var(--nm-cyan);
}

/* ============================================================
   Page demo iframe
   ============================================================ */
.nm-root .nm-page-demo-frame {
  width: 100%;
  height: min(92vh, 1100px);
  border: 0;
  border-radius: 16px;
}

/* ============================================================
   Navbar
   ============================================================ */
.nm-root .nm-header {
  position: sticky;
  top: 0;
  z-index: 40;
  height: 68px;
  display: flex;
  align-items: center;
  transition: background 0.3s, border-color 0.3s, backdrop-filter 0.3s;
  border-bottom: 1px solid transparent;
  background: transparent;
}
.nm-root .nm-header.is-scrolled {
  background: rgba(5, 6, 15, 0.72);
  backdrop-filter: blur(16px) saturate(140%);
  -webkit-backdrop-filter: blur(16px) saturate(140%);
  border-bottom-color: var(--nm-border);
}
.nm-root .nm-header-inner {
  width: min(100%, var(--nm-max));
  margin-inline: auto;
  padding-inline: var(--nm-gutter);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}
.nm-root .nm-logo {
  font-size: 18px;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--nm-text);
}
.nm-root .nm-logo span {
  background: linear-gradient(115deg, var(--nm-violet), var(--nm-cyan));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
.nm-root .nm-nav {
  display: flex;
  align-items: center;
  gap: 28px;
  font-size: 14px;
  font-weight: 500;
  color: var(--nm-muted);
}
.nm-root .nm-nav a:hover { color: var(--nm-text); }
.nm-root .nm-nav-cta { margin-left: 8px; height: 40px; padding: 0 16px; font-size: 13px; }
.nm-root .nm-menu-btn {
  display: none;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  border: 1px solid var(--nm-border);
  background: rgba(255, 255, 255, 0.03);
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.nm-root .nm-menu-btn span,
.nm-root .nm-menu-btn span::before,
.nm-root .nm-menu-btn span::after {
  display: block;
  width: 16px;
  height: 1.5px;
  background: var(--nm-text);
  position: relative;
}
.nm-root .nm-menu-btn span::before,
.nm-root .nm-menu-btn span::after {
  content: '';
  position: absolute;
  left: 0;
}
.nm-root .nm-menu-btn span::before { top: -5px; }
.nm-root .nm-menu-btn span::after { top: 5px; }
.nm-root .nm-mobile-nav {
  display: none;
  flex-direction: column;
  gap: 4px;
  padding: 12px var(--nm-gutter) 20px;
  border-bottom: 1px solid var(--nm-border);
  background: rgba(5, 6, 15, 0.92);
}
.nm-root .nm-mobile-nav.is-open { display: flex; }
.nm-root .nm-mobile-nav a {
  padding: 12px 4px;
  color: var(--nm-muted);
  font-weight: 500;
}
.nm-root .nm-mobile-nav a:hover { color: var(--nm-text); }

/* ============================================================
   Hero + aurora + spotlight
   ============================================================ */
.nm-root .nm-hero {
  position: relative;
  overflow: hidden;
  padding: clamp(72px, 12vw, 120px) 0 clamp(56px, 8vw, 88px);
  min-height: min(88vh, 820px);
  display: flex;
  align-items: center;
}
.nm-root .nm-aurora {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
  z-index: 0;
}
.nm-root .nm-aurora-blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.55;
  will-change: transform;
}
.nm-root .nm-aurora-blob--a {
  width: min(55vw, 520px);
  height: min(55vw, 520px);
  top: -12%;
  left: -8%;
  background: var(--nm-glow-v);
  animation: nm-drift-a 18s ease-in-out infinite alternate;
}
.nm-root .nm-aurora-blob--b {
  width: min(50vw, 460px);
  height: min(50vw, 460px);
  top: 10%;
  right: -10%;
  background: var(--nm-glow-c);
  animation: nm-drift-b 22s ease-in-out infinite alternate;
}
.nm-root .nm-aurora-blob--c {
  width: min(40vw, 380px);
  height: min(40vw, 380px);
  bottom: -8%;
  left: 35%;
  background: rgba(124, 58, 237, 0.22);
  animation: nm-drift-c 26s ease-in-out infinite alternate;
}
@keyframes nm-drift-a {
  from { transform: translate(0, 0) scale(1); }
  to { transform: translate(8%, 12%) scale(1.08); }
}
@keyframes nm-drift-b {
  from { transform: translate(0, 0) scale(1); }
  to { transform: translate(-10%, 8%) scale(1.12); }
}
@keyframes nm-drift-c {
  from { transform: translate(0, 0); }
  to { transform: translate(6%, -10%); }
}
.nm-root .nm-spotlight {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 1;
  background: radial-gradient(
    420px circle at var(--nm-mx, 50%) var(--nm-my, 30%),
    rgba(6, 182, 212, 0.12),
    transparent 55%
  );
  opacity: 0;
  transition: opacity 0.4s;
}
.nm-root .nm-hero:hover .nm-spotlight { opacity: 1; }
.nm-root .nm-hero-inner {
  position: relative;
  z-index: 2;
  width: min(100%, var(--nm-max));
  margin-inline: auto;
  padding-inline: var(--nm-gutter);
  max-width: 720px;
}
.nm-root .nm-hero h1 {
  margin: 18px 0 0;
  font-size: clamp(36px, 6.2vw, 64px);
  font-weight: 700;
  letter-spacing: -0.035em;
  line-height: 1.08;
  color: var(--nm-text);
}
.nm-root .nm-hero-support {
  margin: 20px 0 0;
  max-width: 48ch;
  font-size: 18px;
  color: var(--nm-muted);
}
.nm-root .nm-hero-ctas {
  margin-top: 32px;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

/* ============================================================
   Demo chat
   ============================================================ */
.nm-root .nm-demo-card {
  border-radius: var(--nm-radius);
  padding: 8px;
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.04);
}
.nm-root .nm-demo-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px 14px;
  border-bottom: 1px solid var(--nm-border);
  color: var(--nm-dim);
  font-size: 12px;
  font-weight: 500;
}
.nm-root .nm-demo-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(232, 234, 240, 0.2);
}
.nm-root .nm-demo-dot:nth-child(1) { background: #f87171; }
.nm-root .nm-demo-dot:nth-child(2) { background: #fbbf24; }
.nm-root .nm-demo-dot:nth-child(3) { background: #34d399; }
.nm-root .nm-demo-file {
  margin-left: auto;
  font-family: var(--nm-mono);
  font-size: 11px;
  color: var(--nm-cyan);
}
.nm-root .nm-chat {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px 16px 22px;
  min-height: 220px;
}
.nm-root .nm-msg {
  max-width: 92%;
  padding: 14px 16px;
  border-radius: 14px;
  font-size: 14.5px;
  line-height: 1.55;
}
.nm-root .nm-msg--user {
  align-self: flex-end;
  background: rgba(124, 58, 237, 0.18);
  border: 1px solid rgba(124, 58, 237, 0.35);
  color: var(--nm-text);
  border-bottom-right-radius: 4px;
}
.nm-root .nm-msg--assistant {
  align-self: flex-start;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid var(--nm-border);
  color: var(--nm-muted);
  border-bottom-left-radius: 4px;
}
.nm-root .nm-msg-meta {
  margin-top: 10px;
  font-family: var(--nm-mono);
  font-size: 11px;
  color: var(--nm-cyan);
  letter-spacing: 0.02em;
}

/* ============================================================
   Capabilities grid
   ============================================================ */
.nm-root .nm-cap-grid {
  margin-top: 40px;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}
.nm-root .nm-cap-card {
  padding: 22px 20px;
  border-radius: 14px;
  background: rgba(12, 14, 28, 0.65);
  border: 1px solid var(--nm-border);
  transition: border-color 0.25s, box-shadow 0.25s, transform 0.25s var(--nm-ease);
}
.nm-root .nm-cap-card:hover {
  border-color: var(--nm-border-bright);
  box-shadow: 0 0 0 1px rgba(124, 58, 237, 0.15), 0 20px 50px rgba(0, 0, 0, 0.35);
  transform: translateY(-2px);
}
.nm-root .nm-cap-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: grid;
  place-items: center;
  background: rgba(124, 58, 237, 0.12);
  border: 1px solid rgba(124, 58, 237, 0.28);
  color: #c4b5fd;
  margin-bottom: 14px;
}
.nm-root .nm-cap-card h3 {
  margin: 0;
  font-size: 17px;
  font-weight: 650;
  letter-spacing: -0.02em;
}
.nm-root .nm-cap-card p {
  margin: 8px 0 0;
  font-size: 14.5px;
  color: var(--nm-muted);
}

/* ============================================================
   Developer / code tabs
   ============================================================ */
.nm-root .nm-dev-grid {
  margin-top: 40px;
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
  gap: clamp(24px, 4vw, 48px);
  align-items: start;
}
.nm-root .nm-code-panel {
  border-radius: var(--nm-radius);
  overflow: hidden;
  background: #080a16;
  border: 1px solid var(--nm-border);
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.4);
}
.nm-root .nm-code-tabs {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 10px 12px;
  border-bottom: 1px solid var(--nm-border);
  background: rgba(255, 255, 255, 0.02);
}
.nm-root .nm-code-tab {
  height: 34px;
  padding: 0 12px;
  border-radius: 8px;
  border: 0;
  background: transparent;
  color: var(--nm-dim);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}
.nm-root .nm-code-tab.is-active {
  background: rgba(124, 58, 237, 0.2);
  color: var(--nm-text);
}
.nm-root .nm-code-copy {
  margin-left: auto;
  height: 34px;
  padding: 0 12px;
  border-radius: 8px;
  border: 1px solid var(--nm-border);
  background: transparent;
  color: var(--nm-muted);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
}
.nm-root .nm-code-copy:hover {
  border-color: rgba(6, 182, 212, 0.45);
  color: var(--nm-text);
}
.nm-root .nm-code-body {
  margin: 0;
  padding: 20px 18px 24px;
  overflow-x: auto;
  font-family: var(--nm-mono);
  font-size: 12.5px;
  line-height: 1.65;
  color: #b8c0d9;
  white-space: pre;
}

/* ============================================================
   Use cases
   ============================================================ */
.nm-root .nm-use-grid {
  margin-top: 40px;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
}
.nm-root .nm-use-card {
  padding: 28px 24px;
  border-radius: 16px;
  min-height: 220px;
  background: linear-gradient(160deg, rgba(18, 20, 40, 0.9), rgba(8, 10, 22, 0.85));
  border: 1px solid var(--nm-border);
  transition: border-color 0.25s, box-shadow 0.25s;
}
.nm-root .nm-use-card:hover {
  border-color: rgba(6, 182, 212, 0.4);
  box-shadow: 0 0 40px rgba(6, 182, 212, 0.08);
}
.nm-root .nm-use-card .nm-eyebrow { color: var(--nm-cyan); }
.nm-root .nm-use-card h3 {
  margin: 14px 0 0;
  font-size: 22px;
  font-weight: 650;
  letter-spacing: -0.02em;
}
.nm-root .nm-use-card p {
  margin: 12px 0 0;
  color: var(--nm-muted);
  font-size: 15px;
}

/* ============================================================
   Pricing
   ============================================================ */
.nm-root .nm-price-note {
  margin: 16px 0 0;
  max-width: 62ch;
  font-size: 14px;
  color: var(--nm-dim);
}
.nm-root .nm-price-grid {
  margin-top: 36px;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}
.nm-root .nm-price-card {
  padding: 28px 24px;
  border-radius: 16px;
  background: rgba(12, 14, 28, 0.75);
  border: 1px solid var(--nm-border);
  display: flex;
  flex-direction: column;
}
.nm-root .nm-price-card.is-hot {
  border-color: rgba(124, 58, 237, 0.55);
  box-shadow: 0 0 0 1px rgba(124, 58, 237, 0.2), 0 24px 60px rgba(124, 58, 237, 0.12);
  background: linear-gradient(180deg, rgba(124, 58, 237, 0.14), rgba(12, 14, 28, 0.9));
}
.nm-root .nm-price-card h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 650;
}
.nm-root .nm-price-amount {
  margin-top: 14px;
  font-size: 36px;
  font-weight: 700;
  letter-spacing: -0.03em;
  line-height: 1;
}
.nm-root .nm-price-amount small {
  font-size: 14px;
  font-weight: 500;
  color: var(--nm-dim);
  margin-left: 4px;
}
.nm-root .nm-price-blurb {
  margin: 10px 0 0;
  font-size: 14px;
  color: var(--nm-muted);
}
.nm-root .nm-price-list {
  margin: 22px 0 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1;
}
.nm-root .nm-price-list li {
  display: flex;
  gap: 10px;
  align-items: flex-start;
  font-size: 14px;
  color: var(--nm-muted);
}
.nm-root .nm-price-list li::before {
  content: '';
  width: 6px;
  height: 6px;
  margin-top: 7px;
  border-radius: 50%;
  background: var(--nm-cyan);
  box-shadow: 0 0 8px var(--nm-cyan);
  flex-shrink: 0;
}
.nm-root .nm-price-card .nm-btn {
  margin-top: 28px;
  width: 100%;
}

/* ============================================================
   CTA band
   ============================================================ */
.nm-root .nm-cta-band {
  text-align: center;
  padding: clamp(56px, 8vw, 88px) var(--nm-gutter);
  border-radius: 20px;
  border: 1px solid var(--nm-border);
  background:
    radial-gradient(ellipse at 30% 0%, rgba(124, 58, 237, 0.22), transparent 55%),
    radial-gradient(ellipse at 80% 100%, rgba(6, 182, 212, 0.16), transparent 50%),
    rgba(10, 12, 24, 0.85);
}
.nm-root .nm-cta-band h2 {
  margin: 0;
  font-size: clamp(26px, 4vw, 36px);
  font-weight: 700;
  letter-spacing: -0.03em;
}
.nm-root .nm-cta-band p {
  margin: 12px auto 0;
  max-width: 40ch;
  color: var(--nm-muted);
}
.nm-root .nm-cta-band .nm-btn { margin-top: 24px; }

/* ============================================================
   Footer
   ============================================================ */
.nm-root .nm-footer {
  border-top: 1px solid var(--nm-border);
  padding: 36px 0 48px;
}
.nm-root .nm-footer-inner {
  width: min(100%, var(--nm-max));
  margin-inline: auto;
  padding-inline: var(--nm-gutter);
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}
.nm-root .nm-footer-brand {
  font-weight: 700;
  letter-spacing: -0.02em;
}
.nm-root .nm-footer-links {
  display: flex;
  flex-wrap: wrap;
  gap: 18px;
  font-size: 14px;
  color: var(--nm-dim);
}
.nm-root .nm-footer-links a:hover { color: var(--nm-text); }
.nm-root .nm-footer-copy {
  width: 100%;
  margin-top: 8px;
  font-size: 13px;
  color: var(--nm-dim);
}

/* ============================================================
   Full page shell
   ============================================================ */
.nm-root.nm-page {
  min-height: 100%;
  overflow-x: clip;
}

/* ============================================================
   Reduced motion
   ============================================================ */
@media (prefers-reduced-motion: reduce) {
  .nm-root .nm-aurora-blob,
  .nm-root .nm-btn,
  .nm-root .nm-cap-card,
  .nm-root .nm-use-card,
  .nm-root .nm-spotlight {
    animation: none !important;
    transition: none !important;
  }
  .nm-root .nm-cap-card:hover,
  .nm-root .nm-btn-primary:hover {
    transform: none;
  }
  .nm-root .nm-spotlight { display: none; }
}

/* ============================================================
   Responsive — 1200 / 768
   ============================================================ */
@media (max-width: 1200px) {
  .nm-root .nm-cap-grid,
  .nm-root .nm-use-grid,
  .nm-root .nm-price-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .nm-root .nm-dev-grid {
    grid-template-columns: minmax(0, 1fr);
  }
}

@media (max-width: 768px) {
  .nm-root .nm-nav { display: none; }
  .nm-root .nm-menu-btn { display: inline-flex; }
  .nm-root .nm-cap-grid,
  .nm-root .nm-use-grid,
  .nm-root .nm-price-grid {
    grid-template-columns: minmax(0, 1fr);
  }
  .nm-root .nm-hero h1 { font-size: clamp(32px, 9vw, 44px); }
  .nm-root .nm-footer-inner { flex-direction: column; align-items: flex-start; }
}
`

export function NimbusStyles() {
  const hoist = {
    href: 'nimbus-styles',
    precedence: 'default',
  } as React.StyleHTMLAttributes<HTMLStyleElement>
  return (
    <>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap"
      />
      <style {...hoist}>{NM_CSS}</style>
    </>
  )
}

export type NimbusRootProps = {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

export function NimbusRoot({ children, className, style }: NimbusRootProps) {
  return (
    <div className={['nm-root', className].filter(Boolean).join(' ')} style={style}>
      <NimbusStyles />
      {children}
    </div>
  )
}
