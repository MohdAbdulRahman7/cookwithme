// Boilerplate code from https://www.npmjs.com/package/react-speech-recognition?activeTab=readme#basic-example
import React, { useEffect } from 'react';
import 'regenerator-runtime/runtime';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

import { sendPrompt, getNext } from '../helpers/apiUtils';
import { textToSpeech } from '../helpers/textToSpeech';


const Dictaphone = () => {
    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition();

    
    if (!browserSupportsSpeechRecognition) {
        return <span>Browser doesn't support speech recognition.</span>;
    }

    useEffect(() => {
        if(transcript.toLowerCase().includes('next')) {
            console.log(transcript);
            resetTranscript();
            getNext().then(response => {
                console.log('Response from backend:', response);
                textToSpeech(response.response);
            }).catch(error => {
                console.error('Error getting next:', error);
            });
        }
        if (transcript.toLowerCase().includes('send')) {
            console.log(transcript); // Logic for sending to backend.
            let copy = transcript;
            resetTranscript();
            sendPrompt(copy).then(response => {
                console.log('Response from backend:', response);
                textToSpeech(response.response);
            }).catch(error => {
                console.error('Error sending prompt:', error);
            });
        }
    }, [transcript]);

    return (
        <div>
            <p>Microphone: {listening ? 'on' : 'off'}</p>
            <button onClick={() => SpeechRecognition.startListening({ continuous: true })}>Start</button>
            <button onClick={SpeechRecognition.stopListening}>Stop</button>
            <button onClick={() => sendPrompt("Test message")}>Send</button>
            <button onClick={() => getNext().then(response => {
                console.log('Response from backend:', response);
                textToSpeech(response.response);
            }).catch(error => {
                console.error('Error getting next:', error);
            })}>Next</button>
            <p>{transcript}</p>
        </div>
    );
};

export default Dictaphone;