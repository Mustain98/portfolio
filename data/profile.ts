export const profile = {
  name: "Mustain Billah Taj",
  title: "Backend & AI Systems Engineer",
  location: "Dhaka, Bangladesh",
  // the one-line headline under the name
  tagline: "BSc in Software Engineering, Islamic University of Technology (3rd year)",
  // the About section, and the site's meta description
  overview:
    "Software Engineering student focused on backend development and agentic, LLM-powered applications. I build REST APIs and real-time services in Python and FastAPI, with clean service boundaries and background workers that keep the system responsive. On the AI side, I build retrieval-augmented and agentic systems with LangChain and LangGraph — routing, tool use, vector search.",
  email: "mustaintaj@iut-dhaka.edu",
  phone: "+8801734090654",
  linkedin: "https://www.linkedin.com/in/mustain-billah-taj-958578228/",
  github: "https://github.com/Mustain98",
  resume: "/CV.pdf",
  avatar: "/profile.jpeg",
} as const;

export const skillGroups: { label: string; skills: string[] }[] = [
  { label: "Languages", skills: ["Python", "Java", "C++", "TypeScript"] },
  { label: "Backend", skills: ["FastAPI", "REST APIs", "WebSocket", "WebRTC", "SSE"] },
  { label: "AI / LLM", skills: ["LangChain", "LangGraph", "Groq", "RAG", "pgvector"] },
  {
    label: "ML / DL",
    skills: [
      "PyTorch",
      "pandas",
      "ANN",
      "CNN",
      "RNN",
      "LSTM",
      "Regression",
      "Random Forest",
      "XGBoost",
    ],
  },
  { label: "Databases", skills: ["PostgreSQL", "MySQL", "MongoDB", "Redis"] },
  { label: "Frontend", skills: ["Next.js", "React", "Tailwind CSS"] },
  { label: "Auth", skills: ["JWT", "Argon2 / bcrypt", "Role-based access"] },
  { label: "Tools", skills: ["Docker", "Git", "Stripe", "Alembic", "arq"] },
  {
    label: "Core CS",
    skills: ["Data Structures", "Algorithms", "OOP", "System Design"],
  },
];
