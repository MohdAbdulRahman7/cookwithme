// Home.jsx
import React, { useState, useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import 'regenerator-runtime/runtime';
import { sendPrompt } from '../helpers/apiUtils';
import { textToSpeech } from '../helpers/textToSpeech';
import ChatBox from './Chatbox'; // Import the ChatBox component
import './Home.css'; // Import styling for home page

const Home = () => {
    const [isListening, setIsListening] = useState(false); // Track listening state
    const { transcript, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();

    useEffect(() => {
        if (!browserSupportsSpeechRecognition) {
            return <span>Browser doesn't support speech recognition.</span>;
        }

        if (transcript.toLowerCase().includes('send')) {
            let copy = transcript;
            resetTranscript();
            sendPrompt(copy).then(response => {
                textToSpeech(response.response);
            }).catch(error => {
                console.error('Error sending prompt:', error);
            });
        }
    }, [transcript, resetTranscript]);

    const startListening = () => {
        setIsListening(true);
        SpeechRecognition.startListening({ continuous: true });
    };

    const stopListening = () => {
        setIsListening(false);
        SpeechRecognition.stopListening();
    };

    // Determine logo shake class based on listening state
    const logoClass = isListening ? 'logo shake' : 'logo';

    return (
        <div className="home-container">
            <div className="home-card">
                {/* ChatBox component with speech recognition */}
                <ChatBox transcript={transcript} />

                {/* Logo that starts/stops listening */}
                <div className={logoClass} onClick={isListening ? stopListening : startListening}>
                    <img src="./teddy.png" alt="Logo" />
                </div>

                {/* Meal Cards Section */}
                <div className="meal-cards">
                    <div className="meal-card">Wanna Explore Ideas for Meals?</div>
                </div>
            </div>
        </div>
    );
};

export default Home;
