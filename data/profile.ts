export const profile = {
  name: "Mustain Billah Taj",
  title: "Software Engineer",
  thesis: ["Backend", "Distributed Systems", "AI"],
  degree: "BSc in Software Engineering",
  university: "Islamic University of Technology (IUT)",
  location: "Dhaka, Bangladesh",
  summary:
    "Software Engineering undergraduate with interests in backend engineering, distributed systems, AI applications, and scalable system design. Experienced in developing REST APIs, real-time applications, LLM-powered systems, and PostgreSQL-based backend services using Python and FastAPI.",
  email: "mustaintaj@iut-dhaka.edu",
  phone: "+8801734090654",
  linkedin: "https://www.linkedin.com/in/mustain-billah-taj-958578228/",
  github: "https://github.com/Mustain98",
  resume: "/CV.pdf",
} as const;

export const skillGroups: { label: string; skills: string[] }[] = [
  { label: "Languages", skills: ["Python", "Java", "C++"] },
  { label: "Backend", skills: ["FastAPI", "REST APIs", "WebSocket", "WebRTC"] },
  { label: "AI / LLM", skills: ["LangChain", "Groq API", "RAG", "pgvector"] },
  { label: "Databases", skills: ["PostgreSQL", "MySQL", "MongoDB"] },
  { label: "Tools", skills: ["Docker", "Git", "Redis"] },
  { label: "Core CS", skills: ["Data Structures", "Algorithms", "OOP"] },
];
