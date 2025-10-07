import React, { useCallback, useEffect, useRef, useState } from 'react'
import './Chat.css'
import { ArrowLeftIcon, Image, SendHorizonal } from 'lucide-react'
import Message from '../Message/Message'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import GoBackBtn from '../GoBackBtn/GoBackBtn'
import useChat from '../../hook/useChat'
import axiosInstance from '../../service/axios'
import useAuth from '../../hook/useAuth'
import useConversation from '../../hook/useConversation'

const NewChat = () => {
    const {userId} = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const {conversationItems, conversationItemsLoading, createConversation} = useConversation();

    const [recipient, setRecipient] = useState(null);
    const [recipientLoading, setRecipientLoading] = useState(true);
    const [isCreatingConversation, setIsCreatingConversation] = useState(false);
    const [messageInput, setMessageInput] = useState("");
    const pendingMessageRef = useRef(null);
    const sendMessageBtnRef = useRef(); 

    const chatOpen = location.pathname !== "/chats" || location.path !== "/groups";

    // check if conver exist and redirect
    useEffect(() => {
        if (conversationItemsLoading) return;

        // check if login user already have a chat with this user
        const existConversation = conversationItems?.find(conversationItem => 
            conversationItem?.type === "DIRECT" && // conversation have to be DIRECT
            conversationItem?.participants?.some(participant => participant?.user?.id ===userId) // conversation have the choosen user
        )

        if (existConversation) {    // if exist, navigate to chat page to continue chat
            navigate(`/chats/${existConversation?.id}`);

            return;
        }
        
    }, [conversationItemsLoading, userId, conversationItems, navigate])

    // load user infor for header
    useEffect(() => {
        setRecipientLoading(true);
        axiosInstance(`/users/${userId}`)
            .then(res => {
                setRecipient(res?.data);
            })
            .catch(err => console.error("Error when trying to get user infor: ", err))
            .finally(() => setRecipientLoading(false));
    }, [userId]);

    // listen when new converation is created to redirect to /chats page
    useEffect(() => {
        if (isCreatingConversation && !conversationItems && !userId) return;

        // get newly created conver
        const newConversation = conversationItems?.find(
            conv => conv?.participants?.some(par => par?.user?.id === userId) && conv?.type === "DIRECT"
        );
        
        if (newConversation && pendingMessageRef.current) {
            // navigate to chat with pending message
            console.log("New cv: ", newConversation);
            navigate(`/chats/${newConversation.id}`, {
                replace: true,
                state: {pendingMessage: pendingMessageRef.current},
            });

            // clean up
            pendingMessageRef.current = null;
            setIsCreatingConversation(false);
        }
    }, [conversationItems, isCreatingConversation, userId, navigate]);

    const onSendMessage = useCallback(() => {
        if (!messageInput.trim() || !recipient || isCreatingConversation) return;

        // store pending message to send after the conversation is created
        pendingMessageRef.current = {type: 'TEXT', content: messageInput}

        setIsCreatingConversation(true);
        createConversation({
            type: "DIRECT",
            allMemberIds: [recipient?.id],
        }, () => {})
        
        setMessageInput("");
    }, [messageInput, recipient, isCreatingConversation, createConversation]);

    const handleKeydown = useCallback((e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault(); // stop newline/submit
            onSendMessage();
        }
    }, [onSendMessage]);

    if (recipientLoading) return <div>Loading User Infor...</div>; 

    if (!recipient) return <div>User not found</div>;

  return (
    /* Fill in the chat section with a blank page if user havent select any conversation */
    <div className={`conversation conversation--direct ${chatOpen ? 'conversation--open': ''}`}>
        <div className="conversation__body">
            <div className='conversation__header'>
                <GoBackBtn />
                <div className="profile-container">
                    <img 
                        src={recipient?.profile ? recipient?.profile : "/user.png"} 
                        alt="user profile" 
                    />
                </div>
                <div className="title conversation__title">{recipient?.username}</div>
            </div>
            <hr />
            <div className="conversation__messages">
                <div style={{
                        width: "100%",
                        height: "100%",
                        fontSize: "1rem",
                        fontWeight: "normal",
                        fontStyle: "italic",
                        color: "var(--color-txt-secondary)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                       }}>
                        Start a conversation, say Hi!
                </div>
            </div> 
            <hr />
            <form className="conversation__form">
                <textarea 
                    className='input' 
                    placeholder='Text a message'
                    onChange={(e) => { 
                        setMessageInput(e.target.value);
                        // auto grow input
                        e.target.style.height = "auto";
                        e.target.style.height = e.target.scrollHeight + "px";
                    }}
                    value={messageInput}
                    onKeyDown={handleKeydown}
                    disabled={isCreatingConversation}
                />
                <div className="icon-container image">
                    <Image />
                </div>
                <div 
                    className="icon-container send-message" 
                    onClick={onSendMessage} 
                    ref={sendMessageBtnRef}
                >
                    <SendHorizonal />
                </div>
            </form>
        </div>
    </div>  
  )
}

export default NewChat