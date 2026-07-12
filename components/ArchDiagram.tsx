import { HealthHiveDiagram } from "@/components/diagrams/HealthHiveDiagram";
import { JBuddyDiagram } from "@/components/diagrams/JBuddyDiagram";
import { StreamDiagram } from "@/components/diagrams/StreamDiagram";

const diagrams: Record<string, () => React.ReactElement> = {
  stream: StreamDiagram,
  "j-buddy": JBuddyDiagram,
  "health-hive": HealthHiveDiagram,
};

export function ArchDiagram({ slug, caption }: { slug: string; caption: string }) {
  const Diagram = diagrams[slug];
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
