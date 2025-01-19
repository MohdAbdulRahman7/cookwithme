import axios from 'axios';

export const sendPrompt = async () => {
    try {
        // const response = await axios.get('http://localhost:5000/api/prompt');
        // return response.data;
        return "hello!";
    } catch (error) {
        console.error(error);
    }
}