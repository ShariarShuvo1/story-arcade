class Task {
	/**
	 * @param {number} task_number - The task number.
	 * @param {"center_button"|"slider"} task - The task type.
	 * @param {string} [center_button="click"] - The center button action.
	 * @param {"to_left"|"to_right"} [slider="to_right"] - The slider direction.
	 */
	constructor(
		task_number,
		task,
		center_button = "click",
		slider = "to_right"
	) {
		this.task_number = task_number;
		this.task = task;
		this.center_button =
			task === "center_button" ? center_button : undefined;
		this.slider = task === "slider" ? slider : undefined;
	}
}

export default Task;
