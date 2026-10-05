# Batcomputer // Abdullah Al Anser — developer portfolio

A production Next.js portfolio built to the 80-section specification in
`Abdullah_Al_Anser_Batcomputer_Portfolio_Master_Specification.pdf`.

Gotham is the visual language. Abdullah Al Anser is the product.

---

## Verified state of this build

These were run in the environment where the project was generated:

| Check | Result |
| --- | --- |
| `npx tsc --noEmit` | passes, `strict` + `noUncheckedIndexedAccess`, zero `any` |
| `npx next build` | succeeds — 13 routes, all pages statically prerendered |
| `next start` + HTTP checks | every route returns the expected status |
| Security headers | present on responses, verified with `curl -I` |
| `/api/contact` | 405 non-POST · 422 invalid · 429 after 3 posts / 10 min · 200 honeypot · 503 unconfigured |
| Unknown case slug | 404 with the scoped not-found page |

**Not verified, because this environment has no browser:** visual rendering,
Lighthouse scores, screen-reader behaviour, real-device responsiveness, and the
contact form's end-to-end delivery. Run those yourself before launch — the
checklist at the end of this file lists them.

Built against Next.js 16.3.2, React 19.2, TypeScript 7.

---

## Getting started

```bash
npm install
cp .env.example .env.local     # then fill in the values you need
npm run dev                    # http://localhost:3000
```

Other scripts: `npm run build`, `npm start`, `npm run typecheck`, `npm run audit:deps`.

---

## Routing

App Router throughout. Every technique here is load-bearing, not decorative.

| Route | Rendering | Notes |
| --- | --- | --- |
| `/` | Static | The full narrative: hero → about → skills → case files → experience → education → credentials → services → GitHub → contact |
| `/projects` | Static | Full archive with URL-synced filtering |
| `/projects/[slug]` | SSG via `generateStaticParams` | One page per case file, `generateMetadata` per project, `notFound()` for unknown slugs |
| `/resume` | Static | Developer dossier + PDF download |
| `/terminal` | Static | Simulated command interface, `noindex` |
| `/api/contact` | Dynamic route handler | POST only |
| `/sitemap.xml`, `/robots.txt`, `/opengraph-image`, `/icon.svg` | Static | Next file conventions — generated from data, so they cannot drift |

Specific choices worth knowing about:

- **Filter state lives in the URL.** `ProjectGrid` reads `?filter=web` from
  `useSearchParams` and writes it back with `router.replace(..., { scroll: false })`.
  No reload, no scroll jump, and a filtered view is a shareable link.
- **`useSearchParams` is wrapped in `<Suspense>`** so the rest of the page still
  prerenders statically.
- **The GitHub panel is a server component** with `next: { revalidate: 3600 }`.
  The token never reaches the browser and a visitor spike cannot exhaust the
  rate limit.
- **Section anchors, not routes, for the home narrative.** Nav links become
  `/#section` on deep pages so they always resolve.

---

## Stack, and where it deviates from the brief

The spec's preferred list included Tailwind, shadcn/ui, Framer Motion, GSAP,
Lenis, Three.js and React Three Fiber. This build ships **zero runtime
dependencies beyond Next and React**, because §05 and §64 say every dependency
must have a reason and nothing decorative should be a library. Each call:

| Suggested | Used here | Why |
| --- | --- | --- |
| Tailwind + shadcn/ui | Hand-built token system in `app/globals.css` | One stylesheet, no build plugin, no version coupling. Tokens are plain CSS custom properties, so the light theme is a variable swap. |
| Framer Motion / GSAP | `IntersectionObserver` + CSS transitions (`components/ui/Reveal.tsx`) | Scroll reveals and hovers are a CSS job. |
| Lenis smooth scroll | `scroll-behavior: smooth` | Native, and it respects `prefers-reduced-motion` for free. |
| Three.js / R3F | CSS-gradient skyline + a 130-drop 2D canvas | The Gotham backdrop is a 2D effect. Shipping a WebGL runtime for it would cost hundreds of kilobytes for no visual gain. |
| Lucide React | Inline SVG (5 icons total) | Five icons is not an icon-library problem. |

If you want any of them back, add them one at a time and check the bundle
afterwards. **Fonts** are system stacks — no network request, no layout shift,
no licensing exposure. To swap in real faces, use `next/font/google` in
`app/layout.tsx` and point `--font-display` / `--font-body` / `--font-mono` at
the generated CSS variables. Suggested pairing: a geometric grotesk for display,
a neutral sans for body, a mono for the system labels.

---

## Design system

Six colours, defined once in `app/globals.css`:

```
--void      #06070a   near-black page ground
--slab      #0b0d11   panel surfaces
--graphite  #14171d   raised surfaces
--bone      #e7e9ec   text
--haze      #8b929c   secondary text
--signal    #e3b23c   muted gold — accent only, never a surface
--alert     #b8453a   restrained red, used only for failure and unverified flags
```

Gold appears on active states, CTAs, borders, status indicators and small data
details. It is never a background.

**The signature element is the telemetry rail** — a fixed left-edge gauge that
reads scroll depth as a system readout. It appears at ≥1100px, is hidden from
assistive technology, and is the one place the design spends its boldness.
Everything else stays quiet: hairline borders, near-square corners (3px), one
heading pattern, one card pattern.

Numbered markers appear in exactly two places — the mission protocol and case
file numbers — because in both, order is real information.

---

## Content rule (§74) — read this first

**Nothing in this build claims a fact about you that I could not verify.**

Every unknown value is a bracketed placeholder: `[YOUR EMAIL]`, `[PROJECT NAME]`,
`[CGPA]`. Placeholders are not hidden — `components/ui/Unverified.tsx` renders
them with a red **REPLACE** flag, so an unfinished field is impossible to miss
and impossible to ship by accident.

Concretely, these are placeholders and must be replaced or deleted:

- all three projects in `data/projects.ts`, including the case study
- the single entry in `data/experience.ts` — **delete it if you have no
  professional roles yet**; the section hides itself when the array is empty
- `data/education.ts`, `data/certificates.ts` (certificates and achievements)
- the biography and "how I work" copy in `components/about/About.tsx`
- the summary in `app/resume/page.tsx`
- email and social links in `data/site.ts`
- the portrait frame in `About` and the résumé PDF at `public/resume/`

Skill **levels** in `data/skills.ts` are guesses set to a conservative default.
Review every one. The technology list itself came from your brief.

Hero statistics are **counted from the data files** rather than typed in, so
they cannot be inflated. Testimonials are an empty array and the section does
not exist — per §35, an omitted section beats an invented quote.

---

## Security

### Headers (§60)
Set in `next.config.ts`: CSP, HSTS (2 years, preload), `X-Content-Type-Options`,
`X-Frame-Options: DENY`, `Referrer-Policy`, `Permissions-Policy` (camera, mic,
geolocation, payment all denied), COOP and CORP. `poweredByHeader` is off.

**One trade-off you should understand.** `script-src` includes `'unsafe-inline'`.
A per-request nonce would be stricter, but a nonce forces every page into
dynamic rendering, and Next's own inline bootstrap scripts change hash every
build. Since there is no user-generated HTML, no CMS and no
`dangerouslySetInnerHTML` other than a build-time JSON-LD block — and since
`connect-src`, `form-action`, `base-uri` and `object-src` are all locked down —
an injected inline script would have nowhere to send anything. The full
reasoning, and the exact steps to move to a nonce if you add user-rendered HTML,
are commented at the top of `next.config.ts`. Note that a nonce or hash makes
browsers ignore `'unsafe-inline'` entirely, so it is one or the other.

### Contact endpoint (§59)
`app/api/contact/route.ts` applies, in order: method restriction → content-type
check → 16 KB size limit checked before parsing → rate limit → honeypot → schema
validation → email-header-injection rejection (CR/LF, `bcc:`, `cc:`) → generic
errors. The message body is sent as **plain text only** and is never
interpolated into HTML, which removes the XSS surface rather than sanitising it.

**Known limitation, stated plainly:** the rate limiter in `lib/rate-limit.ts` is
in-memory. On serverless each instance keeps its own counter, so it slows abuse
rather than stopping it. Before launch, move the counter to Vercel KV, Upstash
Redis or your database — the function signature is deliberately the shape those
clients use.

### Terminal (§37)
`components/terminal/Terminal.tsx` is a lookup table over local data. No `eval`,
no shell, no network call, no server round-trip. Unknown input is echoed back as
a string. Do not "improve" it with a backend command runner.

### Credentials (§52–§56)
`.env.example` is the credential inventory: purpose, scope, storage and rotation
for each. `.gitignore` excludes `.env*`, `*.pem`, `*.key` and credential files.
Nothing is hard-coded. `NEXT_PUBLIC_SITE_URL` is the only browser-exposed
variable and it is genuinely public.

Turn on **secret scanning**, **push protection** and **Dependabot** in the
repository settings — those live in GitHub, not in this codebase.

### CI (§57)
`.github/workflows/ci.yml` runs typecheck, `npm audit --omit=dev` and build with
`permissions: contents: read` and `persist-credentials: false`. It references no
secret, so a fork PR cannot reach one.

---

## Accessibility (§44)

Semantic landmarks, one `<h1>` per page, a skip link, visible focus rings on
`:focus-visible`, `aria-current` on the active nav item, `aria-pressed` on
filters, labelled form fields with `aria-invalid` and `aria-describedby`,
`aria-live` on form and filter status, 44px minimum touch targets, and the
experience timeline built on `<details>`/`<summary>` so it is keyboard
accessible without JavaScript.

`prefers-reduced-motion` is honoured globally: transitions collapse, the reveal
animation is skipped, the boot sequence does not run, and the rain does not
render.

The boot screen is capped at ~1.2 seconds, marked `inert`, skipped on repeat
visits within a session, and the page underneath is fully interactive the whole
time. It can never trap anyone.

---

## Performance (§45, §46)

All 13 routes prerender to static HTML. The only JavaScript that ships is the
nav, theme toggle, boot sequence, reveal observer, filter, form and terminal.
The rain canvas is `next/dynamic` and self-disables under reduced motion, below
900px, or on 4-or-fewer cores. It stops when the tab is hidden. The 3D tier
strategy in §46 resolves to: no 3D anywhere, because the atmosphere is achieved
with gradients and one small canvas.

---

## Project structure

```
app/          routes, layout, metadata files, API handler
components/   one folder per section, plus ui/ primitives
data/         projects · skills · experience · education · certificates · services · site
lib/          types · validation · rate-limit · github · structured-data · utils
public/       images · projects · resume · icons · theme-init.js
```

Adding a project means adding an object to `data/projects.ts`. No component
changes, and the case-study page, sitemap, filters, terminal and résumé all pick
it up.

---

## Deployment

1. Push to GitHub. Confirm `.env.local` is **not** in the repository.
2. Import into Vercel. Set `NEXT_PUBLIC_SITE_URL` to the real domain.
3. Add server-side variables per environment: `GITHUB_USERNAME`, optionally
   `GITHUB_TOKEN` (fine-grained, public repos, read-only), and
   `RESEND_API_KEY` / `CONTACT_TO_EMAIL` / `CONTACT_FROM_EMAIL`.
4. Attach the domain, confirm HTTPS, and enable registrar MFA.
5. For a custom sending domain, configure SPF, DKIM and DMARC at the DNS level.
6. Never use production credentials locally.

I have not verified Resend's current API shape, pricing or free-tier limits —
check their documentation before relying on it. Any transactional provider works;
the call is one `fetch` in the route handler.

---

## Before you launch

- [ ] Replace every bracketed placeholder — search the repo for `[` in `data/`
- [ ] Delete any section you cannot fill honestly
- [ ] Review every skill level
- [ ] Add the real résumé PDF at `public/resume/`
- [ ] Add a portrait and swap the About frame for `next/image`
- [ ] Move the rate limiter to a shared store
- [ ] Run Lighthouse on mobile throttling; targets are 90+ / 95+ / 95+ / 95+
- [ ] Test at 320, 375, 390, 430, 768, 1024, 1440, 1920
- [ ] Keyboard-only pass and a screen-reader pass
- [ ] Send a real message through the contact form
- [ ] Enable secret scanning, push protection and Dependabot

---

## Known issues

- Requesting an unknown case-file slug logs an internal
  `NoFallbackError` line in the Next 16 server output. The response is a correct
  404 and the server stays healthy; the log line is framework-internal.
- Light mode is implemented as a token swap and passes contrast by calculation,
  but it has not been reviewed visually.
"# AB-BAT" 
"# AB-BAT" 
"# AB-BAT" 
