import ViewStory from "../components/View/ViewStory";

function RouteView() {
	return [
		{
			path: "/view/viewStory/:storyId",
			element: <ViewStory />,
		},
	];
}

export default RouteView;
