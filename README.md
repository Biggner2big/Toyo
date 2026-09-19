# Toyo — Pre-Legal Document Generator

A professional SaaS web application designed for drafting, customizing, live previewing, and exporting pre-legal documents and contracts with real-time token interpolation, dynamic form generation, and dual **PDF** / **DOCX** download capabilities.

---

## Key Features

- **Dynamic Template-Driven Architecture**: Easily configurable document templates with JSON schema definitions for custom fields.
- **5 Initial Pre-Legal Templates**:
  1. *Non-Disclosure Agreement (NDA)*
  2. *Independent Contractor Agreement*
  3. *Professional Engagement Letter*
  4. *General Letter of Authorization*
  5. *Declaration & Undertaking (Affidavit of Fact)*
- **Real-Time Live Document Preview**: Side-by-side interactive legal preview with instant placeholder interpolation.
- **Multi-Format Export**:
  - **PDF Export**: Clean, paginated vector PDF with legal header, footer, page numbering, and disclaimer.
  - **DOCX Export**: Structured Microsoft Word `.docx` file using standard 1-inch legal margins and paragraph styles.
- **Supabase Authentication & Security**:
  - Email and password registration & login.
  - Full PostgreSQL **Row-Level Security (RLS)** ensuring users only access their own documents.
- **Modern Dark Legal-Tech Aesthetic**: Responsive, accessible interface built with Tailwind CSS.
- **Docker Support**: Production multi-stage `Dockerfile` and `docker-compose.yml`.

---

## Tech Stack

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Backend & Database**: [Supabase](https://supabase.com/) (Auth + PostgreSQL + Row Level Security)
- **Document Generation**:
  - [docx](https://www.npmjs.com/package/docx) (Word document synthesis)
  - [jsPDF](https://github.com/parallax/jsPDF) (Vector PDF generator)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Containerization**: [Docker](https://www.docker.com/) & Docker Compose

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Biggner2big/Toyo.git
cd Toyo
```

### 2. Configure Environment Variables

Create a `.env.local` file based on `.env.example`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://ozsnxaxzdclegkyshhic.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_publishable_anon_key
```

### 3. Database Migration

Run the migration script located in `supabase/migrations/001_initial_schema.sql` in your Supabase SQL Editor to set up tables, RLS policies, auth triggers, and seed templates.

### 4. Install Dependencies & Run Development Server

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Running with Docker

### Build and Run with Docker Compose

```bash
docker-compose up --build
```

Access the application at [http://localhost:3000](http://localhost:3000).

---

## Deployment on Vercel

1. Push code to your GitHub repository:
   ```bash
   git add .
   git commit -m "feat: complete pre-legal document generator SaaS"
   git push origin main
   ```
2. Import project into [Vercel](https://vercel.com/).
3. Set environment variables `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
4. Deploy!

---

## Academic & Legal Disclaimer

> **Legal Notice**: Toyo is an academic document drafting assistance tool. Generated documents are drafts for pre-legal preparation and do not constitute formal legal advice. Always consult a qualified legal attorney for jurisdiction-specific legal counsel.
