import HomeTitle from "./HomeTItle";
import React, { useEffect, useState } from "react";
import { ConfigProvider, notification, Spin } from "antd";
import { getInitialPopular, getNextPopular } from "../../api/homepageStoryAPI";
import StoryCard from "./StoryCard";
import { jwtDecode } from "jwt-decode";
import { getPointsLeft } from "../../api/usersAPI";
import LoadingFullscreen from "../../Tools/Loading";
import { Loading3QuartersOutlined } from "@ant-design/icons";

function Stories() {
	const jwt = JSON.parse(localStorage.getItem("jwt"));
	const [myId, setMyId] = useState(jwt ? jwtDecode(jwt)._id : null);
	const [stories, setStories] = useState([]);
	const [currentlySelected, setCurrentlySelected] = useState(
		`${jwt ? "recommended" : "popular"}`
	);
	const [availablePoints, setAvailablePoints] = useState(0);
	const [isLoading, setIsLoading] = useState(false);
	const [hasMore, setHasMore] = useState(true);
	const [storyLoading, setStoryLoading] = useState(false);

	const fetchPointsLeft = async () => {
		const response = await getPointsLeft(jwt);
		if (response.status === 200) {
			setAvailablePoints(response.data.point);
		} else {
			setAvailablePoints(0);
		}
	};

	useEffect(() => {
		fetchPointsLeft();
	}, []);

	useEffect(() => {
		if (jwt) {
			setMyId(jwtDecode(jwt)._id);
		} else {
			setMyId(null);
		}
	}, [jwt]);

	useEffect(() => {
		const getStories = async () => {
			if (
				(currentlySelected === "recommended" ||
					currentlySelected === "following") &&
				!jwt
			) {
				notification.error({
					message:
						currentlySelected === "recommended"
							? "You need to login to see recommended stories"
							: "You need to login to see following stories",
				});
				setCurrentlySelected("popular");
				return;
			}
			let response;
			setStoryLoading(true);
			if (currentlySelected === "popular") {
				response = await getInitialPopular();
			}
			setStoryLoading(false);
			if (response && response.status === 200) {
				setStories(response.data.stories);
				setHasMore(response.data.stories.length > 0);
			} else if (response) {
				notification.error({
					message: response.data.message,
				});
			}
		};
		getStories();
	}, [currentlySelected]);

	const fetchMoreStories = async () => {
		if (isLoading || !hasMore) return;
		setStoryLoading(true);
		const storyIds = stories.map((story) => story._id);
		const response = await getNextPopular(jwt, storyIds);
		if (response && response.status === 200) {
			setStories((prevStories) => [
				...prevStories,
				...response.data.stories,
			]);
			setHasMore(response.data.stories.length > 0);
		} else if (response) {
			notification.error({
				message: response.data.message,
			});
		}
		setStoryLoading(false);
	};

	const handleScroll = () => {
		if (
			window.innerHeight + document.documentElement.scrollTop !==
			document.documentElement.offsetHeight
		)
			return;
		fetchMoreStories();
	};

	useEffect(() => {
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, [stories, hasMore, isLoading]);

	return (
		<div className="w-full h-full bg-slate-900 rounded-lg bg-opacity-25 flex flex-col overflow-y-hidden">
			<HomeTitle
				currentlySelected={currentlySelected}
				setCurrentlySelected={setCurrentlySelected}
			/>
			{isLoading && <LoadingFullscreen />}
			<div className="container mx-auto overflow-y-hidden">
				<div
					className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4 overflow-y-hidden`}
				>
					{stories.map((story, index) => (
						<StoryCard
							key={index}
							story={story}
							myId={myId}
							availablePoints={availablePoints}
							setAvailablePoints={setAvailablePoints}
							isLoading={isLoading}
							setIsLoading={setIsLoading}
						/>
					))}
				</div>
			</div>
			<div className="flex justify-center items-center w-full">
				{storyLoading && (
					<ConfigProvider
						theme={{
							components: {
								Spin: {
									dotSizeLG: 128,
								},
							},
						}}
					>
						<Spin
							indicator={<Loading3QuartersOutlined spin />}
							size="large"
						/>
					</ConfigProvider>
				)}
				{!hasMore && (
					<p className="text-slate-900 text-2xl font-bold mb-4">
						No more stories
					</p>
				)}
			</div>
		</div>
	);
}

export default Stories;
