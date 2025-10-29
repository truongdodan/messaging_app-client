import { createContext, useCallback, useEffect, useState } from "react";
import axiosInstance from "../service/axios";
import useAuth from "../hook/useAuth";
import useSocket from "../hook/useSocket";
import toast from "react-hot-toast";

const MessagingContext = createContext({});

/**
 * Features:
 * - Stores all conversations with/without messages
 * - Auto-syncs with socket events (new messages, new conversations)
 * - Loads messages on-demand when conversation is opened
 */
export const MessagingProvider = ({ children }) => {
  const { auth } = useAuth();
  const { socket, isConnected } = useSocket();

  // Single source of truth
  const [conversations, setConversations] = useState([]);
  const [conversationsLoading, setConversationsLoading] = useState(true);
  const [currentConversationId, setCurrentConversationId] = useState(null);

  // Fetch all conversations
  useEffect(() => {
    if (!auth?.accessToken) return;

    const fetchConversations = async () => {
      try {
        const res = await axiosInstance.get("/conversations");
        const conversationList = res?.data || [];

        // Backend already returns URLs! Just add empty messages array
        const conversationsWithMessages = conversationList.map((conv) => ({
          ...conv,
          messages: [], // Initialize empty, load on-demand
        }));

        setConversations(conversationsWithMessages);
      } catch (error) {
        console.error("Error fetching conversations:", error);
        toast.error("Failed to load conversations");
      } finally {
        setConversationsLoading(false);
      }
    };

    fetchConversations();
  }, [auth?.accessToken]);

  // SOCKET: Listen for new conversations
  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleNewConversation = (newConversation) => {
      setConversations((prev) => {
        // Prevent duplicates
        const exists = prev.some((conv) => conv.id === newConversation.id);
        if (exists) return prev;

        return [...prev, { ...newConversation, messages: [] }];
      });
    };

    socket.onNewConversation(handleNewConversation);

    return () => {
      socket.off("new_conversation", handleNewConversation);
    };
  }, [socket, isConnected]);

  // SOCKET: Listen for new messages
  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleNewMessage = (newMessage) => {
      setConversations((prev) => {
        return prev.map((conv) => {
          // Only update the conversation that received the message
          if (conv.id !== newMessage.conversationId) return conv;

          // Check for duplicate
          const isDuplicate = conv.messages?.some(
            (msg) => msg.id === newMessage.id
          );
          if (isDuplicate) return conv;

          // Update both messages AND metadata
          return {
            ...conv,
            messages: [...(conv.messages || []), newMessage],
            lastMessage: newMessage,
            lastMessageAt: newMessage.createdAt,
          };
        });
      });
    };

    socket.onNewMessage(handleNewMessage);

    return () => {
      socket.off("new_message", handleNewMessage);
    };
  }, [socket, isConnected]);

  // SOCKET: Listen for removed messages
  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleRemovedMessage = (data) => {
      setConversations((prev) => {
        return prev.map((conv) => {
          // Remove the message from the conversation
          return {
            ...conv,
            messages:
              conv.messages?.filter((msg) => msg.id !== data.messageId) || [],
          };
        });
      });
    };

    socket.onRemovedMessage(handleRemovedMessage);

    return () => {
      socket.off("removed_message", handleRemovedMessage);
    };
  }, [socket, isConnected]);

  // LOAD MESSAGES: Fetch full conversation
  const loadConversationMessages = useCallback(
    async (conversationId) => {
      if (!conversationId) return;

      // Check if already loaded
      const conversation = conversations.find(
        (conv) => conv.id === conversationId
      );
      if (conversation?.messages?.length > 0) {
        // Already loaded, just set as current
        setCurrentConversationId(conversationId);
        return;
      }

      try {
        // Backend returns messages
        const res = await axiosInstance.get(`/messages/${conversationId}`);
        const messages = res?.data || [];

        // Update conversation with loaded messages
        setConversations((prev) => {
          return prev.map((conv) => {
            if (conv.id === conversationId) {
              return {
                ...conv,
                messages: messages,
              };
            }
            return conv;
          });
        });

        setCurrentConversationId(conversationId);
      } catch (error) {
        console.error("Error loading conversation messages:", error);
        toast.error("Failed to load messages");
      }
    },
    [conversations]
  );

  // CREATE CONVERSATION
  const createConversation = useCallback(
    (
      { title = "", type = "DIRECT", profileUrl = "", allMemberIds } = {},
      callback
    ) => {
      if (socket) {
        socket.createConversation(
          { title, type, profileUrl, allMemberIds },
          callback
        );
      }
    },
    [socket]
  );

  // SEND MESSAGE
  const sendMessage = useCallback(
    ({ type = "TEXT", content, conversationId }) => {
      const targetConversationId = conversationId || currentConversationId;

      if (socket && targetConversationId) {
        socket.sendMessage(
          {
            type,
            content,
            conversationId: targetConversationId,
          },
          (res) => {
            if (res?.error) {
              toast.error(
                res?.error || "Failed to send message. Please try again."
              );
            }
          }
        );
      }
    },
    [socket, currentConversationId]
  );

  // DELETE MESSAGE
  const deleteMessage = useCallback(
    (messageId) => {
      if (socket) {
        socket.deleteMessage(messageId);
      }
    },
    [socket]
  );

  // HELPERS
  const getCurrentConversation = useCallback(() => {
    return conversations.find((conv) => conv.id === currentConversationId);
  }, [conversations, currentConversationId]);

  const getConversationsByType = useCallback(
    (type) => {
      return conversations.filter((conv) => conv.type === type);
    },
    [conversations]
  );

  const getGlobalConversation = useCallback(() => {
    return conversations.find((conv) => conv.type === "GLOBAL");
  }, [conversations]);

  // CONTEXT VALUE
  const value = {
    // State
    conversations,
    conversationsLoading,
    currentConversationId,

    // Actions
    loadConversationMessages,
    createConversation,
    sendMessage,
    deleteMessage,
    setCurrentConversationId,

    // Helpers
    getCurrentConversation,
    getConversationsByType,
    getGlobalConversation,
  };

  return (
    <MessagingContext.Provider value={value}>
      {children}
    </MessagingContext.Provider>
  );
};

export default MessagingContext;
