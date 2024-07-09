class Choice {
	/**
	 * @param {number} choice_number - The choice number.
	 * @param {string} choice - The choice text.
	 * @param {number} next_page - The number of the next page.
	 */
	constructor(choice_number, choice, next_page) {
		this.choice_number = choice_number;
		this.choice = choice;
		this.next_page = next_page;
	}
}

export default Choice;
