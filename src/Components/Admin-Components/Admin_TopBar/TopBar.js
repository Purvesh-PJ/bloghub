import { Container } from './TopBar-Style';

const TopBar = ({children}) => {

    return ( 
        <Container>
            {
                children
            }  
        </Container>
    );
}
 
export default TopBar;