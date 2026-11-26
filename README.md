# Camélia Saboaria Artesanal

Next.js 15 site for Camélia Saboaria Artesanal.

## Local development

```bash
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Navigation regression checks

Run `npx playwright install chromium` once, then run `npm run test:e2e` to verify
hash destinations, product information links, footer navigation, and shared
catalog/contact actions on desktop and mobile. Tests use a local server on port
3100 and intercept WhatsApp navigation. The catalog URL is configured in
`src/lib/contact.ts`.

## Cloudflare deployment

The site deploys to **Cloudflare Workers** through the OpenNext Cloudflare
adapter. Workers is the appropriate runtime for this Next.js App Router site:
it supports server-rendered Next.js output and the built-in `next/image`
optimizer, while Cloudflare Pages' static hosting would require changing image
handling or exporting a static-only site.
The Worker binds Cloudflare Images as `IMAGES` so Next.js image requests use
Cloudflare's image optimization API; confirm Cloudflare Images is enabled on
the account before production deployment.

Install dependencies, then run `npm run cf:build` to compile the Worker. Run
`npm run cf:preview` to serve the built app locally in the Workers runtime, or
`npm run cf:deploy` to publish the production Worker. Wrangler configuration is
in `wrangler.jsonc`; OpenNext settings are in `open-next.config.ts`.

GitHub Actions creates one `camelia-website-pr-<number>` Worker for every open
pull request, posts its `workers.dev` URL on the PR, and deletes that preview
Worker when the PR closes. Pushes to `main` deploy `camelia-website`. Configure
these GitHub Actions repository secrets before enabling the workflows:

- `CLOUDFLARE_API_TOKEN`: API token scoped to the target account with Account
  Settings read and Workers Scripts edit permissions.
- `CLOUDFLARE_ACCOUNT_ID`: the Cloudflare account ID that owns the Workers.

No DNS or custom-domain configuration is included. Verify the preview and
production `workers.dev` deployment before changing DNS or removing the existing
Vercel project; keep Vercel available as rollback until the cutover is confirmed.
