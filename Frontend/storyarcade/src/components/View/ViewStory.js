import { useNavigate, useParams } from "react-router-dom";
import { notification } from "antd";
import React, { useEffect, useState } from "react";
import { getInitialPages, getNextPages } from "../../api/storyViewAPI";
import LoadingFullscreen from "../../Tools/Loading";
import page from "../../Models/Page";
import SwipeableButton from "../SwipeableButton/SwipeableButton";
import StoryFinishedModal from "./StoryFinishedModal";
import GameComponent from "./GameComponent";

function ViewStory() {
	const jwt = JSON.parse(localStorage.getItem("jwt"));
	const { storyId } = useParams();
	const navigate = useNavigate();
	const [is_loading, setIsLoading] = useState(false);

	const [pages, setPages] = useState([]);
	const [currentPage, setCurrentPage] = useState(null);
	const [currentStep, setCurrentStep] = useState(null);
	const [currentItem, setCurrentItem] = useState(null);

	const [choices, setChoices] = useState([]);

	const [listOfSteps, setListOfSteps] = useState([]);
	const [listOfPageStory, setListOfPageStory] = useState([]);
	const [listOfChoices, setListOfChoices] = useState([]);
	const [listOfTasks, setListOfTasks] = useState([]);
	const [listOfMover, setListOfMover] = useState([]);
	const [listOfGames, setListOfGames] = useState([]);
	const [isFinished, setIsFinished] = useState(false);

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
				setListOfGames(tempCurrentPage.games);
			} else {
				notification.error({
					message: "Failed to get pages",
					description: response.data.message,
				});
				navigate("/");
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
					if (response.status === 200) {
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
					} else {
						notification.error({
							message: `${response.data.message}`,
						});
						navigate("/");
					}
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
		} else if (currentStep && currentStep.step_type === "task") {
			const tempItem = listOfTasks.find(
				(item) => item.task_number === currentStep.child_step_number
			);
			setCurrentItem(tempItem);
		} else if (currentStep && currentStep.step_type === "choice") {
			const tempItem = listOfChoices.find(
				(item) => item.choice_number === currentStep.child_step_number
			);
			setCurrentItem(tempItem);
			let tempChoices = [];
			for (let i = 0; i < listOfSteps.length; i++) {
				if (listOfSteps[i].step_type === "choice") {
					for (let j = 0; j < listOfChoices.length; j++) {
						if (
							listOfChoices[j].choice_number ===
							listOfSteps[i].child_step_number
						) {
							tempChoices.push(listOfChoices[j]);
						}
					}
				}
			}
			setChoices(tempChoices);
			setCurrentItem(null);
		} else if (currentStep && currentStep.step_type === "mover") {
			const tempItem = listOfMover.find(
				(item) => item.mover_number === currentStep.child_step_number
			);
			setCurrentItem(tempItem);
		} else if (currentStep && currentStep.step_type === "game") {
			const tempItem = listOfGames.find(
				(item) => item.game_number === currentStep.child_step_number
			);
			setCurrentItem(tempItem);
		} else {
			setCurrentItem(null);
		}
	}, [currentStep]);

	useEffect(() => {
		if (
			currentStep &&
			currentStep.step_type === "mover" &&
			currentItem &&
			currentItem.next_type
		) {
			if (currentItem.next_type === "auto") {
				let wait_time = currentItem.wait_duration;
				setTimeout(() => {
					if (currentStep.next_type === "step") {
						let temp_new_step = getNextStep();
						if (temp_new_step) {
							setCurrentStep(temp_new_step);
						}
					} else if (currentStep.next_type === "page") {
						let page_id = currentStep.next_page;
						changePage(page_id);
					}
				}, wait_time);
			} else if (currentItem.next_type === "click") {
				let wait_time = currentItem.wait_duration;
				document.addEventListener("click", () => {
					let audio = new Audio(
						require("../../Assets/Sound/click.mp3")
					);
					audio.play();
					setTimeout(() => {
						if (currentStep.next_type === "step") {
							let temp_new_step = getNextStep();
							if (temp_new_step) {
								setCurrentStep(temp_new_step);
							}
						} else if (currentStep.next_type === "page") {
							let page_id = currentStep.next_page;
							changePage(page_id);
						}
					}, wait_time);
				});
			}
		}
	}, [currentItem]);

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
		if (!temp_new_step) {
			setIsFinished(true);
		}
		return temp_new_step;
	};

	const changePage = (page_id) => {
		let next_page = pages.find((page) => page._id === page_id);
		if (next_page) {
			setCurrentPage(next_page);
			if (next_page.steps.length > 0) {
				setCurrentStep(next_page.steps[0]);
			} else {
				setCurrentStep(null);
			}
			setCurrentItem(null);
			setListOfSteps(next_page.steps);
			setListOfPageStory(next_page.page_story);
			setListOfChoices(next_page.choices);
			setListOfTasks(next_page.tasks);
			setListOfMover(next_page.mover);
			setListOfGames(next_page.games);
		}
	};

	const handleClick = () => {
		if (currentStep && currentItem && currentStep.step_type === "story") {
			let audio = new Audio(require("../../Assets/Sound/click.mp3"));
			if (currentStep.next_type === "step") {
				let temp_new_step = getNextStep();
				if (temp_new_step) {
					audio.play();
					setCurrentStep(temp_new_step);
				}
			} else if (currentStep.next_type === "page") {
				audio.play();
				let page_id = currentStep.next_page;
				changePage(page_id);
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
			let audio = new Audio(
				require("../../Assets/Sound/button_press.mp3")
			);
			audio.play();
			if (currentStep.next_type === "step") {
				let temp_new_step = getNextStep();
				if (temp_new_step) {
					setCurrentStep(temp_new_step);
				}
			} else if (currentStep.next_type === "page") {
				let page_id = currentStep.next_page;
				changePage(page_id);
			}
		}
	};

	const handleChoiceClicked = (choice) => {
		let audio = new Audio(require("../../Assets/Sound/button_press.mp3"));
		audio.play();
		let tempStep = listOfSteps.find(
			(step) =>
				step.child_step_number === choice.choice_number &&
				step.step_type === "choice"
		);
		let page_id = tempStep.next_page;
		changePage(page_id);
	};

	const handleSwipe = () => {
		if (
			currentStep &&
			currentItem &&
			currentStep.step_type === "task" &&
			currentItem.task === "slider"
		) {
			if (currentStep.next_type === "step") {
				let temp_new_step = getNextStep();
				if (temp_new_step) {
					setCurrentStep(temp_new_step);
				}
			} else if (currentStep.next_type === "page") {
				let page_id = currentStep.next_page;
				changePage(page_id);
			}
		}
	};

	const gameWin = () => {
		if (currentStep.next_type === "step") {
			let temp_new_step = getNextStep();
			if (temp_new_step) {
				setCurrentStep(temp_new_step);
			}
		} else if (currentStep.next_type === "page") {
			let page_id = currentStep.next_page;
			changePage(page_id);
		}
	};

	return (
		<div
			className={`h-full p-4 ps-0 max-h-screen overflow-y-hidden ${
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
			<StoryFinishedModal
				isFinished={isFinished}
				setIsFinished={setIsFinished}
				storyId={storyId}
			/>

			{currentStep &&
				currentStep.step_type === "story" &&
				currentItem && (
					<div className="w-fit p-2 bg-black bg-opacity-80 rounded-xl absolute left-1/2 transform -translate-x-1/2 bottom-0 mb-20">
						<div className="text-text-light font-semibold lg:text-2xl text-center select-none">
							{currentItem.story_text}
						</div>
					</div>
				)}

			{currentStep && currentStep.step_type === "game" && currentItem && (
				<GameComponent
					gameWin={gameWin}
					htmlString={currentItem.html}
					cssString={currentItem.css}
					jsString={currentItem.js}
				/>
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

			{currentStep &&
				currentStep.step_type === "task" &&
				currentItem &&
				currentItem.task === "slider" && (
					<div className="flex items-center absolute inset-0 justify-center">
						<SwipeableButton
							onSuccess={handleSwipe}
							text={currentItem.slider}
						/>
					</div>
				)}

			{currentStep &&
				currentStep.step_type === "choice" &&
				choices &&
				choices.length > 0 && (
					<div className="absolute" style={{ bottom: "10%" }}>
						{choices.map((choice, index) => (
							<div
								key={index}
								className="p-2 mt-2 bg-opacity-70 bg-black hover:bg-slate-900 text-text-muted cursor-pointer border-2 border-s-0 border-text-light w-fit rounded-full rounded-s-none text-2xl select-none hover:scale-105 transform duration-300 font-semibold"
								onClick={() => handleChoiceClicked(choice)}
							>
								{choice.choice ? choice.choice : ". . ."}
							</div>
						))}
					</div>
				)}
		</div>
	);
}

export default ViewStory;
