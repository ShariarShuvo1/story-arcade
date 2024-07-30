import React, { useState, useEffect, useRef } from "react";
import avatar_placeholder from "../../Assets/Icon/profile.png";
import upvote_icon from "../../Assets/Icon/upvote.png";
import downvote_icon from "../../Assets/Icon/downvote.png";
import comment_icon from "../../Assets/Icon/comment.png";
import coin_icon from "../../Assets/AI/coin_icon.png";
import clone_icon from "../../Assets/Icon/clone.png";
import access_icon from "../../Assets/Icon/access.png";
import no_access_icon from "../../Assets/Icon/no_access.png";
import { useNavigate } from "react-router-dom";
import CommentModal from "./CommentModal";
import { notification, Spin, Tooltip } from "antd";
import {
	getStoryAccess,
	provideFollowerAccess,
	provideFreeAccess,
} from "../../api/homepageStoryAPI";
import { checkIfFollow, followUser } from "../../api/usersAPI";
import BuyStoryModal from "./BuyStoryModal";
import { cloneStory, deleteStory, storyExist } from "../../api/storyAPI";

function StoryCard({
	story,
	myId,
	availablePoints,
	setAvailablePoints,
	isLoading,
	setIsLoading,
}) {
	const navigate = useNavigate();
	const jwt = JSON.parse(localStorage.getItem("jwt"));
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const dropdownRef = useRef(null);
	const [commentModalVisible, setCommentModalVisible] = useState(false);
	const [buyStoryModalVisible, setBuyStoryModalVisible] = useState(false);
	const [playLoading, setPlayLoading] = useState(false);
	const [hasAccess, setHasAccess] = useState(false);

	useEffect(() => {
		const doCheckAccess = async () => {
			if (jwt) {
				const response = await getStoryAccess(jwt, story._id);
				if (response.status === 200) {
					setHasAccess(true);
				} else {
					setHasAccess(false);
				}
			}
		};
		doCheckAccess();
	}, [jwt]);

	const upvoteClickHandler = () => {
		// handle Upvote Click here
		console.log("Upvote clicked");
	};

	const downvoteClickHandler = () => {
		// handle Down vote Click here
		console.log("Down vote clicked");
	};

	const commentClickHandler = () => {
		setCommentModalVisible(true);
	};

	const playClickHandler = async () => {
		if (!jwt) {
			notification.error({
				message: "You need to login to play story",
			});
			return;
		}
		setPlayLoading(true);

		const response = await getStoryAccess(jwt, story._id);
		if (response.status === 200) {
			navigate(`/view/viewStory/${story._id}`);
		} else {
			if (story.access_level === "public") {
				const res = await provideFreeAccess(jwt, story._id);
				if (res.status === 200) {
					navigate(`/view/viewStory/${story._id}`);
				} else {
					notification.error({
						message: res.data.message,
					});
				}
			} else if (story.access_level === "followers_only") {
				let res = await checkIfFollow(jwt, story.uploader);
				if (res.status === 200) {
					res = await provideFollowerAccess(jwt, story._id);
					if (res.status === 200) {
						navigate(`/view/viewStory/${story._id}`);
					} else {
						notification.error({
							message: res.data.message,
						});
					}
				} else {
					notification.error({
						message:
							"You need to follow the author to access this story",
					});
				}
			} else if (story.access_level === "paid") {
				setBuyStoryModalVisible(true);
				setPlayLoading(false);
			}
		}
		setPlayLoading(false);
	};

	const handleClickOutside = (event) => {
		if (
			dropdownRef.current &&
			!dropdownRef.current.contains(event.target)
		) {
			setIsDropdownOpen(false);
		}
	};

	useEffect(() => {
		if (isDropdownOpen) {
			document.addEventListener("mousedown", handleClickOutside);
		} else {
			document.removeEventListener("mousedown", handleClickOutside);
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [isDropdownOpen]);

	const handleOriginalStoryClick = async () => {
		if (!story.original_story) {
			notification.error({
				message: "No original story found",
			});
		}
		const response = await storyExist(jwt, story.original_story);

		if (response.status === 200) {
			navigate(`/view/viewStory/${story.original_story}`);
		} else {
			notification.error({
				message: response.data.message,
			});
		}
	};

	return (
		<div className="w-full rounded-lg overflow-hidden shadow-lg bg-slate-900 hover:scale-105 transition duration-300 relative">
			<CommentModal
				commentModalVisible={commentModalVisible}
				setCommentModalVisible={setCommentModalVisible}
				story={story}
			/>
			<BuyStoryModal
				buyStoryModalVisible={buyStoryModalVisible}
				setBuyStoryModalVisible={setBuyStoryModalVisible}
				story={story}
				availablePoints={availablePoints}
				setAvailablePoints={setAvailablePoints}
			/>
			<div className="relative">
				<img
					className="w-full h-48 object-cover"
					src={story.cover_image}
					alt={story.title}
				/>
				<button
					className="absolute top-2 right-2 bg-gray-700 text-white p-1 rounded-full hover:bg-gray-600"
					onClick={() => setIsDropdownOpen(!isDropdownOpen)}
				>
					<svg
						className="w-6 h-6"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2"
							d="M12 6v.01M12 12v.01M12 18v.01"
						></path>
					</svg>
				</button>
				{isDropdownOpen && (
					<div
						className="absolute w-32 right-2 top-10 text-white rounded overflow-hidden shadow-lg z-10"
						ref={dropdownRef}
					>
						{myId && myId === story.uploader && (
							<button
								className="w-full text-left text-white bg-gray-700 hover:bg-gray-600 font-bold p-2"
								onClick={() => navigate(`/edit/${story._id}`)}
							>
								Edit
							</button>
						)}
						{story.original_story && (
							<button
								className="w-full text-left text-white bg-gray-700 hover:bg-gray-600 font-bold p-2"
								onClick={handleOriginalStoryClick}
							>
								Original Story
							</button>
						)}
						{story.allow_copy === true && jwt && (
							<button
								className=" w-full text-left text-white bg-gray-700 hover:bg-gray-600 font-bold p-2"
								onClick={() => {
									setIsLoading(true);
									cloneStory(jwt, story._id).then(
										(response) => {
											setIsLoading(false);
											if (response.status === 200) {
												notification.success({
													message:
														response.data.message,
												});
												navigate(
													`/edit/${response.data.story_id}`
												);
											} else {
												notification.error({
													message:
														response.data.message,
												});
											}
										}
									);
								}}
							>
								Clone Story
							</button>
						)}
						{myId && myId === story.uploader && (
							<button
								className=" w-full text-left text-black bg-red-600 hover:bg-red-500 font-bold p-2"
								onClick={() => {
									setIsLoading(true);
									deleteStory(jwt, story._id).then(
										(response) => {
											setIsLoading(false);
											if (response.status === 200) {
												notification.success({
													message:
														response.data.message,
												});
												window.location.reload();
											} else {
												notification.error({
													message:
														response.data.message,
												});
											}
										}
									);
								}}
							>
								Delete
							</button>
						)}
					</div>
				)}
			</div>
			<div className="px-6 py-2">
				<div className="flex items-center mb-1">
					<img
						className="w-10 h-10 rounded-full mr-4 hover:scale-110 transition duration-300 cursor-pointer"
						src={
							story.uploader_info.avatar
								? story.uploader_info.avatar
								: avatar_placeholder
						}
						alt="Uploader avatar"
						onClick={() => navigate(`/profile/${story.uploader}`)}
					/>
					<div className="text-sm">
						<div className="flex gap-2 items-center">
							<div
								className="text-text-light text-lg leading-none hover:text-text-muted cursor-pointer"
								onClick={() =>
									navigate(`/profile/${story.uploader}`)
								}
							>
								{story.uploader_info.name}
							</div>
							{story.original_uploader && (
								<Tooltip
									title="This Story is cloned"
									color="purple"
									placement="right"
								>
									<img
										src={clone_icon}
										alt="clone"
										className="w-4 h-4 hover:scale-105 transition duration-300 cursor-pointer"
										onClick={() => {
											navigate(
												`/profile/${story.original_uploader}`
											);
										}}
									/>
								</Tooltip>
							)}
						</div>
						<p className="text-gray-400">
							{new Date(story.created_at).toLocaleString()}
						</p>
					</div>
				</div>
				<div className="font-bold text-xl text-text-muted">
					{story.title}
				</div>
			</div>
			<div className="px-6 flex items-center text-text-light gap-2">
				<div
					className="flex flex-grow gap-1 items-center rounded-lg bg-slate-800 px-4 py-1 cursor-pointer hover:bg-slate-700"
					onClick={upvoteClickHandler}
				>
					<img src={upvote_icon} alt="upvote" className="w-4 h-4" />
					<div>{story.upvote_count}</div>
				</div>
				<div
					className="flex flex-grow gap-1 items-center rounded-lg bg-slate-800 px-4 py-1 cursor-pointer hover:bg-slate-700"
					onClick={downvoteClickHandler}
				>
					<img
						src={downvote_icon}
						alt="downvote"
						className="w-4 h-4"
					/>
					<div>{story.downvote_count}</div>
				</div>
				<div
					className="flex flex-grow gap-1 items-center rounded-lg bg-slate-800 px-4 py-1 cursor-pointer hover:bg-slate-700"
					onClick={commentClickHandler}
				>
					<img src={comment_icon} alt="comment" className="w-4 h-4" />
					<div>{story.comment_count}</div>
				</div>
			</div>
			<div className="text-orange-400 bg-slate-800 mx-6 rounded-md p-1 px-2 mt-2 select-none flex items-center justify-between">
				{story.access_level === "paid" ? (
					<div className="flex items-center gap-2">
						<img src={coin_icon} alt="coin" className="w-6 h-6" />
						<div>{story.points_required} Coins Required</div>
					</div>
				) : story.access_level === "followers_only" ? (
					<div className="flex items-center gap-2">
						<div>Followers Only</div>
					</div>
				) : (
					<div className="flex items-center gap-2">
						<div>Free</div>
					</div>
				)}
				<Tooltip
					title={
						hasAccess
							? "You have access to this story"
							: "You don't have access to this story"
					}
					color={hasAccess ? "geekblue" : "red"}
					placement="right"
				>
					<img
						src={hasAccess ? access_icon : no_access_icon}
						alt="access"
						className="w-6 h-6"
					/>
				</Tooltip>
			</div>
			<div className="flex px-6 gap-4 my-2 mb-4">
				<button
					className={`w-full text-black font-bold py-2 px-4 rounded ${
						hasAccess
							? "bg-green-600 hover:bg-green-500"
							: "bg-yellow-500 hover:bg-yellow-600"
					}`}
					onClick={playClickHandler}
				>
					<div className="flex gap-4 justify-center items-center">
						<div>{hasAccess ? "Play" : "Get"}</div>
						<Spin size="small" spinning={playLoading} />
					</div>
				</button>
			</div>
		</div>
	);
}

export default StoryCard;
