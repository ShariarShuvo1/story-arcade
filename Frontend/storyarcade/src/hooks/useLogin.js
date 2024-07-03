import { useState } from 'react';
import { useAuthContext } from './useAuthContext';
import { loginUser } from '../api/usersAPI';

export const useLogin = () => {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(null);
    const { dispatch } = useAuthContext();

    const login = async (email, password) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await loginUser(email, password);
            const json = await response.json()

            if (response.status === 200) {
                localStorage.setItem('jwt', JSON.stringify(json));
                dispatch({ type: 'LOGIN', payload: json });
            } else if (response.status === 400) {
                setError(response.data.message);
            } else if (response.status === 401) {
                setError(response.data.message);
            }
            setIsLoading(false);
        } catch (err) {
            setIsLoading(false);
            setError('Network Error');
        }
    };

    return { login, isLoading, error };
};
