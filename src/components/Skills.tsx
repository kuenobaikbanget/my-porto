import React from 'react';
import './Skills.css';

const Skills: React.FC = () => {
    const skills = [
        { name: 'C', level: 40, color: '#5555ff' },
        { name: 'HTML', level: 45, color: '#e34f26' },
        { name: 'CSS', level: 35, color: '#1572b6' },
        { name: 'Git', level: 45, color: '#0f1fcaff' },
        { name: 'Soldering', level: 30, color: '#0a9513ff' },
        { name: 'MySQL', level: 40, color: '#00618a' }
    ];

    return (
        <section id="skills" className="skills">
            <div className="container">
                <h2 className="section-title">My Skills</h2>
                <p className="section-subtitle">things that i know lol</p>
                <div className="skills-grid">
                    {skills.map((skill, index) => (
                        <div key={index} className="skill-item">
                            <div className="skill-header">
                                <span className="skill-name">{skill.name}</span>
                                <span className="skill-percentage">{skill.level}%</span>
                            </div>
                            <div className="skill-bar">
                                <div
                                    className="skill-progress"
                                    style={{
                                        width: `${skill.level}%`,
                                        background: skill.color
                                    }}
                                ></div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
};

export default Skills;