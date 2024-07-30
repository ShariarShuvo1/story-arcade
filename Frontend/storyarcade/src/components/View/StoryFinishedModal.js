import { ConfigProvider, Modal, notification } from "antd";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import upvote_icon from "../../Assets/Icon/upvote.png";
import downvote_icon from "../../Assets/Icon/downvote.png";
import { voteHandle } from "../../api/voteAPI";

function StoryFinishedModal({ isFinished, setIsFinished, storyId }) {
	const navigate = useNavigate();
	const jwt = JSON.parse(localStorage.getItem("jwt"));

	const voteClick = async (vote) => {
		const response = await voteHandle(jwt, storyId, vote);
		if (response.status === 200) {
			setIsFinished(false);
			navigate(`/`);
			notification.success({
				message: response.data.message,
			});
		} else {
			notification.error({
				message: response.data.message,
			});
		}
	};

	return (
		<ConfigProvider
			theme={{
				components: {
					Modal: {
						contentBg: "#050012",
					},
				},
			}}
		>
			<Modal
				open={isFinished}
				footer={null}
				onCancel={() => {
					setIsFinished(false);
					navigate(`/`);
				}}
				centered
				closable={false}
				width={"30%"}
			>
				<div>
					<div className="text-text-muted text-center text-4xl">
						How was the story?
					</div>
					<div className="flex gap-4 justify-center items-center mt-4">
						<button
							className=" flex items-center text-white text-2xl font-bold border-2 border-white rounded-lg p-2 cursor-pointer hover:bg-slate-800 transition-all duration-300 ease-in-out"
							onClick={() => voteClick("upvote")}
						>
							<img
								src={upvote_icon}
								alt="upvote"
								className="w-16 h-16 cursor-pointer"
							/>
							Upvote
						</button>
						<button
							className="flex items-center text-white text-2xl font-bold border-2 border-white rounded-lg p-2 cursor-pointer hover:bg-slate-800 transition-all duration-300 ease-in-out"
							onClick={() => voteClick("downvote")}
						>
							<img
								src={downvote_icon}
								alt="downvote"
								className="w-16 h-16 cursor-pointer"
							/>
							Downvote
						</button>
					</div>
					<div className="flex w-full justify-center items-center mt-4">
						<button
							className="flex w-full justify-center items-center text-white text-2xl font-bold border-2 border-white rounded-lg p-2 cursor-pointer hover:bg-slate-800 transition-all duration-300 ease-in-out"
							onClick={() => {
								setIsFinished(false);
								navigate(`/`);
							}}
						>
							Return to Home
						</button>
					</div>
				</div>
			</Modal>
		</ConfigProvider>
	);
}

export default StoryFinishedModal;
