import { useRef } from 'react';
import { ParentWrapper, Container } from './Page_TechnologyNews-Style';


const Page_TechnologyNews = () => {

    const inputRef = useRef(null);

    const clickbtn = () => {
        inputRef.current.focus();
    }


    return (
        <ParentWrapper>
            <Container>
                <input ref={inputRef} type='text' placeholder='search' />
                <button onClick={clickbtn}>click</button>
            </Container>
        </ParentWrapper>
    )
}

export default Page_TechnologyNews;

