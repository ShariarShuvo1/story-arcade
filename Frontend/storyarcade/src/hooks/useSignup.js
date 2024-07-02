// src/hooks/useSignup.js
import { useState } from 'react';
import { useAuthContext } from './useAuthContext';
import { createNewUser } from '../api/usersAPI';

export const useSignup = () => {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(null);
    const { dispatch } = useAuthContext();

    const signup = async (email, password) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await createNewUser(email, password);
            const json = await response.json()

            if (response.status === 201) {
                localStorage.setItem('user', JSON.stringify(json));
                dispatch({ type: 'LOGIN', payload: json });
            } else if (response.status === 400) {
                setError(response.data.message);
            } else if (response.status === 409) {
                setError(response.data.message);
            }
            setIsLoading(false);
        } catch (err) {
            setIsLoading(false);
            setError('Network Error');
        }
    };

    return { signup, isLoading, error };
};