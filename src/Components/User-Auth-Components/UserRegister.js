import { ParentContainer, Label, Input, LoginButton, Form, FormTitle } from './UserRegister-Style';
import { useState } from 'react';
// import { useAuth } from '../../context/AuthContext';
import useAuthActions from '../../hooks/useAuthActions';


const UserRegister = () => {

    const { signup } = useAuthActions();

    const [ data, setData ] = useState({
        username : '',
        email : '',
        password : '',
        confirmPassword : '',
    });

    const HandleInputChange = (event) => {
        const {name , value} = event.target;
        
        setData({
            ...data,
            [name] : value,
        });
    };

    const sendUsersDataToDb = async (event, data) => {
        event.preventDefault();
        signup(data);
    };

    // console.log(data);
 
    return (
        <ParentContainer>
            <Form onSubmit={(event) => sendUsersDataToDb(event,data)}>
                <FormTitle>
                    Signup
                </FormTitle>
            
                <Label>
                    Username
                </Label>
                <Input name="username" type="text" value={data.username} onChange={(e) => HandleInputChange(e)} />
            
            
                <Label>
                    Email
                </Label>
                <Input name="email" type="text" value={data.email} onChange={(e) => HandleInputChange(e)} />
            
                <Label>
                    Password
                </Label>
                <Input name="password" type="text" value={data.password} onChange={(e) => HandleInputChange(e)} />
            
                <Label>
                    Confirm Password
                </Label>
                <Input name="confirmPassword" type="text" value={data.confirmPassword} onChange={(e) => HandleInputChange(e)} />
            
                <LoginButton type="submit">
                    Submit
                </LoginButton>
               
            </Form>
        </ParentContainer>
    )
}

export default UserRegister;