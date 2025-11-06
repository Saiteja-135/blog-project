import { createBrowserRouter } from "react-router-dom";
import Login from "../component/login/Login";
import Register from "../component/register/Register";

let routes=createBrowserRouter([
      {
        path:"/register",
        element:<Register></Register>

    },
    {
        path:"/",
        element:<Login></Login>
    }]);

export default routes;