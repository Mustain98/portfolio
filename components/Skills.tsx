import { Chip } from "@/components/Section";
import { skillGroups } from "@/data/profile";

export function Skills() {
  return (
    <dl className="divide-y divide-border border-y border-border">
      {skillGroups.map((group) => (
        <div key={group.label} className="grid gap-3 py-5 sm:grid-cols-[10rem_1fr] sm:gap-6">
          <dt className="font-mono text-sm text-muted">{group.label}</dt>
          <dd className="flex flex-wrap gap-2">
            {group.skills.map((skill) => (
              <Chip key={skill}>{skill}</Chip>
            ))}
          </dd>
        </div>
      ))}
    </dl>
  );
}
