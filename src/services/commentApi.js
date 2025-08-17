import { API_COMMENTS_URL } from './config';
import { createApiInstance } from './axiosInstance';

const api = createApiInstance(API_COMMENTS_URL);

export const getComments = async () => {
    try {
        const response = await api.get(`${API_COMMENTS_URL}`);
        return response;
    } 
    catch (error) {
        throw new Error(`Error getting comments : ${error.message}`); 
    }
}

export const postUserComments = async (data) => {
    console.log(data);
    try {
        const response = await api.post(`${API_COMMENTS_URL}`, data, {
            headers: {
                'Content-Type':'application/json'
            }
        });
        return response;
    } 
    catch (error) {
        console.log(error);
        throw new Error(`Error posting comments : ${error.message}`); 
    }
};

export const postUserReplyComments = async (data) => {
    console.log(data);
    try {
        const response = await api.post(`${API_COMMENTS_URL}/replies`, data, {
            headers: {
                'Content-Type':'application/json'
            }
        });
        return response;
    } 
    catch (error) {
        throw new Error(`Error posting reply comments : ${error.message}`); 
    }
};