class Task {
	/**
	 * @param {number} task_number - The task number.
	 * @param {"center_button"|"slider"} task - The task type.
	 * @param {string} [center_button="click"] - The center button action.
	 * @param {string} [center_button_text=""] - The center button text.
	 * @param {"to_left"|"to_right"} [slider="to_right"] - The slider direction.
	 * @param {string} [slider_text=""] - The slider text.
	 */
	constructor(
		task_number,
		task,
		center_button = "click",
		center_button_text = "",
		slider = "to_right",
		slider_text = ""
	) {
		this.task_number = task_number;
		this.task = task;
		this.center_button =
			task === "center_button" ? center_button : undefined;
		this.slider = task === "slider" ? slider : undefined;
		this.center_button_text = center_button_text;
		this.slider_text = slider_text;
	}
}

export default Task;
