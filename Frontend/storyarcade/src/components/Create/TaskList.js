import React, { useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import add_text_image from "../../Assets/Icon/insert_text_hover.png";
import add_option_image from "../../Assets/Icon/insert_option_hover.png";
import add_button_image from "../../Assets/Icon/insert_button_hover.png";
import add_slider_image from "../../Assets/Icon/insert_slider_hover.png";
import add_mover_image_hover from "../../Assets/Icon/insert_mover_hover.png";
import link_image from "../../Assets/Icon/link.png";
import { Tooltip } from "antd";
import "./style.css";

function TaskList({
	listOfSteps,
	setListOfSteps,
	listOfTasks,
	selectedItem,
	setSelectedItem,
}) {
	const moveStep = (dragIndex, hoverIndex) => {
		const draggedStep = listOfSteps[dragIndex];
		let newListOfSteps = [...listOfSteps];
		newListOfSteps.splice(dragIndex, 1);
		newListOfSteps.splice(hoverIndex, 0, draggedStep);
		for (let i = 0; i < newListOfSteps.length; i++) {
			newListOfSteps[i].step_number = i + 1;
		}
		setListOfSteps(newListOfSteps);
	};

	const StepItem = ({ step, index }) => {
		const [stepName, setStepName] = useState(step.step_name);
		const [, drag] = useDrag({
			type: "STEP",
			item: { index },
		});

		const [, drop] = useDrop({
			accept: "STEP",
			hover: (item) => {
				if (item.index !== index) {
					moveStep(item.index, index);
					item.index = index;
				}
			},
		});

		const getTaskType = () => {
			let taskType = "";
			if (listOfTasks.length > 0) {
				for (let i = 0; i < listOfTasks.length; i++) {
					if (listOfTasks[i].task_number === step.child_step_number) {
						taskType = listOfTasks[i].task;
						break;
					}
				}
			}
			return taskType;
		};

		return (
			<div
				ref={(node) => drag(drop(node))}
				onClick={() => setSelectedItem(step)}
				className={` flex p-2 m-2 cursor-move bg-slate-700 rounded-lg items-center text-lg font-semibold border-2 ${
					selectedItem === step
						? "border-green-500 text-green-500 bg-slate-800"
						: "border-slate-500 text-text-light hover:bg-slate-800 hover:border-yellow-300"
				}`}
			>
				{step.step_type === "story" && (
					<img
						src={add_text_image}
						alt="Add Text"
						className="min-w-6 h-6 mr-4"
					/>
				)}

				{step.step_type === "mover" && (
					<img
						src={add_mover_image_hover}
						alt="Add Mover"
						className="min-w-6 h-6 mr-4"
					/>
				)}

				{step.step_type === "choice" && (
					<img
						src={add_option_image}
						alt="Choice Button"
						className="min-w-6 h-6 mr-4"
					/>
				)}

				{step.step_type === "task" && getTaskType() === "button" && (
					<img
						src={add_button_image}
						alt="Button"
						className="min-w-6 h-6 mr-4"
					/>
				)}
				{step.step_type === "task" && getTaskType() === "slider" && (
					<img
						src={add_slider_image}
						alt="Slider"
						className="min-w-6 h-6 mr-4"
					/>
				)}

				<input
					type="text"
					value={stepName}
					onChange={(e) => {
						setStepName(e.target.value);
					}}
					onBlur={() => {
						let tempSteps = [...listOfSteps];
						for (let i = 0; i < tempSteps.length; i++) {
							if (tempSteps[i].step_number === step.step_number) {
								tempSteps[i].step_name = stepName;
								setSelectedItem(tempSteps[i]);
								break;
							}
						}
						setListOfSteps(tempSteps);
					}}
					className="bg-transparent border-none px-2 text-lg font-semibold text-text-light"
				/>
				{step.next_type === "page" && (
					<Tooltip
						title="This Step is linked"
						placement="top"
						color="purple"
					>
						<img
							src={link_image}
							alt="link icon"
							className="max-w-6 max-h-4 ms-4"
						/>
					</Tooltip>
				)}
			</div>
		);
	};

	return (
		<div
			id="taskList"
			className="bg-slate-900 rounded-2xl p-4 w-96 overflow-y-auto h-screen"
		>
			<div className="text-text-muted text-center font-bold text-3xl mb-4">
				Steps
			</div>
			<div className="">
				{listOfSteps.map((step, index) => (
					<StepItem key={index} step={step} index={index} />
				))}
			</div>
		</div>
	);
}

export default TaskList;
