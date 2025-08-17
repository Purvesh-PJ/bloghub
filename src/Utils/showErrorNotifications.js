import { toast } from 'react-toastify';

export const showErrorNotification = (message) => {
    toast.error(message, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 5000,
    });
}