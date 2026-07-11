import { Navigate } from "react-router-dom";
import { getUser } from "../utils/auth";

const ProtectRoute = ({children}) => {
    const user=getUser();
    if (!user) {
        return <Navigate to="/" replace />;
    }

    return children;
}

export default ProtectRoute