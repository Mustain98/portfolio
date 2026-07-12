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
  stack: { layer: string; tech: string }[];
  apiSurface?: { area: string; endpoints: string }[];
};

export const projects: Project[] = [
  {
    slug: "stream",
    name: "Stream",
    tagline: "A pay-per-view live streaming platform on a WebRTC server I wrote myself.",
    summary:
      "Creators go live over WebRTC and get paid for it. Viewers can watch free streams, sample paid ones through a timed preview, and pay with Stripe to see the rest. Broadcasters see their earnings tick up while they stream, and the money is paid out to them automatically once the stream ends.",
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
      "The media server is my own code, not a wrapper around Mediasoup or LiveKit. It handles signaling, forwarding video between peers, rooms, and who's allowed in.",
      "Payments run through Stripe end to end: checkout, webhooks, the platform's cut, payouts to the creator, and automatic refunds if a stream ends too early.",
      "Business logic and video live in separate services and only meet through a short-lived ticket, so the media server never sees a password.",
    ],
    // TODO: verify repo name
    github: "https://github.com/Mustain98/Stream",
    problem:
      "Most streaming projects are a thin layer over Mediasoup, LiveKit, or Agora, so the interesting part is someone else's code. I wanted to understand how video actually gets from one browser to a hundred others, so I built the media server myself with aiortc. Everything in it is mine: the peer connections, forwarding tracks between them, room lifecycle, signaling, and the preview timers. Doing it that way also meant I could keep payments and passwords completely out of the media server and let a short-lived ticket be the only thing connecting the two halves.",
    architecture: {
      caption:
        "Three services and one database. The media server doesn't know anything about passwords or payments, and the business backend never touches a video packet.",
    },
    features: [
      {
        title: "Live broadcasting",
        body: "One broadcaster's video and audio gets forwarded out to however many people are watching. The WebSocket connection handles the whole WebRTC handshake: the offer and answer, exchanging ICE candidates, and cleaning up when someone leaves. Broadcasters can pause and resume, and if one disappears without ending the stream properly, a heartbeat check notices and cleans it up.",
      },
      {
        title: "Tickets instead of credentials",
        body: "Viewers never talk to the media server with their real credentials. The backend checks who they are and whether they're allowed to watch, then hands them a short-lived ticket. The media server checks that ticket with the backend before letting them into the room.",
      },
      {
        title: "Paying for a stream",
        body: "A broadcaster sets a price, a currency, and optionally a free preview window. Payment goes through Stripe Checkout and is confirmed by a webhook, with a reconcile endpoint to fall back on if a webhook goes missing. Every Stripe call carries an idempotency key, and the database has a unique index that makes it impossible to charge someone twice for the same stream.",
      },
      {
        title: "Previews that actually end",
        body: "The free preview isn't a countdown in the browser that anyone could edit around. The media server holds the timer, and when it runs out it drops the connection. The page then swaps in an overlay pointing you at checkout.",
      },
      {
        title: "Payouts and refunds",
        body: "Broadcasters connect their own Stripe account from the dashboard. When a stream ends, each viewer's payment (minus the platform fee) is transferred to the broadcaster. If the stream ended too early to count, everyone who paid gets refunded automatically instead. Nobody has to file a support ticket.",
      },
      {
        title: "Chat, moderation, earnings",
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
      "PostgreSQL",
      "Redis",
      "arq",
      "Next.js",
    ],
    highlights: [
      "Pulls in real job listings and scores each one against your CV, so the suggestions are ranked by how well they actually fit you.",
      "A chatbot that answers from your CV and the job data rather than making things up, and can search live listings mid-conversation.",
      "Handles the rest of the hunt too: what you're missing for a role, a learning plan to get there, cover letters, and a board to track applications.",
    ],
    // TODO: verify repo name
    github: "https://github.com/Mustain98/J_Buddy",
    problem:
      "Looking for a job means guessing the right search terms, reading through hundreds of postings, and trying to judge honestly whether you're a fit for each one. It's slow and you have to keep doing it. I wanted to flip that around so the CV does the searching: the system writes its own queries from what's in it, pulls in listings in the background, and ranks them against your real skills. The other half of the problem is trust. An assistant that cheerfully tells you you're qualified for anything is useless, so this one only answers from what your CV actually says.",
    architecture: {
      caption:
        "The API doesn't do any slow work itself. Fetching listings, rebuilding the ranked pool, and the nightly cleanup all get handed to a background worker, which is what keeps the feed quick to load.",
    },
    features: [
      {
        title: "Reading your CV",
        body: "Upload a PDF or Word file and an LLM pulls it apart into skills, work experience, projects, education, and certifications. There are no forms to fill in.",
      },
      {
        title: "It writes its own searches",
        body: "It generates its own list of job queries from your CV, like \"Python backend developer\" or \"ML intern\", so you don't have to guess keywords. When you search for something yourself it takes note, and once you've done that enough times it reconsiders the whole list.",
      },
      {
        title: "A fit score for every job",
        body: "Each job gets a score out of 100. Half of it comes from counting how many of your actual skills and past roles show up in the posting. The other half compares the meaning of the whole posting against your profile, which catches good matches that happen to use different words. Each score comes with a sentence explaining it.",
      },
      {
        title: "Chat that stays honest",
        body: "The assistant has your CV and answers from it. It can search live listings in the middle of a conversation, remember jobs you talked about earlier, and tell you your fit for a specific role. It's told never to claim skills or experience you don't have, so if your CV doesn't back something up, it says so.",
      },
      {
        title: "Getting ready, not just applying",
        body: "Gap analysis shows what a job asks for that you already have and what you don't. Roadmaps are step-by-step learning plans split into phases, skipping anything you already know, and you can tick goals off as you go. Cover letters are written from your real experience, and if you say \"make it shorter, mention Docker\", it edits the same letter rather than making a new one.",
      },
      {
        title: "A board for what you're chasing",
        body: "Jobs you actually commit to move onto a board: saved, applied, then accepted or rejected. Jobs you only glanced at don't clutter it up. Listings go stale after a week and get cleared out, but anything on your board stays, even if the original posting is long gone.",
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
    slug: "health-hive",
    name: "Health Hive",
    tagline: "A health platform where the AI writes the plan and a person decides on it.",
    summary:
      "A coach you talk to that builds you a plan: a goal, daily habits, calorie targets, and a weekly meal structure. A meal engine turns that into actual daily menus. And when something looks risky, it stops and points you to a real nutritionist or doctor instead of guessing.",
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
      "Builds you a plan from your goal, your body metrics, and any medical conditions: habits, calorie targets, and daily menus.",
      "The AI only ever writes a draft. Nothing takes effect until you activate it, and risky goals get refused and sent to a real professional.",
      "Verified nutritionists and doctors are part of the product: book them, chat, and meet over video, with follow-ups afterwards.",
    ],
    // TODO: verify repo name
    github: "https://github.com/Mustain98/HealthHive",
    problem:
      "Health apps each solve one piece of the problem. Your calorie counter doesn't know your goal, your meal planner doesn't know about your medical conditions, and your telehealth app has no idea what you ate this week. You end up juggling four apps that don't talk to each other, and eventually you drop all of them. This one keeps everything in one place. The harder question was safety: bad health advice can genuinely hurt someone, so I built it so the AI can suggest but never decide. Nothing it writes takes effect until you look at it and turn it on, and anything that looks dangerous gets refused and handed to a real professional.",
    architecture: {
      caption:
        "Two APIs on one database, sharing the same login tokens. The core backend owns the schema and is the only place migrations run; the admin API just reads and writes tables that already exist.",
    },
    features: [
      {
        title: "The setup coach",
        body: "A chatbot that acts like a coach instead of a form. It explains its reasoning and talks things through before it writes anything down, and it only saves when you say yes. It also pulls your health data with tools only when it actually needs it, so an ordinary question never drags your medical history into the prompt.",
      },
      {
        title: "Changing things by talking",
        body: "\"Swap my pushups for squats\" updates the goal. \"I want to bulk instead\" recalculates your calorie target and asks you to confirm. Goals, targets, and meal structure can all be created, edited, or deleted from the chat. Sessions get summarized when they close, so the coach can look back at what you discussed before.",
      },
      {
        title: "Building the meal plan",
        body: "The LLM works out the constraints for each meal slot: how to split the macros, what goes in a main versus a side, which labels are needed, and any limits your conditions imply, like capping sodium. That gets turned into an embedding and searched against the meal database, and then plain deterministic code picks the combination that actually hits the numbers. If the LLM fails, there's a fallback path, so generation never dies outright.",
      },
      {
        title: "A week, not a calendar",
        body: "The meal plan is a Monday-to-Sunday template rather than specific dates. If you regenerate days that are already planned, it won't quietly overwrite them; it comes back and tells you which meals would be replaced, and you pick which ones you actually want redone.",
      },
      {
        title: "Nothing goes live on its own",
        body: "Everything the AI produces is saved as an inactive draft until you review and activate it, and only one plan can be active at a time, which the database enforces with a unique index rather than trusting the code to remember. The risk check sits in the service layer, so it runs whether the request came from the chatbot, the generator, or someone editing by hand.",
      },
      {
        title: "Booking a real person",
        body: "Consultants get verified by an admin before they show up. You send a request describing your issue; if they reply, that opens a chat, and either of you can propose a time. Accepting a time books the appointment and opens a video room. Afterwards there's a separate follow-up room for messaging, kept apart from the booking chat.",
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
        layer: "AI",
        tech: "LangChain + Groq (llama-3.3-70b-versatile, gpt-oss-120b as fallback), rotated across up to three keys",
      },
      { layer: "Vector search", tech: "pgvector + Jina embeddings (1024-dim)" },
      { layer: "Realtime", tech: "Agora video, Server-Sent Events for streaming chat" },
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
          "POST /consultations/requests · consultant reply|decline · propose|accept a time slot",
      },
      {
        area: "Plans",
        endpoints: "Draft plan · activate as a unit · one active plan per user",
      },
    ],
  },
];

export const getProject = (slug: string) =>
  projects.find((project) => project.slug === slug);
