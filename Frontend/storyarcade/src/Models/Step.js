class Step {
	/**
	 * @param {number} step_number - The step number.
	 * @param {string} step_name - The step name.
	 * @param {"choice"|"task"|"story"} step_type - The step type.
	 * @param {number} [child_step_number] - The child step number.
	 */
	constructor(step_number, step_name, step_type, child_step_number) {
		this.step_number = step_number;
		this.step_name = step_name;
		this.step_type = step_type;
		this.child_step_number = child_step_number;
	}
}

export default Step;
