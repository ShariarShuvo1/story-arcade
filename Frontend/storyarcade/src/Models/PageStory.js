class PageStory {
	/**
	 * @param {number} page_story_number - The page number.
	 * @param {string} [story_text] - The story text.
	 */
	constructor(page_story_number, story_text = "") {
		this.page_story_number = page_story_number;
		this.story_text = story_text;
	}
}

export default PageStory;
