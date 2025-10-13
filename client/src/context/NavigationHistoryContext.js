import { createContext, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const NavigationHistoryContext = createContext();

export const NavigationHistoryProvider = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const goBack = () => {
    if (location.key) {
      navigate(-1);
    }
  };

  return (
    <NavigationHistoryContext.Provider value={{ goBack }}>
      {children}
    </NavigationHistoryContext.Provider>
  );
};

export const useNavigationHistory = () => useContext(NavigationHistoryContext);
