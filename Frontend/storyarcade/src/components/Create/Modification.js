import EditPageStory from "./Edit/EditPageStory";
import EditButton from "./Edit/EditButton";
import EditSlider from "./Edit/EditSlider";
import EditChoice from "./Edit/EditChoice";
import EditMover from "./Edit/EditMover";
import "./style.css";
import EditGame from "./Edit/EditGame";

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
	setIsLoading,
	listOfChoices,
	setListOfChoices,
	listOfMover,
	setListOfMover,
	listOfGames,
	setListOfGames,
}) {
	return (
		<div className="mt-4 lg:mt-0">
			{selectedItem && (
				<div
					id="taskList"
					className="bg-slate-900 rounded-2xl p-4 w-96 overflow-y-auto 2xl:max-h-[700px] xl:max-h-[600px] lg:max-h-[500px] md:max-h-[400px] sm:max-h-[300px] max-h-[200px]"
				>
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

					<EditSlider
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

					<EditMover
						selectedItem={selectedItem}
						listOfSteps={listOfSteps}
						setListOfSteps={setListOfSteps}
						setSelectedItem={setSelectedItem}
						jwt={jwt}
						selected_page={selected_page}
						storyId={storyId}
						setIsLoading={setIsLoading}
						listOfMover={listOfMover}
						setListOfMover={setListOfMover}
					/>

					<EditGame
						selectedItem={selectedItem}
						listOfSteps={listOfSteps}
						setListOfSteps={setListOfSteps}
						setSelectedItem={setSelectedItem}
						jwt={jwt}
						selected_page={selected_page}
						storyId={storyId}
						setIsLoading={setIsLoading}
						listOfGames={listOfGames}
						setListOfGames={setListOfGames}
					/>

					<EditChoice
						selectedItem={selectedItem}
						listOfSteps={listOfSteps}
						setListOfSteps={setListOfSteps}
						setSelectedItem={setSelectedItem}
						jwt={jwt}
						selected_page={selected_page}
						storyId={storyId}
						setIsLoading={setIsLoading}
						listOfChoices={listOfChoices}
						setListOfChoices={setListOfChoices}
					/>
				</div>
			)}
		</div>
	);
}

export default Modification;
