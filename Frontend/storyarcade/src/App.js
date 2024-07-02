import React from "react";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import Homepage from "./components/Homepage/Homepage";
import Login from "./components/Auth/Login";
import Signup from "./components/Auth/Signup";
import RoutingPage from "./components/RoutingPage";
import {useAuthContext} from "./hooks/useAuthContext";

function App() {

	const { user } = useAuthContext();

	const router = createBrowserRouter([
		{
			path: "/",
			element: <RoutingPage />,
			children: [
				{
					path: "/login",
					element: user ? <Navigate to="/home" /> : <Login />
				},
				{
					path: "/signup",
					element: user ? <Navigate to="/home" /> : <Signup />
				},
				{
					path: "/home",
					element: user ? <Homepage /> : <Navigate to="/login" />
				},
				{
					path: "/",
					element: user ? <Homepage /> : <Navigate to="/login" />
				},
				{
					path: "/homepage",
					element: user ? <Homepage /> : <Navigate to="/login" />
				},
			],
		},
	]);

	return <RouterProvider router={router}></RouterProvider>;
}

export default App;
