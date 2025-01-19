import axios from 'axios';

export const sendPrompt = async (prompt) => {
    try {
        const response = await axios.post('http://localhost:5000/api/prompt', { prompt });
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

export const getNext = async () => {
    console.log("Next Clicked")
    try {
        const response = await axios.get('http://localhost:5000/api/next');
        return response.data;
    } catch (error) {
        console.error(error);
    }
}