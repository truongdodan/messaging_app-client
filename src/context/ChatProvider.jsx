import { createContext, useState } from "react";

const ChatContext = createContext({});

// all the messages in a conversation
export const ChatProvider = ({children}) => {
    const [chatList, setChatList] = useState(null);
    const [currentChat, setCurrentChat] = useState(null);

    return (
        <ChatContext value={{
            currentChat,
            setCurrentChat,
            chatList,      
            setChatList,   
        }}>
            {children}
        </ChatContext>
    );
}

export default ChatContext;