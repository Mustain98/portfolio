# Portfolio — Mustain Billah Taj

Personal portfolio site. Home page (hero, projects, skills, contact) plus a full case-study page
for each project: the problem, an architecture diagram, features, the design decisions worth
defending, the stack, and the API surface.

Built with Next.js 16 (App Router), TypeScript, and Tailwind CSS 4. Fully static — every route is
prerendered at build time.

## Running it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static export of / and /projects/[slug]
npm run lint
```

## Editing content

**All content lives in [`data/`](data/) — no copy is hardcoded in components.**

| File | Holds |
|---|---|
| [`data/profile.ts`](data/profile.ts) | Name, contact links, summary, skill groups |
| [`data/projects.ts`](data/projects.ts) | Every project, typed as `Project[]` |

Adding a fourth project means appending one object to `projects` — the card on the home page and
its `/projects/<slug>` case-study page are both generated from it, and `generateStaticParams()`
picks up the new route automatically.

## Setup checklist

- [ ] **Add `CV.pdf` to [`public/`](public/).** The Resume button links to `/CV.pdf`; until the file
      exists, that link 404s. See [`public/README.md`](public/README.md).
- [ ] **Verify the GitHub repo URLs** in [`data/projects.ts`](data/projects.ts) — they are marked
      with `// TODO: verify repo name`.

## Structure

```
app/
  layout.tsx              fonts, nav, footer, metadata
  page.tsx                home — hero · projects · skills · contact
  projects/[slug]/page.tsx  case study, statically generated per project
  globals.css             design tokens (dark palette, single accent)
components/               Nav · Hero · ProjectCard · Skills · Contact · Section · ArchDiagram
data/                     all site content
```
