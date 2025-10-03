import { createContext, useEffect, useState } from "react";
import axiosInstance from "../service/axios";
import useAuth from "../hook/useAuth";

const ConversationContext = createContext({});

// all conversations that current user have, no messages
export const ConversationProvider = ({children}) => {
    const [conversationItems, setConversationItems] = useState(null);
    const [conversationItemsLoading, setConversationItemsLoading] = useState(true);

    const {auth} = useAuth();

    useEffect(() => {
        if (auth?.accessToken)
        
        axiosInstance.get(`/conversations`)
            .then(res => {
                setConversationItems(res?.data);
                setConversationItemsLoading(true);
            })  
            .catch(err => console.error("Error when retrive Conversation Item: ", err))
            .finally(() => setConversationItemsLoading(false));
    }, [auth?.accessToken]);


    return (
        <ConversationContext.Provider 
        value={{
            conversationItems,
            setConversationItems,
            conversationItemsLoading,
        }}>
            {children}
        </ConversationContext.Provider>
    );
}

export default ConversationContext;