import React, { useCallback, useEffect, useRef, useState } from "react";
import "./Chat.css";
import { Paperclip, SendHorizonal } from "lucide-react";
import Message from "../Message/Message";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import GoBackBtn from "../GoBackBtn/GoBackBtn";
import { uploadFile } from "../../service/axios";
import useAuth from "../../hook/useAuth";
import { UserSkeleton } from "../Sekeleton/Skeleton";
import useMessaging from "../../hook/useMessaging";

const BlankChat = () => {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        fontSize: "1rem",
        fontWeight: "normal",
        fontStyle: "italic",
        color: "var(--color-txt-secondary)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      Start a conversation, say Hi!
    </div>
  );
};

// format date separator display
const formatDateSeparator = (dateString) => {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return "Today";
  }

  if (date.toDateString() === yesterday.toDateString()) {
    return "Yesterday";
  }

  // Check if within this week
  // Get the start of the current week (Monday)
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay() + 1); // getDay() -> 0=Sun, 1=Mon,...
  startOfWeek.setHours(0, 0, 0, 0);

  // Get the end of the week (Sunday)
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  if (date >= startOfWeek && date <= endOfWeek) {
    return date.toLocaleDateString("en-US", { weekday: "long" });
  }

  // Otherwise show full date
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== today.getFullYear() ? "numeric" : undefined,
  });
};

const Chat = ({ type }) => {
  const location = useLocation();
  const { conversationId } = useParams();
  const navigate = useNavigate();

  const { auth } = useAuth();
  const {
    loadConversationMessages,
    getCurrentConversation,
    sendMessage,
    currentConversationId,
  } = useMessaging();
  const currentChat = getCurrentConversation();

  const [messageInput, setMessageInput] = useState("");
  const [loading, setLoading] = useState(true);
  const hasSendPendingMessageRef = useRef(false);

  const sendMessageBtnRef = useRef(null);
  const messageEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const chatOpen =
    location.pathname !== "/chats" || location.pathname !== "/groups";

  // Load chat and check for pending message
  useEffect(() => {
    const handleChatLoadAndPending = async () => {
      await loadConversationMessages(conversationId); // ensure chat is loaded first

      // now check pending message
      const pendingMessage = location?.state?.pendingMessage;
      const chat = getCurrentConversation();
      if (pendingMessage && chat?.id && !hasSendPendingMessageRef.current) {
        hasSendPendingMessageRef.current = true;
        navigate(".", { replace: true, state: {} });
        sendMessage({ ...pendingMessage, conversationId: chat.id });
      }
    };

    handleChatLoadAndPending();
  }, [conversationId, location, navigate, sendMessage]);

  // Loading current chat for header infor
  useEffect(() => {
    if (!currentChat) return;
    setLoading(false);
  }, [currentChat]);

  const onSendMessage = useCallback(() => {
    if (!messageInput.trim()) return;

    const newMessage = { type: "TEXT", content: messageInput };
    sendMessage(newMessage);

    setMessageInput("");
  }, [messageInput, sendMessage]);

  // When user press Enter
  const handleKeydown = useCallback(
    (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault(); // stop newline/submit
        onSendMessage();
      }
    },
    [onSendMessage]
  );

  // Scroll to the bottom of the chat
  const scrollToBottom = useCallback(() => {
    messageEndRef?.current?.scrollIntoView();
  }, []);

  // auto scroll to bottom when messages change
  useEffect(() => {
    if (currentChat?.messages?.length > 0 && !loading) {
      scrollToBottom();
    }
  }, [currentChat?.messages?.length, loading]);

  // When user send a file in chat
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      // Upload file
      await uploadFile(currentConversationId, file);
    } catch (error) {
      console.error("File upload failed:", error);
      toast.error("Failed to upload file");
    }
  };

  // group message by date
  const groupMessages = (messages) => {
    if (!messages || messages.length === 0) return {};

    return messages.reduce((groups, msg) => {
      const date = new Date(msg.createdAt).toDateString();

      if (!groups[date]) groups[date] = [];
      groups[date].push(msg);

      return groups;
    }, {});
  };

  if (loading) return <UserSkeleton />;
  if (!loading && !currentChat)
    return <div className="">Conversation not found</div>;

  return (
    /* Fill in the chat section with a blank page if user havent select any conversation */
    <div
      className={`conversation ${type === "DIRECT" ? "conversation--direct" : "conversation--group"} ${chatOpen ? "conversation--open" : ""}`}
    >
      <div className="conversation__body">
        <div className="conversation__header">
          <GoBackBtn />
          <div className="profile-container">
            <img
              src={
                currentChat.profileUrl ? currentChat.profileUrl : "/user.png"
              }
              alt="user profile"
            />
          </div>
          <div className="title conversation__title">{currentChat.title}</div>
        </div>
        <hr />
        <div className="conversation__messages">
          {currentChat && currentChat?.messages?.length > 0 ? (
            <>
              {Object.entries(groupMessages(currentChat.messages)).map(
                ([date, msgs]) => (
                  <React.Fragment key={date}>
                    <div className="data-separator">
                      {formatDateSeparator(date)}
                    </div>
                    {msgs.map((msg) => (
                      <Message
                        key={msg?.id}
                        message={msg}
                        isSender={
                          msg?.sender?.username === auth?.user?.username
                        }
                        onImageLoad={scrollToBottom}
                      />
                    ))}
                  </React.Fragment>
                )
              )}
              <div ref={messageEndRef} />
            </>
          ) : (
            <BlankChat />
          )}
        </div>
        <hr />
        <form className="conversation__form">
          <textarea
            className="input"
            placeholder="Text a message"
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
            style={{ display: "none" }}
          />
          <div
            className="icon-container image"
            onClick={() => {
              fileInputRef.current.click();
            }}
          >
            <Paperclip />
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
  );
};

export default Chat;
