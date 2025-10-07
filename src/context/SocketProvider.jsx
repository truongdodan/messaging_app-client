import { createContext, useContext, useEffect, useState } from "react";
import useAuth from "../hook/useAuth"
import socketService from "../service/socket"
import { data } from "react-router-dom";

const SocketContext = createContext({});

// all conversations that current user have, no messages
export const SocketProvider = ({children}) => {
    const {auth, authLoading} = useAuth();
    const [isConnected, setIsConnected] = useState(false);
    const [onlineUsers, setOnlineUsers] = useState(new Set());

    useEffect(() => {
        // await for auth to load
        if(authLoading) return;

        if(auth?.accessToken) {
            // connect to socket after user is authenticated
            const socket = socketService.connect(auth.accessToken);

            socket.on('connect', () => {
                setIsConnected(true);
            })

            socket.on('disconnect', () => {
                setIsConnected(false);
            })

            // Receive initial list of online users when connecting
            socketService.onOnlineUserList((data) => {
                setOnlineUsers(new Set(data.userIds));
            })

            // listen on new online/offline user
            socketService.onUserOnline((data) => {
                setOnlineUsers(pre => new Set([...pre, data.userId]));

                console.log(`${data.username} goes online`);
            })

            socketService.onUserOffline((data) => {
                setOnlineUsers(pre => {
                    const newSet = new Set(pre);
                    newSet.delete(data.userId);
                    return newSet;
                });
            })
        }

        return () => {
            socketService.disconnect();
            setIsConnected(false);
            setOnlineUsers(new Set());
        }
    }, [auth?.accessToken, auth?.user]);

    return (
        <SocketContext.Provider
        value={{
            isConnected,
            onlineUsers,
            socket: socketService
        }}>
            {children}
        </SocketContext.Provider>
    );
}

export default SocketContext;