import { createContext, useReducer, useEffect } from "react";

export const AuthContext = createContext();

export const authReducer = (state, action) => {
	switch (action.type) {
		case "LOGIN":
			return { jwt: action.payload };
		case "LOGOUT":
			return { jwt: null };
		default:
			return state;
	}
};

export const AuthContextProvider = ({ children }) => {
	const [state, dispatch] = useReducer(authReducer, {
		jwt: null,
	});

	useEffect(() => {
		const jwt = JSON.parse(localStorage.getItem("jwt"));

		if (jwt) {
			dispatch({ type: "LOGIN", payload: jwt });
		}
	}, []);

	return (
		<AuthContext.Provider value={{ ...state, dispatch }}>
			{children}
		</AuthContext.Provider>
	);
};
