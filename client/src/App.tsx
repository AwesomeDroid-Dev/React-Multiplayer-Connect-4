import { Link } from "react-router-dom"

function App() {
  return (
    <div className="items-center h-screen flex flex-col justify-center ">
        <div className="w-[70vw] h-[80vh] text-center items-center flex flex-col rounded-md bg-slate-200">
            <h1 className="m-[2%]">Connect 4</h1>
            <div className="bg-slate-400 rounded-md w-[90%] flex flex-col gap-2 p-2 text-gray-200">
                <Link to={'local-game'} className="bg-slate-500 rounded-md hover:bg-slate-600">Local Game</Link>
                <Link to={'multiplayer-game'} className="bg-slate-500 rounded-md hover:bg-slate-600">Multiplayer Game</Link>
                <Link to={'tournament-game'} className="bg-slate-500 rounded-md hover:bg-slate-600">Tournament Game</Link>
            </div>
        </div>
    </div>
  )
}

export default App