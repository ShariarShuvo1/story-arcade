import React from "react";
import {
	createBrowserRouter,
	RouterProvider,
	Navigate,
} from "react-router-dom";
import Homepage from "./components/Homepage/Homepage";
import Login from "./components/Auth/Login";
import Signup from "./components/Auth/Signup";
import RoutingPage from "./components/RoutingPage";
import { useAuthContext } from "./hooks/useAuthContext";
import EmailVerify from "./components/Auth/EmailVerify";
import ForgetPassword from "./components/Auth/ForgetPassword";

function App() {
	const { jwt } = useAuthContext();

	const router = createBrowserRouter([
		{
			path: "/",
			element: <RoutingPage />,
			children: [
				{
					path: "/login",
					element: jwt ? <Navigate to="/home" /> : <Login />,
				},
				{
					path: "/signup",
					element: jwt ? <Navigate to="/home" /> : <Signup />,
				},
				{
					path: "/home",
					element: jwt ? <Homepage /> : <Navigate to="/login" />,
				},
				{
					path: "/",
					element: jwt ? <Homepage /> : <Navigate to="/login" />,
				},
				{
					path: "/homepage",
					element: jwt ? <Homepage /> : <Navigate to="/login" />,
				},
				{
					path: "/emailVerify",
					element: <EmailVerify />,
				},
				{
					path: "/forgetPassword",
					element: jwt ? <Homepage /> : <ForgetPassword />,
				},
			],
		},
	]);

	return <RouterProvider router={router}></RouterProvider>;
}

export default App;
