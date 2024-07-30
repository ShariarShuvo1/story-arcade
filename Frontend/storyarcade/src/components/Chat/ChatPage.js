import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { notification } from "antd";

function ChatPage() {
	const navigate = useNavigate();
	const jwt = localStorage.getItem("jwt");

	useEffect(() => {
		if (!jwt) {
			notification.error({
				description: "Please login to Chat",
			});
			navigate("/");
		}
	}, []);

	return (
		<div className="h-full">
			<h1>Chat Page</h1>
		</div>
	);
}

export default ChatPage;
