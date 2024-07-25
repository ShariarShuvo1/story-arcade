import { ConfigProvider, Modal, notification } from "antd";
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
}) {
	const [selectedMode, setSelectedMode] = useState("image");

	const handleGenerateImage = async () => {
		if (!prompt) {
			notification.error({
				description: "Enter Prompt to generate",
			});
			return;
		}
		setIsLoading(true);
		setAiImageModalVisible(false);
		let response = null;
		if (selectedMode === "image") {
			response = await imageGenForPage(jwt, prompt);
		} else {
			response = await gifGenForPage(jwt, prompt);
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
					className="w-full mt-4 px-3 py-2 border text-md rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-slate-900 hover:bg-slate-800 text-text-muted"
					placeholder="Write your prompt"
					onChange={(e) => setPrompt(e.target.value)}
					value={prompt}
					rows={5}
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
							{selectedMode === "image" ? "1" : "2"}
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
