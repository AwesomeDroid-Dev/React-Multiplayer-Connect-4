import { Button } from "antd"
import { Fragment } from "react/jsx-runtime"

function TournamentDisplay(tree: any) {
    console.log(tree);
    return (
        <div className="flex justify-center items-center w-screen h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-gray-900">
            <div className='relative z-10 bg-gray-700 bg-opacity-60 backdrop-blur p-8 rounded-lg shadow-lg flex flex-col items-center'>
                <h1 className='text-3xl font-bold text-center text-white pb-5'>Organize Tournament</h1>
                <div className='flex flex-col-reverse gap-2 items-center'>
                    {
                    tree.tree.map((layer: any, index: number) => (
                        <div className='flex flex-row' style={{gap: `${index*2}rem`}}>
                        {layer.map((player: any, index: number) => (
                            <Fragment key={player+index}>
                            <div className="p-1 bg-gray-700" id={player}>
                                <div className='text-white bg-gray-900 p-1 min-w-[100px]' id={layer[index]}>{player.player}</div>
                            </div>
                            { layer.length === 2 && index % 2 === 0 ||( index < layer.length - 1 && index % 2 === 0 ) ?
                            <div className='text-white p-2 min-w-[20px]'>
                                Vs.
                            </div>
                            :
                            index < layer.length - 1 &&
                            <div className='text-white p-2 min-w-[20px]'>
                                &nbsp;
                            </div>
                            }
                            </Fragment>
                        ))}
                        </div>
                    ))}
                </div>
                <Button className='mt-8' type="primary" onClick={() => console.log('Ready')}>Ready</Button>
            </div>
        </div>
    )
}

export default TournamentDisplay