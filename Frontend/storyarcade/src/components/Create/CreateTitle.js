import React, { useEffect, useState } from "react";
import LoadingFullscreen from "../../Tools/Loading";
import { getPointsLeft } from "../../api/usersAPI";
import { ConfigProvider, Modal, notification, Tooltip, Image } from "antd";
import { llamaGetTitle, sdGetImage } from "../../api/aiAPI";
import { createStory } from "../../api/storyAPI";
import { useNavigate } from "react-router-dom";

function CreateTitle() {
	const navigate = useNavigate();
	const jwt = JSON.parse(localStorage.getItem("jwt"));
	const [is_loading, setIsLoading] = useState(false);
	const [title, setTitle] = useState("");
	const [pointsLeft, setPointsLeft] = useState(0);
	const [ai_title_modal_visible, setAiTitleModalVisible] = useState(false);
	const [title_story, setTitleStory] = useState("");
	const [ai_image_modal_visible, setAiImageModalVisible] = useState(false);
	const [base64String, setBase64String] = useState("");
	const [specificPrompt, setSpecificPrompt] = useState("");
	const privacy_options = ["Public", "Private", "Followers only", "Paid"];
	const [selectedPrivacy, setSelectedPrivacy] = useState("Public");
	const [coinNeeded, setCoinNeeded] = useState(1);
	const [showCoinNeeded, setShowCoinNeeded] = useState(false);
	const [allowCopy, setAllowCopy] = useState(true);

	useEffect(() => {
		if (selectedPrivacy === "Paid") {
			setShowCoinNeeded(true);
		} else {
			setShowCoinNeeded(false);
		}
	}, [selectedPrivacy]);

	const convertToBase64 = (file) => {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = () => resolve(reader.result);
			reader.onerror = (error) => reject(error);
		});
	};

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

	const handleSubmit = async () => {
		if (!title) {
			notification.error({
				description: "Please enter a title",
			});
			return;
		}
		if (!base64String) {
			notification.error({
				description: "Please upload an image",
			});
			return;
		}
		if (!selectedPrivacy) {
			notification.error({
				description: "Please select a privacy option",
			});
			return;
		}
		if (selectedPrivacy === "Paid" && (!coinNeeded || coinNeeded < 1)) {
			notification.error({
				description: "Please enter a valid price",
			});
			return;
		}
		setIsLoading(true);

		const jwt = JSON.parse(localStorage.getItem("jwt"));
		const body = {
			title: title,
			cover_image: base64String,
			access_level: selectedPrivacy.toLowerCase(),
			points_required: coinNeeded,
			allow_copy: allowCopy,
		};
		const response = await createStory(jwt, body);

		if (response.status !== 201) {
			notification.error({
				description: response.data.message,
			});
			setIsLoading(false);
			return;
		}

		const story_id = response.data.story_id;
		if (story_id) {
			navigate(`/create/createPage/${story_id}`);
		} else {
			notification.error({
				description: "Something went wrong",
			});
		}

		setIsLoading(false);
	};

	const handleImageChange = async (e) => {
		setIsLoading(true);
		const file = e.target.files[0];
		const base64 = await convertToBase64(file);
		setBase64String(base64);
		setIsLoading(false);
	};

	const handleGenerateTitle = async () => {
		setIsLoading(true);
		setAiTitleModalVisible(false);
		const response = await llamaGetTitle(jwt, title_story);
		await fetchPointsLeft();
		setIsLoading(true);
		if (response.status === 200) {
			setTitle(response.data.title);
		} else {
			setAiTitleModalVisible(true);
			notification.error({
				description: response.data.message,
			});
			setTitle("");
		}
		setIsLoading(false);
	};

	const handleGenerateImage = async () => {
		setIsLoading(true);
		setAiImageModalVisible(false);
		const story = specificPrompt ? specificPrompt : title_story;
		const is_specific_prompt = !!specificPrompt;
		const response = await sdGetImage(jwt, story, is_specific_prompt);
		await fetchPointsLeft();
		setIsLoading(true);
		if (response.status === 200) {
			let base64 = response.data.image;
			base64 = "data:image/png;base64," + base64;
			setBase64String(base64);
		} else {
			setAiImageModalVisible(true);
			notification.error({
				description: response.data.message,
			});
		}
		setIsLoading(false);
	};

	return (
		<div className="flex items-center justify-center min-h-screen bg-gradient-to-tr from-purple-200 to-cyan-200 p-4">
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
					open={ai_title_modal_visible}
					footer={null}
					onCancel={() => setAiTitleModalVisible(false)}
					centered
					closable={false}
				>
					<textarea
						placeholder="Enter the summary of your story"
						className="resize-none w-full h-96 bg-slate-900 text-white p-4 rounded-md"
						value={title_story}
						onChange={(e) => setTitleStory(e.target.value)}
					></textarea>
					<div className="flex justify-center mt-4">
						<button
							className="px-4 py-2 text-2xl text-black font-bold bg-button-secondary rounded-md hover:bg-button-secondary_hover"
							onClick={handleGenerateTitle}
						>
							<img
								alt="Ai Genaration Icon"
								src={require("../../Assets/AI/ai_gen_icon.png")}
								width={35}
								height={35}
								className="inline-block mr-2"
							/>
							Generate Title
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
							<span className="text-text-muted">1</span>
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
							<span className="text-text-muted">
								{pointsLeft}
							</span>
						</div>
					</div>
				</Modal>
				<Modal
					open={ai_image_modal_visible}
					footer={null}
					onCancel={() => setAiImageModalVisible(false)}
					centered
					closable={false}
				>
					<textarea
						placeholder="Enter the summary of your story"
						className="resize-none w-full h-96 bg-slate-900 text-white p-4 rounded-md"
						value={title_story}
						onChange={(e) => setTitleStory(e.target.value)}
					></textarea>
					<input
						className="w-full mt-4 px-3 py-2 border text-md rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-slate-900 hover:bg-slate-800 text-text-muted cursor-pointer"
						type="text"
						placeholder="Or, Enter a specific prompt"
						onChange={(e) => setSpecificPrompt(e.target.value)}
						value={specificPrompt}
					/>
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
							Generate Image
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
							<span className="text-text-muted">1</span>
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
							<span className="text-text-muted">
								{pointsLeft}
							</span>
						</div>
					</div>
				</Modal>
			</ConfigProvider>
			{is_loading && <LoadingFullscreen />}

			<div
				className="w-full max-w-4xl p-8 space-y-6 shadow-md rounded-md bg-gradient-to-tr from-slate-900 via-slate-800 to-zinc-800"
				onSubmit={handleSubmit}
			>
				<h3 className="text-2xl font-bold text-center text-primary">
					Your Story Title:{" "}
					<span className="text-text-light font-bold">{title}</span>
				</h3>
				<div className="mb-4 flex">
					<input
						id="title"
						type="text"
						className="w-full px-3 py-2 border text-xl rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
						onChange={(e) => setTitle(e.target.value)}
						value={title}
						placeholder={"Enter your title"}
						required
					/>
					<Tooltip
						placement="top"
						title={"Generate Title With AI"}
						color="purple"
					>
						<button
							className="ml-2 px-2 py-1 text-white rounded-md hover:rotate-90 transform transition-transform duration-300 hover:scale-110"
							disabled={pointsLeft === 0}
							onClick={() => setAiTitleModalVisible(true)}
						>
							<img
								alt="Ai Genaration Icon"
								src={require("../../Assets/AI/ai_gen_icon.png")}
								width={35}
								height={35}
							/>
						</button>
					</Tooltip>
				</div>
				<div>{base64String && <Image src={base64String} />}</div>

				<label
					htmlFor="image"
					className="font-bold block text-xl text-primary flex-grow"
				>
					Background Image:
				</label>

				<div className=" flex justify-items-center">
					<input
						id="image"
						className="w-full px-3 py-2 border text-xl rounded-md focus:outline-none focus:ring-2 focus:ring-primary hover:bg-slate-800 text-text-muted cursor-pointer"
						type="file"
						accept="image/*"
						onChange={handleImageChange}
					></input>
					<Tooltip
						placement="top"
						title={"Generate Background Image With AI"}
						color="purple"
					>
						<button
							className="ml-2 px-2 py-1 bg-transparent text-white rounded-md hover:rotate-90 transform transition-transform duration-300 hover:scale-110"
							disabled={pointsLeft === 0}
							onClick={() => setAiImageModalVisible(true)}
						>
							<img
								alt="Ai Genaration Icon"
								src={require("../../Assets/AI/ai_gen_icon.png")}
								width={35}
								height={35}
							/>
						</button>
					</Tooltip>
				</div>
				<div className="mb-4">
					<label
						htmlFor="privacy"
						className="font-bold block text-lg text-primary"
					>
						Privacy:
					</label>
					<select
						className=" mt-2 w-full px-3 py-2 border text-xl bg-slate-900 text-text-muted font-bold rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
						id="privacy"
						onChange={(e) => setSelectedPrivacy(e.target.value)}
						value={selectedPrivacy}
					>
						{privacy_options.map((option) => (
							<option key={option} value={option}>
								{option}
							</option>
						))}
					</select>
				</div>
				{showCoinNeeded && (
					<div className="mb-4">
						<label
							htmlFor="coinsNeeded"
							className="font-bold block text-lg text-primary"
						>
							Price in Coins:
						</label>
						<input
							id="coinsNeeded"
							type="number"
							className="w-full mt-2 px-3 py-2 border text-xl rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
							onChange={(e) => setCoinNeeded(e.target.value)}
							value={coinNeeded}
							min={1}
						/>
					</div>
				)}
				<div className="mb-4">
					<label
						htmlFor="allowCopy"
						className="font-bold block text-lg text-primary"
					>
						Allow Copy:
					</label>
					<select
						className=" mt-2 w-full px-3 py-2 border text-xl bg-slate-900 text-text-muted font-bold rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
						id="allowCopy"
						onChange={(e) =>
							setAllowCopy(e.target.value === "true")
						}
						value={allowCopy ? "true" : "false"}
					>
						<option key={"true"} value={"true"}>
							Yes
						</option>
						<option key={"false"} value={"false"}>
							No
						</option>
					</select>
				</div>
				<div className="mb-4">
					<button
						className="w-full px-4 py-2 bg-button-primary hover:bg-button-hover_primary hover:scale-105 text-black text-xl font-bold rounded-md transition-transform duration-300"
						onClick={handleSubmit}
					>
						Create Story
					</button>
				</div>
			</div>
		</div>
	);
}

export default CreateTitle;
