import { Outlet } from "react-router-dom";
import Navbar from "./Navbar/Navbar";

function RoutingPage() {
	return (
		<div className="flex min-h-screen bg-gradient-to-tr from-purple-200 to-cyan-200 gap-1">
			<div className="min-h-screen items-center flex min-w-14 max-w-14">
				<Navbar />
			</div>
			<div className="flex-grow">
				<Outlet />
			</div>
		</div>
	);
}

export default RoutingPage;
