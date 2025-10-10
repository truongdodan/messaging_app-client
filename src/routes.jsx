import { createBrowserRouter, Navigate } from "react-router-dom";
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
import RequiredAuth from "./components/RequireAuth/RequiredAuth";
import NewGroup from "./components/NewGroup/NewGroup";
import Chat from "./components/Chat/Chat";
import BlankChatPage from "./components/BlankChatPage.jsx/BlankChatPage";
import NewChat from "./components/Chat/NewChat"


const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        children: [
            {index: true, element: <Navigate to={'/chats'}/>},                           
            {
                element: <RequiredAuth />,
                children: [
                    {path: '/global', element: <Global />},
                    {
                        path: '/chats', 
                        element: <Chats />,
                        children:[
                            {index:true, element: <BlankChatPage />},
                            {path:'new/:userId', element: <NewChat />},
                            {path:':conversationId', element: <Chat type={"DIRECT"}/>} 
                        ]
                    },
                    {
                        path: '/groups', element: <Groups />,
                        children: [
                            {index: true, element: <BlankChatPage />},
                            {path: 'new', element: <NewGroup />},
                            {path: ':conversationId', element: <Chat type={"GROUP"}/>},
                        ]
                    },
                    {
                        path: '/profile', element: <Profile />,
                        children: [
                            {index: true, element: <ProfileSection />},
                            {path: 'changepassword', element: <ChangePassword />},
                            {path: 'edit', element: <EditProfile />},
                            {path: ':userId', element: <ProfileSection />},
                        ]
                    },
                ]
            }
        ]
    },
    {path: '/login', element: <Login />},
    {path: '/register', element: <Register />},
    {path: '/*', element: <NotFound />},
])

export default router;