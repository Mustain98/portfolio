import { profile } from "@/data/profile";

const actions = [
  { label: "Resume", href: profile.resume, primary: true },
  { label: "GitHub", href: profile.github },
  { label: "LinkedIn", href: profile.linkedin },
  { label: "Email", href: `mailto:${profile.email}` },
];

export function Hero() {
  return (
    <section className="relative mx-auto flex min-h-[88svh] w-full max-w-5xl flex-col justify-center px-6 pt-28 pb-16">
      {/* single accent glow, anchored behind the headline */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-10 left-0 h-72 w-72 rounded-full bg-accent/10 blur-[110px]"
      />

      <p className="relative font-mono text-sm text-accent">
        {profile.degree} · {profile.university}
      </p>

      <h1 className="relative mt-5 text-4xl font-semibold tracking-tight sm:text-6xl">
        {profile.name}
      </h1>

      <p className="relative mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-base text-muted sm:text-lg">
        {profile.thesis.map((word, i) => (
          <span key={word} className="flex items-center gap-3">
            {i > 0 && <span className="text-border">·</span>}
            <span className="text-fg">{word}</span>
          </span>
        ))}
      </p>

      <p className="relative mt-8 max-w-2xl leading-relaxed text-muted">{profile.summary}</p>

      <div className="relative mt-10 flex flex-wrap gap-3">
        {actions.map((action) => (
          <a
            key={action.label}
            href={action.href}
            target={action.href.startsWith("mailto:") ? undefined : "_blank"}
            rel="noreferrer"
            className={
              action.primary
                ? "rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-bg transition-opacity hover:opacity-90"
                : "rounded-md border border-border px-5 py-2.5 text-sm text-muted transition-colors hover:border-accent-dim hover:text-fg"
            }
          >
            {action.label}
          </a>
        ))}
      </div>
    </section>
  );
}
