# Katabatic — The Rating Agency for Stablecoin Reserves

> Cornell AI Hackathon 2026 · Programmable Capital Track · 36 Hours · Mar 13–15

## Product Summary

Katabatic builds **continuous counterparty risk ratings** for stablecoins. Like Moody's for bonds, but for the $150B+ in reserve banking risk behind USDC, USDT, DAI, BUSD, and FRAX. The hackathon demo proves the engine using **weather as a novel risk signal** — tracing a hurricane forecast through reserve banking relationships to produce a live downgrade with causal explanation.

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 18 + Vite | Dashboard SPA |
| **Charts** | Recharts | Rating timelines, dimension breakdowns |
| **Maps** | Leaflet + React-Leaflet (OpenStreetMap) | Geographic exposure map, hurricane overlay |
| **Styling** | Tailwind CSS | Rapid UI development |
| **Backend** | FastAPI (Python 3.11+) | REST API, scoring engine, data pipelines |
| **Knowledge Graph** | NetworkX | Stablecoin → Bank → City → Jurisdiction graph |
| **LLM** | Claude API (Anthropic SDK) | PDF extraction, rating narratives, LLM-as-judge scoring |
| **Weather Data** | NOAA API, NHC (hurricane tracks), OpenMeteo | Real-time weather stress signals |
| **Bank Data** | FDIC API | Bank health, watch lists, branch locations |
| **Geocoding** | Nominatim (OpenStreetMap) | Bank → lat/lng resolution |
| **Database** | SQLite (dev) | Attestation data, rating history, cached API responses |
| **Deployment** | Vercel (frontend) + Railway/Render (backend) | Demo hosting |

---

## Architecture (4 Layers)

```
┌─────────────────────────────────────────────────────────┐
│  Layer 1: INGESTION                                      │
│  Attestation PDFs → Claude extraction → structured JSON  │
│  NOAA/NHC forecasts → geocoded weather events            │
│  FDIC data → bank health signals                         │
├─────────────────────────────────────────────────────────┤
│  Layer 2: GEOGRAPHIC KNOWLEDGE GRAPH                     │
│  Stablecoin → Custodian Bank (city, state) → Jurisdiction│
│  Weather events attach as stress modifiers on bank nodes │
│  NetworkX graph with geographic indexing                  │
├─────────────────────────────────────────────────────────┤
│  Layer 3: RISK SCORING ENGINE                            │
│  6 dimensions: Attestation, Geography, Weather,          │
│  Counterparty, Composite Rating, Narratives              │
│  Rules for quantifiable + LLM reasoning for qualitative  │
├─────────────────────────────────────────────────────────┤
│  Layer 4: DASHBOARD + WHAT-IF SIMULATOR                  │
│  Interactive map, hurricane drop, rate sliders            │
│  Real-time re-rating with Claude-generated narratives    │
└─────────────────────────────────────────────────────────┘
```

---

## GitHub Workflow & Branch Strategy

### Branch Structure

```
main                          ← Production-ready, protected, deploy target
├── dev                       ← Integration branch, all features merge here first
│   ├── feat/pdf-extraction   ← LLM attestation PDF parsing pipeline
│   ├── feat/knowledge-graph  ← NetworkX graph construction + entity resolution
│   ├── feat/weather-pipeline ← NOAA/NHC/OpenMeteo ingestion + geocoding
│   ├── feat/scoring-engine   ← 6-dimension risk scoring rules + LLM-as-judge
│   ├── feat/dashboard        ← React dashboard shell, ratings table, charts
│   ├── feat/map-simulator    ← Leaflet map, hurricane drop, what-if controls
│   ├── feat/narratives       ← Claude-generated rating explanations
│   ├── feat/svb-backtest     ← SVB March 2023 historical replay scenario
│   └── feat/demo-polish      ← Final UI polish, demo script scenarios, deploy
```

### Branch Rules

- `main`: Protected. Only merges from `dev` after team review. Tagged releases for demo checkpoints.
- `dev`: Integration branch. All `feat/*` branches merge here via PR. Must pass lint + tests.
- `feat/*`: Short-lived feature branches. One per workstream task. Squash-merge into `dev`.

### PR Workflow

1. Create `feat/*` branch from `dev`
2. Work, commit often with descriptive messages
3. Open PR to `dev` — at least 1 team member reviews
4. Squash-merge into `dev`
5. At demo checkpoints: merge `dev` → `main`, tag release (`v0.1-foundation`, `v0.2-pipeline`, `v0.3-simulator`, `v1.0-demo`)

---

## Precise Actions (36-Hour Roadmap)

### Phase 1: Foundation (Fri Evening · Hours 0–4)

**Owner: Everyone (parallel setup)**

- [ ] Initialize monorepo structure:
  ```
  /backend        ← FastAPI app
  /frontend       ← React + Vite app
  /data           ← Attestation PDFs, seed data, fixtures
  /scripts        ← One-off data processing scripts
  ```
- [ ] Set up `backend/`: FastAPI skeleton, `/health` endpoint, CORS config, `.env` for API keys
- [ ] Set up `frontend/`: Vite + React + Tailwind, basic routing, layout shell
- [ ] Create `dev` branch, push both scaffolds
- [ ] Collect attestation PDFs: Circle (USDC), Tether (USDT), Paxos (BUSD), MakerDAO (DAI), Frax (FRAX)
- [ ] Hard-code seed data: SVB scenario (March 2023) + Hurricane Ian (Sept 2022) as JSON fixtures in `/data`
- [ ] Define JSON schema for extracted attestation data:
  ```json
  {
    "stablecoin": "USDC",
    "issuer": "Circle",
    "report_date": "2023-02-28",
    "total_reserves": 42000000000,
    "counterparties": [
      {
        "bank_name": "Silicon Valley Bank",
        "city": "Santa Clara",
        "state": "CA",
        "percentage": 8.3,
        "asset_class": "cash_deposits"
      }
    ]
  }
  ```
- [ ] Tag `v0.1-foundation`

### Phase 2: Pipeline & Knowledge Graph (Sat Morning · Hours 4–12)

**feat/pdf-extraction (LLM/Extraction role)**
- [ ] Build Claude API prompt chain for attestation PDF parsing
- [ ] Extract: bank names, deposit percentages, asset classes, maturity profiles, jurisdictions
- [ ] Output structured JSON per stablecoin, store in `/data/extracted/`
- [ ] Validate against manually-verified ground truth for Circle + Tether reports
- [ ] Endpoint: `POST /api/extract` — accepts PDF, returns structured JSON

**feat/knowledge-graph (Graph/Weather role)**
- [ ] Build NetworkX graph: nodes = [Stablecoin, Bank, City, State, Jurisdiction]
- [ ] Edges encode: `holds_reserves_at`, `located_in`, `governed_by`
- [ ] Geographic indexing: geocode all bank nodes (lat/lng) using Nominatim
- [ ] Graph query functions: `get_exposed_stablecoins(region)`, `get_bank_concentration(stablecoin)`
- [ ] Endpoint: `GET /api/graph` — returns serialized graph for frontend visualization

**feat/weather-pipeline (Graph/Weather role)**
- [ ] NOAA API integration: fetch active weather alerts by region
- [ ] NHC hurricane track parser: extract cone of uncertainty, forecast path, category
- [ ] OpenMeteo historical weather data for backtest scenarios
- [ ] Geocode weather events → attach as stress modifiers on bank nodes in the graph
- [ ] Endpoint: `GET /api/weather/active` — returns current weather stress events
- [ ] Endpoint: `POST /api/weather/simulate` — accepts hurricane params, returns affected banks

**feat/scoring-engine (Data/Scoring role)**
- [ ] Define 6 scoring dimensions (each 0–100, then mapped to letter grade):
  1. **Attestation Quality** — frequency, detail, auditor reputation (rule-based)
  2. **Geographic Concentration** — HHI index of bank locations (rule-based)
  3. **Weather Exposure** — overlap of bank locations with active/simulated weather events (rule-based + LLM)
  4. **Counterparty Health** — FDIC data, news sentiment, CDS spreads (LLM-as-judge)
  5. **Asset Composition** — T-bills vs cash vs repo vs commercial paper mix (rule-based)
  6. **Peg Stability** — historical depeg events, current spread (rule-based)
- [ ] Weighted composite: `final_score = Σ(weight_i × dimension_i)`
- [ ] Letter grade mapping: A (90+), A- (85+), B+ (80+), B (70+), C+ (60+), C (50+), D (<50)
- [ ] Endpoint: `GET /api/ratings` — returns all stablecoin ratings
- [ ] Endpoint: `POST /api/ratings/stress` — accepts stress scenario, returns re-rated scores

- [ ] Tag `v0.2-pipeline`

### Phase 3: Dashboard & Simulator (Sat Afternoon · Hours 12–20)

**feat/dashboard (Frontend role)**
- [ ] Ratings table: all stablecoins with letter grades, 6-dimension breakdown sparklines
- [ ] Rating detail view: click a stablecoin → full dimension scores, trend charts (Recharts)
- [ ] Alert banner: active weather/bank stress events affecting ratings
- [ ] Responsive layout matching Katabatic design language (purple accent `#7b6fc4`, light bg `#f4f3fa`)

**feat/map-simulator (Frontend + Graph/Weather roles)**
- [ ] Leaflet map showing all custodian bank locations as markers
- [ ] Color markers by stress level (green → yellow → red)
- [ ] **Hurricane drop interaction**: click map to place hurricane → POST to `/api/weather/simulate` → highlight affected banks → show rating changes in real-time
- [ ] Rate slider: adjust interest rates → POST to `/api/ratings/stress` → see portfolio impact
- [ ] Bank failure toggle: simulate a specific bank failing → propagate through graph

**feat/narratives (LLM/Extraction role)**
- [ ] Claude API prompt for rating explanations:
  - Input: graph context, stress event, old rating, new rating, affected counterparties
  - Output: 2-3 sentence causal narrative (e.g., "USDC downgraded to B+. 12% of reserves held at institutions in SE Florida facing $4.2B in hurricane insurance liability...")
- [ ] Endpoint: `POST /api/narratives` — accepts rating change context, returns explanation
- [ ] Display narratives in dashboard rating detail view

- [ ] Tag `v0.3-simulator`

### Phase 4: Backtests & Polish (Sat Night · Hours 20–26)

**feat/svb-backtest (Data/Scoring + LLM roles)**
- [ ] SVB time machine: load March 2023 data, replay Katabatic ratings day-by-day
- [ ] Show rating dropping to C+ ~48 hours before USDC depeg event
- [ ] Timeline scrubber UI component for backtest view
- [ ] Hurricane Ian replay: Sept 2022 data, show FL bank stress propagation

**feat/demo-polish (Everyone)**
- [ ] Wire up all 3 demo scenarios end-to-end:
  - Scenario A: Weather-triggered downgrade (primary demo)
  - Scenario B: SVB collapse backtest
  - Scenario C: Rate hike stress test
- [ ] Loading states, error handling, empty states
- [ ] Demo mode toggle: preload data, skip API latency with cached responses
- [ ] UI polish: animations, transitions, Katabatic brand consistency

- [ ] Tag `v0.4-backtests`

### Phase 5: Ship (Sun Morning · Hours 26–36)

- [ ] Code freeze at **hour 30**
- [ ] Deploy frontend to Vercel, backend to Railway/Render
- [ ] Verify all 3 demo paths work on deployed URLs
- [ ] Rehearse demo script 5× (target: under 2 minutes)
- [ ] Prepare backup: pre-recorded screen capture of demo in case of live failure
- [ ] Final merge `dev` → `main`, tag `v1.0-demo`

---

## Demo Script (5 Beats, <2 Minutes)

1. **Show the ratings dashboard.** Six stablecoins rated across six dimensions — "We had an LLM read every major attestation report, identify the counterparties, and rate them continuously."
2. **Drop a hurricane on the map.** Banks in the zone highlight. Two stablecoins downgrade from A to B+ as weather stress propagates through the knowledge graph in real-time.
3. **Click into the rating explanation.** LLM generates: "USDC downgraded to B+. 12% of reserves at institutions in SE Florida. $4.2B insurance liability increases deposit stress."
4. **SVB backtest.** Rewind to March 2023. Rating drops to C+ 48 hours before the depeg.
5. **Close the pitch.** "We just showed a hurricane triggering a live downgrade with full causal explanation. That's one signal. The platform handles all of them. Moody's rates bonds. We're building the rating agency for stablecoin reserves."

---

## API Keys Required (.env)

```
ANTHROPIC_API_KEY=           # Claude API for extraction + narratives
NOAA_API_TOKEN=              # NOAA weather data
OPENMETEO_API_KEY=           # Historical weather (free tier)
```

---

## Collaborators

- Adi Prathapa
- Aritro Ganguly

---

## Conventions

- Commit messages: `feat:`, `fix:`, `chore:`, `docs:` prefixes
- Python: Black formatter, type hints, docstrings on public functions
- React: Functional components, hooks only, no class components
- All API responses follow: `{ "data": ..., "error": null, "timestamp": "..." }`
- Branch names: `feat/short-description`, `fix/short-description`
