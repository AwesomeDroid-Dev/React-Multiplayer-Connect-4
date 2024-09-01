import { Button } from "antd";
import { Link } from "react-router-dom";
import { TrophyOutlined, UserOutlined, GlobalOutlined } from '@ant-design/icons';

function App() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-gray-900 flex flex-col items-center justify-center text-white">
      
      {/* Background Image */}
      <div className="absolute inset-0 bg-cover bg-center opacity-40" style={{ backgroundImage: "url('/path-to-your-image.jpg')" }}></div>

      {/* Hero Section */}
      <div className="relative z-10 text-center p-8 max-w-lg mx-auto">
        <h1 className="text-6xl font-bold mb-4">Connect 4</h1>
        <p className="text-lg text-gray-200 mb-8">Choose your game mode and start playing!</p>
      </div>

      {/* Game Mode Cards */}
      <div className="relative z-10 grid grid-cols-1 gap-6 max-w-md w-full mx-auto">
        <Link to={'local-game'}>
          <div className="p-6 bg-blue-500 hover:!bg-blue-600 text-white rounded-xl shadow-lg transform hover:scale-105 transition-all flex items-center justify-between">
            <UserOutlined className="text-2xl" />
            <span className="ml-4 text-xl">Local Game</span>
            <Button className="ml-auto" type="primary">Play</Button>
          </div>
        </Link>
        <Link to={'multiplayer-game'}>
          <div className="p-6 bg-green-500 hover:!bg-green-600 text-white rounded-xl shadow-lg transform hover:scale-105 transition-all flex items-center justify-between">
            <GlobalOutlined className="text-2xl" />
            <span className="ml-4 text-xl">Multiplayer Game</span>
            <Button className="ml-auto" type="primary">Play</Button>
          </div>
        </Link>
        <Link to={'tournament-game'}>
          <div className="p-6 bg-red-500 hover:!bg-red-600 text-white rounded-xl shadow-lg transform hover:scale-105 transition-all flex items-center justify-between">
            <TrophyOutlined className="text-2xl" />
            <span className="ml-4 text-xl">Tournament Game</span>
            <Button className="ml-auto" type="primary">Play</Button>
          </div>
        </Link>
      </div>

      {/* Footer */}
      <div className="relative z-10 mt-12 text-center">
      </div>
      
    </div>
  );
}

export default App;
