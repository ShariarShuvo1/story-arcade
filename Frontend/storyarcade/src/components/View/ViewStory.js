import { useNavigate, useParams } from "react-router-dom";
import { notification } from "antd";
import React, { useEffect, useState } from "react";
import { getInitialPages, getNextPages } from "../../api/storyViewAPI";
import LoadingFullscreen from "../../Tools/Loading";
import page from "../../Models/Page";

function ViewStory() {
	const jwt = JSON.parse(localStorage.getItem("jwt"));
	const { storyId } = useParams();
	const navigate = useNavigate();
	const [is_loading, setIsLoading] = useState(false);

	const [pages, setPages] = useState([]);
	const [currentPage, setCurrentPage] = useState(null);
	const [currentStep, setCurrentStep] = useState(null);
	const [currentItem, setCurrentItem] = useState(null);

	const [listOfSteps, setListOfSteps] = useState([]);
	const [listOfPageStory, setListOfPageStory] = useState([]);
	const [listOfChoices, setListOfChoices] = useState([]);
	const [listOfTasks, setListOfTasks] = useState([]);
	const [listOfMover, setListOfMover] = useState([]);

	useEffect(() => {
		if (!jwt || !storyId) {
			navigate("/");
		}
	}, [jwt, storyId]);

	useEffect(() => {
		const getPages = async () => {
			setIsLoading(true);
			const response = await getInitialPages(jwt, storyId);
			if (response.status === 200) {
				let tempPages = response.data.pages;
				setPages(tempPages);
				let tempCurrentPage = tempPages[0];
				setCurrentPage(tempCurrentPage);
				if (tempCurrentPage.steps.length > 0) {
					setCurrentStep(tempCurrentPage.steps[0]);
				}

				setListOfSteps(tempCurrentPage.steps);
				setListOfPageStory(tempCurrentPage.page_story);
				setListOfChoices(tempCurrentPage.choices);
				setListOfTasks(tempCurrentPage.tasks);
				setListOfMover(tempCurrentPage.mover);
			} else {
				notification.error({
					message: "Failed to get pages",
					description: response.data.message,
				});
			}
			setIsLoading(false);
		};
		getPages();
	}, []);

	useEffect(() => {
		const getNextPage = async () => {
			if (currentPage) {
				let child_pages = [];
				let initial_steps = currentPage.steps;
				let page_found = false;
				let choice_found = false;
				for (let i = 0; i < initial_steps.length; i++) {
					let step = initial_steps[i];
					if (
						step.next_type === "page" &&
						step.step_type !== "choice" &&
						!page_found &&
						!choice_found
					) {
						for (let j = 0; j < pages.length; j++) {
							if (pages[j]._id === step.next_page) {
								child_pages.push(pages[j].page_number);
								page_found = true;
								break;
							}
						}
					}
					if (step.step_type === "choice" && !page_found) {
						for (let j = 0; j < pages.length; j++) {
							if (pages[j]._id === step.next_page) {
								child_pages.push(pages[j].page_number);
							}
						}
					}
				}

				child_pages = child_pages.filter(
					(value, index, self) => self.indexOf(value) === index
				);
				if (child_pages.length > 0) {
					const response = await getNextPages(
						jwt,
						storyId,
						child_pages
					);
					let tempPages = [...pages];
					let received_pages = response.data.pages;
					for (let i = 0; i < received_pages.length; i++) {
						let page_found = false;
						for (let j = 0; j < tempPages.length; j++) {
							if (
								received_pages[i].page_number ===
								tempPages[j].page_number
							) {
								page_found = true;
								break;
							}
						}
						if (!page_found) {
							tempPages.push(received_pages[i]);
						}
					}
					setPages(tempPages);
				}
			}
		};
		getNextPage();
	}, [currentPage]);

	useEffect(() => {
		if (currentStep && currentStep.step_type === "story") {
			const tempItem = listOfPageStory.find(
				(item) =>
					item.page_story_number === currentStep.child_step_number
			);
			setCurrentItem(tempItem);
		}
		if (currentStep && currentStep.step_type === "task") {
			const tempItem = listOfTasks.find(
				(item) => item.task_number === currentStep.child_step_number
			);
			setCurrentItem(tempItem);
		}
	}, [currentStep]);

	const getNextStep = () => {
		let current_found = false;
		let temp_new_step = null;
		for (let i = 0; i < listOfSteps.length; i++) {
			if (current_found) {
				temp_new_step = listOfSteps[i];
				break;
			}
			if (listOfSteps[i].step_number === currentStep.step_number) {
				current_found = true;
			}
		}
		return temp_new_step;
	};

	const handleClick = () => {
		if (currentStep && currentItem && currentStep.step_type === "story") {
			if (currentStep.next_type === "step") {
				let audio = new Audio(require("../../Assets/Sound/click.mp3"));
				let temp_new_step = getNextStep();
				if (temp_new_step) {
					audio.play();
					setCurrentStep(temp_new_step);
				}
			} else {
			}
		}
	};

	const handleButtonClick = () => {
		if (
			currentStep &&
			currentItem &&
			currentStep.step_type === "task" &&
			currentItem.task === "button"
		) {
			if (currentStep.next_type === "step") {
				let audio = new Audio(
					require("../../Assets/Sound/button_press.mp3")
				);
				audio.play();

				let temp_new_step = getNextStep();
				if (temp_new_step) {
					setCurrentStep(temp_new_step);
				}
			}
		}
	};

	return (
		<div
			className={`min-h-screen bg-gradient-to-tr from-purple-200 to-cyan-200 p-4 ${
				currentPage && currentPage.background_image
					? "bg-cover bg-center"
					: ""
			}`}
			style={{
				backgroundImage:
					currentPage && currentPage.background_image
						? `url(${currentPage.background_image})`
						: "",
			}}
			onClick={handleClick}
		>
			{is_loading && <LoadingFullscreen />}

			{currentStep &&
				currentStep.step_type === "story" &&
				currentItem && (
					<div className="w-fit p-2 bg-black bg-opacity-80 rounded-xl absolute left-1/2 transform -translate-x-1/2 bottom-0 mb-20">
						<div className="text-text-light font-semibold lg:text-2xl text-center select-none">
							{currentItem.story_text}
						</div>
					</div>
				)}

			{currentStep &&
				currentStep.step_type === "task" &&
				currentItem &&
				currentItem.task === "button" && (
					<div className="absolute inset-0 flex items-center justify-center">
						<button
							style={{
								backgroundColor: `${currentItem.button_color}`,
								color: `${currentItem.button_text_color}`,
								borderColor: `${currentItem.button_border_color}`,
							}}
							className="px-10 m-10 py-3 select-none shadow-black shadow-md rounded-lg text-4xl font-bold border-2 hover:scale-110 transform duration-300"
							onClick={handleButtonClick}
						>
							{currentItem.button}
						</button>
					</div>
				)}
		</div>
	);
}

export default ViewStory;
