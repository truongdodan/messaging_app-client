import { createBrowserRouter } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import Global from "./pages/Global/Global";
import Login from "./pages/Auth/Login/Login"
import Register from "./pages/Auth/Register/Register"
import NotFound from "./pages/NotFound/NotFound"
import Chats from "./pages/Chats/Chats";
import Groups from "./pages/Groups/Groups";
import Profile from "./pages/Profile/Profile";
import ProfileSection from "./components/Profile/Profile";
import EditProfile from "./components/EditProfile/EditProfile"
import ChangePassword from "./components/ChangePassword/ChangePassword"

const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        children: [
            {path: '/global', element: <Global />},
            {path: '/chats', element: <Chats />},
            {path: '/groups', element: <Groups />},
            {
                path: '/profile', element: <Profile />,
                children: [
                    {index: true, element: <ProfileSection />},
                    {path: 'changepassword', element: <ChangePassword />},
                    {path: 'edit', element: <EditProfile />},
                ]
            },
        ]
    },
    {path: '/login', element: <Login />},
    {path: '/register', element: <Register />},
    {path: '/*', element: <NotFound />},
])

export default router;