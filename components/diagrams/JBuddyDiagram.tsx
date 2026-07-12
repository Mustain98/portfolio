import { Box, Chip, Edge, EdgeLabel, Frame, Note } from "@/components/diagrams/primitives";

const ID = "jbuddy";
const ARROW = `${ID}-arrow`;

const apiModules = [
  "auth",
  "cv",
  "jobs",
  "suggestions",
  "chat agent",
  "roadmaps",
  "cover letters",
  "board",
];

const workerJobs = ["fetch listings", "score & rank", "rebuild pool", "nightly cleanup"];

export function JBuddyDiagram() {
  return (
    <Frame
      id={ID}
      width={920}
      height={644}
      title="J_Buddy architecture: a FastAPI service and an arq background worker sharing Redis as both a queue and a ranked-suggestion cache, backed by Postgres with pgvector, fed by the JSearch API and Groq/Jina models."
    >
      <Box x={40} y={20} w={220} h={62} title="Client" subtitle="REST + JWT" />
      <Edge d="M 150 82 V 136" arrowId={ARROW} />

      <Box
        x={40}
        y={136}
        w={340}
        h={204}
        title="FastAPI"
        subtitle="the receptionist · never does slow work"
      />
      {apiModules.map((label, i) => (
        <Chip
          key={label}
          label={label}
          w={145}
          x={58 + (i % 2) * 159}
          y={198 + Math.floor(i / 2) * 32}
        />
      ))}

      <Box
        x={540}
        y={136}
        w={340}
        h={204}
        title="arq worker"
        subtitle="the back office · heavy lifting"
        accent
      />
      {workerJobs.map((label, i) => (
        <Chip
          key={label}
          label={label}
          w={145}
          x={558 + (i % 2) * 159}
          y={198 + Math.floor(i / 2) * 32}
        />
      ))}
      <Note x={558} y={290}>
        keeps the feed snappy while
      </Note>
      <Note x={558} y={306}>
        hundreds of listings are pulled
      </Note>

      <Edge d="M 380 196 H 536" arrowId={ARROW} />
      <EdgeLabel x={460} y={186}>
        enqueue
      </EdgeLabel>

      <Edge d="M 540 268 H 384" arrowId={ARROW} />
      <EdgeLabel x={460} y={288}>
        ranked pool
      </EdgeLabel>

      <Edge d="M 120 340 V 396" arrowId={ARROW} />
      <Edge d="M 340 340 V 368 H 420 V 396" arrowId={ARROW} />
      <Edge d="M 580 340 V 368 H 500 V 396" arrowId={ARROW} />
      <Edge d="M 800 340 V 396" arrowId={ARROW} />
      <EdgeLabel x={806} y={368} anchor="start">
        live jobs
      </EdgeLabel>

      <Box
        x={40}
        y={396}
        w={200}
        h={78}
        title="PostgreSQL"
        subtitle="+ pgvector"
      />
      <Note x={58} y={462}>
        cv · jobs · chats · board
      </Note>

      <Box x={350} y={396} w={220} h={78} title="Redis" subtitle="Upstash" />
      <Note x={368} y={462}>
        ranked pool + task queue
      </Note>

      <Box x={680} y={396} w={200} h={78} title="JSearch" subtitle="RapidAPI" />
      <Note x={698} y={462}>
        rotated API keys
      </Note>

      {/* both the API and the worker call the models; corridors run between the data boxes */}
      <Edge d="M 300 516 V 344" arrowId={ARROW} dashed />
      <Edge d="M 620 516 V 344" arrowId={ARROW} dashed />

      <Box
        x={40}
        y={516}
        w={840}
        h={108}
        title="AI models"
        subtitle="grounded: the agent looks things up with tools instead of guessing"
      />
      <Chip x={58} y={584} w={390} label="Groq · Llama 3.3 70B — CV parsing · query gen · chat agent" />
      <Chip x={466} y={584} w={396} label="Jina · jina-embeddings-v3 — the meaning map (pgvector)" />
    </Frame>
  );
}
