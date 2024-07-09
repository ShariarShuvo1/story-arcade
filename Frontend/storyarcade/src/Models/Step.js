class Step {
	/**
	 * @param {number} step_number - The step number.
	 * @param {"choice"|"task"|"click"|"story"} step_type - The step type.
	 */
	constructor(step_number, step_type) {
		this.step_number = step_number;
		this.step_type = step_type;
	}
}

export default Step;
