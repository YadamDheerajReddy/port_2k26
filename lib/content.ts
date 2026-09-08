/**
 * Typed content source, per docs/TRD.md §5. Copy is a first-pass draft
 * pulled from real repo READMEs and docs/PRD.md, not final marketing copy.
 * Status labels are load-bearing: PRD.md §5.3 requires shipped vs
 * in-progress vs concept vs research to stay honest, never inflated.
 */

export type Project = {
  slug: string;
  title: string;
  status: "shipped" | "in-progress" | "concept" | "research";
  role: string;
  problem: string;
  outcome: string;
  stack: string[];
  links: { live?: string; github?: string; paper?: string };
  media: { type: "image" | "video"; src: string }[];
};

export type Profile = {
  name: string;
  email: string;
  github: string;
  linkedin: string;
  resume: string;
};

export const profile: Profile = {
  name: "Dheeraj Reddy",
  email: "hello@dheerajdev.space",
  github: "https://github.com/YadamDheerajReddy",
  linkedin: "https://www.linkedin.com/in/yadam-dheeraj-reddy-69a588384/",
  resume: "/Dheeraj-Reddy-Resume.pdf",
};

export type SkillGroup = {
  category: string;
  items: string[];
};

export const skillGroups: SkillGroup[] = [
  {
    category: "Languages & Frameworks",
    items: ["JavaScript", "TypeScript", "React", "Next.js", "React Native"],
  },
  {
    category: "Backend & Data",
    items: ["Supabase", "PostgreSQL", "REST APIs", "Rust"],
  },
  {
    category: "AI / ML",
    items: ["Python", "Machine Learning", "Local-first AI", "Ollama"],
  },
  {
    category: "Design & Product",
    items: ["Brand Systems", "UI/UX Design", "Product Specs", "Content Architecture"],
  },
];

export type ProcessStep = {
  step: string;
  title: string;
  description: string;
};

export const processSteps: ProcessStep[] = [
  {
    step: "01",
    title: "Discover",
    description:
      "A short audit of what exists today and what the project actually needs, so scope is grounded in reality before anything is designed.",
  },
  {
    step: "02",
    title: "Design & Spec",
    description:
      "A written spec and design direction you can review and revise before a single line of production code gets written.",
  },
  {
    step: "03",
    title: "Build",
    description: "Development in visible stages, not one long silence before a reveal.",
  },
  {
    step: "04",
    title: "Launch",
    description: "Deployment, DNS, hosting, and a handoff you can actually maintain.",
  },
];

export const projects: Project[] = [
  {
    slug: "strata-browser",
    title: "Strata",
    status: "in-progress",
    role: "Solo builder",
    problem:
      "Closing a browser tab throws away the thread you were following: which pages, which layout, how far you'd scrolled. Bookmarks save a URL, not a workspace.",
    outcome:
      "A local-first desktop browser on real Chromium (via CEF), with a Rust backend and React chrome, that quietly remembers your browsing context and lets you restore a whole workspace as a named snapshot. Nothing leaves the machine: no account, no cloud, no sync server.",
    stack: ["TypeScript", "Rust", "React", "CEF / Chromium"],
    links: { github: "https://github.com/YadamDheerajReddy/Strata-Browser" },
    media: [],
  },
  {
    slug: "aurafit-ai",
    title: "AuraFit AI",
    status: "in-progress",
    role: "Solo builder",
    problem:
      "Calorie and body-transformation trackers usually mean handing your health data to a cloud service you don't control.",
    outcome:
      "A privacy-first, fully local calorie and body-transformation tracker: a Tauri desktop app with a React interface and on-device AI, so tracking never leaves the user's machine.",
    stack: ["TypeScript", "Tauri", "React", "Local AI"],
    links: { github: "https://github.com/YadamDheerajReddy/aurafit-ai" },
    media: [],
  },
  {
    slug: "exam-guard",
    title: "ExamGuard",
    status: "in-progress",
    role: "Solo builder",
    problem:
      "Institutions still run exam hall allocation and identity checks off a printed seating chart and a clipboard at the door.",
    outcome:
      "A smart exam allocation and identity-verification system: admins map students to halls and seats, each student gets a barcode pass with a hidden seat reveal window, and invigilators verify identity by scanning it on a phone, online or fully offline. Built as a Next.js admin console and student portal plus an Expo scanner app, on Supabase.",
    stack: ["Next.js", "React", "Expo", "Supabase", "TypeScript"],
    links: {
      github: "https://github.com/YadamDheerajReddy/exam-guard",
      live: "https://exam-guard-two.vercel.app",
    },
    media: [],
  },
  {
    slug: "echo",
    title: "ECHO",
    status: "shipped",
    role: "Solo builder",
    problem:
      "Getting things done on Windows means switching between a launcher, an AI assistant, clipboard managers, and separate automation tools.",
    outcome:
      "An AI-native command palette for Windows: one keyboard shortcut opens a launcher, local AI assistant, clipboard history with OCR, voice input, and workflow automation. Runs offline-first, AI on-device via Ollama and speech-to-text via Whisper.cpp, with cloud AI available strictly opt-in.",
    stack: ["Rust", "Tauri", "Ollama", "Whisper.cpp"],
    links: {
      github:
        "https://github.com/YadamDheerajReddy/ECHO-Everyday_Computing_Human_Operator",
    },
    media: [],
  },
  {
    slug: "tonys-angel-tattooz",
    title: "Tony's Angel Tattooz",
    status: "shipped",
    role: "Freelance developer, YDR Digital",
    problem:
      "A working tattoo studio needed a real web presence: something that reads as considered and editorial, not a generic template.",
    outcome:
      "A React and Vite single-page site with a monochromatic, editorial design, delivered end to end including DNS and hosting. First paid client project under YDR Digital, live in production.",
    stack: ["React", "Vite"],
    links: { live: "https://tonysangeltattooz.in" },
    media: [],
  },
];
