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
  /** width/height are the source file's real pixel dimensions -- CaseStudyMockup
   *  needs them to render each screenshot at its own true aspect ratio instead
   *  of forcing every project into one fixed crop. */
  media: { type: "image" | "video"; src: string; width: number; height: number }[];
  /** Whether the case study's device showcase should render a phone mockup. Windows/desktop-only builds (Strata, AuraFit AI, ECHO) don't get one -- there's no mobile app to show. */
  hasMobile: boolean;
  /** Real screenshots for the device showcase, in display order. desktopScreens
   *  crossfades in the laptop frame; mobileScreens (only meaningful when
   *  hasMobile is true) crossfades independently in the phone frame -- the
   *  two aren't paired by index since a project's real desktop and mobile
   *  screenshots rarely come in matching counts. */
  desktopScreens: string[];
  mobileScreens: string[];
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
    category: "Languages",
    items: ["JavaScript", "Python"],
  },
  {
    category: "Frontend",
    items: ["ReactJS", "NextJS", "TailwindCSS"],
  },
  {
    category: "Backend & Databases",
    items: ["Node.js", "Express.js", "MongoDB", "PostgreSQL"],
  },
  {
    category: "AI & ML",
    items: [
      "Artificial Intelligence",
      "Machine Learning",
      "AI Integration",
      "LLM Applications",
      "Generative AI",
      "Prompt Engineering",
    ],
  },
  {
    category: "Tools",
    items: ["Git", "Figma"],
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
    media: [{ type: "image", src: "/images/work/strata-browser.jpg", width: 1917, height: 1021 }],
    hasMobile: false,
    desktopScreens: [
      "/images/work/strata-browser-desktop-1.jpg",
      "/images/work/strata-browser-desktop-2.jpg",
      "/images/work/strata-browser-desktop-3.jpg",
    ],
    mobileScreens: [],
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
    media: [{ type: "image", src: "/images/work/aurafit-ai.jpg", width: 1916, height: 982 }],
    hasMobile: false,
    desktopScreens: [
      "/images/work/aurafit-ai-desktop-1.jpg",
      "/images/work/aurafit-ai-desktop-2.jpg",
      "/images/work/aurafit-ai-desktop-3.jpg",
      "/images/work/aurafit-ai-desktop-4.jpg",
      "/images/work/aurafit-ai-desktop-5.jpg",
      "/images/work/aurafit-ai-desktop-6.jpg",
    ],
    mobileScreens: [],
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
      live: "https://www.examguard.online",
    },
    media: [{ type: "image", src: "/images/work/exam-guard.jpg", width: 1891, height: 866 }],
    hasMobile: true,
    desktopScreens: [
      "/images/work/exam-guard-desktop-1.jpg",
      "/images/work/exam-guard-desktop-2.jpg",
      "/images/work/exam-guard-desktop-3.jpg",
    ],
    mobileScreens: ["/images/work/exam-guard-mobile-1.jpg", "/images/work/exam-guard-mobile-2.jpg"],
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
    media: [{ type: "image", src: "/images/work/echo.jpg", width: 1112, height: 762 }],
    hasMobile: false,
    desktopScreens: [
      "/images/work/echo-desktop-1.jpg",
      "/images/work/echo-desktop-2.jpg",
      "/images/work/echo-desktop-3.jpg",
    ],
    mobileScreens: [],
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
    media: [
      { type: "image", src: "/images/work/tonys-angel-tattooz.jpg", width: 1917, height: 870 },
    ],
    hasMobile: true,
    desktopScreens: [
      "/images/work/tonys-angel-tattooz-desktop-1.jpg",
      "/images/work/tonys-angel-tattooz-desktop-2.jpg",
      "/images/work/tonys-angel-tattooz-desktop-3.jpg",
    ],
    mobileScreens: [
      "/images/work/tonys-angel-tattooz-mobile-1.jpg",
      "/images/work/tonys-angel-tattooz-mobile-2.jpg",
    ],
  },
  {
    slug: "kinetx-labs",
    title: "Kinetx Labs",
    status: "shipped",
    role: "Freelance developer, YDR Digital",
    problem:
      "Kinetx Labs is a SaaS company building products for measurable human growth. They needed a marketing site that could introduce that positioning and their flagship product without reading like a generic SaaS template.",
    outcome:
      "A product-led marketing site for Kinetx Labs, built around their \"technology for measurable human growth\" philosophy and their EVOLYN product, live in production.",
    stack: [],
    links: { live: "https://www.kinetxlabs.com" },
    media: [{ type: "image", src: "/images/work/kinetx-labs.jpg", width: 1917, height: 861 }],
    hasMobile: true,
    desktopScreens: [
      "/images/work/kinetx-labs-desktop-1.jpg",
      "/images/work/kinetx-labs-desktop-2.jpg",
      "/images/work/kinetx-labs-desktop-3.jpg",
    ],
    mobileScreens: [
      "/images/work/kinetx-labs-mobile-1.jpg",
      "/images/work/kinetx-labs-mobile-2.jpg",
    ],
  },
];
