import { Box, Chip, Edge, EdgeLabel, Frame, Note } from "@/components/diagrams/primitives";

const ID = "stream";
const ARROW = `${ID}-arrow`;

const backendModules = [
  "auth",
  "stream",
  "viewer",
  "payment",
  "earnings",
  "connect",
  "moderation",
  "preview",
];

const sfuModules = [
  "rooms",
  "media router",
  "signaling",
  "chat + mentions",
  "preview timers",
  "heartbeat",
];

export function StreamDiagram() {
  return (
    <Frame
      id={ID}
      width={920}
      height={530}
      title="Stream architecture: a Next.js frontend over a FastAPI business backend and a custom aiortc SFU, sharing a Postgres database and talking over a shared-secret internal API."
    >
      <Box
        x={310}
        y={20}
        w={300}
        h={70}
        title="Frontend"
        subtitle="Next.js 15 · studio · watch · checkout"
      />

      {/* frontend fans out: business calls to the backend, media to the SFU */}
      <Edge d="M 380 90 V 132 H 210 V 176" arrowId={ARROW} />
      <EdgeLabel x={370} y={124} anchor="end">
        REST · JWT
      </EdgeLabel>
      <Edge d="M 540 90 V 132 H 710 V 176" arrowId={ARROW} />
      <EdgeLabel x={552} y={124} anchor="start">
        WebRTC + WebSocket · ticket auth
      </EdgeLabel>

      <Box
        x={40}
        y={176}
        w={340}
        h={204}
        title="Main Backend"
        subtitle="FastAPI · SQLModel · feature modules"
      />
      {backendModules.map((label, i) => (
        <Chip
          key={label}
          label={label}
          w={145}
          x={58 + (i % 2) * 159}
          y={238 + Math.floor(i / 2) * 32}
        />
      ))}

      <Box
        x={540}
        y={176}
        w={340}
        h={204}
        title="Stream Server"
        subtitle="custom SFU · aiortc · no media vendor"
        accent
      />
      {sfuModules.map((label, i) => (
        <Chip
          key={label}
          label={label}
          w={145}
          x={558 + (i % 2) * 159}
          y={238 + Math.floor(i / 2) * 32}
        />
      ))}
      <Note x={558} y={362}>
        one publisher → N subscribers
      </Note>

      {/* the only bridge between business and media: a shared-secret internal API */}
      <Edge d="M 540 244 H 384" arrowId={ARROW} dashed />
      <EdgeLabel x={462} y={226}>
        validate ticket
      </EdgeLabel>
      <EdgeLabel x={462} y={238}>
        lifecycle events
      </EdgeLabel>

      <Edge d="M 380 312 H 536" arrowId={ARROW} dashed />
      <EdgeLabel x={462} y={330}>
        kick · unblock
      </EdgeLabel>
      <EdgeLabel x={462} y={342}>
        earnings push
      </EdgeLabel>

      <Edge d="M 135 380 V 426" arrowId={ARROW} />
      <Edge d="M 305 380 V 426" arrowId={ARROW} />

      <Box
        x={60}
        y={426}
        w={150}
        h={64}
        title="PostgreSQL"
        subtitle="streams · txns"
      />
      <Box
        x={230}
        y={426}
        w={150}
        h={64}
        title="Stripe"
        subtitle="checkout · connect"
      />

      {/* legend */}
      <path
        d="M 560 442 H 596"
        stroke="var(--accent-dim)"
        strokeWidth={1.5}
        strokeDasharray="5 4"
        fill="none"
      />
      <Note x={606} y={446}>
        internal API, secured by a shared secret
      </Note>
      <Note x={560} y={472}>
        the SFU never sees a password;
      </Note>
      <Note x={560} y={488}>
        the backend never sees an RTP packet
      </Note>
    </Frame>
  );
}
