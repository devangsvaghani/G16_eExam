import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './SubmitConfirmationModal.css';

const SubmitConfirmationModal = ({ onCancel, autoSubmit = false }) => {
    const navigate = useNavigate();

    const handleConfirmClick = () => {
        if(!autoSubmit)
        alert('Your Exam Has been Successfully Submitted!!!');
        navigate("/");
    };
    useEffect(() => {
        if (autoSubmit) {
            handleConfirmClick();
        }
    }, [autoSubmit]);
    if(!autoSubmit)
    {
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
        )
    }
    else
    {
        return null;
    }
};

export default SubmitConfirmationModal;