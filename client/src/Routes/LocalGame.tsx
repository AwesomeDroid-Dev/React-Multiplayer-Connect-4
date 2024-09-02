import Game from '../Game/Game';
import LeaveBtn from '../Utils/LeaveBtn';

function LocalGame() {

  return (
    <>
    <LeaveBtn />
    <Game multiplayer={false} />
    </>
  );
}

export default LocalGame
