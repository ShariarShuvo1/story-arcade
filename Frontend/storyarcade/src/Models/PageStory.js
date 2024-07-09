class PageStory {
	/**
	 * @param {number} page_story_number - The page number.
	 * @param {string} [story_text] - The story text.
	 * @param {number} [minimum_duration] - The minimum duration.
	 */
	constructor(page_story_number, story_text = "", minimum_duration = 0) {
		this.page_story_number = page_story_number;
		this.story_text = story_text;
		this.minimum_duration = minimum_duration;
	}
}

export default PageStory;
