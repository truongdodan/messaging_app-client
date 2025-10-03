import React, { useCallback, useEffect, useRef, useState } from 'react'
import './Chat.css'
import { ArrowLeftIcon, CurlyBraces, Image, Paperclip, SendHorizonal } from 'lucide-react'
import Message from '../Message/Message'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import GoBackBtn from '../GoBackBtn/GoBackBtn'
import useChat from '../../hook/useChat'
import axiosInstance from '../../service/axios'
import useAuth from '../../hook/useAuth'
import useConversation from '../../hook/useConversation'

const Chat = ({type}) => {
    const location = useLocation();
    const {conversationId} = useParams();
    const navigate = useNavigate();

    const {auth} = useAuth();
    const {currentChat, currentChatLoading, sendMessage} = useChat(conversationId);
    const [messageInput, setMessageInput] = useState("");
    const [loading, setLoading] = useState(true);
    const hasSendPendingMessageRef = useRef(false);
    const sendMessageBtnRef = useRef(null);
    const messageEndRef = useRef(null);
    const fileInputRef = useRef(null);
    
    const chatOpen = location.pathname !== "/chats" || location.pathname !== "/groups";
    const [converTitle, setConverTitle] = useState();
    const [converProfile, setConverProfile] = useState();


    // set title and profile for the conversation
    useEffect(() => {
        if (currentChatLoading || !currentChat) return;

            // set title and profile for header
            if (type === "DIRECT") {
                const otherParticipant = currentChat?.participants?.find(
                    par => par?.user?.id !== auth?.user?.id
                );
                setConverTitle(otherParticipant?.user?.username || "Unknown User");
                setConverProfile(otherParticipant?.user?.profileUrl || "/user.png");
            } else {
                setConverTitle(currentChat?.title);
                setConverProfile(currentChat?.profileUrl);
            }

            setLoading(false);  
    }, [currentChatLoading, auth?.user?.id, type, currentChat]);

    // if there is pending message, send it
    useEffect(() => {
        const pendingMessage = location?.state?.pendingMessage;

        if (pendingMessage && currentChat?.id && !currentChatLoading && !hasSendPendingMessageRef.current) {
            hasSendPendingMessageRef.current = true;
            // clear state so it doesnt resend on re-render
            navigate('.', { replace: true, state: {} });
            sendMessage(pendingMessage);
        }
    }, [currentChat?.id, currentChatLoading, location, navigate, sendMessage]);  //// remove currentChat from dependency might cause errors - it show for a sec then disapr

    const onSendMessage = useCallback(() => {
            if (!messageInput.trim()) return;

            const newMessage = {type: 'TEXT', content: messageInput};
            sendMessage(newMessage);

            setMessageInput("");
        }, [messageInput, sendMessage]);

    const handleKeydown = useCallback((e) => {
            if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault(); // stop newline/submit
                onSendMessage();
            }
        }, [onSendMessage]);

    const scrollToBottom = useCallback(() => {
        messageEndRef?.current?.scrollIntoView({behavior: 'smooth'});
    }, []);

    // auto scroll to bottom when messages change
    useEffect(() => {
        if (currentChat?.messages?.length > 0 && !loading) {
            scrollToBottom();
        }
    }, [currentChat?.messages, scrollToBottom, loading]);

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await axiosInstance.post('/messages/file', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            const { path } = res.data;

            // Send message with file details
            const fileDetails = {
                path,
                filename: file.name,
                mimetype: file.type,
            };
        
            console.log(fileDetails);

            sendMessage({ type: 'FILE', content: JSON.stringify(fileDetails) });

        } catch (error) {
            console.error('File upload failed:', error);
            // Handle error (e.g., show toast)
        }
    };

    if (loading) return <div>Loading Chat...</div>; 
    if (!currentChat) return <div>Conversation not found</div> // problem

  return (
    /* Fill in the chat section with a blank page if user havent select any conversation */
    <div className={`conversation ${type === "DIRECT" ? 'conversation--direct' : 'conversation--group'} ${chatOpen ? 'conversation--open': ''}`}>
        <div className="conversation__body">
            <div className='conversation__header'>
                <GoBackBtn />
                <div className="profile-container">
                    <img src={converProfile ? converProfile : "/user.png"} alt="user profile" />
                </div>
                <div className="title conversation__title">{converTitle}</div>
            </div>
            <hr />
            <div className="conversation__messages">
                {
                    currentChat
                    ? <>
                        {
                            currentChat?.messages?.map(message => 
                            <Message 
                                key={message?.id}
                                message={message} 
                                isSender={message?.sender?.username === auth?.user?.username}
                            />
                            )
                        }
                        <div ref={messageEndRef}/>
                      </>
                    : <div style={{
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
                }
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
                />
                <input 
                    type="file" 
                    name="file" 
                    id="file" 
                    onChange={handleFileUpload}
                    ref={fileInputRef}
                    style={{display: "none"}}
                />
                <div className="icon-container image" onClick={() => {fileInputRef.current.click()}}>
                    <Paperclip />
                </div>
                <div className="icon-container send-message" onClick={onSendMessage} ref={sendMessageBtnRef}>
                    <SendHorizonal />
                </div>
            </form>
        </div>
    </div>  
  )
}

export default Chat