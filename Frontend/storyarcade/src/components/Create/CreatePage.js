import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Tooltip } from "antd";
import Page from "../../Models/Page";
import Step from "../../Models/Step";
import PageStory from "../../Models/PageStory";
import Choice from "../../Models/Choice";
import Task from "../../Models/Task";
import Story from "../../Models/Story";
import { getStory, saveChanges } from "../../api/storyAPI";
import LoadingFullscreen from "../../Tools/Loading";
import add_page_image from "../../Assets/Icon/add_new_page.png";
import add_page_image_hover from "../../Assets/Icon/add_new_page_hover.png";

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
	const [selected_page, setSelectedPage] = useState(0);
	const [is_loading, setIsLoading] = useState(false);

	useEffect(() => {
		if (!storyId) {
			navigate("/");
		}
		const getStorySaved = async () => {
			setIsLoading(true);
			const response = await getStory(jwt, storyId);
			let response_story = response.data.story;
			if (response.status === 200) {
				let story = new Story(
					response_story.title,
					response_story.pages,
					response_story.cover_image,
					response_story.allow_copy,
					response_story.access_level,
					response_story.points_required,
					response_story.created_at,
					response_story.uploader,
					response_story.original_uploader,
					response_story.original_story
				);
				setStory(story);
				setIsLoading(false);
			} else {
				navigate("/");
			}
		};
		getStorySaved();
	}, []);

	const addNewPage = () => {
		let new_page = new Page(story.pages.length + 1);
		let updatedStory = new Story(
			story.title,
			[...story.pages, new_page],
			story.cover_image,
			story.allow_copy,
			story.access_level,
			story.points_required,
			story.created_at,
			story.uploader,
			story.original_uploader,
			story.original_story
		);
		setStory(updatedStory);
	};

	const handleStepChange = async () => {
		setIsLoading(true);
		const response = await saveChanges(jwt, story, storyId);
		let response_story = response.data.updated_story;
		if (response.status === 200) {
			let story = new Story(
				response_story.title,
				response_story.pages,
				response_story.cover_image,
				response_story.allow_copy,
				response_story.access_level,
				response_story.points_required,
				response_story.created_at,
				response_story.uploader,
				response_story.original_uploader,
				response_story.original_story
			);
			setStory(story);
			setIsLoading(false);
		} else {
			navigate("/");
		}

		setIsLoading(false);
	};

	return (
		<div className="min-h-screen bg-gradient-to-tr from-purple-200 to-cyan-200 p-4">
			{is_loading && <LoadingFullscreen />}

			<div className="flex flex-col items-center">
				<div className="fixed bottom-20 bg-gradient-to-r from-red-500 to-orange-500 p-2 rounded-lg mx-64 flex justify-center gap-4">
					<Tooltip title="Add Text" placement="top" color="purple">
						<button className="border-2 border-yellow-300 hover:border-yellow-500 rounded-lg p-1">
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
						{story.pages.map((page, index) => (
							<Tooltip
								title={`Page ${page.page_number}`}
								placement="top"
								color="purple"
								key={index}
							>
								<div
									className={`bg-slate-800 flex items-center justify-center text-text-light font-extrabold text-2xl min-w-12 h-12 rounded-lg cursor-pointer hover:bg-slate-900 ${
										selected_page === index &&
										"border-2 border-yellow-300"
									}`}
									onClick={() => setSelectedPage(index)}
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
						onClick={handleStepChange}
					>
						Save Changes
					</button>
				</div>
			</div>
		</div>
	);
}

export default CreatePage;
