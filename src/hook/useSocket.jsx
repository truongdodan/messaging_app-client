import { useContext } from "react"
import SocketContext from "../context/SocketProvider";

const useSocket = () => useContext(SocketContext);

export default useSocket;