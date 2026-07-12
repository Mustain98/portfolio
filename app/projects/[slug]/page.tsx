import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArchDiagram } from "@/components/ArchDiagram";
import { Chip } from "@/components/Section";
import { getProject, projects } from "@/data/projects";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};

  return {
    title: project.name,
    description: project.tagline,
    openGraph: { title: project.name, description: project.tagline },
  };
}

function Block({
  index,
  title,
  children,
}: {
  index: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-border py-14">
      <h2 className="mb-8 flex items-baseline gap-3 text-xl font-semibold tracking-tight sm:text-2xl">
        <span className="font-mono text-sm font-normal text-accent">{index}</span>
        {title}
      </h2>
      {children}
    </section>
  );
}

export default async function ProjectPage({ params }: Params) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  return (
    <article className="mx-auto w-full max-w-5xl px-6 pt-32 pb-20">
      <Link
        href="/#projects"
        className="font-mono text-xs text-muted transition-colors hover:text-accent"
      >
        ← back to projects
      </Link>

      <header className="mt-8 pb-14">
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">{project.name}</h1>
        <p className="mt-4 max-w-2xl text-lg text-accent">{project.tagline}</p>
        <p className="mt-6 max-w-2xl leading-relaxed text-muted">{project.summary}</p>

        <div className="mt-7 flex flex-wrap gap-2">
          {project.tech.map((tech) => (
            <Chip key={tech}>{tech}</Chip>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href={project.github}
            target="_blank"
            rel="noreferrer"
            className="rounded-md border border-accent-dim px-5 py-2.5 text-sm text-accent transition-colors hover:bg-accent-dim/15"
          >
            View source ↗
          </a>
          {project.demo && (
            <a
              href={project.demo}
              target="_blank"
              rel="noreferrer"
              className="rounded-md border border-border px-5 py-2.5 text-sm text-muted transition-colors hover:border-accent-dim hover:text-fg"
            >
              Live demo ↗
            </a>
          )}
        </div>
      </header>

      <Block index="01" title="The problem">
        <p className="max-w-3xl leading-relaxed text-muted">{project.problem}</p>
      </Block>

      <Block index="02" title="Architecture">
        <ArchDiagram slug={project.slug} caption={project.architecture.caption} />
      </Block>

      <Block index="03" title="What it does">
        <div className="grid gap-6 sm:grid-cols-2">
          {project.features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-xl border border-border bg-surface p-6 transition-colors hover:border-accent-dim"
            >
              <h3 className="font-medium text-fg">{feature.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">{feature.body}</p>
            </div>
          ))}
        </div>
      </Block>

      <Block index="04" title="Stack">
        <dl className="divide-y divide-border border-y border-border">
          {project.stack.map((row) => (
            <div key={row.layer} className="grid gap-1 py-4 sm:grid-cols-[12rem_1fr] sm:gap-6">
              <dt className="font-mono text-sm text-accent">{row.layer}</dt>
              <dd className="text-sm leading-relaxed text-muted">{row.tech}</dd>
            </div>
          ))}
        </dl>
      </Block>

      {project.apiSurface && (
        <Block index="05" title="API surface">
          <dl className="divide-y divide-border border-y border-border">
            {project.apiSurface.map((row) => (
              <div key={row.area} className="grid gap-2 py-4 sm:grid-cols-[12rem_1fr] sm:gap-6">
                <dt className="font-mono text-sm text-accent">{row.area}</dt>
                {/* long endpoint lists scroll in place rather than widening the page */}
                <dd className="overflow-x-auto">
                  <code className="font-mono text-xs leading-relaxed break-words text-muted">
                    {row.endpoints}
                  </code>
                </dd>
              </div>
            ))}
          </dl>
        </Block>
      )}

      <div className="border-t border-border pt-10">
        <Link
          href="/#projects"
          className="font-mono text-sm text-muted transition-colors hover:text-accent"
        >
          ← back to projects
        </Link>
      </div>
    </article>
  );
}
