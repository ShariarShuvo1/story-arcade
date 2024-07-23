import React, {useEffect, useState} from "react";

function Display({
	selectedImage,
	listOfPageStory,
	setListOfPageStory,
	selectedItem,
	setSelectedItem,
	listOfTasks,
	setListOfTasks,
}) {
	const [currentSelectedItem, setCurrentSelectedItem] = React.useState(null);

	useEffect(() => {
		if (selectedItem) {
			if (selectedItem.step_type === "story") {
				let selectedPageStory = listOfPageStory.find(
					(page) => page.page_story_number === selectedItem.child_step_number
				);
				let index = listOfPageStory.indexOf(selectedPageStory);
				setCurrentSelectedItem(listOfPageStory[index]);
			}
			if (selectedItem.step_type === "task") {
				let selectedTask = listOfTasks.find(
					(task) => task.task_number === selectedItem.child_step_number
				);
				let index = listOfTasks.indexOf(selectedTask);
				setCurrentSelectedItem(listOfTasks[index]);
			}
		} else {
			setCurrentSelectedItem(null);
		}
	}, [selectedItem]);

	return (
		<div
			className="bg-slate-900 mt-4 lg:mt-0 rounded-xl h-full flex-grow aspect-video relative"
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
					<div
						className="absolute w-fit p-2 bg-black bg-opacity-60 rounded-xl"
						style={{ bottom: "10%", left: "5%", right: "5%" }}
					>
						<div className="text-text-muted font-semibold text-lg text-center">
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
							className={`px-10 m-10 py-3 hover:opacity-95 shadow-black shadow-md rounded-lg text-4xl font-bold border-2`}
						>
							{currentSelectedItem.button}
						</button>
					</div>
				)}
		</div>
	);
}

export default Display;
