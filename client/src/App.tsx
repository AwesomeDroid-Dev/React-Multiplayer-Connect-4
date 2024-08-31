import { Button } from "antd";
import { Link } from "react-router-dom";

function App() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-800 via-gray-600 to-gray-900">
      <div className="bg-white w-[80vw] max-w-md p-8 rounded-lg shadow-lg">
        <h1 className="text-5xl font-extrabold text-center text-gray-800 mb-8">Connect 4</h1>
        <div className="flex flex-col space-y-3">
          <Link to={'local-game'}>
            <Button
              type="primary"
              block
              size="large"
              style={{
                backgroundColor: "#1d4ed8",
                borderColor: "#1d4ed8",
                color: "white",
                transition: "background-color 0.3s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#2563eb";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#1d4ed8";
              }}
            >
              Local Game
            </Button>
          </Link>
          <Link to={'multiplayer-game'}>
            <Button
              type="primary"
              block
              size="large"
              style={{
                backgroundColor: "#059669",
                borderColor: "#059669",
                color: "white",
                transition: "background-color 0.3s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#10b981";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#059669";
              }}
            >
              Multiplayer Game
            </Button>
          </Link>
          <Link to={'tournament-game'}>
            <Button
              type="primary"
              block
              size="large"
              style={{
                backgroundColor: "#dc2626",
                borderColor: "#dc2626",
                color: "white",
                transition: "background-color 0.3s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#ef4444";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#dc2626";
              }}
            >
              Tournament Game
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default App;
