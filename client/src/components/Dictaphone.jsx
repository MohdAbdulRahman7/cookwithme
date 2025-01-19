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
            <button onClick={() => {
                SpeechRecognition.startListening({ continuous: true });
                textToSpeech("Microphone is on");
            }}>Start</button>
            <button onClick={() => {
                SpeechRecognition.stopListening();
                textToSpeech("Microphone is off");
            }}>Stop</button>
            <button onClick={() => {
                sendPrompt("Test message").then(response => {
                    console.log('Response from backend:', response);
                    textToSpeech(response.response);
                }).catch(error => {
                    console.error('Error sending prompt:', error);
                });
            }}>Send</button>
            <button onClick={() => {
                getNext().then(response => {
                    console.log('Response from backend:', response);
                    textToSpeech(response.response);
                }).catch(error => {
                    console.error('Error getting next:', error);
                });
            }}>Next</button>

            <button onClick={() => {
                sendPrompt("Test message", "alternative").then(response => {
                    console.log('Response from backend:', response);
                    textToSpeech(response.response);
                }).catch(error => {
                    console.error('Error sending prompt:', error);
                });
            }}>Send2</button>
            <button onClick={() => {
                sendPrompt("Test message", "ideas").then(response => {
                    console.log('Response from backend:', response);
                    textToSpeech(response.response);
                }).catch(error => {
                    console.error('Error sending prompt:', error);
                });
            }}>Send3</button>
            <button onClick={() => {
                sendPrompt("Test message", "ingredients").then(response => {
                    console.log('Response from backend:', response);
                    textToSpeech(response.response);
                }).catch(error => {
                    console.error('Error sending prompt:', error);
                });
            }}>Send4</button>
            <button onClick={() => {
                sendPrompt("Test message", "steps").then(response => {
                    console.log('Response from backend:', response);
                    textToSpeech(response.response);
                }).catch(error => {
                    console.error('Error sending prompt:', error);
                });
            }}>Send5</button>
            <p>{transcript}</p>
        </div>
    );
};

export default Dictaphone;