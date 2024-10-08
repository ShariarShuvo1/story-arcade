import { Tooltip, notification } from "antd";
import add_text_image from "../../Assets/Icon/insert_text.png";
import add_text_image_hover from "../../Assets/Icon/insert_text_hover.png";
import add_button_image from "../../Assets/Icon/insert_button.png";
import add_button_image_hover from "../../Assets/Icon/insert_button_hover.png";
import add_slider_image from "../../Assets/Icon/insert_slider.png";
import add_slider_image_hover from "../../Assets/Icon/insert_slider_hover.png";
import add_option_image from "../../Assets/Icon/insert_option.png";
import add_option_image_hover from "../../Assets/Icon/insert_option_hover.png";
import add_mover_image from "../../Assets/Icon/insert_mover.png";
import add_mover_image_hover from "../../Assets/Icon/insert_mover_hover.png";
import add_game_image from "../../Assets/Icon/game_option.png";
import add_game_image_hover from "../../Assets/Icon/game_option_hover.png";
import React from "react";
import PageStory from "../../Models/PageStory";
import Step from "../../Models/Step";
import Task from "../../Models/Task";
import Choice from "../../Models/Choice";
import Mover from "../../Models/Mover";
import Game from "../../Models/Game";

function ToolBar({
	selected_page,
	listOfPageStory,
	setListOfPageStory,
	listOfSteps,
	setListOfSteps,
	setSelectedItem,
	selectedImage,
	setSelectedImage,
	setAiImageModalVisible,
	pointsLeft,
	listOfTasks,
	setListOfTasks,
	listOfChoices,
	setListOfChoices,
	listOfMover,
	setListOfMover,
	listOfGames,
	setListOfGames,
}) {
	const handleAddText = () => {
		if (!selected_page) {
			return;
		}

		let max_page_story_number = Math.max(
			...listOfPageStory.map((o) => o.page_story_number),
			0
		);

		const newPageStory = new PageStory(max_page_story_number + 1, "", 20);
		let tempPageStory = [...listOfPageStory, newPageStory];
		setListOfPageStory(tempPageStory);

		const max_step_number = Math.max(
			...listOfSteps.map((o) => o.step_number),
			0
		);

		let newStep = new Step(
			max_step_number + 1,
			"New Story",
			"story",
			newPageStory.page_story_number
		);

		let tempSteps = [...listOfSteps, newStep];
		setListOfSteps(tempSteps);
		setSelectedItem(newStep);
	};

	const handleAddButton = () => {
		if (!selected_page) {
			return;
		}

		let max_task_number = Math.max(
			...listOfTasks.map((o) => o.task_number),
			0
		);

		const newTask = new Task(max_task_number + 1, "button", "click");
		let tempTask = [...listOfTasks, newTask];
		setListOfTasks(tempTask);

		const max_step_number = Math.max(
			...listOfSteps.map((o) => o.step_number),
			0
		);

		let newStep = new Step(
			max_step_number + 1,
			"New Button",
			"task",
			newTask.task_number
		);

		let tempSteps = [...listOfSteps, newStep];
		setListOfSteps(tempSteps);
		setSelectedItem(newStep);
	};

	const handleAddSlider = () => {
		if (!selected_page) {
			return;
		}

		let max_task_number = Math.max(
			...listOfTasks.map((o) => o.task_number),
			0
		);

		const newTask = new Task(max_task_number + 1, "slider");
		let tempTask = [...listOfTasks, newTask];
		setListOfTasks(tempTask);

		const max_step_number = Math.max(
			...listOfSteps.map((o) => o.step_number),
			0
		);

		let newStep = new Step(
			max_step_number + 1,
			"New Slider",
			"task",
			newTask.task_number
		);

		let tempSteps = [...listOfSteps, newStep];
		setListOfSteps(tempSteps);
		setSelectedItem(newStep);
	};

	const handleAddMover = () => {
		if (!selected_page) {
			return;
		}

		let max_mover_number = Math.max(
			...listOfMover.map((o) => o.mover_number),
			0
		);

		const newMover = new Mover(max_mover_number + 1, 0, "auto");
		let tempMover = [...listOfMover, newMover];
		setListOfMover(tempMover);

		const max_step_number = Math.max(
			...listOfSteps.map((o) => o.step_number),
			0
		);

		let newStep = new Step(
			max_step_number + 1,
			"New Mover",
			"mover",
			newMover.mover_number
		);

		let tempSteps = [...listOfSteps, newStep];
		setListOfSteps(tempSteps);
		setSelectedItem(newStep);
	};

	const handleAddGame = () => {
		if (!selected_page) {
			return;
		}
		let max_game_number = Math.max(
			...listOfGames.map((o) => o.game_number),
			0
		);

		const newGame = new Game(max_game_number + 1);
		let tempGame = [...listOfGames, newGame];
		setListOfGames(tempGame);

		const max_step_number = Math.max(
			...listOfSteps.map((o) => o.step_number),
			0
		);

		let newStep = new Step(
			max_step_number + 1,
			"New Game",
			"game",
			newGame.game_number
		);

		let tempSteps = [...listOfSteps, newStep];
		setListOfSteps(tempSteps);
		setSelectedItem(newStep);
	};

	const handleAddChoice = () => {
		if (!selected_page) {
			return;
		}

		let choice_count = 0;
		for (let i = 0; i < listOfSteps.length; i++) {
			if (listOfSteps[i].step_type === "choice") {
				choice_count++;
			}
		}

		if (choice_count >= 3) {
			notification.error({
				description: "Maximum Choice for this page has been reached",
			});
			return;
		}

		let max_choice_number = Math.max(
			...listOfChoices.map((o) => o.choice_number),
			0
		);

		const newChoice = new Choice(max_choice_number + 1);
		let tempChoice = [...listOfChoices, newChoice];
		setListOfChoices(tempChoice);

		const max_step_number = Math.max(
			...listOfSteps.map((o) => o.step_number),
			0
		);

		let newStep = new Step(
			max_step_number + 1,
			"New Choice",
			"choice",
			newChoice.choice_number,
			"page"
		);

		let tempSteps = [...listOfSteps, newStep];
		setListOfSteps(tempSteps);
		setSelectedItem(newStep);
	};

	const convertToBase64 = (file) => {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = () => resolve(reader.result);
			reader.onerror = (error) => reject(error);
		});
	};

	const handleImageChange = async (e) => {
		const file = e.target.files[0];
		const base64 = await convertToBase64(file);
		setSelectedImage(base64);
	};

	return (
		<div className="flex flex-col items-center justify-center">
			<div className="fixed bottom-20 bg-gradient-to-r from-teal-200 to-orange-200 p-2 rounded-lg flex justify-center gap-2">
				<Tooltip title="Add Text" placement="top" color="purple">
					<button
						className="border-2 border-fuchsia-500 hover:border-fuchsia-600 hover:bg-fuchsia-100 rounded-lg p-1"
						onClick={handleAddText}
					>
						<img
							src={add_text_image}
							alt="Add Text"
							className="min-w-8 h-8 cursor-pointer"
							onMouseOver={(e) =>
								(e.currentTarget.src = add_text_image_hover)
							}
							onMouseOut={(e) =>
								(e.currentTarget.src = add_text_image)
							}
						/>
					</button>
				</Tooltip>

				<Tooltip title="Add Button" placement="top" color="purple">
					<button
						className="border-2 border-fuchsia-500 hover:border-fuchsia-600 hover:bg-fuchsia-100 rounded-lg p-1"
						onClick={handleAddButton}
					>
						<img
							src={add_button_image}
							alt="Add Button"
							className="min-w-8 h-8 cursor-pointer"
							onMouseOver={(e) =>
								(e.currentTarget.src = add_button_image_hover)
							}
							onMouseOut={(e) =>
								(e.currentTarget.src = add_button_image)
							}
						/>
					</button>
				</Tooltip>

				<Tooltip title="Add Slider" placement="top" color="purple">
					<button
						className="border-2 border-fuchsia-500 hover:border-fuchsia-600 hover:bg-fuchsia-100 rounded-lg p-1"
						onClick={handleAddSlider}
					>
						<img
							src={add_slider_image}
							alt="Add Slider"
							className="min-w-8 h-8 cursor-pointer"
							onMouseOver={(e) =>
								(e.currentTarget.src = add_slider_image_hover)
							}
							onMouseOut={(e) =>
								(e.currentTarget.src = add_slider_image)
							}
						/>
					</button>
				</Tooltip>

				<Tooltip title="Add Option" placement="top" color="purple">
					<button
						className="border-2 border-fuchsia-500 hover:border-fuchsia-600 hover:bg-fuchsia-100 rounded-lg p-1"
						onClick={handleAddChoice}
					>
						<img
							src={add_option_image}
							alt="Add Option"
							className="min-w-8 h-8 cursor-pointer"
							onMouseOver={(e) =>
								(e.currentTarget.src = add_option_image_hover)
							}
							onMouseOut={(e) =>
								(e.currentTarget.src = add_option_image)
							}
						/>
					</button>
				</Tooltip>

				<Tooltip title="Add Mover" placement="top" color="purple">
					<button
						className="border-2 border-fuchsia-500 hover:border-fuchsia-600 hover:bg-fuchsia-100 rounded-lg p-1"
						onClick={handleAddMover}
					>
						<img
							src={add_mover_image}
							alt="Add Option"
							className="min-w-8 h-8 cursor-pointer"
							onMouseOver={(e) =>
								(e.currentTarget.src = add_mover_image_hover)
							}
							onMouseOut={(e) =>
								(e.currentTarget.src = add_mover_image)
							}
						/>
					</button>
				</Tooltip>

				<Tooltip
					title="Add Game (require code)"
					placement="top"
					color="purple"
				>
					<button
						className="border-2 border-fuchsia-500 hover:border-fuchsia-600 hover:bg-fuchsia-100 rounded-lg p-1"
						onClick={handleAddGame}
					>
						<img
							src={add_game_image}
							alt="Add Option"
							className="min-w-8 h-8 cursor-pointer"
							onMouseOver={(e) =>
								(e.currentTarget.src = add_game_image_hover)
							}
							onMouseOut={(e) =>
								(e.currentTarget.src = add_game_image)
							}
						/>
					</button>
				</Tooltip>

				<Tooltip
					title="Add Background Image"
					placement="top"
					color="purple"
				>
					<input
						type="file"
						className="border-2 border-fuchsia-500 hover:border-fuchsia-600 hover:bg-fuchsia-100 cursor-pointer rounded-lg p-1"
						accept="image/*"
						onChange={handleImageChange}
					/>
				</Tooltip>

				<Tooltip
					placement="top"
					title={"Generate Background Image With AI"}
					color="purple"
				>
					<button
						className="bg-transparent text-white rounded-md hover:rotate-90 transform transition-transform duration-300 hover:scale-110"
						disabled={pointsLeft === 0}
						onClick={() => {
							setAiImageModalVisible(true);
						}}
					>
						<img
							alt="Ai Genaration Icon"
							src={require("../../Assets/AI/ai_gen_icon.png")}
							width={35}
							height={35}
						/>
					</button>
				</Tooltip>
			</div>
		</div>
	);
}

export default ToolBar;
