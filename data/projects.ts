export type Project = {
  slug: string;
  name: string;
  tagline: string;
  summary: string;
  tech: string[];
  highlights: string[];
  github: string;
  demo?: string;
  problem: string;
  architecture: { caption: string };
  features: { title: string; body: string }[];
  whyInteresting: string[];
  stack: { layer: string; tech: string }[];
  apiSurface?: { area: string; endpoints: string }[];
};

export const projects: Project[] = [
  {
    slug: "stream",
    name: "Stream",
    tagline: "Pay-per-view live streaming on a WebRTC SFU built from scratch.",
    summary:
      "A full-stack live-streaming platform where creators broadcast in real time over WebRTC and get paid for it. Viewers sample paid streams through timed free previews and unlock full access with Stripe checkout, while broadcasters watch earnings update live and receive automatic payouts when the stream ends.",
    tech: [
      "FastAPI",
      "aiortc",
      "WebRTC",
      "PostgreSQL",
      "Stripe",
      "WebSocket",
      "Next.js",
      "Docker",
    ],
    highlights: [
      "Real-time streaming platform supporting free and pay-per-view broadcasts with creator monetization and automated Stripe payouts.",
      "Custom WebRTC Selective Forwarding Unit (SFU) using aiortc, implementing signaling, media routing, room management, viewer authentication, and preview enforcement without third-party media servers.",
      "Distributed architecture separating business logic from media processing through secure ticket-based authentication, with real-time chat, moderation, and live earnings updates.",
    ],
    // TODO: verify repo name
    github: "https://github.com/Mustain98/Stream",
    problem:
      "Most streaming demos are a thin wrapper around Mediasoup, LiveKit, or Agora — the interesting part is somebody else's binary. Stream takes the opposite bet: the media server is first-party Python. Peer management, track forwarding, room lifecycle, signaling, and preview timers are all original aiortc code, which means the business layer and the media layer can be cleanly separated and a short-lived ticket can be the only bridge between them.",
    architecture: {
      caption:
        "Three services, one database. The media server knows nothing about passwords or payments; the business backend never touches an RTP packet.",
    },
    features: [
      {
        title: "Real-time broadcasting",
        body: "One-to-many live video and audio through a hand-rolled SFU: a single publisher's tracks are selectively forwarded to any number of subscribers. WebSocket signaling handles the full WebRTC lifecycle — offer/answer negotiation, ICE candidate exchange, clean peer teardown. Broadcasters can pause and resume mid-stream, and a publisher heartbeat lets a background cleanup loop reap streams whose broadcaster vanished.",
      },
      {
        title: "Ticket-based access",
        body: "Viewers never reach the media server with raw credentials. The backend authenticates the user, verifies their right to watch, and issues a short-lived single-purpose ticket. The SFU validates that ticket against the backend over a shared-secret internal API before admitting the peer.",
      },
      {
        title: "Monetization with Stripe",
        body: "Broadcasters mark a stream free or paid, set price, currency, and an optional free-preview window. Paid access goes through Stripe Checkout, confirmed by webhooks with a reconciliation endpoint as a safety net for missed events. A configurable platform fee is split out of every transaction.",
      },
      {
        title: "Previews that actually end",
        body: "The free preview is not a client-side timer someone can bypass — the SFU itself enforces it. When a preview viewer's time is up the media server cuts the connection and the frontend swaps in a payment-required overlay leading straight to checkout.",
      },
      {
        title: "Settlement, payouts & refunds",
        body: "Broadcasters onboard to Stripe Connect from their dashboard. When a stream ends, a settlement pass runs: if the stream met its minimum duration, each paid viewer's share minus the platform fee is transferred to the connected account. If it ended too early, viewers are automatically refunded — no support tickets, no manual intervention.",
      },
      {
        title: "Live earnings & moderation",
        body: "Every confirmed payment is relayed from the backend through the SFU to the broadcaster over the existing WebSocket, mid-stream. Broadcasters can block, unblock, and kick viewers; blocks are enforced at both layers — the SFU ejects the user immediately and the backend refuses to issue them a new ticket.",
      },
    ],
    whyInteresting: [
      "The hard part is hand-built. The SFU — peer management, track forwarding, room lifecycle, preview timers — is original aiortc code you can read end to end, not a wrapper around Mediasoup or LiveKit.",
      "Money is handled like production money: idempotency keys on every Stripe call, webhook replay protection, a partial unique index guaranteeing at most one paid transaction per viewer per stream, a reconciliation escape hatch, split fees, automated Connect payouts, and automatic refunds when a broadcaster under-delivers.",
      "The preview cutoff lives in the media server, so it cannot be bypassed by patching the client — the security boundary is drawn where the packets actually flow.",
      "A full transaction state machine (pending → checkout_created → paid → transferred / refunded) tracks failure states at every step.",
    ],
    stack: [
      { layer: "Frontend", tech: "Next.js 15, React 19, TypeScript" },
      {
        layer: "Main Backend",
        tech: "FastAPI, SQLModel, PostgreSQL, Stripe",
      },
      { layer: "Stream Server", tech: "FastAPI, aiortc, WebSockets" },
      { layer: "Auth", tech: "JWT, Argon2/bcrypt password hashing" },
      { layer: "Infra", tech: "Docker Compose (Postgres 16, Stripe CLI)" },
    ],
    apiSurface: [
      {
        area: "Auth",
        endpoints: "POST /signup · POST /login · GET|PATCH /me · GET /dashboard",
      },
      {
        area: "Streams",
        endpoints:
          "POST /create · POST /start/{id} · POST /end/{id} · GET /live · GET /upcoming",
      },
      {
        area: "Access",
        endpoints:
          "POST /ticket/{id} · GET /{id}/access · PATCH /{id}/access-settings",
      },
      {
        area: "Payments",
        endpoints:
          "POST /stream/{id}/checkout · POST /payments/stripe/webhook · POST /payments/stripe/reconcile-checkout",
      },
      {
        area: "Earnings",
        endpoints:
          "GET /{id}/earnings · GET /earnings/history · GET /spend/history",
      },
      {
        area: "Moderation",
        endpoints: "POST|DELETE /{id}/block/{user_id} · GET /{id}/blocked-users",
      },
      { area: "SFU", endpoints: "WS /ws (signaling + chat) · GET /rooms" },
    ],
  },

  {
    slug: "j-buddy",
    name: "J_Buddy",
    tagline: "An AI job copilot that reads your CV and hunts for you around the clock.",
    summary:
      "Give it your CV once and it decides what roles suit you, goes out and fetches real live listings, scores every one against your profile from 0–100, and lets you simply talk to it — \"find me an ML internship in Dhaka\", \"what am I missing for this job?\", \"write me a cover letter\" — like a career coach who has actually read your CV.",
    tech: [
      "FastAPI",
      "LangChain",
      "Groq",
      "pgvector",
      "PostgreSQL",
      "Redis",
      "arq",
      "Next.js",
    ],
    highlights: [
      "AI-powered career assistant that aggregates live job listings and delivers personalized recommendations based on user preferences.",
      "Retrieval-Augmented Generation (RAG) chatbot for CV analysis, interview preparation, job-specific guidance, and career-related queries.",
      "Intelligent career planning features including roadmap generation, learning goal recommendations, and end-to-end application tracking within a unified platform.",
    ],
    // TODO: verify repo name
    github: "https://github.com/Mustain98/J_Buddy",
    problem:
      "Job hunting is a matching problem buried under a search problem. You have to guess the right keywords, read hundreds of postings, and judge your own fit for each one — repeatedly, forever. J_Buddy inverts it: the CV becomes the query. The system writes its own searches, fetches real listings in the background, ranks them against your actual skills and history, and exposes the whole thing through a chat agent that is structurally forbidden from inventing experience you don't have.",
    architecture: {
      caption:
        "The API never does slow work itself. It hands fetching, pool rebuilds, and the nightly cleanup to an arq worker, which is why the suggestions feed stays snappy while hundreds of listings are pulled in the background.",
    },
    features: [
      {
        title: "It reads your CV properly",
        body: "Upload a PDF or Word CV and an LLM reads it the way a human would, organizing it into skills, work experience, projects, education, and certifications. No forms to fill.",
      },
      {
        title: "It writes its own searches",
        body: "From your CV it generates a ranked list of job queries (\"Python backend developer\", \"ML intern\", …) so you never have to guess keywords. Your own searches teach it what you actually want, and once enough pile up it rethinks the whole list.",
      },
      {
        title: "Every job scored 0–100 against you",
        body: "Half the score is hard evidence — how many of your real skills and past roles literally appear in the posting. The other half is meaning — how similar the job is to your profile as a whole, even when the wording differs. Every score ships with a human-readable reason.",
      },
      {
        title: "A grounded chat agent",
        body: "The assistant knows your CV and answers from it. It can search live jobs mid-conversation, recall jobs discussed earlier, and report your fit for a specific role — and it is instructed never to invent skills or experience you don't have. If the CV doesn't support a claim, it says so.",
      },
      {
        title: "Prepare, don't just apply",
        body: "Gap analysis lists the requirements you meet and the ones you don't. Learning roadmaps are phased plans with timeframes that deliberately exclude what you already know, with tickable goals. Cover letters are drafted from CV-supported facts only, and refine in place when you say \"make it shorter, add Docker\".",
      },
      {
        title: "A kanban board that never loses a job",
        body: "Jobs you commit to land on a personal board — saved → applied → accepted / rejected. Jobs you merely glance at don't clutter it. A daily cleanup discards stale listings and re-runs the searches that found them, but anything on your board is kept forever, even if the original posting disappears from the internet.",
      },
    ],
    whyInteresting: [
      "The fit score is deliberately hybrid: lexical evidence catches literal skill overlap, embedding similarity catches jobs that describe your profile in completely different words. Neither alone is enough.",
      "Grounding is architectural, not a prompt suffix. The agent uses tools to look things up instead of guessing, and structured outputs (roadmaps, letters, gap reports) are generated into strict templates so they stay honest and well-formed.",
      "Every CV section, job, and chat message is embedded into pgvector, turning \"similar in meaning\" into \"close together\" — a map where related texts sit near each other.",
      "Redis does double duty: it holds the ranked suggestion pool for fast page-by-page reads and serves as the queue where the API leaves work for the worker.",
    ],
    stack: [
      { layer: "API", tech: "FastAPI (Python 3.13)" },
      { layer: "Database", tech: "PostgreSQL + pgvector — records and the meaning map" },
      { layer: "Cache & queue", tech: "Redis (Upstash) + arq background worker" },
      { layer: "LLM", tech: "Groq (Llama 3.3 70B) — CV parsing, query generation, chat agent" },
      { layer: "Embeddings", tech: "Jina (jina-embeddings-v3)" },
      { layer: "Job source", tech: "JSearch (RapidAPI), rotated API keys" },
      { layer: "Auth", tech: "JWT" },
    ],
    apiSurface: [
      {
        area: "Account",
        endpoints: "POST /auth/register · POST /auth/login · GET /auth/me",
      },
      { area: "CV", endpoints: "POST /cv/upload-cv · POST /cv/search" },
      {
        area: "Jobs",
        endpoints: "POST /jobs/get_live_jobs · GET /jobs/{id} (with fit score)",
      },
      {
        area: "Suggestions",
        endpoints: "GET /suggestions?page=&count= · POST /suggestions/refresh",
      },
      {
        area: "Chat",
        endpoints:
          "POST /agent/chat · GET /agent/conversations · GET /agent/conversations/{id}",
      },
      {
        area: "Roadmaps & letters",
        endpoints:
          "GET|POST|DELETE /agent/roadmaps · PATCH /agent/goals/{id} · GET|POST|PATCH|DELETE /agent/cover-letters",
      },
      {
        area: "Board",
        endpoints: "GET /board · POST /board/jobs · PATCH|DELETE /board/jobs/{job_id}",
      },
    ],
  },

  {
    slug: "health-hive",
    name: "Health Hive",
    tagline: "AI health coaching where the AI drafts and the human decides.",
    summary:
      "Four deployable apps over one database: a conversational AI coach that drafts your milestone, habits, and nutrition targets; a meal-planning engine that turns them into exact daily menus; a marketplace of verified human consultants with live video; and a daily accountability loop. When the AI detects a risky goal, it doesn't guess — it refers you to a human.",
    tech: [
      "FastAPI",
      "LangChain",
      "Groq",
      "pgvector",
      "PostgreSQL",
      "Agora",
      "WebSocket",
      "Next.js",
    ],
    highlights: [
      "AI-driven health platform that generates personalized wellness plans, meal plans, and health milestones from user goals, medical conditions, and body metrics.",
      "LLM-powered coaching and semantic retrieval workflows using LangChain and pgvector, enabling context-aware health guidance while incorporating human review for safety-critical decisions.",
      "Integrated verified consultant onboarding, appointment scheduling, real-time video consultations with Agora, follow-up sessions, and progress tracking into a unified healthcare ecosystem.",
    ],
    // TODO: verify repo name
    github: "https://github.com/Mustain98/Health-Hive",
    problem:
      "Most health apps solve one slice. A calorie counter doesn't know your goal; a meal planner doesn't know your medical conditions; a telehealth app doesn't know what you ate this week. Users stitch together four apps that never talk to each other and quit all of them. Health Hive closes the loop — and because health advice can hurt people, it is built so that the AI never has the final word.",
    architecture: {
      caption:
        "Two APIs share one Postgres database and the same JWTs. The core backend owns the schema — migrations run there and only there; the admin API only reads and writes existing tables.",
    },
    features: [
      {
        title: "AI plan-setup coach",
        body: "A streaming, tool-using chatbot that behaves like a real coach: it analyzes, explains its rationale, and discusses before writing anything, persisting changes only on explicit confirmation. Instead of dumping your profile into every prompt, the LLM calls tools (get_health_data, get_current_setup, …) only when it needs them — so general questions never touch your PII.",
      },
      {
        title: "Chat-driven CRUD with memory",
        body: "\"Change my pushups to squats\" calls update_daily_goal; \"I want to bulk instead\" recomputes your TDEE-derived nutrition target and confirms. Sessions are summarized on close, so the coach can recall past conversations or reference a specific transcript.",
      },
      {
        title: "Hybrid meal-plan generation",
        body: "The LLM generates per-slot constraints — macro splits, composition rules, required labels, condition-driven nutrient limits, and a natural-language retrieval query. That query is embedded via Jina and run through pgvector semantic search over an AI-enriched meal database. Then a deterministic assembler picks combos that actually hit the numbers, with a full fallback so generation never hard-fails, even if the LLM does.",
      },
      {
        title: "A recurring template, not a calendar",
        body: "A meal plan is a Mon–Sun template — days are weekdays, never dates. Regenerating days that are already planned doesn't silently clobber them: the overlap comes back as a 409 listing the conflicting meal slots, and you choose per-slot which to overwrite. Everything you don't pick is kept.",
      },
      {
        title: "Consultant marketplace & booking",
        body: "A deliberate domain distinction runs through booking: a request is a pending knock with no chat; a consultation chat exists only once the consultant replies; a room exists only once a time proposal is accepted. Accepted proposals book an appointment and create a live Agora video session, with separate follow-up rooms for post-session messaging.",
      },
      {
        title: "Daily accountability",
        body: "Goal logging, calories in/out with a live deficit, streaks, charts, and notifications — computed on the client's local date, so there are no server-timezone streak bugs. The coach can read your progress and adjust goals through tools, on your confirmation.",
      },
    ],
    whyInteresting: [
      "AI drafts, humans activate. Every AI-generated plan is created inactive; generation and activation are always separate steps, and exactly one plan can be active per user — enforced by partial unique indexes at the database level, not by application convention.",
      "The risk check lives in the service layer, so is_risky() runs on every activation path — manual CRUD, chatbot, and generation alike. There is no entry point that can sneak a dangerous goal past it.",
      "LLM output is treated as untrusted input: finalized plans are parsed against strict Pydantic schemas with numeric bounds before the risk check even runs, and rejected outright if malformed or out of range.",
      "LLM thinks, code decides. Creative constraint generation is the model's job; hitting the macros is deterministic code's job — and there's always a fallback.",
      "Groq keys are rotated across a pool: each request starts on the next key, so a rate-limited key fails over to the preferred model on another key before ever degrading to the fallback model.",
    ],
    stack: [
      {
        layer: "User & Admin UI",
        tech: "Next.js 16, React 19, TypeScript, Tailwind 4, Recharts, Framer Motion",
      },
      { layer: "API", tech: "FastAPI, SQLModel/SQLAlchemy, Pydantic, Alembic" },
      {
        layer: "Auth",
        tech: "JWT (python-jose) + Argon2, role-based guards (user / consultant / admin)",
      },
      {
        layer: "AI",
        tech: "LangChain + Groq (llama-3.3-70b-versatile, gpt-oss-120b fallback), structured outputs with strict Pydantic validation",
      },
      { layer: "Vector search", tech: "pgvector + Jina embeddings (1024-dim)" },
      { layer: "Realtime", tech: "Agora RTC video, Server-Sent Events for streaming chat" },
    ],
    apiSurface: [
      {
        area: "Meal plans",
        endpoints:
          "POST /api/meal-plans/generate-day · generate-week · GET /api/meal-plans/me",
      },
      {
        area: "Regeneration",
        endpoints:
          "POST /timed-meal/{id}/regenerate · POST /day/{id}/regenerate · POST /timed-meal/{id}/swap",
      },
      {
        area: "Consultations",
        endpoints:
          "POST /consultations/requests · consultant reply|decline · propose|accept time slot",
      },
      { area: "Plans", endpoints: "Draft plan · activate (as a unit) · one active per user" },
    ],
  },
];

export const getProject = (slug: string) =>
  projects.find((project) => project.slug === slug);
