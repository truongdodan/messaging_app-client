import { useContext } from "react"
import ChatContext from "../context/ChatProvider";

const useChat = () => useContext(ChatContext);

export default useChat;