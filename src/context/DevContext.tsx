import React, { createContext, useContext, useState, ReactNode } from 'react';

interface DevContextType {
    useMockData: boolean;
    toggleMockData: () => void;
}

const DevContext = createContext<DevContextType | undefined>(undefined);

export function DevProvider({ children }: { children: ReactNode }) {
    const [useMockData, setUseMockData] = useState(false);

    const toggleMockData = () => {
        setUseMockData(prev => !prev);
    };

    return (
        <DevContext.Provider value={{ useMockData, toggleMockData }}>
            {children}
        </DevContext.Provider>
    );
}

export function useDev() {
    const context = useContext(DevContext);
    if (context === undefined) {
        throw new Error('useDev must be used within a DevProvider');
    }
    return context;
}
