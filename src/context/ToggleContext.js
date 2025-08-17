import { createContext, useContext, useState, useEffect, useCallback } from "react";

const ToggleContext = createContext();

export const ToggleProvider = ({ children }) => {

    const [toggles, setToggles] = useState({});

    const createToggle = useCallback((id) => {
        setToggles((prev) => {
            if (id in prev) {
                return prev;
            }
            return { 
                ...prev, [id]: false 
            };
        });
    }, []);

    const toggle = useCallback((id) => {
        setToggles((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    }, []);

    const open = useCallback((id) => {
        setToggles((prev) => ({
            ...prev,
            [id]: true,
        }));
    }, []);

    const close = useCallback((id) => {
        setToggles((prev) => ({
            ...prev,
            [id]: false,
        }));
    }, []);

    const getToggleState = useCallback((id) => toggles[id] || false, [toggles]);

    return (
        <ToggleContext.Provider value={{ createToggle, toggle, open, close, getToggleState }}>
            {children}
        </ToggleContext.Provider>
    );
};

export const useToggle = (id) => {

    const context = useContext(ToggleContext);
    
    if (!context) {
        throw new Error("useToggle must be used within a ToggleProvider");
    }

    const { createToggle, toggle, open, close, getToggleState } = context;

    useEffect(() => {
        createToggle(id);
    }, [id, createToggle]);

    return {
        isOpen: getToggleState(id),
        toggle: () => toggle(id),
        open: () => open(id),
        close: () => close(id),
    };
};
