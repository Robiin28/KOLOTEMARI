// src/components/Footer.js
import React from 'react';
import './Admin.css'; // Create this CSS file for styling the footer

export const AdminFooter = () => {
    return (
        <footer className=" admin-footer">
            <div className="footer-content">
                <p>&copy; {new Date().getFullYear()} BM . All rights reserved.</p>
                
            </div>
        </footer>
    );
};


