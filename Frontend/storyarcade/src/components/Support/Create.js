import React, { useState } from "react";
import axios from "axios";

export default function Create() {
	const [prob, setProb] = useState("");

	const handleAdd = () => {
		axios
			.post("http://localhost:3500/addComplain", { prob: prob })
			.then(() => {
				window.location.reload();
			})
			.catch((err) => console.log(err));
	};

	return (
		<div className="flex">
			<input
				className="flex-grow p-3 border border-indigo-600 rounded-l-lg focus:outline-none"
				type="text"
				placeholder="Enter a Complaint"
				onChange={(e) => setProb(e.target.value)}
			/>
			<button
				className="bg-indigo-600 text-white p-3 rounded-r-lg hover:bg-indigo-700"
				onClick={handleAdd}
			>
				Add
			</button>
		</div>
	);
}
