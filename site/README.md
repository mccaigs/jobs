# AIJobs Intelligence Dashboard

AI-powered job market intelligence platform with real-time insights and automated reporting.

## Tech Stack

- **Frontend**: React 19 + TypeScript + Vite
- **Backend**: Convex (serverless database + functions)
- **Styling**: Tailwind CSS
- **Markdown**: react-markdown + remark-gfm
- **Routing**: React Router v7

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

Frontend runs on `http://localhost:5175` (or next available port)

### 3. Ingest Reports

```bash
node scripts/ingest-reports.mjs
```

## Project Structure

```
site/
├── convex/              # Convex backend
│   ├── schema.ts        # Database schema
│   ├── reports.ts       # Query/mutation functions
│   └── http.ts          # HTTP actions for ingestion
├── src/
│   ├── components/      # React UI components
│   ├── services/        # Convex client & data mapping
│   ├── types/           # TypeScript types
│   ├── utils/           # Report parsing utilities
│   └── App.tsx          # Main application
├── scripts/
│   └── ingest-reports.mjs  # Report ingestion script
└── .env                 # Environment variables
```

## Key Features

- **Real-time Data**: Convex provides live updates to the UI
- **Markdown Reports**: Full GitHub-flavored markdown support
- **Smart Parsing**: Automatic extraction of metadata from reports
- **Responsive Design**: Dark theme with modern UI components
- **Type-safe**: Full TypeScript coverage

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `node scripts/ingest-reports.mjs` - Ingest markdown reports

## Convex Integration

This project uses **Convex** as the exclusive backend. See [`CONVEX_SETUP.md`](./CONVEX_SETUP.md) for detailed documentation on:

- Deployment configuration
- Schema design
- Ingestion pipeline
- Manual triggers
- Troubleshooting

## Environment Variables

Create a `.env` file:

```env
VITE_CONVEX_URL=https://third-lark-419.convex.cloud
```

## Adding New Reports

1. Push markdown files to `https://github.com/mccaigs/jobs`
2. Run ingestion: `node scripts/ingest-reports.mjs`
3. Reports appear automatically in the UI

The ingestion script fetches reports directly from the live GitHub repository.

## Report Format

Reports support multiple filename formats:
```
YYYY-MM-DD-{suffix}.md
DD-MM-YYYY-{suffix}.md
{prefix}-DD-MM-YYYY-{suffix}.md
{prefix}-YYYY-MM-DD-{suffix}.md
```

Examples from the repo:
- `2026-03-30-jobs.md`
- `30-03-2026-jobs.md`
- `UK-AI-DailyJobSearch-30-03-2026-jobs.md`

## Development

The application uses Convex for real-time data synchronization. Changes to the database are immediately reflected in the UI without manual refresh.

### Convex Functions

- `listReports` - Fetch all reports (sorted by date)
- `getReportBySlug` - Fetch single report
- `upsertReport` - Insert/update report (idempotent)

### HTTP Actions

- `POST /ingest` - Ingest single report
- `POST /ingest/github` - Ingest from GitHub repo

## Deployment

### Frontend (Vite)

```bash
npm run build
# Deploy dist/ folder to your hosting provider
```

### Backend (Convex)

```bash
npx convex deploy
```

## License

Private project - All rights reserved
