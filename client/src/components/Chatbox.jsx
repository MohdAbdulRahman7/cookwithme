// ChatBox.jsx
import React from 'react';
import './ChatBox.css'; // If you have a separate CSS file for ChatBox styles

const ChatBox = ({ transcript }) => {
    return (
        <div className="chat-box">
            <p>Let's make something amazing! How can I help you today?</p>
            <div className="chat-content">
                {/* Display the real-time transcript */}
                <p>{transcript}</p>
            </div>
        </div>
    );
};

export default ChatBox;
