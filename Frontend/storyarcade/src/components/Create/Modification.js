import React from "react";
import EditPageStory from "./Edit/EditPageStory";
import EditButton from "./Edit/EditButton";

function Modification({
	selectedItem,
	listOfPageStory,
	setListOfPageStory,
	listOfTasks,
	setListOfTasks,
	listOfSteps,
	setListOfSteps,
	setSelectedItem,
	jwt,
						  selected_page,
						  storyId,
						  setIsLoading
}) {
	return (
		<div className="mt-4 lg:mt-0">
			{selectedItem && (
				<div className="bg-slate-900 rounded-2xl p-4 min-w-96 max-w-96 overflow-y-auto h-screen">
					<div className="text-text-muted text-center font-bold text-3xl mb-4">
						Modification
					</div>
					<EditPageStory
						selectedItem={selectedItem}
						listOfPageStory={listOfPageStory}
						setListOfPageStory={setListOfPageStory}
						listOfSteps={listOfSteps}
						setListOfSteps={setListOfSteps}
						setSelectedItem={setSelectedItem}
						jwt={jwt}
						selected_page={selected_page}
						storyId={storyId}
						setIsLoading={setIsLoading}
					/>

					<EditButton
						selectedItem={selectedItem}
						listOfTasks={listOfTasks}
						setListOfTasks={setListOfTasks}
						listOfSteps={listOfSteps}
						setListOfSteps={setListOfSteps}
						setSelectedItem={setSelectedItem}
						jwt={jwt}
						selected_page={selected_page}
						storyId={storyId}
						setIsLoading={setIsLoading}
					/>
				</div>
			)}
		</div>
	);
}

export default Modification;
