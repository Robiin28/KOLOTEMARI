// src/components/Broadcast.js
import React, { useState } from 'react';
import './Admin.css'

const Broadcast = () => {
    const [message, setMessage] = useState('');
    const [recipients, setRecipients] = useState('students'); // Default to students

    const handleRecipientChange = (event) => {
        setRecipients(event.target.value);
    };

    const handleMessageChange = (event) => {
        setMessage(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        // Handle the message broadcast logic here
        console.log(`Broadcasting to ${recipients}: ${message}`);
        alert(`Message sent to ${recipients}: ${message}`);
        // Reset form
        setMessage('');
    };

    return (
        <div className="broadcast">
            <h2>Broadcast</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="recipients">Send to:</label>
                    <select
                        id="recipients"
                        value={recipients}
                        onChange={handleRecipientChange}
                    >
                        <option value="students">All Students</option>
                        <option value="instructors">All Instructors</option>
                        <option value="both">Both Students and Instructors</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="message">Message:</label>
                    <textarea
                        id="message"
                        value={message}
                        onChange={handleMessageChange}
                        rows="4"
                        placeholder="Enter your broadcast message here..."
                    />
                </div>
                <button type="submited">Send Broadcast</button>
            </form>
        </div>
    );
};

export default Broadcast;
