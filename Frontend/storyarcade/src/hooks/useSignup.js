import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import { createNewUser } from "../api/usersAPI";
import { useNavigate} from "react-router-dom";

export const useSignup = () => {
	const [error, setError] = useState(null);
	const [isLoading, setIsLoading] = useState(null);
	const navigate = useNavigate();

	const signup = async (email, password, name, dob) => {
		setIsLoading(true);
		setError(null);

		try {
			const response = await createNewUser(email, password, name, dob);

			if (response.status === 201) {
				const jwt_token = response.data.token;
				localStorage.setItem("jwt", JSON.stringify(jwt_token));
				navigate("/emailVerify")
			} else{
				setError(response.data.message);
			}
			setIsLoading(false);
		} catch (err) {
			setIsLoading(false);
			setError("Network Error");
		}
	};

	return { signup, isLoading, error };
};
