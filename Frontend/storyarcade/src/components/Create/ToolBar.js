import { Tooltip } from "antd";
import add_text_image from "../../Assets/Icon/insert_text.png";
import add_text_image_hover from "../../Assets/Icon/insert_text_hover.png";
import add_button_image from "../../Assets/Icon/insert_button.png";
import add_button_image_hover from "../../Assets/Icon/insert_button_hover.png";
import add_slider_image from "../../Assets/Icon/insert_slider.png";
import add_slider_image_hover from "../../Assets/Icon/insert_slider_hover.png";
import add_option_image from "../../Assets/Icon/insert_option.png";
import add_option_image_hover from "../../Assets/Icon/insert_option_hover.png";
import React from "react";
import PageStory from "../../Models/PageStory";
import Step from "../../Models/Step";
import Task from "../../Models/Task";

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
		<div className="flex flex-col items-center">
			<div className="fixed bottom-20 bg-gradient-to-r from-teal-200 to-orange-200 p-2 rounded-lg mx-64 flex justify-center gap-4">
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
					<button className="border-2 border-fuchsia-500 hover:border-fuchsia-600 hover:bg-fuchsia-100 rounded-lg p-1">
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
