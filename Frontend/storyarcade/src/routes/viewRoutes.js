import ViewStory from "../components/View/ViewStory";
import Preview from "../components/View/Preview";

function RouteView() {
	return [
		{
			path: "/view/viewStory/:storyId",
			element: <ViewStory />,
		},
		{
			path: "/view/preview/:storyId/:pageId",
			element: <Preview />,
		},
	];
}

export default RouteView;
