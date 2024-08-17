import { useState } from "react";

function LeaveBtn() {
    const [showWarning, setShowWarning] = useState(false);
    const [opacity, setOpacity] = useState(false);

    const handleClick = () => {
        setOpacity(false)
        setShowWarning(true)
        setTimeout(() => setOpacity(true), 1)
    }
    return (
        <>
        {showWarning && <>
        <div className={`flex flex-col absolute h-screen w-screen z-50 items-center justify-center opacity-${opacity ? '70' : '0'} bg-black transition-opacity duration-200`} />
        <div className={`flex flex-col absolute h-screen w-screen z-50 items-center justify-center opacity-${opacity ? '100' : '0'} transition-opacity duration-200`}>
            <div className="h-[30%] w-[90%] md:w-[500px] p-10 flex flex-col items-center justify-center bg-slate-100 rounded-md">
                <div className="text-3xl font-bold text-gray-900">Are you sure you want to leave the game?</div>
                <div className="mt-4">
                    <button className="px-4 py-2 mx-1 text-gray-50 bg-red-600 rounded-lg hover:bg-red-700 transition-colors duration-200" onClick={() => window.location.href = '/'}>Leave</button>
                    <button className="px-4 py-2 mx-2 text-gray-50 bg-gray-700 rounded-lg hover:bg-gray-800 transition-colors duration-200" onClick={() => setShowWarning(false)}>Cancel</button>
                </div>
            </div>
        </div>
        </>
         }
        <div className="fixed top-2 left-0 text-sm inline-block m-1 items-center">
            <button className="bg-transparent m-1 font-semibold float-left text-sm px-2 py-[01] rounded-md text-gray-800 hover:bg-transparent ml-3" onClick={handleClick}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
            </button>
        </div>
        </>
    )
}

export default LeaveBtn