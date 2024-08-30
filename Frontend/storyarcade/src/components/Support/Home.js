import React, { useEffect, useState } from "react";
import {
	BsCircleFill,
	BsFillCheckCircleFill,
	BsFillTrashFill,
} from "react-icons/bs";
import axios from "axios";
import Create from "./Create";

export default function Home() {
	const [complains, setComplains] = useState([]);

	useEffect(() => {
		axios
			.get("http://localhost:3500/getComplain")
			.then((result) => setComplains(result.data))
			.catch((err) => console.log(err));
	}, []);

	const handleEdit = (id) => {
		axios
			.put("http://localhost:3500/updateComplain/" + id)
			.then((result) => window.location.reload())
			.catch((err) => console.log(err));
	};

	const handleDelete = (id) => {
		axios
			.delete("http://localhost:3500/deleteComplain/" + id)
			.then((result) => window.location.reload())
			.catch((err) => console.log(err));
	};

	return (
		<div className="bg-white shadow-lg rounded-lg p-8 mb-10">
			<h2 className="text-2xl font-semibold text-indigo-600 mb-6">
				Complaints
			</h2>
			<Create />
			{complains.length === 0 ? (
				<div className="text-center text-gray-500">
					<h2>No Records Found</h2>
				</div>
			) : (
				complains.map((complain) => (
					<div
						key={complain._id}
						className="flex items-center justify-between bg-gray-100 p-4 rounded-lg shadow-sm mb-4"
					>
						<div
							className="flex items-center cursor-pointer"
							onClick={() => handleEdit(complain._id)}
						>
							{complain.done ? (
								<BsFillCheckCircleFill className="text-green-500 text-xl mr-4" />
							) : (
								<BsCircleFill className="text-gray-500 text-xl mr-4" />
							)}
							<p
								className={`text-lg ${
									complain.done
										? "line-through text-gray-400"
										: "text-gray-800"
								}`}
							>
								{complain.prob}
							</p>
						</div>
						<BsFillTrashFill
							className="text-red-500 text-xl cursor-pointer"
							onClick={() => handleDelete(complain._id)}
						/>
					</div>
				))
			)}
			<div className="mt-10">
				<h2 className="text-xl font-semibold text-indigo-600">
					Contact Us
				</h2>
				<div className="mt-4 space-y-3">
					<div className="flex items-center">
						<span className="text-indigo-600 text-lg mr-2">📧</span>
						<span className="text-gray-700">
							support@complaints.com
						</span>
					</div>
					<div className="flex items-center">
						<span className="text-indigo-600 text-lg mr-2">📞</span>
						<span className="text-gray-700">+1 234 567 890</span>
					</div>
					<div className="flex items-center">
						<span className="text-indigo-600 text-lg mr-2">⏰</span>
						<span className="text-gray-700">
							Mon-Fri, 9 AM - 6 PM
						</span>
					</div>
				</div>
			</div>
		</div>
	);
}
