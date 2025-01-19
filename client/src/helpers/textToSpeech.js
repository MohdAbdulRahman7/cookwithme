export const textToSpeech = (message) => {
    if ('speechSynthesis' in window) {
        var msg = new SpeechSynthesisUtterance(message);
        window.speechSynthesis.speak(msg);
    }
}