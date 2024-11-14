import React, { useState } from 'react';
import './SubmitConfirmationModal.css';

const SubmitConfirmationModal = ({ onConfirm, onCancel }) => {
    const handleConfirmClick = () => {
        alert('Successfully Submitted!!'); // Display the alert
        onConfirm(); // Call onConfirm to proceed with submission
    };

    return (
        <div className="modal-overlay">
            <div className="submit-modal">
                <h2>Confirm Submission</h2>
                <p>Are you sure you want to submit your test?</p>
                <div className="modal-buttons">
                    <button onClick={handleConfirmClick}>Yes, Submit</button>
                    <button onClick={onCancel}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default SubmitConfirmationModal;