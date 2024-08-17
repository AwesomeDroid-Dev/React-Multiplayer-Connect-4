import { Link } from "react-router-dom"

function MultiplayerGame() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="text-3xl font-bold text-gray-800">Coming Soon</div>
      <div className="mt-4">
        <Link
          to="/"
          className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
        >
          Back
        </Link>
      </div>
    </div>
  )
}

export default MultiplayerGame