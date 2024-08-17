import { Link } from "react-router-dom"

function App() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-slate-500 to-slate-700">
      <div className="w-[70vw] h-[80vh] bg-slate-200 rounded-md shadow-md p-4 md:p-8">
        <h1 className="text-4xl font-bold text-center mb-4">Connect 4</h1>
        <div className="flex flex-col gap-4">
          <Link to={'local-game'} className="bg-slate-500 hover:bg-slate-600 py-2 px-4 rounded-md text-white font-bold transition duration-300">Local Game</Link>
          <Link to={'multiplayer-game'} className="bg-slate-500 hover:bg-slate-600 py-2 px-4 rounded-md text-white font-bold transition duration-300">Multiplayer Game</Link>
          <Link to={'tournament-game'} className="bg-slate-500 hover:bg-slate-600 py-2 px-4 rounded-md text-white font-bold transition duration-300">Tournament Game</Link>
        </div>
      </div>
    x</div>
  )
}
export default App
