import { Button, Modal } from "antd";
import { useState } from "react";

function LeaveBtn() {
    const [showWarning, setShowWarning] = useState(false);

    const handleClick = () => {
        setShowWarning(true)
    }
    return (
        <>
        <Modal
        title="You are returning to hub!"
        centered
        open={showWarning}
        onCancel={() => setShowWarning(false)}
        footer={( _, { CancelBtn }) => (
            <>
              <CancelBtn />
              <Button onClick={() => window.location.href = '/'} className="bg-red-600">Leave</Button>
            </>
        )}
        >
        <p>This will go back to hub and end any games in progress!</p>
      </Modal>
        <div className="fixed top-2 left-0 text-sm inline-block m-1 items-center z-50">
            <button className="bg-transparent m-1 font-semibold float-left text-sm px-2 py-[01] rounded-md text-gray-500 hover:bg-transparent ml-3" onClick={handleClick}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
            </button>
        </div>
        </>
    )
}

export default LeaveBtn