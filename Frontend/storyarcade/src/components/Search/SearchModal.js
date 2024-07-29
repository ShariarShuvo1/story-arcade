import { ConfigProvider, Modal, Tooltip } from "antd";
import React, { useState } from "react";
import search_icon from "../../Assets/Icon/search.png";

function SearchModal({ showSearchModal, setShowSearchModal }) {
	const [searchText, setSearchText] = useState("");

	const searchHandler = () => {
		// implement search functionality here and redirect to search page

		console.log(searchText);
		setShowSearchModal(false);
		setSearchText("");
	};

	const handleKeyDown = (event) => {
		if (event.key === "Enter") {
			searchHandler();
		}
	};

	return (
		<ConfigProvider
			theme={{
				components: {
					Modal: {
						contentBg: "#050012",
						padding: "0",
					},
				},
			}}
		>
			<Modal
				open={showSearchModal}
				footer={null}
				onCancel={() => {
					setShowSearchModal(false);
					setSearchText("");
				}}
				centered
				closable={false}
				width={"80%"}
			>
				<div className="flex gap-4 items-center">
					<input
						type="text"
						className="w-full p-2 text-2xl rounded-md bg-slate-800 text-text-muted"
						placeholder="Search for stories..."
						value={searchText}
						onChange={(e) => setSearchText(e.target.value)}
						onKeyDown={handleKeyDown}
					/>
					<Tooltip title="Search" placement="right" color="purple">
						<img
							src={search_icon}
							alt="logo"
							className=" h-10 w-10 cursor-pointer hover:scale-110 transition duration-300"
							onClick={searchHandler}
						/>
					</Tooltip>
				</div>
			</Modal>
		</ConfigProvider>
	);
}

export default SearchModal;
