import icon_white_border from "../../Assets/Icon/icon_white_border.png";
import login_icon from "../../Assets/Icon/login.png";
import logout_icon from "../../Assets/Icon/logout.png";
import signup_icon from "../../Assets/Icon/signup.png";
import profile_icon from "../../Assets/Icon/profile.png";
import create_icon from "../../Assets/Icon/create.png";
import buy_icon from "../../Assets/Icon/buy.png";
import search_icon from "../../Assets/Icon/search.png";
import chat_icon from "../../Assets/Icon/chat.png";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { useLogout } from "../../hooks/useLogout";
import { useAuthContext } from "../../hooks/useAuthContext";
import { Tooltip } from "antd";
import SearchModal from "../Search/SearchModal";

function Navbar() {
	const navigate = useNavigate();
	const jwt = localStorage.getItem("jwt");
	const logout = useLogout();
	const { dispatch } = useAuthContext();
	const [showSearchModal, setShowSearchModal] = useState(false);

	useEffect(() => {
		if (jwt) {
			const decoded = jwtDecode(jwt);
			if (decoded.exp < Date.now() / 1000) {
				logout.logout();
				dispatch({ type: "LOGOUT" });
			}
		}
	}, [jwt]);

	return (
		<div className="flex flex-col bg-slate-950 rounded-r-lg my-2 p-2 gap-4 fixed bottom-1/4 select-none">
			<SearchModal
				showSearchModal={showSearchModal}
				setShowSearchModal={setShowSearchModal}
			/>
			<img
				src={icon_white_border}
				alt="logo"
				className="max-w-10 cursor-pointer hover:scale-110 transition duration-300 border-b-2 border-white pb-2"
				onClick={() => navigate("/")}
			/>
			<Tooltip title="Search" placement="right" color="purple">
				<img
					src={search_icon}
					alt="logo"
					className="max-w-10 cursor-pointer hover:scale-110 transition duration-300 border-b-2 border-white pb-2"
					onClick={() => {
						setShowSearchModal(true);
					}}
				/>
			</Tooltip>
			{jwt ? (
				<div className="flex flex-col gap-4">
					<Tooltip
						title="Create new story"
						placement="right"
						color="purple"
					>
						<img
							src={create_icon}
							alt="logo"
							className="max-w-10 cursor-pointer hover:scale-110 transition duration-300 border-b-2 border-white pb-2"
							onClick={() => navigate("/create/createTitle")}
						/>
					</Tooltip>
					<Tooltip title="Chat" placement="right" color="purple">
						<img
							src={chat_icon}
							alt="logo"
							className="max-w-10 cursor-pointer hover:scale-110 transition duration-300 border-b-2 border-white pb-2"
							onClick={() => navigate("/chat")}
						/>
					</Tooltip>
					<Tooltip title="Profile" placement="right" color="purple">
						<img
							src={profile_icon}
							alt="logo"
							className="max-w-10 cursor-pointer hover:scale-110 transition duration-300 border-b-2 border-white pb-2"
							onClick={() => navigate("/profile")}
						/>
					</Tooltip>
					<Tooltip title="Buy Coins" placement="right" color="gold">
						<img
							src={buy_icon}
							alt="logo"
							className="max-w-10 cursor-pointer hover:scale-110 transition duration-300 border-b-2 border-white pb-2"
							onClick={() => navigate("/buyPoints")}
						/>
					</Tooltip>
					<Tooltip title="Logout" placement="right" color="red">
						<img
							src={logout_icon}
							alt="logo"
							className="max-w-10 cursor-pointer hover:scale-110 transition duration-300 border-b-2 border-white pb-2"
							onClick={() => {
								logout.logout();
								dispatch({ type: "LOGOUT" });
							}}
						/>
					</Tooltip>
				</div>
			) : (
				<div className="flex flex-col gap-4">
					<Tooltip title="Login" placement="right" color="purple">
						<img
							src={login_icon}
							alt="login"
							className="max-w-10 cursor-pointer hover:scale-110 transition duration-300 border-b-2 border-white pb-2"
							onClick={() => navigate("/login")}
						/>
					</Tooltip>
					<Tooltip title="Signup" placement="right" color="purple">
						<img
							src={signup_icon}
							alt="signup"
							className="max-w-10 cursor-pointer hover:scale-110 transition duration-300 border-b-2 border-white pb-2"
							onClick={() => navigate("/signup")}
						/>
					</Tooltip>
				</div>
			)}
		</div>
	);
}

export default Navbar;
