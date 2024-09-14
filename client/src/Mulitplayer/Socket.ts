import io from "socket.io-client"

const socket = io('http://localhost:5009')
socket.connect();

export default socket