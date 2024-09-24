import io from "socket.io-client"

console.log("Server URL:", import.meta.env.VITE_SERVER_URL);

const socket = io(import.meta.env.VITE_SERVER_URL || 'http://localhost:3001')
socket.connect();

export default socket