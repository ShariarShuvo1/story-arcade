import React from "react";
import NextSelector from "./NextSelector";

function EditMover({
                        selectedItem,
                        listOfSteps,
                        setListOfSteps,
                        setSelectedItem,
                        jwt,
                        selected_page,
                        storyId,
                        setIsLoading,
                       listOfMover,
                       setListOfMover
                    }) {

    const handleDelete = (mover) => {
        let tempMover = [];
        for (let i = 0; i < listOfMover.length; i++) {
            if (listOfMover[i] !== mover) {
                tempMover.push(listOfMover[i]);
            }
        }
        let tempSteps = [];
        for (let i = 0; i < listOfSteps.length; i++) {
            if (listOfSteps[i] !== selectedItem) {
                tempSteps.push(listOfSteps[i]);
            }
        }

        setListOfSteps(tempSteps);
        setListOfMover(tempMover);
        setSelectedItem(null);
    };

    return (
        <div>
            {selectedItem.step_type === "mover" &&
                listOfMover.map((mover, index) => {
                    if (mover.mover_number === selectedItem.child_step_number) {
                        return (
                            <div key={index} className="">
                                <div className="text-text-hover text-lg font-semibold">
                                    Next step action:
                                </div>

                                <select
                                    className="w-full p-2 text-lg mt-1 text-text-light bg-slate-700 rounded-lg"
                                    defaultValue={mover.next_type}
                                    onChange={(e) => {
                                        let tempMover = [...listOfMover];
                                        tempMover[index].next_type = e.target.value;
                                        setListOfMover(tempMover);
                                    }}
                                >
                                    <option value="auto">Automatic</option>
                                    <option value="click">Mouse Click</option>
                                </select>

                                <div className="text-text-hover mt-4 text-lg font-semibold">
                                    Delay after action (in millisecond):
                                </div>

                                <input
                                    value={mover.wait_duration}
                                    onChange={(e) => {
                                        if (e.target.value >= 0 && e.target.value <= 10000) {
                                            let tempMover = [...listOfMover];
                                            tempMover[index].wait_duration = e.target.value;
                                            setListOfMover(tempMover);
                                        }
                                    }}
                                    className="bg-transparent border-2 mt-1 w-full border-slate-500 p-2 rounded-lg text-text-light"
                                    placeholder={"Enter delay"}
                                    type="number"
                                    min={0}
                                    max={10000}
                                />

                                <NextSelector
                                    setIsLoading={setIsLoading}
                                    selectedItem={selectedItem}
                                    jwt={jwt}
                                    selected_page={selected_page}
                                    storyId={storyId}
                                    setSelectedItem={setSelectedItem}
                                />

                                <button
                                    className="py-2 mt-4 rounded-lg bg-red-500 hover:bg-red-600 w-full text-2xl font-bold text-center"
                                    onClick={() => handleDelete(mover)}
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

export default EditMover;
