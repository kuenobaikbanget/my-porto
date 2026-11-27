export type ProjectAccent = 'butter' | 'mint' | 'pink';

export interface ProjectItem {
  id: string;
  title: string;
  category: string;
  period: string;
  tagline: string;
  description: string;
  highlights: string[];
  stack: string[];
  accent: ProjectAccent;
  repoUrl?: string;
  orgBadge?: string;
}

export const projectsData: ProjectItem[] = [
  {
    id: 'opspilot',
    title: 'opspilot',
    category: 'Systems & AI Ops',
    period: 'Active',
    tagline: 'Self-hosted Linux monitoring & evidence-first AI incident investigation',
    description:
      'Monitors Linux host metrics and service health locally, gathering deterministic system evidence before running AI-assisted root-cause triage.',
    highlights: [
      'Self-hosted architecture designed for low-overhead Linux environments',
      'Evidence-first investigation workflow that surfaces concrete logs & metrics first',
      'Containerized setup for repeatable deployment and local testing',
    ],
    stack: ['Go', 'TypeScript', 'Linux', 'Docker'],
    accent: 'butter',
    repoUrl: 'https://github.com/kuenobaikbanget/opspilot',
  },
  {
    id: 'finnote',
    title: 'FinNote',
    category: 'Android Mobile',
    period: 'Jun 2026',
    tagline: 'The Quiet Pocket Ledger — calm expense tracker for college students',
    description:
      'Lightweight, offline-first Android ledger built to keep daily expense logging fast and distraction-free with a clear monthly budget limit tracker.',
    highlights: [
      'Local SQLite persistence with zero account friction or background bloat',
      'Monthly spending cap indicator tailored for student budgets',
      'Clean native XML layouts engineered for snappy single-hand entry',
    ],
    stack: ['Kotlin', 'Android', 'SQLite', 'XML Layouts'],
    accent: 'mint',
    repoUrl: 'https://github.com/kuenobaikbanget/finnote',
  },
  {
    id: 'aero-fik',
    title: 'Aero FIK Project',
    category: 'Embedded & Robotics',
    period: 'Nov 2025',
    tagline: 'Polyfoam elevator & servo flight-control actuation at KSM Robotika',
    description:
      'Aero-modelling build with the Robotics Student Study Group (KSM Robotika) at UPN "Veteran" Jakarta, translating control inputs into physical surface deflection.',
    highlights: [
      'Designed and fabricated the polyfoam elevator control surface',
      'Integrated and calibrated servo motor linkage for reliable pitch actuation',
      'Tested mechanical throw, linkage geometry, and power stability pre-flight',
    ],
    stack: ['Embedded & IoT', 'Servo Control', 'Hardware'],
    accent: 'pink',
    orgBadge: 'KSM Robotika · UPNVJ',
  },
];
