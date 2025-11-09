export interface Author {
  /** Displayed name, e.g., "Leask, P." or "Patrick Leask" */
  name: string;
  /** Optional explicit override: when true, always bold; when false, never bold; when undefined, try auto-detect via team list. */
  team?: boolean;
}

export interface ResearchPaper {
  title: string;
  url: string;
  authors: Author[];
  year: number;
  month?: string; // e.g., "April", "July"
  venue: string; // e.g., "International Conference on Machine Learning (ICML 2025), Vancouver, Canada"
  tags: string[];
}

export const research: ResearchPaper[] = [
  {
    title:
      "Inference-Time Decomposition of Activations (ITDA): A Scalable Approach to Interpreting Large Language Models",
    url: "https://durham-repository.worktribe.com/output/4012842",
    authors: [
      { name: "Leask, P.", team: true },
      { name: "Al Moubayed, N." },
    ],
    year: 2025,
    month: "July",
    venue:
      "International Conference on Machine Learning (ICML 2025), Vancouver, Canada",
    tags: ["Interpretability", "ICML 2025"],
  },
  {
    title: "Sparse Autoencoders Do Not Find Canonical Units of Analysis",
    url: "https://durham-repository.worktribe.com/output/3475474",
    authors: [
      { name: "Leask, P.", team: true },
      { name: "Bussmann, B." },
      { name: "Pearce, M. T." },
      { name: "Isaac Bloom, J." },
      { name: "Tigges, C." },
      { name: "Al Moubayed, N." },
      { name: "Sharkey, L." },
      { name: "Nanda, N." },
    ],
    year: 2025,
    month: "April",
    venue:
      "The Thirteenth International Conference on Learning Representations (ICLR 2025), Singapore",
    tags: ["Interpretability", "ICLR 2025"],
  },
  {
    title:
      "Probing by Analogy: Decomposing Probes into Activations for Better Interpretability and Inter-Model Generalization",
    url: "https://openreview.net/forum?id=IhI1qGyk6S",
    authors: [
      { name: "Leask, P.", team: true },
      { name: "Al Moubayed, N." },
    ],
    year: 2025,
    venue:
      "Mechanistic Interpretability Workshop at NeurIPS 2025",
    tags: ["Interpretability", "NeurIPS 2025"],
  },
  {
    title:
      "Order by Scale: Relative-Magnitude Relational Composition in Attention-Only Transformers",
    url: "https://openreview.net/forum?id=vWRVzNtk7W",
    authors: [
      { name: "Farrell, T.", team: true },
      { name: "Leask, P.", team: true },
      { name: "Al Moubayed, N." },
    ],
    year: 2025,
    venue:
      "Socially Responsible and Trustworthy Foundation Models at NeurIPS 2025",
    tags: ["Interpretability", "NeurIPS 2025"],
  },
];
