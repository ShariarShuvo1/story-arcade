import React from "react";
import NextSelector from "./NextSelector";

function EditButton({
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
				getTaskType(selectedItem) === "button" &&
				listOfTasks.map((task, index) => {
					if (task.task_number === selectedItem.child_step_number) {
						return (
							<div key={index} className="">
								<div className="text-text-hover text-lg font-semibold">
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
									className="bg-transparent border-2 mt-1 w-full border-slate-500 p-2 rounded-lg text-text-light"
									placeholder={"Enter Button Text"}
									maxLength={15}
								/>

								<div className="text-text-hover text-lg mt-4 font-semibold">
									Select button color:
								</div>
								<div className="flex mt-1 gap-4 items-center">
									<input
										value={task.button_color}
										onChange={(e) => {
											let tempTask = [...listOfTasks];
											tempTask[index].button_color =
												e.target.value;
											setListOfTasks(tempTask);
										}}
										type="color"
										className="bg-transparent cursor-pointer border-2 rounded-lg h-10 border-slate-500 text-text-light"
									/>
									<input
										value={task.button_color}
										onChange={(e) => {
											let tempTask = [...listOfTasks];
											tempTask[index].button_color =
												e.target.value;
											setListOfTasks(tempTask);
										}}
										className="bg-transparent border-2 p-2 rounded-lg w-full border-slate-500 text-text-light"
									/>
								</div>

								<div className="text-text-hover text-lg mt-4 font-semibold">
									Select text color:
								</div>
								<div className="flex mt-1 gap-4 items-center">
									<input
										value={task.button_text_color}
										onChange={(e) => {
											let tempTask = [...listOfTasks];
											tempTask[index].button_text_color =
												e.target.value;
											setListOfTasks(tempTask);
										}}
										type="color"
										className="bg-transparent cursor-pointer border-2 rounded-lg h-10 border-slate-500 text-text-light"
									/>
									<input
										value={task.button_text_color}
										onChange={(e) => {
											let tempTask = [...listOfTasks];
											tempTask[index].button_text_color =
												e.target.value;
											setListOfTasks(tempTask);
										}}
										className="bg-transparent border-2 p-2 rounded-lg w-full border-slate-500 text-text-light"
									/>
								</div>

								<div className="text-text-hover text-lg mt-4 font-semibold">
									Select border color:
								</div>
								<div className="flex mt-1 gap-4 items-center">
									<input
										value={task.button_border_color}
										onChange={(e) => {
											let tempTask = [...listOfTasks];
											tempTask[
												index
											].button_border_color =
												e.target.value;
											setListOfTasks(tempTask);
										}}
										type="color"
										className="bg-transparent cursor-pointer border-2 rounded-lg h-10 border-slate-500 text-text-light"
									/>
									<input
										value={task.button_border_color}
										onChange={(e) => {
											let tempTask = [...listOfTasks];
											tempTask[
												index
											].button_border_color =
												e.target.value;
											setListOfTasks(tempTask);
										}}
										className="bg-transparent border-2 p-2 rounded-lg w-full border-slate-500 text-text-light"
									/>
								</div>

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

export default EditButton;
