import React, { useMemo, useState } from 'react';
import './Skills.css';
import { FaFilter, FaCode, FaTools, FaDatabase } from 'react-icons/fa';

type Category = 'all' | 'languages' | 'tools' | 'database';

interface Skill {
    name: string;
    level: number;
    color: string;
    category: Category;
    _idx: number;
}

const baseSkills: Omit<Skill, '_idx'>[] = [
    { name: 'C', level: 40, color: '#5555ff', category: 'languages' },
    { name: 'HTML', level: 45, color: '#e34f26', category: 'languages' },
    { name: 'CSS', level: 35, color: '#1572b6', category: 'languages' },
    { name: 'Git', level: 45, color: '#0f1fcaff', category: 'tools' },
    { name: 'Soldering', level: 30, color: '#0a9513ff', category: 'tools' },
    { name: 'MySQL', level: 40, color: '#00618a', category: 'database' }
];

const allSkills: Skill[] = baseSkills.map((s, i) => ({ ...s, _idx: i }));

const categories: { key: Category; label: string; icon: React.ReactNode }[] = [
    { key: 'all', label: 'All', icon: <FaFilter /> },
    { key: 'languages', label: 'Languages', icon: <FaCode /> },
    { key: 'tools', label: 'Tools', icon: <FaTools /> },
    { key: 'database', label: 'Database', icon: <FaDatabase /> }
];

const Skills: React.FC = () => {
    const [activeCategory, setActiveCategory] = useState<Category>('all');

    const skills = useMemo(() => (
        activeCategory === 'all'
            ? allSkills
            : allSkills.filter(s => s.category === activeCategory)
    ), [activeCategory]);

    return (
        <section id="skills" className="skills">
            <div className="container">
                <h2 className="section-title">My Skills</h2>
                <p className="section-subtitle">things that i know lol</p>

                <div className="skills-controls" role="tablist" aria-label="Skill categories">
                    <div className="segmented segmented--categories">
                        {categories.map(cat => (
                            <button
                                key={cat.key}
                                role="tab"
                                aria-selected={activeCategory === cat.key}
                                className={`segmented-button ${activeCategory === cat.key ? 'is-active' : ''}`}
                                onClick={() => setActiveCategory(cat.key)}
                            >
                                <span className="segmented-icon">{cat.icon}</span>
                                <span className="segmented-label">{cat.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="skills-grid">
                    {skills.map(skill => (
                        <div key={`${skill.name}-${skill._idx}`} className="skill-item">
                            <div className="skill-header">
                                <span className="skill-name">{skill.name}</span>
                                <span className="skill-percentage">{skill.level}%</span>
                            </div>
                            <div className="skill-bar">
                                <div className="skill-progress" style={{ width: `${skill.level}%`, background: skill.color }} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Skills;