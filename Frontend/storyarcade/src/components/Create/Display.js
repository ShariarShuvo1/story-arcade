import React, { useEffect, useState } from "react";

function Display({
	selectedImage,
	listOfPageStory,
	setListOfPageStory,
	selectedItem,
	setSelectedItem,
	listOfTasks,
	setListOfTasks,
	listOfChoices,
	listOfSteps,
}) {
	const [currentSelectedItem, setCurrentSelectedItem] = useState(null);
	const [tempListOfChoice, setTempListOfChoice] = useState(listOfChoices);

	useEffect(() => {
		if (selectedItem) {
			if (selectedItem.step_type === "story") {
				let selectedPageStory = listOfPageStory.find(
					(page) =>
						page.page_story_number ===
						selectedItem.child_step_number
				);
				let index = listOfPageStory.indexOf(selectedPageStory);
				setCurrentSelectedItem(listOfPageStory[index]);
			}
			if (selectedItem.step_type === "task") {
				let selectedTask = listOfTasks.find(
					(task) =>
						task.task_number === selectedItem.child_step_number
				);
				let index = listOfTasks.indexOf(selectedTask);
				setCurrentSelectedItem(listOfTasks[index]);
			}
			if (selectedItem.step_type === "choice") {
				let selectedChoice = listOfChoices.find(
					(choice) =>
						choice.choice_number === selectedItem.child_step_number
				);
				let index = listOfChoices.indexOf(selectedChoice);
				setCurrentSelectedItem(listOfChoices[index]);
			}
		} else {
			setCurrentSelectedItem(null);
		}
	}, [selectedItem]);

	useEffect(() => {
		let tempChoices = [];

		for (let i = 0; i < listOfSteps.length; i++) {
			if (listOfSteps[i].step_type === "choice") {
				for (let j = 0; j < listOfChoices.length; j++) {
					if (
						listOfChoices[j].choice_number ===
						listOfSteps[i].child_step_number
					) {
						tempChoices.push(listOfChoices[j]);
						break;
					}
				}
			}
		}
		setTempListOfChoice(tempChoices);
	}, [listOfChoices, listOfSteps]);

	return (
		<div
			className="bg-slate-900 mt-4 lg:mt-0 rounded-xl min-w-96 h-full flex-grow aspect-video relative"
			style={{
				backgroundImage: `url(${selectedImage})`,
				backgroundSize: "cover",
				backgroundPosition: "center",
			}}
		>
			{currentSelectedItem &&
				selectedItem &&
				selectedItem.step_type === "story" &&
				currentSelectedItem.story_text && (
					<div className="w-fit p-2 bg-black bg-opacity-80 rounded-xl absolute left-1/2 transform -translate-x-1/2 mx-4 bottom-0 mb-4">
						<div className="text-text-light font-semibold text-lg text-center">
							{currentSelectedItem.story_text}
						</div>
					</div>
				)}

			{currentSelectedItem &&
				selectedItem &&
				selectedItem.step_type === "task" &&
				currentSelectedItem.task === "button" &&
				currentSelectedItem.button && (
					<div className="flex items-center justify-center h-full">
						<button
							style={{
								backgroundColor: `${currentSelectedItem.button_color}`,
								color: `${currentSelectedItem.button_text_color}`,
								borderColor: `${currentSelectedItem.button_border_color}`,
							}}
							className={`px-10 m-10 py-3 hover:scale-110 transform duration-300 shadow-black shadow-md rounded-lg text-4xl font-bold border-2`}
						>
							{currentSelectedItem.button}
						</button>
					</div>
				)}

			{currentSelectedItem &&
				selectedItem &&
				selectedItem.step_type === "choice" && (
					<div className="absolute" style={{ bottom: "10%" }}>
						{tempListOfChoice.map((choice, index) => (
							<div
								key={index}
								className="p-2 mt-2 bg-opacity-70 bg-black hover:bg-slate-900 text-text-muted cursor-pointer border-2 border-s-0 border-text-light w-fit rounded-full rounded-s-none text-lg font-semibold"
								onClick={(e) => {
									for (
										let i = 0;
										i < listOfSteps.length;
										i++
									) {
										if (
											choice.choice_number ===
											listOfSteps[i].child_step_number
										) {
											setSelectedItem(listOfSteps[i]);
											break;
										}
									}
								}}
							>
								{choice.choice? choice.choice : ". . ."}
							</div>
						))}
					</div>
				)}
		</div>
	);
}

export default Display;
