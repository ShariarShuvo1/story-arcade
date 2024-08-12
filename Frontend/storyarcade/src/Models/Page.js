import Step from "./Step";
import PageStory from "./PageStory";
import Choice from "./Choice";
import Task from "./Task";

class Page {
	/**
	 * @param {number} page_number - The page number.
	 * @param {string} [background_image] - The background image URL.
	 * @param {string} [background_video] - The background video URL.
	 * @param {boolean} [is_starting_page=false] - Is this the starting page?
	 * @param {Array<Step>} steps - Array of Step objects.
	 * @param {Array<PageStory>} page_story - Array of PageStory objects.
	 * @param {Array<Choice>} choices - Array of Choice objects.
	 * @param {Array<Task>} tasks - Array of Task objects.
	 * @param {Array<Mover>} mover - Array of Mover objects.
	 * @param {Array<Game>} games - Array of Mover objects.
	 */
	constructor(
		page_number,
		background_image = "",
		background_video = "",
		is_starting_page = false,
		steps = [],
		page_story = [],
		choices = [],
		tasks = [],
		mover = [],
		games = []
	) {
		this.page_number = page_number;
		this.background_image = background_image;
		this.background_video = background_video;
		this.is_starting_page = is_starting_page;
		this.steps = steps;
		this.page_story = page_story;
		this.choices = choices;
		this.tasks = tasks;
		this.mover = mover;
		this.games = games;
	}

	/**
	 * @param {Step} step - The step to add.
	 */
	addStep(step) {
		this.steps.push(step);
	}

	/**
	 * @param {PageStory} page_story - The page story to add.
	 */
	addPageStory(page_story) {
		this.page_story.push(page_story);
	}

	/**
	 * @param {Choice} choice - The choice to add.
	 */
	addChoice(choice) {
		this.choices.push(choice);
	}

	/**
	 * @param {Task} task - The task to add.
	 */
	addTask(task) {
		this.tasks.push(task);
	}
}

export default Page;
