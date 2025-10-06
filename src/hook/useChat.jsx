import { useCallback, useContext, useEffect, useState } from "react"
import ChatContext from "../context/ChatProvider";
import { useSocket } from "../context/SocketProvider";
import axiosInstance, { getFileUrl } from "../service/axios";

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

        /* // check if the current chat list contain this chat
        const existingChat = chatList?.find(chat => chat?.id === chatId);

        if(existingChat) {
            setCurrentChat(existingChat);
            setCurrentChatLoading(false);
        } else {    
            // fetch chat from API
            // also get image in chat
            axiosInstance.get(`/conversations/${chatId}`)
                .then(res => {
                    const chatData = res?.data;

                    setCurrentChat(chatData);

                    // add chat to chat list
                    setChatList(pre => {
                        const exist = chatList?.some(chat => chat?.id === chatData?.id);

                        if (exist) return pre;

                        return [...(pre || []), chatData];
                    });
                })
                .catch(err => {
                    console.error("Error when fetching conversation: ", err?.message);
                    setCurrentChat(null);
                })
                .finally(() => setCurrentChatLoading(false));
        } */

        const getCurrentConversation = async () => {
            // check if the current chat list contain this chat
            const existingChat = chatList?.find(chat => chat?.id === chatId);

            if(existingChat) {
                setCurrentChat(existingChat);
                setCurrentChatLoading(false);
            } else {    
                // fetch chat from API
                // also get image in chat
                /* axiosInstance.get(`/conversations/${chatId}`)
                    .then(res => {
                        const chatData = res?.data;

                        setCurrentChat(chatData);

                        // add chat to chat list
                        setChatList(pre => {
                            const exist = chatList?.some(chat => chat?.id === chatData?.id);

                            if (exist) return pre;

                            return [...(pre || []), chatData];
                        });
                    })
                    .catch(err => {
                        console.error("Error when fetching conversation: ", err?.message);
                        setCurrentChat(null);
                    })
                    .finally(() => setCurrentChatLoading(false)); */
                try {
                    const res = await axiosInstance.get(`/conversations/${chatId}`);
                    const chat = res?.data;

                    // get all the image in chat
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
                    
                } catch (error) {
                    console.error("Error when getting chat: ", error);
                }

                setCurrentChatLoading(false);
            }
        }

        getCurrentConversation();
            
    }, [chatId, isConnected, chatList, setCurrentChat, setChatList]);

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