# Veltro Digital Website

> **We Build • We Innovate • We Grow**

The marketing website for [Veltro Digital](https://www.veltrodigital.co.uk) — a North West web design service built for small businesses. Five pages of static HTML/CSS with a serverless contact form backend, deployed on Vercel.

---

## Pages

| File | Description |
|------|-------------|
| `index.html` | Homepage — hero, services overview, pricing snapshot, and CTA |
| `about.html` | About page — brand story, values, and who we work with |
| `services.html` | Full services and pricing breakdown |
| `portfolio.html` | Client work showcase |
| `contact.html` | Contact form wired to the serverless email handler |

---

## Tech Stack

- **Frontend** — plain HTML, CSS, and JavaScript (no framework)
- **Contact form backend** — `api/contact.js`, a Node.js serverless function using [Nodemailer](https://nodemailer.com/) to forward enquiries via SMTP
- **Deployment** — [Vercel](https://vercel.com) (configured via `vercel.json`; the repo root is the output directory)

---

## Project Structure

```
veltro-digital-website/
├── index.html
├── about.html
├── services.html
├── portfolio.html
├── contact.html
├── assets/           # CSS, JS, images, and fonts
├── api/
│   └── contact.js    # Serverless contact form handler (Nodemailer)
├── package.json
├── vercel.json
└── .env.example
```

---

## Local Development

1. **Clone the repo**

   ```bash
   git clone https://github.com/Vinniexx007/veltro-digital-website.git
   cd veltro-digital-website
   ```

2. **Install dependencies** (only needed for the serverless function)

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Copy `.env.example` to `.env.local` and fill in your values:

   ```bash
   cp .env.example .env.local
   ```

   | Variable | Description |
   |----------|-------------|
   | `PORT` | Local dev server port (default `3000`) |
   | `OWNER_EMAIL` | Address that receives contact form submissions |
   | `FROM_EMAIL` | Sender address shown on outbound emails |
   | `SMTP_HOST` | Your SMTP provider hostname |
   | `SMTP_PORT` | SMTP port (typically `587` for TLS) |
   | `SMTP_SECURE` | `true` for port 465, `false` for STARTTLS |
   | `SMTP_USER` | SMTP authentication username |
   | `SMTP_PASS` | SMTP authentication password |

4. **Run locally with the Vercel CLI** (recommended — runs the serverless function too)

   ```bash
   npx vercel dev
   ```

   Or open `index.html` directly in a browser if you only need to work on the static HTML/CSS — the contact form won't work without the serverless function running.

---

## Deployment

The site is deployed automatically on every push to `main` via Vercel. No build step is required — the repo root is served directly.

To deploy manually:

```bash
npx vercel --prod
```

Add the environment variables listed above in your Vercel project settings under **Settings → Environment Variables**.

---

## Brand

| Token | Value |
|-------|-------|
| Deep Navy | `#0F1F3D` |
| Electric Blue | `#378ADD` |
| Light Grey | `#F5F7FA` |
| White | `#FFFFFF` |
| Amber | `#EF9F27` |

Logo assets, brand board, and social banner are in the separate brand assets pack.

---

## Contact

- **Email:** hello@veltrodigital.co.uk
- **WhatsApp:** +44 7424 158513
- **Website:** [veltrodigital.co.uk](https://www.veltrodigital.co.uk)
- **X / Twitter:** [@veltrodigital](https://x.com/veltrodigital)
