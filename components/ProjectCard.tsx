import Link from "next/link";
import { Chip } from "@/components/Section";
import type { Project } from "@/data/projects";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="group relative rounded-xl border border-border bg-surface p-6 transition-all duration-300 hover:-translate-y-1 hover:border-accent-dim hover:bg-surface-hover hover:shadow-[0_0_40px_-12px_var(--accent-dim)] sm:p-8">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h3 className="flex items-center gap-3 text-xl font-semibold tracking-tight sm:text-2xl">
          {project.name}
          {project.demo && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-accent-dim bg-accent-dim/10 px-2.5 py-1 font-mono text-[10px] font-normal text-accent">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              live
            </span>
          )}
        </h3>

        {/* z-10 keeps these above the card's stretched link */}
        <div className="relative z-10 flex items-center gap-4 font-mono text-xs">
          {project.demo && (
            <a
              href={project.demo}
              target="_blank"
              rel="noreferrer"
              className="text-muted transition-colors hover:text-accent"
            >
              Live site ↗
            </a>
          )}
          <a
            href={project.github}
            target="_blank"
            rel="noreferrer"
            className="text-muted transition-colors hover:text-accent"
          >
            GitHub ↗
          </a>
        </div>
      </div>

      <p className="mt-2 text-sm text-accent">{project.tagline}</p>
      <p className="mt-4 leading-relaxed text-muted">{project.summary}</p>

      <ul className="mt-6 space-y-2.5">
        {project.highlights.map((highlight) => (
          <li key={highlight} className="flex gap-3 text-sm leading-relaxed text-muted">
            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent-dim" />
            {highlight}
          </li>
        ))}
      </ul>

      <div className="mt-6 flex flex-wrap gap-2">
        {project.tech.map((tech) => (
          <Chip key={tech}>{tech}</Chip>
        ))}
      </div>

      <Link
        href={`/projects/${project.slug}`}
        className="mt-7 inline-flex items-center gap-2 text-sm font-medium text-fg transition-colors group-hover:text-accent"
      >
        {/* stretched link: the whole card is the click target, GitHub link excepted via z-10 */}
        <span className="absolute inset-0 rounded-xl" aria-hidden />
        Read the case study
        <span className="transition-transform group-hover:translate-x-1">→</span>
      </Link>
    </article>
  );
}
