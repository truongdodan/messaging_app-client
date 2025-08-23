import { createContext, useState } from "react";

const ChatContext = createContext({});

// all the messages in a conversation
export const ChatProvider = ({children}) => {
    const [chat, setChat] = useState(null);
    const [chatLoading, setChatLoading] = useState(true);

    return (
        <ChatContext value={{chat, setChat, setChatLoading}}>
            {children}
        </ChatContext>
    );
}

export default ChatContext;