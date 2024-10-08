import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Page from "../../Models/Page";
import { getPage } from "../../api/storyAPI";
import LoadingFullscreen from "../../Tools/Loading";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import PageList from "./PageList";
import ToolBar from "./ToolBar";
import TaskList from "./TaskList";
import Modification from "./Modification";
import Display from "./Display";
import { getPointsLeft } from "../../api/usersAPI";
import AIModal from "./AIModal";
import TopBar from "./TopBar";
import { notification } from "antd";

function CreatePage() {
	const jwt = JSON.parse(localStorage.getItem("jwt"));
	const { storyId } = useParams();
	const navigate = useNavigate();

	const [story, setStory] = useState([]);
	const [listOfSteps, setListOfSteps] = useState([]);
	const [listOfPageStory, setListOfPageStory] = useState([]);
	const [listOfChoices, setListOfChoices] = useState([]);
	const [listOfTasks, setListOfTasks] = useState([]);
	const [listOfMover, setListOfMover] = useState([]);
	const [listOfGames, setListOfGames] = useState([]);

	const [selected_page, setSelectedPage] = useState(0);
	const [currentPage, setCurrentPage] = useState(null);
	const [is_loading, setIsLoading] = useState(false);
	const [selectedItem, setSelectedItem] = useState(null);
	const [selectedImage, setSelectedImage] = useState("");

	const [pointsLeft, setPointsLeft] = useState(0);
	const [ai_image_modal_visible, setAiImageModalVisible] = useState(false);
	const [prompt, setPrompt] = useState("");
	const [title, setTitle] = useState("");

	useEffect(() => {
		if (!jwt) {
			notification.error({
				description: "Please login to Edit Story",
			});
			navigate("/");
		}
	}, [jwt]);

	const fetchPointsLeft = async () => {
		setIsLoading(true);
		const response = await getPointsLeft(jwt);
		if (response.status === 200) {
			setPointsLeft(response.data.point);
		} else {
			setPointsLeft(0);
		}

		setIsLoading(false);
	};

	useEffect(() => {
		fetchPointsLeft();
	}, []);

	useEffect(() => {
		const getSpecificPage = async () => {
			setIsLoading(true);
			if (selected_page) {
				const response = await getPage(jwt, storyId, selected_page);
				if (response.status === 200) {
					let response_story = response.data.story;
					let response_page = response.data.page;
					setTitle(response.data.story_title);
					if (response_page === null) {
						let is_start = selected_page === 1;
						let tempPage = new Page(
							selected_page,
							"",
							"",
							is_start,
							[],
							[],
							[],
							[],
							[],
							[]
						);
						setListOfSteps(tempPage.steps);
						setListOfPageStory(tempPage.page_story);
						setListOfChoices(tempPage.choices);
						setListOfTasks(tempPage.tasks);
						setListOfMover(tempPage.mover);
						setListOfGames(tempPage.games);
						setSelectedImage(tempPage.background_image);
						setCurrentPage(tempPage);
						setStory([...story, selected_page]);
					} else {
						setListOfSteps(response_page.steps);
						setListOfPageStory(response_page.page_story);
						setListOfChoices(response_page.choices);
						setListOfTasks(response_page.tasks);
						setListOfMover(response_page.mover);
						setListOfGames(response_page.games);
						setSelectedImage(response_page.background_image);
						setCurrentPage(response_page);
						setStory(response_story);
					}
				} else {
					notification.error({
						message: `${response.data.message}`,
					});
				}
			}
			setSelectedItem(null);
			setIsLoading(false);
		};

		getSpecificPage();
	}, [selected_page]);

	useEffect(() => {
		if (!storyId) {
			navigate("/");
		}
		const getStorySaved = async () => {
			setIsLoading(true);
			const response = await getPage(jwt, storyId, null);
			if (response.status === 200) {
				let response_story = response.data.story;
				let response_page = response.data.page;
				setTitle(response.data.story_title);
				if (response_story.length === 0 && jwt) {
					setSelectedPage(1);
				} else {
					setListOfSteps(response_page.steps);
					setListOfPageStory(response_page.page_story);
					setListOfChoices(response_page.choices);
					setListOfTasks(response_page.tasks);
					setListOfMover(response_page.mover);
					setListOfGames(response_page.games);
					setSelectedImage(response_page.background_image);
					setSelectedPage(response_page.page_number);
					setCurrentPage(response_page);
					setStory(response_story);
				}
			} else {
				notification.error({
					message: `${response.data.message}`,
				});
				navigate("/");
			}
			setIsLoading(false);
		};
		getStorySaved();
	}, []);

	return (
		<DndProvider backend={HTML5Backend}>
			<div className="pt-1">
				<AIModal
					fetchPointsLeft={fetchPointsLeft}
					setIsLoading={setIsLoading}
					ai_image_modal_visible={ai_image_modal_visible}
					setAiImageModalVisible={setAiImageModalVisible}
					setSelectedImage={setSelectedImage}
					jwt={jwt}
					prompt={prompt}
					setPrompt={setPrompt}
					pointsLeft={pointsLeft}
					storyId={storyId}
					selected_page={selected_page}
				/>
				{is_loading && <LoadingFullscreen />}
				<TopBar
					title={title}
					story={story}
					selected_page={selected_page}
					setSelectedPage={setSelectedPage}
					setIsLoading={setIsLoading}
					setSelectedItem={setSelectedItem}
					jwt={jwt}
					storyId={storyId}
					currentPage={currentPage}
					listOfSteps={listOfSteps}
					setListOfSteps={setListOfSteps}
					listOfPageStory={listOfPageStory}
					setListOfPageStory={setListOfPageStory}
					listOfChoices={listOfChoices}
					setListOfChoices={setListOfChoices}
					listOfTasks={listOfTasks}
					setListOfTasks={setListOfTasks}
					listOfMover={listOfMover}
					setListOfMover={setListOfMover}
					selectedImage={selectedImage}
					setSelectedImage={setSelectedImage}
					setCurrentPage={setCurrentPage}
					setStory={setStory}
					navigate={navigate}
					setTitle={setTitle}
					pointsLeft={pointsLeft}
					setPointsLeft={setPointsLeft}
					listOfGames={listOfGames}
					setListOfGames={setListOfGames}
				/>
				<div className="lg:flex gap-4 justify-between my-1 me-1">
					<TaskList
						listOfSteps={listOfSteps}
						listOfTasks={listOfTasks}
						selectedItem={selectedItem}
						setListOfSteps={setListOfSteps}
						setSelectedItem={setSelectedItem}
					/>

					<Display
						selectedImage={selectedImage}
						listOfPageStory={listOfPageStory}
						setListOfPageStory={setListOfPageStory}
						selectedItem={selectedItem}
						setSelectedItem={setSelectedItem}
						listOfTasks={listOfTasks}
						setListOfTasks={setListOfTasks}
						listOfChoices={listOfChoices}
						listOfSteps={listOfSteps}
						listOfGames={listOfGames}
					/>

					{selectedItem && (
						<Modification
							selectedItem={selectedItem}
							listOfPageStory={listOfPageStory}
							setListOfPageStory={setListOfPageStory}
							listOfTasks={listOfTasks}
							setListOfTasks={setListOfTasks}
							listOfSteps={listOfSteps}
							setListOfSteps={setListOfSteps}
							setSelectedItem={setSelectedItem}
							jwt={jwt}
							selected_page={selected_page}
							storyId={storyId}
							setIsLoading={setIsLoading}
							listOfChoices={listOfChoices}
							setListOfChoices={setListOfChoices}
							listOfMover={listOfMover}
							setListOfMover={setListOfMover}
							listOfGames={listOfGames}
							setListOfGames={setListOfGames}
						/>
					)}
				</div>

				<ToolBar
					selected_page={selected_page}
					listOfPageStory={listOfPageStory}
					setListOfPageStory={setListOfPageStory}
					listOfSteps={listOfSteps}
					setListOfSteps={setListOfSteps}
					setSelectedItem={setSelectedItem}
					selectedImage={selectedImage}
					setSelectedImage={setSelectedImage}
					setAiImageModalVisible={setAiImageModalVisible}
					pointsLeft={pointsLeft}
					listOfTasks={listOfTasks}
					setListOfTasks={setListOfTasks}
					listOfChoices={listOfChoices}
					setListOfChoices={setListOfChoices}
					listOfMover={listOfMover}
					setListOfMover={setListOfMover}
					listOfGames={listOfGames}
					setListOfGames={setListOfGames}
				/>

				<PageList
					story={story}
					setStory={setStory}
					selected_page={selected_page}
					setSelectedPage={setSelectedPage}
					listOfSteps={listOfSteps}
					setListOfSteps={setListOfSteps}
					listOfPageStory={listOfPageStory}
					setListOfPageStory={setListOfPageStory}
					listOfChoices={listOfChoices}
					setListOfChoices={setListOfChoices}
					listOfTasks={listOfTasks}
					setListOfTasks={setListOfTasks}
					selectedImage={selectedImage}
					setSelectedImage={setSelectedImage}
					currentPage={currentPage}
					setCurrentPage={setCurrentPage}
					setIsLoading={setIsLoading}
					jwt={jwt}
					storyId={storyId}
					navigate={navigate}
					setSelectedItem={setSelectedItem}
					listOfMover={listOfMover}
					setListOfMover={setListOfMover}
					setTitle={setTitle}
					listOfGames={listOfGames}
					setListOfGames={setListOfGames}
				/>
			</div>
		</DndProvider>
	);
}

export default CreatePage;
