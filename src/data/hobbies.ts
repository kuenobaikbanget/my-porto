export interface HobbyCategory {
  key: 'keyboards' | 'mice' | 'coffee' | 'cassettes';
  label: string;
  note: string;
  images: { src: string; alt: string }[];
}

const imageModules = import.meta.glob('../assets/images/hobi*.webp', {
  eager: true,
  import: 'default',
}) as Record<string, string>;

function collectImages(prefix: string, label: string): { src: string; alt: string }[] {
  return Object.entries(imageModules)
    .filter(([path]) => path.includes(`/${prefix}`))
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([, src], idx) => ({
      src,
      alt: `${label} setup photo ${idx + 1}`,
    }));
}

export const hobbiesData: HobbyCategory[] = [
  {
    key: 'keyboards',
    label: 'Keyboards',
    note: 'Custom mechanical boards, tactile switches, and GMK-inspired colorway setups.',
    images: collectImages('hobikeyboard', 'Mechanical keyboard'),
  },
  {
    key: 'mice',
    label: 'Mice',
    note: 'Lightweight gaming mice, skates, and grip experimentation.',
    images: collectImages('hobimouse', 'Gaming mouse'),
  },
  {
    key: 'coffee',
    label: 'Coffee · Hario Switch',
    note: 'Daily immersion-percolation pour-over brews on a Hario Switch.',
    images: collectImages('hobikopi', 'Hario Switch coffee'),
  },
  {
    key: 'cassettes',
    label: 'Cassettes',
    note: 'Physical analog tape collecting for off-screen listening.',
    images: collectImages('hobipita', 'Cassette tape collection'),
  },
];
