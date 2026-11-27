export type ProjectAccent = 'butter' | 'mint' | 'pink';

export interface ProjectItem {
  id: string;
  specCode: string;
  title: string;
  category: string;
  period: string;
  status: string;
  role: string;
  tagline: string;
  description: string;
  overview: string;
  architecture: string[];
  highlights: string[];
  stack: string[];
  accent: ProjectAccent;
  repoUrl?: string;
  liveUrl?: string;
  orgBadge?: string;
}

export const projectsData: ProjectItem[] = [
  {
    id: 'opspilot',
    specCode: 'SPEC-01 // OPSPILOT',
    title: 'opspilot',
    category: 'Systems & AI Ops',
    period: 'Active',
    status: 'Active Development',
    role: 'Creator & Systems Developer',
    tagline: 'Self-hosted Linux monitoring & evidence-first AI incident investigation',
    description:
      'Monitors Linux host metrics and service health locally, gathering deterministic system evidence before running AI-assisted root-cause triage.',
    overview:
      'Self-hosted Linux debugging often jumps straight to guesswork before collecting concrete machine state. opspilot runs locally to capture deterministic host metrics, service status, and system logs first, giving AI-assisted root-cause triage verified evidence to reason over.',
    architecture: [
      'Go backend collector polling local Linux host metrics and service health',
      'Deterministic evidence snapshot pipeline assembled before AI-assisted triage',
      'TypeScript web interface for reviewing host telemetry and investigation trails',
      'Dockerized setup for repeatable self-hosted deployment and local testing',
    ],
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
    specCode: 'SPEC-02 // FINNOTE',
    title: 'FinNote',
    category: 'Android Mobile',
    period: 'Jun 2026',
    status: 'Shipped',
    role: 'Android Developer',
    tagline: 'The Quiet Pocket Ledger — calm expense tracker for college students',
    description:
      'Lightweight, offline-first Android ledger built to keep daily expense logging fast and distraction-free with a clear monthly budget limit tracker.',
    overview:
      'Daily expense tracking breaks down when mobile apps demand cloud accounts, heavy syncing, or cluttered multi-step screens. FinNote keeps everything on-device so students can record spending in seconds and watch their monthly budget limit at a glance.',
    architecture: [
      'Offline-first local SQLite persistence with zero external account friction',
      'Native Kotlin Android application structured around crisp XML layouts',
      'Dedicated monthly spending cap indicator calibrated for student budgets',
      'Lightweight single-hand entry flow free of background bloat',
    ],
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
    specCode: 'SPEC-03 // AERO-FIK',
    title: 'Aero FIK Project',
    category: 'Embedded & Robotics',
    period: 'Nov 2025',
    status: 'Completed · KSM Robotika',
    role: 'Hardware & Actuation Member',
    tagline: 'Polyfoam elevator & servo flight-control actuation at KSM Robotika',
    description:
      'Aero-modelling build with the Robotics Student Study Group (KSM Robotika) at UPN "Veteran" Jakarta, translating control inputs into physical surface deflection.',
    overview:
      'Developed with KSM Robotika at UPN "Veteran" Jakarta to deliver predictable mechanical pitch control on a lightweight aero-modelling airframe, pairing polyfoam surface fabrication with calibrated servo actuation.',
    architecture: [
      'Shaped and hinged polyfoam elevator control surface for lightweight pitch response',
      'Servo actuator coupled through mechanical linkage geometry for clean deflection',
      'Bench calibration of neutral trim, throw limits, and servo power stability',
      'Pre-flight mechanical and electrical checks conducted with the robotics team',
    ],
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
