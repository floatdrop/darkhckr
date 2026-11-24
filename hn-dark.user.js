// ==UserScript==
// @name         HN Dark
// @namespace    darkhckr
// @version      1.0.0
// @description  Dark theme for Hacker News tuned for comfortable, high-contrast reading.
// @match        https://news.ycombinator.com/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  // true  = dark only when the OS/browser is in dark mode
  // false = always dark
  const FOLLOW_SYSTEM_THEME = false;

  // Inlined from extension/hn-dark.css by scripts/sync-userscript-css.mjs.
  const css = `
:root {
  --hn-bg:      #111111;  /* page edges outside the main table */
  --hn-surface: #1b1b1b;  /* main reading surface */
  --hn-header:  #262626;  /* top bar */
  --hn-raised:  #262626;  /* inputs, code blocks */
  --hn-border:  #3d3d3d;
  --hn-title:   #ecece7;  /* story titles, 14.5:1 */
  --hn-text:    #dcdcd6;  /* comment body, 12.5:1 (off-white to avoid halation) */
  --hn-muted:   #a3a39d;  /* meta: points, age, site, 6.8:1 */
  --hn-visited: #8f8f8a;  /* visited links, 5.3:1 */
  --hn-accent:  #ff7a26;  /* HN orange, lifted for dark bg, 6.6:1 */
  --hn-new-user:#6cc96c;  /* green names of new accounts, 8.4:1 */
  color-scheme: dark;     /* dark native scrollbars and form controls */
}

/* ---------- Base ---------- */
html, body {
  background: var(--hn-bg) !important;
  color: var(--hn-muted) !important;
}
#hnmain { background: var(--hn-surface) !important; }
td, .default, .title, .subtext, .subtext td, .yclinks, .comhead, .rank,
.sitebit, .sitestr, .score, .age, .navs {
  color: var(--hn-muted) !important;
}
.admin, .admin td { color: var(--hn-text) !important; }

a:link    { color: var(--hn-text) !important; }
a:visited { color: var(--hn-visited) !important; }

::selection { background: #6b3a14; color: #ffffff; }

a:focus-visible, input:focus-visible, textarea:focus-visible,
select:focus-visible, button:focus-visible {
  outline: 2px solid var(--hn-accent) !important;
  outline-offset: 1px;
}

/* ---------- Top bar ---------- */
#hnmain > tbody > tr:first-child > td {
  background: var(--hn-header) !important;
  border-bottom: 2px solid var(--hn-accent);
}
.pagetop,
.pagetop a:link, .pagetop a:visited { color: var(--hn-text) !important; }
.pagetop .hnname a:link, .pagetop .hnname a:visited { color: var(--hn-title) !important; }
.topsel a:link, .topsel a:visited { color: var(--hn-accent) !important; }
#hnmain img[src^="y18"] { border-color: var(--hn-accent) !important; }

/* Thin rule above the footer (bgcolor attribute in the markup) */
#hnmain td[bgcolor] { background: var(--hn-accent) !important; }

/* ---------- Story list ---------- */
.titleline > a:link   { color: var(--hn-title) !important; }
.titleline > a:visited{ color: var(--hn-visited) !important; }
.subtext a:link, .subtext a:visited,
.comhead a:link, .comhead a:visited,
.sitebit a:link, .sitebit a:visited,
.yclinks a:link, .yclinks a:visited,
.hnmore a:link, .hnmore a:visited { color: var(--hn-muted) !important; }
.morelink:link, .morelink:visited { color: var(--hn-title) !important; }

/* ---------- Comments & self-posts ---------- */
.commtext, .toptext,
.c00, .c00 a:link { color: var(--hn-text) !important; }
.commtext a:link, .toptext a:link { color: var(--hn-text) !important; }
.commtext a:visited, .toptext a:visited { color: var(--hn-visited) !important; }
.reply a:link, .reply a:visited { color: var(--hn-muted) !important; }

/* Downvoted comments fade toward the background, mirroring HN's own steps */
.c5a, .c5a a:link, .c5a a:visited { color: #959592 !important; }
.c73, .c73 a:link, .c73 a:visited { color: #82827f !important; }
.c82, .c82 a:link, .c82 a:visited { color: #767673 !important; }
.c88, .c88 a:link, .c88 a:visited { color: #71716f !important; }
.c9c, .c9c a:link, .c9c a:visited { color: #62625f !important; }
.cae, .cae a:link, .cae a:visited { color: #535352 !important; }
.cbe, .cbe a:link, .cbe a:visited { color: #474746 !important; }
.cce, .cce a:link, .cce a:visited { color: #3a3a39 !important; }
.cdd, .cdd a:link, .cdd a:visited { color: #2f2f2e !important; }

/* Legacy <font color> used for new-user names and the "help" link */
font[color="#3c963c" i] { color: var(--hn-new-user) !important; }
font[color="#afafaf" i] { color: var(--hn-muted) !important; }

pre {
  background: var(--hn-raised) !important;
  color: var(--hn-text) !important;
  border: 1px solid var(--hn-border);
  border-radius: 4px;
  padding: 6px 8px !important;
}
code { color: inherit !important; }

hr { border: 0; border-top: 1px solid var(--hn-border); }

/* Readability: HN's default line-height is cramped for long comments */
.commtext, .toptext { line-height: 1.45; }

/* ---------- Forms ---------- */
input:not([type="checkbox"]):not([type="radio"]), textarea, select, button {
  background: var(--hn-raised) !important;
  color: var(--hn-text) !important;
  border: 1px solid var(--hn-border) !important;
  border-radius: 3px;
}
input[type="submit"], input[type="button"], button { padding: 2px 8px; cursor: pointer; }
input[type="submit"]:hover, input[type="button"]:hover, button:hover {
  border-color: var(--hn-muted) !important;
}
input[readonly] {
  background: transparent !important;
  color: var(--hn-muted) !important;
  border: none !important;
}
`;

  const style = document.createElement('style');
  style.id = 'hn-dark';
  style.textContent = FOLLOW_SYSTEM_THEME
    ? `@media (prefers-color-scheme: dark) {${css}}`
    : css;

  // Insert as soon as the manager runs the script, without waiting for <head>.
  (document.head || document.documentElement).appendChild(style);
})();
