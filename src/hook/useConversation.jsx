import { useContext } from "react"
import ConversationContext from "../context/ConversationProvider";

const useConversation = () => useContext(ConversationContext);

export default useConversation;