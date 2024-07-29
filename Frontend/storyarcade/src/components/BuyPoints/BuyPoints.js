import sack_of_gold_img from "../../Assets/Images/sack_of_gold.png";
import pot_of_gold_img from "../../Assets/Images/pot_of_gold.png";
import crate_of_gold_img from "../../Assets/Images/crate_of_gold.png";
import coin_icon from "../../Assets/AI/coin_icon.png";
import taka_icon from "../../Assets/Icon/taka.png";
import { notification } from "antd";
import { addPoints } from "../../api/usersAPI";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LoadingFullscreen from "../../Tools/Loading";

function BuyPoints() {
	const jwt = JSON.parse(localStorage.getItem("jwt"));
	const navigate = useNavigate();
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		if (!jwt) {
			notification.error({
				description: "Please login to create a story",
			});
			navigate("/");
		}
	}, [jwt]);

	const handleBuyCoins = async (points) => {
		if (![500, 3000, 7000].includes(points)) {
			notification.error({
				message: "Invalid Points",
				description: "Please select a valid package",
			});
			return;
		}

		// Implement payment gateway here using SSLCOMMERZ
		// following backend call is dummy call, implement it properly after the payment gateway is implemented

		setIsLoading(true);
		let package_name = null;
		if (points === 500) {
			package_name = "sack";
		} else if (points === 3000) {
			package_name = "pot";
		} else if (points === 7000) {
			package_name = "crate";
		}

		const response = await addPoints(jwt, package_name);

		if (response.status === 200) {
			notification.success({
				message: "Points Added",
				description: `${response.data.message}`,
			});
			setIsLoading(false);
			navigate("/");
		} else {
			notification.error({
				message: "Failed to add points",
				description: `${response.data.message}`,
			});
		}
		setIsLoading(false);
	};

	return (
		<div className="h-full lg:flex gap-4 pe-4 justify-center items-center">
			{isLoading && <LoadingFullscreen />}
			<div className="max-w-96 my-4 w-full bg-slate-900 shadow-lg rounded-lg flex flex-col items-center pt-4 pb-6 px-8 text-white">
				<div className="text-4xl font-bold text-center text-amber-500">
					Sack Of Coin
				</div>
				<img
					src={sack_of_gold_img}
					alt="sack of gold"
					className="w-40 h-40"
				/>
				<div className="flex justify-start items-center gap-2 w-full">
					<img src={coin_icon} alt="coin" className="w-8 h-8" />
					<div className="text-xl text-text-muted">500 Coins</div>
				</div>

				<div className="flex justify-start items-center gap-2 mt-2 w-full">
					<img src={taka_icon} alt="coin" className="w-8 h-8" />
					<div className="text-xl text-text-muted">99 BDT</div>
				</div>

				<button
					className="bg-amber-500 hover:bg-amber-600 p-4 text-black mx-4 mt-4 rounded-lg w-full font-bold"
					onClick={() => handleBuyCoins(500)}
				>
					Buy Now
				</button>
			</div>
			<div className="max-w-96 my-4 w-full bg-slate-900 shadow-lg rounded-lg flex flex-col items-center pt-4 pb-6 px-8 text-white">
				<div className="text-4xl font-bold text-center text-amber-500">
					Pot Of Coin
				</div>
				<img
					src={pot_of_gold_img}
					alt="pot of gold"
					className="w-38 h-40"
				/>
				<div className="flex justify-start items-center gap-2 w-full">
					<img src={coin_icon} alt="coin" className="w-8 h-8" />
					<div className="text-xl text-text-muted">3000 Coins</div>
				</div>

				<div className="flex justify-start items-center gap-2 mt-2 w-full">
					<img src={taka_icon} alt="coin" className="w-8 h-8" />
					<div className="text-xl text-text-muted">499 BDT</div>
				</div>

				<button
					className="bg-amber-500 hover:bg-amber-600 p-4 text-black mx-4 mt-4 rounded-lg w-full font-bold"
					onClick={() => handleBuyCoins(3000)}
				>
					Buy Now
				</button>
			</div>
			<div className="max-w-96 my-4 w-full bg-slate-900 shadow-lg rounded-lg flex flex-col items-center pt-4 pb-6 px-8 text-white">
				<div className="text-4xl font-bold text-center text-amber-500">
					Crate Of Coin
				</div>
				<img
					src={crate_of_gold_img}
					alt="sack of gold"
					className="w-40 h-40"
				/>
				<div className="flex justify-start items-center gap-2 w-full">
					<img src={coin_icon} alt="coin" className="w-8 h-8" />
					<div className="text-xl text-text-muted">7000 Coins</div>
				</div>

				<div className="flex justify-start items-center gap-2 mt-2 w-full">
					<img src={taka_icon} alt="coin" className="w-8 h-8" />
					<div className="text-xl text-text-muted">999 BDT</div>
				</div>

				<button
					className="bg-amber-500 hover:bg-amber-600 p-4 text-black mx-4 mt-4 rounded-lg w-full font-bold"
					onClick={() => handleBuyCoins(7000)}
				>
					Buy Now
				</button>
			</div>
		</div>
	);
}

export default BuyPoints;
