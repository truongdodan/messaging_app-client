import { createContext, useEffect, useState } from "react";
import axiosInstance, { getFileUrl } from "../service/axios";
import useAuth from "../hook/useAuth";

const ConversationContext = createContext({});

// all conversations that current user have, no messages
export const ConversationProvider = ({children}) => {
    const [conversationItems, setConversationItems] = useState(null);
    const [conversationItemsLoading, setConversationItemsLoading] = useState(true);

    const {auth} = useAuth();

    useEffect(() => {
        if (!auth?.accessToken) return;
        
        const fetchConversationWithImageUrl = async () => {
            try {
                // get all conversation
                const res = await axiosInstance.get('/conversations');
                const conversations = res?.data || [];

                // get all the conversation profile image
                const conversationsWithImageUrl = await Promise.all(
                    conversations.map(async (conver) => {
                        if (!conver.profileUrl) return conver;

                        try {

                            if (conver.type === "GROUP") { // if is GROUP conversation also get other party image url
                                const converImageUrl = await getFileUrl(conver.profileUrl);

                                return { ...conver, profileUrl: converImageUrl};
                            } else if (conver.type === "DIRECT" && conver?.participants?.[0]) {
                                const recipientimageUrl = await getFileUrl(conver.participants[0].user.profileUrl);
                                
                                return { 
                                    ...conver, 
                                    participants: [
                                        {
                                            ...conver.participants[0],
                                            user: {
                                                ...conver.participants[0].user,
                                                profileUrl: recipientimageUrl,
                                            }
                                        }
                                    ]
                                };
                            }
                            
                            return conver;
                        } catch (error) {
                            console.error("Error fetch conversation profile Url: ", error);

                            return conver;
                        }
                    })
                )

                // save conversation
                setConversationItems(conversationsWithImageUrl);
            } catch (error) {
                console.error("Error when fetching conversation items: ", error);
            } finally {
                setConversationItemsLoading(false);
            }
        }

        fetchConversationWithImageUrl();

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