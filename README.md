# darkhckr

Dark theme for [Hacker News](https://news.ycombinator.com), tuned for comfortable, high-contrast reading.

![Hacker News front page with darkhckr](screenshot.png)

- Off-white text on dark gray: titles 14.5:1, comments 12.5:1, meta 6.8:1, visited links 5.3:1 (all pass WCAG AA)
- The Chromium extension applies CSS before the page renders, so HN doesn't briefly render in light mode
- Downvoted comments still fade, toward the background, at about the same steps as stock HN
- Styles inputs, code blocks, the top bar, and the footer; native scrollbars and controls go dark too

## Install

### Extension (Chrome and Chromium)

1. [Download and unzip the repository](https://github.com/floatdrop/darkhckr/archive/refs/heads/main.zip), or clone it.
2. Open `chrome://extensions` and enable **Developer mode**.
3. Click **Load unpacked** and select the repository's `extension/` folder.
4. Disable the HN Dark userscript if installed, then reload Hacker News.

The extension loads the stylesheet without JavaScript. It can't change a blank loading screen drawn by the browser before Hacker News renders.

### Userscript

1. Install a userscript manager: [Violentmonkey](https://violentmonkey.github.io/), [Tampermonkey](https://www.tampermonkey.net/), or [Userscripts](https://github.com/quoid/userscripts) for Safari.
2. Open [`hn-dark.user.js`](https://github.com/floatdrop/darkhckr/raw/main/hn-dark.user.js). Your manager will offer to install it.

The userscript requests `document-start`, but may still flash if the manager injects it after the first paint.

## Userscript options

At the top of the script:

- `FOLLOW_SYSTEM_THEME = true` turns the theme on only when your OS or browser is in dark mode.
- The `--hn-*` CSS variables control the main palette.

## Development

Edit [`extension/hn-dark.css`](extension/hn-dark.css), then run `node scripts/sync-userscript-css.mjs` to update the userscript's inline copy. Pass `--check` to verify the copies match without writing changes.
