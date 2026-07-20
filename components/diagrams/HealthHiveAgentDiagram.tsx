import { Box, Chip, Edge, EdgeLabel, Frame, Note } from "@/components/diagrams/primitives";

const ID = "healthhiveagent";
const ARROW = `${ID}-arrow`;

// each specialist gets the same loop but a different prompt and a different slice of the tools
const specialists = [
  "milestone · 5 tools",
  "daily_goals · 6",
  "nutrition · 6",
  "meals · 5",
  "coach · 9 (all)",
];

const middleware = [
  "token usage",
  "call limit = 25",
  "tool retry ×2",
  "summarize 30→10",
  "HITL (opt-in)",
];

const writeGuards = ["validate before ask", "risk.py BMI + rate bounds", "macros reconcile ±8%"];

const mealPipeline = [
  "DayConstraintPlan (LLM)",
  "pgvector top-K",
  "hard allergen filter",
  "combo assembly",
];

export function HealthHiveAgentDiagram() {
  return (
    <Frame
      id={ID}
      width={920}
      height={900}
      title="Health Hive setup-chat agent: a keyword router picks one of five specialist personas, each with a narrowed tool set, then LangChain create_agent runs a LangGraph ReAct loop behind a middleware stack; writes go through a single batch tool that is validated before the user is asked to approve it, with state in Postgres."
    >
      <Box
        x={40}
        y={20}
        w={840}
        h={64}
        title="Plan-setup chat (Next.js 16)"
        subtitle="raw fetch + ReadableStream — SSE parsed by hand"
      />

      <Edge d="M 460 84 V 140" arrowId={ARROW} />
      <EdgeLabel x={470} y={116} anchor="start">
        POST /sessions/{"{id}"}/messages
      </EdgeLabel>

      <Box
        x={40}
        y={140}
        w={840}
        h={76}
        title="turn_router.route_turn()"
        subtitle="keyword match — no LLM call on the hot path"
      />
      <Note x={58} y={204}>
        mis-routing is never fatal: coach holds every tool
      </Note>

      <Edge d="M 460 216 V 252" arrowId={ARROW} />

      <Box
        x={40}
        y={252}
        w={840}
        h={104}
        title="Specialist"
        subtitle="routing narrows the tool surface, not just the prompt"
        accent
      />
      {specialists.map((label, i) => (
        <Chip key={label} label={label} w={155} x={58 + i * 160} y={318} />
      ))}

      <Edge d="M 460 356 V 392" arrowId={ARROW} />

      <Box
        x={40}
        y={392}
        w={840}
        h={150}
        title="create_agent() — LangGraph ReAct loop"
        subtitle="chain(llm_candidates()) · 3 Groq keys × 2 models, round-robin"
        accent
      />
      {middleware.map((label, i) => (
        <Chip key={label} label={label} w={155} x={58 + i * 160} y={458} />
      ))}
      <Note x={58} y={512}>
        middleware is outermost-first; HITL appended only when approval_mode is on
      </Note>

      <Edge d="M 245 542 V 578" arrowId={ARROW} />
      <Edge d="M 675 542 V 578" arrowId={ARROW} />

      <Box
        x={40}
        y={578}
        w={410}
        h={170}
        title="propose_plan_changes"
        subtitle="the one batch write tool"
      />
      {writeGuards.map((label, i) => (
        <Chip key={label} label={label} w={374} x={58} y={640 + i * 30} />
      ))}

      <Box
        x={470}
        y={578}
        w={410}
        h={170}
        title="Meal pipeline"
        subtitle="one LLM call, then deterministic"
      />
      {mealPipeline.map((label, i) => (
        <Chip key={label} label={label} w={179} x={488 + (i % 2) * 193} y={648 + Math.floor(i / 2) * 30} />
      ))}

      {/* the approval interrupt travels back up to the UI — routed up the left margin,
          which is the only lane clear of the boxes between here and the frontend */}
      <Edge d="M 40 663 H 22 V 52 H 38" arrowId={ARROW} dashed />
      <EdgeLabel x={32} y={112} anchor="start">
        interrupt → approve / edit / reject
      </EdgeLabel>

      <Edge d="M 245 748 V 784" arrowId={ARROW} />
      <Edge d="M 675 748 V 784" arrowId={ARROW} />

      <Box
        x={40}
        y={784}
        w={840}
        h={100}
        title="PostgreSQL + pgvector"
        subtitle="transcript · session summaries · PostgresSaver checkpointer · meal embeddings"
      />
      <Note x={58} y={860}>
        checkpointer thread id is per-turn (session:message_count), not per-session
      </Note>
    </Frame>
  );
}
