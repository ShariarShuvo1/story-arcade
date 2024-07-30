import { useEffect, useState } from "react";
import { getFriendSuggestion } from "../../api/usersAPI";
import profile_icon from "../../Assets/Icon/profile.png";
import { notification } from "antd";
import { useNavigate } from "react-router-dom";

function FriendSuggestion() {
	const jwt = JSON.parse(localStorage.getItem("jwt"));
	const [suggestions, setSuggestions] = useState([]);
	const navigate = useNavigate();

	useEffect(() => {
		const getSuggestion = async () => {
			if (!jwt) return;
			const response = await getFriendSuggestion(jwt);
			if (response.status === 200) {
				setSuggestions(response.data.suggestions);
			} else {
				notification.error({
					message: response.data.message,
				});
			}
		};

		getSuggestion();
	}, [jwt]);

	return (
		<div className="h-fit w-3/12 bg-slate-900 rounded-lg bg-opacity-25 flex flex-col">
			<div className="bg-slate-900 text-text-muted rounded-t-lg p-3 text-2xl font-bold text-center select-none">
				Friend Suggestions
			</div>
			<div className="flex flex-col gap-2 p-3 overflow-y-auto">
				{suggestions.map((suggestion) => (
					<div
						key={suggestion._id}
						className="flex items-center gap-2 p-2 bg-slate-800 rounded-lg hover:scale-105 transition duration-300 ease-in-out cursor-pointer"
						onClick={() => navigate(`/profile/${suggestion._id}`)}
					>
						<img
							src={
								suggestion.avatar
									? suggestion.avatar
									: profile_icon
							}
							alt="profile"
							className="w-16 h-16 rounded-full"
						/>
						<div>
							<div className="text-text-light text-xl font-bold hover:text-text-muted">
								{suggestion.name}
							</div>
							<div className="text-white">
								{suggestion.nonPrivateStoryCount} story shared
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

export default FriendSuggestion;
