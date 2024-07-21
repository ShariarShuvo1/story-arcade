import React from "react";

function EditPageStory({
	selectedItem,
	listOfPageStory,
	setListOfPageStory,
	listOfSteps,
	setListOfSteps,
	setSelectedItem,
}) {
	const handleDelete = (page_story) => {
		let tempPageStory = [];
		for (let i = 0; i < listOfPageStory.length; i++) {
			if (listOfPageStory[i] !== page_story) {
				tempPageStory.push(listOfPageStory[i]);
			}
		}
		let tempSteps = [];
		for (let i = 0; i < listOfSteps.length; i++) {
			if (listOfSteps[i] !== selectedItem) {
				tempSteps.push(listOfSteps[i]);
			}
		}
		setListOfSteps(tempSteps);
		setListOfPageStory(tempPageStory);
		setSelectedItem(null);
	};

	return (
		<div className="">
			{selectedItem.step_type === "story" &&
				listOfPageStory.map((page_story, index) => {
					if (
						page_story.page_story_number ===
						selectedItem.child_step_number
					) {
						return (
							<div key={index} className="">
								<div className="text-text-hover text-lg mb-4 font-semibold">
									Enter Story Text:
								</div>
								<textarea
									value={page_story.story_text}
									autoFocus={true}
									rows={3}
									onChange={(e) => {
										let tempPageStory = [
											...listOfPageStory,
										];
										tempPageStory[index].story_text =
											e.target.value;
										setListOfPageStory(tempPageStory);
									}}
									className="bg-transparent border-2 w-full border-slate-500 p-2 rounded-lg text-text-light"
									placeholder={"Enter Story Text"}
									maxLength={120}
								/>
								<button
									className="py-2 mt-2 rounded-lg bg-red-500 hover:bg-red-600 w-full text-2xl font-bold text-center"
									onClick={() => handleDelete(page_story)}
								>
									Delete
								</button>
							</div>
						);
					}
				})}
		</div>
	);
}

export default EditPageStory;
