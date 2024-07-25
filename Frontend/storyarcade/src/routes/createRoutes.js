import { Navigate } from "react-router-dom";
import CreateTitle from "../components/Create/CreateTitle";
import CreatePage from "../components/Create/CreatePage";

function RouteCreate() {
	return [
		{
			path: "/create",
			element: <Navigate to="createTitle" replace />,
		},
		{
			path: "/create/createTitle",
			element: <CreateTitle />,
		},
		{
			path: "/create/createPage/:storyId",
			element: <CreatePage />,
		},
	];
}

export default RouteCreate;
