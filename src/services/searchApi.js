import axios from 'axios';
const API_SEARCH_URL = 'http://localhost:4000/search';

export const getSearchResults = async (query) => {
    // console.log(query);
    try {
        const response = await axios.get(`${API_SEARCH_URL}/${query}`);
        // console.log(response);
        return response;
    } 
    catch (error) {
        // console.log(error);
        throw error;
    }
};

