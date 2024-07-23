class Step {
	/**
	 * @param {number} step_number - The step number.
	 * @param {string} step_name - The step name.
	 * @param {"choice"|"task"|"story"} step_type - The step type.
	 * @param {number} [child_step_number] - The child step number.
	 * @param {"step"|"page"} [next_type = "step"] - The next type.
	 * @param {string} [next_page] - The next page.
	 */
	constructor(step_number, step_name, step_type, child_step_number, next_type= "step", next_page) {
		this.step_number = step_number;
		this.step_name = step_name;
		this.step_type = step_type;
		this.child_step_number = child_step_number;
		this.next_type = next_type;
		this.next_page = next_type === "page" ? next_page : undefined;
	}
}

export default Step;
