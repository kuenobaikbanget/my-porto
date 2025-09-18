import React from 'react';
import './Footer.css';

const Footer: React.FC = () => {

    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-content">
                    <div className="footer-section">
                        <h3 className="footer-title">John Doe</h3>
                        <p className="footer-description">
                            Full Stack Developer passionate about creating amazing web experiences.
                        </p>
                    </div>

                    <div className="footer-section">
                        <h4 className="footer-subtitle">Quick Links</h4>
                        <ul className="footer-links">
                            <li><a href="#profile">Profile</a></li>
                            <li><a href="#hobbies">Hobbies</a></li>
                            <li><a href="#skills">Skills</a></li>
                            <li><a href="#social">Contact</a></li>
                        </ul>
                    </div>

                    <div className="footer-section">
                        <h4 className="footer-subtitle">Connect</h4>
                        <div className="footer-social">
                            <a href="https://github.com" target="_blank" rel="noopener noreferrer">🐙 GitHub</a>
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">📷 Instagram</a>
                            <a href="https://discord.com" target="_blank" rel="noopener noreferrer">💬 Discord</a>
                        </div>
                    </div>
                </div>

                <div className="footer-divider"></div>

                <div className="footer-bottom">
                    <p className="footer-note">
                        Built with gpt-5 hasil shopeeplus lol 💔💔<br />
                        also this web hosted on device with 2 gigs of ram, pls be patient ❤️‍🩹 
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;