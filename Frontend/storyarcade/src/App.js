import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Homepage from "./components/Homepage/Homepage";
import RoutingPage from "./components/RoutingPage";

const router = createBrowserRouter([
	{
		path: "/",
		element: <RoutingPage />,
		children: [
			{ path: "/", element: <Homepage /> },
			{ path: "/home", element: <Homepage /> },
		],
	},
]);

function App() {
	return <RouterProvider router={router}></RouterProvider>;
}

export default App;
