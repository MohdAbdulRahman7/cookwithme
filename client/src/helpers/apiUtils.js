import axios from 'axios';
let dietary_needs = {};

export const updateDietaryNeeds = (newDietaryNeeds) => {
    dietary_needs = { ...dietary_needs, ...newDietaryNeeds }; // Merge old and new values
    console.log('Updated dietary needs:', dietary_needs); 
  };

export const sendPrompt = async (prompt) => {
    try {
        const preferences = "These are my dietary needs: " + JSON.stringify(dietary_needs);
        const response = await axios.post('http://localhost:5000/api/prompt', { prompt: prompt + ' ' + preferences });
        console.log("Diet " + response);
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
