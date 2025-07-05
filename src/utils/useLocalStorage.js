import { useState, useEffect } from "react";


export function useLocalStorage(key, initialValue) {
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const saved = localStorage.getItem(key);
            return saved ? JSON.parse(saved) : initialValue;
        } catch (err) {
            console.error("useLocalStorage error:", err);
            return initialValue;
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem(key, JSON.stringify(storedValue));
        } catch (err) {
            console.error("useLocalStorage save error:", err);
        }
    }, [key, storedValue]);

    return [storedValue, setStoredValue];
}