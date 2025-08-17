// import axios from 'axios';
import { API_USERS_URL } from './config';
import { createApiInstance } from './axiosInstance';

const userApi = createApiInstance(API_USERS_URL);

export const getUser = async () => {
    // console.log(accessToken);
    const response = await userApi(`${API_USERS_URL}/getUser`, {
        headers : { 
            'Authorization' : `Bearer ${`${localStorage.getItem('accessToken')}`}`
        }
    });
    return response; 
};

export const setuser = async (formData) => {
    // console.log([...formData.entries()]); 
    const response = await userApi.put(`${API_USERS_URL}/setUser`, formData, { 
        headers : {
        'Content-Type' : 'multipart/form-data',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
    }});
    return response; 
};

export const getUserProfile = async () => {
    // const Token = localStorage.getItem('accessToken');
    const response = await userApi.get(`${API_USERS_URL}/getUserProfile`, { 
        headers: { 
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`, 
        },
    });
    // console.log(response);
    return response;
};

export const postUserProfile = async (formData) => {
    // console.log(formData);
    const Token = localStorage.getItem('accessToken');
    const response = await userApi.post(`${API_USERS_URL}/postUserProfile`, formData, {
        headers: {
            'Authorization': `Bearer ${Token}`,
            'Content-Type' : 'multipart/form-data',
        },
    });  
    // console.log(response);
    return response; 
};

export const getUserPosts = async () => { 
    // console.log(Token);
    const response = await userApi.get(`${API_USERS_URL}/getUserPosts`, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
    });
    // console.log(response);
    return response;
};

export const follow = async (followId) => {
    const response = await userApi.post(`${API_USERS_URL}/followUser`, { toFollowId : followId }, {
        headers : { 
            'Authorization' : `Bearer ${localStorage.getItem("accessToken")}`
        }
    });

    return response;
};

export const unfollow = async (unfollowId) => {
    const response = await userApi.post(`${API_USERS_URL}/unfollowUser`, { toUnfollowId : unfollowId }, {
        headers : { 
            'Authorization' : `Bearer ${localStorage.getItem("accessToken")}`
        }
    });   
    return response; 
};

export const isFollowing = async (toFollowId) => {
    const response = await userApi.get(`${API_USERS_URL}/isFollowing/${toFollowId}`, { headers : {
        'Authorization' : `Bearer ${localStorage.getItem("accessToken")}`
    }});
    return response;   
};




