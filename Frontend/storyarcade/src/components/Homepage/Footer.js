import { useNavigate } from "react-router-dom";
function Footer() {
	const nav = useNavigate();
	return (
		<div className="w-full bg-gray-700 rounded-t-md px-2 flex gap-4 items-center text-white h-8 fixed bottom-0">
			<button onClick={() => nav("/support")}>Support</button>
			<button onClick={() => nav("/dashboard")}>Dashboard</button>
		</div>
	);
}

export default Footer;
