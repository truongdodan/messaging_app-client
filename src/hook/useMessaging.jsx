import { useContext } from "react";
import MessagingContext from "../context/MessagingProvider";

const useMessaging = () => useContext(MessagingContext);

export default useMessaging;