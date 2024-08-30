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
import ForgetPasswordOtp from "./components/Auth/ForgetPasswordOtp";
import RouteCreate from "./routes/createRoutes";
import Profile from "./components/Profile/Profile";
import RouteView from "./routes/viewRoutes";
import BuyPoints from "./components/BuyPoints/BuyPoints";
import ChatPage from "./components/Chat/ChatPage";
import CreatePage from "./components/Create/CreatePage";
import EditTitle from "./components/Create/EditTitle";
import Support from "./components/Support/Support";

function App() {
	const { jwt } = useAuthContext();

	const router = createBrowserRouter([
		{
			path: "/",
			element: <RoutingPage />,
			children: [
				{
					path: "/login",
					element: <Login />,
				},
				{
					path: "/signup",
					element: <Signup />,
				},
				{
					path: "/home",
					element: <Homepage />,
				},
				{
					path: "/",
					element: <Homepage />,
				},
				{
					path: "/homepage",
					element: <Homepage />,
				},
				{
					path: "/emailVerify",
					element: <EmailVerify />,
				},
				{
					path: "/forgetPassword",
					element: <ForgetPassword />,
				},
				{
					path: "/forgetPasswordOtp/:email",
					element: <ForgetPasswordOtp />,
				},
				{
					path: "/profile",
					element: <Profile />,
				},
				{
					path: "/profile/:id",
					element: <Profile />,
				},
				{
					path: "/buyPoints",
					element: <BuyPoints />,
				},
				{
					path: "/chat",
					element: <ChatPage />,
				},
				{
					path: "/support",
					element: <Support/>,
				},
				{
					path: "/edit/:storyId",
					element: <EditTitle />,
				},
				...RouteCreate(),
				...RouteView(),
			],
		},
	]);

	return <RouterProvider router={router}></RouterProvider>;
}

export default App;
