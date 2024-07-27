import { Tooltip } from "antd";
import add_page_image from "../../Assets/Icon/add_new_page.png";
import add_page_image_hover from "../../Assets/Icon/add_new_page_hover.png";
import React from "react";
import { saveAPage } from "../../api/storyAPI";
import "./style.css";

function PageList({
	story,
	setStory,
	selected_page,
	setSelectedPage,
	listOfSteps,
	setListOfSteps,
	listOfPageStory,
	setListOfPageStory,
	listOfChoices,
	setListOfChoices,
	listOfTasks,
	setListOfTasks,
	selectedImage,
	setSelectedImage,
	currentPage,
	setCurrentPage,
	setIsLoading,
	jwt,
	storyId,
	navigate,
	setSelectedItem,
	listOfMover,
	setListOfMover,
					  setTitle
}) {
	const addNewPage = async () => {
		setIsLoading(true);
		let tempPage = currentPage;
		if (tempPage) {
			tempPage.steps = listOfSteps;
			tempPage.page_story = listOfPageStory;
			tempPage.choices = listOfChoices;
			tempPage.tasks = listOfTasks;
			tempPage.mover = listOfMover;
			tempPage.background_image = selectedImage;

			const response = await saveAPage(jwt, tempPage, storyId);
			setIsLoading(false);
		}
		let max_page_number = Math.max(...story);
		setSelectedPage(max_page_number + 1);
	};

	const handleSaveChange = async () => {
		setIsLoading(true);

		let tempPage = currentPage;
		if (tempPage) {
			tempPage.steps = listOfSteps;
			tempPage.page_story = listOfPageStory;
			tempPage.choices = listOfChoices;
			tempPage.tasks = listOfTasks;
			tempPage.mover = listOfMover;
			tempPage.background_image = selectedImage;

			const response = await saveAPage(jwt, tempPage, storyId);

			if (response.status === 200) {
				let response_story = response.data.story;
				let response_page = response.data.page;
				setTitle(response.data.story_title);
				setListOfSteps(response_page.steps);
				setListOfPageStory(response_page.page_story);
				setListOfChoices(response_page.choices);
				setListOfTasks(response_page.tasks);
				setListOfMover(response_page.mover);
				setSelectedImage(response_page.background_image);
				setSelectedPage(response_page.page_number);
				setCurrentPage(response_page);
				setStory(response_story);
				setSelectedItem(null);
			} else {
				navigate("/");
			}
		}
		setIsLoading(false);
	};

	const pageChangeClickHandler = async (page_number) => {
		setIsLoading(true);
		let tempPage = currentPage;
		if (tempPage) {
			tempPage.steps = listOfSteps;
			tempPage.page_story = listOfPageStory;
			tempPage.choices = listOfChoices;
			tempPage.tasks = listOfTasks;
			tempPage.mover = listOfMover;
			tempPage.background_image = selectedImage;

			const response = await saveAPage(jwt, tempPage, storyId);
		}
		setIsLoading(false);
		setSelectedPage(page_number);
	};

	return (
		<div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-purple-400 to-cyan-400 p-2 rounded-t-lg mx-4">
			<div className=" flex justify-around gap-4">
				<div
					id="pageList"
					className="flex w-full overflow-x-auto gap-2"
				>
					{story &&
						story.map((page, index) => (
							<Tooltip
								title={`Page ${page}`}
								placement="top"
								color="purple"
								key={index}
							>
								<div
									className={`bg-slate-800 flex items-center justify-center text-text-light font-extrabold text-2xl min-w-12 h-12 rounded-lg cursor-pointer hover:bg-slate-900 ${
										selected_page === page &&
										"border-2 border-yellow-300"
									}`}
									onClick={() => {
										pageChangeClickHandler(page);
									}}
								>
									{page}
								</div>
							</Tooltip>
						))}

					<Tooltip
						title="Add New Page"
						placement="top"
						color="purple"
					>
						<img
							src={add_page_image}
							alt="Add Page"
							className="min-w-12 h-12 cursor-pointer"
							onMouseOver={(e) =>
								(e.currentTarget.src = add_page_image_hover)
							}
							onMouseOut={(e) =>
								(e.currentTarget.src = add_page_image)
							}
							onClick={addNewPage}
						/>
					</Tooltip>
				</div>
				<button
					className="bg-slate-800 text-lg font-bold text-text-light min-w-48 h-12 rounded-lg cursor-pointer hover:bg-slate-900 p-2"
					onClick={handleSaveChange}
				>
					Save Changes
				</button>
			</div>
		</div>
	);
}

export default PageList;
