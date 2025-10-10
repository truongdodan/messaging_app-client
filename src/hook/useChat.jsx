import { useCallback, useContext, useEffect, useState } from "react"
import ChatContext from "../context/ChatProvider";
import axiosInstance, { getFileUrl } from "../service/axios";
import useSocket from "./useSocket";
import toast from "react-hot-toast";

const useChat = (chatId) => {
    const {socket, isConnected} = useSocket();
    const { currentChat, setCurrentChat, chatList, setChatList} = useContext(ChatContext);
    const [currentChatLoading, setCurrentChatLoading] = useState(true);

    // get conversation with message from chatId
    useEffect(() => {
        if (!chatId) {
            setCurrentChatLoading(false);
            return;
        }

        if (!isConnected) return; // wait socket connection

        const getCurrentConversation = async () => {
            // check if the current chat list contain this chat
            const existingChat = chatList?.find(chat => chat?.id === chatId);

            if(existingChat) {
                setCurrentChat(existingChat);
                setCurrentChatLoading(false);
            } else {    
                try {
                    const res = await axiosInstance.get(`/conversations/${chatId}`);
                    const chat = res?.data;
                    
                    // get all the image in chat
                    if (chat) {
                        const chatWithImageUrl = await Promise.all(
                            chat?.messages?.map(async (msg) => {
                                if (msg?.type === "FILE") { // if message is a file or image => get url
                                    const msgDetails = JSON.parse(msg?.content);

                                    const url = await getFileUrl(msgDetails?.path);

                                    const msgWithUrl = JSON.stringify({
                                        ...msgDetails,
                                        path: url,
                                    });

                                    return {...msg, content: msgWithUrl};
                                }

                                return msg;
                            })
                        );

                        // u may need double check if chat is repeated
                        setCurrentChat({
                            ...chat,
                            messages: chatWithImageUrl,
                        });
                    }
                    
                } catch (error) {
                    console.error("Error when getting chat: ", error);
                    toast.error('Error when getting chat');
                } finally {setCurrentChatLoading(false);}
            }
        }

        getCurrentConversation();
            
    }, [chatId, isConnected, chatList]);

    // handle in-coming message via socket
    useEffect(() => {
        if(!socket || !isConnected) return;

        const handleNewMessage = (newMessage) => {
            // update current chat if newMessage belong to it
            setCurrentChat(pre => {
                if (newMessage?.conversationId !== currentChat?.id) return;
                
                // check if duplicate
                const existMessage = pre?.messages?.some(message => message?.id === newMessage.id);
                if (existMessage) return pre;


                return {
                    ...pre,
                    messages: [...(pre?.messages || []), newMessage]
                };
            });

            // update newMessage to chat in chatList
            setChatList(pre => {
                if (!pre) return;

                return pre.map(chat => {
                    if (chat?.id === newMessage.conversationId) {
                        // Check if message already exist - prevent duplicate
                        const existMessage = chat?.messages?.some(message => message?.id === newMessage.id);
                        if (existMessage) return chat;

                        return {
                            ...chat,
                            messages: [...(chat?.messages || []), newMessage]
                        };
                    }

                    return chat;
                });
            });
        }

        socket.onNewMessage(handleNewMessage);

        return () => {
            socket.off('new_message', handleNewMessage);
        }
    }, [socket, isConnected, currentChat?.id, setCurrentChat, setChatList]);

    // emit new message func
    const sendMessage = useCallback(({type='TEXT', content}) => {
        if(socket && currentChat?.id) {
            socket.sendMessage(type, content, currentChat.id);
        }
    }, [socket, currentChat?.id]);

    return {
        currentChat,
        sendMessage,
        currentChatLoading,
    };
}

export default useChat;