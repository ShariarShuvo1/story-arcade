import { ConfigProvider, Modal, notification, Switch, Tooltip } from "antd";
import React, { useState } from "react";
import { gifGenForPage, imageGenForPage, sdGetImage } from "../../api/aiAPI";

function AIModal({
	fetchPointsLeft,
	setIsLoading,
	ai_image_modal_visible,
	setAiImageModalVisible,
	setSelectedImage,
	jwt,
	prompt,
	setPrompt,
	pointsLeft,
	storyId,
	selected_page,
}) {
	const [selectedMode, setSelectedMode] = useState("image");
	const [includeStoryInfo, setIncludeStoryInfo] = useState(false);

	const handleGenerateImage = async () => {
		if (!prompt && !includeStoryInfo) {
			notification.error({
				description: "Enter Prompt to generate",
			});
			return;
		}
		setIsLoading(true);
		setAiImageModalVisible(false);
		let response = null;
		if (selectedMode === "image") {
			if (includeStoryInfo) {
				response = await imageGenForPage(
					jwt,
					prompt,
					storyId,
					selected_page
				);
			} else {
				response = await imageGenForPage(jwt, prompt);
			}
		} else {
			if (includeStoryInfo) {
				response = await gifGenForPage(
					jwt,
					prompt,
					storyId,
					selected_page
				);
			} else {
				response = await gifGenForPage(jwt, prompt);
			}
		}
		await fetchPointsLeft();
		setIsLoading(true);
		if (response.status === 200) {
			let base64 = response.data.image;
			if (selectedMode === "image") {
				base64 = "data:image/png;base64," + base64;
			} else {
				base64 = "data:image/gif;base64," + base64;
			}
			setSelectedImage(base64);
		} else {
			setAiImageModalVisible(true);
			notification.error({
				description: response.data.message,
			});
		}
		setIsLoading(false);
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
				open={ai_image_modal_visible}
				footer={null}
				onCancel={() => setAiImageModalVisible(false)}
				centered
				closable={false}
			>
				<textarea
					className={`w-full mt-4 px-3 py-2 border text-md rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-slate-900 text-text-muted ${
						!includeStoryInfo
							? "hover:bg-slate-800"
							: "bg-gray-500 text-white"
					}`}
					placeholder="Write your prompt"
					onChange={(e) => setPrompt(e.target.value)}
					value={prompt}
					rows={5}
					disabled={includeStoryInfo}
				/>
				<div className="my-4 flex gap-4">
					<button
						className={`rounded-lg font-bold bg-button-primary p-2 text-xl ${
							selectedMode === "image"
								? "border-2 border-green-500 flex-grow"
								: "border-none hover:bg-button-hover_primary"
						}`}
						onClick={(e) => {
							setSelectedMode("image");
						}}
					>
						Image
					</button>

					<button
						className={`rounded-lg font-bold bg-button-primary p-2 text-xl ${
							selectedMode === "gif"
								? "border-2 border-green-500 flex-grow"
								: "border-none hover:bg-button-hover_primary"
						}`}
						onClick={(e) => {
							setSelectedMode("gif");
						}}
					>
						GIF
					</button>
				</div>

				<div className="bg-gray-700 p-2 lg:flex rounded-lg font-semibold gap-2 items-center select-none text-white">
					<Switch
						defaultValue={includeStoryInfo}
						onClick={() => setIncludeStoryInfo(!includeStoryInfo)}
					/>

					<Tooltip
						title="This can reduce the response time of the AI Chat but can increase the accuracy of the image. Your prompt will be ignored."
						placement="top"
						color="purple"
					>
						<div>
							Include This Page Information to Generate Image
							(Slow)
						</div>
					</Tooltip>
				</div>

				<div className="flex justify-center mt-4">
					<button
						className="px-4 py-2 text-2xl text-black font-bold bg-button-secondary rounded-md hover:bg-button-secondary_hover"
						onClick={handleGenerateImage}
					>
						<img
							alt="Ai Genaration Icon"
							src={require("../../Assets/AI/ai_gen_icon.png")}
							width={35}
							height={35}
							className="inline-block mr-2"
						/>
						Generate
					</button>
				</div>
				<div className="mt-2 text-text-light">
					<div>
						<img
							alt="Ai Genaration Icon"
							src={require("../../Assets/AI/coin_icon.png")}
							width={20}
							height={20}
							className="inline-block mr-2"
						/>
						Required Points:{" "}
						<span className="text-text-muted">
							{selectedMode === "image"
								? includeStoryInfo
									? "2"
									: "1"
								: includeStoryInfo
								? "3"
								: "2"}
						</span>
					</div>
					<div>
						<img
							alt="Ai Genaration Icon"
							src={require("../../Assets/AI/coin_icon.png")}
							width={20}
							height={20}
							className="inline-block mr-2"
						/>
						Available Points:{" "}
						<span className="text-text-muted">{pointsLeft}</span>
					</div>
				</div>
			</Modal>
		</ConfigProvider>
	);
}

export default AIModal;
