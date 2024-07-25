class Choice {
	/**
	 * @param {number} choice_number - The choice number.
	 * @param {string} choice - The choice text.
	 */
	constructor(choice_number, choice = "") {
		this.choice_number = choice_number;
		this.choice = choice;
	}
}

export default Choice;
