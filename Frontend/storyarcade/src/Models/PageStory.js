class PageStory {
	/**
	 * @param {number} number - The page number.
	 * @param {string} [story_text] - The story text.
	 * @param {number} [minimum_duration] - The minimum duration.
	 */
	constructor(number, story_text = "", minimum_duration = 0) {
		this.number = number;
		this.story_text = story_text;
		this.minimum_duration = minimum_duration;
	}
}

export default PageStory;
