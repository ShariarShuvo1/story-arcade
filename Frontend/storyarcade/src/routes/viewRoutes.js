import ViewStory from "../components/View/ViewStory";
import Tes from "../components/Test/Tes";

function RouteView() {
	return [
		{
			path: "/view/viewStory/:storyId",
			element: <ViewStory />,
		},
	];
}

export default RouteView;
