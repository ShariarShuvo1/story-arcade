import React, {useEffect, useState} from "react";
import {getPageList} from "../../../api/storyAPI";

function EditChoice({
                        selectedItem,
                        listOfSteps,
                        setListOfSteps,
                        setSelectedItem,
                        jwt,
                        selected_page,
                        storyId,
                        setIsLoading,
                        listOfChoices,
                        setListOfChoices
                    }) {

    const [pageList, setPageList] = useState(null);

    useEffect(() => {
        const getAllPageList = async () => {
            setIsLoading(true);
            if (selectedItem.next_type === "page") {
                const response = await getPageList(jwt, selected_page, storyId);
                setPageList(response.data);
            }
            else{
                setPageList(null);
            }
            setIsLoading(false)
        }

        getAllPageList();
    }, [selectedItem]);

    const handleDelete = (choice) => {
        let tempChoice = [];
        for (let i = 0; i < listOfChoices.length; i++) {
            if (listOfChoices[i] !== choice) {
                tempChoice.push(listOfChoices[i]);
            }
        }
        let tempSteps = [];
        for (let i = 0; i < listOfSteps.length; i++) {
            if (listOfSteps[i] !== selectedItem) {
                tempSteps.push(listOfSteps[i]);
            }
        }

        setListOfSteps(tempSteps);
        setListOfChoices(tempChoice);
        setSelectedItem(null);
    };
    return (
        <div>
            {selectedItem.step_type === "choice" &&
                listOfChoices.map((choice, index) => {
                    if (choice.choice_number === selectedItem.child_step_number) {
                        return (
                            <div key={index} className="">
                                <div className="text-text-hover text-lg font-semibold">
                                    Enter your option text:
                                </div>

                                <input
                                    value={choice.choice}
                                    autoFocus={true}
                                    onChange={(e) => {
                                        let tempChoice = [...listOfChoices];
                                        tempChoice[index].choice = e.target.value;
                                        setListOfChoices(tempChoice);
                                    }}
                                    className="bg-transparent border-2 mt-1 w-full border-slate-500 p-2 rounded-lg text-text-light"
                                    placeholder={"Enter Option Text"}
                                    maxLength={48}
                                />


                                { pageList && pageList.length > 0 && (
                                    <div>
                                        <div className="text-text-hover mt-4 text-lg font-semibold">
                                            Choose the next page:
                                        </div>
                                        <select
                                            defaultValue={selectedItem.next_page? selectedItem.next_page : pageList[0].id}
                                            className="w-full p-2 text-lg mt-1 text-text-light bg-slate-700 rounded-lg"
                                            onChange={(e) => {
                                                let tempSelectedItem = selectedItem;
                                                tempSelectedItem.next_page = e.target.value
                                                setSelectedItem(tempSelectedItem);
                                            }}
                                        >
                                            {pageList.map((page, index) => (
                                                <option
                                                    key={index}
                                                    value={page.id}
                                                >
                                                    {page.page_number}
                                                </option>
                                            ))}

                                        </select>
                                    </div>
                                )}

                                <button
                                    className="py-2 mt-4 rounded-lg bg-red-500 hover:bg-red-600 w-full text-2xl font-bold text-center"
                                    onClick={() => handleDelete(choice)}
                                >
                                    Delete
                                </button>
                            </div>
                        );
                    }
                })}
        </div>
    );
}

export default EditChoice;
