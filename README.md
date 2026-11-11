# larkdoula.com

Plain HTML site for Lark Doula, hosted on GitHub Pages. No build step: what is in this folder is the website.

## What's here

| File | Page |
|---|---|
| `index.html` | Home, including the Meet Amanda section (`/#about`) |
| `services.html` | Services & Pricing (`/services`) |
| `nicu-doula.html` | NICU doula page (`/nicu-doula`) |
| `high-risk-pregnancy-doula.html` | High-risk pregnancy page (`/high-risk-pregnancy-doula`) |
| `resources.html` | Community Resource Guide (`/resources`) |
| `contact.html` | Contact (`/contact`): the booking calendar (a Google Calendar appointment schedule embedded at `#book`), email and phone, and the message form |
| `studies.html` | Studies from My Posts (`/studies`): the studies cited in Instagram and Facebook posts, linked from the Instagram bio. Not in the menu or footer. Newest first; each entry has the post's first image (400 px square, `images/study-*.jpg`) |
| `research/index.html` | Doula, PhD research library (`/research`) |
| `research/waterbirth.html`, `research/doula-evidence.html` | Articles |
| `privacy.html` | Privacy notice (`/privacy`), linked from the footer |
| `js/site.js` | Sends phone, email, Reach Out, Book a Free Call, and message-form events to Google Analytics |
| `css/style.css` | All colors, fonts and layout. The palette is the list of variables at the top. |
| `images/` | Photos and logo (see `images/README.md`) |
| `home.html` | Sends the old Google Sites address `/home` to the home page |
| `about.html` | Sends the old address `/about` to the Meet Amanda section of the home page |
| `milwaukee-resources.html` | Sends the old Google Sites address `/milwaukee-resources` to the Resource Guide |
| `404.html` | "Page not found" page |
| `sitemap.xml`, `robots.txt` | Help search engines find every page |

## Editing

- **Text, prices, resources:** open the page's `.html` file, find the text, change it, save. Comments like `<!-- To change a price… -->` mark the common spots.
- **After changing `css/style.css` or `js/site.js`:** raise the `?v=36` number on the two lines that load them near the top of every page (search all files for `?v=`). Otherwise returning visitors may briefly see the old styling.
- **Menu and footer** are repeated in every page, so a menu change has to be made in each file. The menu is Home, Meet Amanda, Services, NICU Support, Resources; the Contact button sits on its own in the header's top corner (`header-contact`), not in the menu list. The page you're on gets `aria-current="page"` on its menu link (or on the Contact button, on the Contact page).
- **Google Analytics and the Meta Pixel** (Pixel added 2026-10-18, ID 28181774864834951; tracks page views only) load after the page has appeared, from one small loader script just above `</head>` in every page; the `gtag` setup lines stay in the GA block so events from `js/site.js` queue until GA arrives. Moved there 2026-10-28 because both scripts were slowing the first photo on phones (PageSpeed mobile 66). The loader skips both scripts for automated browsers (`navigator.webdriver`, or a user agent naming HeadlessChrome, Lighthouse, bot, crawl, or spider), so data-center bots such as Council Bluffs aren't counted (added 2026-11-02). The Pixel's noscript image fallback was left out (it needs an `img` with no real alt text). The privacy notice describes both; keep them in step. New pages need the GA block and the loader.
- **Home page photos** use `<picture>` with phone-sized WebP and JPG copies (`amanda-portrait-480`, `-900.webp`; `amanda-seated-480`, `-721.webp`). If a photo is replaced, remake its copies.
- **Search result text:** each page's `<title>` and `<meta name="description">` near the top are what Google shows.
- **Prices and FAQ on the Services page** also appear in the "Structured data" block near the top of `services.html`. Change both places.
- **Package prices appear only on `services.html`** (in the page and its structured-data block). The high-risk page links to Services instead of repeating them. NICU support shows one starting price ("From $270") on `services.html` only; the NICU page carries no prices. The **hospital list** appears on `nicu-doula.html`, `high-risk-pregnancy-doula.html`, and in the Services FAQ. Search all files for the old text when you change either.
- **Text sizes (2026-10-28):** the "Type scale" block at the end of `css/style.css` sets every text size. Use one of its six sizes (label, small, body, nav, h3, h2) instead of adding a new size; menu links stay one step larger than body text.
- **Style notes (2026-10-28):** `.package-note` is the bordered note in a Services package column ("None of these fit?"); `.package-fit` is an old style for a small italic note in a package card (no longer used; package intros are plain paragraphs under the heading). `.faq-label` is the small heading inside an FAQ answer. `.cred-list` is the credentials list in the home page's Meet Amanda card. Bands (`.band`) use the lighter green so they don't run into the dark-green footer. In the Resource Guide, every other category (`.resource-group`) gets a full-width sand background automatically, so new sections need no extra class.
- **New article:** copy `research/waterbirth.html`, edit it, add a card to `research/index.html`, and add a line to `sitemap.xml`.

## Preview on your computer

```bash
python3 preview.py
```

Then open http://localhost:8000.

GitHub Pages serves `main` at www.larkdoula.com (custom domain set in the repository's Pages settings; `CNAME` holds it). Anything merged to `main` is live within a few minutes.
