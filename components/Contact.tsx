import { profile } from "@/data/profile";

const channels = [
  { label: "Email", value: profile.email, href: `mailto:${profile.email}` },
  { label: "Phone", value: profile.phone, href: `tel:${profile.phone}` },
  { label: "LinkedIn", value: "mustain-billah-taj", href: profile.linkedin },
  { label: "GitHub", value: "Mustain98", href: profile.github },
];

export function Contact() {
  return (
    <div className="grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2">
      {channels.map((channel) => (
        <a
          key={channel.label}
          href={channel.href}
          target={channel.href.startsWith("http") ? "_blank" : undefined}
          rel="noreferrer"
          className="group flex items-center justify-between gap-4 bg-surface px-6 py-5 transition-colors hover:bg-surface-hover"
        >
          <div className="min-w-0">
            <p className="font-mono text-xs text-muted">{channel.label}</p>
            <p className="mt-1 truncate text-fg transition-colors group-hover:text-accent">
              {channel.value}
            </p>
          </div>
          <span className="shrink-0 text-muted transition-all group-hover:translate-x-0.5 group-hover:text-accent">
            ↗
          </span>
        </a>
      ))}
    </div>
  );
}
