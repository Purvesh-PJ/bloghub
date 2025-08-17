import { DialogBox, DialogHeader, DialogContainer, Title, CloseButton } from './Dialog-Style';
import React, { useRef } from 'react';

const Dialog = ({ isOpen, close, children, isdialogheader, istitle, isdefaultclosebtn }) => {

    const dialogRef = useRef(null);

    if(isOpen){
        dialogRef.current?.showModal();
    }else {
        dialogRef.current?.close();
    }

    // console.log(dialogRef.current);

    return (
        <DialogBox ref={dialogRef}>
            {
                isdialogheader && (
                    <DialogHeader >
                        <Title >
                            {istitle ? istitle : ''}
                        </Title>
                        {
                            isdefaultclosebtn && (
                                <CloseButton onClick={close} isdefaultclosebtn={isdefaultclosebtn}>
                                    close
                                </CloseButton>
                            )
                        }        
                    </DialogHeader>
                )
            }
            <DialogContainer>
                {
                    children
                }   
            </DialogContainer>        
        </DialogBox>
    ) 
};

export default Dialog;
