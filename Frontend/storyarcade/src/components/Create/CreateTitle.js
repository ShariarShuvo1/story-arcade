import React from "react";
import { useAuthContext } from "../../hooks/useAuthContext";

function CreateTitle() {
    const { jwt } = useAuthContext();

    return (
        <div>
            <h1>Profile</h1>
        </div>
    );
}

export default CreateTitle;
