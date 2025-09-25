// src/components/Settings.jsx

import React, { useState } from 'react';
import './Admin.css'; // Import the CSS file

const Settings = () => {
    const [appName, setAppName] = useState('Admin Dashboard');
    const [maintenanceMode, setMaintenanceMode] = useState(false);
    const [smtpServer, setSmtpServer] = useState('');
    const [smtpPort, setSmtpPort] = useState('');
    const [smtpUsername, setSmtpUsername] = useState('');
    const [smtpPassword, setSmtpPassword] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSave = (e) => {
        e.preventDefault();
        // Handle save logic here
        console.log({
            appName,
            maintenanceMode,
            smtpServer,
            smtpPort,
            smtpUsername,
            smtpPassword
        });
        alert('Settings saved.');
    };

    const handleChangePassword = (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            alert('New passwords do not match.');
            return;
        }
        // Handle password change logic here
        console.log({
            currentPassword,
            newPassword
        });
        alert('Password changed.');
    };

    return (
        <div className="settings-container">
            <h2>Settings</h2>
            <form onSubmit={handleSave}>
                <div>
                    <label htmlFor="appName">Application Name:</label>
                    <input
                        type="text"
                        id="appName"
                        value={appName}
                        onChange={(e) => setAppName(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="maintenanceMode">Maintenance Mode:</label>
                    <input
                        type="checkbox"
                        id="maintenanceMode"
                        checked={maintenanceMode}
                        onChange={(e) => setMaintenanceMode(e.target.checked)}
                    />
                </div>
                <div>
                    <label htmlFor="smtpServer">SMTP Server:</label>
                    <input
                        type="text"
                        id="smtpServer"
                        value={smtpServer}
                        onChange={(e) => setSmtpServer(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="smtpPort">Port:</label>
                    <input
                        type="number"
                        id="smtpPort"
                        value={smtpPort}
                        onChange={(e) => setSmtpPort(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="smtpUsername">Username:</label>
                    <input
                        type="text"
                        id="smtpUsername"
                        value={smtpUsername}
                        onChange={(e) => setSmtpUsername(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="smtpPassword">Password:</label>
                    <input
                        type="password"
                        id="smtpPassword"
                        value={smtpPassword}
                        onChange={(e) => setSmtpPassword(e.target.value)}
                    />
                </div>
                <button type="submit">Save Settings</button>
            </form>

            <h3>Change Password</h3>
            <form onSubmit={handleChangePassword}>
                <div>
                    <label htmlFor="currentPassword">Current Password:</label>
                    <input
                        type="password"
                        id="currentPassword"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="newPassword">New Password:</label>
                    <input
                        type="password"
                        id="newPassword"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="confirmPassword">Confirm New Password:</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </div>
                <button type="submit">Change Password</button>
            </form>
        </div>
    );
};

export default Settings;
