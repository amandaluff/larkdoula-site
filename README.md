# larkdoula.com

Plain HTML site for Lark Doula, hosted on GitHub Pages. No build step: what is in this folder is the website.

## What's here

| File | Page |
|---|---|
| `index.html` | Home |
| `about.html` | Meet Amanda (`/about`) |
| `services.html` | Services & Pricing (`/services`) |
| `nicu-doula.html` | NICU doula page (`/nicu-doula`) |
| `high-risk-pregnancy-doula.html` | High-risk pregnancy page (`/high-risk-pregnancy-doula`) |
| `resources.html` | Community Resource Guide (`/resources`) |
| `contact.html` | Contact (`/contact`) |
| `research/index.html` | Doula, PhD research library (`/research`) |
| `research/waterbirth.html`, `research/doula-evidence.html` | Articles |
| `privacy.html` | Privacy notice (`/privacy`), linked from the footer |
| `js/site.js` | Sends phone, email, call-button and form events to Google Analytics |
| `css/style.css` | All colors, fonts and layout. The palette is the list of variables at the top. |
| `images/` | Photos and logo (see `images/README.md`) |
| `home.html` | Sends the old Google Sites address `/home` to the home page |
| `404.html` | "Page not found" page |
| `sitemap.xml`, `robots.txt` | Help search engines find every page |

## Editing

- **Text, prices, resources:** open the page's `.html` file, find the text, change it, save. Comments like `<!-- To change a price… -->` mark the common spots.
- **Menu and footer** are repeated in every page, so a menu change has to be made in each file.
- **Search result text:** each page's `<title>` and `<meta name="description">` near the top are what Google shows.
- **Prices and FAQ on the Services page** also appear in the "Structured data" block near the top of `services.html`. Change both places.
- **Package prices are repeated** on `nicu-doula.html` and `high-risk-pregnancy-doula.html`, and the **hospital list** appears on those two pages and in the Services FAQ. Search all files for the old text when you change either.
- **New article:** copy `research/waterbirth.html`, edit it, add a card to `research/index.html`, and add a line to `sitemap.xml`.

## Preview on your computer

```bash
python3 preview.py
```

Then open http://localhost:8000.

## Publishing on GitHub Pages

1. Create a free GitHub account and a new **public** repository named `larkdoula-site`.
2. On the empty repository page, click **uploading an existing file**, drag in everything inside this folder, and click **Commit changes**.
3. In the repository: **Settings → Pages → Build and deployment → Source: Deploy from a branch**, choose `main` and `/ (root)`, and save.
4. After a minute or two the site is live at `https://YOUR-USERNAME.github.io/larkdoula-site/`. Check it there before touching the domain.

## Connecting www.larkdoula.com

Keep the Google Site published until the last step, so the site is never down.

1. In the repository: **Settings → Pages → Custom domain**, enter `www.larkdoula.com` and save. (GitHub adds a file named `CNAME` to the repository.)
2. At your domain registrar, change the DNS records:
   - `www` **CNAME** → `YOUR-USERNAME.github.io`
   - `@` (the bare domain) **A** records → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - Remove the old records that point to Google Sites.
3. Once GitHub shows the DNS check passed, tick **Enforce HTTPS**.
4. In Google Search Console, submit `https://www.larkdoula.com/sitemap.xml`.
