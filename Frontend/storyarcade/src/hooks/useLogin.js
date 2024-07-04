import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import { loginUser } from "../api/usersAPI";
import { useNavigate } from "react-router-dom";

export const useLogin = () => {
	const [error, setError] = useState(null);
	const [isLoading, setIsLoading] = useState(null);
	const { dispatch } = useAuthContext();
	const navigate = useNavigate();

	const login = async (email, password) => {
		setIsLoading(true);
		setError(null);

		try {
			const response = await loginUser(email, password);

			if (response.status === 201) {
				const jwt_token = response.data.token;
				const verified = response.data.verified;
				localStorage.setItem("jwt", JSON.stringify(jwt_token));
				if (verified) {
					dispatch({ type: "LOGIN", payload: jwt_token });
				} else {
					navigate("/emailVerify");
				}
			} else if (response.status === 400) {
				setError(response.data.message);
			} else if (response.status === 401) {
				setError(response.data.message);
			}
			setIsLoading(false);
		} catch (err) {
			setIsLoading(false);
			setError("Network Error");
		}
	};

	return { login, isLoading, error };
};
