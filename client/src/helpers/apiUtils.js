import axios from 'axios';
let dietary_needs = {"1": "no nuts", "2":"vegan"};

export const sendPrompt = async (prompt, type) => {
    try {
        const preferences = `These are my dietary needs: ${JSON.stringify(dietary_needs)}`;
        const response = await axios.post('http://localhost:5000/api/prompt', { prompt: prompt + ' ' + preferences });
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
