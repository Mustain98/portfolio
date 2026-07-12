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

      <h1 className="relative text-4xl font-semibold tracking-tight sm:text-6xl">
        {profile.name}
      </h1>

      {/* the tagline is one string in the data; the pipes become the visual rhythm */}
      <p className="relative mt-6 flex max-w-3xl flex-wrap items-center gap-x-3 gap-y-1 font-mono text-sm leading-relaxed sm:text-base">
        {profile.tagline.split("|").map((part, i) => (
          <span key={part} className="flex items-center gap-3">
            {i > 0 && <span className="text-accent">|</span>}
            <span className={i === 0 ? "text-muted" : "text-fg"}>{part.trim()}</span>
          </span>
        ))}
      </p>

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
