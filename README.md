# RegistrarDocs AI

> Repository: `RegistrarDocs_AI_Project` (initial heading: `BarangayDocs_AI_Project`)

**RegistrarDocs AI** is a web-based Registrar's Office Document Request and Release Management System designed to make requesting academic documents easier, clarify requirements, and allow requesters to track request progress in one portal.

- **Pilot Institution:** Davao del Norte State College (DNSC)

## Current Milestone Status

**Milestone 1: Project Foundation + Public Landing Page (Complete)**

Implemented in this milestone:
- Next.js (App Router), React, TypeScript, Tailwind CSS, Lucide React, and ESLint project foundation
- Responsive public landing page with institutional visual identity
- Sticky navigation bar with desktop links and accessible mobile menu
- Hero section with primary/secondary calls to action and illustrative portal preview
- Illustrative Document Information section (pending Registrar's Office confirmation)
- 4-step How It Works workflow section and request-tracking status notice
- Proposed Portal Benefits section
- Interactive, accessible FAQ accordion
- Institutional footer with dynamic copyright year
- Temporary `/login` and `/register` route placeholders (no forms or authentication yet)

Planned for upcoming milestones (not implemented yet):
- Account registration, login, and authentication
- Database and backend integration
- Requester, staff, and admin dashboards
- Online document-request submission and live request tracking

## Technology Stack

- **Framework:** Next.js (App Router)
- **UI Library:** React
- **Language:** TypeScript
- **Styling:** Tailwind CSS (`@tailwindcss/postcss`)
- **Icons:** Lucide React
- **Linting:** ESLint (`eslint-config-next`)
- **Package Manager:** npm

## Getting Started

### Prerequisites

- Node.js (LTS / v20+ recommended)
- npm

### Installation

```bash
npm install
```

### Development

Start the local development server:

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

### Verification Commands

```bash
npm run lint
npm run build
```

## Project Structure

```text
.
├── src/
│   ├── app/
│   │   ├── login/
│   │   │   └── page.tsx          # Temporary Login route placeholder
│   │   ├── register/
│   │   │   └── page.tsx          # Temporary Register route placeholder
│   │   ├── globals.css           # Tailwind CSS theme and base styles
│   │   ├── layout.tsx            # Root layout, fonts, and metadata
│   │   └── page.tsx              # Public landing page
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Footer.tsx        # Site footer
│   │   │   └── Navbar.tsx        # Responsive navigation bar & mobile menu
│   │   ├── sections/
│   │   │   ├── BenefitsSection.tsx
│   │   │   ├── DocumentsSection.tsx
│   │   │   ├── FaqSection.tsx
│   │   │   ├── HeroSection.tsx
│   │   │   └── HowItWorksSection.tsx
│   │   └── ui/
│   │       ├── AuthPlaceholderView.tsx
│   │       ├── BrandMark.tsx
│   │       └── FeatureIcon.tsx
│   ├── lib/
│   │   └── landing-data.ts       # Structured landing-page copy and data
│   └── types/
│       └── landing.ts            # Shared TypeScript interfaces
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── tsconfig.json
└── README.md
```
