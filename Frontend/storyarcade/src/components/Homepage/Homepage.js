import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { notification } from "antd";
import Footer from "./Footer";
import FriendSuggestion from "./FriendSuggestion";
import Stories from "./Stories";

function Homepage() {
	const jwt = JSON.parse(localStorage.getItem("jwt"));
	const navigate = useNavigate();
	const [width, setWidth] = useState(window.innerWidth);

	useEffect(() => {
		const handleResize = () => {
			setWidth(window.innerWidth);
		};

		window.addEventListener("resize", handleResize);
		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	return (
		<div className="h-full flex flex-col justify-between">
			<div className="flex gap-4 me-1 mt-1 mb-16">
				<Stories />
				{width >= 1024 && jwt && <FriendSuggestion />}
			</div>

			<Footer />
		</div>
	);
}

export default Homepage;
