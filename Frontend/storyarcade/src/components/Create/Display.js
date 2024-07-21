import React, {useEffect} from "react";

function Display({ selectedImage, listOfPageStory, setListOfPageStory, selectedItem, setSelectedItem }) {
	const [currentSelectedItem, setCurrentSelectedItem] = React.useState(null);

	useEffect(() => {
		if (selectedItem){
			if (selectedItem.step_type === "story") {
				let child_step_number = selectedItem.child_step_number;
				let selectedPageStory = listOfPageStory.find((page) => page.page_story_number === child_step_number);
				let index = listOfPageStory.indexOf(selectedPageStory);
				setCurrentSelectedItem(listOfPageStory[index]);
			}
		}
		else {
			setCurrentSelectedItem(null);
		}
	}, [selectedItem]);

	return (
		<div
			className="bg-slate-900 mt-4 lg:mt-0 rounded-xl h-full flex-grow aspect-video relative"
			style={{
				backgroundImage: `url(${selectedImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",

			}}
		>
			{currentSelectedItem && selectedItem && selectedItem.step_type === "story" && currentSelectedItem.story_text && (
				<div
					className="absolute w-fit p-2 bg-black bg-opacity-60 rounded-xl"
					style={{ bottom: '10%', left: "5%", right: "5%" }}
				>
					<div className="text-text-muted font-semibold text-lg text-center">
						{currentSelectedItem.story_text}
					</div>
				</div>
			)}

		</div>
	);
}

export default Display;
