import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Tooltip } from "antd";
import Page from "../../Models/Page";
import Step from "../../Models/Step";
import PageStory from "../../Models/PageStory";
import Story from "../../Models/Story";
import { getStory, saveChanges } from "../../api/storyAPI";
import LoadingFullscreen from "../../Tools/Loading";
import Draggable from "react-draggable";
import RearrangeStory from "./Function/RearrangeStory";

function CreatePage() {
	const jwt = JSON.parse(localStorage.getItem("jwt"));
	const { storyId } = useParams();
	const navigate = useNavigate();

	const add_page_image = require("../../Assets/Icon/add_new_page.png");
	const add_page_image_hover = require("../../Assets/Icon/add_new_page_hover.png");
	const add_text_image = require("../../Assets/Icon/insert_text.png");
	const add_text_image_hover = require("../../Assets/Icon/insert_text_hover.png");
	const add_button_image = require("../../Assets/Icon/insert_button.png");
	const add_button_image_hover = require("../../Assets/Icon/insert_button_hover.png");
	const add_slider_image = require("../../Assets/Icon/insert_slider.png");
	const add_slider_image_hover = require("../../Assets/Icon/insert_slider_hover.png");
	const add_option_image = require("../../Assets/Icon/insert_option.png");
	const add_option_image_hover = require("../../Assets/Icon/insert_option_hover.png");

	const [story, setStory] = useState(new Story(""));

	const [listOfPages, setListOfPages] = useState([new Page()]);

	const [selected_page, setSelectedPage] = useState(0);
	const [is_loading, setIsLoading] = useState(false);
	const [selectedItem, setSelectedItem] = useState(null);

	useEffect(() => {
		if (!storyId) {
			navigate("/");
		}
		const getStorySaved = async () => {
			setIsLoading(true);
			const response = await getStory(jwt, storyId);
			if (response.status === 200) {
				let response_story = response.data.story;
				let returnedStory = RearrangeStory(response_story);

				let minimum_page_number = Math.min(
					...returnedStory.pages.map((o) => o.page_number),
					99999
				);
				if (minimum_page_number === 99999) {
					minimum_page_number = 1;
					returnedStory.pages.push(
						new Page(
							minimum_page_number,
							"",
							"",
							true,
							[],
							[],
							[],
							[]
						)
					);
				}
				setSelectedPage(1);

				setListOfPages(returnedStory.pages);
				setStory(returnedStory);
				setIsLoading(false);
			} else {
				navigate("/");
			}
			setIsLoading(false);
		};
		getStorySaved();
	}, []);

	const addNewPage = () => {
		const max_page_number = Math.max(
			...listOfPages.map((o) => o.page_number),
			0
		);
		let new_page = new Page(max_page_number + 1);
		let tempPages = [...listOfPages, new_page];
		setSelectedPage(max_page_number + 1);
		setListOfPages(tempPages);
	};

	const handleSaveChange = async () => {
		setIsLoading(true);
		let tempStory = { ...story };
		tempStory.pages = listOfPages;
		const response = await saveChanges(jwt, tempStory, storyId);

		if (response.status === 200) {
			let response_story = response.data.updated_story;
			let returnedStory = RearrangeStory(response_story);
			let minimum_page_number = Math.min(
				...returnedStory.pages.map((o) => o.page_number),
				99999
			);
			if (minimum_page_number === 99999) {
				minimum_page_number = 1;
				returnedStory.pages.push(
					new Page(minimum_page_number, "", "", true, [], [], [], [])
				);
				setSelectedPage(1);
			}

			setListOfPages(returnedStory.pages);
			setStory(returnedStory);
			setIsLoading(false);
		} else {
			navigate("/");
		}

		setIsLoading(false);
	};

	const handleStop = (e, data, index) => {
		let listOfSteps = [];
		let idx = 0;

		for (let i = 0; i < listOfPages.length; i++) {
			if (listOfPages[i].page_number === selected_page) {
				listOfSteps = listOfPages[i].steps;
				idx = i;
				break;
			}
		}
		const newIndex = Math.max(
			0,
			Math.min(listOfSteps.length - 1, index + Math.round(data.y / 50))
		);

		const newSteps = [...listOfSteps];
		const [removed] = newSteps.splice(index, 1);
		newSteps.splice(newIndex, 0, removed);

		let tempPages = [...listOfPages];
		tempPages[idx].steps = newSteps;
		setListOfPages(tempPages);
	};

	const handleAddText = () => {
		console.log(listOfPages);
		if (!selected_page) {
			return;
		}

		let listOfPageStory = [];
		let idx = 0;

		for (let i = 0; i < listOfPages.length; i++) {
			if (listOfPages[i].page_number === selected_page) {
				listOfPageStory = listOfPages[i].page_story;
				idx = i;
				break;
			}
		}

		let max_page_story_number = Math.max(
			...listOfPageStory.map((o) => o.page_story_number),
			0
		);

		const newPageStory = new PageStory(max_page_story_number + 1, "", 20);
		let tempPages = [...listOfPages];
		tempPages[idx].page_story = [...listOfPageStory, newPageStory];
		setSelectedItem(newPageStory);

		let listOfSteps = [];
		idx = 0;

		for (let i = 0; i < listOfPages.length; i++) {
			if (listOfPages[i].page_number === selected_page) {
				listOfSteps = listOfPages[i].steps;
				idx = i;
				break;
			}
		}

		const max_step_number = Math.max(
			...listOfSteps.map((o) => o.step_number),
			0
		);

		let newStep = new Step(
			max_step_number + 1,
			"story",
			newPageStory.page_story_number
		);
		tempPages[idx].steps = [...listOfSteps, newStep];
		console.log(tempPages);
		setListOfPages(tempPages);
	};

	return (
		<div className="min-h-screen bg-gradient-to-tr from-purple-200 to-cyan-200 p-4">
			{is_loading && <LoadingFullscreen />}
			<div className="flex gap-4 justify-between max-h-96 ">
				<div className="bg-slate-900 rounded-2xl p-4 min-w-96 max-w-96 overflow-y-auto h-screen">
					<div className="text-text-light text-center font-bold text-3xl mb-4">
						Steps
					</div>
					<div className="">
						{listOfPages.map((page, index) => {
							if (page.page_number === selected_page) {
								return page.steps.map((step, idx) => (
									<Draggable
										key={idx}
										axis="y"
										onStop={(e, data) =>
											handleStop(e, data, index)
										}
									>
										<div className="bg-slate-800 p-2 my-1 rounded-lg text-text-muted font-bold text-2xl">
											{step.step_number}
											{". "}
											{step.step_type.toUpperCase()}
										</div>
									</Draggable>
								));
							}
							return null; // This ensures that the map function returns something for each page
						})}
					</div>
				</div>

				<div className="bg-slate-900 rounded min-w-96 max-w-96 flex-grow">
					sdsdsa
				</div>

				<div className="bg-slate-900 rounded min-w-96 max-w-96 flex-grow">
					sdsdsa
				</div>
			</div>

			<div className="flex flex-col items-center">
				<div className="fixed bottom-20 bg-gradient-to-r from-red-500 to-orange-500 p-2 rounded-lg mx-64 flex justify-center gap-4">
					<Tooltip title="Add Text" placement="top" color="purple">
						<button
							className="border-2 border-yellow-300 hover:border-yellow-500 rounded-lg p-1"
							onClick={handleAddText}
						>
							<img
								src={add_text_image}
								alt="Add Text"
								className="min-w-8 h-8 cursor-pointer"
								onMouseOver={(e) =>
									(e.currentTarget.src = add_text_image_hover)
								}
								onMouseOut={(e) =>
									(e.currentTarget.src = add_text_image)
								}
							/>
						</button>
					</Tooltip>

					<Tooltip title="Add Button" placement="top" color="purple">
						<button className="border-2 border-yellow-300 hover:border-yellow-500 rounded-lg p-1">
							<img
								src={add_button_image}
								alt="Add Button"
								className="min-w-8 h-8 cursor-pointer"
								onMouseOver={(e) =>
									(e.currentTarget.src =
										add_button_image_hover)
								}
								onMouseOut={(e) =>
									(e.currentTarget.src = add_button_image)
								}
							/>
						</button>
					</Tooltip>

					<Tooltip title="Add Slider" placement="top" color="purple">
						<button className="border-2 border-yellow-300 hover:border-yellow-500 rounded-lg p-1">
							<img
								src={add_slider_image}
								alt="Add Slider"
								className="min-w-8 h-8 cursor-pointer"
								onMouseOver={(e) =>
									(e.currentTarget.src =
										add_slider_image_hover)
								}
								onMouseOut={(e) =>
									(e.currentTarget.src = add_slider_image)
								}
							/>
						</button>
					</Tooltip>

					<Tooltip title="Add Option" placement="top" color="purple">
						<button className="border-2 border-yellow-300 hover:border-yellow-500 rounded-lg p-1">
							<img
								src={add_option_image}
								alt="Add Option"
								className="min-w-8 h-8 cursor-pointer"
								onMouseOver={(e) =>
									(e.currentTarget.src =
										add_option_image_hover)
								}
								onMouseOut={(e) =>
									(e.currentTarget.src = add_option_image)
								}
							/>
						</button>
					</Tooltip>
				</div>
			</div>

			<div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-purple-400 to-cyan-400 p-2 rounded-t-lg mx-4">
				<div className=" flex justify-around gap-4">
					<div className="flex w-full overflow-x-auto gap-2">
						{listOfPages.map((page, index) => (
							<Tooltip
								title={`Page ${page.page_number}`}
								placement="top"
								color="purple"
								key={index}
							>
								<div
									className={`bg-slate-800 flex items-center justify-center text-text-light font-extrabold text-2xl min-w-12 h-12 rounded-lg cursor-pointer hover:bg-slate-900 ${
										selected_page === page.page_number &&
										"border-2 border-yellow-300"
									}`}
									onClick={() =>
										setSelectedPage(page.page_number)
									}
								>
									{page.page_number}
								</div>
							</Tooltip>
						))}

						<Tooltip
							title="Add New Page"
							placement="top"
							color="purple"
						>
							<img
								src={add_page_image}
								alt="Add Page"
								className="min-w-12 h-12 cursor-pointer"
								onMouseOver={(e) =>
									(e.currentTarget.src = add_page_image_hover)
								}
								onMouseOut={(e) =>
									(e.currentTarget.src = add_page_image)
								}
								onClick={addNewPage}
							/>
						</Tooltip>
					</div>
					<button
						className="bg-slate-800 text-lg font-bold text-text-light min-w-48 h-12 rounded-lg cursor-pointer hover:bg-slate-900 p-2"
						onClick={handleSaveChange}
					>
						Save Changes
					</button>
				</div>
			</div>
		</div>
	);
}

export default CreatePage;
