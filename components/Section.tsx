type SectionProps = {
  id?: string;
  index?: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
};

export function Section({ id, index, title, subtitle, children }: SectionProps) {
  return (
    <section id={id} className="mx-auto w-full max-w-5xl px-6 py-20 sm:py-24">
      <header className="mb-10">
        <h2 className="flex items-baseline gap-3 text-2xl font-semibold tracking-tight sm:text-3xl">
          {index && (
            <span className="font-mono text-sm font-normal text-accent">{index}</span>
          )}
          {title}
        </h2>
        {subtitle && <p className="mt-3 max-w-2xl text-muted">{subtitle}</p>}
      </header>
      {children}
    </section>
  );
}

export function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-border bg-surface px-3 py-1 font-mono text-xs text-muted transition-colors hover:border-accent-dim hover:text-fg">
      {children}
    </span>
  );
}
