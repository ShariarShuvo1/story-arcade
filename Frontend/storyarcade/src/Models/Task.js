class Task {
	/**
	 * @param {number} task_number - The task number.
	 * @param {"button"|"slider"} task - The task type.
	 * @param {string} [button="click"] - The button action.
	 * @param {string} [button_color="#ffffff"] - The button color.
	 * @param {string} [button_text_color="#000000"] - The button text color.
	 * @param {string} [button_border_color="#000000"] - The button border color.
	 * @param {"to_left"|"to_right"} [slider="to_right"] - The slider direction.
	 */
	constructor(
		task_number,
		task,
		button = "click",
		button_color = "#ffffff",
		button_text_color = "#000000",
		button_border_color = "#000000",
		slider = "to_right"
	) {
		this.task_number = task_number;
		this.task = task;
		this.button =
			task === "button" ? button : undefined;
		this.button_color = task === "button" ? button_color : undefined;
		this.button_text_color = task === "button" ? button_text_color : undefined;
		this.button_border_color = task === "button" ? button_border_color : undefined;
		this.slider = task === "slider" ? slider : undefined;
	}
}

export default Task;
