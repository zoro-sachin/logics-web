import React from 'react';
import { Link } from 'react-router-dom';
import { FaTrophy } from 'react-icons/fa';
import './Certificates.css';

/**
 * Certificates Page - Placeholder
 */
const Certificates = () => {
    return (
        <div className="certificates-page">
            <div className="container">
                <div className="page-header text-center mb-xl">
                    <h1 className="text-gradient h1">Credentials</h1>
                    <p className="text-secondary">Official proof of your logical mastery.</p>
                </div>

                <div className="glass-card text-center py-xl">
                    <div className="feature-icon-wrapper mx-auto mb-lg">
                        <FaTrophy />
                    </div>
                    <h3 className="h1 mb-md">Engine Activation Pending</h3>
                    <p className="text-secondary max-w-sm mx-auto">
                        Certificate minting will be enabled once you achieve Gold status in all 5 Logic Domains.
                    </p>
                    <Link to="/practice" className="btn btn-primary mt-lg">
                        Begin Certification Training
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Certificates;
