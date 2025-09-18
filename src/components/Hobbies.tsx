import React from 'react';
import './Hobbies.css';

interface HobbyCategory {
    key: string;
    title: string;
    description: string;
    images: string[];
}

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
    }
];

const Hobbies: React.FC = () => {
    return (
        <section id="hobbies" className="hobbies">
            <div className="container">
                <h2 className="section-title">Hobbies</h2>
                <p className="section-subtitle">A snapshot of my interests.</p>
                <div className="hobbies-categories">
                    {categories.map(cat => (
                        <div key={cat.key} className={`hobby-card hobby-category ${cat.key === 'hobipita' ? 'hobby-category--center' : ''}`}>
                            <h3 className="hobby-name">{cat.title}</h3>
                            <p className="hobby-description">{cat.description}</p>
                            <div className={`hobby-images ${cat.key === 'hobipita' ? 'hobby-images--center' : ''}`}>
                                {cat.images.length === 0 && (
                                    <div className="hobby-images-empty">No images yet</div>
                                )}
                                {cat.images.map((src, idx) => (
                                    <div className="hobby-image-wrapper" key={idx}>
                                        <img src={src} alt={`${cat.title} ${idx + 1}`} loading="lazy" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Hobbies;