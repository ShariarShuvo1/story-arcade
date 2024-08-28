import {
	ConfigProvider,
	Drawer,
	Empty,
	notification,
	Spin,
	Switch,
	Tooltip,
} from "antd";
import send_icon from "../../Assets/Icon/send_icon.png";
import ai_icon from "../../Assets/AI/ai_gen_icon.png";
import "./style.css";
import React, { useEffect, useRef, useState } from "react";
import {
	clearAiChat,
	getPreviousChats,
	llamaChat,
	llamaStoryChat,
} from "../../api/aiChatAPI";
import { getName } from "../../api/usersAPI";
import ReactMarkdown from "react-markdown";

function AIChatDrawer({
	openDrawer,
	setOpenDrawer,
	storyId,
	jwt,
	selected_page,
	pointsLeft,
	setPointsLeft,
	includeStoryInfo,
	setIncludeStoryInfo,
}) {
	const [chatList, setChatList] = useState([]);
	const [initialChatLoading, setInitialChatLoading] = useState(false);
	const [message, setMessage] = useState("");
	const [backupMessage, setBackupMessage] = useState("");
	const [name, setName] = useState("");
	const [chatTrigger, setChatTrigger] = useState(null);
	const [showDummyLoader, setShowDummyLoader] = useState(false);
	const bottomRef = useRef(null);
	const textareaRef = useRef(null);

	const showNotification = (message) => {
		notification.error({
			message: `${message}`,
		});
	};

	useEffect(() => {
		const getPreviousChat = async () => {
			setInitialChatLoading(true);
			const name_response = await getName(jwt);
			if (name_response.status === 200) {
				setName(name_response.data.name);
			} else {
				showNotification(name_response.data.message);
			}
			const response = await getPreviousChats(jwt, storyId);
			if (response.status === 200) {
				setChatList(response.data.chats);
			} else {
				showNotification(response.data.message);
			}
			setInitialChatLoading(false);
		};

		getPreviousChat();
	}, []);

	useEffect(() => {
		const sendMessage = async () => {
			if (chatTrigger && backupMessage) {
				let response;
				if (includeStoryInfo) {
					response = await llamaStoryChat(
						jwt,
						storyId,
						backupMessage,
						selected_page
					);
				} else {
					response = await llamaChat(jwt, storyId, backupMessage);
				}
				setPointsLeft(pointsLeft - 1);
				if (response.status === 200) {
					let tempChatList = [...chatList];
					tempChatList.push({
						text: response.data.answer,
						sender: "ai",
						created_at: new Date(),
					});
					setChatList(tempChatList);
					setShowDummyLoader(false);
					setBackupMessage("");
				} else {
					showNotification(response.data.message);
					setShowDummyLoader(false);
				}
			}
		};
		sendMessage();
	}, [chatTrigger]);

	useEffect(() => {
		bottomRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [chatList, showDummyLoader]);

	useEffect(() => {
		const handleKeyDown = (event) => {
			if (event.key === "Enter" && !event.shiftKey) {
				event.preventDefault();
				handleSendMessage();
			}
		};

		const textarea = textareaRef.current;
		if (textarea) {
			textarea.addEventListener("keydown", handleKeyDown);
		}

		return () => {
			if (textarea) {
				textarea.removeEventListener("keydown", handleKeyDown);
			}
		};
	}, [message]);

	const handleSendMessage = async () => {
		if (pointsLeft < 1) {
			setShowDummyLoader(false);
			showNotification("You don't have enough coins to send a message");
			return;
		}
		if (!initialChatLoading && message && !showDummyLoader) {
			let tempMessage = message;
			let tempChatList = [...chatList];
			tempChatList.push({
				text: tempMessage,
				sender: "user",
				created_at: new Date(),
			});

			setChatList(tempChatList);
			setBackupMessage(message);
			setMessage("");
			setShowDummyLoader(true);
			setChatTrigger(chatTrigger === "Yes" ? "No" : "Yes");
		}
	};

	const clearChatHandle = async () => {
		if (!initialChatLoading && !showDummyLoader) {
			setInitialChatLoading(true);
			const response = await clearAiChat(jwt, storyId);
			if (response.status === 200) {
				setChatList(response.data.chats);
			}
			setInitialChatLoading(false);
		}
	};

	return (
		<ConfigProvider
			drawer={{
				styles: {
					content: {
						backgroundColor: "#0f172a",
					},
				},
			}}
		>
			<Drawer
				onClose={() => {
					setOpenDrawer(false);
				}}
				open={openDrawer}
				closeIcon={null}
				size="large"
			>
				<div className="flex h-full flex-col justify-between text-white overflow-y-hidden">
					<div className="h-full overflow-y-scroll" id="taskList">
						{initialChatLoading ? (
							<div className="flex justify-center items-center content-center h-full">
								<ConfigProvider
									theme={{
										components: {
											Spin: {
												dotSizeLG: 128,
											},
										},
									}}
								>
									<Spin size="large" />
								</ConfigProvider>
							</div>
						) : (
							<div className="flex flex-col gap-4">
								{chatList.length === 0 && (
									<div className="flex gap-2">
										<div className="flex-grow p-2">
											<Empty description={false} />
										</div>
									</div>
								)}
								{chatList.map((chat, index) => (
									<div key={index} className="flex gap-1">
										{chat.sender === "ai" && (
											<div className="flex gap-2">
												<img
													src={ai_icon}
													alt="AI"
													className="w-8 h-8"
												/>
												<div className="flex flex-col gap-1">
													<div className="bg-slate-950 p-2 rounded-lg font-semibold text-purple-400">
														<ReactMarkdown>
															{chat.text}
														</ReactMarkdown>
													</div>
												</div>
											</div>
										)}
										{chat.sender === "user" && (
											<div className="flex gap-2 content-center items-center">
												<div className="min-w-8 min-h-8 select-none items-center justify-center bg-slate-800 rounded-full text-text-light text-lg font-bold flex">
													{name.charAt(0)}
												</div>
												<div className="flex flex-col gap-1">
													<div className="bg-slate-950 p-2 rounded-lg font-semibold text-text-light">
														{chat.text}
													</div>
												</div>
											</div>
										)}
									</div>
								))}
								{showDummyLoader && (
									<div className="flex gap-2">
										<img
											src={ai_icon}
											alt="AI"
											className="w-8 h-8"
										/>
										<Spin
											size="large"
											className="text-purple-400"
										/>
									</div>
								)}
								<div ref={bottomRef} />
							</div>
						)}
					</div>
					<div>
						<div className="flex items-end gap-1 p-1 mt-2">
							<textarea
								id="taskList"
								className="flex-grow bg-slate-900 text-text-muted p-2 border-2 border-text-light rounded-lg resize-none"
								rows={4}
								placeholder="Type your message here..."
								autoFocus={true}
								maxLength={4000}
								value={message}
								ref={textareaRef}
								onChange={(e) => setMessage(e.target.value)}
							/>
							<Tooltip
								title="Send"
								placement="top"
								color="purple"
							>
								<img
									src={send_icon}
									alt="Send"
									className="w-12 h-12 hover:scale-110 transition duration-300 cursor-pointer"
									onClick={handleSendMessage}
								/>
							</Tooltip>
						</div>
						<div className="flex items-center gap-1 p-1">
							<button
								className="text-white bg-gray-700 p-2 rounded-lg font-semibold hover:bg-gray-800"
								onClick={clearChatHandle}
							>
								Clear Chat History
							</button>
							<div className="bg-gray-700 p-2 lg:flex rounded-lg font-semibold gap-2 items-center select-none">
								<Tooltip
									title="This can reduce the response time of the AI Chat but can increase the accuracy of the AI Chat"
									placement="top"
									color="purple"
								>
									<div>
										Include Story Information in AI Chat
										(Slow)
									</div>
								</Tooltip>

								<Switch
									defaultValue={includeStoryInfo}
									onClick={() =>
										setIncludeStoryInfo(!includeStoryInfo)
									}
								/>
							</div>
							<Tooltip
								className="flex items-center gap-1 select-none"
								title={`Each message costs 1 coin. You have a total of ${pointsLeft} coins to spend.`}
								placement="top"
								color="purple"
							>
								<img
									alt="Ai Genaration Icon"
									src={require("../../Assets/AI/coin_icon.png")}
									width={20}
									height={20}
									className="inline-block"
								/>
								<span className="text-text-muted">1</span>
							</Tooltip>
						</div>
					</div>
				</div>
			</Drawer>
		</ConfigProvider>
	);
}

export default AIChatDrawer;
