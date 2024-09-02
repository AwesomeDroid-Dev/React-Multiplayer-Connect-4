import { MenuOutlined } from "@ant-design/icons";
import { Button, Dropdown, MenuProps, Modal } from "antd";
import { useState } from "react";

function AccountBtn() {
    const [showLeave, setShowLeave] = useState(false);
    const [showLogout, setShowLogout] = useState(false);

    const handleLeave = () => {
        setShowLeave(true)
    }

    const handleLogout = () => {
        localStorage.setItem('username', '')
        window.location.reload()
    }

    const items: MenuProps['items'] = [

        {
          label: <a onClick={handleLeave}>Leave Game</a>,
          danger: true,
          key: '3',
        },
        {
          label: <a onClick={() => setShowLogout(true)}>Logout of {localStorage.getItem('username')}</a>,
          danger: true,
          key: '4',
        },
      ];      

    return (
        <>
        <Modal
        title="You are returning to hub!"
        centered
        open={showLeave}
        onCancel={() => setShowLeave(false)}
        footer={( _, { CancelBtn }) => (
            <>
              <CancelBtn />
              <Button danger onClick={() => window.location.href = '/'}>Leave</Button>
            </>
        )}
        >
        <p>This will go back to hub and end any games in progress!</p>
      </Modal>
      <Modal
        title="You are returning to loggin out!"
        centered
        open={showLogout}
        onCancel={() => setShowLogout(false)}
        footer={( _, { CancelBtn }) => (
            <>
              <CancelBtn />
              <Button danger onClick={handleLogout}>Sign Out</Button>
            </>
        )}
        >
        <p>This will log you out and end any games in progress!</p>
      </Modal>
        <div className="fixed top-2 left-2 text-sm inline-block m-1 items-center z-50">
        <Dropdown menu={{ items }} trigger={['click']}>
            <Button type="primary" className="py-4 px-2 text-2xl !bg-opacity-0 !bg-gray-600 hover:!bg-opacity-60" onClick={(e) => e.preventDefault()}>
                <MenuOutlined />
            </Button>
        </Dropdown>
        </div>
        </>
    )
}

export default AccountBtn