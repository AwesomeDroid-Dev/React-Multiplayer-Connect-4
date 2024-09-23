import { Button } from "antd";
import { Fragment } from "react";

interface TournamentDisplayProps {
  tree: any;
  handleReady: () => void;
}

function TournamentDisplay({ tree, handleReady }: TournamentDisplayProps): JSX.Element {
    console.log(tree)
  return (
    <div className="flex justify-center items-center w-screen h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-gray-900">
      <div className="relative z-10 bg-gray-700 bg-opacity-60 backdrop-blur p-8 rounded-lg shadow-lg flex flex-col items-center">
        <h1 className="text-3xl font-bold text-center text-white pb-5">Tournament</h1>
        <div className="flex flex-col-reverse gap-2 items-center">
          {tree.map((layer: any, layerIndex: number) => (
            <div key={layerIndex} className="flex flex-row" style={{ gap: `${layerIndex * 2}rem` }}>
              {layer.map((player: any, playerIndex: number) => (
                <Fragment key={playerIndex}>
                  <div
                    className={`p-1`}
                    style={{ backgroundColor: `${
                        player.status === 'ready' ? 'cyan' :
                        player.status === 'winner' ? 'green' :
                        player.status === 'loser' ? 'red' :
                        player.status === 'spectating' ? 'purple' :
                        'gray'}` }}
                  >
                    <div className="text-white bg-gray-900 p-1 text-center min-w-[100px]">
                      {typeof player.player === 'number' ? `Winner ${player.player}` : player.player}
                    </div>
                  </div>
                  {(layer.length === 2 && playerIndex % 2 === 0) ||
                  (playerIndex < layer.length - 1 && playerIndex % 2 === 0) ? (
                    <div className="text-white p-2 min-w-[20px]">Vs.</div>
                  ) : (
                    playerIndex < layer.length - 1 && <div className="text-white p-2 min-w-[20px]">&nbsp;</div>
                  )}
                </Fragment>
              ))}
            </div>
          ))}
        </div>
        <Button className="mt-8" type="primary" onClick={handleReady}>
          Ready
        </Button>
      </div>
    </div>
  );
}

export default TournamentDisplay;