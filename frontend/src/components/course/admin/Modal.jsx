import React from 'react';
import './Modal.css'; // Import the CSS file for styling

const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null; // Do not render the modal if it's not open

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>×</button>
                {children}
            </div>
        </div>
    );
};

export default Modal;
