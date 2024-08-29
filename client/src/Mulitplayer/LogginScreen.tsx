import { useState } from "react"

function LogginScreen({socket, setUsername}: any) {
    const [id, setId] = useState('')

    const join = () => {
        console.log(id)
        socket.emit('login', {username: id})
        localStorage.setItem('username', id)
        localStorage.setItem('loggedIn', `true`)
    }

    socket.on('login', (data: any) => {
        if (data.status === 'success') {
            localStorage.setItem('username', id)
            setUsername(id)
            localStorage.setItem('loggedIn', `true`)
        } else {
            alert(data.message)
        }
    })

    return (
        <>
            <div className="h-screen w-screen flex flex-col items-center justify-center gap-2">
                <div className="">Choose a username:</div>
                <div className="flex flex-row gap-1">
                    <input value={id} onChange={(e) => setId(e.target.value)} type="text" className="bg-slate-700 hover:bg-slate-900 text-white py-2 px-4 rounded" />
                    <button onClick={join} className="bg-slate-700 hover:bg-slate-900 text-white font-bold py-2 px-4 rounded">Join</button>
                </div>
            </div>
        </>
    )
}

export default LogginScreen