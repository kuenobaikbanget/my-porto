export type SkillCategoryKey =
  | 'all'
  | 'iot'
  | 'linux'
  | 'dev'
  | 'security';

export interface SkillCategoryMeta {
  key: SkillCategoryKey;
  label: string;
  legend: string;
  accentHex: string;
}

export interface SkillItem {
  name: string;
  category: Exclude<SkillCategoryKey, 'all'>;
  legend: string;
}

export const skillCategories: SkillCategoryMeta[] = [
  { key: 'all', label: 'All Keys', legend: 'ALL', accentHex: '#f3edf7' },
  { key: 'iot', label: 'IoT & Hardware', legend: 'HW', accentHex: '#f3e6a2' },
  { key: 'linux', label: 'Linux & Networking', legend: 'SYS', accentHex: '#cfe0f2' },
  { key: 'dev', label: 'Dev (Web & Mobile)', legend: 'DEV', accentHex: '#c6e3d1' },
  { key: 'security', label: 'Security & Tools', legend: 'SEC', accentHex: '#eed2df' },
];

export const skillsData: SkillItem[] = [
  // IoT & Hardware
  { name: 'Arduino', category: 'iot', legend: 'MCU' },
  { name: 'ESP32', category: 'iot', legend: 'WIFI' },
  { name: 'Sensor Interfacing', category: 'iot', legend: 'I/O' },
  { name: 'Servo Actuation', category: 'iot', legend: 'PWM' },
  { name: 'PC & Laptop Assembly', category: 'iot', legend: 'RIG' },

  // Linux & Networking
  { name: 'Ubuntu', category: 'linux', legend: 'DEB' },
  { name: 'AlmaLinux', category: 'linux', legend: 'RHEL' },
  { name: 'Fedora', category: 'linux', legend: 'RPM' },
  { name: 'CachyOS', category: 'linux', legend: 'ARCH' },
  { name: 'Docker', category: 'linux', legend: 'CTR' },
  { name: 'UniFi', category: 'linux', legend: 'AP' },
  { name: 'Mikrotik', category: 'linux', legend: 'ROS' },
  { name: 'DHCP & DNS', category: 'linux', legend: 'NET' },

  // Dev (Web & Mobile)
  { name: 'TypeScript', category: 'dev', legend: 'TS' },
  { name: 'Go', category: 'dev', legend: 'GO' },
  { name: 'Kotlin', category: 'dev', legend: 'KT' },
  { name: 'Java', category: 'dev', legend: 'JVM' },
  { name: 'React', category: 'dev', legend: 'UI' },
  { name: 'Tailwind CSS', category: 'dev', legend: 'CSS' },
  { name: 'SQLite', category: 'dev', legend: 'DB' },
  { name: 'PostgreSQL', category: 'dev', legend: 'PG' },
  { name: 'Bun', category: 'dev', legend: 'JS' },

  // Security & Tools
  { name: 'Nmap', category: 'security', legend: 'SCAN' },
  { name: 'Wireshark', category: 'security', legend: 'PCAP' },
  { name: 'SQLMap', category: 'security', legend: 'AUD' },
  { name: 'Gobuster', category: 'security', legend: 'ENUM' },
  { name: 'Git', category: 'security', legend: 'VCS' },
];
