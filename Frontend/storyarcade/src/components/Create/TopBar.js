import {useEffect, useState} from "react";
import {initialPageDeleteCheck, pageDelete, saveAPage} from "../../api/storyAPI";
import {notification} from "antd";
import DeleteModal from "./DeleteModal";

function TopBar({
                    title,
                    story,
                    selected_page,
                    setSelectedPage,
                    setIsLoading,
                    setSelectedItem,
                    jwt,
                    storyId,
                    currentPage,
                    listOfSteps,
                    setListOfSteps,
                    listOfPageStory,
                    setListOfPageStory,
                    listOfChoices,
                    setListOfChoices,
                    listOfTasks,
                    setListOfTasks,
                    listOfMover,
                    setListOfMover,
                    selectedImage,
                    setSelectedImage,
                    setCurrentPage,
                    setStory,
                    navigate,
                    setTitle
                }) {

    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [conflicts, setConflicts] = useState([]);

    const saveChange = async () => {

        let tempPage = currentPage;
        if (tempPage) {
            tempPage.steps = listOfSteps;
            tempPage.page_story = listOfPageStory;
            tempPage.choices = listOfChoices;
            tempPage.tasks = listOfTasks;
            tempPage.mover = listOfMover;
            tempPage.background_image = selectedImage;

            const response = await saveAPage(jwt, tempPage, storyId);

            if (response.status === 200) {
                let response_story = response.data.story;
                let response_page = response.data.page;
                setTitle(response.data.story_title);
                setListOfSteps(response_page.steps);
                setListOfPageStory(response_page.page_story);
                setListOfChoices(response_page.choices);
                setListOfTasks(response_page.tasks);
                setListOfMover(response_page.mover);
                setSelectedImage(response_page.background_image);
                setSelectedPage(response_page.page_number);
                setCurrentPage(response_page);
                setStory(response_story);
                setSelectedItem(null);
            } else {
                notification.error({
                    message: `${response.data.message}`,
                });
                navigate("/");
            }
        }
    };

    const handleInitialDelete = async () => {
        if (!currentPage.is_starting_page){
            setIsLoading(true);
            await saveChange();
            const response = await initialPageDeleteCheck(jwt, selected_page, storyId);
            setIsLoading(false);
            if (response.status === 200) {
                let tempConflicts = response.data.conflicts;
                if (tempConflicts.length > 0){
                    setConflicts(tempConflicts);
                    setDeleteModalVisible(true);
                }
                else{
                    await handleDelete();
                }
            } else {
                notification.error({
                    message: `${response.data.message}`,
                });
                navigate("/");
            }

        }
        else{
            notification.error({
                description: "You can't delete the starting page",
            });
        }

    };

    const handleDelete = async () => {
        if (!currentPage.is_starting_page){
            setIsLoading(true);
            const response = await pageDelete(jwt, selected_page, storyId);
            setIsLoading(false);
            if (response.status === 200) {
                let tempStory = response.data.story;
                let bigger_page = 0;
                let lower_page = 0;
                for (let i = 0; i < tempStory.length; i++) {
                    if (tempStory[i] > selected_page) {
                        bigger_page = tempStory[i];
                        break;
                    }
                }
                for (let i = 0; i < tempStory.length; i++) {
                    if (tempStory[i] > selected_page) {
                        break;
                    }
                    lower_page = tempStory[i];
                }
                if (bigger_page !== 0) {
                    setSelectedPage(bigger_page);
                }
                else if (lower_page !== 0) {
                    setSelectedPage(lower_page);
                }
                else {
                    setSelectedPage(1);
                }
                setStory(tempStory);
                notification.success({
                    message: `${response.data.message}`,
                });
            } else {
                notification.error({
                    description: "Failed to delete the page",
                    message: `${response.data.message}`,
                });
                navigate("/");
            }

        }
        else{
            notification.error({
                description: "You can't delete the starting page",
            });
        }

    };

    return (
        <div className="bg-slate-900 mx-1 p-2 text-text-muted font-extrabold text-2xl content-center items-center rounded-lg flex justify-between">
            <DeleteModal
                deleteModalVisible={deleteModalVisible}
                setDeleteModalVisible={setDeleteModalVisible}
                conflicts={conflicts}
                setSelectedPage={setSelectedPage}
                handleDelete={handleDelete}
            />
            <div className="me-4">
                {title}
            </div>
            <div className="flex gap-4">
                <div
                    className="bg-blue-600 select-none p-1 px-4 font-semibold cursor-pointer hover:bg-blue-500 rounded-lg text-lg text-black"
                    onClick={() => {
                        saveChange();
                        window.open(`/view/preview/${storyId}/${selected_page}`, '_blank');
                    }}
                >
                    Preview This Page
                </div>
                <div
                    className="bg-red-600 select-none p-1 px-4 font-semibold cursor-pointer hover:bg-red-500 rounded-lg text-lg text-black"
                    onClick={handleInitialDelete}
                >
                    Delete This Page
                </div>
            </div>
        </div>
    );
}

export default TopBar;
