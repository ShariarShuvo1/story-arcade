import React, { useEffect, useState } from "react";
import { getPageList } from "../../../api/storyAPI";

function NextSelector({
	setIsLoading,
	selectedItem,
	jwt,
	selected_page,
	storyId,
	setSelectedItem,
}) {
	const [trigger, setTrigger] = useState(selectedItem.next_type);
	const [pageList, setPageList] = useState(null);

	useEffect(() => {
		const getAllPageList = async () => {
			setIsLoading(true);
			if (selectedItem.next_type === "page") {
				const response = await getPageList(jwt, selected_page, storyId);
				setPageList(response.data);
			} else {
				setPageList(null);
			}
			setIsLoading(false);
		};

		getAllPageList();
	}, [trigger, selectedItem]);

	return (
		<div>
			<div className="text-text-hover mt-4 text-lg font-semibold">
				On Click:
			</div>
			<select
				defaultValue={selectedItem.next_type}
				className="w-full p-2 text-lg mt-1 text-text-light bg-slate-700 rounded-lg"
				onChange={(e) => {
					let tempSelectedItem = selectedItem;
					tempSelectedItem.next_type = e.target.value;
					if (e.target.value === "step") {
						tempSelectedItem.next_page = undefined;
					}
					setSelectedItem(tempSelectedItem);
					setTrigger(e.target.value);
				}}
			>
				<option value="step">Next Step</option>
				<option value="page">Another Page</option>
			</select>

			{trigger === "page" && pageList && pageList.length > 0 && (
				<div>
					<div className="text-text-hover mt-4 text-lg font-semibold">
						Choose the next page:
					</div>
					<select
						defaultValue={
							selectedItem.next_page
								? selectedItem.next_page
								: pageList[0].id
						}
						className="w-full p-2 text-lg mt-1 text-text-light bg-slate-700 rounded-lg"
						onChange={(e) => {
							let tempSelectedItem = selectedItem;
							tempSelectedItem.next_page = e.target.value;
							setSelectedItem(tempSelectedItem);
						}}
					>
						{pageList.map((page, index) => (
							<option key={index} value={page.id}>
								{page.page_number}
							</option>
						))}
					</select>
				</div>
			)}
		</div>
	);
}

export default NextSelector;
