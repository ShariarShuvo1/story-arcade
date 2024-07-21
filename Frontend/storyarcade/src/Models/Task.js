class Task {
	/**
	 * @param {number} task_number - The task number.
	 * @param {"button"|"slider"} task - The task type.
	 * @param {string} [button="click"] - The button action.
	 * @param {"to_left"|"to_right"} [slider="to_right"] - The slider direction.
	 */
	constructor(
		task_number,
		task,
		button = "click",
		slider = "to_right"
	) {
		this.task_number = task_number;
		this.task = task;
		this.button =
			task === "button" ? button : undefined;
		this.slider = task === "slider" ? slider : undefined;
	}
}

export default Task;
