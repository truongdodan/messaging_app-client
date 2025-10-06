import { useCallback, useContext, useEffect, useState } from "react"
import ConversationContext from "../context/ConversationProvider";
import { useSocket } from "../context/SocketProvider";
import useChat from "./useChat";
import { data, useNavigate } from "react-router-dom";

const useConversation = () => {
    const {socket, isConnected} = useSocket();
    const { conversationItems, setConversationItems, conversationItemsLoading } = useContext(ConversationContext);

    // register event listener
    useEffect(() => {
        if(!socket || !isConnected) return;

        const handleNewConversation = (newConversation) => {
            // temp, later check if the newConversation got duplicate/added twice
            setConversationItems(pre => {
                const existConversation = pre?.some(converItem => converItem?.id === newConversation?.id)

                if (existConversation) return pre;

                return [...(pre || []), newConversation];
            })
        }

        socket.onNewConversation(handleNewConversation);

        return () => {
            socket.off('new_conversation', handleNewConversation);
        }
    }, [socket, isConnected]);

    const createConversation = useCallback(
        ({title="", type='DIRECT', profileUrl="", allMemberIds}={}, callback) => {
            if (socket) {
            socket.createConversation({title, type, profileUrl, allMemberIds}, callback);
            }
        }
        ,[socket]
    );

    return {
            conversationItems,
            conversationItemsLoading,
            createConversation};
}

export default useConversation;