import {
	Button,
	ConfigProvider,
	Modal,
	notification,
	Spin,
	Switch,
	Tooltip,
} from "antd";
import React, { useEffect, useState } from "react";
import coin_icon from "../../Assets/AI/coin_icon.png";
import { getPointsLeft } from "../../api/usersAPI";
import { buyStory } from "../../api/storyAPI";
import { useNavigate } from "react-router-dom";

function BuyStoryModal({
	buyStoryModalVisible,
	setBuyStoryModalVisible,
	story,
	availablePoints,
	setAvailablePoints,
}) {
	const [loading, setLoading] = useState(false);
	const [buyLoading, setBuyLoading] = useState(false);
	const jwt = JSON.parse(localStorage.getItem("jwt"));
	const navigate = useNavigate();

	const handleBuy = async () => {
		if (availablePoints < story.points_required) {
			notification.error({
				message: "You do not have enough points to buy this story",
			});
			return;
		}
		setBuyLoading(true);
		const response = await buyStory(jwt, story._id);

		if (response.status === 200) {
			notification.success({
				message: "Story bought successfully",
			});
			navigate(`/view/viewStory/${story._id}`);
			setBuyStoryModalVisible(false);
			setBuyLoading(false);
			setAvailablePoints(availablePoints - story.points_required);
		} else {
			notification.error({
				message: response.data.message,
			});
		}
		setBuyLoading(false);
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
				open={buyStoryModalVisible}
				footer={null}
				onCancel={() => setBuyStoryModalVisible(false)}
				centered
				closable={false}
			>
				<div>
					<div className="text-text-light text-4xl font-bold text-center px-4">
						Buy Story
					</div>
					<div className="flex gap-2 items-center mt-4">
						<img
							src={coin_icon}
							alt="thumbnail"
							className="w-8 h-8"
						/>
						<div className="text-2xl text-text-muted">
							{story.points_required} Points Required
						</div>
					</div>
					<div className="flex gap-2 items-center mt-4">
						<img
							src={coin_icon}
							alt="thumbnail"
							className="w-8 h-8"
						/>
						<div className="text-2xl text-text-muted">
							{loading ? <Spin /> : availablePoints} Points
							Available
						</div>
					</div>
					<button
						className="w-full bg-green-600 hover:bg-green-500 text-black text-2xl font-bold p-4 rounded mt-4"
						onClick={handleBuy}
					>
						Buy {buyLoading && <Spin />}
					</button>
				</div>
			</Modal>
		</ConfigProvider>
	);
}

export default BuyStoryModal;
