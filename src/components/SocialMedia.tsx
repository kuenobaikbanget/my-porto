import React from 'react';
import './SocialMedia.css';
import { FaGithub, FaInstagram, FaSteam } from 'react-icons/fa';

const SocialMedia: React.FC = () => {
    const socialLinks = [
        {
            name: 'GitHub',
            url: 'https://github.com/kuenobaikbanget',
            icon: <FaGithub size={32} />,
            username: '@kuenobaikbanget',
            description: 'Check out my code repositories'
        },
        {
            name: 'Instagram',
            url: 'https://www.instagram.com/_akbardwi/',
            icon: <FaInstagram size={32} />,
            username: '@_akbardwi',
            description: 'Mostly about coffee and cats lol'
        },
        {
            name: 'Steam',
            url: 'https://steamcommunity.com/id/kueno',
            icon: <FaSteam size={32} />,
            username: 'kueno',
            description: 'Peak unemployment'
        }
    ];

    return (
        <section id="social" className="social-media">
            <div className="container">
                <h2 className="section-title">Get In Touch</h2>
                <p className="section-subtitle">Connect with me on social media</p>
                <div className="social-grid">
                    {socialLinks.map((social, index) => (
                        <a
                            key={index}
                            href={social.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="social-card"
                        >
                            <div className="social-icon">{social.icon}</div>
                            <h3 className="social-name">{social.name}</h3>
                            <p className="social-username">{social.username}</p>
                            <p className="social-description">{social.description}</p>
                            <div className="social-arrow">→</div>
                        </a>
                    ))}
                </div>

            </div>
        </section>
    );
};

export default SocialMedia;