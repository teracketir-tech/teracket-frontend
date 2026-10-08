// src/contexts/LoadingContext.tsx

import React, { createContext, useContext, useState, useCallback, useRef } from 'react';

interface LoadingContextType {
    isLoading: boolean;
    loadingMessage: string;
    startLoading: (message?: string) => void;
    stopLoading: () => void;
    resetLoading: () => void;
    withLoading: <T>(promise: Promise<T>, message?: string) => Promise<T>;
    activeRequests: number;
}

const LoadingContext = createContext<LoadingContextType | null>(null);

export const useLoading = () => {
    const context = useContext(LoadingContext);
    if (!context) {
        throw new Error('useLoading must be used within a LoadingProvider');
    }
    return context;
};

export const LoadingProvider = ({ children }: { children: React.ReactNode }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('در حال بارگذاری...');
    const [activeRequests, setActiveRequests] = useState(0);

    const startLoading = useCallback((message = 'در حال بارگذاری...') => {
        setActiveRequests(prev => prev + 1);
        setIsLoading(true);
        if (message) {
            setLoadingMessage(message);
        }
    }, []);

    const stopLoading = useCallback(() => {
        setActiveRequests(prev => {
            const newCount = prev - 1;
            if (newCount <= 0) {
                setIsLoading(false);
                setLoadingMessage('در حال بارگذاری...');
                return 0;
            }
            return newCount;
        });
    }, []);

    const resetLoading = useCallback(() => {
        setIsLoading(false);
        setLoadingMessage('در حال بارگذاری...');
        setActiveRequests(0);
    }, []);

    const withLoading = useCallback(async <T,>(
        promise: Promise<T>,
        message = 'در حال بارگذاری...'
    ): Promise<T> => {
        try {
            startLoading(message);
            const result = await promise;
            return result;
        } finally {
            stopLoading();
        }
    }, [startLoading, stopLoading]);

    return (
        <LoadingContext.Provider value={{
            isLoading,
            loadingMessage,
            startLoading,
            stopLoading,
            resetLoading,
            withLoading,
            activeRequests,
        }}>
            {children}
        </LoadingContext.Provider>
    );
};

export default LoadingContext;