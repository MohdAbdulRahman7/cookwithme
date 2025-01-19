import axios from 'axios';

export const sendPrompt = async (prompt) => {
    try {
        const response = await axios.post('http://localhost:5000/api/prompt', { prompt });
        return response.data;
    } catch (error) {
        console.error(error);
    }
}