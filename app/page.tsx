import { Contact } from "@/components/Contact";
import { Hero } from "@/components/Hero";
import { ProjectCard } from "@/components/ProjectCard";
import { Section } from "@/components/Section";
import { Skills } from "@/components/Skills";
import { projects } from "@/data/projects";

export default function Home() {
  return (
    <>
      <Hero />

      <Section
        id="projects"
        index="01"
        title="Projects"
        subtitle="Three systems built end to end. Each case study covers the architecture, the design decisions, and the parts that were genuinely hard."
      >
        <div className="grid gap-6">
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </Section>

      <Section id="skills" index="02" title="Skills">
        <Skills />
      </Section>

      <Section
        id="contact"
        index="03"
        title="Get in touch"
        subtitle="Open to backend, distributed systems, and AI engineering roles."
      >
        <Contact />
      </Section>
    </>
  );
}
