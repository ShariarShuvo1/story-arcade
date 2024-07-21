import React from "react";
import EditPageStory from "./Edit/EditPageStory";

function Modification({ selectedItem, listOfPageStory, setListOfPageStory, listOfTasks, setListOfTasks, listOfSteps, setListOfSteps, setSelectedItem }) {

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


	return (
		<div className="mt-4 lg:mt-0">
			{selectedItem && (
				<div className="bg-slate-900 rounded-2xl p-4 min-w-96 max-w-96 overflow-y-auto h-screen">
					<div className="text-text-muted text-center font-bold text-3xl mb-4">
						Modification
					</div>
					<EditPageStory
						selectedItem={selectedItem}
						listOfPageStory={listOfPageStory}
						setListOfPageStory={setListOfPageStory}
						listOfSteps={listOfSteps}
						setListOfSteps={setListOfSteps}
						setSelectedItem={setSelectedItem}
					/>

					<div className="">
						{selectedItem.step_type === "task" && getTaskType(selectedItem) === "button" &&
							listOfTasks.map((task, index) => {
								if (
									task.task_number ===
									selectedItem.child_step_number
								) {
									return (
										<div key={index} className="">
											<div className="text-text-hover text-lg mb-4 font-semibold">
												Enter Text inside button:
											</div>
											<input
												value={task.button}
												autoFocus={true}
												onChange={(e) => {
													let tempTask = [...listOfTasks,];
													tempTask[index].button = e.target.value;
													setListOfTasks(tempTask);
												}}
												className="bg-transparent border-2 w-full border-slate-500 p-2 rounded-lg text-text-light"
												placeholder={"Enter Button Text"}
												maxLength={15}
											/>
											<button
												className="py-2 mt-2 rounded-lg bg-red-500 hover:bg-red-600 w-full text-2xl font-bold text-center"
												onClick={() => {
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
												}}
											>
												Delete
											</button>
										</div>
									);
								}
							})}
					</div>
				</div>
			)}
		</div>
	);
}

export default Modification;
