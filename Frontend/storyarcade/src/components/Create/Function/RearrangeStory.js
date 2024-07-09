import PageStory from "../../../Models/PageStory";
import Step from "../../../Models/Step";
import Choice from "../../../Models/Choice";
import Task from "../../../Models/Task";
import Page from "../../../Models/Page";
import Story from "../../../Models/Story";

function rearrangeStory(response_story) {
	let tempPages = [];
	if (response_story.pages) {
		response_story.pages.forEach((page) => {
			let tempPageStories = [];
			let tempSteps = [];
			let tempChoices = [];
			let tempTasks = [];
			if (page.page_story) {
				page.page_story.forEach((page_story) => {
					tempPageStories.push(
						new PageStory(
							page_story.page_story_number,
							page_story.story_text,
							page_story.minimum_duration
						)
					);
				});
			}
			if (page.steps) {
				page.steps.forEach((step) => {
					tempSteps.push(
						new Step(
							step.step_number,
							step.step_type,
							step.child_step_number
						)
					);
				});
			}
			if (page.choices) {
				page.choices.forEach((choice) => {
					tempChoices.push(
						new Choice(
							choice.choice_number,
							choice.choice,
							choice.next_page
						)
					);
				});
			}
			if (page.tasks) {
				page.tasks.forEach((task) => {
					tempTasks.push(
						new Task(
							task.task_number,
							task.task,
							task.center_button,
							task.slider
						)
					);
				});
			}
			tempPages.push(
				new Page(
					page.page_number,
					page.background_image,
					page.background_video,
					page.is_starting_page,
					tempSteps,
					tempPageStories,
					tempChoices,
					tempTasks
				)
			);
		});
	}

	return new Story(
		response_story.title,
		tempPages,
		response_story.cover_image,
		response_story.allow_copy,
		response_story.access_level,
		response_story.points_required,
		response_story.created_at,
		response_story.uploader,
		response_story.original_uploader,
		response_story.original_story
	);
}

export default rearrangeStory;
