import { Navigate } from 'react-router-dom';
import CreateTitle from "../components/Create/CreateTitle";
import { useAuthContext } from "../hooks/useAuthContext";


function RouteCreate() {
    const {jwt} = useAuthContext();

    return [
        {
            path: '/create',
            element: <Navigate to="createTitle" replace/>,
        },
        {
            path: '/create/createTitle',
            element: <CreateTitle/>,
        },
    ];
}

export default RouteCreate;
