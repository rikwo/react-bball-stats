// App.jsx (or call it routes.jsx)
import { createBrowserRouter } from "react-router-dom";
import Game from "./Game";
import Home from "./Home";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Home />,
    },
    {
        path: "/game/:id",
        element: <Game />,
    },
]);

export default router;