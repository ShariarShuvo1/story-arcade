import { useNavigate } from "react-router-dom";
function Footer() {
	const nav = useNavigate();
	return (
		<div className="w-full bg-gray-700 rounded-t-md px-2 flex items-center text-white h-8 fixed bottom-0">
			<button onClick={() => nav("/support")}>Support</button>
		</div>
	);
}

export default Footer;
