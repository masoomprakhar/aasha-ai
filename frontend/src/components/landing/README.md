# ASHA AI Marketing Landing Page

CareCloud-style marketing site for ASHA AI, implemented in **Vite + React** (not Next.js).

## Components

| File | Section |
|------|---------|
| `TopBar.tsx` | Utility strip (social good pill, helpline, language toggle) |
| `Navbar.tsx` | Sticky nav with mobile drawer |
| `Hero.tsx` | Split hero with CTAs |
| `VoiceAgentOrb.tsx` | Animated ASHA Didi voice agent (hero centerpiece) |
| `ProofStrip.tsx` | State name proof row |
| `Stats.tsx` | 4-stat band |
| `SolutionsGrid.tsx` | 6-card solutions grid |
| `WorkflowTabs.tsx` | Tabbed "How a question becomes care" |
| `LanguagesBand.tsx` | Dark 11-language chip band |
| `ImpactStory.tsx` | Testimonial + illustrative metrics |
| `InsightsGrid.tsx` | 3-card news/field notes grid |
| `HelpBand.tsx` | Teal CTA band |
| `Footer.tsx` | Multi-column sitemap footer |

## Hardcoded vs. wire later

| Hardcoded now | Wire to real data later |
|---------------|-------------------------|
| All marketing copy | CMS or i18n JSON |
| State names in proof strip | Partner / pilot program API |
| Stats (300M, 1:1000, etc.) | Analytics service |
| Testimonials & impact metrics | Case studies CMS |
| Insights / news cards | Blog or headless CMS |
| Helpline `1800-ASHA-AI` | Real telecom routing |
| `mailto:hello@asha-ai.org` | CRM / support ticketing |
| Language toggle (EN/हिंदी) | Full `useTranslation` integration |
| VoiceAgentOrb demo chat | Live WebSocket / voice API |
| Footer API docs link | `VITE_API_URL` + `/docs` |

## Design tokens

Defined in `tailwind.config.js`: `ink`, `teal`, `terra`, `paper`, `panel`, `line`, `muted`, `rounded-card`, `shadow-soft`.

Fonts: **Fraunces** (display), **Inter** (body), **Spline Sans Mono** (labels).
