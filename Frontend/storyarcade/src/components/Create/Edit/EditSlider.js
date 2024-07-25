import React from "react";
import NextSelector from "./NextSelector";

function EditSlider({
	selectedItem,
	listOfTasks,
	setListOfTasks,
	listOfSteps,
	setListOfSteps,
	setSelectedItem,
	jwt,
	selected_page,
	storyId,
	setIsLoading,
}) {
	const getTaskType = (step) => {
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

	const handleDelete = (task) => {
		let tempTask = [];
		for (let i = 0; i < listOfTasks.length; i++) {
			if (listOfTasks[i] !== task) {
				tempTask.push(listOfTasks[i]);
			}
		}
		let tempSteps = [];
		for (let i = 0; i < listOfSteps.length; i++) {
			if (listOfSteps[i] !== selectedItem) {
				tempSteps.push(listOfSteps[i]);
			}
		}

		setListOfSteps(tempSteps);
		setListOfTasks(tempTask);
		setSelectedItem(null);
	};
	return (
		<div>
			{selectedItem.step_type === "task" &&
				getTaskType(selectedItem) === "slider" &&
				listOfTasks.map((task, index) => {
					if (task.task_number === selectedItem.child_step_number) {
						return (
							<div key={index} className="">
								<div className="text-text-hover text-lg font-semibold">
									Choose direction of the slider:
								</div>

								<select
									className="w-full p-2 text-lg mt-1 text-text-light bg-slate-700 rounded-lg"
									defaultValue={listOfTasks[index].slider}
									onChange={(e) => {
										let tempTask = [...listOfTasks];
										tempTask[index].slider = e.target.value;
										setListOfTasks(tempTask);
									}}
								>
									<option value="to_right">To Right</option>
									<option value="to_left">To Left</option>
								</select>

								<NextSelector
									setIsLoading={setIsLoading}
									selectedItem={selectedItem}
									jwt={jwt}
									selected_page={selected_page}
									storyId={storyId}
									setSelectedItem={setSelectedItem}
								/>

								<button
									className="py-2 mt-4 rounded-lg bg-red-500 hover:bg-red-600 w-full text-2xl font-bold text-center"
									onClick={() => handleDelete(task)}
								>
									Delete
								</button>
							</div>
						);
					}
				})}
		</div>
	);
}

export default EditSlider;
