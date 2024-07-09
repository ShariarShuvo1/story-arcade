import Page from "./Page";

class Story {
	/**
	 * @param {string} title - The title of the story.
	 * @param {Array<Page>} pages - Array of story pages.
	 * @param {string} [cover_image] - URL of the cover image.
	 * @param {boolean} [allow_copy=true] - Whether copying is allowed.
	 * @param {"public"|"private"|"followers_only"|"paid"} [access_level="public"] - The access level of the story.
	 * @param {number} [points_required] - Points required to access the story.
	 * @param {Date} [created_at=new Date()] - Date of creation.
	 * @param {string} uploader - The user who uploaded the story.
	 * @param {string} original_uploader - The original uploader of the story.
	 * @param {string} original_story - The original story.
	 */
	constructor(
		title,
		pages = [],
		cover_image,
		allow_copy = true,
		access_level = "public",
		points_required,
		created_at = new Date(),
		uploader,
		original_uploader,
		original_story
	) {
		this.title = title;
		this.pages = pages;
		this.cover_image = cover_image;
		this.allow_copy = allow_copy;
		this.access_level = access_level;
		this.points_required = points_required;
		this.created_at = created_at;
		this.uploader = uploader;
		this.original_uploader = original_uploader;
		this.original_story = original_story;
	}

	/**
	 * Add a page to the story.
	 * @param {Page} page - The page object to add.
	 */
	addPage(page) {
		this.pages.push(page);
	}

	/**
	 * Get the number of pages in the story.
	 * @returns {number} The number of pages.
	 */
	getPageCount() {
		return this.pages.length;
	}
}

export default Story;
