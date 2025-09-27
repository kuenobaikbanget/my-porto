import React from 'react';
import './Hobbies.css';
import { useRevealOnScroll } from '../hooks/useRevealOnScroll';

interface HobbyCategory {
    key: string;
    title: string;
    description: string;
    images: string[];
}

interface HobbyCategoryCardProps {
    category: HobbyCategory;
    index: number;
}

const HobbyCategoryCard: React.FC<HobbyCategoryCardProps> = ({ category, index }) => {
    const { ref, isVisible } = useRevealOnScroll<HTMLDivElement>({ threshold: 0.2 });
    const isCentered = category.key === 'hobipita';

    return (
        <div
            ref={ref}
            className={`hobby-card hobby-category ${isCentered ? 'hobby-category--center' : ''} ${isVisible ? 'is-visible' : ''}`}
            style={{ transitionDelay: `${0.15 + index * 0.1}s` }}
        >
            <h3 className="hobby-name">{category.title}</h3>
            <p className="hobby-description">{category.description}</p>
            <div className={`hobby-images ${isCentered ? 'hobby-images--center' : ''}`}>
                {category.images.length === 0 ? (
                    <div className="hobby-images-empty">No images yet</div>
                ) : (
                    category.images.map((src, idx) => (
                        <div className="hobby-image-wrapper" key={idx} style={{ transitionDelay: `${0.15 + index * 0.1 + idx * 0.04}s` }}>
                            <img src={src} alt={`${category.title} ${idx + 1}`} loading="lazy" />
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

// Dynamically import all images in assets/images
// Vite's import.meta.glob will return a map of paths to functions or modules; using eager to get URLs directly
const imageModules = import.meta.glob('../assets/images/*.{jpg,jpeg,png,webp,svg}', { eager: true, import: 'default' }) as Record<string, string>;

// Helper to filter images by prefix
function collect(prefix: string): string[] {
    return Object.entries(imageModules)
        .filter(([path]) => path.includes(`/${prefix}`))
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([, mod]) => mod);
}

const categories: HobbyCategory[] = [
    {
        key: 'hobipita',
        title: 'Cassette Tape Collection',
        description: '',
        images: collect('hobipita')
    },
    {
        key: 'hobikeyboard',
        title: 'Keyboard',
        description: '',
        images: collect('hobikeyboard')
    },
    {
        key: 'hobimouse',
        title: 'Mouse',
        description: '',
        images: collect('hobimouse')
    },
    {
        key: 'hobikopi',
        title: 'Coffee',
        description: '',
        images: collect('hobikopi')
    }
];

const Hobbies: React.FC = () => {
    const { ref, isVisible } = useRevealOnScroll<HTMLElement>({ threshold: 0.15 });

    return (
        <section
            id="hobbies"
            ref={ref}
            className="hobbies"
        >
            <div className={`container reveal-section ${isVisible ? 'is-visible' : ''}`}>
                <h2 className="section-title reveal-item">Hobbies</h2>
                <p className="section-subtitle reveal-item" style={{ transitionDelay: '0.05s' }}>A snapshot of my interests.</p>
                <div className="hobbies-categories">
                    {categories.map((cat, index) => (
                        <HobbyCategoryCard key={cat.key} category={cat} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Hobbies;