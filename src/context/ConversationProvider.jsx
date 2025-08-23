const { useState, createContext } = require("react")

const ConversationContext = createContext({});

// all conversations that current user have, no messages
export const ConversationProvider = ({children}) => {
    const [conversations, setConversation] = useState(null);
    const [conversationLoading, setConversationLoading] = useState(true);

    return (
        <ConversationContext value={{conversations, setConversation, conversationLoading}}>
            {children}
        </ConversationContext>
    );
}

export default ConversationContext;