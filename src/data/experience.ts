export interface ExperienceItem {
  id: string;
  role: string;
  organization: string;
  location: string;
  period: string;
  current?: boolean;
  bullets: string[];
  tags: string[];
}

export interface EducationItem {
  institution: string;
  degree: string;
  period: string;
  gpa: string;
  notes: string[];
}

export const experienceData: ExperienceItem[] = [
  {
    id: 'pt-kalapa',
    role: 'IT Support Intern',
    organization: 'PT Kalapa Technology Putera',
    location: 'Jakarta Selatan',
    period: 'Aug 2026 – Present',
    current: true,
    bullets: [
      'Managed and maintained Linux servers running Ubuntu and AlmaLinux.',
      'Configured, monitored, and debugged office network infrastructure using UniFi and Mikrotik.',
      'Maintained employee laptops (hardware diagnostics & OS/software maintenance) and resolved day-to-day IT tickets.',
    ],
    tags: ['Ubuntu', 'AlmaLinux', 'UniFi', 'Mikrotik'],
  },
  {
    id: 'pt-datasoft',
    role: 'Internship Student',
    organization: 'PT Datasoft Informatika Technologi',
    location: 'Tangerang Selatan',
    period: 'Sep 2022 – Nov 2022',
    bullets: [
      'Diagnosed and resolved desktop PC, printer, and client software issues.',
      'Upgraded SSD storage and RAM on all-in-one PCs to cut boot times and improve daily responsiveness.',
      'Authored clear internal SOP documentation for hardware upgrade procedures.',
    ],
    tags: ['Hardware Upgrade', 'Troubleshooting', 'Documentation'],
  },
];

export const educationData: EducationItem = {
  institution: 'Universitas Pembangunan Nasional "Veteran" Jakarta',
  degree: 'B.Sc. in Information Systems',
  period: 'July 2024 – Present',
  gpa: '3.87 / 4.00',
  notes: [
    'Active in KSM Robotika (Aero-modelling & Embedded Systems)',
    'Focus on IoT hardware, Linux administration, networking, and systems tooling',
  ],
};
