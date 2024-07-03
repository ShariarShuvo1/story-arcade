import React, {useEffect} from "react";
import {useAuthContext} from "../../hooks/useAuthContext";
import {useNavigate} from "react-router-dom";


function EmailVerify() {
    const jwt = JSON.parse(localStorage.getItem('jwt'));
    const navigate = useNavigate();
    const { dispatch } = useAuthContext();
    // when finished, call ->     dispatch({ type: "LOGIN", payload: jwt });

    useEffect(() => {
        if (!jwt) {
            navigate("/login");
        }
    }, []);

    return (
        <div>
            <h1>Email Verify</h1>
        </div>
    );
}

export default EmailVerify;
