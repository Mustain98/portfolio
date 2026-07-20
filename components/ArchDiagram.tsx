import { HealthHiveAgentDiagram } from "@/components/diagrams/HealthHiveAgentDiagram";
import { HealthHiveTopologyDiagram } from "@/components/diagrams/HealthHiveTopologyDiagram";
import { JBuddyDiagram } from "@/components/diagrams/JBuddyDiagram";
import { StreamDiagram } from "@/components/diagrams/StreamDiagram";

// keyed by diagram id, not slug — a project can carry more than one figure
const diagrams: Record<string, () => React.ReactElement> = {
  stream: StreamDiagram,
  "j-buddy": JBuddyDiagram,
  "health-hive-topology": HealthHiveTopologyDiagram,
  "health-hive-agent": HealthHiveAgentDiagram,
};

export function ArchDiagram({ diagram, caption }: { diagram: string; caption: string }) {
  const Diagram = diagrams[diagram];
  if (!Diagram) return null;

  return (
    <figure>
      <Diagram />
      <figcaption className="mt-4 max-w-2xl text-sm leading-relaxed text-muted">
        {caption}
      </figcaption>
    </figure>
  );
}
