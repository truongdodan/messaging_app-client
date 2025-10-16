import React, { useCallback, useEffect, useRef, useState } from 'react'
import './Chat.css'
import { Image, SendHorizonal } from 'lucide-react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import GoBackBtn from '../GoBackBtn/GoBackBtn'
import axiosInstance from '../../service/axios'
import useMessaging from '../../hook/useMessaging'
import toast from 'react-hot-toast'

const NewChat = () => {
    const {userId} = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const {conversations, conversationsLoading, createConversation} = useMessaging();

    const [recipient, setRecipient] = useState(location.state?.user || null);
    const [recipientLoading, setRecipientLoading] = useState(!location.state?.user);
    const [messageInput, setMessageInput] = useState("");
    const [isSending, setIsSending] = useState(false);

    const chatOpen = location.pathname !== "/chats" || location.path !== "/groups";

    // Check if conversation already exists and redirect
    useEffect(() => {
        if (conversationsLoading) return;

        const existConversation = conversations?.find(conv => 
            conv?.type === "DIRECT" && // conversation HAVE to be DIRECT
            conv?.participants?.some(participant => participant?.user?.id ===userId) // conversation have the choosen user
        )

        if (existConversation) {    // if exist, navigate to chat page to continue chat
            navigate(`/chats/${existConversation?.id}`);

            return;
        }
        
    }, [conversationsLoading, userId, conversations, navigate])

    // Fetch user infor if it's not passed via state
    useEffect(() => {
        if (recipient || !userId) return;

        setRecipientLoading(true);
        axiosInstance(`/users/${userId}`)
            .then(res => setRecipient(res?.data))
            .catch(err => {
                console.error("Error fetching user info:", err);
                toast.error("Failed to load user");
            })
            .finally(() => setRecipientLoading(false));
    }, [userId, recipient]);

    const onSendMessage = useCallback(() => {
        if (!messageInput.trim() || !recipient || isSending) return;

        setIsSending(true);
        const messageToSend = messageInput.trim();

        // Create conversation
        createConversation({
            type: "DIRECT",
            title: "",
            allMemberIds: [recipient.id],
        }, (response) => {
            if (!response.success) {
                setIsSending(false);
                toast.error(response.error || 'Failed to create conversation');
                console.error("Error creating conversation:", response.error);
                return;
            }

            // Navigate to new chat with pending message
            navigate(`/chats/${response.data.id}`, {
                replace: true,
                state: { 
                    pendingMessage: { 
                        type: 'TEXT', 
                        content: messageToSend 
                    } 
                }
            });
        });

        // Clear input immediately
        setMessageInput("");
    }, [messageInput, recipient, isSending, createConversation, navigate]);

    const handleKeydown = useCallback((e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault(); // stop newline/submit
            onSendMessage();
        }
    }, [onSendMessage]);

    if (recipientLoading) return <div>Loading User Info...</div>; 
    if (!recipient) return <div>User not found</div>;

  return (
    /* Fill in the chat section with a blank page if user havent select any conversation */
    <div className={`conversation conversation--direct ${chatOpen ? 'conversation--open': ''}`}>
        <div className="conversation__body">
            <div className='conversation__header'>
                <GoBackBtn />
                <div className="profile-container">
                    <img 
                        src={recipient?.profileUrl ? recipient?.profileUrl : "/user.png"}
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
                    disabled={isSending}
                />
                <div className="icon-container image">
                    <Image />
                </div>
                <div 
                    className="icon-container send-message" 
                    onClick={onSendMessage}
                >
                    <SendHorizonal />
                </div>
            </form>
        </div>
    </div>  
  )
}

export default NewChat