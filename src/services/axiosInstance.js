import axios from "axios";
import { showErrorNotification } from "../Utils/showErrorNotifications";
import { retryRefreshWithRefreshToken } from "../Utils/axiosUtils";
import { getErrorMessage } from "../Utils/axiosUtils";


export const createApiInstance = (baseURL) => {

    const api = axios.create({ baseURL: baseURL });

    api.interceptors.response.use(
        response => response,

        async error => {
            
            const message = getErrorMessage(error);
            if(error.response && error.response.status === 401){
                return retryRefreshWithRefreshToken(error, api);
            }
            showErrorNotification(message);
            return Promise.reject(error);
        }
    );

    return api;
};



