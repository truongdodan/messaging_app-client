import Conversation from './conversation';

export default {
    title: 'Conversation Test',
    component: Conversation,
}

const groupConversation = {
    id: 111,
    type: "GROUP", 
    title: "dark souls enjoyer", 
    participant: [{}, {}, {}],
    isActive: false,
}

const directConversation = {
    id: 6969,
    type: "DIRECT", 
    title: "", 
    participant: {
        username: "dantRuongdo", 
        firstname: "Truong", 
        lastname: "Do Dan"
    },
    isActive: true,
}

export const ConversationWithoutImg = () => <Conversation  conversation={ groupConversation }/>
export const ConversationWithImg = () => <Conversation  conversation={ directConversation }/>