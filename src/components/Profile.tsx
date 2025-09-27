import React from 'react';
import './Profile.css';
import profileImage from '../assets/images/fotoprofile.jpg';

const Profile: React.FC = () => {
    return (
        <section id="profile" className="profile">
            <div className="container">
                <div className="profile-content">
                    <div className="profile-image-container">
                        <img
                            src={profileImage}
                            alt="Profile"
                            className="profile-image"
                        />
                    </div>
                    <div className="profile-info">
                        <h2 className="profile-name">Akbar Dwi</h2>
                        <p className="profile-title">unemployment</p>
                        <p className="profile-description">
                            I'm an undergraduate student majoring in Information Systems. I'm genuinely <strong>curious</strong> about new things. That curiosity drives me to try, take apart, and understand how things work, from simple hardware to IoT and small automation ideas. I enjoy experimenting, debugging, and turning raw concepts into something real.
                        </p>
                        <div className="profile-details">
                            <div className="detail-item">
                                <strong>Location:</strong> Banten, Indonesia
                            </div>
                            <div className="detail-item profile-education single-line">
                                <span className="detail-label">Education:</span>
                                <span className="education-lines">
                                    <span className="education-role">Information Systems</span>
                                    <span className="education-separator">·</span>
                                    <a className="education-institution" href="https://upnvj.ac.id" target="_blank" rel="noopener noreferrer">UPN "Veteran" Jakarta</a>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Profile;