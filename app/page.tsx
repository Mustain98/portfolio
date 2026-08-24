import { Contact } from "@/components/Contact";
import { Hero } from "@/components/Hero";
import { ProjectCard } from "@/components/ProjectCard";
import { Section } from "@/components/Section";
import { Skills } from "@/components/Skills";
import { profile } from "@/data/profile";
import { projects } from "@/data/projects";

export default function Home() {
  return (
    <>
      <Hero />

      <Section id="about" index="01" title="About">
        <p className="max-w-3xl leading-relaxed text-muted">{profile.overview}</p>
      </Section>

      <Section
        id="projects"
        index="02"
        title="Projects"
        subtitle="Three things I built end to end. Each one has a write-up covering how it's put together and the parts that gave me trouble."
      >
        <div className="grid gap-6">
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </Section>

      <Section id="skills" index="03" title="Skills">
        <Skills />
      </Section>

      <Section
        id="contact"
        index="04"
        title="Get in touch"
        subtitle="I'm looking for backend, distributed systems, and AI engineering roles. Happy to hear about anything interesting."
      >
        <Contact />
      </Section>
    </>
  );
}
