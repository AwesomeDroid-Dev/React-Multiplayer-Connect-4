import { Button, Input } from "antd"
import { useState } from "react"

function LogginScreen({socket, setUsername, error}: any) {
    const [id, setId] = useState('')

    const join = () => {
        console.log(id)
        socket.emit('login', {username: id})
        setUsername(id)
        localStorage.setItem('username', id)
        localStorage.setItem('loggedIn', `true`)
    }

    return (
        <div className="h-screen w-screen flex flex-col items-center gap-2 bg-gray-800">
            <div className="h-full flex flex-col justify-center gap-2">
                <div className="text-white md:text-3xl">Choose a username:</div>
                <div className="flex flex-row gap-1">
                    <Input placeholder="Username" value={id} onChange={(e) => setId(e.target.value)} type="text" className="w-48 h-10 md:w-96 md:h-20 md:text-3xl" />
                    <Button onClick={join} className="w-20 h-10 md:w-40 md:h-20 md:text-3xl font-semibold">Join</Button>
                </div>
            </div>
            <div className="absolute bottom-1/4 md:text-3xl text-red-500">
            {error}
            </div>
        </div>
    )
}

export default LogginScreen