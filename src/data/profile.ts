import avatarImage from '../assets/images/fotoprofile.webp';

export interface ProfileData {
  name: string;
  handle: string;
  headline: string;
  focusPills: string[];
  summary: string;
  location: string;
  university: string;
  degree: string;
  studyPeriod: string;
  gpa: string;
  statusLabel: string;
  email: string;
  cvUrl: string;
  cvFilename: string;
  avatarSrc: string;
  socials: {
    github: string;
    linkedin: string;
    instagram: string;
  };
}

export const profileData: ProfileData = {
  name: 'Akbar Dwi Maulana',
  handle: 'kueno',
  headline: '3rd-Year CS Student · IoT, Linux & Systems Builder',
  focusPills: ['IoT & Embedded', 'Linux & Networking', 'Web & Mobile'],
  summary:
    'Undergraduate Information Systems student at UPN "Veteran" Jakarta focused on practical hardware, Linux infrastructure, and dependable software. From wiring servo flight actuators and managing Ubuntu/UniFi networks to building self-hosted Go monitoring and offline-first Kotlin apps.',
  location: 'Banten / Jakarta, Indonesia',
  university: 'UPN "Veteran" Jakarta',
  degree: 'Information Systems',
  studyPeriod: 'July 2024 – Present',
  gpa: '3.87 / 4.00',
  statusLabel: 'IT Support Intern @ PT Kalapa · Open to Ops/IoT',
  email: 'akbardwi373@gmail.com',
  cvUrl: '/CV-Akbar-Dwi-Maulana.pdf',
  cvFilename: 'CV-Akbar-Dwi-Maulana.pdf',
  avatarSrc: avatarImage,
  socials: {
    github: 'https://github.com/kuenobaikbanget',
    linkedin: 'https://linkedin.com/in/akbardwimaulana',
    instagram: 'https://www.instagram.com/_akbardwi/',
  },
};
