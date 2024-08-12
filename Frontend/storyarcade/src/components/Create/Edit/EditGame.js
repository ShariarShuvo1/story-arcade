import React from "react";
import NextSelector from "./NextSelector";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-html";
import "ace-builds/src-noconflict/mode-css";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-github_dark";
import "../style.css";

function EditGame({
	selectedItem,
	listOfSteps,
	setListOfSteps,
	setSelectedItem,
	jwt,
	selected_page,
	storyId,
	setIsLoading,
	listOfGames,
	setListOfGames,
}) {
	const handleDelete = (game) => {
		let tempGame = [];
		for (let i = 0; i < listOfGames.length; i++) {
			if (listOfGames[i] !== game) {
				tempGame.push(listOfGames[i]);
			}
		}
		let tempSteps = [];
		for (let i = 0; i < listOfSteps.length; i++) {
			if (listOfSteps[i] !== selectedItem) {
				tempSteps.push(listOfSteps[i]);
			}
		}

		setListOfSteps(tempSteps);
		setListOfGames(tempGame);
		setSelectedItem(null);
	};

	return (
		<div>
			{selectedItem.step_type === "game" &&
				listOfGames.map((game, index) => {
					if (game.game_number === selectedItem.child_step_number) {
						return (
							<div key={index} className="">
								<div className="text-text-hover text-lg font-semibold">
									Enter HTML for the game:
								</div>
								<AceEditor
									mode="html"
									theme="github_dark"
									name="htmlEditor"
									value={game.html}
									onChange={(newValue) => {
										let tempGames = [...listOfGames];
										tempGames[index].html = newValue;
										setListOfGames(tempGames);
									}}
									editorProps={{ $blockScrolling: true }}
									setOptions={{
										useWorker: false, // Disable syntax checking if you want
									}}
									style={{
										width: "100%",
										borderRadius: "8px",
										border: "2px solid #64748b",
									}}
									maxLines={30}
									minLines={10}
									placeholder="Enter HTML"
								/>

								<div className="text-text-hover text-lg font-semibold mt-4">
									Enter CSS for the game:
								</div>
								<AceEditor
									mode="css"
									theme="github_dark"
									name="cssEditor"
									value={game.css}
									onChange={(newValue) => {
										let tempGames = [...listOfGames];
										tempGames[index].css = newValue;
										setListOfGames(tempGames);
									}}
									editorProps={{ $blockScrolling: true }}
									setOptions={{
										useWorker: false,
									}}
									style={{
										width: "100%",
										borderRadius: "8px",
										border: "2px solid #64748b",
									}}
									maxLines={30}
									minLines={10}
									placeholder="Enter CSS"
								/>

								<div className="text-text-hover text-lg font-semibold mt-4">
									Enter JavaScript for the game:
								</div>
								<AceEditor
									mode="javascript"
									theme="github_dark"
									name="jsEditor"
									value={game.js}
									onChange={(newValue) => {
										let tempGames = [...listOfGames];
										tempGames[index].js = newValue;
										setListOfGames(tempGames);
									}}
									editorProps={{ $blockScrolling: true }}
									setOptions={{
										useWorker: false,
									}}
									style={{
										width: "100%",
										borderRadius: "8px",
										border: "2px solid #64748b",
									}}
									maxLines={30}
									minLines={10}
									placeholder="Enter JavaScript"
								/>

								<div className="text-red-500 text-sm mt-4">
									Please make sure to call{" "}
									<span className="text-text-muted font-bold">
										window.gameWin();
									</span>{" "}
									function when the game is won. This will
									initiate the next step.
								</div>

								<NextSelector
									setIsLoading={setIsLoading}
									selectedItem={selectedItem}
									jwt={jwt}
									selected_page={selected_page}
									storyId={storyId}
									setSelectedItem={setSelectedItem}
								/>

								<button
									className="py-2 mt-4 rounded-lg bg-red-500 hover:bg-red-600 w-full text-2xl font-bold text-center"
									onClick={() => handleDelete(game)}
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

export default EditGame;
