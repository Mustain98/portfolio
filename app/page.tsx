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
        subtitle="Three things I built end to end. Each one has a write-up covering how it's put together and the parts that gave me trouble."
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
        subtitle="I'm looking for backend, distributed systems, and AI engineering roles. Happy to hear about anything interesting."
      >
        <Contact />
      </Section>
    </>
  );
}
