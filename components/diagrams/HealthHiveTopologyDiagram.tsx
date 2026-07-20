import { Box, Chip, Edge, EdgeLabel, Frame, Note } from "@/components/diagrams/primitives";

const ID = "healthhive";
const ARROW = `${ID}-arrow`;

// exactly 8 — the enclosing Box is hand-sized for four chip rows and will not reflow
const coreModules = [
  "user",
  "plan",
  "meal",
  "agents/",
  "consultant",
  "consultation",
  "appointment",
  "notification",
];

const adminModules = ["verification", "user management", "content / CMS", "AI food-gen"];

const external = [
  "Groq · Llama 3.3 70B (+ gpt-oss-120b fallback)",
  "Jina · embeddings-v3 (1024-dim)",
  "Agora · live video",
  "Supabase Storage",
];

export function HealthHiveTopologyDiagram() {
  return (
    <Frame
      id={ID}
      width={920}
      height={720}
      title="Health Hive architecture: four deployable apps — user and admin frontends over a core FastAPI modular monolith and an admin API — sharing one Supabase Postgres database with pgvector and the same JWTs."
    >
      <Box
        x={40}
        y={20}
        w={360}
        h={70}
        title="User Frontend"
        subtitle="Next.js 16 · :3000"
      />
      <Box
        x={520}
        y={20}
        w={360}
        h={70}
        title="Admin Frontend"
        subtitle="Next.js · :3001"
      />

      <Edge d="M 220 90 V 152" arrowId={ARROW} />
      <EdgeLabel x={230} y={126} anchor="start">
        REST /api
      </EdgeLabel>
      <Edge d="M 700 90 V 152" arrowId={ARROW} />
      <EdgeLabel x={710} y={126} anchor="start">
        REST /api/admin
      </EdgeLabel>

      <Box
        x={40}
        y={152}
        w={360}
        h={232}
        title="Core Backend"
        subtitle="FastAPI · 12 modules + app/agents · owns the schema"
        accent
      />
      {coreModules.map((label, i) => (
        <Chip
          key={label}
          label={label}
          w={155}
          x={58 + (i % 2) * 169}
          y={214 + Math.floor(i / 2) * 32}
        />
      ))}
      <Note x={58} y={366}>
        is_risky() guards every activation path
      </Note>

      <Box
        x={520}
        y={152}
        w={360}
        h={232}
        title="Admin Backend"
        subtitle="FastAPI · moderation & CMS"
      />
      {adminModules.map((label, i) => (
        <Chip
          key={label}
          label={label}
          w={155}
          x={538 + (i % 2) * 169}
          y={214 + Math.floor(i / 2) * 32}
        />
      ))}
      <Note x={538} y={310}>
        reads and writes existing
      </Note>
      <Note x={538} y={326}>
        tables only — no migrations
      </Note>
      <Note x={538} y={366}>
        same JWTs · SECRET_KEY must match
      </Note>

      <Edge d="M 220 384 V 434" arrowId={ARROW} />
      <Edge d="M 700 384 V 434" arrowId={ARROW} />

      <Box
        x={40}
        y={434}
        w={840}
        h={94}
        title="PostgreSQL (Supabase) + pgvector"
        subtitle="users · plans · meals · embeddings · consultations · appointments"
      />
      <Note x={58} y={512}>
        one active plan per user — enforced by a partial unique index, not by convention
      </Note>

      {/* the core backend is the only caller of the external services — routed down the margin */}
      <Edge d="M 40 300 H 22 V 600 H 34" arrowId={ARROW} dashed />

      <Box
        x={40}
        y={560}
        w={840}
        h={140}
        title="External services"
        subtitle="LLM output is untrusted input: bounded Pydantic schemas, then the risk check"
      />
      {external.map((label, i) => (
        <Chip
          key={label}
          label={label}
          w={396}
          x={58 + (i % 2) * 408}
          y={626 + Math.floor(i / 2) * 30}
        />
      ))}
    </Frame>
  );
}
