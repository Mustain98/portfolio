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
  architecture: { diagram: string; caption: string }[];
  features: { title: string; body: string }[];
  stack: { layer: string; tech: string }[];
  apiSurface?: { area: string; endpoints: string }[];
};

export const projects: Project[] = [
  {
    slug: "health-hive",
    name: "Health Hive",
    tagline: "An AI-based meal planner and health guide with real consultants in the loop.",
    summary:
      "An AI-powered meal planner and health guide where users build personalized plans through conversation, and verified consultants step in for guidance, follow-ups, and live video calls.",
    tech: [
      "FastAPI",
      "LangChain v1",
      "LangGraph",
      "Groq",
      "PostgreSQL + pgvector",
      "SSE",
      "Agora",
      "Next.js 16",
    ],
    highlights: [
      "AI-driven health planning through chat: you set milestones, daily goals, and nutrition targets by talking to a chatbot that works from your health data.",
      "LLM-powered meal planning. The model derives per-meal nutrition constraints from your targets, vector retrieval finds candidates, and the plan is assembled to hit the macros while respecting every dietary restriction.",
      "Verified nutritionists and doctors in the loop, with messaging, structured follow-ups, and live video consultations booked through the platform.",
    ],
    github: "https://github.com/Mustain98/Health-Hive",
    demo: "https://health-hive-ten.vercel.app",
    problem:
      "Health apps each solve one piece of the problem. Your calorie counter doesn't know your goal, your meal planner doesn't know about your medical conditions, and your telehealth app has no idea what you ate this week. You end up juggling four apps that don't talk to each other, and eventually you drop all of them. This one keeps everything in one place. The harder question was safety, and I learned it the expensive way: one real session with an underweight user saved a dangerous weight-loss target while the agent was in the middle of telling them it hadn't. The code had mutated the record before running the risk check and there was nothing to roll it back. That single session is why the whole agent layer got rebuilt — validation now runs before you're ever asked to approve anything, and there's exactly one tool that writes instead of nine.",
    architecture: [
      {
        diagram: "health-hive-topology",
        caption:
          "Four deployable apps on one Postgres, sharing the same login tokens. The core backend owns the schema and is the only place migrations run; the admin API just reads and writes tables that already exist. All the AI lives in the core backend.",
      },
      {
        diagram: "health-hive-agent",
        caption:
          "One agent per turn, not a crowd of them. A keyword router picks the persona and hands it only the tools that persona is allowed to touch, so a question about your weight goal cannot reach the meal tools. Every write goes through a single batch tool that validates against the safety bounds before you're asked to approve it — so when a proposal is wrong, the model gets the safe values back and corrects itself in the same turn instead of making you reject it.",
      },
    ],
    features: [
      {
        title: "AI-driven health planning through chat",
        body: "You create your plan by talking to a chatbot that works from your health data, setting milestones, daily goals, and daily nutrition targets tailored to you. Behind the chat, a keyword router picks one of five specialists for each turn: milestone, daily goals, nutrition, meals, or a general coach. Picking a specialist narrows the tools as well as the prompt, so a turn routed to milestone can't reach the meal tools. The router is plain string matching rather than a model call, because it runs on every turn and a round trip there would only add latency. When it guesses wrong the turn still works, because the coach fallback holds all nine tools.",
      },
      {
        title: "Preferences in plain language",
        body: "You describe your food preferences, dietary restrictions, and health conditions in plain text, and the system factors all of it into the plans it generates. There are no forms to fill in, and a condition like hypertension becomes a real constraint further down — a cap on sodium applied when the meal plan is built.",
      },
      {
        title: "LLM-powered meal planning",
        body: "One LLM call derives the constraints for each meal slot from your targets: how to split the macros, what goes in a main versus a side, which labels are needed, and any limits your conditions imply. That becomes an embedding searched against the meal database, and then plain deterministic code picks the combination that hits the numbers. The model is told about your allergies, but that's advisory only — the real enforcement is a hard filter applied after retrieval, so a hallucinated label costs you a worse meal, never an unsafe one.",
      },
      {
        title: "One write tool, validated before approval",
        body: "There are nine tools in total, but only one of them writes: everything the agent wants to change gets batched into a single proposal. That proposal is validated before you ever see it, against real bounds — safe BMI range, a cap on weekly weight change, and a check that the macros add up to the calorie target within 8%. If something violates a bound, the error handed back to the model carries the safe values with it, so it corrects itself in the same turn instead of making you reject it and start over.",
      },
      {
        title: "Approve, edit, or reject each item",
        body: "Approval mode is a per-session toggle. With it on, the agent suspends mid-run and waits: a batch of nine goals unrolls into nine separate decisions rather than one all-or-nothing prompt. Editing isn't a form, it's just a sentence back to the model, which re-proposes a corrected version. What you decided gets written into the transcript, which is what stops it proposing the same rejected item again next turn.",
      },
      {
        title: "Drafts, then activation",
        body: "Everything the AI produces is saved as an inactive draft until you review and activate it, and only one plan can be active at a time, enforced by a unique index in the database. The risk check sits in the service layer, so it runs whether the request came from the chatbot, the generator, or someone editing by hand.",
      },
      {
        title: "Summarizing long conversations",
        body: "Long chats get compressed in flight: past 30 messages it summarizes down to the last 10. When a session closes it writes a durable summary, so a later chat can look back at what you discussed weeks ago without replaying the whole transcript. Token usage is counted per session, so the cost of all this stays visible.",
      },
      {
        title: "Consultant interaction and follow-up",
        body: "You connect with verified nutritionists and doctors, exchange messages, and continue through structured follow-up threads after your sessions. Consultants are verified by an admin before they show up at all. You send a request describing your issue; if they reply, that opens a chat, and either of you can propose a time. The follow-up room is kept separate from the booking chat.",
      },
      {
        title: "Real-time video consultations",
        body: "High-touch guidance happens over live video calls, booked directly with a consultant through the platform. Accepting a proposed time books the appointment and opens the video room.",
      },
    ],
    stack: [
      {
        layer: "User & Admin UI",
        tech: "Next.js 16, React 19, TypeScript, Tailwind 4, Recharts, Framer Motion",
      },
      { layer: "API", tech: "FastAPI, SQLModel/SQLAlchemy, Pydantic, Alembic" },
      {
        layer: "Auth",
        tech: "JWT (python-jose) + Argon2, with user / consultant / admin roles",
      },
      {
        layer: "Agent",
        tech: "LangChain v1 create_agent on LangGraph — one ReAct loop per turn, five specialist personas behind a keyword router",
      },
      {
        layer: "Models",
        tech: "Groq: llama-3.3-70b-versatile, gpt-oss-120b as fallback, rotated across up to three keys",
      },
      {
        layer: "Agent state",
        tech: "PostgresSaver checkpointer for approval interrupts, summarization middleware, per-session summaries",
      },
      { layer: "Vector search", tech: "pgvector + Jina embeddings (1024-dim)" },
      {
        layer: "Realtime",
        tech: "Agora video, Server-Sent Events for the setup chat (everything else polls)",
      },
    ],
    apiSurface: [
      {
        area: "Setup chat",
        endpoints:
          "POST /api/plan-setup/sessions/{id}/messages (SSE) · /resume · PATCH /sessions/{id} {approval_mode}",
      },
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
          "POST /consultations/requests · consultant reply|decline · propose|accept a time slot",
      },
      {
        area: "Plans",
        endpoints: "Draft plan · activate as a unit · one active plan per user",
      },
    ],
  },

  {
    slug: "j-buddy",
    name: "J_Buddy",
    tagline: "A job-hunting assistant that reads your CV and does the searching for you.",
    summary:
      "You upload your CV once. After that it works out which roles suit you, goes and finds real listings, scores each one against your background, and you can just talk to it: find me an ML internship in Dhaka, what am I missing for this job, write me a cover letter.",
    tech: [
      "FastAPI",
      "LangChain",
      "Groq",
      "pgvector",
      "Redis + arq",
      "PostgreSQL",
      "Next.js",
    ],
    highlights: [
      "Upload a CV and an LLM decomposes it into skills, experience, projects and education, then derives its own job queries from it and reconsiders them as you search.",
      "A hybrid fit score out of 100, half lexical and half semantic, so a good match still surfaces when the posting is worded differently. Every score ships with a one-sentence justification.",
      "Nothing slow runs in the request path: listing fetches, ranked-pool rebuilds and nightly cleanup all go to an arq worker on Redis, which is what keeps the feed instant.",
    ],
    github: "https://github.com/Mustain98/J_buddy",
    problem:
      "Job hunting means guessing search terms, reading through hundreds of postings, and honestly judging your own fit for each one. It's slow and you have to keep doing it. I wanted to invert it: the CV does the searching. The system writes its own queries from what's in it, pulls listings in the background, and ranks them against your real skills. The other half of the problem is trust. An assistant that cheerfully tells you you're qualified for anything is useless, so this one only answers from what your CV actually says.",
    architecture: [
      {
        diagram: "j-buddy",
        caption:
          "The API doesn't do any slow work itself. Fetching listings, rebuilding the ranked pool, and the nightly cleanup all get handed to a background worker, which is what keeps the feed quick to load.",
      },
    ],
    features: [
      {
        title: "CV → structured profile",
        body: "Upload a PDF or Word file and an LLM decomposes it into skills, work experience, projects, education, and certifications. No forms.",
      },
      {
        title: "Self-generating search queries",
        body: "It derives its own job queries from your CV, like \"Python backend developer\" or \"ML intern\", so you don't have to guess keywords. It learns from searches you run yourself, and reconsiders the whole query set once you've run enough of them.",
      },
      {
        title: "A hybrid fit score out of 100",
        body: "Half lexical — how many of your actual skills and past roles appear in the posting — and half semantic, comparing the whole posting against your profile to catch matches worded differently. Every score ships with a one-sentence justification.",
      },
      {
        title: "Chat that stays honest",
        body: "The assistant has your CV and answers from it. It can search live listings in the middle of a conversation, recall jobs you talked about earlier, and tell you your fit for a specific role. It's instructed never to claim skills or experience the CV doesn't back up, so if your CV doesn't support something, it says so.",
      },
      {
        title: "Preparation, not just applications",
        body: "Gap analysis shows what a job asks for that you already have and what you don't. Roadmaps are phased learning plans that skip anything you already know, with goals you can tick off as you go. Cover letters are written from your real experience, and \"make it shorter, mention Docker\" edits the same letter rather than generating a new one.",
      },
      {
        title: "Nothing slow runs in the request path",
        body: "Listing fetches, ranked-pool rebuilds and the nightly cleanup all go to an arq worker on Redis, which is what keeps the feed instant. The API never sits waiting on a third-party job board while you load a page.",
      },
      {
        title: "An application board",
        body: "Jobs you commit to move onto a board: saved, applied, then accepted or rejected. Jobs you only glanced at don't clutter it up. Listings expire after a week and get cleared out, but anything on your board survives, even after the original posting is gone.",
      },
    ],
    stack: [
      { layer: "API", tech: "FastAPI (Python 3.13)" },
      { layer: "Database", tech: "PostgreSQL + pgvector, for both records and embeddings" },
      { layer: "Cache & queue", tech: "Redis (Upstash) with an arq background worker" },
      { layer: "LLM", tech: "Groq (Llama 3.3 70B) for CV parsing, query generation, and chat" },
      { layer: "Embeddings", tech: "Jina (jina-embeddings-v3)" },
      { layer: "Job source", tech: "JSearch (RapidAPI), with rotated API keys" },
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
    slug: "stream",
    name: "Stream",
    tagline:
      "A pay-per-view live streaming platform with real-time video and integrated payments.",
    summary:
      "A pay-per-view platform where creators broadcast live to viewers over WebRTC, offer free previews, and get paid through an end-to-end Stripe checkout and payout flow.",
    tech: [
      "FastAPI",
      "aiortc",
      "WebRTC",
      "Stripe",
      "WebSocket",
      "PostgreSQL",
      "Docker",
      "Next.js 15",
    ],
    highlights: [
      "Real-time live streaming over WebRTC. Broadcasters stream audio and video to many viewers at once, with room lifecycle, signaling and preview cutoffs handled in real time by a media server written from scratch with aiortc.",
      "End-to-end Stripe payments: checkout, webhook confirmation, platform fees, creator payouts, and automatic refunds when a stream ends early, with idempotent handling so nothing is charged twice.",
      "Clean separation of payments and media. Business logic and the streaming service are linked only by short-lived access tickets, so credentials and payments never touch the media layer.",
    ],
    github: "https://github.com/Mustain98/stream",
    problem:
      "Most streaming projects are a thin layer over Mediasoup, LiveKit, or Agora, so the interesting part is someone else's code. I wanted to understand how video actually gets from one browser to a hundred others, so I built the media server myself with aiortc. Everything in it is mine: the peer connections, forwarding tracks between them, room lifecycle, signaling, and the preview timers. Doing it that way also meant I could keep payments and passwords completely out of the media server and let a short-lived ticket be the only thing connecting the two halves.",
    architecture: [
      {
        diagram: "stream",
        caption:
          "Three services and one database. The media server doesn't know anything about passwords or payments, and the business backend never touches a video packet.",
      },
    ],
    features: [
      {
        title: "Real-time live streaming over WebRTC",
        body: "One broadcaster's audio and video is forwarded out to however many people are watching. The WebSocket connection handles the whole WebRTC handshake: the offer and answer, exchanging ICE candidates, and cleaning up when someone leaves. Broadcasters can pause and resume, and if one disappears without ending the stream properly, a heartbeat check notices and cleans up the room.",
      },
      {
        title: "Pay-per-view access with free previews",
        body: "Viewers watch a free preview, then unlock full access through checkout. The preview limit is enforced server-side: the media server holds the timer, and when it runs out it drops the connection, so there's no browser-side countdown to work around. The page then swaps in an overlay pointing you at checkout.",
      },
      {
        title: "End-to-end Stripe payments",
        body: "A broadcaster sets a price, a currency, and optionally a free preview window. Payment goes through Stripe Checkout and is confirmed by a webhook, with a reconcile endpoint to fall back on if a webhook goes missing. Every Stripe call carries an idempotency key, and a unique index in the database makes it impossible to charge someone twice for the same stream.",
      },
      {
        title: "Creator payouts and refunds",
        body: "Broadcasters connect their own Stripe account from the dashboard. When a stream ends, each viewer's payment (minus the platform fee) is transferred to the broadcaster. If the stream ended too early to count, everyone who paid gets refunded automatically instead. Nobody has to file a support ticket.",
      },
      {
        title: "Clean separation of payments and media",
        body: "Business logic and the streaming service are decoupled, linked only by short-lived access tickets. Viewers never talk to the media server with their real credentials: the backend checks who they are and whether they're allowed to watch, then hands them a ticket that the media server verifies before letting them into the room.",
      },
      {
        title: "Live chat, moderation, and earnings",
        body: "Chat and @mentions run over the same WebSocket the video signaling uses, so there's no extra infrastructure for it. Broadcasters can block or kick viewers, and a block is enforced in both places: the media server removes them from the room immediately, and the backend won't issue them another ticket. Confirmed payments are pushed to the broadcaster mid-stream so the earnings panel updates live.",
      },
    ],
    stack: [
      { layer: "Frontend", tech: "Next.js 15, React 19, TypeScript" },
      { layer: "Main Backend", tech: "FastAPI, SQLModel, PostgreSQL, Stripe" },
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
        endpoints: "POST /ticket/{id} · GET /{id}/access · PATCH /{id}/access-settings",
      },
      {
        area: "Payments",
        endpoints:
          "POST /stream/{id}/checkout · POST /payments/stripe/webhook · POST /payments/stripe/reconcile-checkout",
      },
      {
        area: "Earnings",
        endpoints: "GET /{id}/earnings · GET /earnings/history · GET /spend/history",
      },
      {
        area: "Moderation",
        endpoints: "POST|DELETE /{id}/block/{user_id} · GET /{id}/blocked-users",
      },
      { area: "SFU", endpoints: "WS /ws (signaling + chat) · GET /rooms" },
    ],
  },
];

export const getProject = (slug: string) =>
  projects.find((project) => project.slug === slug);
