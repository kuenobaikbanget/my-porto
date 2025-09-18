import React, { useEffect, useState } from 'react';
import './Header.css';

const sections = [
    { id: 'profile', label: 'Profile' },
    { id: 'hobbies', label: 'Hobbies' },
    { id: 'skills', label: 'Skills' },
    { id: 'social', label: 'Contact' },
];

const Header: React.FC = () => {
    const [active, setActive] = useState<string>('');
    const [menuOpen, setMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handler = () => {
            setScrolled(window.scrollY > 8);
        };
        window.addEventListener('scroll', handler);
        handler();
        return () => window.removeEventListener('scroll', handler);
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setActive(entry.target.id);
                    }
                });
            },
            { rootMargin: '-45% 0px -50% 0px', threshold: [0, 0.25, 0.5, 1] }
        );

        sections.forEach(s => {
            const el = document.getElementById(s.id);
            if (el) observer.observe(el);
        });
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        // Close menu when resizing above breakpoint
        const resize = () => {
            if (window.innerWidth > 820 && menuOpen) setMenuOpen(false);
        };
        window.addEventListener('resize', resize);
        return () => window.removeEventListener('resize', resize);
    }, [menuOpen]);

    const toggleMenu = () => setMenuOpen(o => !o);
    const closeMenu = () => setMenuOpen(false);

    return (
        <header className={`header ${scrolled ? 'header--scrolled' : ''}`}>
            <div className="container header-inner">
                <div className="brand">
                    <h1 className="header-title">kuenobaikbanget</h1>
                </div>
                <button className={`nav-toggle ${menuOpen ? 'is-open' : ''}`} aria-label="Toggle navigation" onClick={toggleMenu}>
                    <span className="bar" />
                    <span className="bar" />
                    <span className="bar" />
                </button>
                <nav className={`header-nav ${menuOpen ? 'open' : ''}`}>
                    {sections.map(s => (
                        <a
                            key={s.id}
                            href={`#${s.id}`}
                            className={`nav-link ${active === s.id ? 'active' : ''}`}
                            onClick={closeMenu}
                        >
                            {s.label}
                        </a>
                    ))}
                    <div className="nav-underline" aria-hidden="true" />
                </nav>
            </div>
        </header>
    );
};

export default Header;