import { useState } from "react";
import useAuthActions from "./useAuthActions";

const useLogin = (initialLoginInputStates) => {

    const [ loginData, setLoginData ] = useState(initialLoginInputStates);
    const { login } = useAuthActions();


    const handleLoginInputChange = (event) => {
        const { name, value } = event.target;
        setLoginData({ ...loginData, [name] : value});
    };

    const handleLoginSubmit = async (event) => {
        event.preventDefault();
        await login(loginData);
    }

    return {
        loginData, 
        handleLoginInputChange, 
        handleLoginSubmit
    }
}

export default useLogin;