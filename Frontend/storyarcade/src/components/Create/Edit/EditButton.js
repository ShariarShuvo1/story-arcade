import React from "react";

function EditButton({
	selectedItem,
	listOfTasks,
	setListOfTasks,
	listOfSteps,
	setListOfSteps,
	setSelectedItem,
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
		<div className="">
			{selectedItem.step_type === "task" &&
				getTaskType(selectedItem) === "button" &&
				listOfTasks.map((task, index) => {
					if (task.task_number === selectedItem.child_step_number) {
						return (
							<div key={index} className="">
								<div className="text-text-hover text-lg mb-4 font-semibold">
									Enter Text inside button:
								</div>
								<input
									value={task.button}
									autoFocus={true}
									onChange={(e) => {
										let tempTask = [...listOfTasks];
										tempTask[index].button = e.target.value;
										setListOfTasks(tempTask);
									}}
									className="bg-transparent border-2 w-full border-slate-500 p-2 rounded-lg text-text-light"
									placeholder={"Enter Button Text"}
									maxLength={15}
								/>
								<button
									className="py-2 mt-2 rounded-lg bg-red-500 hover:bg-red-600 w-full text-2xl font-bold text-center"
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

export default EditButton;
